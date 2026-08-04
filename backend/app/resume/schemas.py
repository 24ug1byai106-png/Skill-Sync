from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ResumeParsedContentRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    skills: list[str]
    projects: list[dict[str, Any]]
    education: list[dict[str, Any]]
    experience: list[dict[str, Any]]
    certificates: list[dict[str, Any]]
    achievements: list[str]
    technical_skills: list[str]
    soft_skills: list[str]
    languages: list[str]
    parser_version: str
    parse_metadata: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class ResumeDetailRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    file_name: str
    file_path: str
    mime_type: str
    size_bytes: int
    parsed_text: str | None
    is_current: bool
    created_at: datetime
    updated_at: datetime
    parsed_content: ResumeParsedContentRead | None = None


class ResumeUpdate(BaseModel):
    is_current: bool | None = None
    parsed_text: str | None = Field(default=None, max_length=250000)


class ResumeAnalysisRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    resume_id: UUID
    score: float
    strengths: list[str]
    weaknesses: list[str]
    missing_keywords: list[str]
    raw_analysis: dict[str, Any]
    created_at: datetime


class ResumeUploadResponse(BaseModel):
    resume: ResumeDetailRead
    analysis: ResumeAnalysisRead | None = None
