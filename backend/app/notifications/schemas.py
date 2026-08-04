from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class NotificationBase(BaseModel):
    title: str = Field(..., max_length=255)
    body: str
    kind: str = Field(..., max_length=60, description="Kind of notification e.g., weekly_mission, roadmap, learning, certificate, github")


class NotificationCreate(NotificationBase):
    user_id: UUID


class NotificationRead(NotificationBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    read_at: datetime | None = None
    created_at: datetime
    updated_at: datetime
