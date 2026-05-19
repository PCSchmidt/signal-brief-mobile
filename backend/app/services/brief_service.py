from dataclasses import dataclass
from datetime import UTC, date, datetime
from pathlib import Path
import re
from xml.etree import ElementTree as ET

import httpx

from app.schemas import BriefPaper, DailyBriefResponse, DigestGenerationResponse, SearchPapersResponse
from app.services.digest_store import load_digest, save_digest

ARXIV_API_URL = "https://export.arxiv.org/api/query"
ARXIV_QUERY = "cat:cs.AI OR cat:cs.LG OR cat:cs.CL OR cat:cs.CV OR cat:cs.RO"
ARXIV_FETCH_LIMIT = 12
ARXIV_SEARCH_FETCH_LIMIT = 25
DEFAULT_TOPICS = ["llms", "evaluation", "inference"]

ATOM_NS = {"atom": "http://www.w3.org/2005/Atom"}

TOPIC_KEYWORDS = {
    "agents": ("agent", "workflow", "planning"),
    "ai-systems": ("system", "systems", "orchestration", "scheduler", "pipeline", "infrastructure"),
    "benchmarks": ("benchmark", "leaderboard", "test set", "evaluation set", "scoring"),
    "data-engineering": ("ingestion", "etl", "indexing", "curation", "data quality", "data pipeline"),
    "deployment": ("deployment", "rollout", "monitoring", "observability", "reliability"),
    "developer-tools": ("developer tool", "developer tools", "ide", "code generation", "software engineering", "repository", "repo", "coding agent"),
    "evaluation": ("evaluate", "evaluation", "judge", "benchmark"),
    "fine-tuning": ("fine-tuning", "alignment", "instruction tuning"),
    "governance": ("governance", "compliance", "regulation", "policy", "audit", "accountability", "red teaming"),
    "inference": ("inference", "latency", "serving", "routing"),
    "llms": ("language model", "llm", "transformer", "prompt"),
    "model-serving": ("serving", "throughput", "batching", "inference server", "caching", "tail latency"),
    "multimodal": ("multimodal", "vision-language", "audio-text"),
    "optimization": ("optimization", "efficient", "compression", "throughput"),
    "rag": ("retrieval", "retrieval-augmented", "rag"),
    "reasoning": ("reasoning", "chain of thought", "deliberation"),
    "robotics": ("robot", "robotics", "control"),
    "safety": ("safety", "harmless", "alignment"),
    "synthetic-data": ("synthetic data", "generated data", "augmentation", "weak supervision", "distilled data"),
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


def get_today_brief(
    topics: list[str] | None = None,
    *,
    digest_size: int = 5,
    database_url: str | None = None,
    storage_dir: Path | None = None,
) -> DailyBriefResponse:
    return _get_or_build_digest(
        topics=topics,
        database_url=database_url,
        digest_size=digest_size,
        storage_dir=storage_dir,
    )


def queue_digest_generation(
    topics: list[str] | None = None,
    *,
    digest_size: int = 5,
    database_url: str | None = None,
    storage_dir: Path | None = None,
) -> DigestGenerationResponse:
    digest = _build_digest(
        database_url=database_url,
        selected_topics=_normalize_topics(topics),
        digest_size=digest_size,
        storage_dir=storage_dir,
    )

    return DigestGenerationResponse(
        digest_date=digest.digest_date,
        message="Digest generated and persisted.",
        status="generated",
    )


def search_papers(
    query: str,
    *,
    limit: int = 10,
    start_date: date | None = None,
    end_date: date | None = None,
) -> SearchPapersResponse:
    normalized_query = _normalize_text(query).strip()

    if not normalized_query:
        raise BriefServiceError("Search query cannot be empty.")

    generated_at = datetime.now(UTC).replace(microsecond=0)

    try:
        entries = _fetch_search_entries(
            query=normalized_query,
            start_date=start_date,
            end_date=end_date,
            limit=limit,
        )
    except (ET.ParseError, httpx.HTTPError, ValueError) as exc:
        raise BriefServiceError("Unable to fetch search results from arXiv.") from exc

    return SearchPapersResponse(
        generated_at=generated_at.isoformat(),
        papers=[_to_brief_paper(entry, rank=index + 1) for index, entry in enumerate(entries)],
        query=normalized_query,
        start_date=start_date.isoformat() if start_date else None,
        end_date=end_date.isoformat() if end_date else None,
    )


def _get_or_build_digest(
    topics: list[str] | None,
    *,
    database_url: str | None,
    digest_size: int,
    storage_dir: Path | None,
) -> DailyBriefResponse:
    selected_topics = _normalize_topics(topics)
    digest_date = datetime.now(UTC).date().isoformat()

    if storage_dir is not None:
        cached_digest = load_digest(
            storage_dir,
            digest_date,
            selected_topics,
            database_url=database_url,
        )
        if cached_digest is not None:
            return cached_digest

    return _build_digest(
        database_url=database_url,
        selected_topics=selected_topics,
        digest_size=digest_size,
        storage_dir=storage_dir,
    )


def _build_digest(
    *,
    database_url: str | None,
    selected_topics: list[str],
    digest_size: int,
    storage_dir: Path | None,
) -> DailyBriefResponse:
    generated_at = datetime.now(UTC).replace(microsecond=0)

    try:
        entries = _fetch_recent_entries()
    except (ET.ParseError, httpx.HTTPError, ValueError) as exc:
        raise BriefServiceError("Unable to fetch or parse the latest arXiv digest.") from exc

    ranked_entries = sorted(
        entries,
        key=lambda entry: _score_entry(entry, selected_topics),
        reverse=True,
    )[:digest_size]

    if not ranked_entries:
        raise BriefServiceError("No recent arXiv entries were available for digest assembly.")

    digest = DailyBriefResponse(
        digest_date=generated_at.date().isoformat(),
        generated_at=generated_at.isoformat(),
        papers=[
            _to_brief_paper(entry, rank=index + 1)
            for index, entry in enumerate(ranked_entries)
        ],
        topics=selected_topics,
    )

    if storage_dir is not None:
        return save_digest(storage_dir, digest, database_url=database_url)

    return digest


def _fetch_recent_entries() -> list[ArxivEntry]:
    return _fetch_entries(
        search_query=ARXIV_QUERY,
        sort_by="submittedDate",
        max_results=ARXIV_FETCH_LIMIT,
    )


def _fetch_search_entries(
    *,
    query: str,
    start_date: date | None,
    end_date: date | None,
    limit: int,
) -> list[ArxivEntry]:
    if start_date and end_date and start_date > end_date:
        raise BriefServiceError("Search start_date cannot be later than end_date.")

    entries = _fetch_entries(
        search_query=_build_search_query(query, start_date=start_date, end_date=end_date),
        sort_by="relevance",
        max_results=max(limit * 2, ARXIV_SEARCH_FETCH_LIMIT),
    )

    filtered_entries = [
        entry
        for entry in entries
        if (start_date is None or entry.published_at >= start_date)
        and (end_date is None or entry.published_at <= end_date)
    ]

    return filtered_entries[:limit]


def _fetch_entries(*, search_query: str, sort_by: str, max_results: int) -> list[ArxivEntry]:
    response = httpx.get(
        ARXIV_API_URL,
        params={
            "search_query": search_query,
            "sortBy": sort_by,
            "sortOrder": "descending",
            "start": 0,
            "max_results": max_results,
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


def _build_search_query(query: str, *, start_date: date | None, end_date: date | None) -> str:
    tokens = re.findall(r"[A-Za-z0-9-]+", query.lower())

    if not tokens:
        raise BriefServiceError("Search query must include at least one searchable term.")

    text_clause = " AND ".join(f"all:{token}" for token in tokens)
    clauses = [f"({ARXIV_QUERY})", f"({text_clause})"]

    if start_date or end_date:
        lower_bound = (start_date or date(1991, 1, 1)).strftime("%Y%m%d")
        upper_bound = (end_date or datetime.now(UTC).date()).strftime("%Y%m%d")
        clauses.append(f"submittedDate:[{lower_bound}0000 TO {upper_bound}2359]")

    return " AND ".join(clauses)


def _normalize_topics(topics: list[str] | None) -> list[str]:
    if not topics:
        return DEFAULT_TOPICS

    normalized = {
        topic.strip().lower()
        for topic in topics
        if topic and topic.strip().lower() in TOPIC_KEYWORDS
    }

    if not normalized:
        return DEFAULT_TOPICS

    return [topic for topic in TOPIC_KEYWORDS if topic in normalized]


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