from typing import Any
from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.career.engines import CareerEngine
from app.missions.repository import WeeklyMissionRepository
from app.models.entities import WeeklyMission


class WeeklyMissionService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = WeeklyMissionRepository(session)

    async def generate(self, user_id: UUID, count: int = 5) -> list[WeeklyMission]:
        return await CareerEngine(self.session).generate_weekly_missions(user_id, count)

    async def list_all(self, user_id: UUID) -> list[WeeklyMission]:
        return await self.repo.list_by_user(user_id)

    async def get_by_id(self, user_id: UUID, mission_id: UUID) -> WeeklyMission:
        return await self.repo.get_by_id_and_user(user_id, mission_id)

    async def update_status(
        self,
        user_id: UUID,
        mission_id: UUID,
        status: str,
        evidence: dict[str, Any] | None = None,
        notes: str | None = None,
    ) -> WeeklyMission:
        return await self.repo.update_status(user_id, mission_id, status, evidence, notes)

