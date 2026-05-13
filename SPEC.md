# SPEC

## Current Gate

- Gate: Test Planning
- Status: Frontend approved, test strategy pending approval

## MVP Goal

Ship a narrowly scoped mobile prototype that gives busy technical users a useful daily briefing of recent AI arXiv papers in under five minutes.

## User Problem

Developers and technical professionals who want to follow AI research are overwhelmed by volume. They need a short, trustworthy briefing that helps them decide what is worth deeper reading.

## Day-One User Flow

1. Install the app.
2. Select a small set of AI topics during onboarding.
3. Land on the daily briefing screen.
4. Read the top five paper cards with bullet summaries.
5. Save interesting items and open the original arXiv links.

## In Scope For The First Prototype

### Mobile

- Onboarding with topic selection
- Daily briefing screen with five ranked paper cards
- Paper detail view with summary bullets, metadata, and outbound arXiv link
- Saved items screen backed by local device storage
- Settings screen for topic preferences and notification toggle
- Push notification when the daily digest is ready

### Backend

- Fetch recent papers from a fixed arXiv source set
- Normalize paper metadata
- Rank papers for a topic-aware daily digest
- Generate concise bullet summaries through a summarization service
- Expose digest and paper endpoints for the mobile app
- Run a scheduled job to create the daily digest

### Data And Platform

- Supabase Postgres tables for papers, digests, and digest items
- Minimal operational scripts for scheduled generation and seed setup
- Environment configuration for local development and hosted deployment

## Out Of Scope For The First Prototype

- User accounts and cross-device sync
- User-added feeds or RSS ingestion
- GitHub trending repositories or project summaries
- Search across all papers
- Notes, highlights, or annotations
- Social features
- Payments or premium tiers
- Web application

## Initial Source Scope

- arXiv only
- Fixed source set owned by the app
- Focus on AI-adjacent categories or queries such as machine learning, large language models, computer vision, and related topics

## Core Screens

1. Splash and bootstrap
2. Topic onboarding
3. Daily brief list
4. Paper detail
5. Saved items
6. Settings

## Initial API Surface

- `GET /health`
- `GET /brief/today`
- `GET /papers/{paper_id}`
- `POST /device/register-push-token`
- `POST /jobs/generate-digest` for protected internal use

## High-Level Data Model

- `papers`: arXiv metadata, topic tags, summary fields, source timestamps
- `digests`: one digest per generation window
- `digest_items`: ranked membership between digest and papers
- `device_preferences`: device identifier, topic selections, notification preference, push token

## Quality Bar

- Digest generation succeeds on a fixed schedule without manual intervention
- Summaries are concise, readable, and grounded in paper metadata
- Mobile app loads today’s digest with acceptable latency on a real device
- The prototype is stable enough for public release, even if feature scope remains intentionally narrow

## Open Assumptions To Revisit Later

- Whether public app-store release remains worth the extra release ceremony for an exploratory build
- Whether summaries should be generated from title and abstract only, or from deeper paper content later
- Whether local-only saved items are sufficient before accounts are introduced