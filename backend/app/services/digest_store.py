from pathlib import Path
import re

from sqlalchemy import delete, insert, select

from app.schemas import DailyBriefResponse
from app.services.database import digests_table, get_engine


def load_digest(
    storage_dir: Path,
    digest_date: str,
    topics: list[str],
    database_url: str | None = None,
) -> DailyBriefResponse | None:
    if database_url:
        return _load_digest_from_database(digest_date, topics, database_url)

    digest_path = _digest_path(storage_dir, digest_date, topics)

    if not digest_path.exists():
        return None

    return DailyBriefResponse.model_validate_json(digest_path.read_text(encoding="utf-8"))


def save_digest(
    storage_dir: Path,
    digest: DailyBriefResponse,
    database_url: str | None = None,
) -> DailyBriefResponse:
    if database_url:
        return _save_digest_to_database(digest, database_url)

    digest_path = _digest_path(storage_dir, digest.digest_date, digest.topics)
    digest_path.parent.mkdir(parents=True, exist_ok=True)
    digest_path.write_text(digest.model_dump_json(indent=2), encoding="utf-8")
    return digest


def _load_digest_from_database(
    digest_date: str,
    topics: list[str],
    database_url: str,
) -> DailyBriefResponse | None:
    engine = get_engine(database_url)
    statement = select(digests_table.c.payload).where(
        digests_table.c.digest_date == digest_date,
        digests_table.c.topics_key == _topics_key(topics),
    )

    with engine.connect() as connection:
        payload = connection.execute(statement).scalar_one_or_none()

    if payload is None:
        return None

    return DailyBriefResponse.model_validate_json(payload)


def _save_digest_to_database(
    digest: DailyBriefResponse,
    database_url: str,
) -> DailyBriefResponse:
    engine = get_engine(database_url)
    topics_key = _topics_key(digest.topics)

    with engine.begin() as connection:
        connection.execute(
            delete(digests_table).where(
                digests_table.c.digest_date == digest.digest_date,
                digests_table.c.topics_key == topics_key,
            )
        )
        connection.execute(
            insert(digests_table).values(
                digest_date=digest.digest_date,
                topics_key=topics_key,
                payload=digest.model_dump_json(),
            )
        )

    return digest


def _digest_path(storage_dir: Path, digest_date: str, topics: list[str]) -> Path:
    topic_slug = "-".join(_slugify(topic) for topic in topics) if topics else "default"
    return storage_dir / f"{digest_date}__{topic_slug}.json"


def _topics_key(topics: list[str]) -> str:
    return "|".join(topics) if topics else "default"


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-") or "topic"