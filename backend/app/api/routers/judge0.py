from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import Judge0Submission
from app.schemas.common import Judge0SubmissionCreate, Judge0SubmissionRead
from app.services.judge0_service import Judge0Service

router = APIRouter()
logger = get_logger(__name__)


@router.post("/submissions", response_model=Judge0SubmissionRead, status_code=201)
async def create_submission(
    payload: Judge0SubmissionCreate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Judge0SubmissionRead:
    judge_response = await Judge0Service().submit(payload.language_id, payload.source_code, payload.stdin, payload.expected_output)
    entity = Judge0Submission(
        user_id=current_user.id,
        challenge_id=payload.challenge_id,
        judge0_token=judge_response.get("token"),
        language_id=payload.language_id,
        source_code=payload.source_code,
        status="queued",
        result=judge_response,
    )
    session.add(entity)
    await session.flush()
    await session.refresh(entity)
    logger.info("judge0_submission_created", user_id=str(current_user.id), submission_id=str(entity.id))
    return Judge0SubmissionRead.model_validate(entity)


@router.get("/submissions/{submission_id}", response_model=Judge0SubmissionRead)
async def get_submission(
    submission_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Judge0SubmissionRead:
    entity = (
        await session.execute(
            select(Judge0Submission).where(
                Judge0Submission.id == submission_id,
                Judge0Submission.user_id == current_user.id,
                Judge0Submission.deleted_at.is_(None),
            )
        )
    ).scalar_one()
    if entity.judge0_token and entity.status not in {"Accepted", "Wrong Answer", "Runtime Error", "Compilation Error"}:
        latest = await Judge0Service().get_submission(entity.judge0_token)
        entity.status = latest.get("status", {}).get("description", entity.status)
        entity.result = latest
        await session.flush()
        await session.refresh(entity)
    return Judge0SubmissionRead.model_validate(entity)
