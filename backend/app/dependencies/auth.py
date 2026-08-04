from dataclasses import dataclass
from uuid import UUID

from fastapi import Depends
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import ForbiddenError, UnauthorizedError
from app.core.security import Role, decode_supabase_jwt, role_from_claims, user_id_from_claims
from app.database.session import get_db_session
from app.models.entities import User

bearer_scheme = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class CurrentUser:
    id: UUID
    supabase_user_id: UUID
    email: str
    role: Role


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_db_session),
) -> CurrentUser:
    claims = decode_supabase_jwt(credentials)
    supabase_user_id = user_id_from_claims(claims)
    result = await session.execute(select(User).where(User.supabase_user_id == supabase_user_id, User.deleted_at.is_(None)))
    user = result.scalar_one_or_none()
    if user is None or not user.is_active:
        raise UnauthorizedError("User account is not active")
    role = Role.admin if user.role == Role.admin.value else role_from_claims(claims)
    return CurrentUser(id=user.id, supabase_user_id=user.supabase_user_id, email=user.email, role=role)


async def require_admin(current_user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if current_user.role != Role.admin:
        raise ForbiddenError()
    return current_user
