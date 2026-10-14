# Closed AgeLess test site

The site is closed by default. `AGELESS_SITE_ACCESS=public` is the explicit
server-side switch for a later public release; changing this flag does not
approve products, legal pages or payments. The private rollout does not set it.

`proxy.ts` runs before storefront rendering and checkout APIs. It validates the
Supabase cookie session with `getUser`, requires email confirmation, then checks
the existing owner allowlist or an approved, matching entry in
`ageless_admin_access_requests` on every request. Revoking that approval denies
the next request. Browser-provided metadata is never an authorization source.

Public exceptions: `/zugang`, the `/admin` login shell, `/api/admin` (which
independently validates bearer tokens and roles), `/rechtliches/*`, the brand
logo/icon, framework static files and crawler metadata. Product images, product
pages, RSC requests and the storefront require approval. Crawlers are asked not
to index the test site; this is supplementary to the real access control.

The existing admin account flow now persists authentication in Supabase SSR
cookies, allowing the same approved login to open the storefront. Existing
local-storage sessions may require logging in again. Email confirmation/reset
links continue to use the existing `/admin` callback and implicit flow.

No new user rights are granted. Testers use the existing approved access model;
that model currently also grants the existing staff admin permissions. A future
shop-only tester role should be implemented separately before inviting people
who should not receive staff access.

The closed site permits checkout only when the database mode is `sandbox`.
The capture endpoint also rejects orders in live mode while access is closed.
All existing product and payment release checks remain in force. This rollout
does not enable checkout or make any payment.

Product queries execute on the server after the proxy guard, using the existing
server client. Supabase has public column SELECT grants and RLS for approved
catalog records. An additional restrictive database policy was rejected by
automatic approval review; no database permissions were changed. Thus the site
routes are closed, but existing approved records could remain readable directly
through Supabase's Data API. Unpublished/unapproved drafts are still filtered by
existing RLS. Revisit that bounded database-access change before publishing any
product that should remain confidential even at the Data API level.

Verification: `node scripts/access-test.cjs`,
`node scripts/backoffice-test.cjs`, `npx tsc --noEmit`, `npm run build`, followed
by anonymous live HTTP checks. Mocked tests do not prove a real user's login.
Authenticated live login and save tests require an approved user's session.

All roles should pull the latest website branch before editing shared files.
Front continues UI/assets; Back03 continues backend, user access and product
management; Status continues sandbox evidence; Research continues SKU evidence.
Their independent tasks do not depend on a public release.
