from typing import Any, Generic, TypeVar
from uuid import UUID

from sqlalchemy import Select, func, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.exceptions import NotFoundError
from app.models.entities import Entity

ModelT = TypeVar("ModelT", bound=Entity)


class BaseRepository(Generic[ModelT]):
    def __init__(self, session: AsyncSession, model: type[ModelT]) -> None:
        self.session = session
        self.model = model

    def active_query(self) -> Select[tuple[ModelT]]:
        return select(self.model).where(self.model.deleted_at.is_(None))

    async def get(self, entity_id: UUID) -> ModelT:
        result = await self.session.execute(self.active_query().where(self.model.id == entity_id))
        entity = result.scalar_one_or_none()
        if entity is None:
            raise NotFoundError(self.model.__name__)
        return entity

    async def get_owned(self, entity_id: UUID, user_id: UUID) -> ModelT:
        result = await self.session.execute(
            self.active_query().where(self.model.id == entity_id, getattr(self.model, "user_id") == user_id)
        )
        entity = result.scalar_one_or_none()
        if entity is None:
            raise NotFoundError(self.model.__name__)
        return entity

    async def list(self, limit: int = 50, offset: int = 0) -> tuple[list[ModelT], int]:
        query = self.active_query().limit(limit).offset(offset).order_by(self.model.created_at.desc())
        count_query = select(func.count()).select_from(self.model).where(self.model.deleted_at.is_(None))
        rows = (await self.session.execute(query)).scalars().all()
        total = (await self.session.execute(count_query)).scalar_one()
        return list(rows), int(total)

    async def list_owned(self, user_id: UUID, limit: int = 50, offset: int = 0) -> tuple[list[ModelT], int]:
        query = (
            self.active_query()
            .where(getattr(self.model, "user_id") == user_id)
            .limit(limit)
            .offset(offset)
            .order_by(self.model.created_at.desc())
        )
        count_query = (
            select(func.count())
            .select_from(self.model)
            .where(self.model.deleted_at.is_(None), getattr(self.model, "user_id") == user_id)
        )
        rows = (await self.session.execute(query)).scalars().all()
        total = (await self.session.execute(count_query)).scalar_one()
        return list(rows), int(total)

    async def create(self, **values: Any) -> ModelT:
        entity = self.model(**values)
        self.session.add(entity)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def update(self, entity: ModelT, **values: Any) -> ModelT:
        for key, value in values.items():
            setattr(entity, key, value)
        await self.session.flush()
        await self.session.refresh(entity)
        return entity

    async def soft_delete(self, entity_id: UUID) -> None:
        await self.session.execute(update(self.model).where(self.model.id == entity_id).values(deleted_at=func.now()))
