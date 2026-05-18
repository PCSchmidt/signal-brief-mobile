# VERSION ROADMAP

Estimation multiplier: 2.0x default. No prior project calibration entries exist yet.

Build type: Exploratory / Prototype
Finish line: a credible mobile prototype that can progress through Android testing and iOS TestFlight, with public release treated as a separate decision rather than an assumption.

| Version | Name | Goal | Estimate | Status | Actual Hours |
| --- | --- | --- | --- | --- | --- |
| v0.0 | Scope Confirmed | Lock the product boundary, MVP, roadmap, and initial build plan. | 4h | completed | |
| v0.1 | Static Mobile Foundation | Build the Expo app shell, navigation, core screens, and local mock-data flow. | 8h | completed | |
| v0.2 | Backend Digest Engine | Stand up FastAPI, arXiv ingestion, ranking, and local persistence for prototype operation. | 12-18h | completed with local file persistence instead of Supabase | |
| v0.3 | End-to-End Daily Brief | Connect the mobile app to live backend data and deliver one full digest loop on a real runtime path. | 12-20h | completed for local runtime and Expo web smoke validation | |
| v0.4 | Prototype Hardening | Add search, local persistence, topic controls, notification registration, degraded-state handling, and validation coverage. | 10-16h | in progress: search tab, brief-topic visibility, single-topic onboarding, and focused validation landed; search semantics and release prep remain | |
| v0.5 | Backend Production Readiness | Host the backend, harden persistence, define environments, and make the mobile client release-configurable. | 12-24h | pending | |
| v0.6 | Android Internal Release | Produce a signed Android build, validate on physical devices, and complete Play Console internal or closed testing. | 10-18h | pending | |
| v0.7 | iOS TestFlight | Produce the first iOS build, configure App Store Connect, and validate on a real iPhone through TestFlight. | 10-20h | pending | |
| v0.8 | Public Store Decision | Decide whether to promote the prototype to public Play/App Store release after Android and iOS test distribution feedback. | 6-12h | pending | |

## Notes

- Near-term gates use tighter estimates; later gates use ranges because hosting, signing, review, and store compliance create more uncertainty than feature work.
- The project no longer assumes that Android and iOS public release happen as one final step. Android internal release and iOS TestFlight are now separate checkpoints.
- The current implementation intentionally uses local device persistence and backend file storage before introducing a production data platform.
- During `v0.4`, the prototype scope was clarified to require explicit topic-driven brief semantics and a targeted query-search path before any store-facing polish.
- The next high-value product gap is query quality for short natural-language prompts.
