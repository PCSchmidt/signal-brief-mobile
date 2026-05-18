# HANDOFF

## Current Phase

- Current roadmap phase: `v0.4 Prototype Hardening`
- Current focus: close the gap between a working local prototype and a release-ready product path

## What Is Done

- FastAPI backend is live with arXiv ingestion, topic-aware ranking, persisted digests, and startup warmup.
- Mobile app is wired to the live backend and persists onboarding state, topic preferences, saved ids, and paper cache locally.
- The backend exposes `GET /papers/search`, and the mobile app includes a Search tab for targeted topic queries against recent AI papers.
- The Brief screen shows the active topic subset directly and provides an in-place `Edit topics` action.
- Topic selection supports a single selected topic for a narrower top-five brief.
- Mobile app syncs push-notification preference state to the backend on native platforms and persists a local device id for registration.
- Settings show in-flight, success, warning, and error states for notification sync.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage exists for SearchScreen, DailyBriefScreen, and TopicOnboardingScreen.
- Playwright passes on the current Expo web critical path.
- Android emulator Maestro passes on the current Expo Go path.

## Current Blockers

- Search quality is still too literal for short natural-language prompts.
- Backend infrastructure is still local-prototype grade and needs a real hosted HTTPS deployment path.
- Notification delivery is not implemented; only registration exists.
- Android dev-client work still needs to be completed from the short Windows path.
- iOS release work has not yet been validated through a real TestFlight path.

## Pick Back Up Here

Resume at `v0.4 Prototype Hardening`, but shift the emphasis from product semantics to release preparation.

Recommended next sequence:

1. Improve backend query handling so short natural-language prompts return stronger results.
2. Finish Android dev-client validation from `C:\w\sbm\mobile`.
3. Define the production backend hosting shape and environment config.
4. Prepare the Android internal-release path.
5. Stand up the first iOS build and TestFlight path.

## Resume Commands

From Git Bash:

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/backend && /c/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run typecheck
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run test:playwright:web
```

```bash
cd /c/w/sbm/mobile && npm run android:dev-client -- --port 8082
```

```bash
cd /c/w/sbm/mobile && npm run start:dev-client
```

## Last Verified State

- Playwright web smoke path is green.
- Android emulator Maestro path is green on Expo Go.
- Backend tests and focused mobile tests are green.
- Search and Brief screens render on emulator after the runtime bootstrap work.
- The highest-value remaining work is search quality, backend production readiness, and Android/iOS release preparation.
