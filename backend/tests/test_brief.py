from pathlib import Path

import respx
from fastapi.testclient import TestClient
from httpx import Response

from app.main import app
from app.services.database import _normalize_database_url
from app.settings import Settings, get_settings

ARXIV_API_URL = "https://export.arxiv.org/api/query"

ARXIV_FEED = """<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
    <entry>
        <id>http://arxiv.org/abs/2505.00001v1</id>
        <published>2026-05-13T12:00:00Z</published>
        <title>Low-Latency Language Model Routing for Production Inference</title>
        <summary>This paper studies language model routing under latency constraints. It improves inference efficiency for mixed workloads. It also discusses production tradeoffs.</summary>
        <author><name>Alpha Researcher</name></author>
        <category term="cs.CL" />
        <category term="cs.LG" />
    </entry>
    <entry>
        <id>http://arxiv.org/abs/2505.00002v1</id>
        <published>2026-05-12T12:00:00Z</published>
        <title>Grounded Evaluation Sets for Retrieval-Augmented Generation</title>
        <summary>This paper evaluates retrieval augmented generation systems. It isolates evaluation signals from generation quality. It proposes better benchmark design.</summary>
        <author><name>Beta Researcher</name></author>
        <category term="cs.AI" />
    </entry>
    <entry>
        <id>http://arxiv.org/abs/2505.00003v1</id>
        <published>2026-05-11T12:00:00Z</published>
        <title>Automated Judges for Technical Summary Evaluation</title>
        <summary>This work studies evaluation with automated judges. It measures summary quality and factual consistency. It highlights calibration issues.</summary>
        <author><name>Gamma Researcher</name></author>
        <category term="cs.AI" />
    </entry>
    <entry>
        <id>http://arxiv.org/abs/2505.00004v1</id>
        <published>2026-05-10T12:00:00Z</published>
        <title>Agent Memory Compression for Long-Horizon Tasks</title>
        <summary>This paper compresses agent memory for long workflows. It improves efficiency. It focuses on planning and context selection.</summary>
        <author><name>Delta Researcher</name></author>
        <category term="cs.AI" />
        <category term="cs.RO" />
    </entry>
    <entry>
        <id>http://arxiv.org/abs/2505.00005v1</id>
        <published>2026-05-09T12:00:00Z</published>
        <title>Diagram Reasoning for Vision-Language Models</title>
        <summary>This paper improves vision language understanding for scientific diagrams. It studies visual reasoning. It targets technical figures.</summary>
        <author><name>Epsilon Researcher</name></author>
        <category term="cs.CV" />
    </entry>
    <entry>
        <id>http://arxiv.org/abs/2505.00006v1</id>
        <published>2026-05-08T12:00:00Z</published>
        <title>Safety-Focused Fine-Tuning with Smaller Budgets</title>
        <summary>This paper studies safety fine tuning under resource constraints. It compares alignment strategies. It discusses deployment tradeoffs.</summary>
        <author><name>Zeta Researcher</name></author>
        <category term="cs.CL" />
    </entry>
    <entry>
        <id>http://arxiv.org/abs/2505.00007v1</id>
        <published>2026-05-14T12:00:00Z</published>
        <title>Repository-Scale Coding Agents for IDE-Assisted Software Engineering</title>
        <summary>This paper studies coding agent workflows inside developer tools. It improves repository navigation, code generation, and software engineering task execution.</summary>
        <author><name>Eta Researcher</name></author>
        <category term="cs.AI" />
    </entry>
</feed>
"""


client = TestClient(app)


def _override_settings(tmp_path: Path, *, database_url: str | None = None):
    def _build_settings() -> Settings:
        return Settings(
            database_url=database_url,
            digest_storage_dir=tmp_path / "digests",
            device_preferences_storage_dir=tmp_path / "device-preferences",
            internal_job_token="signal-brief-local-token",
        )

    return _build_settings


