from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MentorChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    session_id: UUID | None = None


class InterviewPrepRequest(BaseModel):
    target_role: str = Field(..., max_length=160)
    topic: str | None = Field(default="general", max_length=160)
    difficulty: str | None = Field(default="medium", max_length=40)


class ProjectGuidanceRequest(BaseModel):
    project_title: str = Field(..., max_length=255)
    tech_stack: list[str] = Field(default_factory=list)
    question: str = Field(..., max_length=4000)


class MentorChatRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    session_id: UUID
    message: str
    response: str
    context: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class MentorSessionSummary(BaseModel):
    session_id: UUID
    last_message: str
    message_count: int
    updated_at: datetime
