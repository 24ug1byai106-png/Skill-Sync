from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.models.entities import Notification
from app.repositories.base import BaseRepository


class NotificationRepository(BaseRepository[Notification]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(Notification, session)

    async def list_by_user(self, user_id: UUID, limit: int = 50, offset: int = 0) -> tuple[list[Notification], int]:
        query = select(Notification).where(Notification.user_id == user_id, Notification.deleted_at.is_(None))
        count_query = select(func.count()).select_from(query.subquery())

        total = (await self.session.execute(count_query)).scalar_one()
        rows = (
            await self.session.execute(
                query.order_by(Notification.created_at.desc()).limit(limit).offset(offset)
            )
        ).scalars().all()
        return list(rows), total

    async def mark_read(self, user_id: UUID, notification_id: UUID) -> Notification:
        notification = (
            await self.session.execute(
                select(Notification).where(
                    Notification.id == notification_id,
                    Notification.user_id == user_id,
                    Notification.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if not notification:
            raise AppError("Notification not found", 404, "notification_not_found")
        notification.read_at = datetime.now(UTC)
        await self.session.flush()
        await self.session.refresh(notification)
        return notification

    async def mark_all_read(self, user_id: UUID) -> int:
        rows = (
            await self.session.execute(
                select(Notification).where(
                    Notification.user_id == user_id,
                    Notification.read_at.is_(None),
                    Notification.deleted_at.is_(None),
                )
            )
        ).scalars().all()
        now = datetime.now(UTC)
        for item in rows:
            item.read_at = now
        await self.session.flush()
        return len(rows)

    async def create_notification(self, user_id: UUID, title: str, body: str, kind: str) -> Notification:
        notification = Notification(user_id=user_id, title=title, body=body, kind=kind)
        self.session.add(notification)
        await self.session.flush()
        await self.session.refresh(notification)
        return notification

    async def count_unread(self, user_id: UUID) -> int:
        query = select(func.count()).select_from(
            select(Notification).where(
                Notification.user_id == user_id,
                Notification.read_at.is_(None),
                Notification.deleted_at.is_(None),
            ).subquery()
        )
        return (await self.session.execute(query)).scalar_one()

    async def delete_notification(self, user_id: UUID, notification_id: UUID) -> None:
        notification = (
            await self.session.execute(
                select(Notification).where(
                    Notification.id == notification_id,
                    Notification.user_id == user_id,
                    Notification.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if not notification:
            raise AppError("Notification not found", 404, "notification_not_found")
        notification.deleted_at = datetime.now(UTC)
        await self.session.flush()

