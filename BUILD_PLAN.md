# BUILD PLAN

## Objective

Move from empty repo to a public prototype in a controlled sequence that proves the core value first: a reliable daily AI paper briefing on a mobile device.

## Current Progress

- Planning docs, mockups, and frontend shell are complete.
- The FastAPI backend is live with arXiv ingestion, digest persistence, startup warmup, and topic-aware brief generation.
- The mobile app is connected to the live `/brief/today` endpoint.
- Local persistence for saved items and topic preferences is implemented.
- Backend `pytest`, mobile Jest coverage for the brief screen, and passing Playwright web smoke flows are in place.

## Phase 1: Planning And Boundaries

- Confirm the scope in the planning docs
- Freeze the first content scope to arXiv only
- Freeze the first user experience to a five-paper daily brief
- Decide the initial summarization provider only after the service boundaries are defined

## Phase 2: Frontend Foundation

- Scaffold the Expo TypeScript app
- Set up routing, screen structure, shared UI primitives, and local state
- Implement static versions of onboarding, brief list, paper detail, saved items, and settings
- Use mock data and placeholder summaries until the backend contract is stable

## Phase 3: Backend Foundation

- Scaffold FastAPI with a small service layout
- Add an arXiv ingestion module for a fixed source set
- Add ranking and digest assembly services behind clean interfaces
- Add persisted digest storage and basic health checks

## Phase 4: End-To-End Integration

- Connect the mobile app to live digest endpoints
- Persist topic preferences and saved items locally on the device
- Register push tokens and send digest-ready notifications
- Test on real devices, not only simulators

Current status:

- Live digest endpoints connected
- Local topic and save persistence complete
- Push token registration is still a placeholder
- Expo web smoke coverage added through Playwright; native device smoke coverage still pending, with an Android Maestro flow prepared but not executed on this machine

## Phase 5: Release Hardening

- Add logging, error boundaries, and basic analytics
- Tighten empty states, retry paths, and degraded-mode behavior
- Prepare screenshots, app descriptions, privacy disclosures, and store metadata
- Deploy backend services and submit the prototype to both app stores

## Initial Weekly Cadence

### Week 1

- Finalize scope docs
- Scaffold Expo app and static screens
- Create FastAPI skeleton and Supabase project

### Week 2

- Build arXiv ingestion and digest generation
- Define database schema and seed flow
- Add mock-to-live API integration points in the app

### Week 3

- Connect the app to live data
- Add local saves, preferences, and push token registration
- Test the full digest loop on devices

### Week 4

- Harden release behavior
- Prepare store assets and compliance items
- Deploy services and submit the public prototype

## Exit Criteria Before Scaffolding

- Scope docs approved with `SCOPE CONFIRMED`
- Any finish-line objections resolved, especially the public-release expectation for an exploratory build

## Exit Criteria Before Store Submission

- Digest generation is reliable for at least several consecutive runs
- Summary quality is acceptable on a representative sample of papers
- App navigation, save flow, settings, and notifications all work on real devices
- Basic privacy and data handling disclosures are written and accurate