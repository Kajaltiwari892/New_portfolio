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

1. Completed: Google sign-in as `kanjal55567@gmail.com` and a real Firestore dashboard read were verified at `http://localhost:5173/admin`. The login uses the owner email hint without forcing an account chooser.
2. Completed: the owner approved Google Cloud terms and the reCAPTCHA Enterprise API was enabled without billing.
3. Completed: the score-based Web key `Portfolio web App Check` is restricted to the exact production hostname and registered for the Firebase web app. Localhost was not added. Token TTL is one hour.
4. The public site key is in `src/data/firebase-public-config.json` and has been deployed to the existing private Site. Verify valid App Check requests on that domain before enforcing Cloud Firestore. Hosted browser verification is pending because that Site requires its owner's separate ChatGPT login; no hosting access change was made. The implementation uses `ReCaptchaEnterpriseProvider`; the Classic provider is deprecated.
5. Verify a controlled visitor event reaches Firestore and is visible only to the owner. Then set `analyticsEnabled` to `true`, build and publish. Consent and approved-host checks still apply.

`analyticsEnabled` is currently **false**, and no real portfolio visitor events have been collected. App Check is registered and is in monitoring mode, not enforcement. The real owner dashboard correctly shows an empty database. Do not claim a completed live tracking rollout until the hosted protection and event round-trip checks pass.

## Local development

Public Firebase app configuration is intentionally committed in `src/data/firebase-public-config.json`; it identifies the app and is not an administrative secret. Security is enforced by Firebase Auth, Firestore rules and production App Check. Never add a service-account JSON key, OAuth secret, private key, or debug token to that file.

Optional environment overrides are listed in `.env.example`. `.env*` files except that example are ignored. Keep `VITE_ANALYTICS_ENABLED=false` in local configuration; localhost tracking is always excluded regardless of this setting.

After production App Check enforcement, localhost live-database access also needs a separately registered local debug token. Use Firebase's documented debug provider with an ignored local environment value; never add localhost to the production attestation key or enable a debug provider in production. Alternatively, use the isolated emulator for local development and open the deployed `/admin` to read real data.

The build creates `dist/admin/index.html` with a noindex directive. This enables direct `/admin/` access on a static host. The runtime also handles `/admin`; Google sign-in remains necessary before data reads.

## Checks already passed

- TypeScript and production build (rerun after configuration changes).
- 24 model, contact and GitHub regression checks.
- 6 collector checks: no request before consent or after an initial decline; DNT/GPC and owner/localhost exclusions; withdrawal including an in-flight identity request; duplicate visibility and session expiry.
- 7 Firestore emulator tests: verified owner reads; denied other/anonymous reads; valid atomic writes; schema and time validation; immutable retries; 20-item batches and 60 writes/minute; quota-window reset.
- Desktop login and real authenticated empty dashboard read. Earlier fixture checks covered the 390px layout, date presets, empty and service-error states; synthetic data never reaches Firestore. A final mobile capture of the real dashboard remains unverified because the browser viewport override did not apply.
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
