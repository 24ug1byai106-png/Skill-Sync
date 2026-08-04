from fastapi import APIRouter, Depends, Query
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import Project, ProjectRecommendation
from app.schemas.common import Page, ProjectRead, ProjectRecommendationRead

router = APIRouter()


@router.get("", response_model=Page[ProjectRead])
async def list_projects(
    difficulty: str | None = Query(default=None, max_length=40),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    session: AsyncSession = Depends(get_db_session),
) -> Page[ProjectRead]:
    query = select(Project).where(Project.deleted_at.is_(None))
    if difficulty:
        query = query.where(Project.difficulty == difficulty)
    rows = (await session.execute(query.order_by(Project.created_at.desc()).limit(limit).offset(offset))).scalars().all()
    return Page(items=[ProjectRead.model_validate(row) for row in rows], total=len(rows), limit=limit, offset=offset)


@router.get("/recommendations", response_model=Page[ProjectRecommendationRead])
async def list_recommendations(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Page[ProjectRecommendationRead]:
    rows = (
        await session.execute(
            select(ProjectRecommendation)
            .where(ProjectRecommendation.user_id == current_user.id, ProjectRecommendation.deleted_at.is_(None))
            .order_by(ProjectRecommendation.rank.asc(), ProjectRecommendation.created_at.desc())
            .limit(limit)
            .offset(offset)
        )
    ).scalars().all()
    return Page(items=[ProjectRecommendationRead.model_validate(row) for row in rows], total=len(rows), limit=limit, offset=offset)
