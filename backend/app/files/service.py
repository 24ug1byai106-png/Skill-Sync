from datetime import UTC, datetime
from uuid import UUID

from fastapi import UploadFile
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.models.entities import Certificate, Profile, Resume
from app.services.storage_service import StorageService
from app.utils.file_validation import validate_upload


class FileManagementService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.storage = StorageService()

    async def get_resume_download_url(self, user_id: UUID, resume_id: UUID) -> str:
        resume = (
            await self.session.execute(
                select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id, Resume.deleted_at.is_(None))
            )
        ).scalar_one_or_none()
        if not resume:
            raise AppError("Resume not found", 404, "resume_not_found")
        return await self.storage.get_presigned_url(resume.file_path)

    async def delete_resume(self, user_id: UUID, resume_id: UUID) -> None:
        resume = (
            await self.session.execute(
                select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id, Resume.deleted_at.is_(None))
            )
        ).scalar_one_or_none()
        if not resume:
            raise AppError("Resume not found", 404, "resume_not_found")
        resume.deleted_at = datetime.now(UTC)
        await self.storage.delete_file(resume.file_path)
        await self.session.flush()

    async def replace_resume(self, user_id: UUID, resume_id: UUID, file: UploadFile) -> Resume:
        content = await validate_upload(file)
        old_resume = (
            await self.session.execute(
                select(Resume).where(Resume.id == resume_id, Resume.user_id == user_id, Resume.deleted_at.is_(None))
            )
        ).scalar_one_or_none()
        if not old_resume:
            raise AppError("Resume not found", 404, "resume_not_found")
        
        path = await self.storage.upload_file(content, file.filename, file.content_type)
        old_resume.file_name = file.filename or "resume.pdf"
        old_resume.file_path = path
        old_resume.mime_type = file.content_type or "application/pdf"
        old_resume.size_bytes = len(content)
        await self.session.flush()
        await self.session.refresh(old_resume)
        return old_resume

    async def get_certificate_download_url(self, user_id: UUID, certificate_id: UUID) -> str:
        cert = (
            await self.session.execute(
                select(Certificate).where(Certificate.id == certificate_id, Certificate.user_id == user_id, Certificate.deleted_at.is_(None))
            )
        ).scalar_one_or_none()
        if not cert:
            raise AppError("Certificate not found", 404, "certificate_not_found")
        return await self.storage.get_presigned_url(cert.file_path)

    async def delete_certificate(self, user_id: UUID, certificate_id: UUID) -> None:
        cert = (
            await self.session.execute(
                select(Certificate).where(Certificate.id == certificate_id, Certificate.user_id == user_id, Certificate.deleted_at.is_(None))
            )
        ).scalar_one_or_none()
        if not cert:
            raise AppError("Certificate not found", 404, "certificate_not_found")
        cert.deleted_at = datetime.now(UTC)
        await self.storage.delete_file(cert.file_path)
        await self.session.flush()

    async def upload_profile_image(self, user_id: UUID, file: UploadFile) -> str:
        content = await validate_upload(file)

        path = await self.storage.upload_file(content, file.filename, file.content_type)
        profile = (
            await self.session.execute(select(Profile).where(Profile.user_id == user_id))
        ).scalar_one_or_none()
        if profile:
            profile.profile_image_path = path
            await self.session.flush()
        return path

    async def cleanup_storage(self) -> dict[str, int]:
        deleted_resumes = (
            await self.session.execute(select(Resume).where(Resume.deleted_at.is_not(None)))
        ).scalars().all()
        count = len(deleted_resumes)
        bytes_reclaimed = sum(r.size_bytes for r in deleted_resumes)
        for r in deleted_resumes:
            await self.storage.delete_file(r.file_path)
        return {"cleaned_files_count": count, "reclaimed_bytes": bytes_reclaimed}
