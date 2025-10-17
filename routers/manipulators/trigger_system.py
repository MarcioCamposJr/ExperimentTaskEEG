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
async def try_connect(config: trigger_models.TriggerConfig, request: Request):
    return trigger.connect_trigger(config.port, config.boudrate)

@trigger_routers.get("/get-connection-trigger")
async def get_connection(request: Request):
    await trigger.arduino.check_connection()
    return trigger_models.TriggerConnection(is_connected=trigger.arduino.arduino_connected,
                                            boudrate=trigger.arduino.baudrate,
                                            port_name=trigger.arduino.port_name)
