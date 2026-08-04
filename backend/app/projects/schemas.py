from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProjectRecommendationRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    project_id: UUID | None = None
    custom_project: dict[str, Any]
    reason: str
    rank: int
    created_at: datetime
    updated_at: datetime
