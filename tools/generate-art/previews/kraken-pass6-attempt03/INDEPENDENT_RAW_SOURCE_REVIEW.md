# Independent raw source review — Kraken chest pass attempt03

**Verdict:** Promising source for layout/cleanup trials; not approved for atlas packing or runtime use from raw review alone. The action sequence reads well overall, including the required loaded frame 3 and sole release frame 4. Main blockers are contact-sheet spacing and a likely style/resampling mismatch with the registered low-resolution Kraken art; inspect cleaned previews on both light and dark backgrounds before acceptance.

## Provenance

- Prompt: `tools/generate-art/kraken-pass6-attempt03-imagegen-prompt.txt`
- Raw: `tools/generate-art/sources/kraken-pass6-attempt03-generated-raw.png`
- Dimensions/mode: 1402×1122 RGBA
- SHA-256: `44c042bf175ca1337c24c3f06fc569eefab0d971c3207b9ce4f1222fa32a2075`
- Identity comparison: `public/assets/animation/kraken-idle-right.webp`
- Generation ID: `exec-6af62d0f-5c3d-4f21-a213-93f524e77291` (from the supplied provenance).

## Pose-by-pose review

1. **Setup:** Upright, knees lightly bent, empty cupped hands at sternum. Complete hair-to-shoes. Reads as setup.
2. **Windup:** Torso and knees sink/rock back slightly; elbows stay bent and hands remain close to chest. Clearly still loaded, though its distinction from pose 1 is moderate rather than large.
3. **Loaded step:** Front foot is planted toward screen-right and rear leg trails; shoulders lean forward, but both elbows remain deeply bent and hands stay at the sternum. It does **not** read as a release. This satisfies the critical frame2-loaded/frame3-loaded distinction and leaves the release to pose 4.
4. **Release:** Both arms extend from the chest with open, empty hands; this is the only release-like pose. No basketball or ball-shaped glow is visible.
5. **Follow-through:** Arms remain extended but angle lower and soften; weight is forward and rear heel lifted. Visually distinct from pose 4, though the two outstretched silhouettes are close enough to warrant a continuity check at playback speed.
6. **Recovery:** Hands lower and separate near the waist, torso stays forward and stance recovers. Complete anatomy.

All six figures face screen-right consistently. Each retains Kraken's pointed ear, auburn hair, copper medallion, burgundy/copper uniform, wristbands and matching shoes. Faces and body scale are coherent across poses and plausibly match the registered Kraken idle identity. Hands are visible and empty throughout; limbs and feet are present with no obvious anatomical break or clipping.

## Sheet, alpha, scale and cleanup risks

- Six major silhouettes are present and remain disconnected at alpha≥16. The nominal 3-column cells are too narrow for the release gestures: lower-left pose 4's silhouette spans x=51–551 (crossing the x=467 cell boundary), while lower-middle pose 5 spans x=522–1014 (crossing x=934). Their bounding boxes overlap in x, so fixed equal-width cell slicing will cut/overlap the figures. Derive reviewed individual crops/layouts with a clear gutter before packing; do not trust the apparent grid as cell boundaries.
- Feet align well: at alpha≥16 the six bottom extents are y=535, 535, 535, 1077, 1076 and 1078. Within-row baseline variance is only 2px in this raw sheet.
- Heads/shoes are in-canvas with useful vertical margins. Pose 4 and 5 hands consume most of their horizontal gutters; after extraction, verify at target scale that gestures do not touch adjacent cells.
- Canvas outside the figures is transparent rather than a visible opaque background. The PNG contains 618,368 nonzero-alpha pixels, of which 99,362 are partial-alpha pixels; the alpha≥16 silhouette area is 519,006. At alpha threshold 1, the figures extend several pixels beyond their alpha≥16 bounds, so review for soft/colored edge fringe on both light and dark previews and remove only with documented conservative cleanup.
- The artwork is smoothly shaded and substantially higher-resolution than the compact, hard-clustered pixel style in the Kraken idle atlas. Downscaling each figure to gameplay dimensions may blur edges or alter the style; compare actual-size previews against the idle atlas before deciding whether this is acceptable.
- Do not preserve any unexamined alpha specks during extraction. The raw sheet has small disconnected alpha components in addition to the six main silhouettes; confirm whether each is edge antialiasing or a stray artifact in the cleanup preview.

## Acceptance boundary

Action semantics, identity and anatomy are strong enough to continue with candidate cleanup/layout previews. Raw review does not establish final cell margins, pixel-art consistency, clean alpha edges, runtime timing, ball-track alignment or gameplay quality. Keep the ball on its separate athlete-specific track; do not bake one into these sprites. Do not register this raw sheet as an accepted runtime atlas without those reviews.
