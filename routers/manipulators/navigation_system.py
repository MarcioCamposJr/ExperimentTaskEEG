from fastapi import APIRouter, Request
from pydantic import BaseModel

from models.navigation import NavigationConnectionConfig, NavigationStatus
from utils.navigation import process_status, process_connect, disconnect

navigation_routers = APIRouter()

@navigation_routers.post("/connect-navigation")
async def connect_navigation(config: NavigationConnectionConfig, request: Request):
    return {"is_connected": await process_connect(config)}

@navigation_routers.get("/get-navigation-status", response_model=NavigationStatus)
async def get_navigation_status(request: Request):
    is_connected,is_on_target, address, port = process_status()
    return NavigationStatus(is_connected=is_connected, is_on_target=is_on_target, address=address, port=port)

@navigation_routers.post("/disconnect-navigation")
async def disconnect_navigation(request: Request):
    disconnect()
    return {"status": "disconnected"}