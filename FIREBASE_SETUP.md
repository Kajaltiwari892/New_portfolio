# Firebase setup and verification

## Created on 23 October 2026

- Project: `kajal-portfolio-analytics` (Kajal Portfolio Analytics).
- Plan: **Spark**. No billing account, Blaze upgrade, Cloud Functions, or paid backups added.
- Web app: `Portfolio web`, ID `1:681709275417:web:5ad42d52e86ac56c9d9d88`.
- Authentication: Google and Anonymous enabled. Google support email is `kanjal55567@gmail.com`.
- Authorized OAuth domains: localhost, the two default Firebase domains, and `motion-portfolio-studio.kuldeep-tiwari934919.chatgpt.site`.
- Firestore: Standard edition, `(default)` database, `asia-south1` (Mumbai), initialized in production mode.
- Tested `firestore.rules` published through the Firebase console. Reads require the owner's verified Google identity; visitor writes have strict fields and limits.

## Pending before visitor collection

1. Complete the Google sign-in verification. The account chooser stalled in this browser; owner input was requested. Emulator authorization tests have passed, but those are not a substitute for a real owner sign-in.
2. Approve Google Cloud terms for reCAPTCHA Enterprise / Fraud Defense Essentials. The API activation screen is prepared; it has not been enabled because accepting terms needs confirmation. Keep billing disabled.
3. Create a score-based Web key limited to the exact production hostname above. Do not add localhost to the production key. Register it for the Firebase web app in App Check.
4. Put the public site key in `src/data/firebase-public-config.json` (`appCheckSiteKey`), deploy, and verify valid App Check requests before enforcing Cloud Firestore. The implementation uses `ReCaptchaEnterpriseProvider`; the Classic provider is deprecated.
5. Verify a controlled visitor event reaches Firestore and is visible only to the owner. Then set `analyticsEnabled` to `true`, build and publish. Consent and approved-host checks still apply.

`analyticsEnabled` is currently **false**, and no real portfolio visitor events have been collected. App Check is not yet registered or enforced. Do not claim a completed live tracking rollout until these steps pass.

## Local development

Public Firebase app configuration is intentionally committed in `src/data/firebase-public-config.json`; it identifies the app and is not an administrative secret. Security is enforced by Firebase Auth, Firestore rules and production App Check. Never add a service-account JSON key, OAuth secret, private key, or debug token to that file.

Optional environment overrides are listed in `.env.example`. `.env*` files except that example are ignored. Keep `VITE_ANALYTICS_ENABLED=false` in local configuration; localhost tracking is always excluded regardless of this setting.

After production App Check enforcement, localhost live-database access also needs a separately registered local debug token. Use Firebase's documented debug provider with an ignored local environment value; never add localhost to the production attestation key or enable a debug provider in production. Alternatively, use the isolated emulator for local development and open the deployed `/admin` to read real data.

The build creates `dist/admin/index.html` with a noindex directive. This enables direct `/admin/` access on a static host. The runtime also handles `/admin`; Google sign-in remains necessary before data reads.

## Checks already passed

- TypeScript and production build (rerun after configuration changes).
- 24 model, contact and GitHub regression checks.
- 4 collector checks: no request before consent; DNT/GPC and owner/localhost exclusions; withdrawal; duplicate visibility and session expiry.
- 7 Firestore emulator tests: verified owner reads; denied other/anonymous reads; valid atomic writes; schema and time validation; immutable retries; 20-item batches and 60 writes/minute; quota-window reset.
- Desktop login and 390px mobile dashboard fixture; date presets, empty and service-error states. Synthetic fixture data never reaches Firestore. The browser connection was lost during the final mobile login capture; a real authenticated dashboard read remains unverified.
- Unauthenticated REST reads against the live Firestore database return HTTP 403 `PERMISSION_DENIED`.

The latest Firebase CLI requires Java 21. A portable Microsoft OpenJDK is installed for this task at `C:/Users/kanja/.cache/portfolio-java21/jdk-21.0.12.1+1`; the system Java 17 installation was left unchanged. To run the rules tests in PowerShell:

```powershell
$env:JAVA_HOME='C:/Users/kanja/.cache/portfolio-java21/jdk-21.0.12.1+1'
$env:PATH="$env:JAVA_HOME/bin;$env:PATH"
npm run test:rules
```

## Operations

- Bookmark the deployed `/admin`; keep it out of the public navbar.
- The Site currently has owner-private hosting access. This is distinct from Firebase's owner-only dashboard authorization. Public visitors cannot open a privately hosted portfolio.
- Monitor Firestore Usage and Auth usage. Spark has quotas and may reject requests after exhaustion. The main portfolio should continue working.
- Fraud Defense Essentials has a free monthly assessment quota; without billing, excess requests fail instead of incurring charges. See [billing behavior](https://docs.cloud.google.com/recaptcha/docs/billing-information).
- Raw event retention is manual. A 90-day query limit does not delete old events; no TTL or scheduled cleanup is enabled.
- Event data never includes contact form contents, visitor email/name, full URLs or precise location.
