# AgeLess P0 / Issue #22: Safe Railway migration gate (Back03)

**Status: PREPARED, NOT MIGRATED.** No source database calls or production mutations were performed by this work.

## Verified infrastructure (read-only, 2026-11-06)

- Railway project: \`3bff23e0-de13-4fb1-8228-9b1b796180da\`.
- Production: \`28c8b5dc-158a-450c-9757-d070dd7a4010\`.
- PostgreSQL service: \`4d69fa0d-8cb1-40c9-81a7-de8cada330ea\`, existing volume.
- S3-compatible bucket: \`ageless-product-images\` (\`f80f2dcc-93a3-4818-9b76-4875ec0caf2c\`).
- Web service still configured with \`NEXT_PUBLIC_SUPABASE_URL\`, \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`, \`SUPABASE_SERVICE_ROLE_KEY\`. Do not clear them before auth replacement works.
- No proven complete current source export. The old project ZIP is not a live database backup. This is a **hard cutover blocker**.

## Required source export (obtained by authorized owner/Live03; NOT by Back03 against excluded Supabase)

Use a private encrypted offline folder outside GitHub and public cloud assets. Include:
- Exact \`schema.sql\`, migrations/schema versions and \`roles-and-policies.json\` describing grants, RLS, triggers, functions, ownership.
- \`tables/*.jsonl\` for EVERY actual business table, including at least \`ageless_offers\`, \`ageless_legal_pages\`, \`ageless_orders\`, \`ageless_store_settings\`, \`ageless_admin_access_requests\`, \`ageless_tester_access\`; unlisted tables must be identified before migration.
- \`auth/users.jsonl\` for authenticated identities plus confirmation state, and an **approved separate auth migration plan**. Password hashes, OAuth identities, MFA credentials and sessions must not be assumed portable. Existing user sessions cannot be presumed valid with new authentication.
- Actual image binary objects and their paths/ETags, not URL strings alone, including files held in any prior storage provider.
- A \`manifest.json\` with \`{"format":"ageless-export-v1","files":[{"path":"...","sha256":"<64 lowercase hex>","records":0}]}\`. For each JSONL, \`records\` is number of nonempty JSON objects; all entries need sha256. The manifest is generated from an **immutable**, validated source snapshot. No secrets or customer information in GitHub.
- Backup encryption/key custody, controlled access, retention/deletion and restore test recorded privately.

## Read-only verification command (no credentials)

\`\`\`sh
node --test scripts/railway-migration/verify-export.test.mjs
node scripts/railway-migration/verify-export.mjs /secure/source-export
\`\`\`

If a target snapshot has been independently exported using the same canonical serialization, run:
\`\`\`sh
node scripts/railway-migration/verify-export.mjs /secure/source-export /secure/railway-export
\`\`\`
Both locations must be private and complete. A passing script verifies **export evidence**; it does **not** prove DB constraints, Auth user sign-in, RLS enforcement, or S3 HTTP access. Never copy raw user records or secrets into GitHub Actions.

## Controlled migration order (blocked until source verified)

1. Freeze source writing **only for the smallest safe cutover window**, after a proven rollback plan. Obtain consistent source transaction snapshot and all binary assets.
2. Verify hashes, row counts, schema, roles and approved export custody. Preserve old DB/storage untouched.
3. Restore schema to separate Railway staging DB; not directly into live production. Check types, functions, unique constraints, foreign keys, RLS and least-privilege DB identities. Do not grant client direct table access.
4. Import non-sensitive/catalog data and sensitive data only through secure operator tooling; preserve IDs, timestamps, association links, order/payment identifiers and approval gates. Avoid breaking referential integrity.
5. Upload binary assets to Railway S3 using object path mapping and verify SHA256 + object availability. Never automatically replace mismatched files or infer SKU-strength from image artwork.
6. Choose and implement an independent auth provider/session migration. Account ownership proof and explicit admin/tester roles must survive. **Do not replace Auth with a raw 'email=owner' rule without verified identity.**
7. Implement a feature-flagged Railway DB/storage adapter and read-only smoke tests, then write/API tests against **staging only**. Checkout remains disabled, zero unapproved SKUs sellable.
8. Re-export target under consistent ordering, verify mandatory table counts and normalized content; separately test images, permissions, legal states, admin/product saving, login, prohibited direct APIs and sandbox-only checkout.
9. Live03 authorizes controlled cutover after green CI and verified rollback. Record target commit/deployment, evidence and test results in #3. No automatic cutover from this PR.
10. Rollback procedure: route app back to previously working source + previously deployed commit/config, without deleting railway staging. Stop writes before rollback and reconcile any new transactions so nothing is lost.

## Hard blockers / stop conditions

- Missing full source export, backup hash mismatch or unverified restore → STOP.
- No portability plan for authentication/customer accounts → STOP.
- Missing image binary assets or ambiguous SKU mapping → do not claim complete media migration.
- New recurring cost (incl. additional environments) without owner authorization → STOP.
- Any newly enabled sale/payment or changed \`manual_approved\`/\`is_published\` flags → STOP.
- Existing web app + current code use Supabase Auth/data; provisioning Railway Postgres/S3 by itself does not switch traffic.

## Handoff

Back03 is responsible for data/auth preparation and tests. Front supplies media/verified SKU mapping (#21). Research supplies SKU compliance (#23). Beta Status independently tests (#24). Live03 alone integrates and releases. Only update \`docs/checkpoints/CURRENT.md\` by Live03, from evidence in Issue #3.
