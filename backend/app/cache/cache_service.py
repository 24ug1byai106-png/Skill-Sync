import json
from typing import Any
from uuid import UUID

from app.cache.redis_client import get_redis_client
from app.core.logging import get_logger

logger = get_logger(__name__)

DEFAULT_TTL_SECONDS = 3600  # 1 hour default


class CacheService:
    @staticmethod
    def _make_key(namespace: str, user_id: UUID | str, key_suffix: str | None = None) -> str:
        suffix = f":{key_suffix}" if key_suffix else ""
        return f"skillpilot:{namespace}:{user_id}{suffix}"

    async def get_json(self, namespace: str, user_id: UUID | str, key_suffix: str | None = None) -> dict[str, Any] | list[Any] | None:
        client = await get_redis_client()
        if not client:
            return None
        key = self._make_key(namespace, user_id, key_suffix)
        try:
            val = await client.get(key)
            if val:
                logger.debug("cache_hit", key=key)
                return json.loads(val)
        except Exception as exc:
            logger.warning("cache_get_error", key=key, error=str(exc))
        return None

    async def set_json(
        self,
        namespace: str,
        user_id: UUID | str,
        value: Any,
        key_suffix: str | None = None,
        ttl: int = DEFAULT_TTL_SECONDS,
    ) -> bool:
        client = await get_redis_client()
        if not client:
            return False
        key = self._make_key(namespace, user_id, key_suffix)
        try:
            dumped = json.dumps(value, default=str)
            await client.setex(key, ttl, dumped)
            logger.debug("cache_set", key=key, ttl=ttl)
            return True
        except Exception as exc:
            logger.warning("cache_set_error", key=key, error=str(exc))
            return False

    async def invalidate(self, namespace: str, user_id: UUID | str, key_suffix: str | None = None) -> bool:
        client = await get_redis_client()
        if not client:
            return False
        key = self._make_key(namespace, user_id, key_suffix)
        try:
            await client.delete(key)
            logger.info("cache_invalidated", key=key)
            return True
        except Exception as exc:
            logger.warning("cache_invalidate_error", key=key, error=str(exc))
            return False

    async def invalidate_user_all(self, user_id: UUID | str) -> int:
        client = await get_redis_client()
        if not client:
            return 0
        pattern = f"skillpilot:*:{user_id}*"
        try:
            keys = await client.keys(pattern)
            if keys:
                deleted = await client.delete(*keys)
                logger.info("cache_user_all_invalidated", user_id=str(user_id), count=deleted)
                return deleted
        except Exception as exc:
            logger.warning("cache_user_all_invalidate_error", user_id=str(user_id), error=str(exc))
        return 0


cache_service = CacheService()
