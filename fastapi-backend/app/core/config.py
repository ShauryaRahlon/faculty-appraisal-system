from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache


class Settings(BaseSettings):
    MONGO_URI: str
    APPRAISAL_SYSTEM_MONGO_DB_NAME: str
    DATA_INJECTION_COLLECTION_NAME: str
    FACULTY_DATA_COLLECTION_NAME: str

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings():
    return Settings()


settings = get_settings()
