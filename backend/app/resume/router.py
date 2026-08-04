from uuid import UUID

from fastapi import APIRouter, Depends, File, Query, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.resume.schemas import ResumeAnalysisRead, ResumeDetailRead, ResumeParsedContentRead, ResumeUpdate, ResumeUploadResponse
from app.resume.service import ResumeService
from app.schemas.common import MessageResponse

router = APIRouter()


def _detail(resume, parsed) -> ResumeDetailRead:
    detail = ResumeDetailRead.model_validate(resume)
    detail.parsed_content = ResumeParsedContentRead.model_validate(parsed) if parsed else None
    return detail


@router.post("", response_model=ResumeUploadResponse, status_code=201)
async def upload_resume(
    analyze: bool = Query(default=True),
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeUploadResponse:
    resume, parsed, analysis = await ResumeService(session).upload_parse_and_analyze(current_user.id, file, analyze)
    return ResumeUploadResponse(
        resume=_detail(resume, parsed),
        analysis=ResumeAnalysisRead.model_validate(analysis) if analysis else None,
    )


@router.get("", response_model=list[ResumeDetailRead])
async def list_resumes(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[ResumeDetailRead]:
    service = ResumeService(session)
    resumes = await service.repository.list_owned(current_user.id, limit, offset)
    return [_detail(resume, await service.repository.get_parsed_content(resume.id)) for resume in resumes]


@router.get("/{resume_id}", response_model=ResumeDetailRead)
async def get_resume(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeDetailRead:
    service = ResumeService(session)
    resume = await service.repository.get_owned(current_user.id, resume_id)
    return _detail(resume, await service.repository.get_parsed_content(resume.id))


@router.patch("/{resume_id}", response_model=ResumeDetailRead)
async def update_resume(
    resume_id: UUID,
    payload: ResumeUpdate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeDetailRead:
    service = ResumeService(session)
    resume = await service.update_resume(current_user.id, resume_id, payload.model_dump())
    return _detail(resume, await service.repository.get_parsed_content(resume.id))


@router.post("/{resume_id}/analyze", response_model=ResumeAnalysisRead)
async def analyze_resume(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeAnalysisRead:
    analysis = await ResumeService(session).analyze_resume(current_user.id, resume_id)
    return ResumeAnalysisRead.model_validate(analysis)


@router.delete("/{resume_id}", response_model=MessageResponse)
async def delete_resume(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    await ResumeService(session).soft_delete(current_user.id, resume_id)
    return MessageResponse(message="Resume deleted")
