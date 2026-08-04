from collections.abc import Awaitable, Callable

import redis.asyncio as redis
from fastapi import Request, Response, status
from starlette.middleware.base import BaseHTTPMiddleware

from app.config.settings import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, requests_per_minute: int | None = None) -> None:
        super().__init__(app)
        self.settings = get_settings()
        self.requests_per_minute = requests_per_minute or self.settings.rate_limit_per_minute
        self.client = redis.from_url(self.settings.redis_url, encoding="utf-8", decode_responses=True)

    async def dispatch(self, request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
        if request.url.path in {"/health", "/docs", "/openapi.json"}:
            return await call_next(request)
        identity = request.headers.get("authorization") or (request.client.host if request.client else "anonymous")
        key = f"rate:{identity}:{request.url.path}"
        try:
            count = await self.client.incr(key)
            if count == 1:
                await self.client.expire(key, 60)
            if count > self.requests_per_minute:
                return Response(
                    content='{"detail":"Rate limit exceeded","code":"rate_limit_exceeded"}',
                    media_type="application/json",
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                )
        except Exception as exc:
            logger.warning("rate_limit_unavailable", error=str(exc))
        return await call_next(request)
