import os

os.environ.setdefault("DATABASE_URL", "postgresql+asyncpg://skillpilot:skillpilot@localhost:5432/skillpilot")
os.environ.setdefault("SUPABASE_URL", "https://example.supabase.co")
os.environ.setdefault("SUPABASE_KEY", "anon")
os.environ.setdefault("SUPABASE_SERVICE_ROLE_KEY", "service")
os.environ.setdefault("SUPABASE_JWT_SECRET", "secret")
os.environ.setdefault("GROQ_API_KEY", "groq")
os.environ.setdefault("GITHUB_CLIENT_ID", "github-client")
os.environ.setdefault("GITHUB_CLIENT_SECRET", "github-secret")
os.environ.setdefault("JUDGE0_URL", "https://judge0.example.com")
os.environ.setdefault("REDIS_URL", "redis://localhost:6379/0")

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.mark.asyncio
async def test_monitoring_liveness() -> None:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/monitoring/liveness")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


@pytest.mark.asyncio
async def test_monitoring_metrics() -> None:
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.get("/api/v1/monitoring/metrics")
    assert response.status_code == 200
    assert "uptime_seconds" in response.json()
