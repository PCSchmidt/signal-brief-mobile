from pathlib import Path

from fastapi import APIRouter, Depends, Header, HTTPException, Query, status

from app.schemas import (
    DailyBriefResponse,
    DevicePreferencesResponse,
    DigestGenerationResponse,
    HealthResponse,
    PushTokenRegistrationRequest,
    PushTokenRegistrationResponse,
)
from app.services.brief_service import BriefServiceError, get_today_brief, queue_digest_generation
from app.services.device_preferences_store import get_device_preferences, save_device_preferences
from app.settings import Settings, get_settings

router = APIRouter()


@router.get("/health", response_model=HealthResponse)
def health(settings: Settings = Depends(get_settings)) -> HealthResponse:
    return HealthResponse(
        environment=settings.app_env,
        name=settings.app_name,
        status="ok",
        version=settings.app_version,
    )


@router.get("/brief/today", response_model=DailyBriefResponse)
def brief_today(
    topics: list[str] | None = Query(default=None),
    settings: Settings = Depends(get_settings),
) -> DailyBriefResponse:
    try:
        return get_today_brief(
            topics=topics,
            digest_size=settings.digest_size,
            storage_dir=Path(settings.digest_storage_dir),
        )
    except BriefServiceError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Unable to assemble today's brief from arXiv.",
        ) from exc


@router.post(
    "/device/register-push-token",
    response_model=PushTokenRegistrationResponse,
    status_code=status.HTTP_200_OK,
)
def register_push_token(
    payload: PushTokenRegistrationRequest,
    settings: Settings = Depends(get_settings),
) -> PushTokenRegistrationResponse:
    save_device_preferences(
        storage_dir=Path(settings.device_preferences_storage_dir),
        payload=payload,
    )

    return PushTokenRegistrationResponse(
        message=(
            f"Stored device preferences for {payload.platform} notifications."
            if payload.notifications_enabled
            else f"Stored disabled notification preference for {payload.platform}."
        ),
        registered=True,
    )


@router.get(
    "/device/preferences/{device_id}",
    response_model=DevicePreferencesResponse,
)
def read_device_preferences(
    device_id: str,
    x_internal_token: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> DevicePreferencesResponse:
    if x_internal_token != settings.internal_job_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid internal job token.",
        )

    record = get_device_preferences(
        storage_dir=Path(settings.device_preferences_storage_dir),
        device_id=device_id,
    )

    if record is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device preference record not found.",
        )

    return DevicePreferencesResponse(**record.model_dump())


@router.post("/jobs/generate-digest", response_model=DigestGenerationResponse)
def generate_digest(
    x_internal_token: str | None = Header(default=None),
    topics: list[str] | None = Query(default=None),
    settings: Settings = Depends(get_settings),
) -> DigestGenerationResponse:
    if x_internal_token != settings.internal_job_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid internal job token.",
        )

    return queue_digest_generation(
        topics=topics,
        digest_size=settings.digest_size,
        storage_dir=Path(settings.digest_storage_dir),
    )