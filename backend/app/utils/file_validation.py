from fastapi import UploadFile

from app.services.storage_service import StorageService


async def validate_upload(file: UploadFile) -> bytes:
    return await StorageService().validate_file(file)
