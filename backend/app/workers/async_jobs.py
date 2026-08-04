import asyncio
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.career.engines import CareerEngine
from app.core.logging import get_logger
from app.database.session import AsyncSessionLocal
from app.github.service import GitHubIntegrationService
from app.models.entities import User
from app.notifications.service import NotificationService
from app.resume.service import ResumeService

logger = get_logger(__name__)


async def async_analyze_resume(user_id: UUID, resume_id: UUID) -> None:
    logger.info("bg_job_resume_analysis_started", user_id=str(user_id), resume_id=str(resume_id))
    async with AsyncSessionLocal() as session:
        try:
            service = ResumeService(session)
            await service.analyze_resume(user_id, resume_id)
            await session.commit()
            logger.info("bg_job_resume_analysis_completed", user_id=str(user_id), resume_id=str(resume_id))
        except Exception as exc:
            await session.rollback()
            logger.error("bg_job_resume_analysis_failed", user_id=str(user_id), error=str(exc))


async def async_sync_github(user_id: UUID, account_id: UUID) -> None:
    logger.info("bg_job_github_sync_started", user_id=str(user_id), account_id=str(account_id))
    async with AsyncSessionLocal() as session:
        try:
            service = GitHubIntegrationService(session)
            await service.analyze_account(user_id, account_id)
            await session.commit()
            logger.info("bg_job_github_sync_completed", user_id=str(user_id), account_id=str(account_id))
        except Exception as exc:
            await session.rollback()
            logger.error("bg_job_github_sync_failed", user_id=str(user_id), error=str(exc))


async def async_update_career_dna(user_id: UUID) -> None:
    logger.info("bg_job_career_dna_update_started", user_id=str(user_id))
    async with AsyncSessionLocal() as session:
        try:
            engine = CareerEngine(session)
            await engine.generate_career_dna(user_id)
            await engine.generate_skill_gap(user_id)
            await engine.calculate_readiness(user_id)
            await session.commit()
            logger.info("bg_job_career_dna_update_completed", user_id=str(user_id))
        except Exception as exc:
            await session.rollback()
            logger.error("bg_job_career_dna_update_failed", user_id=str(user_id), error=str(exc))


async def async_generate_roadmap(user_id: UUID, available_hours_per_week: int = 8) -> None:
    logger.info("bg_job_roadmap_generation_started", user_id=str(user_id))
    async with AsyncSessionLocal() as session:
        try:
            engine = CareerEngine(session)
            await engine.generate_roadmap(user_id, available_hours_per_week)
            await session.commit()
            logger.info("bg_job_roadmap_generation_completed", user_id=str(user_id))
        except Exception as exc:
            await session.rollback()
            logger.error("bg_job_roadmap_generation_failed", user_id=str(user_id), error=str(exc))


async def async_generate_weekly_missions(user_id: UUID, count: int = 5) -> None:
    logger.info("bg_job_weekly_mission_generation_started", user_id=str(user_id))
    async with AsyncSessionLocal() as session:
        try:
            engine = CareerEngine(session)
            await engine.generate_weekly_missions(user_id, count)
            await session.commit()
            logger.info("bg_job_weekly_mission_generation_completed", user_id=str(user_id))
        except Exception as exc:
            await session.rollback()
            logger.error("bg_job_weekly_mission_generation_failed", user_id=str(user_id), error=str(exc))


async def async_run_notification_scheduler() -> None:
    logger.info("bg_job_notification_scheduler_started")
    async with AsyncSessionLocal() as session:
        try:
            users = (await session.execute(select(User).where(User.is_active.is_(True), User.deleted_at.is_(None)))).scalars().all()
            notification_service = NotificationService(session)
            for user in users:
                await notification_service.create_weekly_mission_reminder(user.id)
                await notification_service.create_roadmap_reminder(user.id)
                await notification_service.create_learning_reminder(user.id)
                await notification_service.create_certificate_reminder(user.id)
                await notification_service.create_github_reminder(user.id)
            await session.commit()
            logger.info("bg_job_notification_scheduler_completed", processed_users=len(users))
        except Exception as exc:
            await session.rollback()
            logger.error("bg_job_notification_scheduler_failed", error=str(exc))


# Helper function to fire and forget tasks asynchronously
def dispatch_async_job(coro) -> asyncio.Task:
    return asyncio.create_task(coro)
