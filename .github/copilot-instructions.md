# Repository Instructions

This repository contains a mobile client in `mobile/` and a FastAPI backend in `backend/` for the Signal Brief prototype.

## Project Layout

- `mobile/` is the Expo React Native TypeScript app.
- `backend/` is the FastAPI Python service.
- `CONTRACT.md`, `SPEC.md`, `VERSION_ROADMAP.md`, `BUILD_PLAN.md`, `MOCKUPS.md`, and `TESTS.md` define the agreed product scope and implementation boundaries.

## Working Rules

- Keep the product narrow: arXiv-only, daily top-five AI paper brief, local saved items, no required auth in the first prototype.
- Do not add new product areas such as GitHub repo summaries, payments, social features, or a web client unless the scope is explicitly reopened.
- Prefer small, local changes over broad refactors.
- Preserve the split between a thin mobile client and a backend that owns digest and summarization logic.

## Validated Commands

### Mobile

- Install packages in `mobile/` with `npm install`.
- Type-check the mobile app with `cd mobile && npm run typecheck`.
- Use `npx expo install` when adding or changing Expo-managed native dependencies.

### Backend

- Use the shared Python interpreter at `c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe`.
- Install backend dependencies with `c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe -m pip install -r backend/requirements-dev.txt`.
- Run backend tests with `cd backend && c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe -m pytest`.

## Environment Notes

- Do not rely on activating the Python environment from Git Bash. In this workspace, the explicit interpreter path above is more reliable than `source .venv/Scripts/activate`.
- The VS Code Python environment helper previously surfaced an unrelated interpreter from another project. For this repository, prefer the `PhoneApps/.venv` interpreter path explicitly.

## Validation Expectations

- After mobile edits, run the narrowest available mobile validation, typically `npm run typecheck` in `mobile/`.
- After backend edits, run `pytest` in `backend/` using the shared `PhoneApps/.venv` interpreter.
- Prefer executable validation over diff-only inspection whenever a narrow command exists.

## Where To Look First

- Mobile entry point: `mobile/App.tsx`
- Mobile screens: `mobile/src/screens/`
- Backend entry point: `backend/app/main.py`
- Backend routes: `backend/app/api/routes.py`
- Backend service logic: `backend/app/services/`
- Backend tests: `backend/tests/`

Trust these instructions first. Only search more broadly if they are incomplete or clearly outdated.