from datetime import UTC, datetime
from pathlib import Path
import re

from pydantic import BaseModel, Field

from app.schemas import PushTokenRegistrationRequest


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
) -> DevicePreferencesRecord:
    record = DevicePreferencesRecord(
        device_id=payload.device_id,
        notifications_enabled=payload.notifications_enabled,
        platform=payload.platform,
        push_token=payload.push_token,
        registered_at=datetime.now(UTC).isoformat().replace("+00:00", "Z"),
        selected_topics=sorted(set(payload.selected_topics)),
    )
    device_path = _device_preferences_path(storage_dir, payload.device_id)
    device_path.parent.mkdir(parents=True, exist_ok=True)
    device_path.write_text(record.model_dump_json(indent=2), encoding="utf-8")
    return record


def get_device_preferences(
    storage_dir: Path,
    device_id: str,
) -> DevicePreferencesRecord | None:
    device_path = _device_preferences_path(storage_dir, device_id)

    if not device_path.exists():
        return None

    return DevicePreferencesRecord.model_validate_json(device_path.read_text(encoding="utf-8"))


def _device_preferences_path(storage_dir: Path, device_id: str) -> Path:
    return storage_dir / f"{_slugify(device_id)}.json"


def _slugify(value: str) -> str:
    return re.sub(r"[^a-z0-9-]+", "-", value.lower()).strip("-") or "device"