from datetime import date, datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class MissionProgressCreate(BaseModel):
    percent_complete: float = Field(..., ge=0.0, le=100.0)
    evidence: dict[str, Any] = Field(default_factory=dict)
    notes: str | None = None


class MissionStatusUpdate(BaseModel):
    status: str = Field(..., description="Status of the mission: pending, in_progress, completed, failed")
    evidence: dict[str, Any] = Field(default_factory=dict)
    notes: str | None = None


class WeeklyMissionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    roadmap_id: UUID | None = None
    title: str
    week_start: date
    objectives: list[str]
    status: str
    created_at: datetime
    updated_at: datetime
