from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.models.entities import Roadmap
from app.repositories.base import BaseRepository


class RoadmapRepository(BaseRepository[Roadmap]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(Roadmap, session)

    async def get_active_user_roadmap(self, user_id: UUID) -> Roadmap | None:
        return (
            await self.session.execute(
                select(Roadmap)
                .where(Roadmap.user_id == user_id, Roadmap.status == "active", Roadmap.deleted_at.is_(None))
                .order_by(Roadmap.created_at.desc())
                .limit(1)
            )
        ).scalar_one_or_none()

    async def list_user_roadmaps(self, user_id: UUID) -> list[Roadmap]:
        rows = (
            await self.session.execute(
                select(Roadmap)
                .where(Roadmap.user_id == user_id, Roadmap.deleted_at.is_(None))
                .order_by(Roadmap.created_at.desc())
            )
        ).scalars().all()
        return list(rows)

    async def update_progress(self, user_id: UUID, roadmap_id: UUID, progress_percent: float) -> Roadmap:
        roadmap = (
            await self.session.execute(
                select(Roadmap).where(Roadmap.id == roadmap_id, Roadmap.user_id == user_id, Roadmap.deleted_at.is_(None))
            )
        ).scalar_one_or_none()
        if not roadmap:
            raise AppError("Roadmap not found", 404, "roadmap_not_found")
        
        milestones = list(roadmap.milestones or [])
        if milestones and isinstance(milestones[0], dict):
            milestones[0]["progress_percent"] = progress_percent
            roadmap.milestones = milestones
        
        if progress_percent >= 100.0:
            roadmap.status = "completed"
            
        await self.session.flush()
        await self.session.refresh(roadmap)
        return roadmap
