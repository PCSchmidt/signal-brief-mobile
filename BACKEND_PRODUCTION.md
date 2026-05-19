# BACKEND PRODUCTION

## Purpose

This document tracks what must change before the current FastAPI backend is suitable for a real Android test release or iOS TestFlight build.

## Current Prototype Shape

- FastAPI app with live arXiv fetches
- File-backed digest persistence by default, with optional database-backed persistence now available through `SIGNAL_BRIEF_DATABASE_URL`
- File-backed device-preference persistence by default, with optional database-backed persistence now available through `SIGNAL_BRIEF_DATABASE_URL`
- Open CORS suitable for local development
- No production hosting, no durable database, no scheduler, and no operational monitoring

## Recommended First Hosted Shape

- Host the FastAPI app on Railway
- Use Railway Postgres as the first durable persistence layer
- Keep notification registration only; defer send-side delivery for the first hosted release
- Use startup warmup plus read-through digest generation first; add a scheduled digest job only if hosted validation shows that it is necessary
- Keep Vercel out of scope for the app itself; only use it later for a privacy or support site if store requirements demand one
- Use `backend/railway.json` as the config-as-code file for build and deploy settings, and treat `backend/` as the service root directory in Railway

## Minimum Production Changes

### Hosting

- Deploy the backend to a real HTTPS endpoint
- Separate local, staging, and production configuration
- Provide a stable base URL for mobile release builds
- Prefer one Railway production service first before adding a staging environment

### Persistence

- Replace or harden file-backed persistence
- Define backup and rollback expectations
- Ensure stored digests and device preferences survive restarts and redeploys
- Current implementation path: set `SIGNAL_BRIEF_DATABASE_URL` to enable database-backed digests and device preferences without changing the API contract

### Security And Operations

- Tighten CORS policy for release
- Review internal endpoints and tokens
- Add request logging and failure visibility
- Add basic uptime monitoring and alerting
- Do not ship the default local internal token in a hosted environment

### Search And Digest Quality

- Improve natural-language query handling
- Revisit search ranking so "latest relevant" behaves more like a user expects
- Keep the brief logic honest about its heuristic nature

### Notification Path

- Either implement digest-ready notification sending end to end or explicitly defer it from release scope

## Required Environment Variables

- `SIGNAL_BRIEF_APP_ENV`
- `SIGNAL_BRIEF_ALLOWED_ORIGINS`
- `SIGNAL_BRIEF_DATABASE_URL`
- `SIGNAL_BRIEF_INTERNAL_JOB_TOKEN`
- `SIGNAL_BRIEF_DIGEST_SIZE`
- `SIGNAL_BRIEF_WARM_DIGEST_ON_STARTUP`

## External Railway Tasks

1. Authenticate the Railway CLI.
2. Create or link the Railway project.
3. Set the backend service root directory to `backend/`.
4. Add Railway Postgres and bind its connection string to `SIGNAL_BRIEF_DATABASE_URL`.
5. Set `SIGNAL_BRIEF_INTERNAL_JOB_TOKEN` to a real secret.
6. Set `SIGNAL_BRIEF_ALLOWED_ORIGINS` to the intended non-local origins.
7. Generate a Railway domain and verify `/health`, `/brief/today`, and `/papers/search`.

## Release Gate For Backend

The backend is ready for mobile store testing when:

- it is reachable over HTTPS
- it serves stable responses for `/health`, `/brief/today`, and `/papers/search`
- it has persistence appropriate for the chosen release stage
- it has a basic rollback and diagnostics path
- the mobile app can target the hosted base URL through `EXPO_PUBLIC_API_BASE_URL`