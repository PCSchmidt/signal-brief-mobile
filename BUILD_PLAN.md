# BUILD PLAN

## Objective

Move from a local exploratory prototype to a release-ready mobile app in deliberate stages. The first useful public shape is a narrow AI paper briefing product with a clear daily brief, a query-search path, and enough operational discipline to survive store release.

## Current Progress

- Planning docs, mockups, and the mobile shell are in place.
- The FastAPI backend is live with arXiv ingestion, digest persistence, startup warmup, and topic-aware brief generation.
- The mobile app is connected to the live `/brief/today` endpoint.
- A live `/papers/search` backend path and mobile Search screen are implemented.
- Local persistence for onboarding state, topics, saved items, and paper cache is implemented.
- The Brief screen now exposes active topics directly, and the topic picker now supports a single-topic brief.
- Notification preference registration is wired through the backend, but notification delivery itself remains open.
- Backend `pytest`, focused mobile Jest coverage, passing Playwright web smoke flows, and a passing Android emulator Maestro smoke flow are in place.

## Reality Check

The prototype now works as a narrow research-scanning app, but it is not yet ready for public app-store deployment.

The main gaps are:

- natural-language query quality is still too literal
- backend persistence and hosting are still prototype-grade
- notification delivery is incomplete
- release assets, privacy docs, signing, and store workflows are not yet complete
- iOS release work has not yet been validated end to end

## Phase 1: Planning And Boundaries

- Confirm the scope in the planning docs
- Freeze the first content scope to arXiv only
- Freeze the first user experience to a five-paper daily brief plus targeted search
- Keep summaries heuristic until the product shape proves useful

Status: complete

## Phase 2: Frontend Foundation

- Scaffold the Expo TypeScript app
- Set up routing, screen structure, shared UI primitives, and local state
- Implement onboarding, brief list, paper detail, saved items, settings, and search
- Use mock data where needed until backend contracts stabilize

Status: complete for the current prototype shell

## Phase 3: Backend Foundation

- Scaffold FastAPI with a small service layout
- Add arXiv ingestion for a fixed source set
- Add ranking and digest assembly services behind clean interfaces
- Add persisted digest storage and health checks
- Add targeted search against the same tracked source slice

Status: complete for the current local prototype stage

## Phase 4: Prototype Hardening

- Connect the mobile app to live digest and search endpoints
- Persist topic preferences and saved items locally on the device
- Make the active topic subset explicit and editable from the brief itself
- Register push preferences and device tokens
- Add focused tests, smoke validation, and clearer degraded states
- Validate the current runtime on emulator and dev-client paths

Status: in progress

Remaining work inside this phase:

- improve search quality for short natural-language prompts
- finish native dev-client validation on the short Windows path
- decide whether notifications stay in scope for the first release or are deferred
- document real deployment prerequisites instead of prototype assumptions

## Phase 5: Backend Production Readiness

- Host the backend over HTTPS
- Replace or harden prototype persistence
- Add environment separation for local, staging, and production
- Add basic observability, logging, and failure handling
- Add a real digest-generation and notification-send path if notifications remain in scope

Status: not started

## Phase 6: Android Release Track

- Produce a signed Android release build
- Configure Play Console internal and closed testing
- Prepare screenshots, listing copy, privacy disclosures, support links, and data safety answers
- Validate the release build on at least one physical Android device

Status: not started

## Phase 7: iOS Release Track

- Set up Apple Developer and App Store Connect records
- Produce the first iOS build and distribute it through TestFlight
- Validate the build on at least one real iPhone
- Prepare App Store metadata, privacy labels, review notes, and support links

Status: not started

## Exit Criteria Before Android Internal Release

- Search returns visibly relevant results for representative short prompts
- The backend is reachable via a production HTTPS URL
- Release build signing is configured and tested
- Privacy policy and support metadata exist
- The app works on a physical Android device

## Exit Criteria Before iOS TestFlight

- The backend is reachable via the same production environment
- iOS signing and provisioning are working
- The app works on a real iPhone with the target backend
- Notification behavior is either complete or explicitly out of scope for the release

## Exit Criteria Before Public Store Submission

- Digest generation is reliable for repeated runs
- Search quality is acceptable for real user prompts, not only keyword phrases
- App navigation, save flow, settings, and external links work on real devices
- Store assets, privacy disclosures, support contact, and release notes are accurate
- The backend has an owner-operated deployment and rollback plan
