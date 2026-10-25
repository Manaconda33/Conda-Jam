# J.124 poses 10–14 source review (provisional)

Reviewed cleaned pose candidates and initial light/dark composites on 2026-10-25. The initial native-cell montage was later found invalid because it scaled alpha crops to the full 96px cell height and clipped/pressed content against the vertical edges. That montage was reconstructed and preserved as rejected in `rejected-preview/`. Do not use it.

## Candidate source review

- **Pose10:** Attempt3 is a rear three-quarter turn with bent right elbow and open hand lateral to Piper’s head. Parent review found the hand distinct from pose09’s closed fist and judged its crisp stepped contours/palette suitable for provisional sequence review. Attempts1 and2 remain preserved as superseded.
- **Pose11:** Side/back turn continues after release. Right arm travels down/across, other arm counterbalances, legs start unfolding. Reads as follow-through rather than another release.
- **Pose12:** Body rotates toward viewer with arms lower and wider and knees bent, reading as airborne descent before foot-first preparation.
- **Pose13:** Selected attempt2 has one foot extended down, the other knee bent, slight forward torso lean and lowered asymmetric arms. Attempt1 and the raised-arm retry variant are preserved as rejected.
- **Pose14:** Both feet grounded in a balanced stance with relaxed knees and arms, distinct from airborne frames.
- **Identity/anatomy/ball:** Provisional candidates show Piper’s warm brown skin, dark eyes, attached vivid orange ponytail, russet/cream kit, white socks and red/cream shoes. Complete adult anatomy is present. No basketball or prop appears.

## Corrected native cells

`native-cells/pose-09-128x96.png` through `pose-14-128x96.png` are built from alpha16 source crops. Each is fit uniformly, premultiplied-alpha Lanczos, to max112×80 px, centered horizontally, with the figure baseline at y=87 in a 128×96 transparent cell. Per-cell source/output hashes, exact bounds and alpha16 margins are recorded in adjacent JSON. Current measured margins by pose are 9 `[35,7,36,9]`, 10 `[34,7,35,9]`, 11 `[34,7,35,9]`, 12 `[26,7,27,9]`, 13 `[38,7,39,9]`, 14 `[35,7,35,9]` (LTRB). Corrected light/dark sheets and 3x nearest-neighbor enlargements are in `proofs/pose09-14-native-cell-sequence-cropfit-corrected-*`. These show no vertical edge contact. Independent re-review passed the corrected 09–14 cells with no vertical clipping; full poses00–14 and ball-track/runtime review remain pending.

The superseded stretched preview’s measured y bounds and hash are preserved in `rejected-preview/pose09-14-native-cells-stretched-rejected.json`. No atlas is packed or registered. Full poses00–14, separate athlete-specific ball track, and runtime interaction review remain pending.
