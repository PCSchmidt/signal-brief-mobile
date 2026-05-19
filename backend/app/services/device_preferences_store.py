import json
from datetime import UTC, datetime
from pathlib import Path
import re

from pydantic import BaseModel, Field
from sqlalchemy import delete, insert, select

from app.schemas import PushTokenRegistrationRequest
from app.services.database import device_preferences_table, get_engine


class DevicePreferencesRecord(BaseModel):
    device_id: str
    notifications_enabled: bool
    platform: str
    push_token: str | None = None
    registered_at: str
    selected_topics: list[str] = Field(default_factory=list)


def save_device_preferences(
    storage_dir: Path,
    payload: PushTokenRegistrationRequest,
    database_url: str | None = None,
) -> DevicePreferencesRecord:
    record = DevicePreferencesRecord(
        device_id=payload.device_id,
        notifications_enabled=payload.notifications_enabled,
        platform=payload.platform,
        push_token=payload.push_token,
        registered_at=datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        selected_topics=sorted(set(payload.selected_topics)),
    )

    if database_url:
        return _save_device_preferences_to_database(record, database_url)

    device_path = _device_preferences_path(storage_dir, payload.device_id)
    device_path.parent.mkdir(parents=True, exist_ok=True)
    device_path.write_text(record.model_dump_json(indent=2), encoding="utf-8")
    return record


def get_device_preferences(
    storage_dir: Path,
    device_id: str,
    database_url: str | None = None,
) -> DevicePreferencesRecord | None:
    if database_url:
        return _get_device_preferences_from_database(device_id, database_url)

    device_path = _device_preferences_path(storage_dir, device_id)

    if not device_path.exists():
        return None

    return DevicePreferencesRecord.model_validate_json(device_path.read_text(encoding="utf-8"))


def _save_device_preferences_to_database(
    record: DevicePreferencesRecord,
    database_url: str,
) -> DevicePreferencesRecord:
    engine = get_engine(database_url)

    with engine.begin() as connection:
        connection.execute(
            delete(device_preferences_table).where(
                device_preferences_table.c.device_id == record.device_id,
            )
        )
        connection.execute(
            insert(device_preferences_table).values(
                device_id=record.device_id,
                notifications_enabled=record.notifications_enabled,
                platform=record.platform,
                push_token=record.push_token,
                registered_at=record.registered_at,
                selected_topics=json.dumps(record.selected_topics),
            )
        )

    return record


def _get_device_preferences_from_database(
    device_id: str,
    database_url: str,
) -> DevicePreferencesRecord | None:
    engine = get_engine(database_url)
    statement = select(
        device_preferences_table.c.device_id,
        device_preferences_table.c.notifications_enabled,
        device_preferences_table.c.platform,
        device_preferences_table.c.push_token,
        device_preferences_table.c.registered_at,
        device_preferences_table.c.selected_topics,
    ).where(device_preferences_table.c.device_id == device_id)

    with engine.connect() as connection:
        row = connection.execute(statement).mappings().first()

    if row is None:
        return None

    return DevicePreferencesRecord(
        device_id=row["device_id"],
        notifications_enabled=row["notifications_enabled"],
        platform=row["platform"],
        push_token=row["push_token"],
        registered_at=row["registered_at"],
        selected_topics=json.loads(row["selected_topics"]),
    )


def _device_preferences_path(storage_dir: Path, device_id: str) -> Path:
    return storage_dir / f"{_slugify(device_id)}.json"


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-") or "device"