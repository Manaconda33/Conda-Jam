# Independent source review — Kraken dunk-360 attempt03

**Decision: reject this raw sheet; do not proceed to cleanup.** It has a visible rotation concept, but fails the source edge, motion, and style requirements.

## Provenance

- Raw: `tools/generate-art/sources/kraken-dunk-360-attempt03-generated-raw.png`
- SHA-256: `cd506ca3bb4e77742de5543b109d888db96d4636bf97b7e143191fd545732fef`, matching provenance.
- Generation ID: `exec-0cb5d20f-f637-46df-9c12-efce4f80cffd`.
- Prompt SHA-256: `822b190aea0b306c00812f1f8dfd1995b4bc1e3add54d4597db2da03743c7609`, matching the saved prompt.
- Dimensions: 1619×971 RGBA.

## Findings

- The background is transparent, and 15 individual figures are visible. Kraken's hair, pointed ears, warm skin, pendant, burgundy/copper kit, socks and shoes are broadly consistent. Most poses show complete anatomy, with no ball or hoop baked into the art.
- A top-row figure at the far right is cut by the right canvas edge. The 1619×971 canvas is not divisible into equal 5×3 cells, and silhouettes extend close to nominal gutters; fixed-cell cropping risks clipping or spill. There is no clean assurance of 10% padding in every cell.
- The rotation has a general front-to-back-to-front turn, but the middle of the rotation is repetitive: frames 8–9 are both back-facing with nearly the same torso/arm silhouette. The sequence does not make five distinct angular beats through frames7–11.
- The required dunk is late and unclear. Frame12 still holds a raised/bent arm; the first obvious low, downward arm position arrives later, so frames12–13 do not clearly separate the forceful rim extension from the follow-through.
- The rendering is smooth shaded illustration, not hard 16-color pixel art. A conspicuous red/orange fringe outlines many figures, and antialiased edge pixels are visible. Alpha extrema are 0–255, with 557,347 partial-alpha pixels; transparency exists, but the edge treatment is not the requested solid pixel-cluster style.

## Recommendation

Preserve as rejected. A retry should use a 1600×960 or other evenly divisible 5×3 canvas with generous transparent gutters, no figure touching the outer edge, five distinct head/torso-facing changes during frames7–11, an explicit down-strike at frame12 and a separate below-head follow-through at frame13, and crisp red-fringe-free pixel clusters.
