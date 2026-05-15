# signal-brief-mobile

Mobile app that turns selected technical sources into a daily briefing with concise summaries, saved items, and personalized topic preferences. Built to explore mobile product development, content pipelines, ranking logic, notifications, and practical LLM-assisted summarization.

## Current State

- Expo app shell and core navigation are implemented.
- The mobile app fetches the live daily brief from the FastAPI backend.
- Selected topics, onboarding completion, notification preference, saved paper ids, and fetched paper cache persist locally through AsyncStorage.
- On native platforms, the app now persists a local device id and syncs push-notification preference state to the backend.
- The backend ingests arXiv data live, ranks papers for the selected topics, persists digests by date and topic set, and warms the default digest on startup.
- The backend persists device notification preferences in local file storage for the current prototype stage.
- A native development-build path is now scaffolded through `expo-dev-client`, stable iOS and Android identifiers, and local Android prebuild output.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage is started with Jest and React Native Testing Library.
- Stable Playwright web smoke tests now cover the critical path, settings topic editing, and digest-error recovery on Expo web.
- The older Maestro Expo web flow still exists, but it remains limited by Maestro Chromium web beta interaction reliability.
- The Android Maestro flow now passes locally on an Android emulator with Expo Go when `EXPO_DEEPLINK` matches the active Expo host.
- The repo is prepared for a dev-client migration, but the stable-app-id Android smoke path still needs final end-to-end validation.
- The current dev-client build blocker is Windows path length during native CMake codegen for `react-native-safe-area-context` under the current repo path.
- A new local Expo Go runtime blocker also appeared after that checkpoint: `npx expo start --android --port 8081` bundled successfully, then crashed in Metro's Windows fallback watcher with a malformed `expo-constants/android/src` `lstat` path under Node `v22.15.0`.

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
Its repeated Expo Go launch and overlay handling now lives in `mobile/.maestro/subflows/` so the main smoke path stays smaller.

It covers the current critical path:

- first launch to onboarding to brief
- brief to paper detail and back
- save one paper and verify it appears in Saved
- relaunch and verify onboarding stays skipped and saved state persists

To run it locally:

1. Run `npm run test:playwright:web` from `mobile/`.

The Playwright config starts the backend on `8000` and Expo web on `19006` automatically when needed, then runs the same onboarding, detail, save, and reload-persistence path through the browser.

To run the validated native Android Maestro path:

1. Start the backend on port `8000`.
2. Start an Android emulator or connect a device with Expo Go installed.
3. Start Expo from `mobile/` with `npx expo start --android --port 8081` so you have an active `exp://` deep link.
4. Run `maestro test -e EXPO_DEEPLINK=exp://<host>:8081 .maestro/critical-path.android.yaml` when Expo resolves to a LAN host, or use the default `10.0.2.2` mapping when that is what Expo uses.

The validated local emulator run used `SignalBrief_API35`, backend `8000`, Expo `8081`, and `EXPO_DEEPLINK=exp://10.0.0.201:8081`.

The current notifications slice is registration-only. The app can request permission, obtain an Expo push token on native builds that support it, and persist the resulting device preference record through the backend. Actual digest-ready notification delivery is still a later slice.

The backend now also exposes an internal device-preference read path for local debugging of stored registrations.

The current dev-client build attempt no longer fails on SDK setup or Gradle task selection. It now reaches native compilation and stops on a Windows path-length error inside `:app:buildCMakeDebug[arm64-v8a]`.

The latest Expo Go startup attempt is no longer a clean validation command on this machine. It currently starts, launches Expo Go, bundles, and then crashes in Metro watching with an `expo-constants` path error even though `npx expo-doctor` reports `17/17 checks passed`.

The Maestro flow still targets the Expo web runtime at `http://127.0.0.1:19006/`, but it should now be treated as an experimental path rather than the primary web smoke runner.

## Current Validation Commands

- Backend tests: `cd backend && ..\\..\\.venv\\Scripts\\python.exe -m pytest`
- Mobile typecheck: `cd mobile && npm run typecheck`
- Local Android dev build: `cd mobile && npm run android:dev-client -- --port 8082`
- Dev-client Metro: `cd mobile && npm run start:dev-client`
- Mobile Jest tests: `cd mobile && npm test -- DailyBriefScreen --runInBand`
- Playwright web smoke flow: `cd mobile && npm run test:playwright:web`
- Maestro Android smoke flow: `cd mobile && /c/Users/pchri/maestro/maestro/bin/maestro test -e EXPO_DEEPLINK=exp://<host>:8081 .maestro/critical-path.android.yaml`
- Maestro web smoke flow: `cd mobile && npm run test:maestro:web`

If Expo Go startup still fails tomorrow, retry from a shorter workspace path or a different Node LTS before assuming a source regression. If the Android dev build still fails after that, shorten the workspace path or enable Windows long paths before retrying `npm run android:dev-client -- --port 8082`.
