---
applyTo: "backend/**/*.py"
---

# Backend Instructions

- This backend uses FastAPI with pytest-based testing.
- Use the shared interpreter at `c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe` for installs, tests, and scripts.
- Keep business logic out of route handlers. Routes should stay thin and delegate to services in `backend/app/services/`.
- Keep request and response shapes typed in `backend/app/schemas.py`.
- Prefer deterministic service functions that are easy to test.
- When new external integrations are added, isolate them behind service boundaries and make them mockable in tests.
- After backend changes, run `cd backend && c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe -m pytest`.
- Preserve the current endpoint boundaries unless the API contract is intentionally being expanded.
- Do not add auth, database coupling, or background job complexity earlier than needed for the current slice.