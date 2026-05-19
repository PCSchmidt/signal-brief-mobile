# TESTS

## Goal

Define the minimum test strategy that keeps the prototype honest while still letting the project move quickly. The target is not enterprise-grade ceremony. The target is enough coverage to ship a credible prototype and then move toward Android internal release and iOS TestFlight without guessing about the core digest loop.

## Planned Test Runners And Tooling

### Mobile App

- Runner: Jest with `jest-expo`
- UI and interaction tests: `@testing-library/react-native`
- Snapshot usage: limited to stable presentational subcomponents only, not full screens

### Backend Coverage

- Runner: `pytest`
- API testing: `httpx` with FastAPI test client support
- Mocking and HTTP stubs: `respx`

### End-To-End Coverage

- Runner: Playwright for Expo web smoke coverage, Maestro for native-device smoke coverage
- Role: prove the core user journey, not exhaustively test every UI variation

## Current Test Status

- Backend API tests are implemented and passing with `pytest`.
- Focused backend tests cover targeted query search, date filtering, topic taxonomy behavior, and push-token registration.
- Focused mobile tests cover SearchScreen query submission, DailyBriefScreen active-topic visibility, and TopicOnboardingScreen single-topic continuation.
- Stable Playwright web smoke tests exist at `mobile/playwright/critical-path.spec.ts` and pass locally for the critical path, settings topic editing, and digest-error recovery.
- The Android Maestro flow at `mobile/.maestro/critical-path.android.yaml` passes locally on an Android emulator with Expo Go when `EXPO_DEEPLINK` is set correctly.
- Manual Android emulator dev-client testing now covers targeted search, paper detail, outbound arXiv linking, save and unsave, brief loading, and settings topic editing.
- Push-token registration is implemented and tested, but end-to-end notification delivery is not yet automated because delivery is not yet implemented.
- Local Android dev builds currently surface an expected Expo and Firebase notification-registration warning until Android push credentials are configured.

## Coverage Targets

### Mobile

- Component and screen logic: 70% line coverage
- Shared display and helper logic: 80% line coverage
- Critical interaction paths: covered by explicit tests, not only aggregate coverage numbers

### Backend

- API layer: 85% line coverage
- Service layer: 85% line coverage
- Ranking, normalization, and digest assembly logic: 90% line coverage

### Release Validation

- 100% scenario coverage for the critical flows needed before Android internal release and iOS TestFlight

## Critical Mobile Test Cases

1. Topic onboarding allows one or more topics before continuing.
2. Daily brief screen renders the top five papers from mock or live API data.
3. Daily brief screen shows the active topic subset and exposes an edit action.
4. Search screen submits a targeted query and renders returned paper cards.
5. Opening a paper card reaches the paper detail screen with the correct content.
6. Saving and unsaving a paper updates both the brief screen state and the saved screen state.
7. Editing topics from settings or the brief updates selected topics state and returns to the prior screen.
8. Empty saved-items state renders the intended guidance copy.
9. Digest error state and digest-not-ready state each render a clear recovery action.

## Critical Backend Test Cases

1. arXiv ingestion normalizes source metadata into the expected internal schema.
2. Topic-aware ranking changes the top-five output as expected for different preference inputs.
3. `GET /papers/search` returns the expected response shape, relevant matches, and date-filter behavior.
4. Digest assembly always returns at most five items and preserves stable ordering rules.
5. `GET /brief/today` returns the expected response shape and status codes.
6. Push-token registration is safe to retry without duplicating device records.
7. Internal digest-generation job is idempotent for a single generation window.

## Search Regression Work That Still Needs To Be Added

The biggest remaining product-quality gap is search semantics. Add regression coverage for prompts such as:

- `what is latest on semantic agent harnesses`
- `multi-agent proof of work agentic development`
- `retrieval evaluation for rag`
- `coding agents in developer tools`

The current backend is still too literal for these cases, so these tests should be added alongside search improvements rather than claimed as already passing.

## Required End-To-End Flows

1. First launch to topic selection to daily brief.
2. Daily brief to paper detail to return to brief.
3. Save a paper from the brief, then confirm it appears in saved items.
4. Edit topics from settings and confirm the updated topics are reflected in the UI.
5. Run a targeted paper search and open one result into the paper detail screen.
6. Simulate an unavailable digest and confirm the user sees the recovery state instead of a crash.

## Release Validation To Add Before Store Testing

### Android

- Signed Android release or internal-test build installs and launches correctly.
- The app reaches the hosted backend over HTTPS.
- Search, brief refresh, save flow, and outbound arXiv links work on a physical Android device.
- Notification permission flow is validated on a real Android device after Android Expo and Firebase push credentials are configured.

### iOS

- TestFlight build installs and launches on a real iPhone.
- The app reaches the hosted backend over HTTPS.
- Search, brief refresh, save flow, and outbound arXiv links work on a physical iPhone.
- Notification permission flow is validated on a real iPhone if notifications remain in scope.

### Backend Production

- Hosted `/health` check is green.
- Hosted `/brief/today` and `/papers/search` respond with expected payload shape.
- Failure states return controlled errors instead of timeouts or crashes.

## Approval Bar

This plan is the working checklist for hardening the prototype before Android internal release and the first iOS TestFlight build.
