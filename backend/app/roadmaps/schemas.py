from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class RoadmapMilestone(BaseModel):
    weekly_plan: list[dict[str, Any]] = Field(default_factory=list)
    monthly_plan: list[dict[str, Any]] = Field(default_factory=list)
    daily_tasks: list[dict[str, Any]] = Field(default_factory=list)
    recommended_courses: list[dict[str, Any]] = Field(default_factory=list)
    youtube_resources: list[dict[str, Any]] = Field(default_factory=list)
    documentation: list[dict[str, Any]] = Field(default_factory=list)
    certifications: list[dict[str, Any]] = Field(default_factory=list)
    mini_projects: list[dict[str, Any]] = Field(default_factory=list)
    major_projects: list[dict[str, Any]] = Field(default_factory=list)
    expected_completion_date: str | None = None
    difficulty: str | None = None
    progress_percent: float = 0.0


class RoadmapGenerateRequest(BaseModel):
    career_goal: str | None = None
    available_hours_per_week: int = Field(default=8, ge=1, le=80)


class RoadmapProgressUpdate(BaseModel):
    progress_percent: float = Field(..., ge=0.0, le=100.0)
    completed_task_id: str | None = None
    notes: str | None = None


class RoadmapRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    career_goal_id: UUID | None = None
    title: str
    status: str
    milestones: list[dict[str, Any]]
    created_at: datetime
    updated_at: datetime
