from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.models.entities import ProjectRecommendation
from app.repositories.base import BaseRepository


class ProjectRecommendationRepository(BaseRepository[ProjectRecommendation]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(ProjectRecommendation, session)

    async def list_by_user(self, user_id: UUID) -> list[ProjectRecommendation]:
        rows = (
            await self.session.execute(
                select(ProjectRecommendation)
                .where(ProjectRecommendation.user_id == user_id, ProjectRecommendation.deleted_at.is_(None))
                .order_by(ProjectRecommendation.rank.asc())
            )
        ).scalars().all()
        return list(rows)

    async def get_by_id_and_user(self, user_id: UUID, recommendation_id: UUID) -> ProjectRecommendation:
        recommendation = (
            await self.session.execute(
                select(ProjectRecommendation).where(
                    ProjectRecommendation.id == recommendation_id,
                    ProjectRecommendation.user_id == user_id,
                    ProjectRecommendation.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if not recommendation:
            raise AppError("Project recommendation not found", 404, "project_recommendation_not_found")
        return recommendation
