from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # ARDUINO_PORT: str = Field(..., env="ARDUINO_PORT")
    # BOUND_RATE_ARDUINO: int = Field(..., env="BOUND_RATE_ARDUINO")
    # NAVIGATION_ADRESS: str = Field(..., env="NAVIGATION_ADRESS")
    PORT: int = Field(..., env="PORT")
    IP: str = Field(..., env="IP")

    class Config:
        env_file = ".env"
        extra = "allow"  # Permite campos extras sem gerar erro

settings = Settings()