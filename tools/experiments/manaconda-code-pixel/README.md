# Manaconda: deterministic code-only pixel-art experiment

The artwork is drawn entirely in code from individually authored integer coordinates, pixel polygons, lines, color fills and masks. No generated-image model, image tracing, fonts, external sprite library, downloaded reference pixels or runtime image assets are used in its construction.

## Run

```bash
node generate-manaconda.mjs manaconda-code-pixel.png
node --test verify-manaconda.test.mjs
```

Node.js built-ins only. Output is transparent RGBA PNG, 64 × 96 pixels, with the athlete facing right and no basketball, ready to be drawn with nearest-neighbor scaling. The sprite is **not** registered in the live game or its animation manifests.

## Compare

Open `comparison.html` in an online browser. The first frame of the repository's original six-pose `manaconda-idle-right.webp` sheet loads from GitHub; the new sprite is bundled inline. Use the zoom/background controls. **An internet connection is required for the original reference only.** The generated reference and standalone PNG work offline.

Original source: `public/assets/animation/manaconda-idle-right.webp` (3 columns × 2 rows, 64 × 96 cell). The larger legacy fallback atlas is `public/assets/captain-gameplay-sprites.png` (7 × 5, 212 × 212 cell). The comparison targets the *production idle pose*, not a captain-selection portrait. Because one is an independent pose drawing, not a trace, pose alignment need not be identical.

## Intent

A fair initial 1:1 art-direction test only. Character features: gray-streaked curls/beard, cobalt rectangular glasses, living temple branches swept backward with blossoms, indigo trailing scarf, Chicago Condas violet-and-gold uniform, white single-arm compression sleeve and white tights. The game handles the ball as a separate entity.

To integrate later, generate additional distinct frames, author an idle clip manifest for this new asset and perform native gameplay/mirroring review. Do not overwrite the current WebP or claim animation compliance based on the single frame.

## Evaluation checklist

- Recognizable Manaconda at native on-court scale
- Clean silhouette, readable face and proper backward crest orientation
- Crisp nearest-neighbor pixel clusters with no unwanted transparency halo
- No alpha on frame border and no baked-in ball
- Source reproducibility (same input yields same SHA-256 output)
- Simpler to revise than the painterly hand-composed generated assets

This test intentionally prioritizes arcade-pixel readability over the painterly/high-frequency detail of the original ImageGen artwork.

## V2: native 128×192 code redraw

The approved high-detail follow-up is under [`v2/`](./v2/README.md). It is a new, independently hand-coded sprite at native 128×192 (not a 2× V1 upscale), with a 64×96 reduction, an expanded same-scale four-way comparison, and a separate deterministic regression test. Original V1 source and production game assets remain unchanged. To evaluate, open [`v2/comparison-v2.html`](./v2/comparison-v2.html).
