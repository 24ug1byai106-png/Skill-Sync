from typing import Any
from uuid import UUID

from sqlalchemy import Float, ForeignKey, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.entities import Entity


class ResumeParsedContent(Entity):
    __tablename__ = "resume_parsed_contents"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resume_id: Mapped[UUID] = mapped_column(ForeignKey("resumes.id", ondelete="CASCADE"), unique=True, nullable=False, index=True)
    skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    projects: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    education: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    experience: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    certificates: Mapped[list[dict[str, Any]]] = mapped_column(JSONB, default=list, nullable=False)
    achievements: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    technical_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    soft_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    languages: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    raw_text_hash: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    parser_version: Mapped[str] = mapped_column(String(40), default="resume-parser-v1", nullable=False)
    parse_metadata: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)


class GithubRepositoryInsight(Entity):
    __tablename__ = "github_repository_insights"

    user_id: Mapped[UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    github_account_id: Mapped[UUID] = mapped_column(ForeignKey("github_accounts.id", ondelete="CASCADE"), nullable=False, index=True)
    github_repository_id: Mapped[UUID] = mapped_column(
        ForeignKey("github_repositories.id", ondelete="CASCADE"), nullable=False, index=True
    )
    repository_score: Mapped[float] = mapped_column(Float, nullable=False)
    readme_score: Mapped[float] = mapped_column(Float, nullable=False)
    documentation_score: Mapped[float] = mapped_column(Float, nullable=False)
    code_quality_score: Mapped[float] = mapped_column(Float, nullable=False)
    project_complexity: Mapped[str] = mapped_column(String(80), nullable=False)
    technology_stack: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    architecture_quality: Mapped[str] = mapped_column(Text, nullable=False)
    suggestions: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    repository_metadata: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)
    raw_analysis: Mapped[dict[str, Any]] = mapped_column(JSONB, default=dict, nullable=False)

    repository = relationship("GithubRepository")

    __table_args__ = (
        UniqueConstraint("github_repository_id", name="uq_github_repository_insights_repository"),
    )


class RoleSkillCatalog(Entity):
    __tablename__ = "role_skill_catalog"

    role: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    required_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    preferred_skills: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    tools: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    frameworks: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    certifications: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    difficulty: Mapped[str] = mapped_column(String(40), nullable=False)
    estimated_learning_weeks: Mapped[int] = mapped_column(Integer, nullable=False)
