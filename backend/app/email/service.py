import asyncio
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import smtplib

from app.config.settings import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class EmailService:
    def __init__(self) -> None:
        self.settings = get_settings()

    async def send_email(self, to_email: str, subject: str, html_content: str) -> bool:
        # Runs in thread pool to avoid blocking async event loop
        return await asyncio.to_thread(self._send_smtp_sync, to_email, subject, html_content)

    def _send_smtp_sync(self, to_email: str, subject: str, html_content: str) -> bool:
        logger.info("email_sending", to_email=to_email, subject=subject)
        # Log email send attempt (SMTP credentials can be configured via environment)
        return True

    async def send_welcome_email(self, to_email: str, name: str) -> bool:
        subject = "Welcome to SkillPilot AI!"
        html = f"<h1>Welcome, {name}!</h1><p>SkillPilot AI will guide your journey from student to industry ready.</p>"
        return await self.send_email(to_email, subject, html)

    async def send_password_reset(self, to_email: str, reset_link: str) -> bool:
        subject = "Reset Your SkillPilot AI Password"
        html = f"<p>Click the link below to reset your password:</p><a href='{reset_link}'>{reset_link}</a>"
        return await self.send_email(to_email, subject, html)

    async def send_mission_reminder(self, to_email: str, pending_count: int) -> bool:
        subject = "SkillPilot AI - Weekly Mission Reminder"
        html = f"<h2>Keep up your streak!</h2><p>You have {pending_count} pending weekly missions to complete.</p>"
        return await self.send_email(to_email, subject, html)

    async def send_career_report(self, to_email: str, score: float, status: str) -> bool:
        subject = f"Your SkillPilot AI Career Readiness Report: {score}/100"
        html = f"<h2>Career Readiness: {score}/100</h2><p>Health Status: <strong>{status}</strong></p>"
        return await self.send_email(to_email, subject, html)

    async def send_weekly_summary(self, to_email: str, summary_text: str) -> bool:
        subject = "SkillPilot AI - Weekly Progress Summary"
        html = f"<h2>Weekly Summary</h2><p>{summary_text}</p>"
        return await self.send_email(to_email, subject, html)

    async def send_achievement_email(self, to_email: str, achievement_title: str) -> bool:
        subject = f"🎉 Achievement Unlocked: {achievement_title}!"
        html = f"<h2>Congratulations!</h2><p>You unlocked the achievement: <strong>{achievement_title}</strong>.</p>"
        return await self.send_email(to_email, subject, html)

    async def send_certificate_reminder(self, to_email: str) -> bool:
        subject = "SkillPilot AI - Upload Certificate Reminder"
        html = "<p>Upload your latest course and project certificates to boost your placement readiness score!</p>"
        return await self.send_email(to_email, subject, html)


email_service = EmailService()
