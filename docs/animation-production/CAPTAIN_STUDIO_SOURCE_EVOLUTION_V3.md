# Captain Studio source-evolution verification policy v3

**Draft, revised after independent review | November 9, 2026 | Not merged or activated**

## Purpose

Open a narrowly scoped, reviewable path for Conda Jam match-control **baseline characterization**. Future controller/session coordination implementation must use a separate reviewed policy without weakening the accepted Captain Studio source, artwork, provenance, or activation gates. This policy governs **CI verification eligibility only**. It is not owner approval to merge, deploy, generate artwork, accept animation packages, promote refs, or recover the separate Myth/Codex workspace.

## Prerequisite and exact bootstrap

- `main` at review base: `7d96e1bbb5e966a48f7748e87127f1008b1c25e8`, after separately merged PRs #22 and #24.
- Propose this policy in its **own five-file PR** based on that exact SHA: `.github/workflows/captain-studio-baseline-verify.yml`, `tools/captain-studio/verify-baseline.mjs`, `tools/captain-studio/source-evolution-contract-v3.mjs`, `tests/captain-studio-source-evolution-v3.test.js`, and this document.
- A separate LLM architecture review has been performed and its CI-trigger correction adopted. Owner approval remains the manual merge decision; no GitHub-required human reviewer, CODEOWNERS or protection ruleset is mandated for this single-owner repository. Do not mix characterization or gameplay edits into the policy bootstrap.
- PR-base validation uses the trusted `github.event.pull_request.base.sha`, while cumulative validation examines the complete Git diff from accepted PR20 merge to HEAD, not a worker-declared subset.

## Protections that remain intact

- The original PR20 merge `2654be8c094900200dd03910a99552b6cf1c2c07`, its five immutable snapshot files, the 17 source/blob pins, the historical source commit `895ff9c598689ce58980b504876b3b36c027f6a5` and frozen v1/v2 verifier records remain protected.
- The exact 746 inherited findings (706 missing directional assignments, 40 historical non-verbatim prompt findings) must remain identical; the strict artwork audit still has `ok=false`. These are historical gaps, not new regressions.
- All existing Captain Studio provenance, digest, independent review, rejection, batch-staging, compare-and-swap promotion, resource guards, and no-new-artwork/pilot/production gates remain untouched.
- No edits to `src/core/animation.js`, runtime animation manifest, ball tracks, production atlas files, package validator/integrator/exporter, `package.json`, deployment workflows, or the Myth/Codex recovery workspace.
- Current v2 pinned source variants for PRs #21/#22 stay exact Git blob hashes. Any change to protected or unrelated paths requires a distinct later policy version and review.

## Explicit characterization-only verification scope

After this policy passes all CI checks, receives owner authorization and merges, later v3 PRs may change **only these three** characterization artifacts:

1. `docs/architecture/BASELINE_CHARACTERIZATION.md`
2. `docs/architecture/MATCH_CONTROL_TRANSITIONS.md`
3. `tests/match-control-characterization.test.js`

This scope intentionally **excludes** `src/main.js`, `src/core/match-control.js`, `tests/match-control.test.js`, `tools/e2e_smoke.py` and all other runtime, test-harness and gameplay paths. Such changes require a **separately reviewed v4 policy**, a new owner decision, and browser E2E validation. Permitting the three characterization artifacts does not authorize a merge by itself.

## Repository-wide PR verification and accepted single-owner trust boundary

