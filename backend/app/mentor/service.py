import json
from collections.abc import AsyncIterator
from uuid import UUID, uuid4

from sqlalchemy.ext.asyncio import AsyncSession

from app.career.profile_context import build_profile_context
from app.groq.service import GroqService
from app.mentor.repository import MentorRepository
from app.models.entities import MentorChat
from app.prompts.mentor import SYSTEM_PROMPT as MENTOR_PROMPT


class MentorService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.groq = GroqService()
        self.repo = MentorRepository(session)

    async def reply(self, user_id: UUID, message: str, session_id: UUID | None = None) -> MentorChat:
        active_session_id = session_id or uuid4()
        history = await self.repo.list_session_history(user_id, active_session_id, limit=10)
        formatted_history = [{"user": chat.message, "mentor": chat.response} for chat in history]
        
        context = await build_profile_context(self.session, user_id)
        payload = {
            "message": message,
            "context": context,
            "conversation_history": formatted_history,
        }
        
        response = await self.groq.complete(MENTOR_PROMPT, json.dumps(payload, default=str), json_mode=False)
        chat = MentorChat(user_id=user_id, session_id=active_session_id, message=message, response=response, context=context)
        self.session.add(chat)
        await self.session.flush()
        await self.session.refresh(chat)
        return chat

    async def stream_reply(self, user_id: UUID, message: str, session_id: UUID | None = None) -> AsyncIterator[str]:
        active_session_id = session_id or uuid4()
        history = await self.repo.list_session_history(user_id, active_session_id, limit=10)
        formatted_history = [{"user": chat.message, "mentor": chat.response} for chat in history]
        
        context = await build_profile_context(self.session, user_id)
        payload = {
            "message": message,
            "context": context,
            "conversation_history": formatted_history,
        }
        
        chunks: list[str] = []
        async for chunk in self.groq.stream(MENTOR_PROMPT, json.dumps(payload, default=str)):
            chunks.append(chunk)
            yield chunk
        chat = MentorChat(user_id=user_id, session_id=active_session_id, message=message, response="".join(chunks), context=context)
        self.session.add(chat)
        await self.session.flush()

    async def get_session_history(self, user_id: UUID, session_id: UUID) -> list[MentorChat]:
        return await self.repo.list_session_history(user_id, session_id)

    async def list_user_sessions(self, user_id: UUID) -> list[dict]:
        return await self.repo.list_user_sessions(user_id)

    async def generate_interview_prep(self, user_id: UUID, target_role: str, topic: str = "general", difficulty: str = "medium") -> MentorChat:
        message = f"Generate 5 mock technical interview questions for role '{target_role}' focused on topic '{topic}' with difficulty '{difficulty}', along with ideal answers and evaluation criteria."
        return await self.reply(user_id, message)

    async def generate_project_guidance(self, user_id: UUID, project_title: str, tech_stack: list[str], question: str) -> MentorChat:
        message = f"Project Guidance for '{project_title}' (Stack: {', '.join(tech_stack)}): {question}"
        return await self.reply(user_id, message)

