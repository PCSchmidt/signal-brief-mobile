# BACKEND PRODUCTION

## Purpose

This document tracks what must change before the current FastAPI backend is suitable for a real Android test release or iOS TestFlight build.

## Current Prototype Shape

- FastAPI app with live arXiv fetches
- File-backed digest persistence
- File-backed device-preference persistence
- Open CORS suitable for local development
- No production hosting, no durable database, no scheduler, and no operational monitoring

## Minimum Production Changes

### Hosting

- Deploy the backend to a real HTTPS endpoint
- Separate local, staging, and production configuration
- Provide a stable base URL for mobile release builds

### Persistence

- Replace or harden file-backed persistence
- Define backup and rollback expectations
- Ensure stored digests and device preferences survive restarts and redeploys

### Security And Operations

- Tighten CORS policy for release
- Review internal endpoints and tokens
- Add request logging and failure visibility
- Add basic uptime monitoring and alerting

### Search And Digest Quality

- Improve natural-language query handling
- Revisit search ranking so "latest relevant" behaves more like a user expects
- Keep the brief logic honest about its heuristic nature

### Notification Path

- Either implement digest-ready notification sending end to end or explicitly defer it from release scope

## Release Gate For Backend

The backend is ready for mobile store testing when:

- it is reachable over HTTPS
- it serves stable responses for `/health`, `/brief/today`, and `/papers/search`
- it has persistence appropriate for the chosen release stage
- it has a basic rollback and diagnostics path