# J.124 Piper Quickstep `alley-oop-reverse`, poses00–04

This source lane has provisional parent and independent-review approval for poses00–04 only. It does not pack or register an atlas and does not change runtime or the athlete-specific ball track. Clip acceptance remains pending full15-pose continuity, ball contact/release timing, and native browser review.

## Current source candidates

| Pose | Sequence beat | Current source | Cell | Cell alpha>16 margins L/T/R/B |
|---|---|---|---|---|
| 00 | Low run-in; right knee leads | Attempt3, J.123 atlas style reference | `layout-candidates/pose-00-attempt3-cell128x96.png` | 28/7/28/9 |
| 01 | Faster long stride; left knee leads | Attempt2, J.123 atlas style reference | `layout-candidates/pose-01-attempt2-cell128x96.png` | 22/7/22/9 |
| 02 | One-foot takeoff, tick4 | Attempt2, J.123 atlas style reference | `layout-candidates/pose-02-attempt2-cell128x96.png` | 31/7/31/9 |
| 03 | Forward-pitched airborne reach, limbs spread | Attempt3, J.123 atlas style reference | `layout-candidates/pose-03-attempt3-cell128x96.png` | 20/7/20/9 |
| 04 | Elongated upright late reach before catch | Attempt3, J.123 atlas style reference | `layout-candidates/pose-04-attempt3-cell128x96.png` | 39/7/40/9 |

See `proofs/poses-00-04-style-ref-cells-light.png` and `proofs/poses-00-04-style-ref-cells-dark.png` for the full native 128×96 sequence. All five current cell previews are separate RGBA figures with transparent backgrounds and in-bounds silhouettes. They are unique and ordered run-in → accelerating stride → takeoff → wide reach → vertical pre-catch reach. Pose03/04 were revised after their initial style-reference versions read too similarly; the earlier raw and cell candidates remain preserved and are explicitly rejected below.

## Prompts, provenance, and review

Every attempt has its exact prompt, raw source, generation ID, raw hash, alpha margins, cleanup/layout record and disposition in `pose-*-prompt.md`, `sources/`, `provenance/`, `cleaned/`, `layout-candidates/`, and `proofs/`. Attempts using the accepted Piper J.123 atlas as a visual reference record that reference and role in their provenance.

The first generated outputs for poses00–04 (plus pose00 attempt2) used smooth glossy cel/vector rendering. Source review rejected them for style mismatch against accepted J.123 pixel art; poses00 attempts1/2 were also near alternatives for the same run-in. The style-matched sequence uses alpha-only cleanup (largest alpha>16 component plus one-pixel halo) and uniform downscaling/layout. It does not repaint pixels, mirror figures, or add a ball. Parent and independent reviewers checked native cell pose separation, anatomy, transparency, margins and the source-to-layout hash chain; these five source candidates are provisionally accepted. Full 15-pose continuity remains pending.

Pose03 attempt2 and pose04 attempt2 both produced nearly the same narrow upright overhead reach. Both are retained as rejected near-duplicates. Pose03 attempt3 spreads the arm and leg lines into a forward-driving reach; pose04 attempt3 elongates the torso and raises one arm more vertically, with a long trailing leg. The light/dark sequence proof shows the current separation, subject to parent review.
