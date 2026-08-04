import asyncio
from collections.abc import AsyncIterator
from contextlib import asynccontextmanager

from app.core.logging import get_logger
from app.workers.async_jobs import async_run_notification_scheduler

logger = get_logger(__name__)

_scheduler_task: asyncio.Task | None = None


async def _periodic_notification_loop(interval_seconds: float = 3600.0) -> None:
    logger.info("notification_scheduler_loop_started", interval_seconds=interval_seconds)
    while True:
        try:
            await async_run_notification_scheduler()
        except Exception as exc:
            logger.error("notification_scheduler_loop_error", error=str(exc))
        await asyncio.sleep(interval_seconds)


def start_scheduler(interval_seconds: float = 3600.0) -> asyncio.Task:
    global _scheduler_task
    if _scheduler_task is None or _scheduler_task.done():
        _scheduler_task = asyncio.create_task(_periodic_notification_loop(interval_seconds))
        logger.info("background_scheduler_started")
    return _scheduler_task


def stop_scheduler() -> None:
    global _scheduler_task
    if _scheduler_task and not _scheduler_task.done():
        _scheduler_task.cancel()
        logger.info("background_scheduler_stopped")
        _scheduler_task = None
