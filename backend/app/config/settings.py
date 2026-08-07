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

    database_url: str = "sqlite+aiosqlite:///./skillsync.db"
    supabase_url: str = "https://pylupxecznfdwnurlyvj.supabase.co"
    supabase_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bHVweGVjem5mZHdudXJseXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NTIyMzYsImV4cCI6MjEwMTQyODIzNn0.sBYXok6BvMaZmJ5uyakyaJc-o3vuB8aiseh8QCIonCE"
    supabase_service_role_key: str = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5bHVweGVjem5mZHdudXJseXZqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU4NTIyMzYsImV4cCI6MjEwMTQyODIzNn0.sBYXok6BvMaZmJ5uyakyaJc-o3vuB8aiseh8QCIonCE"
    supabase_jwt_secret: str = "sBYXok6BvMaZmJ5uyakyaJc-o3vuB8aiseh8QCIonCE"
    supabase_storage_bucket: str = "skillsync"
    field_encryption_key: str | None = "32chars_encryption_secret_key_123"

    groq_api_key: str = "your_groq_api_key_placeholder"
    groq_model: str = "llama-3.3-70b-versatile"
    github_client_id: str = "your-github-oauth-client-id"
    github_client_secret: str = "your-github-oauth-client-secret"
    judge0_url: str = "https://judge0-ce.p.rapidapi.com"
    judge0_api_key: str | None = "your-judge0-api-key"
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
