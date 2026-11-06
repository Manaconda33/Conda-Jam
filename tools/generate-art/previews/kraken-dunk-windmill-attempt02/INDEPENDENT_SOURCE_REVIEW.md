# Independent source review — Kraken dunk-windmill attempt02

**Verdict: reject. Do not clean, pack, or use for gameplay.** The prompt requested transparency, but the source is an opaque RGB checkerboard image; its background is baked into every pixel.

## Provenance

- Raw source: `tools/generate-art/sources/kraken-dunk-windmill-attempt02-generated-raw.png`
- SHA-256: `52bfbcf5d81edbc53d39377bbc0b981ef0626c4a98962cb684adcea91ac21fa7` (matches `tools/generate-art/kraken-dunk-windmill-attempt02-provenance.json`).
- Prompt SHA-256: `2e7ad439b01a3f17ea67b76daa8880a31218eca37508683f2b4768ec0ad4f675` (matches provenance).

## Findings

- The PNG is RGB, 1536×1024, with no alpha channel. Alpha therefore cannot provide transparent background; sampled canvas/gutter pixels are checkerboard values such as `(254,254,254)` and `(213,213,216)`, visibly baked throughout the sheet. Removing it by color key would damage anti-aliased figure edges and risk halos.
- Fifteen full-body Kraken figures are visible in an approximate row-major 5×3 arrangement. Identity and outfit are consistent: warm skin, pointed ears, auburn hair, copper pendant, burgundy/copper uniform, dark socks, burgundy shoes. Hands are empty.
- The overall motion broadly proceeds through approach, airborne arm windmill, downward sweep, and landing/recovery, but it remains a smooth shaded illustration rather than crisp limited-palette pixel art.

The baked checkerboard alone blocks cleanup and reuse; style is a second rejection reason. Preserve this raw with provenance and request a fresh generation that returns actual RGBA transparency and hard-edged sprite pixels.
