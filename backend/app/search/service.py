from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import (
    CareerGoal,
    Certificate,
    MentorChat,
    Notification,
    ProjectRecommendation,
    Roadmap,
)


class SearchService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def search(
        self,
        user_id: UUID,
        query: str,
        entity_types: list[str] | None = None,
        sort_order: str = "desc",
        limit: int = 50,
        offset: int = 0,
    ) -> tuple[list[dict], int]:
        pattern = f"%{query.strip()}%"
        types = set(entity_types) if entity_types else {"project", "roadmap", "certificate", "career_goal", "mentor_chat", "notification"}
        items: list[dict] = []

        if "career_goal" in types:
            goals = (
                await self.session.execute(
                    select(CareerGoal).where(
                        CareerGoal.user_id == user_id,
                        CareerGoal.title.ilike(pattern) | CareerGoal.target_role.ilike(pattern),
                        CareerGoal.deleted_at.is_(None),
                    )
                )
            ).scalars().all()
            for g in goals:
                items.append({
                    "entity_type": "career_goal",
                    "entity_id": g.id,
                    "title": g.title,
                    "description": f"Target Role: {g.target_role}",
                    "metadata": {"experience_level": g.experience_level},
                    "created_at": g.created_at,
                })

        if "roadmap" in types:
            roadmaps = (
                await self.session.execute(
                    select(Roadmap).where(
                        Roadmap.user_id == user_id,
                        Roadmap.title.ilike(pattern),
                        Roadmap.deleted_at.is_(None),
                    )
                )
            ).scalars().all()
            for r in roadmaps:
                items.append({
                    "entity_type": "roadmap",
                    "entity_id": r.id,
                    "title": r.title,
                    "description": f"Status: {r.status}",
                    "metadata": {},
                    "created_at": r.created_at,
                })

        if "certificate" in types:
            certs = (
                await self.session.execute(
                    select(Certificate).where(
                        Certificate.user_id == user_id,
                        Certificate.title.ilike(pattern) | Certificate.issuer.ilike(pattern),
                        Certificate.deleted_at.is_(None),
                    )
                )
            ).scalars().all()
            for c in certs:
                items.append({
                    "entity_type": "certificate",
                    "entity_id": c.id,
                    "title": c.title,
                    "description": f"Issuer: {c.issuer or 'Unknown'}",
                    "metadata": {"file_name": c.file_name},
                    "created_at": c.created_at,
                })

        if "mentor_chat" in types:
            chats = (
                await self.session.execute(
                    select(MentorChat).where(
                        MentorChat.user_id == user_id,
                        MentorChat.message.ilike(pattern) | MentorChat.response.ilike(pattern),
                        MentorChat.deleted_at.is_(None),
                    )
                )
            ).scalars().all()
            for ch in chats:
                items.append({
                    "entity_type": "mentor_chat",
                    "entity_id": ch.id,
                    "title": f"Chat: {ch.message[:50]}...",
                    "description": ch.response[:150],
                    "metadata": {"session_id": ch.session_id},
                    "created_at": ch.created_at,
                })

        if "notification" in types:
            notifs = (
                await self.session.execute(
                    select(Notification).where(
                        Notification.user_id == user_id,
                        Notification.title.ilike(pattern) | Notification.body.ilike(pattern),
                        Notification.deleted_at.is_(None),
                    )
                )
            ).scalars().all()
            for n in notifs:
                items.append({
                    "entity_type": "notification",
                    "entity_id": n.id,
                    "title": n.title,
                    "description": n.body,
                    "metadata": {"kind": n.kind},
                    "created_at": n.created_at,
                })

        if "project" in types:
            recs = (
                await self.session.execute(
                    select(ProjectRecommendation).where(
                        ProjectRecommendation.user_id == user_id,
                        ProjectRecommendation.reason.ilike(pattern),
                        ProjectRecommendation.deleted_at.is_(None),
                    )
                )
            ).scalars().all()
            for pr in recs:
                title = pr.custom_project.get("title", pr.custom_project.get("name", f"Project Recommendation #{pr.rank}"))
                items.append({
                    "entity_type": "project",
                    "entity_id": pr.id,
                    "title": title,
                    "description": pr.reason,
                    "metadata": {"rank": pr.rank},
                    "created_at": pr.created_at,
                })

        reverse = (sort_order.lower() == "desc")
        items.sort(key=lambda x: x["created_at"] or datetime.min, reverse=reverse)
        
        paginated = items[offset : offset + limit]
        return paginated, len(items)
