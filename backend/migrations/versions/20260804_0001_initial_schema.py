"""initial schema

Revision ID: 20260804_0001
Revises:
Create Date: 2026-08-04
"""
from collections.abc import Sequence

from alembic import op

from app.database.base import Base

revision: str = "20260804_0001"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

RLS_TABLES = [
    "profiles",
    "career_goals",
    "career_dna",
    "resumes",
    "certificates",
    "github_accounts",
    "resume_analysis",
    "github_analysis",
    "skill_gap",
    "roadmaps",
    "weekly_missions",
    "career_readiness",
    "project_recommendations",
    "mentor_chats",
    "notifications",
    "judge0_submissions",
    "learning_progress",
    "achievements",
    "learning_streak",
    "settings",
]


def upgrade() -> None:
    bind = op.get_bind()
    Base.metadata.create_all(bind=bind)
    for table in RLS_TABLES:
        op.execute(f"ALTER TABLE {table} ENABLE ROW LEVEL SECURITY")


def downgrade() -> None:
    bind = op.get_bind()
    Base.metadata.drop_all(bind=bind)
