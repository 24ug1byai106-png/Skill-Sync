import json
from datetime import UTC, datetime
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.groq.service import GroqService
from app.models.entities import Resume, ResumeAnalysis
from app.models.extensions import ResumeParsedContent
from app.prompts.resume_analysis import SYSTEM_PROMPT as RESUME_ANALYSIS_PROMPT
from app.resume.parser import DOCX_MIME, PDF_MIME, ResumeParser
from app.resume.repository import ResumeRepository
from app.schemas.common import Page
from app.services.storage_service import StorageService


class ResumeService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repository = ResumeRepository(session)
        self.parser = ResumeParser()

    async def upload_parse_and_analyze(self, user_id: UUID, file: UploadFile, analyze: bool = True) -> tuple[Resume, ResumeParsedContent, ResumeAnalysis | None]:
        storage = StorageService()
        content = await storage.validate_file(file, {PDF_MIME, DOCX_MIME})
        text = await self.parser.extract_upload_text(file, content)
        await file.seek(0)
        existing = await self.session.execute(select(Resume).where(Resume.user_id == user_id, Resume.deleted_at.is_(None)))
        for resume in existing.scalars():
            resume.is_current = False
        file_path, size = await storage.upload_user_file(user_id, file, "resumes")
        resume = await self.repository.create_resume(
            Resume(
                user_id=user_id,
                file_name=file.filename or "resume",
                file_path=file_path,
                mime_type=file.content_type or "application/octet-stream",
                size_bytes=size,
                parsed_text=text,
                is_current=True,
            )
        )
        parsed_data = self.parser.parse_structured_content(text)
        parsed = await self.repository.upsert_parsed_content(
            ResumeParsedContent(user_id=user_id, resume_id=resume.id, **parsed_data)
        )
        analysis = await self.analyze_resume(user_id, resume.id) if analyze else None
        return resume, parsed, analysis

    async def analyze_resume(self, user_id: UUID, resume_id: UUID) -> ResumeAnalysis:
        resume = await self.repository.get_owned(user_id, resume_id)
        parsed = await self.repository.get_parsed_content(resume.id)
        payload = {
            "resume_text": resume.parsed_text,
            "parsed_content": {
                "skills": parsed.skills if parsed else [],
                "projects": parsed.projects if parsed else [],
                "education": parsed.education if parsed else [],
                "experience": parsed.experience if parsed else [],
                "certificates": parsed.certificates if parsed else [],
            },
        }
        result = await GroqService().complete_json(RESUME_ANALYSIS_PROMPT, json.dumps(payload, default=str))
        analysis = ResumeAnalysis(
            user_id=user_id,
            resume_id=resume.id,
            score=float(result.get("ats_score", 0)),
            strengths=result.get("strong_skills", []),
            weaknesses=result.get("weak_skills", []),
            missing_keywords=result.get("keyword_suggestions", []),
            raw_analysis=result,
        )
        self.session.add(analysis)
        await self.session.flush()
        await self.session.refresh(analysis)
        return analysis

    async def list_resumes(self, user_id: UUID, limit: int, offset: int) -> Page[dict]:
        rows = await self.repository.list_owned(user_id, limit, offset)
        items = []
        for resume in rows:
            parsed = await self.repository.get_parsed_content(resume.id)
            items.append({"resume": resume, "parsed_content": parsed})
        return Page(items=items, total=len(items), limit=limit, offset=offset)

    async def update_resume(self, user_id: UUID, resume_id: UUID, values: dict) -> Resume:
        resume = await self.repository.get_owned(user_id, resume_id)
        for key, value in values.items():
            if value is not None:
                setattr(resume, key, value)
        await self.session.flush()
        await self.session.refresh(resume)
        return resume

    async def soft_delete(self, user_id: UUID, resume_id: UUID) -> None:
        resume = await self.repository.get_owned(user_id, resume_id)
        resume.deleted_at = datetime.now(UTC)
        await self.session.flush()
