from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.models.entities import Certificate, GithubAccount, Notification, Roadmap, WeeklyMission
from app.notifications.repository import NotificationRepository

logger = get_logger(__name__)


class NotificationService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.repo = NotificationRepository(session)

    async def list_notifications(self, user_id: UUID, limit: int = 50, offset: int = 0) -> tuple[list[Notification], int]:
        return await self.repo.list_by_user(user_id, limit, offset)

    async def mark_read(self, user_id: UUID, notification_id: UUID) -> Notification:
        return await self.repo.mark_read(user_id, notification_id)

    async def mark_all_read(self, user_id: UUID) -> int:
        return await self.repo.mark_all_read(user_id)

    async def count_unread(self, user_id: UUID) -> int:
        return await self.repo.count_unread(user_id)

    async def delete_notification(self, user_id: UUID, notification_id: UUID) -> None:
        await self.repo.delete_notification(user_id, notification_id)

    async def send_notification(self, user_id: UUID, title: str, body: str, kind: str) -> Notification:
        logger.info("send_notification", user_id=str(user_id), kind=kind, title=title)
        return await self.repo.create_notification(user_id, title, body, kind)


    # automated reminder generators
    async def create_weekly_mission_reminder(self, user_id: UUID) -> Notification | None:
        pending = (
            await self.session.execute(
                select(WeeklyMission).where(
                    WeeklyMission.user_id == user_id,
                    WeeklyMission.status == "pending",
                    WeeklyMission.deleted_at.is_(None),
                )
            )
        ).scalars().all()
        if pending:
            return await self.send_notification(
                user_id=user_id,
                title="Weekly Mission Reminder",
                body=f"You have {len(pending)} pending weekly mission(s) waiting to be completed. Keep your momentum going!",
                kind="weekly_mission",
            )
        return None

    async def create_roadmap_reminder(self, user_id: UUID) -> Notification | None:
        roadmaps = (
            await self.session.execute(
                select(Roadmap).where(
                    Roadmap.user_id == user_id,
                    Roadmap.status == "active",
                    Roadmap.deleted_at.is_(None),
                )
            )
        ).scalars().all()
        if roadmaps:
            return await self.send_notification(
                user_id=user_id,
                title="Career Roadmap Reminder",
                body="Check your active career roadmap to stay on track with this week's milestones.",
                kind="roadmap",
            )
        return None

    async def create_learning_reminder(self, user_id: UUID) -> Notification | None:
        return await self.send_notification(
            user_id=user_id,
            title="Daily Learning Streak Reminder",
            body="Spend 20 minutes today learning a new skill or completing a DSA problem to maintain your streak!",
            kind="learning",
        )

    async def create_certificate_reminder(self, user_id: UUID) -> Notification | None:
        certs = (
            await self.session.execute(
                select(Certificate).where(Certificate.user_id == user_id, Certificate.deleted_at.is_(None))
            )
        ).scalars().all()
        if not certs:
            return await self.send_notification(
                user_id=user_id,
                title="Upload Your Certificates",
                body="Upload your latest industry certificates to boost your SkillPilot AI readiness score.",
                kind="certificate",
            )
        return None

    async def create_github_reminder(self, user_id: UUID) -> Notification | None:
        accounts = (
            await self.session.execute(
                select(GithubAccount).where(GithubAccount.user_id == user_id, GithubAccount.deleted_at.is_(None))
            )
        ).scalars().all()
        if not accounts:
            return await self.send_notification(
                user_id=user_id,
                title="Connect Your GitHub Account",
                body="Connect your GitHub account to get AI repository analysis and showcase your open-source projects.",
                kind="github",
            )
        return None
