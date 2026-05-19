# Backend

FastAPI backend for Signal Brief Mobile.

## Current Scope

- Health endpoint
- Daily brief endpoint backed by live arXiv ingestion and persisted digest assembly
- Push token registration with file-backed device preference persistence
- Internal device-preference read endpoint for local debugging
- Internal digest generation endpoint
- Startup warmup of the default digest

The backend now also supports optional database-backed persistence for digests and device preferences through `SIGNAL_BRIEF_DATABASE_URL`. If that variable is unset, the backend falls back to the current local file-based storage.

Current notification scope is registration only. Delivery credentials and outbound send jobs are intentionally deferred to a later slice.

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

## Environment

Copy `.env.example` to `.env` for local work and set the values you need.

Important variables:

- `SIGNAL_BRIEF_APP_ENV`
- `SIGNAL_BRIEF_ALLOWED_ORIGINS`
- `SIGNAL_BRIEF_DATABASE_URL`
- `SIGNAL_BRIEF_INTERNAL_JOB_TOKEN`
- `SIGNAL_BRIEF_WARM_DIGEST_ON_STARTUP`

## Railway Deployment

Recommended first hosted shape:

- one Railway service rooted at `backend/`
- one attached Railway Postgres instance
- `SIGNAL_BRIEF_DATABASE_URL` set to the Railway Postgres URL
- `SIGNAL_BRIEF_INTERNAL_JOB_TOKEN` set to a real secret
- `SIGNAL_BRIEF_ALLOWED_ORIGINS` set to the intended mobile or web origins instead of `*`

This directory now includes a `Dockerfile` so Railway can deploy the backend deterministically from the `backend/` folder.

Recommended Railway setup sequence:

1. Authenticate with the Railway CLI using `railway login` or `railway login --browserless`.
2. From this `backend/` directory, create or link the Railway project.
3. In the Railway dashboard, set the service root directory to `backend/` if you deploy from the repo root.
4. Add a PostgreSQL service to the project.
5. Set the required environment variables for the backend service.
6. Deploy the service and verify `/health` on the generated Railway domain.

This directory now includes `railway.json` with a healthcheck path and watch patterns for the backend service. If you use config-as-code in Railway for a monorepo deployment, point Railway at `/backend/railway.json`.
