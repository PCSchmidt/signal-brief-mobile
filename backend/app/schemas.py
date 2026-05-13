from typing import Literal

from pydantic import BaseModel, Field


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


class PushTokenRegistrationRequest(BaseModel):
    notifications_enabled: bool = True
    platform: Literal["android", "ios"]
    push_token: str = Field(min_length=1)
    selected_topics: list[str] = Field(default_factory=list)


class PushTokenRegistrationResponse(BaseModel):
    message: str
    registered: bool


class DigestGenerationResponse(BaseModel):
    digest_date: str
    message: str
    status: Literal["queued"]