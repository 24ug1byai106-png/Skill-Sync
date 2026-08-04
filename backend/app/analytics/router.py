from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.analytics.schemas import AnalyticsOverviewRead
from app.analytics.service import AnalyticsService
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user

router = APIRouter()


@router.get("/overview", response_model=AnalyticsOverviewRead)
async def get_analytics_overview(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AnalyticsOverviewRead:
    overview = await AnalyticsService(session).get_overview()
    return AnalyticsOverviewRead.model_validate(overview)
