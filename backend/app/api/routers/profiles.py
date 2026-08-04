from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.core.logging import get_logger
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import Profile
from app.schemas.common import ProfileCreate, ProfileRead

router = APIRouter()
logger = get_logger(__name__)


@router.get("/me", response_model=ProfileRead)
async def get_profile(current_user: CurrentUser = Depends(get_current_user), session: AsyncSession = Depends(get_db_session)) -> ProfileRead:
    profile = (await session.execute(select(Profile).where(Profile.user_id == current_user.id, Profile.deleted_at.is_(None)))).scalar_one_or_none()
    if profile is None:
        raise NotFoundError("Profile")
    return ProfileRead.model_validate(profile)


@router.put("/me", response_model=ProfileRead)
async def update_profile(
    payload: ProfileCreate,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> ProfileRead:
    profile = (await session.execute(select(Profile).where(Profile.user_id == current_user.id, Profile.deleted_at.is_(None)))).scalar_one_or_none()
    if profile is None:
        profile = Profile(user_id=current_user.id, **payload.model_dump())
        session.add(profile)
    else:
        for key, value in payload.model_dump().items():
            setattr(profile, key, value)
    await session.flush()
    await session.refresh(profile)
    logger.info("profile_updated", user_id=str(current_user.id))
    return ProfileRead.model_validate(profile)
