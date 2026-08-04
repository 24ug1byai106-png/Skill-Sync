"""feature extension tables

Revision ID: 20260804_0002
Revises: 20260804_0001
Create Date: 2026-08-04
"""
from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "20260804_0002"
down_revision: str | None = "20260804_0001"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _timestamps() -> list[sa.Column]:
    return [
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("deleted_at", sa.DateTime(timezone=True), nullable=True),
    ]


def upgrade() -> None:
    op.create_table(
        "resume_parsed_contents",
        *_timestamps(),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("resume_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("resumes.id", ondelete="CASCADE"), nullable=False),
        sa.Column("skills", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("projects", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("education", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("experience", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("certificates", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("achievements", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("technical_skills", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("soft_skills", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("languages", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("raw_text_hash", sa.String(length=64), nullable=False),
        sa.Column("parser_version", sa.String(length=40), nullable=False),
        sa.Column("parse_metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.UniqueConstraint("resume_id", name="uq_resume_parsed_contents_resume"),
    )
    op.create_index("ix_resume_parsed_contents_deleted_at", "resume_parsed_contents", ["deleted_at"])
    op.create_index("ix_resume_parsed_contents_user_id", "resume_parsed_contents", ["user_id"])
    op.create_index("ix_resume_parsed_contents_resume_id", "resume_parsed_contents", ["resume_id"])
    op.create_index("ix_resume_parsed_contents_raw_text_hash", "resume_parsed_contents", ["raw_text_hash"])

    op.create_table(
        "github_repository_insights",
        *_timestamps(),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column(
            "github_account_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("github_accounts.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column(
            "github_repository_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("github_repositories.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("repository_score", sa.Float(), nullable=False),
        sa.Column("readme_score", sa.Float(), nullable=False),
        sa.Column("documentation_score", sa.Float(), nullable=False),
        sa.Column("code_quality_score", sa.Float(), nullable=False),
        sa.Column("project_complexity", sa.String(length=80), nullable=False),
        sa.Column("technology_stack", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("architecture_quality", sa.Text(), nullable=False),
        sa.Column("suggestions", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("repository_metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("raw_analysis", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.UniqueConstraint("github_repository_id", name="uq_github_repository_insights_repository"),
    )
    op.create_index("ix_github_repository_insights_deleted_at", "github_repository_insights", ["deleted_at"])
    op.create_index("ix_github_repository_insights_user_id", "github_repository_insights", ["user_id"])
    op.create_index("ix_github_repository_insights_account", "github_repository_insights", ["github_account_id"])
    op.create_index("ix_github_repository_insights_repository", "github_repository_insights", ["github_repository_id"])

    op.create_table(
        "role_skill_catalog",
        *_timestamps(),
        sa.Column("role", sa.String(length=120), nullable=False),
        sa.Column("required_skills", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("preferred_skills", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("tools", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("frameworks", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("certifications", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("difficulty", sa.String(length=40), nullable=False),
        sa.Column("estimated_learning_weeks", sa.Integer(), nullable=False),
        sa.UniqueConstraint("role", name="uq_role_skill_catalog_role"),
    )
    op.create_index("ix_role_skill_catalog_deleted_at", "role_skill_catalog", ["deleted_at"])
    op.create_index("ix_role_skill_catalog_role", "role_skill_catalog", ["role"])

    for table in ("resume_parsed_contents", "github_repository_insights", "role_skill_catalog"):
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    op.drop_table("role_skill_catalog")
    op.drop_table("github_repository_insights")
    op.drop_table("resume_parsed_contents")
