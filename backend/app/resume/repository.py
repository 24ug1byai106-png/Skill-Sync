from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.entities import Resume, ResumeAnalysis
from app.models.extensions import ResumeParsedContent


class ResumeRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def create_resume(self, resume: Resume) -> Resume:
        self.session.add(resume)
        await self.session.flush()
        await self.session.refresh(resume)
        return resume

    async def get_owned(self, user_id: UUID, resume_id: UUID) -> Resume:
        resume = (
            await self.session.execute(select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id, Resume.deleted_at.is_(None)))
        ).scalar_one_or_none()
        if resume is None:
            raise NotFoundError("Resume")
        return resume

    async def list_owned(self, user_id: UUID, limit: int, offset: int) -> list[Resume]:
        return list(
            (
                await self.session.execute(
                    select(Resume)
                    .where(Resume.user_id == user_id, Resume.deleted_at.is_(None))
                    .order_by(Resume.created_at.desc())
                    .limit(limit)
                    .offset(offset)
                )
            )
            .scalars()
            .all()
        )

    async def upsert_parsed_content(self, parsed: ResumeParsedContent) -> ResumeParsedContent:
        existing = (
            await self.session.execute(
                select(ResumeParsedContent).where(
                    ResumeParsedContent.resume_id == parsed.resume_id,
                    ResumeParsedContent.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if existing is None:
            self.session.add(parsed)
            await self.session.flush()
            await self.session.refresh(parsed)
            return parsed
        for field in (
            "skills",
            "projects",
            "education",
            "experience",
            "certificates",
            "achievements",
            "technical_skills",
            "soft_skills",
            "languages",
            "raw_text_hash",
            "parser_version",
            "parse_metadata",
        ):
            setattr(existing, field, getattr(parsed, field))
        await self.session.flush()
        await self.session.refresh(existing)
        return existing

    async def get_parsed_content(self, resume_id: UUID) -> ResumeParsedContent | None:
        return (
            await self.session.execute(
                select(ResumeParsedContent).where(
                    ResumeParsedContent.resume_id == resume_id,
                    ResumeParsedContent.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()

    async def latest_analysis(self, resume_id: UUID) -> ResumeAnalysis | None:
        return (
            await self.session.execute(
                select(ResumeAnalysis)
                .where(ResumeAnalysis.resume_id == resume_id, ResumeAnalysis.deleted_at.is_(None))
                .order_by(ResumeAnalysis.created_at.desc())
                .limit(1)
            )
        ).scalar_one_or_none()
