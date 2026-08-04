from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import MissionProgress, WeeklyMission
from app.schemas.common import MissionProgressUpdate, Page, WeeklyMissionRead

router = APIRouter()
logger = get_logger(__name__)


@router.get("/weekly", response_model=Page[WeeklyMissionRead])
async def list_weekly_missions(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Page[WeeklyMissionRead]:
    rows = (
        await session.execute(
            select(WeeklyMission)
            .where(WeeklyMission.user_id == current_user.id, WeeklyMission.deleted_at.is_(None))
            .order_by(WeeklyMission.week_start.desc())
            .limit(limit)
            .offset(offset)
        )
    ).scalars().all()
    return Page(items=[WeeklyMissionRead.model_validate(row) for row in rows], total=len(rows), limit=limit, offset=offset)


@router.put("/{mission_id}/progress", response_model=WeeklyMissionRead)
async def update_mission_progress(
    mission_id: UUID,
    payload: MissionProgressUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> WeeklyMissionRead:
    mission = (
        await session.execute(
            select(WeeklyMission).where(WeeklyMission.id == mission_id, WeeklyMission.user_id == current_user.id, WeeklyMission.deleted_at.is_(None))
        )
    ).scalar_one()
    session.add(MissionProgress(mission_id=mission.id, **payload.model_dump()))
    mission.status = "completed" if payload.percent_complete >= 100 else "in_progress"
    await session.flush()
    await session.refresh(mission)
    logger.info("mission_progress_updated", user_id=str(current_user.id), mission_id=str(mission.id), percent=payload.percent_complete)
    return WeeklyMissionRead.model_validate(mission)
