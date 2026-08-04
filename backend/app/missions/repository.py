from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.models.entities import MissionProgress, WeeklyMission
from app.repositories.base import BaseRepository


class WeeklyMissionRepository(BaseRepository[WeeklyMission]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(WeeklyMission, session)

    async def list_by_user(self, user_id: UUID) -> list[WeeklyMission]:
        rows = (
            await self.session.execute(
                select(WeeklyMission)
                .where(WeeklyMission.user_id == user_id, WeeklyMission.deleted_at.is_(None))
                .order_by(WeeklyMission.week_start.desc())
            )
        ).scalars().all()
        return list(rows)

    async def get_by_id_and_user(self, user_id: UUID, mission_id: UUID) -> WeeklyMission:
        mission = (
            await self.session.execute(
                select(WeeklyMission).where(
                    WeeklyMission.id == mission_id,
                    WeeklyMission.user_id == user_id,
                    WeeklyMission.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if not mission:
            raise AppError("Mission not found", 404, "mission_not_found")
        return mission

    async def update_status(
        self,
        user_id: UUID,
        mission_id: UUID,
        status: str,
        evidence: dict[str, Any] | None = None,
        notes: str | None = None,
    ) -> WeeklyMission:
        mission = await self.get_by_id_and_user(user_id, mission_id)
        mission.status = status
        
        percent = 100.0 if status == "completed" else 50.0 if status == "in_progress" else 0.0
        progress = MissionProgress(
            mission_id=mission.id,
            percent_complete=percent,
            evidence=evidence or {},
            notes=notes,
        )
        self.session.add(progress)
        await self.session.flush()
        await self.session.refresh(mission)
        return mission
