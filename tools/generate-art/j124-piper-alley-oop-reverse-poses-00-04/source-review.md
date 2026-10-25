# J.124 Piper `alley-oop-reverse` — source review, poses00–04

**Disposition:** poses00–04 are provisionally accepted source candidates after parent and independent review. This is not clip or atlas acceptance. No source has been packed or registered.

The clip sequence begins with two distinct rightward strides, takes off at pose02/tick4, moves through a wide forward-driving airborne reach at pose03, then stretches upright into the late pre-catch reach at pose04. Pose05 is the overhead catch at tick10. The ball is not painted into any source; it remains a separate Piper-specific runtime track.

## Current candidates and margins

All margin values below are alpha>16 pixels. Raw margin order is left/top/right/bottom; cell margins are measured on the review-only 128×96 cell image. Exact prompt hashes, image generation IDs, source hashes, detached-component counts, cleanup, layouts and preview paths are recorded in each pose's provenance JSON and cell-layout JSON.

| Pose | Selected attempt | Raw margins | 128×96 cell margins | Review |
|---|---:|---|---|---|
| 00 | 3 | 279/217/235/213 | 28/7/28/9 | Low right-knee-leading run-in; distinct from pose01. Pixel clusters and stepped contours match J.123 reference. |
| 01 | 2 | 261/298/241/240 | 22/7/22/9 | Faster left-knee-leading stride, torso pitched forward; visibly different from pose00. |
| 02 | 2 | 318/216/259/216 | 31/7/31/9 | Clear one-foot jump initiation; legs and arms begin lift. |
| 03 | 3 | 268/226/146/260 | 20/7/20/9 | Airborne forward lean, wide asymmetric arm reach, bent separated legs. |
| 04 | 3 | 405/136/257/156 | 39/7/40/9 | Long upright torso, nearly vertical arm path and long trailing leg, just before catch. |

The native composite in `proofs/poses-00-04-style-ref-cells-light.png` and its dark counterpart confirms transparent gutters and no cell crossings. At native 128×96, all five complete silhouettes have clear margins. Identity appears consistent: adult athletic human, warm brown skin, dark eyes, attached bright orange high ponytail, blank russet/cream uniform, white socks and red/cream shoes. No source contains a ball. Parent and independent reviewers verified the per-pose hash chains, raw/cell margins, transparency and native 128×96 placement. They provisionally accepted these five source candidates. Full 15-pose continuity, separate-ball alignment and runtime timing remain pending before clip or atlas acceptance.

## Rejected and alternate candidates

- Poses00–04 attempt1, and pose00 attempt2, are retained with their original prompts and raw sources. Their glossy smooth cel/vector contours do not match the accepted Piper J.123 pixel sprite style. Pose00 attempt2 is the more compact of the first run-in alternates, but remains close to pose01 and has the same style mismatch.
- Pose03 attempt2 and pose04 attempt2 are retained with their prompts and raw sources. On the native 128×96 cells both became narrow, upright overhead reaches with a nearly identical arm path and leg tuck. They were rejected as near-duplicates and replaced with pose03 attempt3 and pose04 attempt3.
- The current attempt3/attempt2 sources used the accepted J.123 atlas as a pixel-art style reference only. Provenance names the reference image. Processing only isolates the largest alpha>16 connected component plus a one-pixel antialias halo, then uses uniform premultiplied-alpha scaling and transparent placement. No color pixels were altered, no figure was redrawn, and no mirroring was used.

The source lane has been reviewed for pose separation, transparent backgrounds, cell margins, complete visible anatomy, and separate-ball compliance. Full atlas-scale continuity with poses05–14, ball alignment/contact, and runtime timing remain pending.
