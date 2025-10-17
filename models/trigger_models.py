from pydantic import BaseModel, Field

class TriggerConfig(BaseModel):
    port: str
    boudrate: int