---
applyTo: "mobile/**/*.ts,mobile/**/*.tsx"
---

# Mobile Instructions

- This app uses Expo, React Native, and TypeScript.
- Keep the frontend static and mock-data-friendly until a backend slice is explicitly being wired.
- Preserve the current screen structure: splash, onboarding, brief, paper detail, saved items, and settings.
- Do not introduce additional feature screens without explicit scope approval.
- Maintain the current visual direction: editorial, restrained, light-first, and professional. Avoid generic social-feed styling.
- When changing native Expo-managed packages, prefer `npx expo install` over raw `npm install`.
- After changes in `mobile/`, run `npm run typecheck` from the `mobile/` directory.
- Keep navigation and screen props typed.
- Prefer small reusable components under `mobile/src/components/` when a UI pattern repeats.
- Preserve the existing separation between theme values in `mobile/src/theme.ts`, mock content in `mobile/src/data/mockData.ts`, and screen logic in `mobile/src/screens/`.