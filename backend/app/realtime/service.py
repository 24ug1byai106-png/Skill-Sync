import asyncio
import json
from typing import Any
from uuid import UUID

from fastapi import WebSocket
import httpx

from app.config.settings import get_settings
from app.core.logging import get_logger

logger = get_logger(__name__)


class ConnectionManager:
    def __init__(self) -> None:
        self.active_connections: dict[str, set[WebSocket]] = {}

    async def connect(self, user_id: str, websocket: WebSocket) -> None:
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = set()
        self.active_connections[user_id].add(websocket)
        logger.info("websocket_connected", user_id=user_id)

    def disconnect(self, user_id: str, websocket: WebSocket) -> None:
        if user_id in self.active_connections:
            self.active_connections[user_id].discard(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
        logger.info("websocket_disconnected", user_id=user_id)

    async def send_personal_message(self, user_id: str, event_type: str, payload: dict[str, Any]) -> None:
        connections = self.active_connections.get(user_id, set())
        message = json.dumps({"event": event_type, "data": payload}, default=str)
        dead = set()
        for connection in connections:
            try:
                await connection.send_text(message)
            except Exception:
                dead.add(connection)
        for conn in dead:
            self.disconnect(user_id, conn)


class RealtimeService:
    def __init__(self) -> None:
        self.manager = ConnectionManager()
        self.settings = get_settings()

    async def broadcast_event(self, user_id: UUID | str, event_type: str, data: dict[str, Any]) -> None:
        uid = str(user_id)
        # Send via active WebSocket connections
        await self.manager.send_personal_message(uid, event_type, data)
        # Also post event to Supabase Realtime broadcast channel (optional)
        await self._broadcast_supabase(uid, event_type, data)

    async def _broadcast_supabase(self, user_id: str, event_type: str, data: dict[str, Any]) -> None:
        try:
            url = f"{str(self.settings.supabase_url).rstrip('/')}/rest/v1/rpc/realtime_broadcast"
            headers = {
                "apikey": self.settings.supabase_key,
                "Authorization": f"Bearer {self.settings.supabase_service_role_key}",
                "Content-Type": "application/json",
            }
            payload = {"channel": f"user:{user_id}", "event": event_type, "payload": data}
            async with httpx.AsyncClient(timeout=5) as client:
                await client.post(url, headers=headers, json=payload)
        except Exception as exc:
            logger.debug("supabase_realtime_broadcast_skipped", error=str(exc))


realtime_service = RealtimeService()
