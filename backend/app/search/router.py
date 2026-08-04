from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.database.session import get_db_session
from app.dependencies.auth import CurrentUser, get_current_user
from app.search.schemas import SearchResponse, SearchResultItem
from app.search.service import SearchService

router = APIRouter()


@router.get("", response_model=SearchResponse)
async def global_search(
    q: str = Query(..., min_length=1, max_length=200, description="Search query string"),
    types: list[str] | None = Query(default=None, description="Entity type filter e.g. project, roadmap, certificate, career_goal, mentor_chat, notification"),
    sort: str = Query(default="desc", regex="^(asc|desc)$"),
    limit: int = Query(default=50, ge=1, le=100),
    offset: int = Query(default=0, ge=0),
    current_user: CurrentUser = Depends(get_current_user),
    session: AsyncSession = Depends(get_db_session),
) -> SearchResponse:
    results, total = await SearchService(session).search(
        user_id=current_user.id,
        query=q,
        entity_types=types,
        sort_order=sort,
        limit=limit,
        offset=offset,
    )
    return SearchResponse(
        query=q,
        total=total,
        limit=limit,
        offset=offset,
        results=[SearchResultItem.model_validate(r) for r in results],
    )
