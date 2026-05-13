from fastapi import APIRouter, Depends, Header, HTTPException, status

from app.schemas import (
    DailyBriefResponse,
    DigestGenerationResponse,
    HealthResponse,
    PushTokenRegistrationRequest,
    PushTokenRegistrationResponse,
)
from app.services.brief_service import get_today_brief, queue_digest_generation
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
def brief_today() -> DailyBriefResponse:
    return get_today_brief()


@router.post(
    "/device/register-push-token",
    response_model=PushTokenRegistrationResponse,
    status_code=status.HTTP_202_ACCEPTED,
)
def register_push_token(payload: PushTokenRegistrationRequest) -> PushTokenRegistrationResponse:
    return PushTokenRegistrationResponse(
        message=(
            f"Accepted push token for {payload.platform}; persistence will be wired to Supabase "
            "in a later backend slice."
        ),
        registered=True,
    )


@router.post("/jobs/generate-digest", response_model=DigestGenerationResponse)
def generate_digest(
    x_internal_token: str | None = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> DigestGenerationResponse:
    if x_internal_token != settings.internal_job_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing or invalid internal job token.",
        )

    return queue_digest_generation()