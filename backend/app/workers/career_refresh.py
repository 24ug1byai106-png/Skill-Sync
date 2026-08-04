from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.langgraph.career_workflow import build_career_workflow
from app.models.entities import CareerDNA, CareerGoal, CareerReadiness, Roadmap, SkillGap

logger = get_logger(__name__)


async def refresh_student_career_state(session: AsyncSession, user_id: UUID) -> dict[str, object]:
    active_goal = (
        await session.execute(
            select(CareerGoal).where(CareerGoal.user_id == user_id, CareerGoal.is_active.is_(True), CareerGoal.deleted_at.is_(None))
        )
    ).scalar_one_or_none()
    workflow = build_career_workflow()
    result = await workflow.ainvoke({"inputs": {"user_id": str(user_id), "career_goal": active_goal.title if active_goal else None}})
    snapshot = result["snapshot"]

    session.add(
        CareerDNA(
            user_id=user_id,
            career_goal_id=active_goal.id if active_goal else None,
            strengths=snapshot.get("career_dna", {}).get("strengths", []),
            traits=snapshot.get("career_dna", {}).get("traits", {}),
            interests=snapshot.get("career_dna", {}).get("interests", []),
            summary=snapshot.get("career_dna", {}).get("summary", "Career DNA generated."),
        )
    )
    session.add(
        SkillGap(
            user_id=user_id,
            career_goal_id=active_goal.id if active_goal else None,
            required_skills=snapshot.get("skill_gap", {}).get("required_skills", []),
            current_skills=snapshot.get("skill_gap", {}).get("current_skills", []),
            missing_skills=snapshot.get("skill_gap", {}).get("missing_skills", []),
            priority=snapshot.get("skill_gap", {}).get("priority", {}),
        )
    )
    readiness = snapshot.get("readiness", {})
    session.add(
        CareerReadiness(
            user_id=user_id,
            overall_score=float(readiness.get("overall_score", 0)),
            resume_score=float(readiness.get("resume_score", 0)),
            github_score=float(readiness.get("github_score", 0)),
            skills_score=float(readiness.get("skills_score", 0)),
            explanation=readiness.get("explanation", "Readiness score generated."),
        )
    )
    roadmap = snapshot.get("roadmap", {})
    session.add(
        Roadmap(
            user_id=user_id,
            career_goal_id=active_goal.id if active_goal else None,
            title=roadmap.get("title", "Career Readiness Roadmap"),
            milestones=roadmap.get("milestones", []),
        )
    )
    await session.flush()
    logger.info("career_refresh_completed", user_id=str(user_id))
    return snapshot
