# signal-brief-mobile
Mobile app that turns selected technical sources into a daily briefing with concise summaries, saved items, and personalized topic preferences. Built to explore mobile product development, content pipelines, ranking logic, notifications, and practical LLM-assisted summarization.

## Current State

- Expo app shell and core navigation are implemented.
- The mobile app fetches the live daily brief from the FastAPI backend.
- Selected topics, onboarding completion, notification preference, saved paper ids, and fetched paper cache persist locally through AsyncStorage.
- The backend ingests arXiv data live, ranks papers for the selected topics, persists digests by date and topic set, and warms the default digest on startup.
- Backend API coverage is in place with `pytest`.
- Mobile screen coverage is started with Jest and React Native Testing Library.
- A stable Playwright web smoke test now covers the critical path on Expo web.
- The older Maestro Expo web flow still exists, but it remains limited by Maestro Chromium web beta interaction reliability.

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

The preferred web smoke test lives at `mobile/playwright/critical-path.spec.ts` and runs through Playwright.

The earlier Maestro experiment remains at `mobile/.maestro/critical-path.web.yaml`.

It covers the current critical path:

- first launch to onboarding to brief
- brief to paper detail and back
- save one paper and verify it appears in Saved
- relaunch and verify onboarding stays skipped and saved state persists

To run it locally:

1. Run `npm run test:playwright:web` from `mobile/`.

The Playwright config starts the backend on `8000` and Expo web on `19006` automatically when needed, then runs the same onboarding, detail, save, and reload-persistence path through the browser.

The Maestro flow still targets the Expo web runtime at `http://127.0.0.1:19006/`, but it should now be treated as an experimental path rather than the primary web smoke runner.

## Current Validation Commands

- Backend tests: `cd backend && ..\\..\\.venv\\Scripts\\python.exe -m pytest`
- Mobile typecheck: `cd mobile && npm run typecheck`
- Mobile Jest tests: `cd mobile && npm test -- DailyBriefScreen --runInBand`
- Playwright web smoke flow: `cd mobile && npm run test:playwright:web`
- Maestro web smoke flow: `cd mobile && npm run test:maestro:web`
