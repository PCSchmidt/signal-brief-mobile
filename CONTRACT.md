# CONTRACT

## Project Identity

- Name: signal-brief-mobile
- Owner: Paul Schmidt
- Build Type: Exploratory / Prototype
- Finish Line: working Android internal release plus iOS TestFlight, with public release treated as a later decision
- Complexity Tier: Medium

## Product Summary

Signal Brief Mobile is a mobile app that delivers a concise daily briefing of recent AI-focused arXiv papers plus a targeted search path for recent papers on a specific topic. The current prototype is intentionally narrow: fixed paper sources, one daily digest, query search, local saved items, topic preferences, and notification registration.

## Target User

- Primary user: a developer or technical professional who wants a fast way to scan recent AI papers without reading full abstracts or browsing arXiv manually
- Day-one value: after installing the app, the user can pick one or more AI topics, view a short list of the top five recent papers, and optionally run a targeted search for a specific topic

## Core Stack

- Mobile client: React Native, TypeScript, Expo
- Backend API and jobs: Python, FastAPI
- Current backend persistence: local file storage for digests and device preferences
- Notifications: Expo push token registration today; delivery pipeline still pending
- Current summary approach: metadata-derived bullets and heuristics, not a full LLM summarization pipeline

## Prototype Success Criteria

- A user can install the app on Android and eventually iOS test distribution
- A user can choose one or more AI topic preferences during onboarding
- The system can ingest recent papers from a fixed arXiv source set
- The app can show a daily digest of five papers with concise, metadata-grounded bullets
- The app can run a targeted paper search against the tracked arXiv AI slice
- The user can open the original paper link and save items locally
- The app can register device notification preferences and push tokens, even if delivery is still deferred
- The prototype is stable enough to move into Android internal testing and iOS TestFlight

## Deferred Or Banned For The First Prototype

- No user-added custom sources
- No GitHub repo or trend ingestion in the first release
- No social features, comments, or sharing feeds
- No web client as a first-class release target
- No payments or subscriptions
- No multi-tenant admin dashboard beyond minimal operational scripts
- No full-text paper parsing pipeline unless arXiv metadata proves insufficient
- No required account sign-in in the first prototype
- No claim of semantic search until the backend actually supports it

## Working Product Boundaries

- Source scope: a small fixed set of arXiv AI categories and queries controlled by the app
- Ranking scope: simple topic-overlap plus freshness scoring in the current version
- Search scope: targeted keyword-style query search over the tracked arXiv AI slice
- Personalization scope: on-device topic preferences, not account-level cross-device sync
- Storage scope: backend stores prototype digests and device preferences in local files; device stores local saved items and preferences

## Key Risks

- Search quality will feel weak for natural-language prompts until query handling improves
- Daily digest generation can become brittle if the source set is too broad too early
- Public app-store release adds signing, hosting, privacy, and support obligations that are unusual for a prototype build

## Explicit Assumptions

- The first prototype prioritizes a reliable digest loop over breadth of sources
- Android internal release and iOS TestFlight are better immediate goals than promising a public release by default
- A production backend platform choice is still open and should be made when the app is ready to leave local prototype infrastructure