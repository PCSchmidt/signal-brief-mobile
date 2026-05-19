# STORE DEPLOYMENT

## Purpose

This document tracks what is required to move Signal Brief from a local prototype into Android testing, iOS TestFlight, and eventually public store submission.

## Current Reality

- Android package id: `io.pcschmidt.signalbrief`
- iOS bundle identifier: `io.pcschmidt.signalbrief`
- Expo scheme: `signalbrief`
- The app still assumes a prototype backend and local-development defaults.
- Notification preference registration exists, but digest-ready notification delivery does not.
- The Expo app already supports a hosted backend through `EXPO_PUBLIC_API_BASE_URL`.
- EAS build profiles now exist for `development`, `preview`, and `production`.

## Android Path

### What Is Needed

- A production backend URL over HTTPS
- Release environment configuration in the mobile app
- EAS environment setup so `EXPO_PUBLIC_API_BASE_URL` points at the hosted backend for non-local builds
- Android signing key and secure storage for that key
- A signed Android App Bundle
- Play Console app record
- Internal or closed testing track configured
- Real-device validation on at least one physical Android phone
- Privacy policy URL, support contact, screenshots, icon, descriptions, and Data safety answers

### What Still Blocks It

- Search quality is still too literal for natural-language prompts.
- Backend hosting and persistence are not yet productionized.
- Store metadata and policy docs are not yet in the repo.
- The Android dev-client and release path still need full validation from the short Windows worktree.

## iOS Path

### What Is Needed

- Apple Developer account
- App Store Connect app record
- iOS signing and provisioning
- First iOS build path, likely through EAS or a Mac/Xcode workflow
- EAS environment setup so iOS builds target the hosted backend instead of localhost defaults
- TestFlight distribution
- Real-device validation on at least one iPhone
- Privacy labels, support URL, screenshots, icon, descriptions, and review notes
- APNs setup if notifications remain in scope

### What Still Blocks It

- No validated iOS build and test distribution path yet
- No production backend target yet
- No store metadata package yet
- Notification delivery architecture is incomplete

## Recommended Release Sequence

1. Improve search quality for short prompts.
2. Host the backend over HTTPS.
3. Complete Android internal or closed testing.
4. Complete the first iOS TestFlight build.
5. Reassess whether public release is worth the added ceremony for this app.

## Frontend Hosting Decision

- Do not deploy the Expo app itself to Vercel; this is a native mobile client, not a web product.
- Use Vercel only if a lightweight privacy policy, support page, or landing page becomes necessary for store submission.