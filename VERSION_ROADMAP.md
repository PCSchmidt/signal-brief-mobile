# VERSION ROADMAP

Estimation multiplier: 2.0x default. No prior project calibration entries exist yet.

Build type: Exploratory / Prototype
Finish line: Public prototype release on iOS and Android app stores

| Version | Name | Goal | Estimate | Status | Actual Hours |
| --- | --- | --- | --- | --- | --- |
| v0.0 | Scope Confirmed | Lock the product boundary, MVP, roadmap, and initial build plan. | 4h | completed | |
| v0.1 | Static Mobile Foundation | Build the Expo app shell, navigation, core screens, and local mock data flow. | 8h | completed | |
| v0.2 | Backend Digest Engine | Stand up FastAPI, Supabase schema, arXiv ingestion, ranking, and summary generation. | 12-18h | completed with local file persistence instead of Supabase | |
| v0.3 | End-to-End Daily Brief | Connect the mobile app to live backend data and deliver one full digest loop on a real device. | 12-20h | completed for local runtime and Expo web smoke validation | |
| v0.4 | Prototype Hardening | Add notifications, local persistence, error handling, analytics, and release-quality polish. | 10-16h | in progress | |
| v0.5 | Public Prototype Live | Prepare store assets and policies, deploy services, ship the app, and validate the post-release loop. | 12-24h | pending | |

## Notes

- Near-term gates use single-number estimates; later gates use ranges because summary quality, mobile polish, and app-store review create the largest uncertainty.
- If public release proves too expensive in time relative to the learning value, this becomes a scope-change conversation and we should revisit the finish line before v0.4 starts.
- The current implementation intentionally uses local device persistence and backend file storage before introducing Supabase.