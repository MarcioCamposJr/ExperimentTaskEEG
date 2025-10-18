from pydantic import BaseModel

class NavigationConnectionConfig(BaseModel):
    address: str
    port: int

class NavigationStatus(BaseModel):
    is_connected: bool
    is_on_target: bool
    address: str | None = None
    port: int | None = None