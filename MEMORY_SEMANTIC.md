# MEMORY_SEMANTIC

## Project
- Name: signal-brief-mobile
- Type: exploratory prototype
- Current gate: v0.4 Prototype Hardening

## Patterns
- Use Playwright as the primary web smoke path.
- Use Maestro for native Android smoke validation.
- Use c:/Users/pchri/Documents/PhoneApps/.venv/Scripts/python.exe for backend Python commands.
- Use C:\w\sbm\mobile as the active native mobile runtime path on this machine.
- Treat the Brief tab as the top-five digest for the selected topic subset, and Search as the targeted-query path.
- Treat current search as keyword-style, not semantic or embedding-based.
- Treat notification support as registration-only until send-side delivery exists.

## Confidence
- Native mobile runtime on the original repo path is low-confidence on Windows due to path-length issues.
- Backend API, targeted search, and web smoke paths are high-confidence.
- Public deployment readiness is low-confidence until backend hosting and release workflows are in place.
