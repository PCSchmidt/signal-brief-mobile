# signal-brief-mobile
Mobile app that turns selected technical sources into a daily briefing with concise summaries, saved items, and personalized topic preferences. Built to explore mobile product development, content pipelines, ranking logic, notifications, and practical LLM-assisted summarization.

## Current State

- Expo app shell and core navigation are implemented.
- The mobile app fetches the live daily brief from the FastAPI backend.
- Selected topics, onboarding completion, notification preference, saved paper ids, and fetched paper cache persist locally through AsyncStorage.
- The backend ingests arXiv data live, ranks papers for the selected topics, persists digests by date and topic set, and warms the default digest on startup.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage is started with Jest and React Native Testing Library.
- Stable Playwright web smoke tests now cover the critical path, settings topic editing, and digest-error recovery on Expo web.
- The older Maestro Expo web flow still exists, but it remains limited by Maestro Chromium web beta interaction reliability.
- A first Android Maestro flow now exists for native-device validation, but it has not been executed on this machine because Android SDK tools are not installed here.

## Session Handoff

- See `HANDOFF.md` for the exact resume point, current blocker, and restart commands.
- The correct build phase to resume is `v0.4 Prototype Hardening`.
- If resuming through chat, use `/start` and say you are continuing `signal-brief-mobile` at `v0.4 Prototype Hardening`.

## Planning Docs

- `CONTRACT.md` defines the project identity and constraints.
- `SPEC.md` defines the MVP and current gate scope.
- `VERSION_ROADMAP.md` defines the versioned build sequence.
- `BUILD_PLAN.md` defines the initial execution plan.
- `MOCKUPS.md` defines the first-pass wireframes and visual direction.
- `TESTS.md` defines the planned test strategy and approval bar before backend work.

## Smoke Test

The preferred web smoke tests live at `mobile/playwright/critical-path.spec.ts` and run through Playwright.

The earlier Maestro web experiment remains at `mobile/.maestro/critical-path.web.yaml`.

The native Android Maestro flow lives at `mobile/.maestro/critical-path.android.yaml`.

It covers the current critical path:

- first launch to onboarding to brief
- brief to paper detail and back
- save one paper and verify it appears in Saved
- relaunch and verify onboarding stays skipped and saved state persists

To run it locally:

1. Run `npm run test:playwright:web` from `mobile/`.

The Playwright config starts the backend on `8000` and Expo web on `19006` automatically when needed, then runs the same onboarding, detail, save, and reload-persistence path through the browser.

To prepare the native Android Maestro path:

1. Install Android Studio, Android SDK platform-tools, and the Android emulator.
2. Start an Android emulator or connect a device with Expo Go installed.
3. Start Expo from `mobile/` so you have an `exp://` deep link.
4. Run `npm run test:maestro:android` for the default emulator deep link, or run `maestro test -e EXPO_DEEPLINK=exp://<host>:8081 .maestro/critical-path.android.yaml` to override it.

The Maestro flow still targets the Expo web runtime at `http://127.0.0.1:19006/`, but it should now be treated as an experimental path rather than the primary web smoke runner.

## Current Validation Commands

- Backend tests: `cd backend && ..\\..\\.venv\\Scripts\\python.exe -m pytest`
- Mobile typecheck: `cd mobile && npm run typecheck`
- Mobile Jest tests: `cd mobile && npm test -- DailyBriefScreen --runInBand`
- Playwright web smoke flow: `cd mobile && npm run test:playwright:web`
- Maestro Android smoke flow: `cd mobile && npm run test:maestro:android`
- Maestro web smoke flow: `cd mobile && npm run test:maestro:web`
