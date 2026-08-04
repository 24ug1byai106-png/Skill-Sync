from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.missions.schemas import MissionStatusUpdate, WeeklyMissionRead
from app.missions.service import WeeklyMissionService

router = APIRouter()


@router.post("/generate", response_model=list[WeeklyMissionRead])
async def generate_weekly_missions(
    count: int = Query(default=5, ge=1, le=12),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[WeeklyMissionRead]:
    missions = await WeeklyMissionService(session).generate(current_user.id, count)
    return [WeeklyMissionRead.model_validate(mission) for mission in missions]


@router.get("", response_model=list[WeeklyMissionRead])
async def list_weekly_missions(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[WeeklyMissionRead]:
    missions = await WeeklyMissionService(session).list_all(current_user.id)
    return [WeeklyMissionRead.model_validate(mission) for mission in missions]


@router.get("/{mission_id}", response_model=WeeklyMissionRead)
async def get_weekly_mission(
    mission_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> WeeklyMissionRead:
    mission = await WeeklyMissionService(session).get_by_id(current_user.id, mission_id)
    return WeeklyMissionRead.model_validate(mission)


@router.patch("/{mission_id}/status", response_model=WeeklyMissionRead)
async def update_mission_status(
    mission_id: UUID,
    payload: MissionStatusUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> WeeklyMissionRead:
    mission = await WeeklyMissionService(session).update_status(
        user_id=current_user.id,
        mission_id=mission_id,
        status=payload.status,
        evidence=payload.evidence,
        notes=payload.notes,
    )
    return WeeklyMissionRead.model_validate(mission)

