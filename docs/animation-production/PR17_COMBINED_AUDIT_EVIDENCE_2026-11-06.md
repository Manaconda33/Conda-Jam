# PR #17 combined-tree audit evidence (review only)

**Status: audit regenerated and exact findings verified. NOT strict art acceptance. NOT merge authorization.**

- Source branch: `integration/pr6-pr7-marin-review-20261106`
- Evaluated commit: `da88109a215a116dab1695782ada4b98a1e92a5c`
- Source relationship: based on pinned original PR #6 head `55a2ab104d6b108cc08132fddc01b32afb958e75`, incorporating reviewed PR #7 integration content and committed Marin correction from PR #16
- Successful Actions run: https://github.com/Manaconda33/Conda-Jam/actions/runs/42252942594
- Downloadable full CI audit and logs (7-day retention): https://github.com/Manaconda33/Conda-Jam/actions/runs/42252942594/artifacts/13521576993
- Regenerated `ci-integration/audit.json` created at `2026-11-06T16:31:34.584Z`
- Regenerated `ci-integration/audit.md` created in the same run
- Exact expected-finding baseline: `docs/animation-production/PR17_AUDIT_EXPECTED_SIGNATURES.json` (pinned original PR #6 / #7 blob sources)
- Audit identity result: `ci-integration/audit-identity-summary.json`
- Historical fixture result: `ci-diagnostic/verified-fixtures.json` (120 unique pinned, SHA-verified PR #6 files)

## Generated combined-tree results

| Measure | Actual combined branch |
| --- | ---: |
| Athletes | 105 |
| Required animation clips / athlete | 29 |
| Inspected registered clips | 2,397 |
| Unique source libraries | 42 |
| Unique source atlases | 570 |
| Unique decoded source drawings | 5,489 |
| Original-authored clip classifications | 570 |
| Derived-palette clip classifications | 1,827 |
| Original supporting library assignments | 7 |
| Derived supporting library assignments | 63 |
| Missing clip assignments | 706 |
| Non-verbatim source-prompt findings | 40 |
| Frame target shortfalls | 0 |
| Exact baseline findings matched | 746 / 746 |
| Introduced / removed / duplicate findings | 0 / 0 / 0 |
| Strict art audit `ok` | **false** |

**Artifact integrity recorded from downloaded Actions evidence:**

- `ci-integration/audit.json`: 7,151,591 bytes; SHA-256 `593ac423d5267766a32ddbd3e04f12b9f4ffb3b281ea779222308c34af47a677`
- `ci-integration/audit.md`: 951 bytes; SHA-256 `adaba2282ec1c8b7e75e28beeca2cb9c63f0c853f6fe0ead75781561388b014e`
- `ci-integration/audit-identity-summary.json`: 482 bytes; SHA-256 `b456e8a37d0d209625c8b5af3130fd65ccd45fdf4ae461af5ed626d950e9685d`

All 587 tests, lint, content validation, league simulation, production build, report-only asset audit, and exact identity guard passed in the same CI run.

## Provenance and acceptance boundaries

This is a **combined-branch audit snapshot**, not a rewrite of the historical `docs/animation-production/ASSET_AUDIT_LATEST.{json,md}` or `ASSET_STATUS.md` from the original PR #6 source. Those historical files are stale **for this integration tree** and must not be represented as current. Replacing the authoritative tracked reports requires deliberate review of the complete generated JSON and corresponding human acceptance status; this evidence pointer is a separate, immutable run-level checkpoint.

The 706 missing clips are inherited outstanding captain artwork, not 706 new regressions. The 40 provenance warnings disclose non-verbatim historical prompts and must remain visible; no verbatim prompt recovery is implied. The pixel-level audit does **not** prove anatomy, visual continuity, garment-mask precision, hand/ball contact, or native-loader correctness.

Remaining HOLD: unresolved Marin normal-dribble hand-contact frames; Kraken receive source-art continuity; independent renderer/donor integration review; strict art/backlog decision; genuinely non-sparse full checkout proof; and explicit owner authorization for any merge. Original PR #6, #7, #13, #16 and protected Myth work are not modified by this document.
