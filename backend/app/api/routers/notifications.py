from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.notifications.schemas import NotificationCreate, NotificationRead
from app.notifications.service import NotificationService
from app.schemas.common import MessageResponse, Page

router = APIRouter()
logger = get_logger(__name__)


@router.get("", response_model=Page[NotificationRead])
async def list_notifications(
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Page[NotificationRead]:
    service = NotificationService(session)
    items, total = await service.list_notifications(current_user.id, limit, offset)
    return Page(items=[NotificationRead.model_validate(row) for row in items], total=total, limit=limit, offset=offset)


@router.put("/{notification_id}/read", response_model=NotificationRead)
async def mark_read(
    notification_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> NotificationRead:
    service = NotificationService(session)
    notification = await service.mark_read(current_user.id, notification_id)
    return NotificationRead.model_validate(notification)


@router.put("/read-all", response_model=MessageResponse)
async def mark_all_read(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    service = NotificationService(session)
    count = await service.mark_all_read(current_user.id)
    return MessageResponse(message=f"Marked {count} notifications as read")


@router.get("/unread-count")
async def unread_count(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> dict[str, int]:
    service = NotificationService(session)
    count = await service.count_unread(current_user.id)
    return {"unread_count": count}


@router.delete("/{notification_id}", response_model=MessageResponse)
async def delete_notification(
    notification_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    service = NotificationService(session)
    await service.delete_notification(current_user.id, notification_id)
    return MessageResponse(message="Notification deleted successfully")


