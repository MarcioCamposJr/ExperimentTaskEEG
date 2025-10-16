from fastapi import APIRouter, Request
from fastapi.responses import FileResponse, RedirectResponse
from starlette import status

router_pages = APIRouter()

@router_pages.get("/")
async def init():
    return RedirectResponse(
            url="/config",
        )

@router_pages.get("/config")
async def read_config(request: Request):
    if not request.app.state.experiment["is_running"]:
        return FileResponse('pages/configExp/index.html')
    return RedirectResponse(
        url="/monitor", 
    )

@router_pages.get("/monitor")
async def read_monitor(request: Request):
    if request.app.state.experiment["is_running"]:
        return FileResponse('pages/monitor/index.html')
    return RedirectResponse(
        url="/config",
    )

@router_pages.get("/experiment")
async def read_monitor(request: Request):
    return FileResponse('pages/experiment/index.html')
