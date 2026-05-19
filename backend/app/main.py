import logging
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes import router
from app.services.brief_service import BriefServiceError, get_today_brief
from app.services.database import initialize_database
from app.settings import get_settings

settings = get_settings()
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(_: FastAPI):
    storage_dir = Path(settings.digest_storage_dir)
    device_preferences_dir = Path(settings.device_preferences_storage_dir)

    if settings.database_url:
        initialize_database(settings.database_url)
    else:
        storage_dir.mkdir(parents=True, exist_ok=True)
        device_preferences_dir.mkdir(parents=True, exist_ok=True)

    if settings.warm_digest_on_startup:
        try:
            get_today_brief(
                database_url=settings.database_url,
                digest_size=settings.digest_size,
                storage_dir=storage_dir,
            )
        except BriefServiceError as exc:
            logger.warning("Digest warmup skipped during startup: %s", exc)

    logger.info("Signal Brief backend startup complete for env=%s", settings.app_env)

    yield

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    summary="Backend API for the Signal Brief mobile prototype.",
    lifespan=lifespan,
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_headers=["*"],
    allow_methods=["*"],
)
app.include_router(router)