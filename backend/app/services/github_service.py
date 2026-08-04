from typing import Any

import httpx

from app.config.settings import get_settings
from app.core.exceptions import AppError


class GitHubService:
    def __init__(self) -> None:
        self.settings = get_settings()

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

    async def fetch_profile_and_repos(self, access_token: str) -> tuple[dict[str, Any], list[dict[str, Any]]]:
        headers = {"Authorization": f"Bearer {access_token}", "Accept": "application/vnd.github+json"}
        async with httpx.AsyncClient(timeout=30) as client:
            profile_response = await client.get("https://api.github.com/user", headers=headers)
            repo_response = await client.get("https://api.github.com/user/repos?per_page=100&sort=updated", headers=headers)
        if profile_response.status_code >= 400 or repo_response.status_code >= 400:
            raise AppError("GitHub API request failed", 502, "github_api_error")
        return profile_response.json(), repo_response.json()
