# Empty-project bootstrap and owner login

Victor approved project `cancabxqlwkiwloshhuo` as the new AgeLess target on
2026-10-11 and specified owner email `AgeLess@e-Valuate.biz`.
The old inaccessible project is unchanged. This reconstructs the repository
schema; it does not claim to restore any old database records.

The historical migrations assume existing `profiles`, `products` and
`product_variants`. On an EMPTY project, apply in this explicit order:

1. `bootstrap/20261011162233_ageless_existing_backend_prerequisites.sql`
2. `migrations/20260927_add_age_less_operations_foundation.sql`
3. `migrations/20261008_ageless_commerce.sql`
4. `migrations/20261009_ageless_admin.sql`
5. `migrations/20261009_ageless_admin_approvals.sql`
6. `migrations/20261009_ageless_sandbox_orders.sql`
7. `migrations/20261011_ageless_backoffice.sql`
8. `migrations/20261011175616_ageless_explicit_backend_permissions.sql`

These have been applied through Supabase migration tooling to the new project.
Remote migration version timestamps are assigned by that tooling; compare names
and contents, not just the historical short filename timestamps. Do not blindly
run the legacy sequence again against this initialized database. The preexisting
`restrict_rls_auto_enable_execution` migration was preserved.

The 47 confirmed product intake positions were inserted as unpublished offers,
with price and quantity NULL, no legal approval and source/identity caveats in
the description. Variant groups remain drafts requiring exact SKU confirmation.
Approval/publication requires known commercial values and country evidence.

Run `scripts/backoffice-db-test.sql` against the target as postgres: all fixtures
roll back. It tests actual permissions/RLS, proof checks, draft and hold guards,
atomic stock decrement, duplicate completion and held-order manual handling.
It does not contact PayPal or test the deployed Auth/UI end-to-end.

Deploy configuration requires `AGELESS_OWNER_EMAILS=AgeLess@e-Valuate.biz`,
the NEW project URL and public key, and its server-only service key. Keep
`AGELESS_CHECKOUT_ENABLED=false` and store mode `draft` until sandbox E2E passes.
Owner signs up/confirms this email and chooses a password through Supabase Auth;
do not insert a confirmed user manually or hardcode a password. Additional users
start pending and require owner approval. Daily requests go to the same email;
skip approved/current and on-hold products. Deployment/Auth are still separate
checks and are not proven by the database tests.
