from functools import lru_cache
from pathlib import Path

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_env: str = "development"
    app_name: str = "Signal Brief Backend"
    app_version: str = "0.1.0"
    allowed_origins: list[str] = ["*"]
    database_url: str | None = None
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

    @field_validator("allowed_origins", mode="before")
    @classmethod
    def parse_allowed_origins(cls, value: object) -> object:
        if isinstance(value, str):
            cleaned = value.strip()
            if not cleaned:
                return []
            if cleaned.startswith("["):
                return value
            return [origin.strip() for origin in cleaned.split(",") if origin.strip()]

        return value


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()