from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_brief_today_returns_five_ranked_papers() -> None:
    response = client.get("/brief/today")

    assert response.status_code == 200

    payload = response.json()

    assert payload["digest_date"] == "2026-05-13"
    assert len(payload["papers"]) == 5
    assert payload["papers"][0]["rank"] == 1
    assert payload["papers"][4]["rank"] == 5


def test_generate_digest_requires_internal_token() -> None:
    response = client.post("/jobs/generate-digest")

    assert response.status_code == 401
    assert response.json()["detail"] == "Missing or invalid internal job token."


def test_register_push_token_accepts_payload() -> None:
    response = client.post(
        "/device/register-push-token",
        json={
            "notifications_enabled": True,
            "platform": "ios",
            "push_token": "ExponentPushToken[test-token]",
            "selected_topics": ["llms", "evaluation"],
        },
    )

    assert response.status_code == 202
    assert response.json()["registered"] is True