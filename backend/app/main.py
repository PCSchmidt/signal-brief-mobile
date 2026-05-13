from fastapi import FastAPI

from app.api.routes import router
from app.settings import get_settings

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
    summary="Backend API for the Signal Brief mobile prototype.",
)
app.include_router(router)