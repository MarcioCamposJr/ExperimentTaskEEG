from fastapi import APIRouter, Request
from components.navigation_messaging import NavigationMessaging
from pydantic import BaseModel
from utils.navigation import process_status

class NavigationConnectionConfig(BaseModel):
    address: str
    port: int

class NavigationStatus(BaseModel):
    is_connected: bool
    is_on_target: bool
    address: str | None = None
    port: int | None = None

navigation_routers = APIRouter()

@navigation_routers.post("/connect-navigation")
async def connect_navigation(config: NavigationConnectionConfig, request: Request):
    # Assuming NavigationMessaging instance is stored in app.state
    nav_msg: NavigationMessaging = request.app.state.navigation_messaging
    remote_host = f"http://{config.address}:{config.port}"
    
    # Re-initialize if host changes or not yet connected
    if not nav_msg or nav_msg._NavigationMessaging__remote_host != remote_host or not nav_msg.is_connected():
        # Disconnect old instance if it exists and is connected
        if nav_msg and nav_msg.is_connected():
            nav_msg.disconnect()
        request.app.state.navigation_messaging = NavigationMessaging(remote_host=remote_host) # Pass remote_host to init
        nav_msg = request.app.state.navigation_messaging

    if not nav_msg.is_connected():
        nav_msg.try_connect(remote_host) # Pass remote_host to try_connect
    return {"is_connected": nav_msg.is_connected()}

@navigation_routers.get("/get-navigation-status", response_model=NavigationStatus)
async def get_navigation_status(request: Request):
    nav_msg: NavigationMessaging = request.app.state.navigation_messaging
    is_connected,is_on_target, address, port =  process_status(nav_msg)
    return NavigationStatus(is_connected=is_connected, is_on_target=is_on_target, address=address, port=port)

@navigation_routers.post("/disconnect-navigation")
async def disconnect_navigation(request: Request):
    nav_msg: NavigationMessaging = request.app.state.navigation_messaging
    if nav_msg and nav_msg.is_connected():
        nav_msg.disconnect()
    return {"status": "disconnected"}
