# AgeLess Backend: Migration audit, 11 October 2026

## Decision

Not ready for live checkout. This corrective branch is based on PR #4 commit `43be7eb20f5200e6c34f240a7c4fe6b306464894`. No hosted schema, inventory, user grant, product approval or payment was changed. Merge and deployment are separate release steps.

## Verified current state

- PR #4 is open and draft, targeting `beta/highgloss-logo`.
- Supabase project `cancabxqlwkiwloshhuo` is healthy and has no public tables. Its migration history contains only `20261011044626_restrict_rls_auto_enable_execution`.
- GitHub reports Vercel deployment failure for the PR head. Build logs from that deployment were not available here; its cause is not established.
- The hosted security advisor returned no notices on the current empty application schema. This does not validate the proposed schema.
- The complete original repository migration chain cannot initialize an empty database: the first operations migration requires `products`, `product_variants`, `profiles`; commerce references `products`; backoffice alters `ageless_offers` and references `ageless_orders`.
- Three original files share migration version `20261009`, making migration history ambiguous.

## Reproducible fresh-install sequence

Apply all committed migrations in ascending version order, using the normal Supabase migration runner on an isolated Supabase environment first:

| Version | Purpose | Dependencies |
| --- | --- | --- |
| 20260926000000 | Minimal base schema: profiles, products, variants | Supabase auth.users, auth.uid(), standard roles |
| 20260927000000 | Operations/research/audit foundation | Base tables |
| 20261008000000 | Offers, orders, initial completion RPC | products |
| 20261009000000 | Store settings and legal pages | Standard roles |
| 20261009000001 | Private user approval requests | auth.users |
| 20261009000002 | Sandbox order mode and status | orders |
| 20261011000000 | Evidence, hold, private grants and hardened completion | All above |

The baseline was generated with the Supabase CLI, then ordered before its dependent files. Earlier migration versions were normalized to unique 14-digit identifiers. **This sequence is for the verified fresh target. Do not replay it on an existing installation or silently repair a historical ledger.** First compare schema and migration history, take a verified backup, and prepare an additive upgrade plan. The inaccessible old project was not inspected. Preserve the target's pre-existing platform security migration.

No product, user, stock or approval is seeded. Settings start in draft. The minimal catalog remains closed by RLS; independently reviewed catalog publication policies and any wider historical base schema must be reconciled before enabling legacy product pages. It deliberately does not invent public publication permissions.

## Security and workflow

- Browser roles cannot assign profile roles, approve users, alter offers, read orders/settings/access requests or run the paid-order RPC. Every public application table has RLS.
- Offers expose only explicit public columns. Legal evidence, reviewer and hold reason remain private. Public eligibility requires publication, owner-reviewed approval, stock, current country evidence and no hold.
- Operations tables have browser grants revoked to prevent legacy admin/staff policies becoming an alternative to the owner-controlled API.
- Server service-role access is explicitly granted; the key must stay server-only. RLS does not authorize service-role operations: `/api/admin` verifies the bearer token with Supabase Auth, requires confirmed email and checks the server owner allowlist or an approved user request on every request. User-editable metadata is not used.
- The owner allowlist is deployment configuration, not a database owner role. Confirm the exact verified owner's account and restrict who can edit deployment variables/service credentials. No owner identity was invented or provisioned.
- Staff may edit price/stock without changing approval-sensitive fields. Approved imagery is now owner-controlled as well. Revocation of a staff request is checked on the next API request. An already-authorized in-flight request is not cancelled; strict transactional revocation guarantees remain a follow-up if required.
- Hold requires a reason and withdraws approval/publication. Releasing hold alone does not republish. Expired evidence is checked dynamically by RLS and checkout, rather than relying only on a historical CHECK constraint.
- The migration no longer resets existing approvals. It aborts with `EXISTING_APPROVALS_REQUIRE_BACKUP_AND_REVIEW`, rolling back its changes. An existing-data transition requires a reviewed, separate procedure.
- Completion validates positive bounded quantities, rejects duplicate offer lines, checks current approval and item price, locks offers in deterministic order, and is idempotent. A withdrawn/insufficient offer after capture becomes `paid_manual_review` without reducing stock. Sandbox completion cannot reduce live stock even if the RPC is called directly by the server.
- Live mode, create and capture now require `AGELESS_LIVE_RELEASE_APPROVED=true`; the default is false. Create/capture also require the checkout flag, active matching mode and published required legal pages. The release flag records a human release decision; a document URL or 30-character legal text is not proof of legal suitability.

