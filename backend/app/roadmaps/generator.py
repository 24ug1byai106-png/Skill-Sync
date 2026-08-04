from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.career.engines import CareerEngine
from app.models.entities import Roadmap
from app.roadmaps.repository import RoadmapRepository


class RoadmapGenerator:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = RoadmapRepository(session)

    async def generate(self, user_id: UUID, available_hours_per_week: int = 8) -> Roadmap:
        return await CareerEngine(self.session).generate_roadmap(user_id, available_hours_per_week)

    async def get_current(self, user_id: UUID) -> Roadmap | None:
        return await self.repo.get_active_user_roadmap(user_id)

    async def list_all(self, user_id: UUID) -> list[Roadmap]:
        return await self.repo.list_user_roadmaps(user_id)

    async def update_progress(self, user_id: UUID, roadmap_id: UUID, progress_percent: float) -> Roadmap:
        return await self.repo.update_progress(user_id, roadmap_id, progress_percent)

