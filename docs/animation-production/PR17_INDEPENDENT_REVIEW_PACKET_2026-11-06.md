# PR #17 independent-review packet (review requested, not approved)

**Disposition: DRAFT / HOLD.** No image generation, original-branch mutations, production deployment, or merge. This packet prepares an independent technical and visual reviewer; it does **not** impersonate reviewer signoff.

## Review object and accepted engineering evidence

- PR under review: https://github.com/Manaconda33/Conda-Jam/pull/17 (target is the original PR #6 feature branch, **not** `main`)
- Known-good full non-sparse integration HEAD: `8af10815ce9cb9d03040c788e9fd9c0c11c59f6b` ([full-tree 587/587 + audit pass](https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001)); original first identity-gate checkpoint was `da88109`. Subsequent documentation-only commits may follow.
- PR #6 original head: `55a2ab104d6b108cc08132fddc01b32afb958e75`
- PR #7 donor-runtime input: `97119d54fd24c442c15192a798cae1e8a279eb1d`
- PR #16 committed Marin animation blob: `2b1413fce2582fd588f7df111bfb719e8605f046`; regression-test blob `9456ffdcdf73f397c15a520b48f75a6cc91ca569`
- Successful actual combined-tree CI: https://github.com/Manaconda33/Conda-Jam/actions/runs/42252942594, with 587/587 tests, lint, content validation, league simulation and build green.
- Regenerated audit, SHA-256 evidence, and 746 exact inherited finding signatures: [combined audit checkpoint](PR17_COMBINED_AUDIT_EVIDENCE_2026-11-06.md). The three authoritative tracked reports were committed at [5bb10dce](https://github.com/Manaconda33/Conda-Jam/commit/5bb10dceedb9a867c36f400055dd4663d7f42fd5) and [independently matched to the exact full-tree source artifact](https://github.com/Manaconda33/Conda-Jam/actions/runs/42268540872). Strict art status remains **incomplete**.

## Independent reviewer worklist

1. **Merged runtime correctness:** examine `src/render/animation-sprites.js` for preservation of PR #6 baseline/depth behavior along with PR #7's per-action donor mask selection. Confirm the custom reconciled renderer hunk does not regress captain sprites or camera clipping. Compare tests against actual game paths rather than simulated-only helpers.
2. **Uniform recolor correctness:** review `src/render/uniform-palette.js` and the seven profiles in `src/content/supporting-uniform-profiles.js`. Inspect skin/hair/shoe/transparent pixels and shorts/jersey masks across both facings and light/dark courts. Specifically assess whether the palette cache key, presently keyed by source ID, mask-profile ID, and target colors, needs **clip ID and/or frame identity** to prevent cross-clip reuse when a single source atlas has clip-specific mask overrides. This is a conditional review risk, **not a confirmed live defect**.
3. **Donor identity:** verify seven original supporting libraries remain untouched, every one of 63 shared recipients uses the pinned donor consistently across 29 actions, each team has two distinct supporters, and the deterministic mapping is immutable. See `src/content/supporting-donor-map.js`, `src/content/supporting-donor-assignment.js`, and `tests/supporting-donor-assignment.test.js`.
4. **Ball source and interpolation:** inspect the source-to-recipient ball track selection and Marin's per-action Juniper calibration in `src/core/animation.js`. Confirm the accepted 9/8/9 turbo path is unchanged, original Echo behavior remains gated correctly, and no other donor leaks into athlete-specific tracks. See `tests/animation.test.js`.
5. **Native visual acceptance:** independently inspect Marin normal-dribble start and loop-wrap steps 1–2 and 31–32, both facings at 100% and 120% zoom. Retain the proven floor bounce and turbo 9/8/9 mechanics. Recheck Kraken's original `receive` frames 0, 1 and 3 against frame 2, then run original pass/catch transition scenes. Existing [visual hold](MARIN_CONTACT_VISUAL_QA_HOLD_2026-11-05.md) and [source-atlas root-cause diagnosis](KRAKEN_RECEIVE_SOURCE_ART_DIAGNOSIS_2026-11-05.md) are **not** accepted fixes.
6. **Source/provenance:** confirm the inherited 706 missing clips, 40 disclosed non-verbatim prompt findings and zero frame shortfalls from fresh combined-tree audit. Neither count equality nor 746-identity equality waives the backlog or proves production-ready artwork.
7. **Merge topology:** PR #17 targets PR #6, while PR #7 and PR #16 are separately open. Reviewer must explicitly reconcile source/dependency ordering and avoid double-applying donor/Marin edits. Existing draft diagnostic PR #13 must not be promoted merely because its diagnostic completed.

## Historical PR #6 merge replay: separate Git-object maintenance issue

Historical [repository-object diagnosis](MARIN_COMBINED_TEST_PROVENANCE_TRIAGE_2026-11-05.md) records [Actions run 42108460440](https://github.com/Manaconda33/Conda-Jam/actions/runs/42108460440): complete `main` checkout succeeded, but integration of pinned PR #6 failed during a promisor-object fetch. One reported missing object was `14b5d774b41ff4a4602e52347bc2d7d10a155617` (`upload-pack: not our ref`); another reported object was `7fb06e8242ff4cbf1d8cca4d4bab390188eb021c`.

**Updated resolution for the assembled branch:** a [separate reproducible full non-sparse checkout run](https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001) directly materialized the precise assembled PR #17 head, with **55,024 tracked paths, zero missing**; ran **587/587 original tests**, regenerated the asset audit (746 expected unchanged findings) and passed identity validation. [Permanent review proof](PR17_NONSparse_INTEGRATION_CHECKOUT_2026-11-06.md). The historical `14b5d774` object still returns 404, but it has **no matching blob-tree entry in the pinned PR #6 or assembled PR #17 tip trees**. Preserve the historical failed replay record and do not synthesize a replacement; this no longer prevents verifying the assembled PR #17 directly. The recovered checkout does **not** waive strict artwork/visual acceptance. The tracked report reconciliation is now documented separately and passed.

## Release decision matrix

| Gate | Status |
| --- | --- |
| Actual combined-branch, hash-pinned runtime and tests | PASS as of `da88109` |
| 587 scoped tests; lint/content/league/build | PASS as of `da88109` |
| Full exact inherited audit identity and counts | PASS, not art acceptance |
| Exact assembled PR #17 head, complete non-sparse checkout | **PASS:** 55,024 tracked paths present, 587/587 tests, exact 746/746 audit identities |
| Historical PR #6 partial-clone merge replay and unavailable Git object | Still documented (404), no direct tree reference; separate legacy maintenance issue |
| Regenerate authoritative combined tracked `ASSET_AUDIT_LATEST.json/md` and `ASSET_STATUS.md` | **PASS:** committed [5bb10dce](https://github.com/Manaconda33/Conda-Jam/commit/5bb10dceedb9a867c36f400055dd4663d7f42fd5); [read-only audit proof 42268540872](https://github.com/Manaconda33/Conda-Jam/actions/runs/42268540872) confirms full JSON + Markdown + archival status; `ok=false` |
| Marin hand/ball normal-dribble visual acceptance | HOLD |
| Kraken receive frame style-consistency correction / acceptance | HOLD |
| Independent renderer/donor code review | **Owner authorized and reviewer inspection performed:** donor/runtime invariants verified; one per-clip cache collision corrected, focused **9/9 PASS**; refreshed complete CI still pending |
| Strict artist/provenance/backlog acceptance | **Owner approved inherited backlog exception:** 706 still missing / 40 truthful non-verbatim; strict `ok=false` retained; separate Marin/Kraken visual HOLDs not waived |
| Explicit owner merge order + authorization | **Owner approved conditional sequence:** PR #17 into PR #6, then combined PR #6 into `main` after visual/CI gates; no merge performed |

**Current disposition:** owner approval of code review, inherited art/backlog exception, and merge order is documented in [PR17_OWNER_ACCEPTANCE_AND_MERGE_ORDER_2026-11-06.md](PR17_OWNER_ACCEPTANCE_AND_MERGE_ORDER_2026-11-06.md). Reviewer found and fixed a clip-specific palette cache issue, with 9/9 focused tests passing; complete post-fix CI and both independent visual holds remain open. Do not merge #17 or change `main` until those conditions are satisfied.

## 2026-11-06: checked-in report reconciliation and downstream CI infrastructure note

- **Authoritative reports refreshed:** [publication run 42267735163](https://github.com/Manaconda33/Conda-Jam/actions/runs/42267735163) committed exactly three active snapshot/status files. The original October 29 status history remains byte-for-byte below a new November 6 integration heading. Current strict audit stays incomplete (706 inherited missing captain clips; 40 honestly disclosed non-verbatim prompts).
- **Independent audit proof GREEN:** [read-only run 42268540872](https://github.com/Manaconda33/Conda-Jam/actions/runs/42268540872) verified full checked-in JSON content, Markdown consistency, and current status/history against the [original full non-sparse checkout evidence](https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001). Full content normalized SHA-256 digest: `e319e858b44e0b5eff17594dcf0beb6776f1400c7d0b0c9826a5c8faf8eb0d79`.
- **Permanent drift guard:** `tools/check-pr17-authoritative-snapshots.mjs` is wired into `.github/workflows/conda-jam-combined-integration-ci.yml`. It rechecks every JSON field other than the generation timestamp plus the Markdown and preserved status records, so replacement of one inherited finding with another cannot silently pass.
- **Infrastructure limitation:** fresh combined CI run [42267985242](https://github.com/Manaconda33/Conda-Jam/actions/runs/42267985242) could not reach tests because the runner timed out in `sudo apt-get update -qq` while installing ImageMagick. It is **not a failed asset/test assertion**; the last complete source validation is [full-tree run 42263232001](https://github.com/Manaconda33/Conda-Jam/actions/runs/42263232001), and snapshot comparison passed without needing the failing package manager. Rerun ordinary CI once the runner dependency install works, without relaxing the original game/art regression tests.
- **New owner authorization is scoped:** owner approved the inherited 706/40 backlog exception and dependency-aware merge route after this earlier note; original audit remains strict `ok=false`, and Marin/Kraken visual HOLDs continue. See [the dated owner decision](PR17_OWNER_ACCEPTANCE_AND_MERGE_ORDER_2026-11-06.md).

## Renderer/donor code review checkpoint: clip-mask cache isolation

Source review found that the palette LRU key lacked the action clip ID even though uniform profiles can define clip-specific `fall` masks. That could apply an `idle` recolor canvas to a later `fall` pose when both use a shared atlas. The [reviewer-authored, isolated fix](https://github.com/Manaconda33/Conda-Jam/commit/5fa824637e2725d3b35d259e4f2b7b54c6da3ad6) adds the clip to the key without changing cached original pixels or the LRU size. The [regression test](https://github.com/Manaconda33/Conda-Jam/commit/35d7fd3dcdda5b2963ba7219cb849f0884066c9e) exercises `idle` then `fall` against the same source image and profile, requiring separate derived canvases and stable return-cache behavior. The reviewed code/test hashes were explicitly updated in the CI source-integrity guard; original PR #7 hash provenance remains recorded.

[Focused Node 9/9 test run 42270007135](https://github.com/Manaconda33/Conda-Jam/actions/runs/42270007135) passed all renderer/donor tests, including donor-mapping determinism, frame selection/mirroring, original atlas preservation and exact assigned-donor ball tracks. This is a real code-review artifact, not a third-party GitHub approval or an independent visual-art certificate. Post-change full integrated CI is a separate remaining condition.
