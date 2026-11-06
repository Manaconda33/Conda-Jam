# PR #17: Owner-authorized review, inherited artwork exception, and merge sequencing

**Decision recorded November 6, 2026, in the Conda Jam continuation conversation.**

The repository owner explicitly approved the following three named gates:

1. **Independent renderer/donor code review**: authorized and requested to be completed against the actual integrated branch. Reviewer findings require evidence and corrections; owner approval is not a fabricated external reviewer submission.
2. **Strict artist/provenance/backlog acceptance**: accepts the *known, already disclosed* inherited incomplete-art state as an owner-controlled exception for planning the integration. This does not rewrite raw provenance, deem missing sprites authored, or change the strict audit output.
3. **Explicit owner merge order and authorization**: authorizes a dependency-aware merge sequence after the remaining technical and visual blockers are addressed. This permission does not itself waive those other independent release gates.

## Exact accepted scope of inherited backlog

- Pinned combined-tree audit evidence: [full non-sparse run 42263232001](https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001), [authoritative report promotion 42267735163](https://github.com/Manaconda33/Conda-Jam/actions/runs/42267735163), and [independent report-content comparison 42268540872](https://github.com/Manaconda33/Conda-Jam/actions/runs/42268540872).
- **706 missing authored captain clips:** accepted as an *explicitly carried, incomplete production backlog*, not as finished/registered/certified art. Keep their actual identities, captain ownership, and release follow-up visible.
- **40 `prompt-not-verbatim` findings:** accepted as truthful historical provenance disclosures. `promptVerbatim:false` remains intact; no attempts to reconstruct missing original prompts and no fabricated original-prompt text.
- **0 introduced or removed inherited audit identities**, 0 current frame target shortfalls, and no waiver for newly introduced missing clips, rejected art, or other novel findings.
- The authoritative `ASSET_AUDIT_LATEST.json` continues to truthfully report **`ok=false`**. The report-only command succeeding and the owner accepting backlog exposure must never be presented as `ok=true` or full strict-art completion.
- Original authoring/asset files, registered atlas hashes, source lineage and rejected-candidate history remain preserved. Reuse of 7 original supporting donor families for 63 others is explicitly classified `derived-palette`, not new bespoke imagery.

This is a **risk-acceptance decision for the inherited backlog**, not an approval of any *newly discovered* art defects. Artist-quality defects identified in visual QA remain separate.

## Renderer/donor reviewer findings and evidence

The initial integrated code review verified these invariants against the actual source:

- Original `src/render/animation-sprites.js` continues the PR #6 depth/baseline compensation and invokes donor palette derivation only when a completed, accepted supporting donor library is selected. Captain rendering remains separate.
- A frozen explicit donor map assigns **70 supporting athletes** across **7 original families**, preserving all 7 authored owners. The other **63 assignments are deterministic**: exactly 9 new recipients per donor, distinct donor IDs for each team’s two supporters, 29 actions each.
- `athleteBallTrackSource` in `src/core/animation.js` prefers a recipient-specific track and otherwise uses its exact assigned donor (never unrelated Echo art). Marin’s corrected 9/8/9 `dribble-run` track remains gated to its Juniper assignment and the original PR #16 code hash remains unchanged.
- **One review finding fixed, not silently accepted:** `src/render/uniform-palette.js` previously keyed its LRU cache by source, profile and target colors but **not clip ID**, despite per-action `maskProfile.clips` overrides. Different clips sharing a source atlas could erroneously reuse the first action’s mask. Updated cache key includes the clip ID, preserving the 4-entry per-atlas LRU limit, and added a same-atlas `idle` vs `fall` regression test.
- Source/test Git blobs for the review fix: palette `2224596cd8ef91dc543dd8be954d97769a7e69c2`, added test `de4c9329ab5cc31871615a62c5517d8ff66861d6`. The original PR #7 source/test blobs remain in history and the source-hash guard was explicitly updated, not bypassed.
- [Focused real Node test run 42270007135](https://github.com/Manaconda33/Conda-Jam/actions/runs/42270007135) **PASS 9/9, 0 failures**, including both facings/29-clip donor selection, donor-balance/map invariants, original-asset isolation, mask transparency, fallback tracks and the new cache collision case. This is focused verification, **not a replacement for the complete 588-test integrated suite after the new regression was added**.
- Prior exact full-tree original **587/587** suite and exact **746/746** inherited audit findings were proven at source `8af10815` before this small code/test correction. A fresh full suite for the corrected head still needs to finish successfully; do not describe the older run as proof for the newer source.

**Independent code-review gate:** reviewer inspection and focused tests completed with a documented correction. Final branch promotion is conditional on the refreshed integrated CI/release criteria, not automatically declared by this report. This ChatGPT review does not impersonate a second GitHub reviewer account or fabricate human visual signoff.

## Owner-authorized merge order (conditional on remaining visual and CI holds)

Because PR #17 is **based directly on PR #6**, the non-duplicating planned sequence is:

1. **Review and resolve the separate visual holds**: Marin’s normal-dribble start/wrap ball-to-hand contact and Kraken’s `receive` atlas frame-style continuity. Obtain grounded pixel/normal-loader signoff. Preserve reviewed source art; do not rewrite art just to make tests green.
2. **Verify updated source checks**: re-run complete combined-branch CI including the new cache regression (and current authoritative reports), independent reviewer review, and branch-protection requirements. No unexamined source changes may intervene.
3. **Make PR #17 ready and merge into its existing PR #6 base branch** (`codex/captain-animation-completion`) only when steps 1–2 pass. This combines PR #7’s donor runtime and PR #16’s Marin correction *once*, with the current audit snapshots. Preserve original PR6 ancestry and inspect resulting branch tip.
4. **Make PR #6 ready and merge its now-integrated changes into `main`**, after verifying the updated PR6 main comparison and required CI/ruleset checks. Never merge PR #7 or PR #16 separately on top of that integrated state.
5. **Only after main contains and validates the combined changes**, close PR #7 and PR #16 as **superseded by the verified PR #17→#6→main path**, preserving their discussions/evidence. Keep PR #13 as a historical diagnostic until its evidence is no longer needed, then close without merging. Do not delete branches or force-push protected history.

This owner authorization is a standing merge approval **for that exact ordered, validated integration**, not an authorization to merge regardless of an unresolved visual finding, failing required CI, or unexpected merge conflicts. Any substantial scope or route change requires a new explicit owner decision. **No merge or deployment was carried out while recording this authorization.**

## Remaining explicit holds

- Marin Dusk normal-dribble start/wrap contact (independent pixel-level review pending).
- Kraken original receive atlas frames 0/1/3 versus frame 2 (source-art continuity mismatch; candidate correction and review pending).
- Refreshed complete integration CI after the reviewer-authored cache fix (the earlier package-manager timeout was unrelated; independently scoped 9/9 tests passed).
- Any actual branch protection/ruleset and merge-conflict blocker discovered when executing the authorized sequence.

**Current state: PR #17 draft and unmerged; PR #6, #7, #13 and #16 unchanged; no main merge, deployment, image generation, or protected Myth workspace action.**
