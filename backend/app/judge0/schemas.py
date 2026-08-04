from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class CodeExecutionRequest(BaseModel):
    language: str = Field(..., description="Programming language: python, java, cpp/c++, javascript, go, rust")
    source_code: str = Field(..., min_length=1, max_length=200000)
    stdin: str | None = Field(default=None, max_length=20000)
    expected_output: str | None = Field(default=None, max_length=20000)


class Judge0SubmissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    challenge_id: UUID | None = None
    judge0_token: str | None = None
    language_id: int
    source_code: str
    status: str
    result: dict[str, Any]
    created_at: datetime
    updated_at: datetime


class CodingScoreRead(BaseModel):
    coding_score: float
    accepted_count: int
    total_submissions: int
