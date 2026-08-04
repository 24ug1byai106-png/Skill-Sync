from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.reports.schemas import ReportSummaryRead
from app.reports.service import ReportGeneratorService

router = APIRouter()


@router.get("/career", response_model=ReportSummaryRead)
async def get_career_report(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ReportSummaryRead:
    report = await ReportGeneratorService(session).generate_career_report(current_user.id)
    return ReportSummaryRead.model_validate(report)


@router.get("/career/download", response_class=HTMLResponse)
async def download_career_report_html(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> HTMLResponse:
    report = await ReportGeneratorService(session).generate_career_report(current_user.id)
    return HTMLResponse(content=report["content_html"], status_code=200)


@router.get("/resume/{resume_id}", response_model=ReportSummaryRead)
async def get_resume_report(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ReportSummaryRead:
    report = await ReportGeneratorService(session).generate_resume_report(current_user.id, resume_id)
    return ReportSummaryRead.model_validate(report)


@router.get("/roadmap", response_model=ReportSummaryRead)
async def get_roadmap_report(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ReportSummaryRead:
    report = await ReportGeneratorService(session).generate_roadmap_report(current_user.id)
    return ReportSummaryRead.model_validate(report)
