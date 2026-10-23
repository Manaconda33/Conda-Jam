# J.73 source notes — Reed Ashcroft reverse alley-oop

Production record for the J.73 `alley-oop-reverse` source and runtime integration. The exact initial prompt is in [the generation prompt](j73-reed-ashcroft-alley-oop-reverse-prompt.md); the exact accepted edit prompt is in [the retry prompt](j73-reed-ashcroft-alley-oop-reverse-retry-prompt.md). The complete machine-readable source map and provenance are in [the layouts](reed-ashcroft-alley-oop-reverse15-layouts.json) and [the provenance](reed-ashcroft-alley-oop-reverse15-provenance.json).

## Generation history

- **Rejected initial generation:** `exec-0f6480e7-f359-4292-831a-ecab473e9e78`. Raw file: `tools/generate-art/sources/j73-reed-ashcroft-alley-oop-reverse-attempt1-rejected.png`. SHA-256: `9fcf565fef404a0ca25ffdd2b2799df3439d697e4259cd5581fd5f3d62401d8f`. C2PA claim: `urn:c2pa:3f05785e-5150-49b2-9bd8-b2eeb5707640`; XMP instance: `xmp:iid:ae5aac1c-821c-4c87-a46b-ce403811c0cd`. Rejected before packing because it visibly drew an orange basketball in the raised-hand catch pose, even though the game supplies the ball separately.
- **Accepted edit retry:** `exec-4d94cf59-3651-4503-a7e3-b8ed30482a10`, parent `exec-0f6480e7-f359-4292-831a-ecab473e9e78`. Raw file: `tools/generate-art/sources/j73-reed-ashcroft-alley-oop-reverse-generated-raw.png`. SHA-256: `c4ef7ed8efab64d3516322c216099646d5880fa72df7bd6c9f8d94249efe1153`. C2PA claim: `urn:c2pa:4f1eb601-a885-45f8-b167-eada13d0313f`; XMP instance: `xmp:iid:52c6e84d-1dfe-4ab3-a288-de162f979983`.
- **Accepted cleaned source:** `tools/generate-art/sources/j73-reed-ashcroft-alley-oop-reverse15.png`, 1618×972 RGBA, SHA-256 `fdf317acf06447e69575ef2f1c6ab94c10906060c145047cdf9b51beefe3ca60`. The conservative red-fringe cleanup removed 2,655 exterior red pixels. Alpha-core component cleanup removed 71,872 disconnected pixels in two components. The four-pixel outline matte cleared 58 vivid-red pixels. Cleanup scripts: `clean-alpha-fringe.py`, `clean-disconnected-speckles.py`, and `clean-dunk-halo.py`. Black/white/neutral-gray review confirmed no edge pixels, no visible ball, and preservation of neutral-white legwear and near-black/purple outlines.

## Accepted poses and integration

The sheet contains fifteen separate complete full-body Reed poses in a strict 5×3 row-major layout. The sequence is approach, takeoff/reach, catch at pose5/tick10, shoulder/chest gather, turn away from the rim, behind-the-crown reverse carry, single backward release at tick21, empty-handed follow-through, and two-foot landing at tick30. Reed remains a human athlete with medium-brown skin, dark eyes and brows, small goatee, attached dark purple-black braids/topknot, natural proportions, blank Chicago Condas purple/gold kit, white lower-leg wear, and purple-and-gold shoes. The game ball, teammate, hoop, rim, court and shadows are not baked into this art.

- Packed atlas: `public/assets/animation/reed-ashcroft-alley-oop-reverse-right.webp`, 512×384, 54,748 bytes, SHA-256 `16675b8e3c4014f3e6a0ba17b97f56c6d09304bd0840da3022fb6e7128e67236`.
- Source bounds/layout: `tools/generate-art/reed-ashcroft-alley-oop-reverse15-layouts.json`.
- Runtime manifest/provenance: `public/assets/animation/manifest.json`, `public/assets/animation/ASSET_STATUS.json`, and `tools/generate-art/reed-ashcroft-alley-oop-reverse15-provenance.json`.
- Mirror review: J.01 approves mirroring the right-facing body atlas; the runtime switches the catch and finish hands while preserving Reed’s face, braids and uniform.
- Reed-specific ball track: `src/core/animation.js`, key `alley-oop-reverse`; catches at tick10, tracks the turn behind the crown, remains carried through tick20 and releases at tick21. The frame anchors are takeoff4, grab10, peak14, release21, finish23 and land30.
- Gameplay/sprite regression coverage: `tests/animation.test.js` and `tests/animation-sprites.test.js`.

## Visual review and validation state

Standard and zoom120 native previews are in `artifacts/native-render-preview/reed-ashcroft/` and `artifacts/native-render-preview/reed-ashcroft-zoom120/`. Each preview load registered art for 164 images and captured 87 clip snapshots plus 452 action frames. Both capture sets include all fifteen poses in each facing; screenshots `left-alley-oop-reverse.png` and `right-alley-oop-reverse.png` were visually reviewed for catch-hand alignment, reverse carry and release.

Focused tests passed at 81/81 sprite cases and 150/150 animation cases. The J.73 audit state is 636 decoded clips, 5,503 authored drawings, 2,467 missing clips, three target shortfalls, and four older `prompt-not-verbatim` findings across the 105-athlete roster. Full suite, build, lint, content validation, league simulation, packer checks and full-match browser E2E have not yet been rerun for J.73. The latest deployed build remains J.72 (`9655cfd`, Pages run #111). J.73 source commit `0cc5afc` is available on `origin/codex/j73-reed-reverse`; it has not been merged to `main` or deployed.