- The v3 workflow uses an **unfiltered** `pull_request` trigger. A lightweight `scope-check` job reads the complete trusted PR-base-to-HEAD Git diff, including PRs changing only otherwise disallowed paths such as `package.json` or `.github/workflows/pages.yml`.
- Both the strict historical artwork-audit job and the full Node/lint/content/league job depend on scope-check success. The scope job uses full Git ancestry (`fetch-depth: 0`) and a partial clone. Manual read-only `workflow_dispatch` has no PR-base context and does not substitute for the PR checks.
- Frozen v1/v2 unit tests historically check for literal workflow path tokens. The v3 workflow retains those tokens as **non-executable documentation comments only**; it does not restore any path filter. The v3 tests additionally assert that no `pull_request.paths` or `paths-ignore` filter exists and reject disallowed-only PR diffs.
- **Single-owner risk acceptance (November 9, 2026):** The repository has no enforced `main` branch protection, required status checks or repository rulesets. The owner explicitly chose to **skip mandatory human reviewers, CODEOWNERS and elaborate protection settings**. This is an accepted operational risk, **not** a claim of technical enforcement. A direct push, skipped workflow, or unreviewed merge can bypass policy. The owner undertakes to inspect PR checks and explicitly approve merges.
- A v3 verifier cannot independently attest to or freeze its own future source bytes. Review is procedural rather than GitHub-enforced. Before an unrelated or runtime PR, obtain separate authorization for a new reviewed source-evolution policy. In particular, the characterization-only v3 allowlist **does not** authorize gameplay behavior changes.
- This fail-closed all-PR scope check is intentionally broad: it will reject unrelated PRs within CI until a separately reviewed policy version admits them, even though a sole repo owner can technically override that process. Do not mistake a green scope check for approval to deploy or modify historical artwork.

## Architectural sequence and PR gates

1. **V3 policy PR**: verifier, workflow and tests only. Re-review the final CI after the path-filter correction and obtain separate owner merge authorization. `main` stays untouched until then.
2. **Baseline-characterization PR**: documentation and deterministic tests only, stacked behind v3 until v3 is merged and approved. Record the current behavior of substitution, pause, and input routing without modifying runtime code. A suspected control defect is not a proven runtime bug until reproduced.
3. **Draft transition contract**: document a dependency-free pure resolver for the session/control seam. Preserve `match.phase`/`match.pause` as simulation authority; controller bindings are to stable court slots, not permanently to athlete IDs. Draft only until approved for implementation.
4. **Later, separately authorized v4 policy and behavior PRs**: obtain a fresh reviewed eligibility policy first, then implement controller-slot continuity and lifecycle coordination in small reversible slices, with mandatory browser E2E, keyboard/gamepad/touch and fixed-60-Hz regression evidence. V3 does not permit runtime changes.

## Evidence and acceptance

- Required: `npm test`, `npm run lint`, `npm run validate:content`, `npm run simulate:league`, and the read-only strict Captain Studio audit with exact inherited identities. Gameplay changes additionally need the browser smoke suite and deterministic seed/input tape comparisons.
- **Verification coverage correction:** the scoped baseline workflow contains a separate `match-control-tests` job using a complete checkout; both the v3 governance PR and future characterization-only PRs must execute all Node tests (including newly added tests), lint, content validation and league simulation. The strict audit alone does **not** establish gameplay-test passage.
- The current CI is not a visual or human gameplay acceptance substitute. Verify substitution control, gamepad disconnect/reconnect, pause/quit/focus transitions, and existing score/ball/animation invariants before each applicable merge.
- A draft stacked PR may be pending or have CI blocked until this v3 bootstrap is merged. That must be reported honestly, never bypassed by disabling workflows or weakening the historical audit.
- A successful v3 verifier only means the proposed PR falls within its path and invariant scope. It does not authorize a Captain Studio pilot, asset acceptance, production release, or deployment.

## Reversibility

Revert dependent gameplay/characterization changes first. Restore exact historical protected artifacts, then revert v3 only after its dependent PRs are gone. Never force-push, delete old evidence, reset the Myth workspace, or mutate published artwork as a shortcut.

## Known governance tradeoff

V3 uses an exact three-path characterization allowlist and an always-running PR scope check. There is **no GitHub-enforced merge restriction** in this single-owner repository; the owner consciously accepts the possibility of bypassing checks. If all CI checks pass after the unfiltered PR trigger correction, the technical condition from the independent review is satisfied. A separate owner merge decision is still required. Future runtime and browser test-harness changes require a distinct reviewed policy; browser E2E gating will be designed when gameplay behavior work is actually authorized.