def test_brief_today_returns_five_ranked_papers(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        response = client.get(
            "/brief/today",
            params=[("topics", "llms"), ("topics", "evaluation"), ("topics", "inference")],
        )

    app.dependency_overrides.clear()

    assert response.status_code == 200

    payload = response.json()

    assert payload["digest_date"]
    assert payload["topics"] == ["evaluation", "inference", "llms"]
    assert len(payload["papers"]) == 5
    assert payload["papers"][0]["id"] == "2505.00001v1"
    assert payload["papers"][0]["rank"] == 1
    assert payload["papers"][4]["rank"] == 5
    assert payload["papers"][0]["tags"] == ["inference", "llms", "optimization"]
    assert payload["papers"][0]["summary_bullets"]
    assert list((tmp_path / "digests").glob("*.json"))


def test_normalize_database_url_uses_psycopg_driver_for_postgres() -> None:
    assert _normalize_database_url("postgresql://user:pass@db.example.com:5432/app") == (
        "postgresql+psycopg://user:pass@db.example.com:5432/app"
    )
    assert _normalize_database_url("postgresql+psycopg://user:pass@db.example.com:5432/app") == (
        "postgresql+psycopg://user:pass@db.example.com:5432/app"
    )


def test_brief_today_uses_persisted_digest_on_second_request(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        first_response = client.get("/brief/today", params=[("topics", "llms"), ("topics", "evaluation")])

    second_response = client.get("/brief/today", params=[("topics", "evaluation"), ("topics", "llms")])

    app.dependency_overrides.clear()

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert first_response.json()["papers"][0]["id"] == second_response.json()["papers"][0]["id"]


def test_brief_today_uses_database_digest_on_second_request(tmp_path: Path) -> None:
    database_url = f"sqlite:///{(tmp_path / 'signal-brief.db').as_posix()}"
    app.dependency_overrides[get_settings] = _override_settings(tmp_path, database_url=database_url)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        first_response = client.get("/brief/today", params=[("topics", "llms"), ("topics", "evaluation")])

    with respx.mock(assert_all_called=False) as respx_mock:
        arxiv_route = respx_mock.get(ARXIV_API_URL).mock(return_value=Response(503, text="unavailable"))
        second_response = client.get("/brief/today", params=[("topics", "evaluation"), ("topics", "llms")])

    app.dependency_overrides.clear()

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert first_response.json()["papers"][0]["id"] == second_response.json()["papers"][0]["id"]
    assert arxiv_route.call_count == 0


def test_brief_today_returns_bad_gateway_when_arxiv_fails(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(503, text="unavailable"))
        response = client.get("/brief/today")

    app.dependency_overrides.clear()

    assert response.status_code == 502
    assert response.json()["detail"] == "Unable to assemble today's brief from arXiv."


def test_papers_search_returns_query_matched_results(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        response = client.get(
            "/papers/search",
            params={"query": "language model routing", "limit": 3},
        )

    app.dependency_overrides.clear()

    assert response.status_code == 200

    payload = response.json()

    assert payload["query"] == "language model routing"
    assert payload["generated_at"]
    assert len(payload["papers"]) == 3
    assert payload["papers"][0]["id"] == "2505.00001v1"
    assert payload["papers"][0]["rank"] == 1


def test_papers_search_supports_date_filters(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        response = client.get(
            "/papers/search",
            params={
                "query": "evaluation",
                "start_date": "2026-05-12",
                "end_date": "2026-05-12",
            },
        )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["start_date"] == "2026-05-12"
    assert response.json()["end_date"] == "2026-05-12"
    assert [paper["id"] for paper in response.json()["papers"]] == ["2505.00002v1"]


def test_brief_today_supports_new_topic_taxonomy(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        response = client.get("/brief/today", params=[("topics", "developer-tools")])

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["topics"] == ["developer-tools"]
    assert response.json()["papers"][0]["id"] == "2505.00007v1"
    assert "developer-tools" in response.json()["papers"][0]["tags"]


def test_generate_digest_requires_internal_token() -> None:
    response = client.post("/jobs/generate-digest")

    assert response.status_code == 401
    assert response.json()["detail"] == "Missing or invalid internal job token."


def test_read_device_preferences_requires_internal_token(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    response = client.get("/device/preferences/device-123")

    app.dependency_overrides.clear()

    assert response.status_code == 401
    assert response.json()["detail"] == "Missing or invalid internal job token."


def test_generate_digest_persists_requested_topics(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        response = client.post(
            "/jobs/generate-digest",
            params=[("topics", "llms"), ("topics", "evaluation")],
            headers={"x-internal-token": "signal-brief-local-token"},
        )

    app.dependency_overrides.clear()

    assert response.status_code == 200
    assert response.json()["status"] == "generated"
    assert list((tmp_path / "digests").glob("*.json"))


def test_register_push_token_accepts_payload() -> None:
    with TestClient(app) as local_client:
        response = local_client.post(
        "/device/register-push-token",
        json={
            "device_id": "device-123",
            "notifications_enabled": True,
            "platform": "ios",
            "push_token": "ExponentPushToken[test-token]",
            "selected_topics": ["llms", "evaluation"],
        },
        )

    assert response.status_code == 200
    assert response.json()["registered"] is True


def test_register_push_token_persists_and_updates_device_preferences(tmp_path: Path) -> None:
    app.dependency_overrides[get_settings] = _override_settings(tmp_path)

    first_response = client.post(
        "/device/register-push-token",
        json={
            "device_id": "android-device-001",
            "notifications_enabled": True,
            "platform": "android",
            "push_token": "ExponentPushToken[first-token]",
            "selected_topics": ["evaluation", "llms"],
        },
    )

    second_response = client.post(
        "/device/register-push-token",
        json={
            "device_id": "android-device-001",
            "notifications_enabled": False,
            "platform": "android",
            "push_token": None,
            "selected_topics": ["evaluation"],
        },
    )

    read_response = client.get(
        "/device/preferences/android-device-001",
        headers={"x-internal-token": "signal-brief-local-token"},
    )

    app.dependency_overrides.clear()

    stored_files = list((tmp_path / "device-preferences").glob("*.json"))

    assert first_response.status_code == 200
    assert second_response.status_code == 200
    assert read_response.status_code == 200
    assert len(stored_files) == 1
    assert 'disabled notification preference' in second_response.json()["message"]
    assert read_response.json()["device_id"] == "android-device-001"
    assert read_response.json()["notifications_enabled"] is False
    assert read_response.json()["selected_topics"] == ["evaluation"]
    assert '"notifications_enabled": false' in stored_files[0].read_text(encoding="utf-8")
    assert '"selected_topics": [' in stored_files[0].read_text(encoding="utf-8")


def test_register_push_token_persists_device_preferences_in_database(tmp_path: Path) -> None:
    database_url = f"sqlite:///{(tmp_path / 'signal-brief.db').as_posix()}"
    app.dependency_overrides[get_settings] = _override_settings(tmp_path, database_url=database_url)

    write_response = client.post(
        "/device/register-push-token",
        json={
            "device_id": "ios-device-001",
            "notifications_enabled": True,
            "platform": "ios",
            "push_token": "ExponentPushToken[db-token]",
            "selected_topics": ["llms", "evaluation"],
        },
    )

    read_response = client.get(
        "/device/preferences/ios-device-001",
        headers={"x-internal-token": "signal-brief-local-token"},
    )

    app.dependency_overrides.clear()

    assert write_response.status_code == 200
    assert read_response.status_code == 200
    assert read_response.json()["device_id"] == "ios-device-001"
    assert read_response.json()["push_token"] == "ExponentPushToken[db-token]"
    assert read_response.json()["selected_topics"] == ["evaluation", "llms"]
    assert not list((tmp_path / "device-preferences").glob("*.json"))