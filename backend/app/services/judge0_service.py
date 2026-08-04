from typing import Any

import httpx

from app.config.settings import get_settings
from app.core.exceptions import AppError


class Judge0Service:
    def __init__(self) -> None:
        self.settings = get_settings()

    def _headers(self) -> dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.settings.judge0_api_key:
            headers["X-RapidAPI-Key"] = self.settings.judge0_api_key
        return headers

    async def submit(self, language_id: int, source_code: str, stdin: str | None, expected_output: str | None) -> dict[str, Any]:
        payload = {
            "language_id": language_id,
            "source_code": source_code,
            "stdin": stdin,
            "expected_output": expected_output,
        }
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.post(
                f"{self.settings.judge0_url}/submissions?base64_encoded=false&wait=false",
                headers=self._headers(),
                json=payload,
            )
        if response.status_code >= 400:
            raise AppError("Judge0 submission failed", 502, "judge0_error")
        return response.json()

    async def get_submission(self, token: str) -> dict[str, Any]:
        async with httpx.AsyncClient(timeout=30) as client:
            response = await client.get(
                f"{self.settings.judge0_url}/submissions/{token}?base64_encoded=false",
                headers=self._headers(),
            )
        if response.status_code >= 400:
            raise AppError("Judge0 lookup failed", 502, "judge0_error")
        return response.json()
