from pathlib import PurePosixPath
from uuid import UUID, uuid4

import httpx
from fastapi import UploadFile

from app.config.settings import get_settings
from app.core.exceptions import AppError
from app.core.logging import get_logger

logger = get_logger(__name__)


class StorageService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def validate_file(self, file: UploadFile, allowed: set[str] | None = None) -> bytes:
        content = await file.read()
        await file.seek(0)
        allowed_types = allowed or self.settings.allowed_upload_mime_types
        if file.content_type not in allowed_types:
            raise AppError(f"Unsupported file type: {file.content_type}", 415, "unsupported_media_type")
        if len(content) > self.settings.max_upload_bytes:
            raise AppError("File exceeds maximum upload size", 413, "file_too_large")
        if not content:
            raise AppError("Uploaded file is empty", 400, "empty_file")
        return content

    async def upload_user_file(self, user_id: UUID, file: UploadFile, folder: str) -> tuple[str, int]:
        content = await self.validate_file(file)
        suffix = PurePosixPath(file.filename or "upload").suffix.lower()
        object_path = f"{folder}/{user_id}/{uuid4()}{suffix}"
        url = f"{self.settings.supabase_url}/storage/v1/object/{self.settings.supabase_storage_bucket}/{object_path}"
        headers = {
            "apikey": self.settings.supabase_service_role_key,
            "Authorization": f"Bearer {self.settings.supabase_service_role_key}",
            "Content-Type": file.content_type or "application/octet-stream",
            "x-upsert": "false",
        }
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(url, headers=headers, content=content)
        if response.status_code >= 400:
            logger.error("supabase_storage_upload_failed", status=response.status_code, body=response.text[:500])
            raise AppError("Storage upload failed", 502, "storage_error")
        return object_path, len(content)
