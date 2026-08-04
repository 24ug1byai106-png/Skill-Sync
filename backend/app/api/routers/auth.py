from fastapi import APIRouter, Depends
from fastapi.security import HTTPAuthorizationCredentials
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, bearer_scheme, get_current_user
from app.schemas.auth import AuthResponse, AuthTokens, LoginRequest, RefreshTokenRequest, SignupRequest
from app.schemas.common import MessageResponse, UserRead
from app.services.auth_service import SupabaseAuthService

router = APIRouter()
logger = get_logger(__name__)


@router.post("/signup", response_model=AuthResponse, status_code=201)
async def signup(payload: SignupRequest, session: AsyncSession = Depends(get_db_session)) -> AuthResponse:
    user, tokens = await SupabaseAuthService(session).signup(payload)
    logger.info("signup_completed", user_id=str(user.id))
    return AuthResponse(user=UserRead.model_validate(user), tokens=tokens)


@router.post("/login", response_model=AuthResponse)
async def login(payload: LoginRequest, session: AsyncSession = Depends(get_db_session)) -> AuthResponse:
    user, tokens = await SupabaseAuthService(session).login(payload)
    logger.info("login_completed", user_id=str(user.id))
    return AuthResponse(user=UserRead.model_validate(user), tokens=tokens)


@router.post("/refresh", response_model=AuthTokens)
async def refresh(payload: RefreshTokenRequest, session: AsyncSession = Depends(get_db_session)) -> AuthTokens:
    return await SupabaseAuthService(session).refresh(payload.refresh_token)


@router.post("/logout", response_model=MessageResponse)
async def logout(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    token = credentials.credentials if credentials else ""
    await SupabaseAuthService(session).logout(token)
    return MessageResponse(message="Logged out")


@router.get("/me", response_model=UserRead)
async def me(current_user: CurrentUser = Depends(get_current_user), session: AsyncSession = Depends(get_db_session)) -> UserRead:
    from sqlalchemy import select
    from app.models.entities import User

    user = (await session.execute(select(User).where(User.id == current_user.id))).scalar_one()
    return UserRead.model_validate(user)
