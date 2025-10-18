from fastapi import FastAPI
import uvicorn
from starlette.staticfiles import StaticFiles

from routers.pages import router_pages
from routers.manipulators.experiment_config import config_routers
from routers.manipulators.trigger_system import trigger_routers
from routers.manipulators.tms_system import tms_routers
from routers.manipulators.navigation_system import navigation_routers
from components.navigation_messaging import NavigationMessaging # New import
from config import settings

app = FastAPI()

app.state.experiment = {
    "trial_list": [],
    "current_step": 0,
    "is_running": False,
    "color": "gray",
    "instruction": "Aguarde",
    'tms': False
}

# Initialize navigation_messaging here
# The actual remote_host will be set when the user connects via the frontend
app.state.navigation_messaging = NavigationMessaging(remote_host="http://localhost:5000") # Default placeholder

app.mount("/static", StaticFiles(directory="pages"), name="static")
app.mount("/utils", StaticFiles(directory="utils"), name="utils")

app.include_router(router_pages)
app.include_router(config_routers)
app.include_router(trigger_routers)
app.include_router(tms_routers)
app.include_router(navigation_routers)


if __name__ == "__main__":
    uvicorn.run(
        "app:app",
        host=settings.IP, 
        port=settings.PORT,
        reload=settings.DEV
    )

