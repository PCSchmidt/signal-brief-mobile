# SPEC

## Current Gate

- Gate: Prototype Hardening
- Status: Live backend integration, local persistence, targeted search, focused backend and mobile tests, and stable smoke paths are implemented.

## MVP Goal

Ship a narrowly scoped mobile prototype that gives busy technical users a useful daily briefing of recent AI arXiv papers plus a targeted query-search path in under five minutes.

## User Problem

Developers and technical professionals who want to follow AI research are overwhelmed by volume. They need a short, trustworthy briefing and a fast way to ask for recent papers on a specific topic without reading raw arXiv feeds all day.

## Day-One User Flow

1. Install the app.
2. Select one or more AI topics during onboarding.
3. Land on the daily briefing screen and understand which topics are driving the current top five.
4. Read the top five paper cards with short bullets and tags.
5. Optionally run a targeted search for a specific topic or method.
6. Save interesting items and open the original arXiv links.

## In Scope For The Current Prototype

### Mobile

- Onboarding with topic selection
- Daily briefing screen with five ranked paper cards from the live backend
- Brief screen visibility for the active topic subset plus a direct topic-edit action
- Targeted search screen for retrieving recent papers for a specific topic prompt
- Paper detail view with summary bullets, metadata, and outbound arXiv link
- Saved items screen backed by local device storage
- Settings screen for topic preferences and notification toggle
- Startup bootstrap and refresh states for loading, error, and digest-not-ready paths

### Backend

- Fetch recent papers from a fixed arXiv source set
- Accept targeted topic queries against the tracked arXiv AI slice
- Normalize paper metadata
- Rank papers for a topic-aware daily digest
- Persist assembled digests by date and selected topics
- Expose health, digest, targeted search, push-token, and internal digest-generation endpoints for the mobile app
- Persist device-level notification preferences and push tokens during the local backend stage
- Warm the default digest on startup and fall back to read-through digest generation on cache miss

### Data And Platform

- Local device persistence for saved items and topic preferences
- File-based local digest persistence during the current backend stage
- Environment configuration for local development and later hosted deployment

## Out Of Scope For The Current Prototype

- User accounts and cross-device sync
- User-added feeds or RSS ingestion
- GitHub trending repositories or project summaries
- Broad research search beyond the tracked arXiv AI source slice
- True semantic search or embedding-based retrieval
- Notes, highlights, or annotations
- Social features
- Payments or premium tiers
- Web product as a first-class release target

## Initial Source Scope

- arXiv only
- Fixed source set owned by the app
- Focus on AI-adjacent categories such as machine learning, large language models, computer vision, robotics, and related topics

## Initial API Surface

- `GET /health`
- `GET /brief/today`
- `GET /papers/search`
- `POST /device/register-push-token`
- `GET /device/preferences/{device_id}` for protected local debugging
- `POST /jobs/generate-digest` for protected internal use

## High-Level Data Model

- `papers`: arXiv metadata, topic tags, summary fields, source timestamps
- `digests`: one digest per generation window and topic set
- `device_preferences`: device identifier, topic selections, notification preference, push token

## Quality Bar

- Digest generation succeeds on startup and on demand without manual repair during local development
- The brief clearly reflects the selected topic subset and does not read like a generic popularity feed
- Targeted search returns recent, visibly relevant papers for representative AI-topic prompts
- Summaries are concise, readable, and grounded in title and abstract metadata
- Mobile app loads today’s digest with acceptable latency on a real runtime path
- The prototype is stable enough to progress toward store testing, even if some public-release work is still intentionally deferred

## Known Current Limitations

- Search is currently token-based and literal, not semantic.
- Search is constrained to a narrow tracked arXiv AI slice.
- Notification delivery is not implemented yet; only registration exists.
- Persistence is still file-based on the backend and local-only on the device.
- Store-release ceremony and production backend hosting are still ahead.

## Open Assumptions To Revisit Later

- Whether public app-store release is worth the added ceremony for this prototype once Android internal testing and iOS TestFlight are working
- Whether summaries should remain metadata-derived or graduate to a deeper summarization pipeline
- Whether local-only saved items are sufficient before accounts are introduced
- Whether notifications belong in the first public release or should be deferred to a later version
