from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import CareerGoal, CareerReadiness, LearningStreak, Notification, WeeklyMission
from app.schemas.common import CareerGoalRead, DashboardRead, WeeklyMissionRead

router = APIRouter()


@router.get("", response_model=DashboardRead)
async def dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> DashboardRead:
    readiness = (
        await session.execute(
            select(CareerReadiness)
            .where(CareerReadiness.user_id == current_user.id, CareerReadiness.deleted_at.is_(None))
            .order_by(CareerReadiness.created_at.desc())
            .limit(1)
        )
    ).scalar_one_or_none()
    active_goal = (
        await session.execute(
            select(CareerGoal).where(CareerGoal.user_id == current_user.id, CareerGoal.is_active.is_(True), CareerGoal.deleted_at.is_(None))
        )
    ).scalar_one_or_none()
    missions = (
        await session.execute(
            select(WeeklyMission)
            .where(WeeklyMission.user_id == current_user.id, WeeklyMission.status != "completed", WeeklyMission.deleted_at.is_(None))
            .order_by(WeeklyMission.week_start.asc())
            .limit(5)
        )
    ).scalars().all()
    unread = (
        await session.execute(
            select(func.count()).select_from(Notification).where(Notification.user_id == current_user.id, Notification.read_at.is_(None))
        )
    ).scalar_one()
    streak = (await session.execute(select(LearningStreak).where(LearningStreak.user_id == current_user.id))).scalar_one_or_none()
    return DashboardRead(
        career_readiness_score=readiness.overall_score if readiness else 0,
        resume_score=readiness.resume_score if readiness else 0,
        github_score=readiness.github_score if readiness else 0,
        active_goal=CareerGoalRead.model_validate(active_goal) if active_goal else None,
        active_missions=[WeeklyMissionRead.model_validate(mission) for mission in missions],
        notifications_unread=int(unread),
        streak_days=streak.current_count if streak else 0,
    )
