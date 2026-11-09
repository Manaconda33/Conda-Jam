# Captain Studio source-evolution verification policy v3

**Draft for independent review | Proposed November 9, 2026 | Not merged or activated**

## Purpose

Open a narrowly scoped, reviewable path for Conda Jam match-control architecture characterization and future controller/session coordination fixes without weakening the accepted Captain Studio source, artwork, provenance, or activation gates. This policy governs **CI verification eligibility only**. It is not owner approval to merge, deploy, generate artwork, accept animation packages, promote refs, or recover the separate Myth/Codex workspace.

## Prerequisite and exact bootstrap

- `main` at review base: `7d96e1bbb5e966a48f7748e87127f1008b1c25e8`, after separately merged PRs #22 and #24.
- Propose this policy in its **own five-file PR** based on that exact SHA: `.github/workflows/captain-studio-baseline-verify.yml`, `tools/captain-studio/verify-baseline.mjs`, `tools/captain-studio/source-evolution-contract-v3.mjs`, `tests/captain-studio-source-evolution-v3.test.js`, and this document.
- An independent review and explicit owner **merge authorization** are required. Keep this PR draft until approved. Do not mix characterization or gameplay edits into the policy bootstrap.
- PR-base validation uses the trusted `github.event.pull_request.base.sha`, while cumulative validation examines the complete Git diff from accepted PR20 merge to HEAD, not a worker-declared subset.

## Protections that remain intact

- The original PR20 merge `2654be8c094900200dd03910a99552b6cf1c2c07`, its five immutable snapshot files, the 17 source/blob pins, the historical source commit `895ff9c598689ce58980b504876b3b36c027f6a5` and frozen v1/v2 verifier records remain protected.
- The exact 746 inherited findings (706 missing directional assignments, 40 historical non-verbatim prompt findings) must remain identical; the strict artwork audit still has `ok=false`. These are historical gaps, not new regressions.
- All existing Captain Studio provenance, digest, independent review, rejection, batch-staging, compare-and-swap promotion, resource guards, and no-new-artwork/pilot/production gates remain untouched.
- No edits to `src/core/animation.js`, runtime animation manifest, ball tracks, production atlas files, package validator/integrator/exporter, `package.json`, deployment workflows, or the Myth/Codex recovery workspace.
- Current v2 pinned source variants for PRs #21/#22 stay exact Git blob hashes. Any change to protected or unrelated paths requires a distinct later policy version and review.

## Explicit future verification scope

After the policy is independently approved and merged, a subsequent PR may change only these seven paths:

1. `docs/architecture/BASELINE_CHARACTERIZATION.md`
2. `docs/architecture/MATCH_CONTROL_TRANSITIONS.md`
3. `tests/match-control-characterization.test.js`
4. `tests/match-control.test.js`
5. `src/core/match-control.js`
6. `src/main.js`
7. `tools/e2e_smoke.py`

This is an exact allowlist, not a blanket permit for `src/**` or `tests/**`. Future PRs may use a subset, but cannot edit verifier files. Each PR still requires ordinary review, behavioral evidence, and separate owner approval to merge. There is **no automatic merge or automatic approval** implied by passing CI.

## Architectural sequence and PR gates

1. **V3 policy PR**: verifier, workflow and tests only. Independent review and separate owner merge decision. `main` stays untouched until then.
2. **Baseline-characterization PR**: documentation and deterministic tests only, stacked behind v3 until v3 is merged and approved. Record the current behavior of substitution, pause, and input routing without modifying runtime code. A suspected control defect is not a proven runtime bug until reproduced.
3. **Draft transition contract**: document a dependency-free pure resolver for the session/control seam. Preserve `match.phase`/`match.pause` as simulation authority; controller bindings are to stable court slots, not permanently to athlete IDs. Draft only until approved for implementation.
4. **Later, separately authorized behavior PRs**: implement controller-slot continuity and lifecycle coordination in small reversible slices, with keyboard/gamepad/touch and fixed-60-Hz regression evidence. No default PR may touch animation or artwork.

## Evidence and acceptance

- Required: `npm test`, `npm run lint`, `npm run validate:content`, `npm run simulate:league`, and the read-only strict Captain Studio audit with exact inherited identities. Gameplay changes additionally need the browser smoke suite and deterministic seed/input tape comparisons.
- **Verification coverage correction:** the scoped baseline workflow contains a separate `match-control-tests` job using a complete checkout; both the v3 governance PR and future characterization-only PRs must execute all Node tests (including newly added tests), lint, content validation and league simulation. The strict audit alone does **not** establish gameplay-test passage.
- The current CI is not a visual or human gameplay acceptance substitute. Verify substitution control, gamepad disconnect/reconnect, pause/quit/focus transitions, and existing score/ball/animation invariants before each applicable merge.
- A draft stacked PR may be pending or have CI blocked until this v3 bootstrap is merged. That must be reported honestly, never bypassed by disabling workflows or weakening the historical audit.
- A successful v3 verifier only means the proposed PR falls within its path and invariant scope. It does not authorize a Captain Studio pilot, asset acceptance, production release, or deployment.

## Reversibility

Revert dependent gameplay/characterization changes first. Restore exact historical protected artifacts, then revert v3 only after its dependent PRs are gone. Never force-push, delete old evidence, reset the Myth workspace, or mutate published artwork as a shortcut.

## Known governance tradeoff

v3 uses an explicit path allowlist rather than pre-pinning hashes of gameplay files that have not yet been authored. It does not itself prove the gameplay behavior of those files or attest to human review identity. Such review and owner authorization must remain independent GitHub approval gates. Any desire to add more paths must go through a new separately reviewed policy version.
