# Krios layup8 attempt01 — rejected

**Disposition:** reject; do not clean, pack, or register this sheet.

- Generated: 2026-10-28 00:45:27 UTC (PNG C2PA `created.when`)
- Provenance identifier: `urn:c2pa:c928c594-8a82-4275-aaba-1564145b29a8`
- Prompt: `tools/generate-art/krios-layup8-attempt01-prompt.md` (SHA-256 `d86936e12c1844491fe749a7ea5bbb5a8a89a6073b65c62e838e41b1ad51c0d0`)
- Identity/style reference: `public/assets/animation/krios-pass-overhead-right.webp` (SHA-256 `bee3fbdb043d448533ad70c52daeac90e83b7013ed84d84a2b5957a78c46c019`)
- Raw output: `tools/generate-art/sources/krios-layup8-attempt01-generated-raw.png` (1536×1024 RGBA; SHA-256 `e96a8722848fa33dcac045b1fab0626f917f27d333fa40408f524a5a0fbb4478`)
- Layout sheet and checkerboard previews: `light-preview.png`, `dark-preview.png` in this directory. No cleanup or atlas layout was made.

## Review

The image has eight broadly distinct, row-major Krios layup poses, and the character retains the expected red skin, curled dark horns, beard, uniform and boots. The drawing order broadly follows gather, takeoff, ascent, extension, release/peak, descent, landing approach and finish.

Reject because a dark red/black vignette and colored glow occupy the cell backgrounds and gutters. The prompt required a clean transparent exterior and no glow, haze or backdrop. Alpha inspection confirms large semi-transparent background regions: 410,296 pixels have partial alpha and no pixels are fully opaque, rather than a crisp transparent cutout. This would leave visible colored haze around packed poses. The sheet has no acceptable transparency for production, so no atlas was derived.

Do not use pixels from this attempt. Preserve it as a rejected result and proceed with a fresh generation prompt that strengthens the clean-cutout requirement.
