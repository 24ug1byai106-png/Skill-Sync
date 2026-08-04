from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.career.engines import CareerEngine
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.schemas.common import CareerSnapshot

router = APIRouter()


@router.post("/career-dna")
async def generate_career_dna(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict:
    dna = await CareerEngine(session).generate_career_dna(current_user.id)
    return {
        "id": dna.id,
        "summary": dna.summary,
        "technical_strengths": dna.strengths,
        "technology_expertise": dna.interests,
        "career_dna": dna.traits,
        "confidence_score": dna.traits.get("confidence_score") if isinstance(dna.traits, dict) else None,
    }


@router.post("/skill-gap")
async def generate_skill_gap(
    role: str | None = Query(default=None),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict:
    gap = await CareerEngine(session).generate_skill_gap(current_user.id, role)
    return {
        "id": gap.id,
        "required_skills": gap.required_skills,
        "existing_skills": gap.current_skills,
        "missing_skills": gap.missing_skills,
        "priority": gap.priority,
    }


@router.post("/readiness")
async def calculate_readiness(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict:
    readiness = await CareerEngine(session).calculate_readiness(current_user.id)
    return {
        "id": readiness.id,
        "overall_career_readiness_score": readiness.overall_score,
        "resume_score": readiness.resume_score,
        "github_score": readiness.github_score,
        "skill_score": readiness.skills_score,
        "details": readiness.explanation,
    }


@router.post("/full-refresh", response_model=CareerSnapshot)
async def full_refresh(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CareerSnapshot:
    engine = CareerEngine(session)
    dna = await engine.generate_career_dna(current_user.id)
    gap = await engine.generate_skill_gap(current_user.id)
    readiness = await engine.calculate_readiness(current_user.id)
    roadmap = await engine.generate_roadmap(current_user.id)
    missions = await engine.generate_weekly_missions(current_user.id)
    projects = await engine.recommend_projects(current_user.id)
    return CareerSnapshot(
        career_dna={"id": str(dna.id), "summary": dna.summary, "traits": dna.traits},
        skill_gap={"id": str(gap.id), "missing_skills": gap.missing_skills, "priority": gap.priority},
        readiness={"id": str(readiness.id), "overall_score": readiness.overall_score, "details": readiness.explanation},
        roadmap={"id": str(roadmap.id), "title": roadmap.title, "milestones": roadmap.milestones},
        missions=[{"id": str(mission.id), "title": mission.title, "objectives": mission.objectives} for mission in missions],
        projects=[{"id": str(project.id), "project": project.custom_project, "reason": project.reason} for project in projects],
    )
