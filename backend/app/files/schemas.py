from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict


class FileUploadResponse(BaseModel):
    id: UUID
    file_name: str
    file_path: str
    mime_type: str
    size_bytes: int
    created_at: datetime


class StorageCleanupResponse(BaseModel):
    cleaned_files_count: int
    reclaimed_bytes: int
