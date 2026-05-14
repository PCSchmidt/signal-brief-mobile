from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "Signal Brief Backend"
    app_version: str = "0.1.0"
    digest_size: int = 5
    digest_storage_dir: Path = Path("data/digests")
    device_preferences_storage_dir: Path = Path("data/device-preferences")
    internal_job_token: str = "signal-brief-local-token"
    warm_digest_on_startup: bool = True

    model_config = SettingsConfigDict(
        env_file=".env",
        env_prefix="SIGNAL_BRIEF_",
        extra="ignore",
    )


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()