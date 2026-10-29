# Kraken J.07 `layup` attempt01 cleanup review — 2026-10-28

**Decision: REJECT for ball-track trials at this time.** Cleanup and most visual checks pass, but the same anatomical shooting hand cannot be verified confidently across frames 2–5. Keep the source and cleanup as preserved review evidence; do not register or calibrate this atlas.

Reviewed files:

- Raw: `tools/generate-art/sources/kraken-layup8-attempt01-generated-raw.png`
- Cleanup: `tools/generate-art/clean-kraken-layup8-attempt01.py`
- Atlas: `tools/generate-art/previews/kraken-layup8-attempt01/kraken-layup8-attempt01-runtime-candidate.png`
- Layout and cleanup report: `layout.json`, `cleanup-layout-report.json`
- All eight normalized poses and light/dark contact sheets in this directory
- Prior source review: `INDEPENDENT_SOURCE_REVIEW_2026-10-28.md`

## Findings

- The untouched 1536×1024 RGBA source yields eight strong silhouette components. The global-segmentation cleanup assigns all eight to their row-major slots and retains full global component bounds, avoiding seam crop loss. I inspected all eight normalized poses, not just the atlas.
- All eight poses are distinct, full-body action poses. Head, hair, pointed ears, both arms/hands, both legs and both shoes remain present. Kraken's auburn hair, copper skin, burgundy/gold kit, wrist cuffs and amulet remain coherent across the sequence. The chest amulet is the only small circular gold mark; no basketball or other baked-in ball is visible in source, normalized poses, or atlas.
- The action reads as gather, takeoff, rise, extension, release/peak, descent, landing approach, finish. Pose4 is the configured release/peak. The figures are separated in the source and in the 4×2 atlas. Light and dark proofs show usable transparency without an obvious broad halo or matte fringe. The nearest-neighbor 80×96 output remains legible at runtime scale; outlines and costume blocks hold, though fine shading becomes dense at this size.
- All cells share baseline y=94. Minimum margins are 16 px left, 21 px top, 17 px right, and 2 px bottom. Feet are complete and not clipped; the 2 px bottom margin is tight but consistent and does not cut the art.
- **Blocking issue — shooting-hand continuity:** frames2 and 3 show one hand raised above the screen-left side of the head and the other arm forward/lower. Frame4 turns the torso substantially and the raised arm appears on the opposite screen side relative to the torso; frame5 returns to a screen-left raised-arm presentation. The existing source review also called out this shift. A pose4 perspective/torso turn could explain it, so I cannot conclude a definite limb switch from the static art alone; however, the pixels do not establish that the same anatomical right hand remains the shooting hand through frames2–5. Since pose4 is the release pose, this is not safe to treat as merely cosmetic uncertainty before placing the ball.

## Required correction

Replace or revise pose4 so the same anatomical shooting arm can be followed clearly from frames2 and 3 through the frame4 release and frame5 follow-through. Preserve this rejected source and cleanup as provenance. Re-review the corrected complete sequence before starting a track trial; verify held-ball contact through frame3 and release at frame4/tick10.
