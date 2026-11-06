# Kraken dunk attempt04 edited raw — independent source review

**Verdict: reject; do not proceed to cleanup/layout or runtime trials from this raw.** Reviewed `tools/generate-art/sources/kraken-dunk-attempt04-edited-raw.png` against the exact prompt and edit provenance.

## Findings

- **Count, identity, anatomy:** ten figures are present in the intended broad row-major sequence. Kraken remains recognizable through warm skin, auburn hair, pointed ears, copper amulet, burgundy/dark kit and matching shoes. No ball is baked in. The figures look generally anatomically connected and full-body.
- **Cell isolation/margins: fail.** The 1536×1024 sheet shows five figures per row, but several silhouettes cross nominal 5×2 column boundaries. For example, the second top-row component spans x316–663 while its equal-width column ends around x614; a bottom-row figure also extends past its nominal cell. Other figures have only a few pixels on a side. The prompt also asks for square cells, which cannot fit a 5-column×2-row grid on this canvas. This needs a new, consistent cell layout with safe gutters; direct cell crops would cut anatomy.
- **Transparency/alpha: fail.** The corner is not fully transparent (alpha 1), and no pixel reaches alpha 255: alpha extrema are 0–254 with 562,374 partially transparent pixels. Light/dark composites do not show the large brown field from earlier iterations, but semi-transparent pixels remain throughout the art/edges and some touch the canvas border. This does not meet the request for fully alpha-zero gutters and no semitransparent bleed.
- **Pose sequence: fail at the key dunk beats.** The top-row approach and takeoff are readable, and bottom-row pose9 landing and pose10 upright recovery differ. However, poses6–8 remain too similar at small size: pose6 has arms raised apart, pose7 brings the arms closer overhead but does not read as a forceful extension through the rim plane, and pose8 bends the arms while descending but remains another overhead jump silhouette. The peak, slam, and descent are not unmistakable separate beats.
- **Pixel style/fringe: fail.** Contours are more stepped than a smooth painting, but the internal muscles and clothing still use blended illustrated gradients and soft shading instead of hard pixel clusters and a restrained discrete ramp. There is no dominant bright red glow in the light/dark composites, but semi-transparent edge pixels remain; this is not a clean native pixel-art source.

## Recommendation

Reject this edit as a dunk source. Preserve its identity and approach/landing ideas, but require a consistent 5×2 cell layout with margins, truly opaque figure pixels and fully transparent gutters, and visually separated peak, forceful slam, and post-contact descent poses. No production asset was modified.
