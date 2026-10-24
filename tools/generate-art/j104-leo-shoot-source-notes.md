# J.104 — Leo jump-shot source notes

## Accepted generation

Ten distinct right-facing poses show Leo’s patient set, release, follow-through and recovery. Leo remains the pale adult human captain with long wavy black hair, refined mustache, composed aristocratic face, and controlled black/crimson Court Kings uniform. The ball is never drawn into the poses.

- Generation: `exec-038f7613-8e7c-4f00-b85e-210fdd86ab66`; date 2026-10-24; canonical reference K.05.
- Raw generation: `tools/generate-art/sources/j104-leo-shoot-generated-raw.png` — SHA-256 `4139635828981e0fceddedc47993cb5348eba290f287f021546f8ca169b7d455`.
- Cleaned source: `tools/generate-art/sources/j104-leo-shoot10.png` — SHA-256 `8566b1425af4324c826b5cf3f4eb6dad174d1643f738eb0f486cf75ba08d1f29`; ten component-isolated figures on a common baseline with 18 px minimum cell margin.
- Source cleaner: `tools/generate-art/clean-leo-shoot10.py`; cleanup record: `tools/generate-art/j104-leo-shoot-cleanup-layout.json`.
- Packed atlas: `public/assets/animation/leo-shoot-right.webp` — SHA-256 `34ecd0c8022338a92a612ca6a16d573219465fc2fa2c123aa562c588aaee6eef`, 57662 bytes; layout: `tools/generate-art/leo-shoot10-layouts.json`.
- Prompt: `tools/generate-art/j104-leo-shoot10-prompt.md` (verbatim).
- No rejected J.104 generation was used.

## Separate basketball track

The ball is a separate runtime object. Initial Leo-specific track: height `[0.95,1.1,1.25,1.55,1.9,2.15,2.1,1.8,1.35,1.05]`; forward `[6,7.5,8.5,9.5,10.5,11.5,10.5,8.5,6.5,5.5]`. The shooting hand releases on frame5/tick13. Runtime contact tuning and manifest registration are intentionally pending central integration.
