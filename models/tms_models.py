from pydantic import BaseModel

class TmsEnableConfig(BaseModel):
    enable: bool

class TmsStatusConnection(BaseModel):
    is_connected: bool
    port: str

class TmsConnection(BaseModel):
    port: str
    port_name: str
