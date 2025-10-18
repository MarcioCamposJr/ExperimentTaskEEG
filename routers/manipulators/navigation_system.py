from fastapi import APIRouter, Request, BackgroundTasks

from models.navigation import NavigationStatus, NavigationConnection
from utils.navigation import navigation

navigation_routers= APIRouter()

@navigation_routers.get("/status-navigation")
def get_status(request: Request):
    return NavigationStatus(status_connection=navigation.is_connected(), target=navigation.get_coil_at_target())

@navigation_routers.post("/connection-navigation")
def connection(request: Request, config: NavigationConnection):
    navigation.try_connect(config.remote_host)
    return navigation.is_connected