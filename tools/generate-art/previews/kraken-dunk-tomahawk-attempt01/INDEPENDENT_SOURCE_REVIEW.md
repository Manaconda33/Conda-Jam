# Independent source review — Kraken `dunk-tomahawk`, attempt01

**Verdict: suitable for conservative cleanup/layout trials only; not acceptable or registered.** Fifteen coherent poses and real alpha make isolation possible, but the source still fails the pixel-art style requirement and some cell margins are too tight or cross nominal boundaries.

## Source and prompt verification

- Raw: `tools/generate-art/sources/kraken-dunk-tomahawk-attempt01-generated-raw.png`, 1536×1024 RGBA.
- Generation ID: `exec-83d77067-2595-48a7-9a2c-26e56f75dbf1` (`2026-10-29T05:01:00Z`).
- Raw SHA-256 `a3ad521f20c7190dc1609d0203a64180153a1b12ad4895de29cc11a26328683c` matches provenance.
- Exact prompt SHA-256 `b14b02922ca754a082c055ff065d7e6529843d661ed558823811246ba84f9fa6` matches provenance.

## Findings

- **Alpha and gutters: pass for cutout experimentation, not final edges.** The source is RGBA with 1,045,584 fully transparent pixels, 527,280 partially transparent pixels and no fully opaque pixels. At alpha≥32 there are 15 main sprite components. The brown field in some previews is RGB under zero-alpha pixels, not an opaque backdrop. At alpha≥1 there are 5,069 components, including 5,053 low-alpha fragments; at alpha≥8, 15 main figures remain along with 52 small fragments. Hidden RGB under transparent pixels and abundant semitransparent edges can bleed when scaled, so use alpha-aware or nearest-neighbor processing and inspect edges on light/dark backgrounds.
- **Pose count and uniqueness: pass.** Fifteen visually distinct full-body figures are present in 5×3 row-major order. The sequence includes approach/load/takeoff, cocked tomahawk, downward extension, follow-through, descent, landing and recovery. The pose silhouettes differ; the final recovery is clearly unlike the landing pose.
- **Action distinctions: mostly pass.** Poses 8–11 show the clearest action sequence among recent dunk samples: arm cocked behind head, windup, downward one-hand extension and follow-through. The sequence is legible without a ball, and no ball/prop is baked into the art. The tomahawk contact and follow-through poses are close variants but still visibly different in arm/torso angle. Gameplay timing and a separate ball track remain untested.
- **Identity and gross anatomy: pass.** The same male elf remains recognizable through all poses with short auburn hair, pointed ears, warm skin, copper amulet, burgundy/copper uniform, dark socks and burgundy shoes. Heads, hands, arms, legs and shoes appear attached and complete. No extra figures or monster traits are visible.
- **Cell margins: partial/fail.** Nominal cells are about 307×341 px. Fifteen alpha≥32 components can be isolated, but some approach or cross boundaries: the first-row column0 figure comes within about 12 px of the next column; row2 column2 reaches about 3 px past x≈921; row2 column3 reaches about 3 px past x≈1229. Several poses begin within 5–17 px of a row seam. These margins are not the broad safety gutters requested and may crop when placed in cells.
- **Pixel-art style: fail.** The figures have smoothly blended shading and illustrated contours rather than the specified hard square pixel clusters, limited palette and clean discrete shading. The edges are less contaminated than the opaque-checkerboard attempts, but the source is still not a production pixel-art atlas. Cleanup can isolate frames and improve gutters; it cannot correct the rendering style without substantial redraw.

## Recommendation

Allow only a conservative, non-runtime cutout/layout trial to verify whether each pose can be placed inside a safe cell without losing anatomy. Preserve the untouched raw and record any discarded pixels. Do not pack, register, or calibrate the ball track unless the resulting frames first pass independent visual review for pixel style, cell margins, baseline and pose clarity. Keep the basketball on its separate athlete-specific track.
