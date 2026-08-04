from collections.abc import AsyncIterator
import redis.asyncio as aioredis
from redis.asyncio import Redis

from app.config.settings import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)

_redis_client: Redis | None = None


async def get_redis_client() -> Redis | None:
    global _redis_client
    if _redis_client is not None:
        return _redis_client
    
    settings = get_settings()
    try:
        _redis_client = aioredis.from_url(
            settings.redis_url,
            encoding="utf-8",
            decode_responses=True,
            socket_timeout=0.5,
            socket_connect_timeout=0.5,
        )
        await _redis_client.ping()
        logger.info("redis_connected", redis_url=settings.redis_url)
        return _redis_client
    except Exception as exc:
        logger.warning("redis_connection_failed", error=str(exc))
        _redis_client = None
        return None


async def close_redis() -> None:
    global _redis_client
    if _redis_client is not None:
        await _redis_client.close()
        _redis_client = None
        logger.info("redis_closed")
