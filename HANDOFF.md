# HANDOFF

## Current Phase

- Current roadmap phase: `v0.4 Prototype Hardening`
- Current focus: end-to-end validation and release-quality polish, not new core feature work

## What Is Done

- FastAPI backend is live with arXiv ingestion, topic-aware ranking, persisted digests, and startup warmup.
- Mobile app is wired to the live backend and persists onboarding state, topic preferences, saved ids, and paper cache locally.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage is started with Jest and React Native Testing Library.
- Playwright is installed locally and passing Expo web smoke tests exist at `mobile/playwright/critical-path.spec.ts` for the critical path, settings topic editing, and digest-error recovery.
- Maestro CLI is installed locally and the earlier Expo web smoke flow still exists at `mobile/.maestro/critical-path.web.yaml`.
- A first Android Maestro flow exists at `mobile/.maestro/critical-path.android.yaml`.

## Current Blocker

- The primary web smoke path is no longer blocked; Playwright now covers the critical Expo web flow successfully.
- The remaining gap is native-device smoke coverage with Maestro on a stable emulator or device path.
- The old Maestro Expo web flow still reflects Chromium web beta limitations and should not be treated as the source of truth for release readiness.
- This machine does not currently have Android SDK platform-tools or emulator binaries installed, so the Android Maestro flow is prepared but not executed here.

## Pick Back Up Here

Resume at `v0.4 Prototype Hardening`, specifically the end-to-end validation slice.

Preferred next step:

1. Keep Playwright as the primary Expo web smoke runner.
2. Move the next smoke validation slice to a stable native path with Maestro on an Android emulator or device.
3. Treat the old Maestro Expo web flow as experimental only.

If you want to continue the current web path anyway, start with `mobile/.maestro/critical-path.web.yaml` and the paper-card actions in `mobile/src/components/PaperCard.tsx`.

If you want the passing web path, start with `mobile/playwright/critical-path.spec.ts`.

If you want the native path, start with `mobile/.maestro/critical-path.android.yaml` and provide `EXPO_DEEPLINK` when you are not on the default Android emulator host mapping.

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
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && npm run test:maestro:android
```

```bash
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && /c/Users/pchri/maestro/maestro/bin/maestro test .maestro/critical-path.web.yaml
```

## Chat Restart Command

- In this environment, `/start` is available as a session-start skill.
- Best resume prompt: `/start`
- Then answer that you are continuing `signal-brief-mobile` at `v0.4 Prototype Hardening` and that the remaining gap is native-device Maestro coverage.

## Last Verified State

- Last green validation: `cd mobile && npm run test:playwright:web`
- Known flaky validation: Maestro web smoke flow against Expo web on port `19006`
- Prepared but unvalidated here: Android Maestro flow, blocked locally by missing Android SDK tools