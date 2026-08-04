from datetime import date
from typing import Any

from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.langgraph.career_workflow import build_career_workflow
from app.models.entities import CareerDNA, CareerGoal, CareerReadiness, ProjectRecommendation, Roadmap, SkillGap, WeeklyMission
from app.schemas.common import CareerGoalCreate, CareerGoalRead, CareerSnapshot, Page

router = APIRouter()
logger = get_logger(__name__)


@router.post("/goals", response_model=CareerGoalRead, status_code=201)
async def create_goal(
    payload: CareerGoalCreate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CareerGoalRead:
    if payload.is_active:
        existing = await session.execute(select(CareerGoal).where(CareerGoal.user_id == current_user.id, CareerGoal.deleted_at.is_(None)))
        for goal in existing.scalars():
            goal.is_active = False
    goal = CareerGoal(user_id=current_user.id, **payload.model_dump())
    session.add(goal)
    await session.flush()
    await session.refresh(goal)
    logger.info("career_goal_created", user_id=str(current_user.id), goal_id=str(goal.id))
    return CareerGoalRead.model_validate(goal)


@router.get("/goals", response_model=Page[CareerGoalRead])
async def list_goals(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Page[CareerGoalRead]:
    base = select(CareerGoal).where(CareerGoal.user_id == current_user.id, CareerGoal.deleted_at.is_(None))
    rows = (await session.execute(base.order_by(CareerGoal.created_at.desc()).limit(limit).offset(offset))).scalars().all()
    return Page(items=[CareerGoalRead.model_validate(row) for row in rows], total=len(rows), limit=limit, offset=offset)


@router.post("/analyze", response_model=CareerSnapshot)
async def analyze_career(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CareerSnapshot:
    active_goal = (
        await session.execute(
            select(CareerGoal).where(CareerGoal.user_id == current_user.id, CareerGoal.is_active.is_(True), CareerGoal.deleted_at.is_(None))
        )
    ).scalar_one_or_none()
    workflow = build_career_workflow()
    result = await workflow.ainvoke({"inputs": {"user_id": str(current_user.id), "career_goal": active_goal.title if active_goal else None}})
    snapshot: dict[str, Any] = result["snapshot"]

    career_dna = CareerDNA(
        user_id=current_user.id,
        career_goal_id=active_goal.id if active_goal else None,
        strengths=snapshot.get("career_dna", {}).get("strengths", []),
        traits=snapshot.get("career_dna", {}).get("traits", {}),
        interests=snapshot.get("career_dna", {}).get("interests", []),
        summary=snapshot.get("career_dna", {}).get("summary", "Career DNA generated."),
    )
    skill_gap = SkillGap(
        user_id=current_user.id,
        career_goal_id=active_goal.id if active_goal else None,
        required_skills=snapshot.get("skill_gap", {}).get("required_skills", []),
        current_skills=snapshot.get("skill_gap", {}).get("current_skills", []),
        missing_skills=snapshot.get("skill_gap", {}).get("missing_skills", []),
        priority=snapshot.get("skill_gap", {}).get("priority", {}),
    )
    readiness = snapshot.get("readiness", {})
    career_readiness = CareerReadiness(
        user_id=current_user.id,
        overall_score=float(readiness.get("overall_score", 0)),
        resume_score=float(readiness.get("resume_score", 0)),
        github_score=float(readiness.get("github_score", 0)),
        skills_score=float(readiness.get("skills_score", 0)),
        explanation=readiness.get("explanation", "Readiness score generated."),
    )
    roadmap_data = snapshot.get("roadmap", {})
    roadmap = Roadmap(
        user_id=current_user.id,
        career_goal_id=active_goal.id if active_goal else None,
        title=roadmap_data.get("title", "Career Readiness Roadmap"),
        milestones=roadmap_data.get("milestones", []),
    )
    session.add_all([career_dna, skill_gap, career_readiness, roadmap])
    await session.flush()
    missions = []
    for mission in snapshot.get("missions", [])[:12]:
        missions.append(
            WeeklyMission(
                user_id=current_user.id,
                roadmap_id=roadmap.id,
                title=mission.get("title", "Weekly Mission"),
                week_start=date.fromisoformat(mission.get("week_start", date.today().isoformat())),
                objectives=mission.get("objectives", []),
            )
        )
    projects = [
        ProjectRecommendation(
            user_id=current_user.id,
            custom_project=project,
            reason=project.get("reason", "Recommended by SkillPilot AI."),
            rank=index + 1,
        )
        for index, project in enumerate(snapshot.get("projects", [])[:10])
    ]
    session.add_all(missions + projects)
    logger.info("career_analysis_completed", user_id=str(current_user.id))
    return CareerSnapshot.model_validate(snapshot)
