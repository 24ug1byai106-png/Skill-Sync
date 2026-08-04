from uuid import UUID

from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.mentor.schemas import InterviewPrepRequest, MentorChatRead, MentorChatRequest, MentorSessionSummary, ProjectGuidanceRequest
from app.mentor.service import MentorService

router = APIRouter()


@router.post("/reply", response_model=MentorChatRead)
async def reply(
    payload: MentorChatRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MentorChatRead:
    chat = await MentorService(session).reply(current_user.id, payload.message, payload.session_id)
    return MentorChatRead.model_validate(chat)


@router.post("/stream")
async def stream(
    payload: MentorChatRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> StreamingResponse:
    return StreamingResponse(MentorService(session).stream_reply(current_user.id, payload.message, payload.session_id), media_type="text/plain")


@router.get("/history/{session_id}", response_model=list[MentorChatRead])
async def get_session_history(
    session_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[MentorChatRead]:
    chats = await MentorService(session).get_session_history(current_user.id, session_id)
    return [MentorChatRead.model_validate(item) for item in chats]


@router.get("/sessions", response_model=list[MentorSessionSummary])
async def list_user_sessions(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[MentorSessionSummary]:
    sessions = await MentorService(session).list_user_sessions(current_user.id)
    return [MentorSessionSummary.model_validate(item) for item in sessions]


@router.post("/interview-prep", response_model=MentorChatRead)
async def interview_prep(
    payload: InterviewPrepRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MentorChatRead:
    chat = await MentorService(session).generate_interview_prep(
        user_id=current_user.id,
        target_role=payload.target_role,
        topic=payload.topic or "general",
        difficulty=payload.difficulty or "medium",
    )
    return MentorChatRead.model_validate(chat)


@router.post("/guidance", response_model=MentorChatRead)
async def project_guidance(
    payload: ProjectGuidanceRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MentorChatRead:
    chat = await MentorService(session).generate_project_guidance(
        user_id=current_user.id,
        project_title=payload.project_title,
        tech_stack=payload.tech_stack,
        question=payload.question,
    )
    return MentorChatRead.model_validate(chat)

