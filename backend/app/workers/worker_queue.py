import asyncio
from collections.abc import Awaitable, Callable
from typing import Any, TypeVar

from app.core.logging import get_logger

logger = get_logger(__name__)

T = TypeVar("T")


class TaskQueue:
    def __init__(self, max_concurrent: int = 10) -> None:
        self.semaphore = asyncio.Semaphore(max_concurrent)
        self.stats = {"submitted": 0, "completed": 0, "failed": 0, "retried": 0}

    async def enqueue_with_retry(
        self,
        task_name: str,
        coro_fn: Callable[..., Awaitable[T]],
        *args: Any,
        max_retries: int = 3,
        timeout_seconds: float = 60.0,
        backoff_factor: float = 1.5,
        **kwargs: Any,
    ) -> T | None:
        self.stats["submitted"] += 1
        async with self.semaphore:
            for attempt in range(1, max_retries + 1):
                try:
                    logger.info("worker_task_started", task=task_name, attempt=attempt)
                    result = await asyncio.wait_for(coro_fn(*args, **kwargs), timeout=timeout_seconds)
                    self.stats["completed"] += 1
                    logger.info("worker_task_completed", task=task_name)
                    return result
                except asyncio.TimeoutError:
                    logger.warning("worker_task_timeout", task=task_name, timeout=timeout_seconds, attempt=attempt)
                except Exception as exc:
                    logger.warning("worker_task_failed", task=task_name, error=str(exc), attempt=attempt)

                if attempt < max_retries:
                    self.stats["retried"] += 1
                    sleep_time = backoff_factor ** attempt
                    await asyncio.sleep(sleep_time)

            self.stats["failed"] += 1
            logger.error("worker_task_permanently_failed", task=task_name, max_retries=max_retries)
            return None


task_queue = TaskQueue()
