# Independent source review — Kraken `dunk-reverse`, attempt01

**Verdict: reject as a production source. Real alpha and 15 main sprites are present, but cell-boundary failures, edge fringe, painterly rendering and an unclear reverse-dunk contact pose prevent cleanup acceptance. Preserve raw and provenance; do not pack or register.**

## Source and exact prompt

- Raw: `tools/generate-art/sources/kraken-dunk-reverse-attempt01-generated-raw.png`, 1448×1086 RGBA.
- Generation ID: `exec-1308f549-41d7-45d3-8a24-0afc915abe5f`, `2026-10-29T04:54:00Z` per provenance.
- Raw SHA-256 `45905ef802f469021a95644d06c4eed456f03c6c7491dce022facf4bf1516901` matches provenance.
- Exact prompt SHA-256 `920415ae11e708750afa5a0de0f2351737eac4c609dc395d2ef53960bf57903e` matches provenance.

## Findings

- **Alpha/backdrop: partial pass.** This is genuine RGBA, with 950,671 fully transparent pixels and no painted checkerboard/backdrop. Alpha ranges 0–255; 621,054 pixels are partially transparent and 803 are fully opaque. Every zero-alpha pixel carries nonblack RGB, so filtered resampling can pull the brown/red hidden color into edges. The art also has conspicuous red/yellow fringe around silhouettes. At alpha≥64, there are exactly 15 main figure components; at alpha≥1 there are 2,378 components, including 2,363 small fragments. Keep to alpha-aware or nearest-neighbor handling if any later source investigation occurs.
- **Pose count and full anatomy: pass at gross level.** Fifteen full-body figures appear in a 5×3 row-major arrangement. Heads, arms, legs and shoes are generally visible and attached, including the inverted figure. Kraken's natural skin, auburn hair, pointed ears, copper amulet and burgundy/copper uniform remain recognizable and broadly consistent. No basketball or other object is baked into the athlete art.
- **Cell separation and margins: fail.** With 1448×1086 and a 5×3 grid, nominal cells are about 290×362 px. Several alpha≥64 pose bounds cross nominal column boundaries: top-row pose 2 extends to x=649 past the x≈579 cell edge; top-row pose 3 extends to x=938 past x≈869; other row figures also cross seams. For example, the first row's first silhouette begins only 19 px from the left edge of its nominal cell. The arrangement is recognizable, but sprites do not retain large clear gutters or safe individual-cell bounds.
- **Reverse action and pose distinctions: partial/fail.** The approach, load, jump, backward rotation, inversion, landing and recovery beats can be read. Frames 8–10 do not complete a clear arm windmill/reverse-dunk path: the middle row includes an inverted pose followed by raised-arm poses, but the intended frame10 forceful downward reverse-dunk extension is not distinct enough from the preceding raised/peak posture. Frame9 and frame10 silhouettes differ, though the contact distinction is weak without a ball. Several early running/gather frames are close variants.
- **Pixel-art/style: fail.** Despite dark outlines, the source has smoothly blended shading, soft color ramps and antialiased contours, not the specified enlarged 48×64 pixel clusters, limited palette and hard-edged one-pixel outline. The colorful edge halo further softens the sprite boundary. This needs substantial redraw to meet the sprite style, not routine cleanup.

## Recommendation

Reject as a cleanup-ready runtime source. It has the clearest genuine alpha among several recent attempts, and its body rotation can inform later pose planning, but it misses cell containment, pixel style, and the reverse-dunk contact action. Preserve this raw source and provenance. A future source should keep the reverse rotation but show clear, successive arm positions through inversion, reverse-facing peak, and a forceful downward extension, with contained silhouettes, true clean alpha gutters, and crisp low-resolution pixel art. Keep the ball on a separate athlete-specific track.
