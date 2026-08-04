import json
from typing import Any

import httpx

from app.config.settings import get_settings
from app.core.exceptions import AppError
from app.core.logging import get_logger
from app.prompts.career import CAREER_SYSTEM_PROMPT, MENTOR_SYSTEM_PROMPT

logger = get_logger(__name__)


class AIService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def complete_json(self, system_prompt: str, user_prompt: str) -> dict[str, Any]:
        payload = {
            "model": self.settings.groq_model,
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0.2,
            "response_format": {"type": "json_object"},
        }
        headers = {"Authorization": f"Bearer {self.settings.groq_api_key}", "Content-Type": "application/json"}
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post("https://api.groq.com/openai/v1/chat/completions", headers=headers, json=payload)
        if response.status_code >= 400:
            logger.error("groq_completion_failed", status=response.status_code, body=response.text[:500])
            raise AppError("AI analysis failed", 502, "ai_provider_error")
        content = response.json()["choices"][0]["message"]["content"]
        try:
            return json.loads(content)
        except json.JSONDecodeError as exc:
            logger.error("groq_invalid_json", content=content[:500])
            raise AppError("AI provider returned invalid JSON", 502, "ai_invalid_json") from exc

    async def career_snapshot(self, inputs: dict[str, Any]) -> dict[str, Any]:
        prompt = json.dumps(inputs, default=str)
        return await self.complete_json(CAREER_SYSTEM_PROMPT, prompt)

    async def mentor_reply(self, message: str, context: dict[str, Any]) -> str:
        result = await self.complete_json(MENTOR_SYSTEM_PROMPT, json.dumps({"message": message, "context": context}, default=str))
        return str(result.get("response", "I could not generate a mentor response."))
