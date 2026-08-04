import asyncio
import base64
import json
from datetime import datetime
from typing import Any
from uuid import UUID

import httpx
from sqlalchemy.ext.asyncio import AsyncSession

from app.config.settings import get_settings
from app.core.crypto import decrypt_text, encrypt_text
from app.core.exceptions import AppError
from app.groq.service import GroqService
from app.github.repository import GitHubRepositoryStore
from app.github.schemas import GitHubOAuthConnect
from app.models.entities import GithubAccount, GithubAnalysis
from app.models.extensions import GithubRepositoryInsight
from app.prompts.github_analysis import SYSTEM_PROMPT as GITHUB_ANALYSIS_PROMPT


class GitHubIntegrationService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.settings = get_settings()
        self.store = GitHubRepositoryStore(session)

    async def connect(self, user_id: UUID, payload: GitHubOAuthConnect) -> tuple[GithubAccount, int]:
        token = await self.exchange_code(payload.code, payload.redirect_uri)
        profile, repos = await self.fetch_profile_and_repos(token)
        account = GithubAccount(
            user_id=user_id,
            github_user_id=str(profile["id"]),
            username=profile["login"],
            access_token_encrypted=encrypt_text(token),
            profile_url=profile.get("html_url"),
        )
        self.session.add(account)
        await self.session.flush()
        count = await self.sync_repositories(user_id, account.id, access_token=token, initial_repos=repos)
        await self.session.refresh(account)
        return account, count

    async def exchange_code(self, code: str, redirect_uri: str) -> str:
        async with httpx.AsyncClient(timeout=20) as client:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                headers={"Accept": "application/json"},
                json={
                    "client_id": self.settings.github_client_id,
                    "client_secret": self.settings.github_client_secret,
                    "code": code,
                    "redirect_uri": redirect_uri,
                },
            )
        data = response.json()
        token = data.get("access_token")
        if not token:
            raise AppError("GitHub OAuth exchange failed", 400, "github_oauth_failed")
        return token

    async def fetch_profile_and_repos(self, token: str) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        async with httpx.AsyncClient(timeout=30) as client:
            profile = await client.get("https://api.github.com/user", headers=self._headers(token))
            repos = await client.get("https://api.github.com/user/repos?per_page=100&sort=updated", headers=self._headers(token))
        if profile.status_code >= 400 or repos.status_code >= 400:
            raise AppError("GitHub API request failed", 502, "github_api_error")
        return profile.json(), repos.json()

    async def sync_repositories(
        self,
        user_id: UUID,
        account_id: UUID,
        *,
        access_token: str | None = None,
        initial_repos: list[dict[str, Any]] | None = None,
    ) -> int:
        account = await self.store.get_account(user_id, account_id)
        token = access_token or self._account_token(account)
        repos = initial_repos if initial_repos is not None else (await self.fetch_profile_and_repos(token))[1]
        for repo in repos:
            await self.store.upsert_repository(
                account,
                {
                    "external_id": str(repo["id"]),
                    "name": repo["name"],
                    "full_name": repo["full_name"],
                    "description": repo.get("description"),
                    "language": repo.get("language"),
                    "stars": repo.get("stargazers_count", 0),
                    "forks": repo.get("forks_count", 0),
                    "pushed_at": self._parse_datetime(repo.get("pushed_at")),
                    "topics": repo.get("topics", []),
                },
            )
        return len(repos)

    async def analyze_repository(self, user_id: UUID, repository_id: UUID) -> GithubRepositoryInsight:
        repository = await self.store.get_repository(user_id, repository_id)
        account = await self.store.get_account(user_id, repository.github_account_id)
        token = self._account_token(account)
        metadata = await self.fetch_repository_metadata(token, repository.full_name)
        result = await GroqService().complete_json(
            GITHUB_ANALYSIS_PROMPT,
            json.dumps({"repository": repository.full_name, "metadata": metadata}, default=str),
        )
        insight = GithubRepositoryInsight(
            user_id=user_id,
            github_account_id=account.id,
            github_repository_id=repository.id,
            repository_score=float(result.get("repository_score", 0)),
            readme_score=float(result.get("readme_score", 0)),
            documentation_score=float(result.get("documentation_score", 0)),
            code_quality_score=float(result.get("code_quality_score", 0)),
            project_complexity=str(result.get("project_complexity", "unknown")),
            technology_stack=result.get("technology_stack", []),
            architecture_quality=str(result.get("architecture_quality", "")),
            suggestions=result.get("suggestions", []),
            repository_metadata=metadata,
            raw_analysis=result,
        )
        return await self.store.upsert_insight(insight)

    async def analyze_account(self, user_id: UUID, account_id: UUID) -> GithubAnalysis:
        account = await self.store.get_account(user_id, account_id)
        repos = await self.sync_repositories(user_id, account.id)
        token = self._account_token(account)
        _, repo_payloads = await self.fetch_profile_and_repos(token)
        language_breakdown: dict[str, int] = {}
        for repo in repo_payloads:
            language = repo.get("language") or "Unknown"
            language_breakdown[language] = language_breakdown.get(language, 0) + 1
        result = await GroqService().complete_json(
            GITHUB_ANALYSIS_PROMPT,
            json.dumps({"repositories_synced": repos, "repositories": repo_payloads[:30]}, default=str),
        )
        score = float(result.get("repository_score", result.get("score", 0)))
        return await self.store.add_account_analysis(
            GithubAnalysis(
                user_id=user_id,
                github_account_id=account.id,
                score=score,
                language_breakdown=language_breakdown,
                signals=result.get("suggestions", []),
                raw_analysis=result,
            )
        )

    async def fetch_repository_metadata(self, token: str, full_name: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=30) as client:
            repo, languages, commits, contributors, readme, tree = await self._fetch_many(client, token, full_name)
        readme_text = ""
        if readme.status_code < 400:
            readme_json = readme.json()
            encoded = readme_json.get("content", "")
            readme_text = base64.b64decode(encoded).decode("utf-8", "ignore") if encoded else ""
        tree_items = tree.json().get("tree", []) if tree.status_code < 400 else []
        return {
            "repository": repo.json() if repo.status_code < 400 else {},
            "languages": languages.json() if languages.status_code < 400 else {},
            "recent_commits": commits.json()[:20] if commits.status_code < 400 else [],
            "contributors": contributors.json()[:20] if contributors.status_code < 400 else [],
            "readme": readme_text[:30000],
            "license": (repo.json().get("license") if repo.status_code < 400 else None),
            "visibility": repo.json().get("visibility") if repo.status_code < 400 else None,
            "last_commit": self._last_commit(commits.json()) if commits.status_code < 400 else None,
            "repository_size": repo.json().get("size") if repo.status_code < 400 else None,
            "project_structure": [item.get("path") for item in tree_items[:300]],
        }

    async def _fetch_many(self, client: httpx.AsyncClient, token: str, full_name: str):
        headers = self._headers(token)
        repo = client.get(f"https://api.github.com/repos/{full_name}", headers=headers)
        languages = client.get(f"https://api.github.com/repos/{full_name}/languages", headers=headers)
        commits = client.get(f"https://api.github.com/repos/{full_name}/commits?per_page=20", headers=headers)
        contributors = client.get(f"https://api.github.com/repos/{full_name}/contributors?per_page=20", headers=headers)
        readme = client.get(f"https://api.github.com/repos/{full_name}/readme", headers=headers)
        tree = client.get(f"https://api.github.com/repos/{full_name}/git/trees/HEAD?recursive=1", headers=headers)
        return await asyncio.gather(repo, languages, commits, contributors, readme, tree)

    def _headers(self, token: str) -> dict[str, str]:
        return {"Authorization": f"Bearer {token}", "Accept": "application/vnd.github+json"}

    def _account_token(self, account: GithubAccount) -> str:
        if not account.access_token_encrypted:
            raise AppError("GitHub account is missing an access token", 409, "github_token_missing")
        return decrypt_text(account.access_token_encrypted)

    def _parse_datetime(self, value: str | None) -> datetime | None:
        return datetime.fromisoformat(value.replace("Z", "+00:00")) if value else None

    def _last_commit(self, commits: list[dict[str, Any]]) -> dict[str, Any] | None:
        if not commits:
            return None
        commit = commits[0].get("commit", {})
        return {"sha": commits[0].get("sha"), "message": commit.get("message"), "date": commit.get("committer", {}).get("date")}
