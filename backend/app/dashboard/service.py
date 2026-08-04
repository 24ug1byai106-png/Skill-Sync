import json
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.career.profile_context import build_profile_context
from app.models.entities import Achievement, ActivityLog, CareerDNA, CareerReadiness, LearningProgress, LearningStreak, MissionProgress, SkillGap, WeeklyMission


class DashboardService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def optimized(self, user_id: UUID) -> dict:
        readiness = (
            await self.session.execute(
                select(CareerReadiness).where(CareerReadiness.user_id == user_id).order_by(CareerReadiness.created_at.desc()).limit(1)
            )
        ).scalar_one_or_none()
        dna = (await self.session.execute(select(CareerDNA).where(CareerDNA.user_id == user_id).order_by(CareerDNA.created_at.desc()).limit(1))).scalar_one_or_none()
        gap = (await self.session.execute(select(SkillGap).where(SkillGap.user_id == user_id).order_by(SkillGap.created_at.desc()).limit(1))).scalar_one_or_none()
        missions = (await self.session.execute(select(WeeklyMission).where(WeeklyMission.user_id == user_id))).scalars().all()
        progress = (
            await self.session.execute(
                select(MissionProgress).join(MissionProgress.mission).where(WeeklyMission.user_id == user_id)
            )
        ).scalars().all()
        learning = (await self.session.execute(select(LearningProgress).where(LearningProgress.user_id == user_id))).scalars().all()
        achievements = (await self.session.execute(select(Achievement).where(Achievement.user_id == user_id))).scalars().all()
        streak = (await self.session.execute(select(LearningStreak).where(LearningStreak.user_id == user_id))).scalar_one_or_none()
        activities = (
            await self.session.execute(select(ActivityLog).where(ActivityLog.user_id == user_id).order_by(ActivityLog.created_at.desc()).limit(20))
        ).scalars().all()
        completed_missions = sum(1 for mission in missions if mission.status == "completed")
        mission_progress = round((completed_missions / len(missions)) * 100, 2) if missions else 0.0
        roadmap_completion = round(sum(item.percent_complete for item in progress) / len(progress), 2) if progress else 0.0
        context = await build_profile_context(self.session, user_id)
        return {
            "career_readiness": readiness.overall_score if readiness else 0,
            "resume_score": readiness.resume_score if readiness else 0,
            "github_score": readiness.github_score if readiness else 0,
            "coding_score": 0,
            "skill_score": readiness.skills_score if readiness else 0,
            "mission_progress": mission_progress,
            "learning_progress": [{"skill": item.skill, "percent_complete": item.percent_complete} for item in learning],
            "achievements": [{"title": item.title, "badge_key": item.badge_key, "awarded_at": item.awarded_at} for item in achievements],
            "learning_streak": streak.current_count if streak else 0,
            "roadmap_completion": roadmap_completion,
            "recent_activities": [{"action": item.action, "entity_type": item.entity_type, "created_at": item.created_at} for item in activities],
            "career_dna_summary": dna.summary if dna else None,
            "skill_gap_summary": {"missing_skills": gap.missing_skills, "priority": gap.priority} if gap else None,
            "career_health": json.loads(readiness.explanation) if readiness else {},
            "profile_context": {"career_goal": context.get("career_goal"), "current_skills": context.get("current_skills", [])},
        }
