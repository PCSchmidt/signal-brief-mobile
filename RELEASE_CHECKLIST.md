# RELEASE CHECKLIST

## Product Readiness

- [ ] Search returns visibly relevant results for representative short prompts
- [ ] Daily brief behavior is clear and stable
- [ ] Save flow works reliably
- [ ] External arXiv links work correctly
- [ ] Error and empty states are understandable

## Backend Readiness

- [ ] Hosted backend exists over HTTPS
- [ ] Production environment variables are defined
- [ ] `SIGNAL_BRIEF_DATABASE_URL`, `SIGNAL_BRIEF_ALLOWED_ORIGINS`, and `SIGNAL_BRIEF_INTERNAL_JOB_TOKEN` are configured in the hosted environment
- [ ] Persistence is durable enough for release needs
- [ ] `/health`, `/brief/today`, and `/papers/search` are smoke-tested in production
- [ ] Logging and failure visibility exist

## Notification Decision

- [ ] Either finish delivery and validate it, or remove store-facing claims that imply delivery exists
- [ ] Configure Android Expo and Firebase push credentials or suppress the local registration warning before any store-facing notification claims

## Android Checklist

- [ ] Android emulator dev-client smoke path remains green after a clean restart
- [ ] `EXPO_PUBLIC_API_BASE_URL` is configured for the intended EAS build profile
- [ ] Finalize signing key strategy
- [ ] Produce signed Android App Bundle
- [ ] Create Play Console app record
- [ ] Upload internal-test build
- [ ] Validate install on a physical Android device
- [ ] Complete store listing assets and policy forms

## iOS Checklist

- [ ] `EXPO_PUBLIC_API_BASE_URL` is configured for the intended EAS build profile
- [ ] Create App Store Connect app record
- [ ] Configure signing and provisioning
- [ ] Produce first iOS build
- [ ] Distribute through TestFlight
- [ ] Validate on a real iPhone
- [ ] Complete App Store metadata and privacy labels

## Store Assets And Policy

- [ ] Privacy policy URL
- [ ] Support email or support URL
- [ ] App descriptions
- [ ] Screenshots
- [ ] App icon package
- [ ] Accurate disclosure of stored data and notification behavior

## Post-Release Preparedness

- [ ] Crash and error review path exists
- [ ] Backend rollback plan exists
- [ ] Mobile release notes and versioning discipline are defined