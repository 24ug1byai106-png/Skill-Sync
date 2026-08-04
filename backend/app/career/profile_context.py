from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.entities import CareerGoal, Certificate, GithubAccount, GithubRepository, MentorChat, MissionProgress, ProjectRecommendation, Resume, WeeklyMission
from app.models.extensions import ResumeParsedContent


async def build_profile_context(session: AsyncSession, user_id: UUID) -> dict[str, Any]:
    goal = (
        await session.execute(select(CareerGoal).where(CareerGoal.user_id == user_id, CareerGoal.is_active.is_(True), CareerGoal.deleted_at.is_(None)))
    ).scalar_one_or_none()
    resumes = (await session.execute(select(Resume).where(Resume.user_id == user_id, Resume.deleted_at.is_(None)))).scalars().all()
    parsed = (
        await session.execute(select(ResumeParsedContent).where(ResumeParsedContent.user_id == user_id, ResumeParsedContent.deleted_at.is_(None)))
    ).scalars().all()
    certificates = (await session.execute(select(Certificate).where(Certificate.user_id == user_id, Certificate.deleted_at.is_(None)))).scalars().all()
    accounts = (await session.execute(select(GithubAccount).where(GithubAccount.user_id == user_id, GithubAccount.deleted_at.is_(None)))).scalars().all()
    repos = []
    for account in accounts:
        repos.extend((await session.execute(select(GithubRepository).where(GithubRepository.github_account_id == account.id))).scalars().all())
    recommendations = (
        await session.execute(select(ProjectRecommendation).where(ProjectRecommendation.user_id == user_id, ProjectRecommendation.deleted_at.is_(None)))
    ).scalars().all()
    chats = (
        await session.execute(
            select(MentorChat).where(MentorChat.user_id == user_id, MentorChat.deleted_at.is_(None)).order_by(MentorChat.created_at.desc()).limit(20)
        )
    ).scalars().all()
    progress = (
        await session.execute(
            select(MissionProgress)
            .join(MissionProgress.mission)
            .where(WeeklyMission.user_id == user_id, MissionProgress.deleted_at.is_(None))
            .order_by(MissionProgress.created_at.desc())
            .limit(20)
        )
    ).scalars().all()
    skills = sorted({skill for item in parsed for skill in (item.skills + item.technical_skills + item.soft_skills)})
    return {
        "career_goal": goal.title if goal else None,
        "target_role": goal.target_role if goal else None,
        "resume_count": len(resumes),
        "current_skills": skills,
        "resume_parsed_content": [
            {
                "skills": item.skills,
                "projects": item.projects,
                "education": item.education,
                "experience": item.experience,
                "certificates": item.certificates,
                "achievements": item.achievements,
            }
            for item in parsed
        ],
        "certificates": [{"title": cert.title, "issuer": cert.issuer} for cert in certificates],
        "github": [{"repo": repo.full_name, "language": repo.language, "stars": repo.stars, "forks": repo.forks, "topics": repo.topics} for repo in repos],
        "project_recommendations": [item.custom_project for item in recommendations[:10]],
        "mission_progress": [{"mission_id": str(item.mission_id), "percent_complete": item.percent_complete} for item in progress],
        "previous_chats": [{"message": chat.message, "response": chat.response} for chat in reversed(chats)],
    }
