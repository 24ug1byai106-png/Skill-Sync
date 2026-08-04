from typing import Any
from uuid import UUID

import httpx
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import get_settings
from app.core.exceptions import AppError, UnauthorizedError
from app.core.logging import get_logger
from app.core.security import Role
from app.models.entities import Profile, Settings, User
from app.schemas.auth import AuthTokens, LoginRequest, SignupRequest

logger = get_logger(__name__)


class SupabaseAuthService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.settings = get_settings()

    @property
    def _headers(self) -> dict[str, str]:
        return {"apikey": self.settings.supabase_key, "Content-Type": "application/json"}

    async def signup(self, payload: SignupRequest) -> tuple[User, AuthTokens]:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{self.settings.supabase_url}/auth/v1/signup",
                headers=self._headers,
                json={
                    "email": str(payload.email),
                    "password": payload.password,
                    "data": {"full_name": payload.full_name, "role": Role.student.value},
                },
            )
        data = self._handle_auth_response(response)
        supabase_user = data.get("user") or {}
        user = await self.upsert_local_user(
            email=str(payload.email),
            supabase_user_id=UUID(supabase_user["id"]),
            role=Role.student.value,
            full_name=payload.full_name,
        )
        return user, self._tokens_from_response(data)

    async def login(self, payload: LoginRequest) -> tuple[User, AuthTokens]:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{self.settings.supabase_url}/auth/v1/token?grant_type=password",
                headers=self._headers,
                json={"email": str(payload.email), "password": payload.password},
            )
        data = self._handle_auth_response(response)
        supabase_user = data.get("user") or {}
        metadata = supabase_user.get("app_metadata") or supabase_user.get("user_metadata") or {}
        user = await self.upsert_local_user(
            email=str(payload.email),
            supabase_user_id=UUID(supabase_user["id"]),
            role=metadata.get("role", Role.student.value),
            full_name=metadata.get("full_name") or str(payload.email).split("@")[0],
        )
        return user, self._tokens_from_response(data)

    async def refresh(self, refresh_token: str) -> AuthTokens:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                f"{self.settings.supabase_url}/auth/v1/token?grant_type=refresh_token",
                headers=self._headers,
                json={"refresh_token": refresh_token},
            )
        return self._tokens_from_response(self._handle_auth_response(response))

    async def logout(self, access_token: str) -> None:
        headers = {**self._headers, "Authorization": f"Bearer {access_token}"}
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(f"{self.settings.supabase_url}/auth/v1/logout", headers=headers)
        if response.status_code >= 400:
            raise UnauthorizedError("Unable to logout token")

    async def upsert_local_user(self, email: str, supabase_user_id: UUID, role: str, full_name: str) -> User:
        result = await self.session.execute(select(User).where(User.supabase_user_id == supabase_user_id))
        user = result.scalar_one_or_none()
        if user is None:
            user = User(email=email, supabase_user_id=supabase_user_id, role=role)
            self.session.add(user)
            await self.session.flush()
            self.session.add(Profile(user_id=user.id, full_name=full_name))
            self.session.add(Settings(user_id=user.id))
        else:
            user.email = email
            user.role = role
            user.is_active = True
        await self.session.flush()
        await self.session.refresh(user)
        logger.info("local_user_synced", user_id=str(user.id), role=user.role)
        return user

    def _handle_auth_response(self, response: httpx.Response) -> dict[str, Any]:
        if response.status_code >= 400:
            logger.warning("supabase_auth_failed", status=response.status_code, body=response.text[:500])
            raise AppError("Authentication provider rejected the request", response.status_code, "auth_provider_error")
        return response.json()

    def _tokens_from_response(self, data: dict[str, Any]) -> AuthTokens:
        return AuthTokens(
            access_token=data["access_token"],
            refresh_token=data.get("refresh_token", ""),
            expires_in=data.get("expires_in"),
        )
