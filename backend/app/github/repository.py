from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.entities import GithubAccount, GithubAnalysis, GithubRepository
from app.models.extensions import GithubRepositoryInsight


class GitHubRepositoryStore:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_account(self, user_id: UUID, account_id: UUID) -> GithubAccount:
        account = (
            await self.session.execute(
                select(GithubAccount).where(
                    GithubAccount.id == account_id,
                    GithubAccount.user_id == user_id,
                    GithubAccount.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if account is None:
            raise NotFoundError("GitHub account")
        return account

    async def list_accounts(self, user_id: UUID) -> list[GithubAccount]:
        return list(
            (
                await self.session.execute(
                    select(GithubAccount)
                    .where(GithubAccount.user_id == user_id, GithubAccount.deleted_at.is_(None))
                    .order_by(GithubAccount.created_at.desc())
                )
            )
            .scalars()
            .all()
        )

    async def get_repository(self, user_id: UUID, repository_id: UUID) -> GithubRepository:
        repository = (
            await self.session.execute(
                select(GithubRepository)
                .join(GithubAccount, GithubAccount.id == GithubRepository.github_account_id)
                .where(
                    GithubRepository.id == repository_id,
                    GithubAccount.user_id == user_id,
                    GithubRepository.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if repository is None:
            raise NotFoundError("GitHub repository")
        return repository

    async def upsert_repository(self, account: GithubAccount, values: dict) -> GithubRepository:
        existing = (
            await self.session.execute(
                select(GithubRepository).where(
                    GithubRepository.github_account_id == account.id,
                    GithubRepository.external_id == values["external_id"],
                    GithubRepository.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if existing is None:
            existing = GithubRepository(github_account_id=account.id, **values)
            self.session.add(existing)
        else:
            for key, value in values.items():
                setattr(existing, key, value)
        await self.session.flush()
        await self.session.refresh(existing)
        return existing

    async def upsert_insight(self, insight: GithubRepositoryInsight) -> GithubRepositoryInsight:
        existing = (
            await self.session.execute(
                select(GithubRepositoryInsight).where(
                    GithubRepositoryInsight.github_repository_id == insight.github_repository_id,
                    GithubRepositoryInsight.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if existing is None:
            self.session.add(insight)
            await self.session.flush()
            await self.session.refresh(insight)
            return insight
        for field in (
            "repository_score",
            "readme_score",
            "documentation_score",
            "code_quality_score",
            "project_complexity",
            "technology_stack",
            "architecture_quality",
            "suggestions",
            "repository_metadata",
            "raw_analysis",
        ):
            setattr(existing, field, getattr(insight, field))
        await self.session.flush()
        await self.session.refresh(existing)
        return existing

    async def add_account_analysis(self, analysis: GithubAnalysis) -> GithubAnalysis:
        self.session.add(analysis)
        await self.session.flush()
        await self.session.refresh(analysis)
        return analysis
