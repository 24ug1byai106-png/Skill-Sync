from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.admin.schemas import AdminUserRead, AdminUserRoleUpdate
from app.admin.service import AdminService
from app.core.exceptions import AppError
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.common import MessageResponse, Page

router = APIRouter()


def require_admin(current_user: CurrentUser) -> None:
    if current_user.role != "admin":
        raise AppError("Admin access required", 403, "admin_access_denied")


@router.get("/users", response_model=Page[AdminUserRead])
async def list_users(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Page[AdminUserRead]:
    require_admin(current_user)
    users, total = await AdminService(session).list_users(limit, offset)
    return Page(items=[AdminUserRead.model_validate(u) for u in users], total=total, limit=limit, offset=offset)


@router.patch("/users/{user_id}/role", response_model=AdminUserRead)
async def update_user_role(
    user_id: UUID,
    payload: AdminUserRoleUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AdminUserRead:
    require_admin(current_user)
    user = await AdminService(session).update_user_role(user_id, payload.role, payload.is_active)
    return AdminUserRead.model_validate(user)


@router.get("/career-goals")
async def list_career_goals(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[dict]:
    require_admin(current_user)
    goals = await AdminService(session).list_career_goals()
    return [{"id": g.id, "user_id": g.user_id, "title": g.title, "target_role": g.target_role} for g in goals]


@router.get("/certificates")
async def list_certificates(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[dict]:
    require_admin(current_user)
    certs = await AdminService(session).list_certificates()
    return [{"id": c.id, "user_id": c.user_id, "title": c.title, "issuer": c.issuer} for c in certs]


@router.get("/missions")
async def list_weekly_missions(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[dict]:
    require_admin(current_user)
    missions = await AdminService(session).list_weekly_missions()
    return [{"id": m.id, "user_id": m.user_id, "title": m.title, "status": m.status} for m in missions]
