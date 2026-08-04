from typing import Any
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import AppError
from app.judge0.languages import language_id_for
from app.models.entities import Judge0Submission
from app.services.judge0_service import Judge0Service as ExternalJudge0Service


class Judge0ExecutionService:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session
        self.client = ExternalJudge0Service()

    async def execute_code(
        self,
        user_id: UUID,
        language: str,
        source_code: str,
        stdin: str | None = None,
        expected_output: str | None = None,
    ) -> Judge0Submission:
        try:
            language_id = language_id_for(language)
        except ValueError as exc:
            raise AppError(str(exc), 422, "unsupported_language") from exc

        result = await self.client.submit(language_id, source_code, stdin, expected_output)
        
        token = result.get("token")
        status = result.get("status", {}).get("description", "queued")
        
        submission = Judge0Submission(
            user_id=user_id,
            language_id=language_id,
            source_code=source_code,
            judge0_token=token,
            status=status,
            result=result,
        )
        self.session.add(submission)
        await self.session.flush()
        await self.session.refresh(submission)
        return submission

    async def refresh_submission(self, user_id: UUID, submission_id: UUID) -> Judge0Submission:
        submission = (
            await self.session.execute(
                select(Judge0Submission).where(
                    Judge0Submission.id == submission_id,
                    Judge0Submission.user_id == user_id,
                    Judge0Submission.deleted_at.is_(None),
                )
            )
        ).scalar_one_or_none()
        if not submission:
            raise AppError("Submission not found", 404, "submission_not_found")

        if submission.judge0_token:
            latest = await self.client.get_submission(submission.judge0_token)
            submission.status = latest.get("status", {}).get("description", submission.status)
            submission.result = latest
            await self.session.flush()
            await self.session.refresh(submission)
        return submission

    async def list_user_submissions(self, user_id: UUID, limit: int = 50) -> list[Judge0Submission]:
        rows = (
            await self.session.execute(
                select(Judge0Submission)
                .where(Judge0Submission.user_id == user_id, Judge0Submission.deleted_at.is_(None))
                .order_by(Judge0Submission.created_at.desc())
                .limit(limit)
            )
        ).scalars().all()
        return list(rows)

    async def calculate_coding_score(self, user_id: UUID) -> dict[str, Any]:
        submissions = await self.list_user_submissions(user_id, limit=500)
        if not submissions:
            return {"coding_score": 0.0, "accepted_count": 0, "total_submissions": 0}
        
        accepted = sum(1 for item in submissions if str(item.status).lower() == "accepted")
        score = round((accepted / len(submissions)) * 100, 2)
        return {
            "coding_score": score,
            "accepted_count": accepted,
            "total_submissions": len(submissions),
        }
