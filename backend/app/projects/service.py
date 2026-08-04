from uuid import UUID

from sqlalchemy.ext.asyncio import AsyncSession

from app.career.engines import CareerEngine
from app.models.entities import ProjectRecommendation
from app.projects.repository import ProjectRecommendationRepository


class ProjectRecommendationEngine:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = ProjectRecommendationRepository(session)

    async def generate(self, user_id: UUID) -> list[ProjectRecommendation]:
        return await CareerEngine(self.session).recommend_projects(user_id)

    async def list_by_user(self, user_id: UUID) -> list[ProjectRecommendation]:
        return await self.repo.list_by_user(user_id)

    async def get_by_id(self, user_id: UUID, recommendation_id: UUID) -> ProjectRecommendation:
        return await self.repo.get_by_id_and_user(user_id, recommendation_id)

