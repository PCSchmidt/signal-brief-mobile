from pathlib import Path
import re

from app.schemas import DailyBriefResponse


def load_digest(storage_dir: Path, digest_date: str, topics: list[str]) -> DailyBriefResponse | None:
    digest_path = _digest_path(storage_dir, digest_date, topics)

    if not digest_path.exists():
        return None

    return DailyBriefResponse.model_validate_json(digest_path.read_text(encoding="utf-8"))


def save_digest(storage_dir: Path, digest: DailyBriefResponse) -> DailyBriefResponse:
    digest_path = _digest_path(storage_dir, digest.digest_date, digest.topics)
    digest_path.parent.mkdir(parents=True, exist_ok=True)
    digest_path.write_text(digest.model_dump_json(indent=2), encoding="utf-8")
    return digest


def _digest_path(storage_dir: Path, digest_date: str, topics: list[str]) -> Path:
    topic_slug = "-".join(_slugify(topic) for topic in topics) if topics else "default"
    return storage_dir / f"{digest_date}__{topic_slug}.json"


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-") or "topic"