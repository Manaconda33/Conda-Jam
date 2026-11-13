# Captain Studio source-evolution verification policy v5

**Draft | November 12, 2026 | Not merged or activated**

## Purpose

Admit one reviewed gameplay change, **shot physics: blockable jumpers and live rebounds**, into CI verification eligibility, without weakening any Captain Studio source, artwork, provenance or activation gate. As in v3 and v4, this policy governs **CI verification eligibility only**. It is not owner approval to merge, deploy, generate artwork, accept animation packages, promote refs, or recover the separate Myth/Codex workspace.

## Owner decision

On November 12, 2026 the repository owner approved this plan: a separate v5 policy PR listing the exact paths of the shot-physics change, merged before that change. The owner also approved adding `tests/ai.test.js` to the list, to make one CPU test's sample representative rather than lowering its threshold.

## Prerequisite and exact bootstrap

- `main` at review base: `e87074b8d677909fcc3dd87d1c44c8975885525b`, the merge of PR #28 (CPU team play under v4).
- Propose this policy in its **own five-file PR** based on that exact SHA: `.github/workflows/captain-studio-baseline-verify.yml`, `tools/captain-studio/verify-baseline.mjs`, `tools/captain-studio/source-evolution-contract-v5.mjs`, `tests/captain-studio-source-evolution-v5.test.js`, and this document.
- **Merge order:** this bootstrap must merge while `main` is still at the review base. If anything else merges first, the policy has to be re-based and re-reviewed.
- Do not mix gameplay or characterization edits into the bootstrap.

## Protections that remain intact

- The PR20 merge `2654be8c094900200dd03910a99552b6cf1c2c07`, its five immutable snapshot files, the 17 source/blob pins and the three byte-pinned v2 source variants are unchanged.
- The exact 746 inherited audit findings and `strictOk=false` are unchanged.
- v1/v2 records stay frozen against the v3 base, and v1–v3 records against the v4 base, as before. The v4 contract, v4 tests and v4 document are now also frozen, byte-for-byte, against the v5 base.
- `src/main.js`, `src/core/animation.js`, `src/content/**`, `src/render/**`, animation manifests, atlases, `tests/game-core.test.js`, the package validator/integrator/exporter, `package.json`, `package-lock.json`, deployment workflows and `tools/e2e_smoke.py` remain **outside** the allowlist.

## Gameplay verification scope

After this policy passes CI, receives owner authorization and merges, ordinary PRs may change **only** these paths:

The v3 characterization artifacts (unchanged): `tests/match-control-characterization.test.js`, `docs/architecture/BASELINE_CHARACTERIZATION.md`, `docs/architecture/MATCH_CONTROL_TRANSITIONS.md`.

The shot-physics change, as an exact list:

1. `src/core/simulation.js`: miss trajectories aimed at the rim or glass, rim caroms, backboard position fix, block reach
2. `src/core/ai.js`: CPU block decision uses the game's reach; rebound crash decision
3. `tests/shot-physics.test.js`: new physics tests
4. `tests/ai.test.js`: representative sample for the CPU assist-rate test
5. `tools/ai-benchmark.mjs`: rebound, out-of-bounds and block-type metrics
6. `docs/BALANCE_NOTES.md` and 7. `docs/KNOWN_ISSUES.md`: documentation

The v4 CPU team-play paths that are not on this list (`tools/build.mjs`, `README.md`) are accepted as merged history in the cumulative check but are **no longer open** to new PRs. A PR touching any path outside the list fails the scope check.

## Compatibility note for the frozen v4 test

The frozen v4 test asserts that `verify-baseline.mjs` contains the literal v4 call sites. v5 replaces those calls, so the v4 call text is kept as **documentation-only comments** in the verifier, the same approach v3 took for the v1/v2 workflow path tokens. The new v5 test strips comments and asserts that the executable code calls only the v5 checks, so the v4 strings cannot quietly become live again. The v5 test checks behavior, not literal call text, so a future v6 will not hit this problem.

## Browser E2E gate

Unchanged from v4: the `match-control-tests` job builds the page, installs pinned Playwright `1.65.1` with Chromium, runs `npm run test:e2e`, and uploads the screenshots.

## Accepted single-owner trust boundary

Unchanged from v3/v4. There is no enforced branch protection, required status check or ruleset; a direct push, skipped workflow or unreviewed merge can bypass this policy. A green scope check means only that a PR falls within the listed paths and invariants.

## Evidence and acceptance

- Required on this bootstrap PR: all CI jobs green, including the strict audit with the exact 746 inherited identities, `npm test` (frozen v1–v4 and new v5 policy tests), lint, content validation, league simulation and the browser smoke suite.
- Required on the shot-physics PR after this merges: merge `main` into it without rewriting history; all checks must pass.
- A human playtest remains the owner's acceptance step. The scripted casual player's Pro win rate moved from 49% to 39% in the benchmark, and the owner chose to judge Pro difficulty in the playtest.

## Reversibility

Revert the shot-physics PR first, then this policy. Never force-push, delete old evidence or mutate published artwork as a shortcut.
