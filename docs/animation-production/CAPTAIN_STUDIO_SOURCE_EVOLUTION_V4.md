# Captain Studio source-evolution verification policy v4

**Draft | November 12, 2026 | Not merged or activated**

## Purpose

Admit one reviewed runtime gameplay change, the CPU team-play AI proposed in PR #28, into CI verification eligibility, without weakening any Captain Studio source, artwork, provenance or activation gate. As in v3, this policy governs **CI verification eligibility only**. It is not owner approval to merge, deploy, generate artwork, accept animation packages, promote refs, or recover the separate Myth/Codex workspace.

## Owner decision

On November 12, 2026 the repository owner chose to open a separate v4 policy PR, so that PR #28 can pass the all-PR scope check after a review, instead of merging it with the v3 scope check red. v3 already set out this sequence: runtime changes need "a separately reviewed v4 policy, a new owner decision, and browser E2E validation".

## Prerequisite and exact bootstrap

- `main` at review base: `f2788aec6786675f9e5b1ce516a65cbf788b2d78`, the merge of PR #26 (policy v3).
- Propose this policy in its **own five-file PR** based on that exact SHA: `.github/workflows/captain-studio-baseline-verify.yml`, `tools/captain-studio/verify-baseline.mjs`, `tools/captain-studio/source-evolution-contract-v4.mjs`, `tests/captain-studio-source-evolution-v4.test.js`, and this document.
- **Merge order:** this bootstrap must merge while `main` is still at the review base. If PR #27, PR #28 or any other PR merges first, the bootstrap base no longer matches and the policy has to be re-based and re-reviewed.
- Do not mix gameplay or characterization edits into the bootstrap.

## Protections that remain intact

- The PR20 merge `2654be8c094900200dd03910a99552b6cf1c2c07`, its five immutable snapshot files, the 17 source/blob pins and the three byte-pinned v2 source variants are unchanged.
- The exact 746 inherited audit findings and `strictOk=false` are unchanged; the strict artwork audit job runs exactly as in v3.
- All v1/v2 verifier records stay frozen against the v3 base, as before. The v3 contract, v3 tests and v3 document are now also frozen, byte-for-byte, against the v4 base.
- `src/core/animation.js`, animation manifests, ball tracks, atlases, `src/content/**`, `src/render/**`, `src/main.js`, the package validator/integrator/exporter, `package.json`, `package-lock.json`, deployment workflows and `tools/e2e_smoke.py` remain **outside** the allowlist.

## Gameplay verification scope

After this policy passes CI, receives owner authorization and merges, ordinary PRs may change **only** these paths:

The v3 characterization artifacts (unchanged):

1. `tests/match-control-characterization.test.js`
2. `docs/architecture/BASELINE_CHARACTERIZATION.md`
3. `docs/architecture/MATCH_CONTROL_TRANSITIONS.md`

The CPU team-play change (PR #28), as an exact path list:

4. `src/core/ai.js`: new CPU team AI module
5. `src/core/simulation.js`: delegates CPU inputs to the AI module; difficulty presets; difficulty accuracy applies to opponents only
6. `tests/ai.test.js`: AI behavior tests
7. `tools/ai-benchmark.mjs`: reproducible CPU-vs-CPU and scripted-player benchmark
8. `tools/build.mjs`: bundles `core/ai.js` into the offline page
9. `README.md`, 10. `docs/BALANCE_NOTES.md`, 11. `docs/KNOWN_ISSUES.md`: documentation

An exact list means any further gameplay work (for example controller-slot continuity in `src/main.js`) still needs its own reviewed policy version. A PR that touches any path outside the list fails the scope check, even if its other paths are in scope.

## Browser E2E gate

v3 required browser E2E validation for runtime changes but did not run it in CI. v4 adds it to the `match-control-tests` job, which already depends on `scope-check`. That job now builds the self-contained page, installs a pinned Playwright (`1.65.1`) with Chromium, links Chromium to the harness's fixed path (`/usr/bin/chromium`, hard-coded in `tools/e2e_smoke.py`, which v4 leaves unchanged), runs `npm run test:e2e`, and uploads the screenshots as an artifact. The workflow change itself is the only new CI surface, and it is read-only (`contents: read`).

Evidence for PR #28 before this policy: the full `tools/e2e_smoke.py` Chromium suite passed locally on PR #28's head, including a complete default-length match, CPU difficulty selection, split-team and same-team co-op, substitutions and season progression.

## Accepted single-owner trust boundary

Unchanged from v3. The repository has no enforced branch protection, required status checks or rulesets; a direct push, skipped workflow or unreviewed merge can bypass this policy. A green scope check means only that a PR falls within the listed paths and invariants. It does not authorize a Captain Studio pilot, asset acceptance, production release or deployment.

## Evidence and acceptance

- Required on this bootstrap PR: all CI jobs green, including the strict audit with the exact 746 inherited identities, `npm test` (which runs the frozen v1–v3 and new v4 policy tests), lint, content validation, league simulation and the new browser smoke suite.
- Required on PR #28 after this merges: merge `main` into PR #28 without rewriting history; the scope check, strict audit, full Node checks and browser smoke suite must all pass.
- A human playtest of the CPU behavior remains the owner's acceptance step; the PR #28 playtest checklist is the guide.

## Reversibility

Revert PR #28 first, then revert this policy. Never force-push, delete old evidence or mutate published artwork as a shortcut.
