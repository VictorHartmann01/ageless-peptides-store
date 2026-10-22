# Live03: public entry and tester login integration

Integrated on `integration/public-tester-access-20261016`, against `beta/highgloss-logo` at `42da6be`.
PR7 source `146df2c`; PR15 source `0bbc0ca`. Refetched before submission: all three refs unchanged.

## Resolution
- Merged both actual branches. Resolved the real `/zugang` conflict in favor of PR7's functional auth form, retaining password visibility from the newer login work.
- `/` is public; landing links use `/zugang`. `/login` redirects there preserving query parameters, including recovery callbacks. Supabase SSR browser client owns PKCE code exchange (no duplicate exchange).
- Approved/owner access opens `/shop`, not the now-public `/`. Pending/rejected accounts do not receive a shop link and remain blocked server-side.
- Proxy verifies user with Auth, confirmed email, current database tester approval and matching email. Existing separate admin API authorization retained. Customer-access API is exempt only at its exact path, with its own bearer/owner checks.
- Removed `AGELESS_SITE_ACCESS=public` bypass for this closed-beta integration. No setting can silently open the shop through that flag.
- Existing current-base admin upload and other changes preserved. PR11 product editor branch was not merged or changed.
- Checkout proxy plus create/capture handlers reject live mode. No payment flag was enabled, no payment executed, no database mutation/migration or deployment performed.

## Evidence and limits
- `npm ci --ignore-scripts`: successful with existing lockfile.
- `npm run build`: successful, including Next TypeScript compilation.
- `npx tsc --noEmit`: successful.
- `node --test tests/private-beta.cjs`: 26 passing tests using mocked Auth/database responses, actual NextRequest/NextResponse. Covers public routes/assets, approvals, pending/rejected/missing/invalid email, unconfirmed users, Auth/DB failures, flag bypass, API prefix boundary, sandbox/live/draft, nonowner decision denial and legacy callback redirect.
- Local production HTTP: `/`, `/zugang`, logo and landing hero 200; `/login?reset=1` 307 to `/zugang?reset=1`; `/shop`, `/shop/angebote`, `/shop/warenkorb`, `/shop/checkout` 307 to `/zugang`; checkout without config 503; customer-access without credentials 401.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities reported.
- Visual browser test not executed: Playwright browser missing; download returned invalid archives. No claim of desktop/mobile visual approval.
- Real Supabase signup/email confirmation/recovery, cookie session refresh, approval/revocation and owner/admin isolation E2E remain to be validated in a nonproduction environment with configured test identities. No credentials present here. Mock tests do not establish actual database/RLS correctness.

## Live03 integration
Review this combined PR instead of merging PR7 and PR15 separately. Their commits are included in its history. No main/base branch was modified.
Before release, confirm Supabase tester migration exists and has RLS/client grants revoked; check Auth site URL and redirect allowlist for `/zugang` and `/zugang?reset=1`, including legacy `/login` callbacks as needed. Run real confirmed approved/pending/rejected/owner and password email flows, legal page availability and browser/mobile QA. Keep checkout disabled until sandbox verification; this branch deliberately cannot charge live payments. Do not deploy automatically.
