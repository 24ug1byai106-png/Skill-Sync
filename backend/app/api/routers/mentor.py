from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import MentorChat
from app.schemas.common import MentorChatRead, MentorMessageCreate
from app.services.ai_service import AIService

router = APIRouter()
logger = get_logger(__name__)


@router.post("/chat", response_model=MentorChatRead)
async def chat(
    payload: MentorMessageCreate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MentorChatRead:
    context = {**payload.context, "user_id": str(current_user.id)}
    response = await AIService().mentor_reply(payload.message, context)
    chat_row = MentorChat(
        user_id=current_user.id,
        session_id=payload.session_id or uuid4(),
        message=payload.message,
        response=response,
        context=context,
    )
    session.add(chat_row)
    await session.flush()
    await session.refresh(chat_row)
    logger.info("mentor_chat_created", user_id=str(current_user.id), session_id=str(chat_row.session_id))
    return MentorChatRead.model_validate(chat_row)
from uuid import uuid4
