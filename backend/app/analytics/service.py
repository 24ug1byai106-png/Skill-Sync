from datetime import UTC, datetime, timedelta

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import (
    ActivityLog,
    CareerReadiness,
    GithubAccount,
    Judge0Submission,
    MentorChat,
    MissionProgress,
    ProjectRecommendation,
    Resume,
    Roadmap,
    User,
    WeeklyMission,
)


class AnalyticsService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_overview(self) -> dict:
        now = datetime.now(UTC)
        one_day_ago = now - timedelta(days=1)
        seven_days_ago = now - timedelta(days=7)
        thirty_days_ago = now - timedelta(days=30)

        # Active Users (Activity logs or created_at)
        total_users = (await self.session.execute(select(func.count(User.id)).where(User.deleted_at.is_(None)))).scalar_one()
        dau = (await self.session.execute(select(func.count(func.distinct(ActivityLog.user_id))).where(ActivityLog.created_at >= one_day_ago))).scalar_one()
        wau = (await self.session.execute(select(func.count(func.distinct(ActivityLog.user_id))).where(ActivityLog.created_at >= seven_days_ago))).scalar_one()
        mau = (await self.session.execute(select(func.count(func.distinct(ActivityLog.user_id))).where(ActivityLog.created_at >= thirty_days_ago))).scalar_one()

        # Telemetry counts
        resumes = (await self.session.execute(select(func.count(Resume.id)).where(Resume.deleted_at.is_(None)))).scalar_one()
        github = (await self.session.execute(select(func.count(GithubAccount.id)).where(GithubAccount.deleted_at.is_(None)))).scalar_one()

        # Missions
        total_missions = (await self.session.execute(select(func.count(WeeklyMission.id)).where(WeeklyMission.deleted_at.is_(None)))).scalar_one()
        completed_missions = (await self.session.execute(select(func.count(WeeklyMission.id)).where(WeeklyMission.status == "completed", WeeklyMission.deleted_at.is_(None)))).scalar_one()
        mission_rate = round((completed_missions / total_missions) * 100, 2) if total_missions else 0.0

        # Career Readiness Score
        avg_score = (await self.session.execute(select(func.avg(CareerReadiness.overall_score)).where(CareerReadiness.deleted_at.is_(None)))).scalar_one() or 0.0

        # AI Mentor Chats
        total_mentor_chats = (await self.session.execute(select(func.count(MentorChat.id)).where(MentorChat.deleted_at.is_(None)))).scalar_one()
        ai_usage_per_user = round(total_mentor_chats / total_users, 2) if total_users else 0.0

        # Roadmaps
        total_roadmaps = (await self.session.execute(select(func.count(Roadmap.id)).where(Roadmap.deleted_at.is_(None)))).scalar_one()
        completed_roadmaps = (await self.session.execute(select(func.count(Roadmap.id)).where(Roadmap.status == "completed", Roadmap.deleted_at.is_(None)))).scalar_one()
        roadmap_completion_rate = round((completed_roadmaps / total_roadmaps) * 100, 2) if total_roadmaps else 0.0

        # Judge0
        coding_submissions = (await self.session.execute(select(func.count(Judge0Submission.id)).where(Judge0Submission.deleted_at.is_(None)))).scalar_one()

        # Project Recommendations
        project_recs = (await self.session.execute(select(func.count(ProjectRecommendation.id)).where(ProjectRecommendation.deleted_at.is_(None)))).scalar_one()

        return {
            "dau": dau,
            "wau": wau,
            "mau": mau,
            "total_users": total_users,
            "resume_upload_count": resumes,
            "github_connections": github,
            "mission_completion_rate": mission_rate,
            "average_career_score": round(float(avg_score), 2),
            "average_ai_usage_per_user": ai_usage_per_user,
            "roadmap_completion_rate": roadmap_completion_rate,
            "coding_challenge_completion": coding_submissions,
            "project_recommendation_count": project_recs,
        }
