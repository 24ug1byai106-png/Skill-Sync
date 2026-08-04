from functools import lru_cache
from typing import Literal

from pydantic import AnyHttpUrl, Field, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    app_name: str = "SkillPilot AI"
    app_tagline: str = "From Student to Industry Ready."
    environment: Literal["local", "staging", "production"] = "local"
    debug: bool = False
    api_v1_prefix: str = "/api/v1"

    database_url: str = Field(..., description="Async SQLAlchemy PostgreSQL URL")
    supabase_url: AnyHttpUrl
    supabase_key: str
    supabase_service_role_key: str
    supabase_jwt_secret: str
    supabase_storage_bucket: str = "skillpilot"
    field_encryption_key: str | None = None

    groq_api_key: str
    groq_model: str = "llama-3.3-70b-versatile"
    github_client_id: str
    github_client_secret: str
    judge0_url: AnyHttpUrl
    judge0_api_key: str | None = None
    redis_url: str = "redis://localhost:6379/0"

    cors_origins: list[str] = ["http://localhost:3000"]
    allowed_upload_mime_types: set[str] = {
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/png",
        "image/jpeg",
    }
    max_upload_bytes: int = 10 * 1024 * 1024
    rate_limit_per_minute: int = 120
    access_token_expire_minutes: int = 60

    @field_validator("database_url")
    @classmethod
    def require_asyncpg(cls, value: str) -> str:
        if value.startswith("postgresql://"):
            return value.replace("postgresql://", "postgresql+asyncpg://", 1)
        return value


@lru_cache
def get_settings() -> Settings:
    return Settings()
