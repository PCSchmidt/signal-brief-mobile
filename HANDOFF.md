# HANDOFF

## Current Phase

- Current roadmap phase: `v0.4 Prototype Hardening`
- Current focus: end-to-end validation and release-quality polish, not new core feature work

## What Is Done

- FastAPI backend is live with arXiv ingestion, topic-aware ranking, persisted digests, and startup warmup.
- Mobile app is wired to the live backend and persists onboarding state, topic preferences, saved ids, and paper cache locally.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage is started with Jest and React Native Testing Library.
- Maestro CLI is installed locally and the first Expo web smoke flow exists at `mobile/.maestro/critical-path.web.yaml`.

## Current Blocker

- The remaining active blocker is the Expo web Maestro smoke flow.
- The flow runs, but Maestro Chromium web beta does not reliably interact with the paper-card pressables after onboarding.
- Manual runtime validation succeeded earlier in the session for onboarding, brief load, detail open/back, save, saved-screen verification, and persistence after reload.
- Mobile typecheck still passes.

## Pick Back Up Here

Resume at `v0.4 Prototype Hardening`, specifically the end-to-end validation slice.

Preferred next step:

1. Stop trying to force the Expo web Maestro beta path.
2. Move the smoke validation to a stable native path with Maestro on an Android emulator or device.
3. If web automation is still desired, switch the web smoke flow to Playwright instead of continuing to fight Maestro Chromium beta.

If you want to continue the current web path anyway, start with `mobile/.maestro/critical-path.web.yaml` and the paper-card actions in `mobile/src/components/PaperCard.tsx`.

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
cd /c/Users/pchri/Documents/PhoneApps/signal-brief-mobile/mobile && /c/Users/pchri/maestro/maestro/bin/maestro test .maestro/critical-path.web.yaml
```

## Chat Restart Command

- In this environment, `/start` is available as a session-start skill.
- Best resume prompt: `/start`
- Then answer that you are continuing `signal-brief-mobile` at `v0.4 Prototype Hardening` and that the current blocker is the Maestro Expo web smoke flow.

## Last Verified State

- Last green validation: `cd mobile && npm run typecheck`
- Last blocked validation: Maestro web smoke flow against Expo web on port `19006`