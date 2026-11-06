# PR #17 independent-review packet (review requested, not approved)

**Disposition: DRAFT / HOLD.** No image generation, original-branch mutations, production deployment, or merge. This packet prepares an independent technical and visual reviewer; it does **not** impersonate reviewer signoff.

## Review object and accepted engineering evidence

- PR under review: https://github.com/Manaconda33/Conda-Jam/pull/17 (target is the original PR #6 feature branch, **not** `main`)
- Known-good audited source SHA: `da88109a215a116dab1695782ada4b98a1e92a5c`; documentation-only evidence commits may follow it.
- PR #6 original head: `55a2ab104d6b108cc08132fddc01b32afb958e75`
- PR #7 donor-runtime input: `97119d54fd24c442c15192a798cae1e8a279eb1d`
- PR #16 committed Marin animation blob: `2b1413fce2582fd588f7df111bfb719e8605f046`; regression-test blob `9456ffdcdf73f397c15a520b48f75a6cc91ca569`
- Successful actual combined-tree CI: https://github.com/Manaconda33/Conda-Jam/actions/runs/42252942594, with 587/587 tests, lint, content validation, league simulation and build green.
- Regenerated audit, SHA-256 evidence, and 746 exact inherited finding signatures: [combined audit checkpoint](PR17_COMBINED_AUDIT_EVIDENCE_2026-11-06.md). Strict art status remains **incomplete**.

## Independent reviewer worklist

1. **Merged runtime correctness:** examine `src/render/animation-sprites.js` for preservation of PR #6 baseline/depth behavior along with PR #7's per-action donor mask selection. Confirm the custom reconciled renderer hunk does not regress captain sprites or camera clipping. Compare tests against actual game paths rather than simulated-only helpers.
2. **Uniform recolor correctness:** review `src/render/uniform-palette.js` and the seven profiles in `src/content/supporting-uniform-profiles.js`. Inspect skin/hair/shoe/transparent pixels and shorts/jersey masks across both facings and light/dark courts. Specifically assess whether the palette cache key, presently keyed by source ID, mask-profile ID, and target colors, needs **clip ID and/or frame identity** to prevent cross-clip reuse when a single source atlas has clip-specific mask overrides. This is a conditional review risk, **not a confirmed live defect**.
3. **Donor identity:** verify seven original supporting libraries remain untouched, every one of 63 shared recipients uses the pinned donor consistently across 29 actions, each team has two distinct supporters, and the deterministic mapping is immutable. See `src/content/supporting-donor-map.js`, `src/content/supporting-donor-assignment.js`, and `tests/supporting-donor-assignment.test.js`.
4. **Ball source and interpolation:** inspect the source-to-recipient ball track selection and Marin's per-action Juniper calibration in `src/core/animation.js`. Confirm the accepted 9/8/9 turbo path is unchanged, original Echo behavior remains gated correctly, and no other donor leaks into athlete-specific tracks. See `tests/animation.test.js`.
5. **Native visual acceptance:** independently inspect Marin normal-dribble start and loop-wrap steps 1–2 and 31–32, both facings at 100% and 120% zoom. Retain the proven floor bounce and turbo 9/8/9 mechanics. Recheck Kraken's original `receive` frames 0, 1 and 3 against frame 2, then run original pass/catch transition scenes. Existing [visual hold](MARIN_CONTACT_VISUAL_QA_HOLD_2026-11-05.md) and [source-atlas root-cause diagnosis](KRAKEN_RECEIVE_SOURCE_ART_DIAGNOSIS_2026-11-05.md) are **not** accepted fixes.
6. **Source/provenance:** confirm the inherited 706 missing clips, 40 disclosed non-verbatim prompt findings and zero frame shortfalls from fresh combined-tree audit. Neither count equality nor 746-identity equality waives the backlog or proves production-ready artwork.
7. **Merge topology:** PR #17 targets PR #6, while PR #7 and PR #16 are separately open. Reviewer must explicitly reconcile source/dependency ordering and avoid double-applying donor/Marin edits. Existing draft diagnostic PR #13 must not be promoted merely because its diagnostic completed.

## True non-sparse checkout: reproducible outstanding blocker

Historical [repository-object diagnosis](MARIN_COMBINED_TEST_PROVENANCE_TRIAGE_2026-11-05.md) records [Actions run 42108460440](https://github.com/Manaconda33/Conda-Jam/actions/runs/42108460440): complete `main` checkout succeeded, but integration of pinned PR #6 failed during a promisor-object fetch. One reported missing object was `14b5d774b41ff4a4602e52347bc2d7d10a155617` (`upload-pack: not our ref`); another reported object was `7fb06e8242ff4cbf1d8cca4d4bab390188eb021c`.

**Rechecked against GitHub object API on 2026-11-06:** blob `14b5d774b41ff4a4602e52347bc2d7d10a155617` still returns 404, while blob `7fb06e8242ff4cbf1d8cca4d4bab390188eb021c` is currently readable. The primary non-sparse blocker is therefore **not proven resolved**. Do not fabricate replacement blobs, rewrite original branches, or call the hash-verified 120-fixture scoped checkout a complete non-sparse checkout. Investigate reachability and repository-object integrity through authorized GitHub maintenance before waiving this gate. A fresh full-tree diagnostic must preserve exact source commits and store reproducible Git and Actions logs.

## Release decision matrix

| Gate | Status |
| --- | --- |
| Actual combined-branch, hash-pinned runtime and tests | PASS as of `da88109` |
| 587 scoped tests; lint/content/league/build | PASS as of `da88109` |
| Full exact inherited audit identity and counts | PASS, not art acceptance |
| Complete non-sparse historical Git checkout | BLOCKED by unresolved historic blob |
| Regenerate *authoritative* combined tracked `ASSET_AUDIT_LATEST.json/md` and `ASSET_STATUS.md` | PENDING; CI artifact and versioned evidence exist, but historical official files remain unchanged |
| Marin hand/ball normal-dribble visual acceptance | HOLD |
| Kraken receive frame style-consistency correction / acceptance | HOLD |
| Independent renderer/donor code review | PENDING |
| Strict artist/provenance/backlog acceptance | PENDING |
| Explicit owner merge order + authorization | PENDING |

**Recommendation:** do not merge #17 now. Use the saved current CI artifact as the evidence foundation for code review and the later tracked audit-report regeneration. Keep original PRs #6, #7, #13, #16, `main`, and the unavailable Myth production workspace unchanged.
