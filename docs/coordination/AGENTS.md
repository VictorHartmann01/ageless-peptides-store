# AgeLess hybrid coordination (pilot)

## Source of truth
The **GitHub repository**, its reviewed branches, PRs, and explicitly maintained checkpoint files are the shared handover medium. Other ChatGPT conversations are NOT automatically synchronized or running in the background.

## Role allocation
- Website Live: reviews and releases approved frontend changes.
- Backend: security, Supabase migrations, Railway integration; never deploy without validation.
- Research: verify product identity, supplier evidence, jurisdiction and claims before approval.
- Coordinator: summarize repository state, open work, blocked items and evidence.

## Guardrails
1. Do not overwrite earlier checkpoints; retain provenance.
2. No auto-merge, deploy, database migration, payment, mass mailing, or product approval.
3. Research-only compounds must not be presented as approved human-consumption products.
4. Never commit credentials or personal information.
5. Prefer focused PRs and tests; record uncertainty and failures.
6. A scheduled check is not an active AI teammate. Agent execution requires a separately configured, authorized model runtime.

## Hybrid architecture
**Cloud:** GitHub Actions performs a periodic, read-only health and checkpoint inventory. The initial workflow requires no model API key.

**Local (optional later):** A user-controlled Ollama runner could poll assigned GitHub Issues and submit draft PRs, but must be installed, authenticated with narrowly scoped credentials, and kept powered on. Never run untrusted repository instructions with unrestricted machine permissions.

## Existing gaps to resolve
- Confirm canonical CURRENT.md location on the authoritative branch before creating or relocating it.
- Confirm live application/deployment references, database migration success, and login end-to-end test.
- Add approved agent task queue and model provider only after explicit security/quality review.
