from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import Roadmap
from app.schemas.common import Page, RoadmapRead

router = APIRouter()


@router.get("", response_model=Page[RoadmapRead])
async def list_roadmaps(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Page[RoadmapRead]:
    rows = (
        await session.execute(
            select(Roadmap)
            .where(Roadmap.user_id == current_user.id, Roadmap.deleted_at.is_(None))
            .order_by(Roadmap.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
    ).scalars().all()
    return Page(items=[RoadmapRead.model_validate(row) for row in rows], total=len(rows), limit=limit, offset=offset)


@router.get("/{roadmap_id}", response_model=RoadmapRead)
async def get_roadmap(
    roadmap_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> RoadmapRead:
    roadmap = (
        await session.execute(select(Roadmap).where(Roadmap.id == roadmap_id, Roadmap.user_id == current_user.id, Roadmap.deleted_at.is_(None)))
    ).scalar_one()
    return RoadmapRead.model_validate(roadmap)
