import os
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./skillsphere.db"
    SECRET_KEY: str = "skillsphere_jwt_secret_key_extremely_secure_2026_d7a8c3"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours
    
    OPENROUTER_API_KEY: str = ""
    OPENROUTER_MODEL: str = "openrouter/free"
    
    GOOGLE_CLIENT_ID: str = ""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
