from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.models.entities import CareerGoal, Certificate, User, WeeklyMission


class AdminService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def list_users(self, limit: int = 50, offset: int = 0) -> tuple[list[User], int]:
        total = (await self.session.execute(select(User).where(User.deleted_at.is_(None)))).scalars().all()
        rows = (
            await self.session.execute(
                select(User).where(User.deleted_at.is_(None)).order_by(User.created_at.desc()).limit(limit).offset(offset)
            )
        ).scalars().all()
        return list(rows), len(total)

    async def update_user_role(self, user_id: UUID, role: str, is_active: bool | None = None) -> User:
        user = (
            await self.session.execute(select(User).where(User.id == user_id, User.deleted_at.is_(None)))
        ).scalar_one_or_none()
        if not user:
            raise AppError("User not found", 404, "user_not_found")
        user.role = role
        if is_active is not None:
            user.is_active = is_active
        await self.session.flush()
        await self.session.refresh(user)
        return user

    async def list_career_goals(self, limit: int = 50) -> list[CareerGoal]:
        rows = (
            await self.session.execute(
                select(CareerGoal).where(CareerGoal.deleted_at.is_(None)).order_by(CareerGoal.created_at.desc()).limit(limit)
            )
        ).scalars().all()
        return list(rows)

    async def list_certificates(self, limit: int = 50) -> list[Certificate]:
        rows = (
            await self.session.execute(
                select(Certificate).where(Certificate.deleted_at.is_(None)).order_by(Certificate.created_at.desc()).limit(limit)
            )
        ).scalars().all()
        return list(rows)

    async def list_weekly_missions(self, limit: int = 50) -> list[WeeklyMission]:
        rows = (
            await self.session.execute(
                select(WeeklyMission).where(WeeklyMission.deleted_at.is_(None)).order_by(WeeklyMission.created_at.desc()).limit(limit)
            )
        ).scalars().all()
        return list(rows)
