from uuid import UUID

from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import Certificate, Resume, ResumeAnalysis
from app.schemas.common import AnalysisRead, CertificateRead, ResumeRead
from app.services.ai_service import AIService
from app.services.storage_service import StorageService

router = APIRouter()
logger = get_logger(__name__)


@router.post("/upload", response_model=ResumeRead, status_code=201)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ResumeRead:
    storage = StorageService()
    file_path, size = await storage.upload_user_file(current_user.id, file, "resumes")
    existing = await session.execute(select(Resume).where(Resume.user_id == current_user.id, Resume.deleted_at.is_(None)))
    for resume in existing.scalars():
        resume.is_current = False
    resume = Resume(
        user_id=current_user.id,
        file_name=file.filename or "resume",
        file_path=file_path,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=size,
        is_current=True,
    )
    session.add(resume)
    await session.flush()
    await session.refresh(resume)
    logger.info("resume_uploaded", user_id=str(current_user.id), resume_id=str(resume.id))
    return ResumeRead.model_validate(resume)


@router.post("/{resume_id}/analyze", response_model=AnalysisRead)
async def analyze_resume(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AnalysisRead:
    resume = (
        await session.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == current_user.id, Resume.deleted_at.is_(None)))
    ).scalar_one()
    analysis = await AIService().complete_json(
        "Analyze the resume for SkillPilot AI. Return JSON keys score, strengths, weaknesses, missing_keywords.",
        resume.parsed_text or f"Resume file stored at {resume.file_path}",
    )
    entity = ResumeAnalysis(
        user_id=current_user.id,
        resume_id=resume.id,
        score=float(analysis.get("score", 0)),
        strengths=analysis.get("strengths", []),
        weaknesses=analysis.get("weaknesses", []),
        missing_keywords=analysis.get("missing_keywords", []),
        raw_analysis=analysis,
    )
    session.add(entity)
    await session.flush()
    await session.refresh(entity)
    logger.info("resume_analyzed", user_id=str(current_user.id), resume_id=str(resume.id))
    return AnalysisRead.model_validate(entity)


@router.post("/certificates", response_model=CertificateRead, status_code=201)
async def upload_certificate(
    title: str = Form(..., min_length=1, max_length=255),
    issuer: str | None = Form(default=None, max_length=255),
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CertificateRead:
    file_path, size = await StorageService().upload_user_file(current_user.id, file, "certificates")
    certificate = Certificate(
        user_id=current_user.id,
        title=title,
        issuer=issuer,
        file_name=file.filename or "certificate",
        file_path=file_path,
        mime_type=file.content_type or "application/octet-stream",
        size_bytes=size,
    )
    session.add(certificate)
    await session.flush()
    await session.refresh(certificate)
    logger.info("certificate_uploaded", user_id=str(current_user.id), certificate_id=str(certificate.id))
    return CertificateRead.model_validate(certificate)
