from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import MentorChat
from app.repositories.base import BaseRepository


class MentorRepository(BaseRepository[MentorChat]):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(MentorChat, session)

    async def list_session_history(self, user_id: UUID, session_id: UUID, limit: int = 50) -> list[MentorChat]:
        rows = (
            await self.session.execute(
                select(MentorChat)
                .where(MentorChat.user_id == user_id, MentorChat.session_id == session_id, MentorChat.deleted_at.is_(None))
                .order_by(MentorChat.created_at.asc())
                .limit(limit)
            )
        ).scalars().all()
        return list(rows)

    async def list_user_sessions(self, user_id: UUID) -> list[dict]:
        subquery = (
            select(
                MentorChat.session_id,
                func.max(MentorChat.created_at).label("last_updated"),
                func.count(MentorChat.id).label("cnt"),
            )
            .where(MentorChat.user_id == user_id, MentorChat.deleted_at.is_(None))
            .group_by(MentorChat.session_id)
            .subquery()
        )
        
        query = select(MentorChat).join(
            subquery,
            (MentorChat.session_id == subquery.c.session_id) & (MentorChat.created_at == subquery.c.last_updated),
        ).order_by(subquery.c.last_updated.desc())
        
        chats = (await self.session.execute(query)).scalars().all()
        
        result = []
        for chat in chats:
            result.append({
                "session_id": chat.session_id,
                "last_message": chat.message[:100],
                "message_count": 1,
                "updated_at": chat.created_at,
            })
        return result
