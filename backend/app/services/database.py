from functools import lru_cache

from sqlalchemy import Boolean, Column, MetaData, String, Table, Text, create_engine
from sqlalchemy.engine import Engine


metadata = MetaData()

digests_table = Table(
    "digests",
    metadata,
    Column("digest_date", String(32), primary_key=True),
    Column("topics_key", String(255), primary_key=True),
    Column("payload", Text, nullable=False),
)

device_preferences_table = Table(
    "device_preferences",
    metadata,
    Column("device_id", String(255), primary_key=True),
    Column("notifications_enabled", Boolean, nullable=False),
    Column("platform", String(32), nullable=False),
    Column("push_token", Text, nullable=True),
    Column("registered_at", String(64), nullable=False),
    Column("selected_topics", Text, nullable=False),
)


@lru_cache(maxsize=4)
def get_engine(database_url: str) -> Engine:
    normalized_database_url = _normalize_database_url(database_url)
    connect_args = {"check_same_thread": False} if normalized_database_url.startswith("sqlite") else {}
    engine = create_engine(normalized_database_url, future=True, connect_args=connect_args)
    metadata.create_all(engine)
    return engine


def initialize_database(database_url: str | None) -> None:
    if not database_url:
        return

    get_engine(database_url)


def _normalize_database_url(database_url: str) -> str:
    if database_url.startswith("postgresql://"):
        return database_url.replace("postgresql://", "postgresql+psycopg://", 1)

    return database_url