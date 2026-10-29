# Kraken rebound production derivative — independent art review

**Verdict: PASS for production artwork quality and lineage.** This review covers the registered WebP derivative and its five 80×96 frame crops against the earlier attempt02 cleanup review. It does not verify gameplay timing or ball-track integration.

## Appearance and pose separation

The derivative preserves Kraken's dark auburn hair, pointed-ear silhouette, natural skin, copper/gold details, and burgundy uniform. Scale and pixel treatment remain consistent across the five cells. The sequence reads as a crouched ready stance, upward jump/reach, overhead grab, chest gather while descending, and a settled crouch. Arms, hands, legs, and shoes remain connected and visible; no ball is baked into the art.

Frames 0 and 4 retain the similar low crouch noted in the cleanup review, but remain visibly distinct: frame 0 has a lower, looser hand position while frame 4 gathers both hands closer to the chest. The two images differ at 880 of 7,680 RGB pixel positions (11.5%); they are not duplicate frames. The contact/recovery sequence makes the distinction legible at sprite size, though it remains the closest pair in the set.

## Alpha, bounds, and baseline

The 400×96 WebP is fully transparent outside the five figures. Every crop has binary alpha (0 or 255); no semitransparent fringe or matte is present. Alpha bounds, in local cell coordinates, are:

| Frame | Bounds (x0,y0–x1,y1) | Margins L/R/T/B |
|---|---|---|
| 0 | (23,44–57,92) | 23 / 23 / 44 / 4 px |
| 1 | (23,22–56,92) | 23 / 24 / 22 / 4 px |
| 2 | (27,25–53,92) | 27 / 27 / 25 / 4 px |
| 3 | (26,34–53,92) | 26 / 27 / 34 / 4 px |
| 4 | (23,44–56,92) | 23 / 24 / 44 / 4 px |

No anatomy is clipped and all cells have generous side/top margins. `baselineY: 92` is the registered source baseline; the renderer's two-pixel compensation restores the prior baseline at 94, leaving two visible pixels below the shoes at gameplay scale. This matches the documented cleanup operation.

## Provenance and derivative integrity

The manifest points to generation `exec-d6e7e8e7-8e91-4cac-891a-7ab3fdaedc51`, raw edited source SHA-256 `aec263697e585c3ff195dcac25232b66fe1219c7311337c896630d7ba4d68def`, and cleanup atlas SHA-256 `c5a4f0c8c379ec0dfc674bcaf6aa3359a0eeb5603f40df3a6c3ab2e80f47532d`. The checked-in production WebP is pixel-identical to the recorded baseline-offset atlas; comparing each crop with the earlier cleanup atlas confirms the only pixel operation is the documented two-pixel upward translation. The manifest keeps the actual ImageGen generation and cleanup lineage; it does not claim the derivative is a new generation.

Reviewed by independent asset audit, 2026-10-29.
