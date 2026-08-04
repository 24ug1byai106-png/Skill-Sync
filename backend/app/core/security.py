from datetime import UTC, datetime, timedelta
from enum import StrEnum
from typing import Any
from uuid import UUID

import jwt
from fastapi.security import HTTPAuthorizationCredentials
from passlib.context import CryptContext

from app.config.settings import get_settings
from app.core.exceptions import UnauthorizedError


class Role(StrEnum):
    student = "student"
    admin = "admin"


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


def decode_supabase_jwt(credentials: HTTPAuthorizationCredentials | None) -> dict[str, Any]:
    if credentials is None or credentials.scheme.lower() != "bearer":
        raise UnauthorizedError()
    settings = get_settings()
    try:
        return jwt.decode(
            credentials.credentials,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
            options={"verify_aud": False},
        )
    except jwt.PyJWTError as exc:
        raise UnauthorizedError("Invalid or expired access token") from exc


def role_from_claims(claims: dict[str, Any]) -> Role:
    metadata = claims.get("app_metadata") or claims.get("user_metadata") or {}
    role = metadata.get("role", Role.student.value)
    return Role.admin if role == Role.admin.value else Role.student


def user_id_from_claims(claims: dict[str, Any]) -> UUID:
    sub = claims.get("sub")
    if not sub:
        raise UnauthorizedError("Token is missing subject")
    return UUID(str(sub))


def create_internal_token(user_id: UUID, role: Role) -> str:
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": str(user_id),
        "role": role.value,
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.access_token_expire_minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.supabase_jwt_secret, algorithm="HS256")
