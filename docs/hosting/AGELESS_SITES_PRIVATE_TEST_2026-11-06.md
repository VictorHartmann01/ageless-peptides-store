# AgeLess – private ChatGPT Sites compatibility test (06.11.2026)

**Status:** VORBEREITET, NICHT DEPLOYT. This is an isolated GitHub test branch based on `beta/highgloss-logo`. No Site URL or live runtime test has been performed.

## Purpose / scope
Evaluate whether the **existing** Next.js 16.3.8 AgeLess application can run on ChatGPT Sites, using e-Xpense hosting as an architectural reference **only**. This branch is a non-production test artifact, not a new shop or a replacement implementation.

## Hard safety gates
1. **Private preview only.** Workspace access must be restricted to specifically authorized testers, not merely an unlisted public URL; verify access in an anonymous browser before sharing.
2. **Synthetic data only.** Do not connect to any production Supabase, Railway, e-Xpense, customer, order, auth, payment, or object-storage environment. No real customer email, credentials, tokens, media URLs or user records.
3. **No checkout.** `AGELESS_CHECKOUT_ENABLED` must be absent/false; never configure PayPal live/sandbox credentials for this test. Test checkout routes only for safe rejection (no orders or external calls).
4. **No domain changes, paid plan changes, production deploys, data migration, or destructive DB operations.**
5. **No code, configuration or content edits to e-Xpense Report.** Its public app is only a comparison.
6. **Fail closed:** On missing/synthetic backends do not surface public or purchasable catalog items, never bypass owner/admin/tester authorization merely to make a demo work.

## Repository baseline
- Primary integration branch: `beta/highgloss-logo`, not the older `main` branch.
- Existing pages: `app/page.tsx`, `app/login/page.tsx`, `app/admin/page.tsx`.
- Existing server routes: `app/api/admin/route.ts`, `app/api/admin/image-upload/route.ts`, `app/api/checkout/create/route.ts`, `app/api/checkout/capture/route.ts`.
- Existing access gate: `proxy.ts`. Existing commerce: `lib/commerce/server.ts`.
- Payment route uses `runtime = 'nodejs'`, making Sites/Next runtime parity a real **unknown**. Static rendering alone does not establish compatibility.
- Source feasibility comparison already merged as PR #29: `docs/hosting/AGELESS_SITES_FEASIBILITY_2026-11-06.md`.

## Private test sequence (for Live03 in an authorized Sites/Work runtime)
1. Import **this branch** and the existing Next.js source as a private project; do not import any production env values.
2. First run a local build/typecheck and existing regression suites with isolated test configuration. Record actual command, exit code, timestamp, commit.
3. Test rendering and routing for `/`, `/login`, `/admin`, `/shop` with no external database. Confirm closed default and absence of product/price leakage.
4. Test server-side App Router/SSR and POST route execution in the actual Sites runtime. Check Node-only API support, headers, cookies, edge middleware/proxy behavior and variable handling.
5. Use a completely isolated synthetic DB + synthetic users only **if** Sites actually supports the required secure backend; then check owner vs tester permissions, password reset, save/read consistency, media upload MIME/size control, and real restore of test media and test rows.
6. Explicitly probe checkout create/capture while disabled and ensure both return rejection, create no order, contact no PayPal API; do not test an actual financial transaction.
7. Verify private access using an unauthorized session and ensure pages AND APIs cannot leak any data. Then review phone and desktop rendering, install/update behavior only if supported.
8. Document actual build logs, test responses, preview URL (restricted), cost/plan limitations, privacy/data residency, and tested backup **restore**. Without evidence mark every case NOT TESTED.

## Acceptance matrix
| Gate | Current evidence | Result |
| --- | --- | --- |
| Existing repository / code paths identifiable | GitHub code + PR #29 | PASS (source-level) |
| Separation from e-Xpense / production | Dedicated branch, no app modifications at creation | PASS (repository-level) |
| Private Sites deployment + access control | No Sites create/deploy tool available in this GitHub session | NOT TESTED |
| Next.js SSR / Node route support in Sites | Requires actual deployment | NOT TESTED |
| Auth / Admin / Tester roles | Requires isolated synthetic identity backend | NOT TESTED |
| Upload + data persistence + backup/restore | Requires isolated synthetic storage | NOT TESTED |
| Checkout disabled and negative API tests on Sites | Requires runtime | NOT TESTED |
| Mobile/Desktop render and operating costs | Requires actual Sites access | NOT TESTED |

**Decision:** ChatGPT Sites is a **conditional candidate**, not approved as AgeLess production hosting. Do not change DNS or authorize commerce. If full feature and recoverability parity fails, evaluate alternate hosting without purchasing until approval.

**Handoff:** AgeLess Website Live03 reviews this branch/PR and logs real Sites evidence in Issue #3 and the central `docs/checkpoints/CURRENT.md`. No other chat is automatically notified.
