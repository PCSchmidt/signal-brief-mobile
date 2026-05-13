# TESTS

## Goal

Define the minimum test strategy that keeps the prototype honest while still letting the project move quickly. The target is not enterprise-grade ceremony. The target is enough coverage to ship a public prototype without guessing about the core digest loop.

## Planned Test Runners And Tooling

### Mobile App

- Runner: Jest with `jest-expo`
- UI and interaction tests: `@testing-library/react-native`
- Snapshot usage: limited to stable presentational subcomponents only, not full screens
- Why this choice: Expo and React Native are most predictable with Jest-based tooling. This is lower risk than introducing a custom test runner for a mobile stack that already has enough moving parts.

### Backend

- Runner: `pytest`
- Async support: `pytest-asyncio`
- API testing: `httpx` with FastAPI test client support
- Mocking and HTTP stubs: `pytest-mock` and `respx` when external HTTP calls need to be isolated
- Coverage: `pytest-cov`
- Why this choice: this is the standard, low-friction Python path for FastAPI services and scheduled jobs.

### End-To-End

- Runner: Maestro
- Why this choice: easier to stand up than Detox for a solo project, works well for cross-platform mobile smoke flows, and is sufficient for a prototype that needs real-device confidence more than exhaustive native automation.

## Coverage Targets

### Mobile

- Component and screen logic: 70% line coverage
- Shared display and helper logic: 80% line coverage
- Critical interaction paths: covered by explicit tests, not only aggregate coverage numbers

### Backend

- API layer: 85% line coverage
- Service layer: 85% line coverage
- Ranking, normalization, and digest assembly logic: 90% line coverage
- Scheduled digest generation job: explicit success and failure-path tests

### End-To-End

- 100% coverage of the critical user flows listed below
- This is scenario coverage, not code coverage

## Critical Mobile Test Cases

1. Topic onboarding enforces the minimum selection rule before continuing.
2. Daily brief screen renders the top five papers from mock or live API data.
3. Opening a paper card reaches the paper detail screen with the correct content.
4. Saving and unsaving a paper updates both the brief screen state and the saved screen state.
5. Editing topics from settings updates the selected topics state and returns to the prior screen.
6. Empty saved-items state renders the intended guidance copy.
7. Digest error state and digest-not-ready state each render a clear recovery action.

## Critical Backend Test Cases

1. arXiv ingestion normalizes source metadata into the expected internal schema.
2. Invalid or incomplete paper payloads are rejected or safely skipped.
3. Topic-aware ranking changes the top-five output as expected for different preference inputs.
4. Digest assembly always returns at most five items and preserves stable ordering rules.
5. Summary generation failures fall back to a safe degraded state rather than breaking the entire digest.
6. `GET /brief/today` returns the expected response shape and status codes.
7. Internal digest-generation job is idempotent for a single generation window.
8. Push-token registration is safe to retry without duplicating device records.

## Required End-To-End Flows

1. First launch to topic selection to daily brief.
2. Daily brief to paper detail to return to brief.
3. Save a paper from the brief, then confirm it appears in saved items.
4. Edit topics from settings and confirm the updated topics are reflected in the UI.
5. Simulate an unavailable digest and confirm the user sees the recovery state instead of a crash.

## Regression Tests Required From Day One

- Ranking regression for selected topics
- Digest response schema regression
- Save and unsave state regression
- Topic editing regression
- Backend fallback when summary generation times out or returns malformed output

## Failure Modes We Must Test Explicitly

- No digest exists yet for the current day
- Backend request failure
- Malformed paper metadata from source ingestion
- Empty ranking result set
- Summary provider timeout or invalid summary payload
- Push notification permission denied
- Local saved-items state starting empty

## What We Will Not Test Heavily In The Prototype

- Pixel-perfect visual snapshots across many devices
- Exhaustive performance benchmarking in the test suite
- Full native push-delivery automation in CI
- Every typography or spacing detail through snapshot testing

## Test Execution Plan By Gate

### Before Backend Wiring

- Add Jest and React Native Testing Library to the mobile app
- Cover the onboarding screen, daily brief screen, and saved-items empty state

### During Backend Scaffold

- Add pytest, pytest-asyncio, pytest-cov, httpx, and respx
- Add API contract tests and service tests alongside implementation

### Before Public Prototype Submission

- Run the full mobile test suite
- Run the full backend test suite with coverage
- Run the Maestro smoke flows on at least one real device path or stable emulator path

## Approval Bar

We should not start backend implementation until this testing plan is accepted, because the ranking logic, ingestion boundaries, and digest loop are the highest-risk parts of the project.