# HANDOFF

## Current Phase

- Current roadmap phase: `v0.4 Prototype Hardening`
- Current focus: end-to-end validation and release-quality polish, not new core feature work

## What Is Done

- FastAPI backend is live with arXiv ingestion, topic-aware ranking, persisted digests, and startup warmup.
- Mobile app is wired to the live backend and persists onboarding state, topic preferences, saved ids, and paper cache locally.
- Mobile app now syncs push-notification preference state to the backend on native platforms and persists a local device id for registration.
- Settings now show in-flight, success, warning, and error states for notification sync.
- The current notification slice is registration-only; delivery credentials and send-side jobs are still open.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage is started with Jest and React Native Testing Library.
- Playwright is installed locally and passing Expo web smoke tests exist at `mobile/playwright/critical-path.spec.ts` for the critical path, settings topic editing, and digest-error recovery.
- Maestro CLI is installed locally and the earlier Expo web smoke flow still exists at `mobile/.maestro/critical-path.web.yaml`.
- The Android Maestro flow at `mobile/.maestro/critical-path.android.yaml` now passes locally on the `SignalBrief_API35` Android emulator path with Expo Go, with shared Expo Go setup extracted into reusable subflows.
- The repo now includes `expo-dev-client`, stable native app identifiers, and a generated Android project for moving the native runtime off Expo Go.

## Current Blocker

- The primary web smoke path is no longer blocked; Playwright now covers the critical Expo web flow successfully.
- Native Android smoke coverage is now validated locally on an emulator path.
- The old Maestro Expo web flow still reflects Chromium web beta limitations and should not be treated as the source of truth for release readiness.
- The current concrete blocker is the local Android dev-client build on Windows: `expo run:android` now reaches native compilation but fails in `:app:buildCMakeDebug[arm64-v8a]` because the generated `react-native-safe-area-context` codegen path exceeds the Windows path-length limit under the current repo path.
- A second local runtime blocker appeared after the checkpoint push: `npx expo start --android --port 8081` launched Expo Go, bundled successfully, then crashed in Metro's Windows fallback watcher with an `lstat` error against a malformed `expo-constants/android/src` path while running under Node `v22.15.0`.
- The remaining hardening gaps are release-facing work such as finishing and validating the dev-client Android build, moving native automation off Expo Go, delivery credentials, notification send plumbing, and any broader real-device coverage beyond the local emulator path.

## Pick Back Up Here

Resume at `v0.4 Prototype Hardening`, specifically the end-to-end validation slice.

Preferred next step:

1. Keep Playwright as the primary Expo web smoke runner.
2. Keep Maestro as the native Android smoke runner on the validated emulator path while Expo Go remains the native container, using `EXPO_DEEPLINK` when Expo resolves to a LAN host.
3. Resolve the local Windows runtime blockers in order: first retry Expo Go startup under a shorter path or a different Node LTS if the Metro watcher crash persists, then resolve the dev-client path-length blocker, rerun `npm run android:dev-client -- --port 8082`, and finally move Maestro to the stable app id instead of Expo Go.

If you want to continue the current web path anyway, start with `mobile/.maestro/critical-path.web.yaml` and the paper-card actions in `mobile/src/components/PaperCard.tsx`.

If you want the passing web path, start with `mobile/playwright/critical-path.spec.ts`.

If you want the native path, start with `mobile/.maestro/critical-path.android.yaml` and provide `EXPO_DEEPLINK` when Expo resolves to a LAN host instead of `10.0.2.2`.

## Resume Commands

From Git Bash:

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/backend && /c/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run web -- --port 19006
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run typecheck
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run test:playwright:web
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npx expo start --android --port 8081
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run android:dev-client -- --port 8082
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run start:dev-client
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && /c/Users/pchri/maestro/maestro/bin/maestro test -e EXPO_DEEPLINK=exp://<host>:8081 .maestro/critical-path.android.yaml
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && /c/Users/pchri/maestro/maestro/bin/maestro test .maestro/critical-path.web.yaml
```

## Chat Restart Command

- In this environment, `/start` is available as a session-start skill.
- Best resume prompt: `/start`
- Then answer that you are continuing `signal-brief-mobile` at `v0.4 Prototype Hardening`, that Playwright web plus Android emulator Maestro are already validated locally, and that the immediate blockers are the Expo Go Metro watcher crash on Node `v22.15.0` plus the Windows path-length failure in the Android dev-client build.

## Last Verified State

- Last green validations: `cd mobile && npm run test:playwright:web`; `maestro test -e EXPO_DEEPLINK=exp://10.0.0.201:8081 .maestro/critical-path.android.yaml`
- Known flaky validation: Maestro web smoke flow against Expo web on port `19006`
- Native Android path validated locally on emulator `SignalBrief_API35` with Expo Go, backend on `8000`, Expo on `8081`, and shared Maestro subflows for Expo Go setup
- Latest Expo Go startup attempt: `npx expo start --android --port 8081` opened Expo Go and bundled, then crashed in Metro fallback watching with `Error: UNKNOWN: unknown error, lstat ... expo-constants/android/src\?\C:\...` under Node `v22.15.0`; `npx expo-doctor` still reports `17/17 checks passed`
- Dev-client migration status: stable app ids plus `expo-dev-client` are configured, Android SDK wiring is fixed locally, and the build now fails at `:app:buildCMakeDebug[arm64-v8a]` with a Windows path-length error in generated `react-native-safe-area-context` codegen output
- First retry tomorrow: for Expo Go, retry from `cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npx expo start --android --port 8081` under a shorter path or a different Node LTS if the watcher crash repeats; for the dev client, either enable Windows long paths or move the repo to a shorter path, then rerun `cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run android:dev-client -- --port 8082`
