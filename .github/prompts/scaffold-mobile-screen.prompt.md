---
name: "Scaffold Mobile Screen"
description: "Create a new Expo React Native screen that matches the Signal Brief visual language and navigation structure"
argument-hint: "Describe the screen purpose, route placement, and any required interactions"
agent: "agent"
model: "GPT-5 (copilot)"
---

Scaffold or update a mobile screen for this repository.

Use these repository rules:

- Follow the approved product and layout constraints in [MOCKUPS.md](../../MOCKUPS.md).
- Keep the app within the current structure in `mobile/App.tsx`, `mobile/src/screens/`, `mobile/src/components/`, `mobile/src/data/`, and `mobile/src/theme.ts`.
- Preserve the current visual direction: editorial, restrained, light-first, and professional.
- Do not introduce a social-feed look, heavy animation, or extra product areas.
- Keep navigation typed and consistent with the existing stack and tab model.
- Reuse theme values and shared components where practical.

When generating the screen:

1. Identify whether the request belongs in the existing tab flow, stack flow, or as a reusable component instead of a new screen.
2. Match the typography, spacing, and card treatment already in the app.
3. Keep copy concise and serious.
4. Prefer mock-data wiring and typed props unless the request explicitly says to wire live backend data.
5. Add the minimum adjacent updates needed for navigation and state flow.

When you finish, include the validation command:

`cd mobile && npm run typecheck`