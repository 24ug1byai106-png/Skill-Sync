from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AdminUserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    supabase_user_id: UUID
    role: str
    is_active: bool
    created_at: datetime


class AdminUserRoleUpdate(BaseModel):
    role: str = Field(..., description="Role e.g., student, admin, mentor")
    is_active: bool | None = None


class AdminSkillCreate(BaseModel):
    name: str = Field(..., max_length=160)
    category: str = Field(default="technical", max_length=80)
    description: str | None = None


class AdminPromptUpdate(BaseModel):
    prompt_key: str = Field(..., max_length=120)
    prompt_text: str = Field(..., max_length=20000)
