import respx
from httpx import Response
from fastapi.testclient import TestClient

from app.main import app

ARXIV_API_URL = "http://export.arxiv.org/api/query"

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
</feed>
"""


client = TestClient(app)


def test_brief_today_returns_five_ranked_papers() -> None:
    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(200, text=ARXIV_FEED))
        response = client.get("/brief/today")

    assert response.status_code == 200

    payload = response.json()

    assert payload["digest_date"]
    assert payload["topics"] == ["llms", "evaluation", "inference"]
    assert len(payload["papers"]) == 5
    assert payload["papers"][0]["id"] == "2505.00001v1"
    assert payload["papers"][0]["rank"] == 1
    assert payload["papers"][4]["rank"] == 5
    assert payload["papers"][0]["tags"] == ["inference", "llms", "optimization"]
    assert payload["papers"][0]["summary_bullets"]


def test_brief_today_returns_bad_gateway_when_arxiv_fails() -> None:
    with respx.mock(assert_all_called=True) as respx_mock:
        respx_mock.get(ARXIV_API_URL).mock(return_value=Response(503, text="unavailable"))
        response = client.get("/brief/today")

    assert response.status_code == 502
    assert response.json()["detail"] == "Unable to assemble today's brief from arXiv."


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