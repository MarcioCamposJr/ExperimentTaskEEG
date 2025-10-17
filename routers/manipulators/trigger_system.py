from fastapi import APIRouter, Request, BackgroundTasks
import serial.tools.list_ports as lp

from models import trigger_models
from utils import trigger

trigger_routers= APIRouter()

@trigger_routers.get("/ports-trigger")
async def get_ports(request: Request):
    available_ports = [port.description for port in lp.comports()]
    return available_ports

@trigger_routers.post("/connect-trigger")
async def get_ports(config: trigger_models.TriggerConfig, request: Request):
    return trigger.connecet_trigger(config.port, config.boudrate)
