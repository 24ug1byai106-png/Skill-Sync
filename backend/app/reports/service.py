from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.career.profile_context import build_profile_context
from app.models.entities import CareerDNA, CareerReadiness, ResumeAnalysis, Roadmap, SkillGap, WeeklyMission


class ReportGeneratorService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def generate_career_report(self, user_id: UUID) -> dict:
        context = await build_profile_context(self.session, user_id)
        readiness = (
            await self.session.execute(
                select(CareerReadiness).where(CareerReadiness.user_id == user_id).order_by(CareerReadiness.created_at.desc()).limit(1)
            )
        ).scalar_one_or_none()
        
        score = readiness.overall_score if readiness else 0.0
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Career Readiness Report</title>
        <style>body {{ font-family: sans-serif; padding: 20px; }} h1 {{ color: #2563eb; }} .score {{ font-size: 2em; font-weight: bold; }}</style>
        </head>
        <body>
        <h1>SkillPilot AI - Career Readiness Report</h1>
        <p class="score">Overall Score: {score}/100</p>
        <p><strong>Target Role:</strong> {context.get("target_role", "Software Engineer")}</p>
        <p><strong>Current Skills:</strong> {", ".join(context.get("current_skills", []))}</p>
        <p><strong>Summary:</strong> {readiness.explanation if readiness else "No data available."}</p>
        </body>
        </html>
        """
        return {
            "report_type": "career",
            "user_id": user_id,
            "title": "Comprehensive Career Readiness Report",
            "generated_at": datetime.now(UTC),
            "content_html": html,
        }

    async def generate_resume_report(self, user_id: UUID, resume_id: UUID) -> dict:
        analysis = (
            await self.session.execute(
                select(ResumeAnalysis).where(ResumeAnalysis.resume_id == resume_id, ResumeAnalysis.user_id == user_id).order_by(ResumeAnalysis.created_at.desc()).limit(1)
            )
        ).scalar_one_or_none()
        
        score = analysis.score if analysis else 0.0
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Resume Analysis Report</title></head>
        <body>
        <h1>Resume Analysis Report</h1>
        <p><strong>ATS Score:</strong> {score}/100</p>
        <p><strong>Strengths:</strong> {", ".join(analysis.strengths) if analysis else ""}</p>
        <p><strong>Weaknesses:</strong> {", ".join(analysis.weaknesses) if analysis else ""}</p>
        </body>
        </html>
        """
        return {
            "report_type": "resume",
            "user_id": user_id,
            "title": "AI Resume Analysis Report",
            "generated_at": datetime.now(UTC),
            "content_html": html,
        }

    async def generate_roadmap_report(self, user_id: UUID) -> dict:
        roadmap = (
            await self.session.execute(
                select(Roadmap).where(Roadmap.user_id == user_id, Roadmap.status == "active").order_by(Roadmap.created_at.desc()).limit(1)
            )
        ).scalar_one_or_none()
        
        title = roadmap.title if roadmap else "Career Roadmap"
        html = f"""
        <!DOCTYPE html>
        <html>
        <head><title>Roadmap Report</title></head>
        <body>
        <h1>Roadmap Report: {title}</h1>
        <p>Status: {roadmap.status if roadmap else "N/A"}</p>
        </body>
        </html>
        """
        return {
            "report_type": "roadmap",
            "user_id": user_id,
            "title": f"Roadmap Report - {title}",
            "generated_at": datetime.now(UTC),
            "content_html": html,
        }
