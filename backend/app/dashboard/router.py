from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dashboard.service import DashboardService
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user

router = APIRouter()


@router.get("/optimized")
async def optimized_dashboard(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict:
    return await DashboardService(session).optimized(current_user.id)
