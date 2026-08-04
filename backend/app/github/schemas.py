from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class GitHubOAuthConnect(BaseModel):
    code: str = Field(min_length=4)
    redirect_uri: str = Field(min_length=8, max_length=500)


class GitHubAccountDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    username: str
    github_user_id: str
    profile_url: str | None
    created_at: datetime
    updated_at: datetime


class GitHubRepositoryDetail(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    github_account_id: UUID
    external_id: str
    name: str
    full_name: str
    description: str | None
    language: str | None
    stars: int
    forks: int
    pushed_at: datetime | None
    topics: list[str]


class RepositoryInsightRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    github_repository_id: UUID
    repository_score: float
    readme_score: float
    documentation_score: float
    code_quality_score: float
    project_complexity: str
    technology_stack: list[str]
    architecture_quality: str
    suggestions: list[str]
    repository_metadata: dict[str, Any]
    raw_analysis: dict[str, Any]
    created_at: datetime


class GitHubSyncResponse(BaseModel):
    account: GitHubAccountDetail
    repositories_synced: int


class GitHubAccountAnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    github_account_id: UUID
    score: float
    language_breakdown: dict[str, Any]
    signals: list[str]
    raw_analysis: dict[str, Any]
    created_at: datetime
