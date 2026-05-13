# Backend

FastAPI backend for Signal Brief Mobile.

## Current Scope

- Health endpoint
- Daily brief endpoint with mock service data
- Push token registration placeholder
- Internal digest generation placeholder

## Local Run

Use the shared `PhoneApps/.venv` interpreter and install the dependencies from `requirements-dev.txt`.

Run the API with:

```bash
uvicorn app.main:app --reload
```

Run tests with:

```bash
pytest
```