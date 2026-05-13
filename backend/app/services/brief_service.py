from dataclasses import dataclass
from datetime import UTC, date, datetime
import re
from xml.etree import ElementTree as ET

import httpx

from app.schemas import BriefPaper, DailyBriefResponse, DigestGenerationResponse

ARXIV_API_URL = "http://export.arxiv.org/api/query"
ARXIV_QUERY = "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV OR cat:cs.RO"
ARXIV_FETCH_LIMIT = 12
DEFAULT_TOPICS = ["llms", "evaluation", "inference"]

ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}

TOPIC_KEYWORDS = {
    "agents": ("agent", "workflow", "planning"),
    "evaluation": ("evaluate", "evaluation", "judge", "benchmark"),
    "fine-tuning": ("fine-tuning", "alignment", "instruction tuning"),
    "inference": ("inference", "latency", "serving", "routing"),
    "llms": ("language model", "llm", "transformer", "prompt"),
    "multimodal": ("multimodal", "vision-language", "audio-text"),
    "optimization": ("optimization", "efficient", "compression", "throughput"),
    "rag": ("retrieval", "retrieval-augmented", "rag"),
    "reasoning": ("reasoning", "chain of thought", "deliberation"),
    "robotics": ("robot", "robotics", "control"),
    "safety": ("safety", "harmless", "alignment"),
    "vision": ("vision", "image", "diagram", "visual"),
}

CATEGORY_HINTS = {
    "cs.AI": ("reasoning",),
    "cs.CL": ("llms",),
    "cs.CV": ("vision",),
    "cs.LG": ("optimization",),
    "cs.RO": ("robotics",),
}


class BriefServiceError(RuntimeError):
    pass


@dataclass(slots=True)
class ArxivEntry:
    arxiv_url: str
    authors: str
    categories: list[str]
    entry_id: str
    published_at: date
    summary: str
    title: str


def get_today_brief(topics: list[str] | None = None) -> DailyBriefResponse:
    selected_topics = topics or DEFAULT_TOPICS
    generated_at = datetime.now(UTC).replace(microsecond=0)

    try:
        entries = _fetch_recent_entries()
    except (ET.ParseError, httpx.HTTPError, ValueError) as exc:
        raise BriefServiceError("Unable to fetch or parse the latest arXiv digest.") from exc

    ranked_entries = sorted(
        entries,
        key=lambda entry: _score_entry(entry, selected_topics),
        reverse=True,
    )[:5]

    if not ranked_entries:
        raise BriefServiceError("No recent arXiv entries were available for digest assembly.")

    papers = [
        _to_brief_paper(entry, rank=index + 1)
        for index, entry in enumerate(ranked_entries)
    ]

    return DailyBriefResponse(
        digest_date=generated_at.date().isoformat(),
        generated_at=generated_at.isoformat(),
        papers=papers,
        topics=selected_topics,
    )


def queue_digest_generation() -> DigestGenerationResponse:
    return DigestGenerationResponse(
        digest_date=datetime.now(UTC).date().isoformat(),
        message="Digest generation has been queued.",
        status="queued",
    )


def _fetch_recent_entries() -> list[ArxivEntry]:
    response = httpx.get(
        ARXIV_API_URL,
        params={
            "search_query": ARXIV_QUERY,
            "sortBy": "submittedDate",
            "sortOrder": "descending",
            "start": 0,
            "max_results": ARXIV_FETCH_LIMIT,
        },
        headers={"User-Agent": "signal-brief-mobile/0.1"},
        timeout=15.0,
    )
    response.raise_for_status()

    feed = ET.fromstring(response.text)
    entries: list[ArxivEntry] = []

    for entry in feed.findall("atom:entry", ATOM_NS):
        title = _require_text(entry, "atom:title")
        summary = _require_text(entry, "atom:summary")
        entry_url = _require_text(entry, "atom:id")
        published_text = _require_text(entry, "atom:published")
        published_at = date.fromisoformat(published_text[:10])
        author_names = [
            author_name.text.strip()
            for author_name in entry.findall("atom:author/atom:name", ATOM_NS)
            if author_name.text
        ]
        categories = [
            category.attrib["term"]
            for category in entry.findall("atom:category", ATOM_NS)
            if "term" in category.attrib
        ]

        entries.append(
            ArxivEntry(
                arxiv_url=entry_url,
                authors=", ".join(author_names) if author_names else "Unknown authors",
                categories=categories,
                entry_id=entry_url.rstrip("/").split("/")[-1],
                published_at=published_at,
                summary=_normalize_text(summary),
                title=_normalize_text(title),
            )
        )

    return entries


def _score_entry(entry: ArxivEntry, selected_topics: list[str]) -> tuple[int, int, str]:
    tags = _derive_tags(entry)
    overlap = sum(1 for topic in selected_topics if topic in tags)
    freshness = max(0, 30 - (datetime.now(UTC).date() - entry.published_at).days)

    return (overlap, freshness, entry.title.lower())


def _to_brief_paper(entry: ArxivEntry, rank: int) -> BriefPaper:
    tags = _derive_tags(entry)

    return BriefPaper(
        abstract_excerpt=entry.summary,
        arxiv_url=entry.arxiv_url,
        authors=entry.authors,
        id=entry.entry_id,
        published_at=entry.published_at.isoformat(),
        rank=rank,
        summary_bullets=_summary_bullets(entry.summary),
        tags=tags,
        title=entry.title,
        why_it_matters=_why_it_matters(entry, tags),
    )


def _derive_tags(entry: ArxivEntry) -> list[str]:
    haystack = f"{entry.title} {entry.summary}".lower()
    tags: set[str] = set()

    for tag, keywords in TOPIC_KEYWORDS.items():
        if any(keyword in haystack for keyword in keywords):
            tags.add(tag)

    for category in entry.categories:
        tags.update(CATEGORY_HINTS.get(category, ()))

    if not tags:
        tags.add("reasoning")

    return sorted(tags)


def _summary_bullets(summary: str) -> list[str]:
    sentences = [
        sentence.strip()
        for sentence in re.split(r"(?<=[.!?])\s+", summary)
        if sentence.strip()
    ]
    bullets = [sentence if sentence.endswith((".", "!", "?")) else f"{sentence}." for sentence in sentences[:3]]

    if bullets:
        return bullets

    fallback = summary[:180].rstrip()
    return [f"{fallback}." if not fallback.endswith(".") else fallback]


def _why_it_matters(entry: ArxivEntry, tags: list[str]) -> list[str]:
    bullets: list[str] = []

    if "llms" in tags:
        bullets.append("Relevant to teams tracking how language model capabilities and operations are changing.")
    if "evaluation" in tags:
        bullets.append("Useful for tightening how AI systems are measured, compared, and regression-tested.")
    if "inference" in tags:
        bullets.append("Directly relevant to latency, serving, and system-efficiency decisions.")
    if "rag" in tags:
        bullets.append("Useful for systems that separate retrieval quality from generation quality.")

    if not bullets:
        bullets.append(f"Recent arXiv signal from {entry.published_at.isoformat()} in a tracked AI category.")

    return bullets[:2]


def _normalize_text(value: str) -> str:
    return " ".join(value.split())


def _require_text(entry: ET.Element, selector: str) -> str:
    node = entry.find(selector, ATOM_NS)

    if node is None or node.text is None:
        raise ValueError(f"Missing required arXiv field: {selector}")

    return node.text