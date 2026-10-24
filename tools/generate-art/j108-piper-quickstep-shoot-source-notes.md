# J.108 Piper Quickstep — `shoot` source-pose lane

Roster confirmation: Piper Quickstep is the first incomplete athlete in canonical team/player order (5/29 reviewed clips). `shoot` is the first missing clip after `idle`, `idle-ball`, `dribble`, `run`, and `dribble-run`.

## Identity and review

Piper’s existing reviewed locomotion atlas is the identity reference: athletic adult human woman, warm brown skin, bright orange high ponytail tied behind her head, russet red/cream uniform with cream speed stripes, matching red/cream shoes. All ten accepted source poses keep that identity and complete two-arm/two-leg anatomy. No source contains a ball or prop; the basketball remains a separate athlete-specific runtime object.

## Accepted source poses

Each accepted source is one unique figure cropped from a preserved image-generation output, isolated by alpha-connected component, and fitted into a review-only 128×96 cell. The process does not draw, mirror, duplicate, or interpolate. Poses01,02,07,08,09 are replacements from the separately generated transition strip because the first attempt was repetitive/misordered at thumbnail scale.

| Frame | Pose | Generation | Source | Source SHA-256 | Fit/margins (px) |
|---:|---|---|---|---|---|
| 00 | approach | `exec-57e8bead-39f1-47bc-9f68-77e961d8041b` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-00-attempt-2.png` | `c1a5effb254da2be94b654d85c50c978982fa4f3fa7cbe9427ec5ca27fc04a8d` | 55×86; L/R/T/B 36/37/5/5 |
| 01 | bend | `exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-01-attempt-3.png` | `d20e4784d72e806f7dedc93a9d587004f5f693983c7c9a59e4e1590c67d3f17b` | 60×86; L/R/T/B 34/34/5/5 |
| 02 | gather | `exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-02-attempt-3.png` | `097041abe8742a3b04848375edae564ca478e8a83fc63427d0d32a9ff965e900` | 55×86; L/R/T/B 36/37/5/5 |
| 03 | deep-gather | `exec-57e8bead-39f1-47bc-9f68-77e961d8041b` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-03-attempt-2.png` | `78b5cbb0d21aefb6f80ceb7d676d46519b1a67cb995ef10e9bbaa1bea86dfc60` | 63×86; L/R/T/B 32/33/5/5 |
| 04 | set | `exec-57e8bead-39f1-47bc-9f68-77e961d8041b` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-04-attempt-2.png` | `937a04cd453f39b126e3100336d92a84ddb93336bafdd4c784d2509848343e0d` | 57×86; L/R/T/B 35/36/5/5 |
| 05 | release | `exec-57e8bead-39f1-47bc-9f68-77e961d8041b` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-05-attempt-2.png` | `7c69a9c30c8470b06886919df52dabffe8bbb0517fbd43d6b19e7abae2830225` | 51×86; L/R/T/B 38/39/5/5 |
| 06 | follow-through | `exec-57e8bead-39f1-47bc-9f68-77e961d8041b` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-06-attempt-2.png` | `4625d34829900acde75dc7f02d72d1578009b4de616cc077b9afaa1ad8636fa1` | 63×86; L/R/T/B 32/33/5/5 |
| 07 | apex | `exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-07-attempt-3.png` | `78a876ddde80ef22198bdfd1cc71f11ab602ebc0a83365572049cf7279b7a5b3` | 48×86; L/R/T/B 40/40/5/5 |
| 08 | descent | `exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-08-attempt-3.png` | `75e01070771c195efec77373766d91071f3c09759415ec04e7db3d6a2be1462f` | 56×86; L/R/T/B 36/36/5/5 |
| 09 | landing | `exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1` | `tools/generate-art/sources/j108-piper-quickstep-shoot-pose-09-attempt-3.png` | `35b1c24f9989a19cf8e05abb17b58e440d1b326592299dbabc0adb7f0cd7bf56` | 57×86; L/R/T/B 35/36/5/5 |

Review cell SHA-256 values are unique across all ten poses. Tight alpha>16 crop and nearest-neighbor fit stay within76×86. Horizontal margins are ≥32px and vertical margins are5px in every cell. Packed-cell corner alpha is zero.

The candidate clip’s release anchor is frame05 at tick13 (`src/core/animation.js` shoot anchor). The source release hand is approximately `(80, 7)` in the 128×96 review cell; start the separate-ball overlay around `(82, 12)` so the ball meets the palm/fingertips, then refine in the actual renderer. These are visual estimates, not a registered runtime track. Pose05’s fingertips are flexed rather than broadly splayed, so reject it if the native overlay does not read clearly as a release. The raw generator sheets still show a red edge fringe and polished anti-aliased shading; the accepted source cleanup trims a two-source-pixel boundary and saturated red pixels within8px of the silhouette edge. Review any remaining fringe at production scale before atlas integration.

## Generation history and rejected candidates

All three exact generation/edit prompts and immutable full raw outputs are preserved:

- Attempt01 full 5×2 sheet: `j108-piper-quickstep-shoot-prompt.md`, generation `exec-630e1998-344a-4e64-a231-b001d0ba2f61`, source `sources/j108-piper-quickstep-shoot-generated-raw.png`. Rejected as a row-major atlas because several figures crossed the implied panel boundary and margins/order needed correction. Full review: `previews/j108-piper-quickstep-shoot/j108-piper-shoot-attempt-01-review.png`.
- Attempt02 edit: `j108-piper-quickstep-shoot-attempt-02-edit-prompt.md`, generation `exec-57e8bead-39f1-47bc-9f68-77e961d8041b`, source `sources/j108-piper-quickstep-shoot-attempt-02-edit-raw.png`. Whole sheet remains rejected because the red edge fringe persisted and some follow-through poses were repetitive/misordered. Five selected unique components became frames00,03,04,05,06. Review: `previews/j108-piper-quickstep-shoot/j108-piper-shoot-attempt-02-grid-review.png`.
- Attempt03 transition replacements: `j108-piper-quickstep-shoot-attempt-03-replacements-prompt.md`, generation `exec-429e12df-7cb5-4811-a5d1-e7e0cd0d8db1`, source `sources/j108-piper-quickstep-shoot-attempt-03-replacements-raw.png`. This is only a five-pose strip, not a full clip; its five complete unique components became frames01,02,07,08,09 after review. Review: `previews/j108-piper-quickstep-shoot/j108-piper-shoot-attempt-03-replacements-review.png`.

Byte-identical duplicate copies of the chosen pose PNGs remain preserved under `tools/generate-art/sources/` with the `earlier-cleanup-rejected` suffix; they are not additional candidates and are not referenced by the layout. The raw generated sources and exact prompts remain unchanged.

## Evidence and next integration step

- Final source pose review: `previews/j108-piper-quickstep-shoot/j108-piper-shoot-poses00-09-cell-review.png` (each frame on light and dark backgrounds).
- Layout and SHA ledger: `tools/generate-art/j108-piper-quickstep-shoot-layout.json`.
- Full generation/provenance ledger: `tools/generate-art/j108-piper-quickstep-shoot-provenance.json`.
- Deterministic extraction and cell-review script: `tools/generate-art/clean-j108-piper-quickstep-shoot.py`.
- Exact prompts: `tools/generate-art/j108-piper-quickstep-shoot-prompt.md`, `...attempt-02-edit-prompt.md`, and `...attempt-03-replacements-prompt.md`.

These are reviewed source-pose candidates only. No production atlas, runtime ball track, production manifest, or tracker update was created in this lane. A parent integration should overlay the separate live basketball in native rendering through tick12, release at tick13, and verify both facings after the canon-approved mirror policy. Ball alignment and production-scale shading/fringe remain unverified until that integration review.


## Acceptance review and native rendering

The candidate source passed visual review before atlas packing: ten complete, distinct source poses in the authored approach → bend → gather → set → release → follow-through → apex → descent → landing sequence; transparent corners and gutters; at least32px side margins and5px top/bottom; warm-brown adult human identity, bright orange ponytail, russet/cream kit and matching shoes; no ball or prop baked into a source. The close review notes frames05 and07 are the nearest silhouettes, with pose07's straighter airborne body and lowered free arm separating it from the bent-knee release pose. This is a moderate similarity, not a duplicate or rejection.

Before packing, `previews/j108-piper-quickstep-shoot/j108-piper-shoot-ball-overlay-diagnostic.png` displayed a separate basketball at the measured hand centers. The track is stored in source-cell units in `j108-piper-quickstep-shoot-provenance.json`: `height=[1.13,1.043,1.503,1.503,2.048,2.278,2.278,2.278,1.962,1.187]`, `forward=[8.04,9.502,3.655,4.751,7.675,5.847,6.944,7.309,9.867,8.405]`. The ball is carried through tick12; pose05 releases at tick13. The actual Canvas renderer confirms the ball meets the raised hand at release, remains simulation-owned after release, and mirrors with Piper in both facings.

The accepted atlas `public/assets/animation/piper-quickstep-shoot-right.webp` is a lossless640×192 / 5×2 atlas with ten unique reviewed frame hashes (SHA-256 `0032a0a5bbd699787d7a850331bf187caaf1e6ddc34a2094dad8af91b1092804`). Each packed cell preserves the reviewed 32px horizontal and5px vertical margins. `previews/j108-piper-quickstep-shoot/j108-piper-shoot-atlas-review.png` shows every packed cell on light and dark backgrounds. Native reports and 20 frame captures per scale are in `previews/j108-piper-quickstep-shoot/native-100/` and `native-120/`; each report records all ten source frames in both facings, production-art selection, and ball ownership/release state.
