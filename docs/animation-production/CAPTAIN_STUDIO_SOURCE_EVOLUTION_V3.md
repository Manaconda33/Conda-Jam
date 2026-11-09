# Captain Studio source-evolution verification policy v3

**Draft for independent review | Proposed November 9, 2026 | Not merged or activated**

## Purpose

Open a narrowly scoped, reviewable path for Conda Jam match-control **baseline characterization**. Future controller/session coordination implementation must use a separate reviewed policy without weakening the accepted Captain Studio source, artwork, provenance, or activation gates. This policy governs **CI verification eligibility only**. It is not owner approval to merge, deploy, generate artwork, accept animation packages, promote refs, or recover the separate Myth/Codex workspace.

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

## Explicit characterization-only verification scope

After this policy has independently passed, received owner authorization and merged, later v3 PRs may change **only these three** characterization artifacts:

1. `docs/architecture/BASELINE_CHARACTERIZATION.md`
2. `docs/architecture/MATCH_CONTROL_TRANSITIONS.md`
3. `tests/match-control-characterization.test.js`

This scope intentionally **excludes** `src/main.js`, `src/core/match-control.js`, `tests/match-control.test.js`, `tools/e2e_smoke.py` and all other runtime, test-harness and gameplay paths. Such changes require a **separately reviewed v4 policy**, a new owner decision, and browser E2E validation. Permitting the three characterization artifacts does not authorize a merge by itself.

## Repository-wide PR enforcement and external trust boundary

- The v3 workflow has no `pull_request.paths` filter. An always-running, lightweight `scope-check` job checks the full trusted PR-base-to-HEAD Git diff, including PRs changing only disallowed paths such as `package.json` or `.github/workflows/pages.yml`.
- Both the expensive strict art-audit job and the full Node/league job depend on the scope check passing. The scope job uses complete Git ancestry (`fetch-depth: 0`) and partial clone; it fails closed when v3 is missing, a file is deleted, or the PR scope is not allowed. Manual read-only dispatch has no PR-base context and does not count as a PR scope approval.
- **Crucial limit:** the workflow lives in the PR's own Git tree, so an attacker able to change, omit, or bypass the workflow can neutralize it. Current repository settings were independently checked on November 9, 2026: `main` has **no enabled branch protection, no required checks and no rulesets**. Passing this workflow is not an enforced merge gate until those settings are installed.
- **Required outside this PR, before merge:** a repository administrator must enable protection/ruleset on `main`, require the stable status context **`Captain Studio scope (all PRs)`** and appropriate independent review approval, block direct unreviewed pushes and bypasses, and require review freshness after new commits. Consider also requiring the full verify/art-audit statuses for this governance PR. Validate that a PR changing only `package.json` cannot be merged and that verifier edits cannot enter `main` without review.
- A protected GitHub branch and required reviews are the **external attestation boundary** for v3 verifier integrity; v3 cannot byte-pin its own code to a future, not-yet-approved commit. Manual `workflow_dispatch` runs only inspect a branch and are not a substitute for protected PR checks.
- An all-PR fail-closed scope rule will intentionally block unrelated source or workflow changes until a new independently approved policy allows them. This repository-wide consequence must be accepted by the owner, not silently imposed. No code-only revision can configure branch settings.

## Architectural sequence and PR gates

1. **V3 policy PR**: verifier, workflow and tests only. Independent review and separate owner merge decision. `main` stays untouched until then.
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

V3 uses an exact three-path characterization allowlist and an always-running PR scope check. It does **not** make itself immutable: the trusted enforcement is the separate protected-branch/ruleset configuration and mandatory independent review. Those are presently **not configured**, so this draft remains **REQUEST CHANGES / NO MERGE** until verified. Future runtime behavior changes and browser smoke changes require an independently reviewed v4 policy, mandatory E2E evidence, and a separate owner decision.
