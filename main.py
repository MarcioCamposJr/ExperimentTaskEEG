from fastapi import FastAPI
import uvicorn
from starlette.staticfiles import StaticFiles

from routers.pages import router_pages
from routers.manipulators.experiment_config import config_routers
from config import settings

app = FastAPI()

app.state.experiment = {
    "trial_list": [],
    "current_step": 0,
    "is_running": False,
    "color": "gray",
    "instruction": "Aguarde"
}

app.mount("/static", StaticFiles(directory="pages"), name="static")

app.include_router(router_pages)
app.include_router(config_routers)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0", 
        port=settings.PORT,
        reload=True
    )

