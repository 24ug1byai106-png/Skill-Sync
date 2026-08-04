from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.github.schemas import (
    GitHubAccountAnalysisRead,
    GitHubAccountDetail,
    GitHubOAuthConnect,
    GitHubSyncResponse,
    RepositoryInsightRead,
)
from app.github.service import GitHubIntegrationService
from app.schemas.common import MessageResponse

router = APIRouter()


@router.post("/oauth/connect", response_model=GitHubSyncResponse, status_code=201)
async def oauth_connect(
    payload: GitHubOAuthConnect,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> GitHubSyncResponse:
    account, count = await GitHubIntegrationService(session).connect(current_user.id, payload)
    return GitHubSyncResponse(account=GitHubAccountDetail.model_validate(account), repositories_synced=count)


@router.get("/accounts", response_model=list[GitHubAccountDetail])
async def list_accounts(
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> list[GitHubAccountDetail]:
    accounts = await GitHubIntegrationService(session).store.list_accounts(current_user.id)
    return [GitHubAccountDetail.model_validate(account) for account in accounts]


@router.post("/accounts/{account_id}/sync", response_model=MessageResponse)
async def sync_account(
    account_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> MessageResponse:
    count = await GitHubIntegrationService(session).sync_repositories(current_user.id, account_id)
    return MessageResponse(message=f"Synced {count} repositories")


@router.post("/accounts/{account_id}/analyze", response_model=GitHubAccountAnalysisRead)
async def analyze_account(
    account_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> GitHubAccountAnalysisRead:
    analysis = await GitHubIntegrationService(session).analyze_account(current_user.id, account_id)
    return GitHubAccountAnalysisRead.model_validate(analysis)


@router.post("/repositories/{repository_id}/analyze", response_model=RepositoryInsightRead)
async def analyze_repository(
    repository_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> RepositoryInsightRead:
    insight = await GitHubIntegrationService(session).analyze_repository(current_user.id, repository_id)
    return RepositoryInsightRead.model_validate(insight)
