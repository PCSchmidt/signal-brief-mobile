# Backend

FastAPI backend for Signal Brief Mobile.

## Current Scope

- Health endpoint
- Daily brief endpoint backed by live arXiv ingestion and persisted digest assembly
- Push token registration placeholder
- Internal digest generation endpoint
- Startup warmup of the default digest

## Local Run

Use the shared `PhoneApps/.venv` interpreter and install the dependencies from `requirements-dev.txt`.

Run the API with:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Run tests with:

```bash
pytest
```