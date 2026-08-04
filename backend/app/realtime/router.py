from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.realtime.service import realtime_service

router = APIRouter()


@router.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str) -> None:
    await realtime_service.manager.connect(user_id, websocket)
    try:
        while True:
            # Keep connection alive and receive client pings
            data = await websocket.receive_text()
            if data == "ping":
                await websocket.send_text("pong")
    except WebSocketDisconnect:
        realtime_service.manager.disconnect(user_id, websocket)
