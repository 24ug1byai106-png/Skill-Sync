from uuid import UUID

from fastapi import APIRouter, Depends, File, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.files.schemas import FileUploadResponse, StorageCleanupResponse
from app.files.service import FileManagementService
from app.schemas.common import MessageResponse

router = APIRouter()


@router.get("/resume/{resume_id}/download")
async def download_resume(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict[str, str]:
    url = await FileManagementService(session).get_resume_download_url(current_user.id, resume_id)
    return {"download_url": url}


@router.delete("/resume/{resume_id}", response_model=MessageResponse)
async def delete_resume(
    resume_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    await FileManagementService(session).delete_resume(current_user.id, resume_id)
    return MessageResponse(message="Resume deleted successfully")


@router.put("/resume/{resume_id}/replace", response_model=FileUploadResponse)
async def replace_resume(
    resume_id: UUID,
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> FileUploadResponse:
    resume = await FileManagementService(session).replace_resume(current_user.id, resume_id, file)
    return FileUploadResponse.model_validate(resume)


@router.get("/certificates/{certificate_id}/download")
async def download_certificate(
    certificate_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict[str, str]:
    url = await FileManagementService(session).get_certificate_download_url(current_user.id, certificate_id)
    return {"download_url": url}


@router.delete("/certificates/{certificate_id}", response_model=MessageResponse)
async def delete_certificate(
    certificate_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    await FileManagementService(session).delete_certificate(current_user.id, certificate_id)
    return MessageResponse(message="Certificate deleted successfully")


@router.post("/profile-image")
async def upload_profile_image(
    file: UploadFile = File(...),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict[str, str]:
    path = await FileManagementService(session).upload_profile_image(current_user.id, file)
    return {"profile_image_path": path}


@router.post("/admin/cleanup", response_model=StorageCleanupResponse)
async def cleanup_storage(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> StorageCleanupResponse:
    if current_user.role != "admin":
        raise AppError("Admin access required", 403, "admin_access_denied")
    res = await FileManagementService(session).cleanup_storage()
    return StorageCleanupResponse.model_validate(res)