## Actually completed validation

Run from repository root after `npm ci`:

```sh
npm run test:migrations
npm run test:backoffice
node scripts/checkout-gate-test.cjs
npx tsc --noEmit
```

- Complete seven-step migration sequence passed on a disposable PGlite 0.5.8 PostgreSQL 18.3 WASM engine, using synthetic Supabase roles/auth objects and deliberately broad default grants to exercise revocations.
- Backoffice alone on an empty schema failed as expected. A legacy approved synthetic offer caused guarded rollback and retained both approval and publication.
- SQL tests passed for RLS coverage, private grants, direct user/product approval denial, RPC permissions, eligible public reads, hold withdrawal/release, evidence expiry/invalid date/null handling, sandbox inventory preservation, live fixture stock decrement/idempotency, held capture manual review and negative quantity rejection.
- 31 mocked API/evidence checks passed, including owner/staff permissions, optimistic concurrency and image-edit denial.
- Seven mocked checkout gates passed with zero payment/network calls.
- TypeScript check passed.
- Next production build passed with `NEXT_PUBLIC_SUPABASE_URL=https://example.invalid` and a placeholder anon key. This tests compilation/fallback behavior, not production connectivity.
- Dependencies are pinned and a lockfile is committed, including the local migration test dependency.

PGlite runs actual PostgreSQL SQL/PLpgSQL and RLS but is a single embedded process. It does **not** validate hosted PostgreSQL 17.11 compatibility in full, concurrent connections/deadlocks, PostgREST, real Supabase Auth/session handling, provider secrets, email delivery or PayPal. No full-stack hosted staging test or real payment was performed.

## Required release evidence

1. Review and merge the correction into the backend PR branch, then the approved integration branch. Resolve the Vercel failure using its actual logs and obtain a successful preview deployment.
2. On a separate Supabase staging project/branch: apply the full chain, compare its migration ledger, run security/performance advisors, exercise REST public column reads and private denies, and verify schema/API grants. Never run the test auth bootstrap or synthetic SQL fixtures on production.
3. Verify real owner login, confirmed email, pending/approved/revoked staff login, forbidden staff approval, hold/release, country evidence expiry and concurrent edits.
4. Verify sandbox create → payer approval → verified capture → sandbox_paid; confirm stock unchanged, repeated capture safe, errors/cancel paths handled, and held/expired products blocked. Test concurrent live-like stock consumption using fixtures in staging.
5. Review recovery/reconciliation for PayPal capture succeeding while DB completion fails, and retries when a capture response is lost. Current code has no demonstrated webhook/reconciliation end-to-end proof. Test refunds/manual-resolution handling before live release.
6. Obtain product-specific and country-specific legal review, valid intended use/documentation, required shop legal pages and payment-provider eligibility. Evidence format checks do not establish the legality of selling any peptide.
7. Back up any real installation and rehearse its exact additive transition; verify deployment environment points to the intended Supabase project and owner account. Keep checkout disabled and store mode draft through migration.
8. Only after recorded technical AND legal approval may the authorized release operator enable the release flag, checkout and live mode. No activation occurred in this audit.

References: original PR https://github.com/VictorHartmann01/ageless-peptides-store/pull/4 ; Supabase RLS https://supabase.com/docs/guides/database/postgres/row-level-security ; grants change https://supabase.com/changelog/45329-breaking-change-tables-not-exposed-to-data-and-graphql-api-automatically . Current changelog and PostgreSQL 17.11 breaking-change notes were checked; the migrations do not use the affected custom operators, ltree or legacy encryption ciphers.
