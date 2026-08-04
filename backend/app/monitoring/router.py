import time
from fastapi import APIRouter, Depends
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from app.cache.redis_client import get_redis_client
from app.config.settings import get_settings
from app.database.session import get_db_session

router = APIRouter()
_start_time = time.time()


@router.get("/liveness")
async def liveness_check() -> dict:
    return {"status": "healthy", "uptime_seconds": round(time.time() - _start_time, 2)}


@router.get("/readiness")
async def readiness_check(session: AsyncSession = Depends(get_db_session)) -> dict:
    db_status = "ok"
    redis_status = "ok"

    # Database check
    try:
        await session.execute(text("SELECT 1"))
    except Exception as exc:
        db_status = f"error: {str(exc)}"

    # Redis check
    try:
        redis_client = await get_redis_client()
        if redis_client:
            await redis_client.ping()
        else:
            redis_status = "unavailable"
    except Exception as exc:
        redis_status = f"error: {str(exc)}"

    is_ready = (db_status == "ok")
    return {
        "ready": is_ready,
        "database": db_status,
        "redis": redis_status,
    }


@router.get("/metrics")
async def service_metrics() -> dict:
    settings = get_settings()
    return {
        "environment": settings.environment,
        "uptime_seconds": round(time.time() - _start_time, 2),
        "app_name": settings.app_name,
        "api_prefix": settings.api_v1_prefix,
        "services": {
            "database": "configured",
            "redis": settings.redis_url,
            "groq_model": settings.groq_model,
            "judge0_url": str(settings.judge0_url),
        },
    }
