# CONTRACT

## Project Identity

- Name: signal-brief-mobile
- Owner: Paul Schmidt
- Build Type: Exploratory / Prototype
- Finish Line: Public iOS and Android prototype release
- Complexity Tier: Medium

## Product Summary

Signal Brief Mobile is a mobile app that delivers a concise daily briefing of recent AI-focused arXiv papers. The first prototype is intentionally narrow: fixed paper sources, one daily digest, short bullet summaries, topic preferences, saved items, and push notifications.

## Target User

- Primary user: a developer or technical professional who wants a fast way to scan recent AI papers without reading full abstracts or browsing arXiv manually
- Day-one value: after installing the app, the user can pick a few AI topics and view a short list of the top five recent papers with bullet summaries and links to the original papers

## Core Stack

- Mobile client: React Native, TypeScript, Expo
- Backend API and jobs: Python, FastAPI
- Managed platform: Supabase
- Database: Supabase Postgres
- Notifications: Expo push notifications
- AI summarization: provider to be selected during implementation, wrapped behind a backend service boundary

## Prototype Success Criteria

- A user can install the app on iOS and Android
- A user can choose at least three AI topic preferences during onboarding
- The system can ingest recent papers from a fixed arXiv source set
- The app can show a daily digest of five papers with concise bullet summaries
- The user can open the original paper link and save items locally
- The app can send a digest-ready push notification
- The prototype is stable enough for a public app-store release

## Deferred Or Banned For The First Prototype

- No user-added custom sources
- No GitHub repo or trend ingestion in the first release
- No social features, comments, or sharing feeds
- No web client
- No payments or subscriptions
- No multi-tenant admin dashboard beyond minimal operational scripts
- No full-text paper parsing pipeline unless arXiv metadata proves insufficient
- No required account sign-in in the first prototype

## Working Product Boundaries

- Source scope: a small fixed set of arXiv AI categories and queries controlled by the app
- Ranking scope: simple recency-plus-topic scoring in the first version
- Personalization scope: on-device topic preferences, not account-level cross-device sync
- Storage scope: backend stores paper metadata and generated digests; device stores local saved items and local preferences for the first prototype

## Key Risks

- Summaries may be low quality if prompts and source metadata are weak
- Daily digest generation can become brittle if the source set is too broad too early
- Public app-store release adds polish and policy requirements that are unusual for a prototype build

## Explicit Assumptions

- The first prototype prioritizes a reliable digest loop over breadth of sources
- Public release is still the target even though the build type is exploratory
- Supabase is used as the managed backend foundation, but auth is deferred until a later version