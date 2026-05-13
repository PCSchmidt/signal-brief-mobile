---
name: "Generate Backend Tests"
description: "Create or update pytest tests for FastAPI routes and backend services in signal-brief-mobile"
argument-hint: "Describe the backend module, route, or behavior that needs tests"
agent: "agent"
model: "GPT-5 (copilot)"
---

Generate or update backend tests for the requested Python code in this repository.

Use these repository rules:

- Follow the approved strategy in [TESTS.md](../../TESTS.md).
- Keep tests in `backend/tests/` unless the repository later introduces a different test layout.
- Prefer deterministic tests for route behavior, service behavior, ranking rules, response schemas, and failure handling.
- Keep route tests thin and service tests focused.
- Mock external integrations instead of making live network calls.
- Preserve the current FastAPI structure under `backend/app/`.
- Use the shared interpreter path when describing validation commands: `c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe`.

When generating tests:

1. Inspect the existing backend code and current test patterns first.
2. Add only the tests needed for the requested behavior.
3. Include success paths and the most relevant failure or edge cases.
4. Prefer clear test names that describe behavior, not implementation trivia.
5. If the requested code is hard to test, point to the smallest design change that would improve testability.

When you finish, include the validation command:

`cd backend && c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe -m pytest`