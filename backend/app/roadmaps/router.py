from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.roadmaps.generator import RoadmapGenerator
from app.roadmaps.schemas import RoadmapProgressUpdate, RoadmapRead

router = APIRouter()


@router.post("/generate", response_model=RoadmapRead)
async def generate_roadmap(
    available_hours_per_week: int = Query(default=8, ge=1, le=80),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> RoadmapRead:
    roadmap = await RoadmapGenerator(session).generate(current_user.id, available_hours_per_week)
    return RoadmapRead.model_validate(roadmap)


@router.get("/current", response_model=RoadmapRead)
async def get_current_roadmap(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> RoadmapRead:
    roadmap = await RoadmapGenerator(session).get_current(current_user.id)
    if not roadmap:
        raise AppError("No active roadmap found for user", 404, "roadmap_not_found")
    return RoadmapRead.model_validate(roadmap)


@router.get("/history", response_model=list[RoadmapRead])
async def list_roadmaps(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[RoadmapRead]:
    roadmaps = await RoadmapGenerator(session).list_all(current_user.id)
    return [RoadmapRead.model_validate(item) for item in roadmaps]


@router.patch("/{roadmap_id}/progress", response_model=RoadmapRead)
async def update_roadmap_progress(
    roadmap_id: UUID,
    payload: RoadmapProgressUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> RoadmapRead:
    roadmap = await RoadmapGenerator(session).update_progress(current_user.id, roadmap_id, payload.progress_percent)
    return RoadmapRead.model_validate(roadmap)

