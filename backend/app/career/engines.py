import json
from datetime import UTC, date, datetime, timedelta
from typing import Any
from uuid import UUID

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.career.profile_context import build_profile_context
from app.career.role_catalog import get_role_catalog
from app.groq.service import GroqService
from app.models.entities import (
    CareerDNA,
    CareerReadiness,
    ProjectRecommendation,
    Roadmap,
    SkillGap,
    WeeklyMission,
)
from app.prompts.career_dna import SYSTEM_PROMPT as CAREER_DNA_PROMPT
from app.prompts.projects import SYSTEM_PROMPT as PROJECTS_PROMPT
from app.prompts.roadmap import SYSTEM_PROMPT as ROADMAP_PROMPT
from app.prompts.skill_gap import SYSTEM_PROMPT as SKILL_GAP_PROMPT


class CareerEngine:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.groq = GroqService()

    async def generate_career_dna(self, user_id: UUID) -> CareerDNA:
        context = await build_profile_context(self.session, user_id)
        result = await self.groq.complete_json(CAREER_DNA_PROMPT, json.dumps(context, default=str))
        entity = CareerDNA(
            user_id=user_id,
            strengths=result.get("technical_strengths", []),
            traits=result.get("career_dna", {}),
            interests=result.get("technology_expertise", []),
            summary=result.get("career_summary", ""),
        )
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def generate_skill_gap(self, user_id: UUID, role: str | None = None) -> SkillGap:
        context = await build_profile_context(self.session, user_id)
        target_role = role or context.get("target_role") or "Software Engineer"
        catalog = await get_role_catalog(self.session, str(target_role))
        current_skills = set(skill.lower() for skill in context["current_skills"])
        required = list(catalog.required_skills)
        missing = [skill for skill in required if skill.lower() not in current_skills]
        ai_result = await self.groq.complete_json(
            SKILL_GAP_PROMPT,
            json.dumps({"role_catalog": catalog.__dict__, "profile": context, "missing": missing}, default=str),
        )
        entity = SkillGap(
            user_id=user_id,
            required_skills=ai_result.get("required_skills", required),
            current_skills=context["current_skills"],
            missing_skills=ai_result.get("missing_skills", missing),
            priority={
                "priority_skills": ai_result.get("priority_skills", missing[:5]),
                "learning_order": ai_result.get("learning_order", missing),
                "difficulty": ai_result.get("difficulty", catalog.difficulty),
                "estimated_learning_time": ai_result.get("estimated_learning_time", f"{catalog.estimated_learning_weeks} weeks"),
            },
        )
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def calculate_readiness(self, user_id: UUID) -> CareerReadiness:
        context = await build_profile_context(self.session, user_id)
        resume_score = min(100.0, 35 + len(context["current_skills"]) * 3) if context["resume_count"] else 0.0
        github_score = min(100.0, sum(repo.get("stars", 0) for repo in context["github"]) + len(context["github"]) * 8)
        project_score = min(100.0, len(context["project_recommendations"]) * 12)
        skill_score = min(100.0, len(context["current_skills"]) * 4)
        mission_values = [item["percent_complete"] for item in context["mission_progress"]]
        mission_completion = sum(mission_values) / len(mission_values) if mission_values else 0.0
        certificate_score = min(100.0, len(context["certificates"]) * 20)
        coding_score = 0.0
        overall = round((resume_score + github_score + project_score + skill_score + mission_completion + certificate_score + coding_score) / 7, 2)
        status = "placement_ready" if overall >= 75 else "building_momentum" if overall >= 45 else "foundation_needed"
        entity = CareerReadiness(
            user_id=user_id,
            overall_score=overall,
            resume_score=resume_score,
            github_score=github_score,
            skills_score=skill_score,
            explanation=json.dumps(
                {
                    "career_health_status": status,
                    "placement_ready_percent": overall,
                    "strength_areas": [skill for skill in context["current_skills"][:8]],
                    "improvement_areas": ["Complete weekly missions", "Improve project documentation", "Close priority skill gaps"],
                    "component_scores": {
                        "project_score": project_score,
                        "coding_score": coding_score,
                        "certificate_score": certificate_score,
                        "mission_completion": mission_completion,
                    },
                }
            ),
        )
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def generate_roadmap(self, user_id: UUID, available_hours_per_week: int = 8) -> Roadmap:
        context = await build_profile_context(self.session, user_id)
        result = await self.groq.complete_json(ROADMAP_PROMPT, json.dumps({"profile": context, "available_hours_per_week": available_hours_per_week}, default=str))
        entity = Roadmap(
            user_id=user_id,
            title=f"{context.get('target_role') or 'Career'} Roadmap",
            milestones=[
                {
                    "weekly_plan": result.get("weekly_plan", []),
                    "monthly_plan": result.get("monthly_plan", []),
                    "daily_tasks": result.get("daily_tasks", []),
                    "recommended_courses": result.get("recommended_courses", []),
                    "youtube_resources": result.get("youtube_resources", []),
                    "documentation": result.get("documentation", []),
                    "certifications": result.get("certifications", []),
                    "mini_projects": result.get("mini_projects", []),
                    "major_projects": result.get("major_projects", []),
                    "expected_completion_date": result.get("expected_completion_date"),
                    "difficulty": result.get("difficulty"),
                    "progress_percent": result.get("progress_percent", 0),
                }
            ],
        )
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def generate_weekly_missions(self, user_id: UUID, count: int = 5) -> list[WeeklyMission]:
        roadmap = await self.generate_roadmap(user_id)
        templates = ["Learn Docker", "Deploy FastAPI", "Push GitHub Commit", "Improve README", "Solve DSA Problems", "Complete SQL Exercises", "Watch AWS Course"]
        missions = []
        for index, title in enumerate(templates[:count]):
            mission = WeeklyMission(
                user_id=user_id,
                roadmap_id=roadmap.id,
                title=title,
                week_start=date.today() + timedelta(days=7 * index),
                objectives=[f"{title} with evidence", "Write a short reflection", "Update portfolio progress"],
                status="pending",
            )
            self.session.add(mission)
            missions.append(mission)
        await self.session.flush()
        for mission in missions:
            await self.session.refresh(mission)
        return missions

    async def recommend_projects(self, user_id: UUID) -> list[ProjectRecommendation]:
        context = await build_profile_context(self.session, user_id)
        result = await self.groq.complete_json(PROJECTS_PROMPT, json.dumps(context, default=str))
        recommendations = []
        for index, project in enumerate(result.get("projects", [])[:10]):
            rec = ProjectRecommendation(
                user_id=user_id,
                custom_project=project,
                reason=project.get("reason", "Matched to your current skills, goal, and skill gaps."),
                rank=index + 1,
            )
            self.session.add(rec)
            recommendations.append(rec)
        await self.session.flush()
        for recommendation in recommendations:
            await self.session.refresh(recommendation)
        return recommendations
