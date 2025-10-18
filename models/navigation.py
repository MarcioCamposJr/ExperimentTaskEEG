from pydantic import BaseModel

class NavigationConnection(BaseModel):
    remote_host: str

class NavigationStatus(BaseModel):
    target: bool
    status_connection: bool