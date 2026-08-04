from datetime import date, datetime
from typing import Any, Generic, TypeVar
from uuid import UUID

from pydantic import BaseModel, ConfigDict, EmailStr, Field

T = TypeVar("T")


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UUIDTimestampSchema(ORMModel):
    id: UUID
    created_at: datetime
    updated_at: datetime
    deleted_at: datetime | None = None


class Page(ORMModel, Generic[T]):
    items: list[T]
    total: int
    limit: int
    offset: int


class MessageResponse(BaseModel):
    message: str


class UserRead(UUIDTimestampSchema):
    email: EmailStr
    supabase_user_id: UUID
    role: str
    is_active: bool


class ProfileCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=200)
    university: str | None = Field(default=None, max_length=200)
    degree: str | None = Field(default=None, max_length=160)
    graduation_year: int | None = Field(default=None, ge=1950, le=2100)
    location: str | None = Field(default=None, max_length=160)
    bio: str | None = Field(default=None, max_length=5000)
    profile_image_path: str | None = Field(default=None, max_length=500)


class ProfileRead(UUIDTimestampSchema, ProfileCreate):
    user_id: UUID


class CareerGoalCreate(BaseModel):
    title: str = Field(min_length=2, max_length=180)
    target_role: str = Field(min_length=2, max_length=180)
    target_industry: str | None = Field(default=None, max_length=180)
    experience_level: str = Field(default="entry", max_length=80)
    target_date: date | None = None
    is_active: bool = True


class CareerGoalRead(UUIDTimestampSchema, CareerGoalCreate):
    user_id: UUID


class ResumeRead(UUIDTimestampSchema):
    user_id: UUID
    file_name: str
    file_path: str
    mime_type: str
    size_bytes: int
    parsed_text: str | None
    is_current: bool


class CertificateCreate(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    issuer: str | None = Field(default=None, max_length=255)
    issued_at: date | None = None


class CertificateRead(UUIDTimestampSchema, CertificateCreate):
    user_id: UUID
    file_name: str
    file_path: str
    mime_type: str
    size_bytes: int


class GithubConnectRequest(BaseModel):
    code: str = Field(min_length=4)
    redirect_uri: str = Field(min_length=8, max_length=500)


class GithubAccountRead(UUIDTimestampSchema):
    user_id: UUID
    github_user_id: str
    username: str
    profile_url: str | None


class AnalysisRead(UUIDTimestampSchema):
    user_id: UUID
    score: float
    raw_analysis: dict[str, Any]


class CareerSnapshot(ORMModel):
    career_dna: dict[str, Any]
    skill_gap: dict[str, Any]
    readiness: dict[str, Any]
    roadmap: dict[str, Any]
    missions: list[dict[str, Any]]
    projects: list[dict[str, Any]]


class RoadmapRead(UUIDTimestampSchema):
    user_id: UUID
    career_goal_id: UUID | None
    title: str
    status: str
    milestones: list[dict[str, Any]]


class WeeklyMissionRead(UUIDTimestampSchema):
    user_id: UUID
    roadmap_id: UUID | None
    title: str
    week_start: date
    objectives: list[str]
    status: str


class MissionProgressUpdate(BaseModel):
    percent_complete: float = Field(ge=0, le=100)
    evidence: dict[str, Any] = Field(default_factory=dict)
    notes: str | None = Field(default=None, max_length=5000)


class MentorMessageCreate(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    session_id: UUID | None = None
    context: dict[str, Any] = Field(default_factory=dict)


class MentorChatRead(UUIDTimestampSchema):
    user_id: UUID
    session_id: UUID
    message: str
    response: str
    context: dict[str, Any]


class NotificationRead(UUIDTimestampSchema):
    user_id: UUID
    title: str
    body: str
    kind: str
    read_at: datetime | None


class ProjectRead(UUIDTimestampSchema):
    title: str
    description: str
    difficulty: str
    skills: list[str]
    estimated_hours: int


class ProjectRecommendationRead(UUIDTimestampSchema):
    user_id: UUID
    project_id: UUID | None
    custom_project: dict[str, Any]
    reason: str
    rank: int


class Judge0SubmissionCreate(BaseModel):
    challenge_id: UUID | None = None
    language_id: int = Field(gt=0)
    source_code: str = Field(min_length=1, max_length=200000)
    stdin: str | None = Field(default=None, max_length=20000)
    expected_output: str | None = Field(default=None, max_length=20000)


class Judge0SubmissionRead(UUIDTimestampSchema):
    user_id: UUID
    challenge_id: UUID | None
    judge0_token: str | None
    language_id: int
    source_code: str
    status: str
    result: dict[str, Any]


class DashboardRead(ORMModel):
    career_readiness_score: float
    resume_score: float
    github_score: float
    active_goal: CareerGoalRead | None
    active_missions: list[WeeklyMissionRead]
    notifications_unread: int
    streak_days: int
