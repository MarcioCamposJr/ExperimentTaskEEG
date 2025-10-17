from pydantic import BaseModel, Field

class TriggerConfig(BaseModel):
    port: str
    boudrate: int

class TriggerConnection(BaseModel):
    is_connected: bool
    boudrate: int
    port_name: str