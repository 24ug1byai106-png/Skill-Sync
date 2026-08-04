from datetime import date, datetime
from typing import Any
from uuid import UUID, uuid4

from sqlalchemy import Boolean, Date, DateTime, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint, func
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import DeclarativeBase, Mapped, declared_attr, mapped_column, relationship


class Base(DeclarativeBase):
    type_annotation_map = {dict[str, Any]: JSONB, list[dict[str, Any]]: JSONB, list[str]: JSONB}


class TableNameMixin:
    @declared_attr.directive
    def __tablename__(cls) -> str:
        chars: list[str] = []
        for char in cls.__name__:
            if char.isupper() and chars:
                chars.append("_")
            chars.append(char.lower())
        return "".join(chars) + "s"


class UUIDPrimaryKeyMixin:
    id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), primary_key=True, default=uuid4)


class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), nullable=False
    )
    deleted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True)


class Entity(Base, TableNameMixin, UUIDPrimaryKeyMixin, TimestampMixin):
    __abstract__ = True


class User(Entity):
    __tablename__ = "users"

    email: Mapped[str] = mapped_column(String(320), unique=True, index=True, nullable=False)
    supabase_user_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), unique=True, index=True, nullable=False)
    role: Mapped[str] = mapped_column(String(32), default="student", nullable=False, index=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    profile: Mapped["Profile | None"] = relationship(back_populates="user", cascade="all, delete-orphan", passive_deletes=True)
    career_goals: Mapped[list["CareerGoal"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    resumes: Mapped[list["Resume"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    certificates: Mapped[list["Certificate"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    github_accounts: Mapped[list["GithubAccount"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    career_dna: Mapped[list["CareerDNA"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    skill_gaps: Mapped[list["SkillGap"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    roadmaps: Mapped[list["Roadmap"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    weekly_missions: Mapped[list["WeeklyMission"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    readiness_scores: Mapped[list["CareerReadiness"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    project_recommendations: Mapped[list["ProjectRecommendation"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    mentor_chats: Mapped[list["MentorChat"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    notifications: Mapped[list["Notification"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    judge0_submissions: Mapped[list["Judge0Submission"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    learning_progress: Mapped[list["LearningProgress"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    achievements: Mapped[list["Achievement"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    learning_streak: Mapped["LearningStreak | None"] = relationship(back_populates="user", cascade="all, delete-orphan")
    activity_logs: Mapped[list["ActivityLog"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    settings: Mapped["Settings | None"] = relationship(back_populates="user", cascade="all, delete-orphan")


class Profile(Entity):
    __tablename__ = "profiles"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    full_name: Mapped[str] = mapped_column(String(200), nullable=False)
    university: Mapped[str | None] = mapped_column(String(200))
    degree: Mapped[str | None] = mapped_column(String(160))
    graduation_year: Mapped[int | None] = mapped_column(Integer)
    location: Mapped[str | None] = mapped_column(String(160))
    bio: Mapped[str | None] = mapped_column(Text)
    profile_image_path: Mapped[str | None] = mapped_column(String(500))

    user: Mapped["User"] = relationship(back_populates="profile")


class CareerGoal(Entity):
    __tablename__ = "career_goals"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(180), nullable=False)
    target_role: Mapped[str] = mapped_column(String(180), nullable=False)
    target_industry: Mapped[str | None] = mapped_column(String(180))
    experience_level: Mapped[str] = mapped_column(String(80), default="entry")
    target_date: Mapped[date | None] = mapped_column(Date)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user: Mapped["User"] = relationship(back_populates="career_goals")
    career_dna: Mapped[list["CareerDNA"]] = relationship(back_populates="career_goal", cascade="all, delete-orphan")
    skill_gaps: Mapped[list["SkillGap"]] = relationship(back_populates="career_goal", cascade="all, delete-orphan")
    roadmaps: Mapped[list["Roadmap"]] = relationship(back_populates="career_goal", cascade="all, delete-orphan")


class CareerDNA(Entity):
    __tablename__ = "career_dna"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    career_goal_id: Mapped[UUID | None] = mapped_column(ForeignKey("career_goals.id", ondelete="SET NULL"), index=True)
    strengths: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    traits: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    interests: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    summary: Mapped[str] = mapped_column(Text, nullable=False)

    user: Mapped["User"] = relationship(back_populates="career_dna")
    career_goal: Mapped["CareerGoal | None"] = relationship(back_populates="career_dna")


class Resume(Entity):
    __tablename__ = "resumes"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(160), nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)
    parsed_text: Mapped[str | None] = mapped_column(Text)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)

    user: Mapped["User"] = relationship(back_populates="resumes")
    analyses: Mapped[list["ResumeAnalysis"]] = relationship(back_populates="resume", cascade="all, delete-orphan")


class Certificate(Entity):
    __tablename__ = "certificates"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    issuer: Mapped[str | None] = mapped_column(String(255))
    issued_at: Mapped[date | None] = mapped_column(Date)
    file_name: Mapped[str] = mapped_column(String(255), nullable=False)
    file_path: Mapped[str] = mapped_column(String(500), nullable=False)
    mime_type: Mapped[str] = mapped_column(String(160), nullable=False)
    size_bytes: Mapped[int] = mapped_column(Integer, nullable=False)

    user: Mapped["User"] = relationship(back_populates="certificates")


class GithubAccount(Entity):
    __tablename__ = "github_accounts"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    github_user_id: Mapped[str] = mapped_column(String(120), nullable=False)
    username: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    access_token_encrypted: Mapped[str | None] = mapped_column(Text)
    profile_url: Mapped[str | None] = mapped_column(String(500))

    __table_args__ = (UniqueConstraint("user_id", "github_user_id", name="uq_github_account_user_remote"),)

    user: Mapped["User"] = relationship(back_populates="github_accounts")
    repositories: Mapped[list["GithubRepository"]] = relationship(back_populates="github_account", cascade="all, delete-orphan")
    analyses: Mapped[list["GithubAnalysis"]] = relationship(back_populates="github_account", cascade="all, delete-orphan")


class GithubRepository(Entity):
    __tablename__ = "github_repositories"

    github_account_id: Mapped[UUID] = mapped_column(ForeignKey("github_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    external_id: Mapped[str] = mapped_column(String(120), nullable=False)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    language: Mapped[str | None] = mapped_column(String(100), index=True)
    stars: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    forks: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    pushed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    topics: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)

    __table_args__ = (UniqueConstraint("github_account_id", "external_id", name="uq_github_repo_account_remote"),)

    github_account: Mapped["GithubAccount"] = relationship(back_populates="repositories")


class ResumeAnalysis(Entity):
    __tablename__ = "resume_analysis"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id: Mapped[UUID] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False, index=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    strengths: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    weaknesses: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    missing_keywords: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    raw_analysis: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    resume: Mapped["Resume"] = relationship(back_populates="analyses")


class GithubAnalysis(Entity):
    __tablename__ = "github_analysis"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    github_account_id: Mapped[UUID] = mapped_column(ForeignKey("github_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    score: Mapped[float] = mapped_column(Float, nullable=False)
    language_breakdown: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    signals: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    raw_analysis: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    github_account: Mapped["GithubAccount"] = relationship(back_populates="analyses")


class SkillGap(Entity):
    __tablename__ = "skill_gap"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    career_goal_id: Mapped[UUID | None] = mapped_column(ForeignKey("career_goals.id", ondelete="SET NULL"), index=True)
    required_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    current_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    missing_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    priority: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="skill_gaps")
    career_goal: Mapped["CareerGoal | None"] = relationship(back_populates="skill_gaps")


class Roadmap(Entity):
    __tablename__ = "roadmaps"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    career_goal_id: Mapped[UUID | None] = mapped_column(ForeignKey("career_goals.id", ondelete="SET NULL"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="active", nullable=False, index=True)
    milestones: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)

    user: Mapped["User"] = relationship(back_populates="roadmaps")
    career_goal: Mapped["CareerGoal | None"] = relationship(back_populates="roadmaps")
    missions: Mapped[list["WeeklyMission"]] = relationship(back_populates="roadmap", cascade="all, delete-orphan")


class WeeklyMission(Entity):
    __tablename__ = "weekly_missions"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    roadmap_id: Mapped[UUID | None] = mapped_column(ForeignKey("roadmaps.id", ondelete="SET NULL"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    week_start: Mapped[date] = mapped_column(Date, nullable=False, index=True)
    objectives: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    status: Mapped[str] = mapped_column(String(40), default="pending", nullable=False, index=True)

    user: Mapped["User"] = relationship(back_populates="weekly_missions")
    roadmap: Mapped["Roadmap | None"] = relationship(back_populates="missions")
    progress: Mapped[list["MissionProgress"]] = relationship(back_populates="mission", cascade="all, delete-orphan")


class MissionProgress(Entity):
    __tablename__ = "mission_progress"

    mission_id: Mapped[UUID] = mapped_column(ForeignKey("weekly_missions.id", ondelete="CASCADE"), nullable=False, index=True)
    percent_complete: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    evidence: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    notes: Mapped[str | None] = mapped_column(Text)

    mission: Mapped["WeeklyMission"] = relationship(back_populates="progress")


class CareerReadiness(Entity):
    __tablename__ = "career_readiness"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    overall_score: Mapped[float] = mapped_column(Float, nullable=False)
    resume_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    github_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    skills_score: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    explanation: Mapped[str] = mapped_column(Text, nullable=False)

    user: Mapped["User"] = relationship(back_populates="readiness_scores")


class Project(Entity):
    __tablename__ = "projects"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    estimated_hours: Mapped[int] = mapped_column(Integer, default=20, nullable=False)

    recommendations: Mapped[list["ProjectRecommendation"]] = relationship(back_populates="project")


class ProjectRecommendation(Entity):
    __tablename__ = "project_recommendations"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    project_id: Mapped[UUID | None] = mapped_column(ForeignKey("projects.id", ondelete="SET NULL"), index=True)
    custom_project: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    reason: Mapped[str] = mapped_column(Text, nullable=False)
    rank: Mapped[int] = mapped_column(Integer, default=1, nullable=False)

    user: Mapped["User"] = relationship(back_populates="project_recommendations")
    project: Mapped["Project | None"] = relationship(back_populates="recommendations")


class MentorChat(Entity):
    __tablename__ = "mentor_chats"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    session_id: Mapped[UUID] = mapped_column(PG_UUID(as_uuid=True), default=uuid4, index=True, nullable=False)
    message: Mapped[str] = mapped_column(Text, nullable=False)
    response: Mapped[str] = mapped_column(Text, nullable=False)
    context: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="mentor_chats")


class Notification(Entity):
    __tablename__ = "notifications"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    body: Mapped[str] = mapped_column(Text, nullable=False)
    kind: Mapped[str] = mapped_column(String(60), nullable=False, index=True)
    read_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))

    user: Mapped["User"] = relationship(back_populates="notifications")


class CodingChallenge(Entity):
    __tablename__ = "coding_challenges"

    title: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    prompt: Mapped[str] = mapped_column(Text, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False, index=True)
    language: Mapped[str] = mapped_column(String(80), nullable=False, index=True)
    test_cases: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)

    submissions: Mapped[list["Judge0Submission"]] = relationship(back_populates="challenge")


class Judge0Submission(Entity):
    __tablename__ = "judge0_submissions"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    challenge_id: Mapped[UUID | None] = mapped_column(ForeignKey("coding_challenges.id", ondelete="SET NULL"), index=True)
    judge0_token: Mapped[str | None] = mapped_column(String(180), index=True)
    language_id: Mapped[int] = mapped_column(Integer, nullable=False)
    source_code: Mapped[str] = mapped_column(Text, nullable=False)
    status: Mapped[str] = mapped_column(String(80), default="queued", nullable=False, index=True)
    result: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="judge0_submissions")
    challenge: Mapped["CodingChallenge | None"] = relationship(back_populates="submissions")


class LearningProgress(Entity):
    __tablename__ = "learning_progress"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    skill: Mapped[str] = mapped_column(String(160), nullable=False, index=True)
    percent_complete: Mapped[float] = mapped_column(Float, default=0, nullable=False)
    evidence: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="learning_progress")


class Achievement(Entity):
    __tablename__ = "achievements"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    badge_key: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    awarded_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    user: Mapped["User"] = relationship(back_populates="achievements")


class LearningStreak(Entity):
    __tablename__ = "learning_streak"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    current_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    longest_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    last_activity_date: Mapped[date | None] = mapped_column(Date)

    user: Mapped["User"] = relationship(back_populates="learning_streak")


class ActivityLog(Entity):
    __tablename__ = "activity_logs"

    user_id: Mapped[UUID | None] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), index=True)
    action: Mapped[str] = mapped_column(String(120), nullable=False, index=True)
    entity_type: Mapped[str | None] = mapped_column(String(120), index=True)
    entity_id: Mapped[UUID | None] = mapped_column(PG_UUID(as_uuid=True), index=True)
    event_metadata: Mapped[dict[str, Any]] = mapped_column("metadata", JSONB, default=dict, nullable=False)

    user: Mapped["User | None"] = relationship(back_populates="activity_logs")


class Settings(Entity):
    __tablename__ = "settings"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    email_notifications: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    weekly_digest: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    preferences: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    user: Mapped["User"] = relationship(back_populates="settings")


Index("ix_projects_skills_gin", Project.skills, postgresql_using="gin")
Index("ix_skill_gap_missing_gin", SkillGap.missing_skills, postgresql_using="gin")
