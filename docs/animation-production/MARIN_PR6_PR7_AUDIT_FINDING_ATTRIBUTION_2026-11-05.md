# Marin / Juniper: PR #6 + PR #7 source-art audit attribution

**Review-only, 2026-11-05. Evidence-backed classification, not permission to merge or to waive any missing source-art/provenance warning.**

## Source and reproducible validation

[GitHub Actions source-audit run 42138506054](https://github.com/Manaconda33/Conda-Jam/actions/runs/42138506054) executed **three independently pinned, read-only pixel audits** using `node tools/audit-animation-assets.mjs --report-only` with ImageMagick against immutable branches, without merging them or editing approved production status:

- **main**: `7e700c0eb392800794167007e076c51ac8357a77`
- **PR #6 alone**: `55a2ab104d6b108cc08132fddc01b32afb958e75`
- **PR #7 alone**: `97119d54fd24c442c15192a798cae1e8a279eb1d`

All three audit **commands completed successfully**, but all three audit documents report `ok=false`. These are diagnosis-only executions. Workflow: [`marin-audit-baseline-attribution.yml`](https://github.com/Manaconda33/Conda-Jam/blob/maintenance/pr6-pr7-reconciliation-probe/.github/workflows/marin-audit-baseline-attribution.yml).

The combined candidate values are independently sourced from the previous [pinned PR6 + PR7 source/test audit run 42110543688](https://github.com/Manaconda33/Conda-Jam/actions/runs/42110543688), where the exact PR #16 Marin animation blob `2b1413fce2582fd588f7df111bfb719e8605f046` and strict test blob `9456ffdcdf73f397c15a520b48f75a6cc91ca569` were applied **only in the isolated runner**. Its complete generated `audit.json` is archived in [artifact 13453931269](https://github.com/Manaconda33/Conda-Jam/actions/runs/42110543688/artifacts/13453931269). The independently run three original-branch audits include complete per-error signatures (`code|athlete|direction|clip`) in their artifacts.

| Audit metric | Pinned main | PR #6 only | PR #7 only | Combined PR6+PR7, with PR16 candidate |
| --- | ---: | ---: | ---: | ---: |
| Canonical athletes | 105 | 105 | 105 | 105 |
| Inspected clips | 2,325 | 2,397 | 2,325 | 2,397 |
| Missing clips | **778** | **706** | **778** | **706** |
| Prompt-not-verbatim entries | **4** | **4** | **40** | **40** |
| All audit findings | **782** | **710** | **818** | **746** |
| Unique source atlases | 498 | 570 | 498 | 570 |
| Unique source drawings | 4,736 | 5,489 | 4,736 | 5,489 |
| Frame-target shortfalls | 0 | 0 | 0 | 0 |
| Strict audit `ok` | false | false | false | false |

## Exact source-level delta, matched by each error identity

**PR #6: removes exactly 72 `missing-clip` entries; adds zero errors.** The resolved clips are **24 for Kraken, 24 for Krios and 24 for Leo**. This is corroborated by the 72 additional inspected clips, 72 additional source atlases and 753 additional decoded drawings. No pre-existing prompt warning is removed or changed.

**PR #7: adds exactly 36 `prompt-not-verbatim` audit entries; removes zero errors.** PR7's shared-donor mapping introduces 18 derived-palette recipients of two source donors with two already-disclosed prompt flags each. PR7 does **not** increase the number of missing clips or change the original source-atlas/drawing totals in its standalone audit.

**Combined PR6+PR7: exactly the union of those two observed deltas.** Relative to pinned main, the combined audit has **72 fewer missing clips**, **36 more derived-palette prompt entries**, and no other added or removed error identities. Relative to PR6-only, the exact 36 new errors are all `prompt-not-verbatim`. Relative to PR7-only, the exact 72 resolved errors are all `missing-clip`. The saved Marin 9/8/9 source correction is **not implicated in any new missing-clip audit finding**.

## Source-provenance root causes, without relaxing the audit

The **four original** prompt warning records were already present on pinned main and PR6:

| Source library | Original flagged clips | Newly reported derived recipients on PR #7 |
| --- | --- | ---: |
| **Reed Ashcroft** | `layup` and `fall` | 9 recipients × 2 clips = 18 entries |
| **Juniper Vale** | `layup` and `fall` | 9 recipients × 2 clips = 18 entries |
| **Total** | **4 original source-clip flags** | **36 derived-palette entries** |

The PR7 recipient warnings trace directly to these donors' original clips. Marin Dusk is one of Juniper's nine derived recipients: her two flagged records are `layup` and `fall`. **Marin has zero missing clips; Juniper has zero missing clips.** Echo Catwalk and Piper Quickstep have zero audit errors in the combined source-art report.

The unchanged audit implementation explicitly emits `prompt-not-verbatim` when `clip.provenance?.promptVerbatim === false`. It reuses the donor's provenance for shared-source/palette recipients and labels the result `derived-palette`. Therefore, the 36 derivative warning entries are **an amplification of two donors' four flagged original source clips**, not evidence that 36 new unrelated source images disappeared. They remain legitimate reported warnings and **must not be suppressed or marked verbatim without verifying the underlying prompt provenance**.

**Recommended source-provenance action:** Verify the original generation/prompt/accepted asset record for **Reed Ashcroft layup and fall**, then **Juniper Vale layup and fall**. If exact verbatim prompts can be recovered from the preserved generation history, document and hash-match that provenance before proposing a correction. If not recoverable, preserve the explicit non-verbatim disclosure and determine the narrow acceptance policy through independent review. Do not fabricate prompt text, overwrite provenance flags, or waive the recorded findings merely to force an audit PASS.

The 706 unresolved `missing-clip` findings remain a **separate inherited original-authored clip production backlog**, affecting 28 athletes in this branch combination. None are on Marin or Juniper. They require the protected individual-art workflow for those athletes, not a change to Marin's ball offsets.

## Git-object blocker: what was verified, and what was not

The earlier [full non-sparse checkout attempt 42108460440](https://github.com/Manaconda33/Conda-Jam/actions/runs/42108460440) failed during a **partial-clone promisor fetch**, with Git reporting `not our ref 14b5d774b41ff4a4602e52347bc2d7d10a155617` and inability to fetch object `7fb06e8242ff4cbf1d8cca4d4bab390188eb021c`.

Independent read-only checks now establish that **object `7fb06e8242ff4cbf1d8cca4d4bab390188eb021c` is the text of PR #7's `docs/animation-production/SUPPORTING_PLAYER_REUSE.md` and is readable through GitHub's normal contents/blob API**. The first object (`14b5d...`) still returned GitHub object API **404** in the earlier investigation. Thus a Git `upload-pack` / partial-clone failure **does not prove all referenced source material is lost**. Its true full historical resolution remains open. Any retry should diagnose the precise missing blob/path and try supported Git fetch modes or verified API retrieval **without inventing a blob, force-pushing protected refs, or claiming a complete checkout from a selected sparse tree**.

## Durable evidence / remaining gates

- Baseline audit [main artifact 13465344508](https://github.com/Manaconda33/Conda-Jam/actions/runs/42138506054/artifacts/13465344508): complete normalized signatures, command log, source pin.
- Baseline audit [PR6 artifact 13466760917](https://github.com/Manaconda33/Conda-Jam/actions/runs/42138506054/artifacts/13466760917): same audit method.
- Baseline audit [PR7 artifact 13466637911](https://github.com/Manaconda33/Conda-Jam/actions/runs/42138506054/artifacts/13466637911): same audit method.
- [Combined source-art audit artifact 13453931269](https://github.com/Manaconda33/Conda-Jam/actions/runs/42110543688/artifacts/13453931269): complete `audit.json` at the exact saved Marin source.
- [Full scoped `npm test` green, 587/587](https://github.com/Manaconda33/Conda-Jam/actions/runs/42131202002), documented in [`MARIN_120_FIXTURE_SCOPED_TEST_SUITE_GREEN_2026-11-05.md`](./MARIN_120_FIXTURE_SCOPED_TEST_SUITE_GREEN_2026-11-05.md).

**All Actions artifacts are time-limited**, so the exact source pins, counts and proven origin of each delta are preserved here. The diagnostic workflow can reproduce the original-branch comparisons.

**Remaining integration gates:** independent rendered pixel/contact signoff; actual historical full non-sparse materialization; justified treatment of the four underlying prompt flags and the derivative findings; original-author captain clip backlog; separate combined asset and provenance acceptance; and explicit owner authorization for merge/deployment.

**Disposition: DO NOT MERGE.** Preserve draft PR #13 as diagnostic and draft PR #16 as source/evidence review. PR6, PR7, `main`, published sprite art and the unavailable Myth workspace remain untouched.
