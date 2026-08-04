from uuid import UUID

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.judge0.schemas import CodeExecutionRequest, CodingScoreRead, Judge0SubmissionRead
from app.judge0.service import Judge0ExecutionService

router = APIRouter()


@router.post("/execute", response_model=Judge0SubmissionRead, status_code=201)
async def execute_code(
    payload: CodeExecutionRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Judge0SubmissionRead:
    service = Judge0ExecutionService(session)
    submission = await service.execute_code(
        user_id=current_user.id,
        language=payload.language,
        source_code=payload.source_code,
        stdin=payload.stdin,
        expected_output=payload.expected_output,
    )
    return Judge0SubmissionRead.model_validate(submission)


@router.post("/submissions/{submission_id}/refresh", response_model=Judge0SubmissionRead)
async def refresh_result(
    submission_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> Judge0SubmissionRead:
    service = Judge0ExecutionService(session)
    submission = await service.refresh_submission(current_user.id, submission_id)
    return Judge0SubmissionRead.model_validate(submission)


@router.get("/submissions", response_model=list[Judge0SubmissionRead])
async def list_submissions(
    limit: int = Query(default=50, ge=1, le=100),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[Judge0SubmissionRead]:
    service = Judge0ExecutionService(session)
    submissions = await service.list_user_submissions(current_user.id, limit=limit)
    return [Judge0SubmissionRead.model_validate(item) for item in submissions]


@router.get("/coding-score", response_model=CodingScoreRead)
async def coding_score(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> CodingScoreRead:
    service = Judge0ExecutionService(session)
    result = await service.calculate_coding_score(current_user.id)
    return CodingScoreRead.model_validate(result)

