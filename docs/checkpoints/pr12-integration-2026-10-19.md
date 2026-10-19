# PR #12 — Research dashboard integration, 2026-10-19

Handover to AgeLess Website Live03. No deployment, hosted DB/storage change, product approval, mode switch or payment activation performed.

## Inputs and proven cause

- PR #12 original head: `fc6f36ceaf8c45863d25080e4c06b70c679900cf`.
- Corrected PR #11: `0126085086f7b9d4ff8b12554d0cdc4e10acdd0b`, preserved as an ancestor; PR #11 itself is unchanged.
- Actual base of both PRs: `beta/highgloss-logo`, `42da6bead3fd9a96d17fc3bc3d2ccb83f5675af2`.
- Main: `f2f99774e313118ba0c28b02083e27d7c0927f3c` (also preserved as ancestor).
- Original #12/base common ancestor: `732ff2d5afbd9aa252fcdd5a8768fca2eed09c59`. A three-way merge reproduces a content conflict in `app/admin/page.tsx` after the #10 squash. Draft status is independent of this conflict. Upload route is identical, not a duplicated endpoint.
- Merging corrected #11 into #12 resolves the history conflict without discarding Research changes. Main adds only its existing coordination workflow/docs; they are preserved. No change was pushed to main or beta.

## Result

Research cards retain country, use, dates, restrictions and original source. Expired, future, missing or blocked evidence is explicitly labelled invalid/open. Unsafe/malformed source URLs are not clickable. Both browser and API use the shared validator, which now parses HTTPS URLs and rejects credentials, malformed URLs and invalid/duplicate delivery-country codes.

The two owner decisions are retained. Positive selection requires current evidence for every country, a reference, known price/stock, owner role and no hold. Saving still uses the existing authenticated API, owner checks, concurrency guard and hold logic. Staff cannot edit Research country/reference fields in the UI; API restrictions remain authoritative. Negative decision clears both sale flags. Selection only prepares a change; saving is required.

Product management and upload API are preserved. `app/api/admin/route.ts` and `app/api/admin/image-upload/route.ts` are byte-identical to corrected #11; no schema, dependency, credentials or payment-code changes.

## Validation

- TypeScript (`tsc --noEmit`): passed.
- Production build (`npm run build`): passed with synthetic Supabase values and checkout disabled.
- 52 backoffice/API checks, 43 access checks, 23 upload checks, 37 editor component/handler checks passed (155 total).
- `git diff --check`: passed.
- Auth, DB and Storage in tests are mocked; component-tree tests are not a visual browser acceptance.
- Dependencies reused from local #11 installation with identical lockfile SHA-256 `5055d72021439015f667cf3dd557cb4427776a2c172ed6baa87462ae2380f9dc`. Initial build with an external node_modules symlink failed due to Turbopack's filesystem boundary; a physical local copy fixed it and the normal build passed. No package change.

## Legal meaning and limits

No real product evidence was supplied or approved in this task. `verified` records a manual assessment; the app cannot authenticate documents, determine product identity from a URL or establish that every legal obligation has been satisfied. Research must assess the finished product, route of administration, composition, label, supplier documents, intended country and claims, and mark unresolved obligations pending/blocked. Restrictions are displayed as text and cannot be interpreted automatically.

An NEM notification is not an approval or verification of marketability: BVL explicitly states that it does not assess, examine or approve notified products. Source: https://www.bvl.bund.de/DE/Arbeitsbereiche/01_Lebensmittel/04_AntragstellerUnternehmen/03_NEM/lm_nahrungsErgMittel_node.html . Do not infer finished-product legality from general substance information or research-only supplier claims.

## Integration and remaining acceptance

Keep #12 as the additional Research stage. It now includes the corrected #11 and current main history. Either merge #11 first and then #12, or review #12 as a cumulative proposal; do not replace #11 with the original stale #12. The current PR target remains beta; moving the combined frontend/backend history to main is a separate release decision.

Before release, Live03 must verify CI on the final head, desktop/mobile layout, actual owner and staff roles, real image upload -> product save -> reload, and hosted bucket/RLS/migrations. The `ageless-product-images` bucket and hosted configuration were not checked here.

Preserve the separate PR #9 reapproval work: #11's existing API does not bind image changes to renewed approval. This pre-existing gap is not silently solved by Research cards; inspect/integrate and test #9 before a production release. No claim of complete live readiness.
