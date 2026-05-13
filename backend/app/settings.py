from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "Signal Brief Backend"
    app_version: str = "0.1.0"
    digest_size: int = 5
    internal_job_token: str = "signal-brief-local-token"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="SIGNAL_BRIEF_",
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()