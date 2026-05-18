# signal-brief-mobile

Signal Brief is an exploratory mobile prototype for scanning recent AI research. The current product combines a topic-shaped daily brief with a targeted search tab for recent arXiv papers, plus local saves and device-level notification preference registration.

## Current Product Reality

- The app is a React Native / Expo mobile client backed by a FastAPI service.
- The backend fetches live arXiv metadata from a fixed AI-focused source slice, ranks papers into a top-five brief, and exposes a query-search endpoint.
- The mobile app persists onboarding state, selected topics, saved paper ids, and a local cache of fetched papers in AsyncStorage.
- The app now has four tabs: Search, Brief, Saved, and Settings.
- Topic onboarding now allows a user to continue with one or more topics, not a minimum of three.
- The Brief tab now makes the active topic subset explicit and lets the user jump straight into topic editing.
- The Search tab accepts freeform text and returns recent papers from the tracked arXiv slice.
- Notification preference sync is implemented, but actual digest-ready push delivery is not yet implemented.
- Native Android and iOS identifiers are configured, and Expo dev-client scaffolding exists, but public release work is still ahead.

## What Works Now

### Mobile App

- Splash and bootstrap flow
- Topic onboarding and topic editing
- Search screen for targeted paper search
- Daily brief screen with five ranked papers
- Paper detail screen with metadata, tags, short rationale, and outbound arXiv link
- Saved-items list backed by local device state
- Settings screen for topic editing and notification preference registration

### Backend

- `GET /health`
- `GET /brief/today`
- `GET /papers/search`
- `POST /device/register-push-token`
- `GET /device/preferences/{device_id}` for protected local debugging
- `POST /jobs/generate-digest` for protected internal use

### Validation In Place

- Backend `pytest` coverage for digest, search, date filters, and device preference registration
- Focused mobile Jest coverage for search, brief-topic visibility, and single-topic onboarding behavior
- Passing Playwright web smoke coverage for the critical path and error recovery
- Passing Android emulator Maestro smoke coverage on the current Expo Go path

## Gap Analysis

### Product Gaps

- Search is still keyword-style, not semantic. The backend currently tokenizes a query and turns every token into an `AND` clause against arXiv search terms.
- Search is limited to a narrow arXiv AI source slice. It does not yet search broadly across research ecosystems or even all relevant arXiv categories.
- Search returns recent relevant papers only when the query terms are already close to arXiv title and abstract wording. Natural-language prompts such as "what is latest on semantic agent harnesses" are not strong enough yet.
- The brief is heuristic, not deeply personalized. Ranking is based on topic-tag overlap plus freshness.
- "Summary bullets" are derived from abstract text; they are not yet backed by a deeper summarization pipeline.
- "Why it matters" is heuristic tag-based copy, not model-generated analysis.
- Saved items are local-only, with no account system or cross-device sync.

### Backend And Infrastructure Gaps

- The backend currently uses local file-backed persistence for digests and device preferences, which is fine for local prototyping but not a durable public deployment shape.
- Default mobile config still assumes a local backend in development.
- There is no production hosting, no durable database, no background job scheduler, no alerting, and no production observability stack yet.
- Notification delivery is not implemented. The app can register tokens and preferences, but it does not yet send the digest-ready notification.

### Store-Readiness Gaps

- Android release signing, Play Console setup, store listing assets, and policy forms are not yet documented end to end.
- iOS signing, TestFlight, App Store Connect, and real-device release validation are not yet documented end to end.
- A production privacy policy, support contact flow, and accurate store metadata are not yet in the repo.
- The app still needs a hosted backend over HTTPS before a real public release is credible.

## Deployment Outlook

The realistic release sequence is:

1. Improve search quality for short natural-language prompts.
2. Host the backend over HTTPS with production-safe persistence.
3. Ship an Android internal or closed-test build.
4. Produce a first iOS TestFlight build.
5. Decide whether a public store launch is worth the extra ceremony for this prototype.

For detailed release planning, see:

- `STORE_DEPLOYMENT.md`
- `RELEASE_CHECKLIST.md`
- `BACKEND_PRODUCTION.md`

## Session Handoff

- See `HANDOFF.md` for the exact resume point and next recommended actions.
- Current roadmap phase: `v0.4 Prototype Hardening`
- Current transition point: product-facing prototype behavior is mostly in place; remaining work is search quality, backend production readiness, and release preparation.

## Planning Docs

- `CONTRACT.md` defines the project identity and constraints.
- `SPEC.md` defines the current MVP and hardening scope.
- `VERSION_ROADMAP.md` defines the staged release sequence.
- `BUILD_PLAN.md` defines the working execution plan.
- `MOCKUPS.md` defines the current screen set and UX shape.
- `TESTS.md` defines the test and release validation strategy.
- `STORE_DEPLOYMENT.md` describes Android and iOS deployment work.
- `RELEASE_CHECKLIST.md` is the practical submission and release checklist.
- `BACKEND_PRODUCTION.md` defines the backend changes needed before public deployment.

## Smoke Test

The preferred web smoke tests live at `mobile/playwright/critical-path.spec.ts` and run through Playwright.

The earlier Maestro web experiment remains at `mobile/.maestro/critical-path.web.yaml`.

The native Android Maestro flow lives at `mobile/.maestro/critical-path.android.yaml`.
Its repeated Expo Go launch and overlay handling now live in `mobile/.maestro/subflows/` so the main smoke path stays smaller.

Current validated coverage includes:

- first launch to onboarding to brief
- brief to paper detail and back
- save one paper and verify it appears in Saved
- relaunch and verify onboarding stays skipped and saved state persists
- settings topic editing on Expo web
- digest error recovery on Expo web

## Current Validation Commands

- Backend tests: `cd backend && ..\\..\\.venv\\Scripts\\python.exe -m pytest`
- Mobile typecheck: `cd mobile && npm run typecheck`
- Mobile Jest tests: `cd mobile && npx jest src/screens/__tests__/SearchScreen.test.tsx src/screens/__tests__/DailyBriefScreen.test.tsx src/screens/__tests__/TopicOnboardingScreen.test.tsx --runInBand`
- Playwright web smoke flow: `cd mobile && npm run test:playwright:web`
- Maestro Android smoke flow: `cd mobile && /c/Users/pchri/maestro/maestro/bin/maestro test -e EXPO_DEEPLINK=exp://<host>:8081 .maestro/critical-path.android.yaml`
- Local Android dev build: `cd mobile && npm run android:dev-client -- --port 8082`
- Dev-client Metro: `cd mobile && npm run start:dev-client`

Use `C:\w\sbm\mobile` as the preferred path for native mobile commands on this Windows machine.
