import asyncio
import json
from collections.abc import AsyncIterator
from typing import Any

import httpx

from app.config.settings import get_settings
from app.core.exceptions import AppError
from app.core.logging import get_logger

logger = get_logger(__name__)


class GroqService:
    def __init__(self, timeout_seconds: float = 60.0, max_retries: int = 3) -> None:
        self.settings = get_settings()
        self.timeout = httpx.Timeout(timeout_seconds, connect=10.0)
        self.max_retries = max_retries

    def _headers(self) -> dict[str, str]:
        return {"Authorization": f"Bearer {self.settings.groq_api_key}", "Content-Type": "application/json"}

    async def complete(
        self,
        system_prompt: str,
        user_prompt: str,
        *,
        json_mode: bool = True,
        temperature: float = 0.2,
    ) -> str:
        payload: dict[str, Any] = {
            "model": self.settings.groq_model,
            "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            "temperature": temperature,
            "stream": False,
        }
        if json_mode:
            payload["response_format"] = {"type": "json_object"}

        for attempt in range(1, self.max_retries + 1):
            try:
                async with httpx.AsyncClient(timeout=self.timeout) as client:
                    response = await client.post(
                        "https://api.groq.com/openai/v1/chat/completions",
                        headers=self._headers(),
                        json=payload,
                    )
                if response.status_code < 500:
                    break
                logger.warning("groq_retryable_error", status=response.status_code, attempt=attempt)
            except (httpx.TimeoutException, httpx.NetworkError) as exc:
                logger.warning("groq_transport_retry", error=str(exc), attempt=attempt)
                if attempt == self.max_retries:
                    raise AppError("Groq request timed out", 504, "groq_timeout") from exc
            await asyncio.sleep(0.5 * attempt)
        else:
            raise AppError("Groq request failed after retries", 502, "groq_unavailable")

        if response.status_code >= 400:
            logger.error("groq_request_failed", status=response.status_code, body=response.text[:500])
            raise AppError("Groq rejected the request", 502, "groq_provider_error")
        return str(response.json()["choices"][0]["message"]["content"])

    async def complete_json(self, system_prompt: str, user_prompt: str, *, temperature: float = 0.2) -> dict[str, Any]:
        content = await self.complete(system_prompt, user_prompt, json_mode=True, temperature=temperature)
        try:
            parsed = json.loads(content)
        except json.JSONDecodeError as exc:
            logger.error("groq_invalid_json", content=content[:1000])
            raise AppError("Groq returned invalid JSON", 502, "groq_invalid_json") from exc
        if not isinstance(parsed, dict):
            raise AppError("Groq JSON response must be an object", 502, "groq_invalid_json_shape")
        return parsed

    async def stream(
        self,
        system_prompt: str,
        user_prompt: str,
        *,
        temperature: float = 0.3,
    ) -> AsyncIterator[str]:
        payload = {
            "model": self.settings.groq_model,
            "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
            "temperature": temperature,
            "stream": True,
        }
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                "https://api.groq.com/openai/v1/chat/completions",
                headers=self._headers(),
                json=payload,
            ) as response:
                if response.status_code >= 400:
                    body = await response.aread()
                    logger.error("groq_stream_failed", status=response.status_code, body=body[:500].decode("utf-8", "ignore"))
                    raise AppError("Groq streaming request failed", 502, "groq_stream_error")
                async for line in response.aiter_lines():
                    if not line.startswith("data: "):
                        continue
                    event = line.removeprefix("data: ").strip()
                    if event == "[DONE]":
                        break
                    chunk = json.loads(event)
                    delta = chunk["choices"][0].get("delta", {})
                    text = delta.get("content")
                    if text:
                        yield text
