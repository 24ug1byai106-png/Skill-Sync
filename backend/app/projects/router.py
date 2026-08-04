from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.projects.schemas import ProjectRecommendationRead
from app.projects.service import ProjectRecommendationEngine

router = APIRouter()


@router.post("/recommend", response_model=list[ProjectRecommendationRead])
async def recommend_projects(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[ProjectRecommendationRead]:
    recommendations = await ProjectRecommendationEngine(session).generate(current_user.id)
    return [ProjectRecommendationRead.model_validate(item) for item in recommendations]


@router.get("/recommendations", response_model=list[ProjectRecommendationRead])
async def list_project_recommendations(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[ProjectRecommendationRead]:
    recommendations = await ProjectRecommendationEngine(session).list_by_user(current_user.id)
    return [ProjectRecommendationRead.model_validate(item) for item in recommendations]


@router.get("/recommendations/{recommendation_id}", response_model=ProjectRecommendationRead)
async def get_project_recommendation(
    recommendation_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ProjectRecommendationRead:
    recommendation = await ProjectRecommendationEngine(session).get_by_id(current_user.id, recommendation_id)
    return ProjectRecommendationRead.model_validate(recommendation)

