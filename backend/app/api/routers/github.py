from datetime import datetime
from uuid import UUID

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.logging import get_logger
from app.core.crypto import encrypt_text
from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.models.entities import GithubAccount, GithubAnalysis, GithubRepository
from app.schemas.common import AnalysisRead, GithubAccountRead, GithubConnectRequest
from app.services.ai_service import AIService
from app.services.github_service import GitHubService

router = APIRouter()
logger = get_logger(__name__)


@router.post("/connect", response_model=GithubAccountRead, status_code=201)
async def connect_github(
    payload: GithubConnectRequest,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> GithubAccountRead:
    service = GitHubService()
    token = await service.exchange_code(payload.code, payload.redirect_uri)
    profile, repos = await service.fetch_profile_and_repos(token)
    account = GithubAccount(
        user_id=current_user.id,
        github_user_id=str(profile["id"]),
        username=profile["login"],
        access_token_encrypted=encrypt_text(token),
        profile_url=profile.get("html_url"),
    )
    session.add(account)
    await session.flush()
    for repo in repos:
        session.add(
            GithubRepository(
                github_account_id=account.id,
                external_id=str(repo["id"]),
                name=repo["name"],
                full_name=repo["full_name"],
                description=repo.get("description"),
                language=repo.get("language"),
                stars=repo.get("stargazers_count", 0),
                forks=repo.get("forks_count", 0),
                pushed_at=datetime.fromisoformat(repo["pushed_at"].replace("Z", "+00:00")) if repo.get("pushed_at") else None,
                topics=repo.get("topics", []),
            )
        )
    await session.flush()
    await session.refresh(account)
    logger.info("github_connected", user_id=str(current_user.id), username=account.username)
    return GithubAccountRead.model_validate(account)


@router.post("/{account_id}/analyze", response_model=AnalysisRead)
async def analyze_github(
    account_id: UUID,
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> AnalysisRead:
    account = (
        await session.execute(select(GithubAccount).where(GithubAccount.id == account_id, GithubAccount.user_id == current_user.id))
    ).scalar_one()
    repos = (await session.execute(select(GithubRepository).where(GithubRepository.github_account_id == account.id))).scalars().all()
    analysis = await AIService().complete_json(
        "Analyze GitHub repositories for career readiness. Return JSON keys score, language_breakdown, signals.",
        str([{"name": repo.full_name, "language": repo.language, "stars": repo.stars, "topics": repo.topics} for repo in repos]),
    )
    entity = GithubAnalysis(
        user_id=current_user.id,
        github_account_id=account.id,
        score=float(analysis.get("score", 0)),
        language_breakdown=analysis.get("language_breakdown", {}),
        signals=analysis.get("signals", []),
        raw_analysis=analysis,
    )
    session.add(entity)
    await session.flush()
    await session.refresh(entity)
    logger.info("github_analyzed", user_id=str(current_user.id), account_id=str(account.id))
    return AnalysisRead.model_validate(entity)
