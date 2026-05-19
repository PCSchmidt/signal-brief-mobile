from typing import Literal

from pydantic import BaseModel, Field, model_validator


class HealthResponse(BaseModel):
    environment: str
    name: str
    status: Literal["ok"]
    version: str


class BriefPaper(BaseModel):
    abstract_excerpt: str
    arxiv_url: str
    authors: str
    id: str
    published_at: str
    rank: int
    summary_bullets: list[str] = Field(min_length=1)
    tags: list[str] = Field(min_length=1)
    title: str
    why_it_matters: list[str] = Field(min_length=1)


class DailyBriefResponse(BaseModel):
    digest_date: str
    generated_at: str
    papers: list[BriefPaper] = Field(min_length=1)
    topics: list[str] = Field(min_length=1)


class SearchPapersResponse(BaseModel):
    generated_at: str
    papers: list[BriefPaper] = Field(default_factory=list)
    query: str
    start_date: str | None = None
    end_date: str | None = None


class PushTokenRegistrationRequest(BaseModel):
    device_id: str = Field(min_length=1)
    notifications_enabled: bool = True
    platform: Literal["android", "ios"]
    push_token: str | None = None
    selected_topics: list[str] = Field(default_factory=list)

    @model_validator(mode="after")
    def validate_push_token_for_enabled_notifications(self) -> "PushTokenRegistrationRequest":
        if self.notifications_enabled and not self.push_token:
            raise ValueError("push_token is required when notifications are enabled.")

        return self


class PushTokenRegistrationResponse(BaseModel):
    message: str
    registered: bool


class DevicePreferencesResponse(BaseModel):
    device_id: str
    notifications_enabled: bool
    platform: Literal["android", "ios"]
    push_token: str | None = None
    registered_at: str
    selected_topics: list[str] = Field(default_factory=list)


class DigestGenerationResponse(BaseModel):
    digest_date: str
    message: str
    status: Literal["generated", "queued"]