from datetime import UTC, datetime

from app.schemas import BriefPaper, DailyBriefResponse, DigestGenerationResponse


def get_today_brief() -> DailyBriefResponse:
    generated_at = datetime.now(UTC).replace(microsecond=0).isoformat()

    papers = [
        BriefPaper(
            abstract_excerpt=(
                "We study adaptive inference policies for language models under latency constraints "
                "and show that selective deliberation improves workload efficiency."
            ),
            arxiv_url="https://arxiv.org/abs/2505.01321",
            authors="J. Patel, R. Kim, L. Torres",
            id="paper-1",
            published_at="2026-05-13",
            rank=1,
            summary_bullets=[
                "Routes only harder prompts into slower reasoning passes.",
                "Reduces average latency while preserving most benchmark quality.",
                "Makes tail-latency tradeoffs visible to the operator.",
            ],
            tags=["llms", "inference", "optimization"],
            title="Selective Deliberation for Low-Latency Language Model Routing",
            why_it_matters=[
                "Useful for product teams thinking about cost and quality at the same time.",
                "Closer to production decision-making than leaderboard-only research progress.",
            ],
        ),
        BriefPaper(
            abstract_excerpt=(
                "Current RAG evaluation often entangles retrieval and generation. The paper proposes "
                "grounded benchmarks that separate these error sources."
            ),
            arxiv_url="https://arxiv.org/abs/2505.01008",
            authors="M. Evans, S. Roy, D. Chan",
            id="paper-2",
            published_at="2026-05-12",
            rank=2,
            summary_bullets=[
                "Separates retrieval quality from generation quality.",
                "Shows where end-to-end metrics hide failure modes.",
                "Offers a cleaner pattern for regression testing RAG systems.",
            ],
            tags=["rag", "evaluation", "llms"],
            title="Grounded Evaluation Sets for Retrieval-Augmented Generation Systems",
            why_it_matters=[
                "Relevant to future ranking and summarization evaluation inside this app.",
            ],
        ),
        BriefPaper(
            abstract_excerpt=(
                "Automated judges are increasingly used to score technical summaries. This paper studies "
                "calibration gaps and practical strategies for improving trust in those evaluations."
            ),
            arxiv_url="https://arxiv.org/abs/2505.00877",
            authors="A. Singh, T. Wu",
            id="paper-3",
            published_at="2026-05-11",
            rank=3,
            summary_bullets=[
                "Measures disagreement and overconfidence in automated summary judges.",
                "Shows why factual nuance is easy for judge models to miss.",
                "Suggests hybrid evaluation with lightweight human spot checks.",
            ],
            tags=["evaluation", "llms", "reasoning"],
            title="Calibrating Automated Judges for Research Paper Summaries",
            why_it_matters=[
                "Directly relevant to the quality bar for daily brief summaries.",
            ],
        ),
        BriefPaper(
            abstract_excerpt=(
                "The authors introduce a compressed memory representation for multimodal agents that "
                "preserves high-value context while reducing prompt growth."
            ),
            arxiv_url="https://arxiv.org/abs/2505.00731",
            authors="C. Lopez, Y. Zhang, K. Nair",
            id="paper-4",
            published_at="2026-05-10",
            rank=4,
            summary_bullets=[
                "Compresses long-running multimodal agent memory.",
                "Preserves retrieval quality while reducing context footprint.",
                "Frames memory handling as a systems problem.",
            ],
            tags=["agents", "multimodal", "optimization"],
            title="Multimodal Memory Compression for Agentic Workflows",
            why_it_matters=[
                "Useful for tracking practical agent systems work beyond toy demos.",
            ],
        ),
        BriefPaper(
            abstract_excerpt=(
                "Scientific diagrams remain a weak point for many vision-language models. The paper proposes "
                "a pretraining recipe that improves representation quality on sparse technical figures."
            ),
            arxiv_url="https://arxiv.org/abs/2505.00492",
            authors="R. Hale, N. Brooke, P. Iyer",
            id="paper-5",
            published_at="2026-05-09",
            rank=5,
            summary_bullets=[
                "Targets sparse scientific figures rather than everyday images.",
                "Uses structured annotations to improve technical diagram reasoning.",
                "Improves chart and schematic interpretation benchmarks.",
            ],
            tags=["vision", "multimodal", "reasoning"],
            title="Vision-Language Pretraining with Sparse Scientific Diagrams",
            why_it_matters=[
                "Interesting if the brief later expands beyond text-heavy papers.",
            ],
        ),
    ]

    return DailyBriefResponse(
        digest_date="2026-05-13",
        generated_at=generated_at,
        papers=papers,
        topics=["llms", "evaluation", "inference"],
    )


def queue_digest_generation() -> DigestGenerationResponse:
    return DigestGenerationResponse(
        digest_date="2026-05-13",
        message="Digest generation has been queued.",
        status="queued",
    )