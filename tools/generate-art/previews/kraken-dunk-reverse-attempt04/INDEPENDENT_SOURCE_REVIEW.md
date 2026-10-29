# Independent source review — Kraken dunk reverse, attempt 04

**Verdict: the action sequence is promising, but the raw sheet is not ready for gameplay-candidate use.** Frames 8–11 are distinct and read as an inverted apex, cocked dunk arm, downward extension, and follow-through. The source misses the strict alpha, pixel-style, size, and cell-margin requirements.

## Prompt, provenance, and uniqueness

- Prompt: `tools/generate-art/kraken-dunk-reverse-attempt04-imagegen-prompt.txt`
- Prompt SHA-256: `e306c62cf582255322dc4ddb2e5dbfe9e0b099fd7abced1047240b5da5a51c52` (matches provenance)
- Raw source: `tools/generate-art/sources/kraken-dunk-reverse-attempt04-generated-raw.png`
- Raw SHA-256: `0f4199b0dfc401f0004d077266c3d3211465d7e628ec57dacecf340d4fe19e50` (matches provenance)
- Generation ID: `exec-e2e2b1c9-30e1-4975-ac29-fcc18d9fee93` (unique among the provenance files checked)
- The raw SHA-256 appears in only this Kraken generated-raw source, including comparisons with dunk-reverse attempts 01–03 and other Kraken raw sprites.
- Image properties: PNG, 1536×1024 RGBA.

## Findings

- **Transparency/alpha:** Empty areas are genuinely transparent, but 446,343 pixels have partial alpha (values 1–254), and none reach alpha 255. Faint nonzero-alpha traces reach cell boundaries. This fails the prompt’s hard opaque edge and no-semitransparency requirements.
- **Cell containment and scale:** Exactly 15 row-major full-body sprites are present. Several silhouettes have too little padding at alpha ≥128: pose 3 is only 2 px from its cell’s right edge; pose 9 is 7 px from the bottom; poses 11 and 12 are 14 px from an edge; pose 15 is 12 px from the top. These fall below the prompt’s 12% horizontal and 10% vertical margins. Faint alpha traces reach the boundaries of multiple cells. Many figures are also much taller than the requested 65% of cell height (about 222 px): pose 9 is about 306 px tall and pose 8 about 294 px.
- **Anatomy/identity:** All 15 figures read as complete, with head, torso, both arms/hands, both legs, and shoes visible. Kraken’s warm skin, auburn hair, pointed ears, copper pendant, burgundy/copper uniform, dark socks, and burgundy shoes remain consistent. No obvious missing or extra limbs.
- **Frames 8–11:** The four poses are clearly different. Pose 8 is unmistakably inverted with both legs high; pose 9 remains inverted in a different orientation with a bent arm behind the head; pose 10 rotates into a distinct downward arm extension; pose 11 is a separate extended follow-through with the arm reaching farther down and away. The reverse-dunk action reads without needing a visible ball.
- **Pixel style:** The dark outlines and color blocking are game-like, but the smooth detailed shading, soft alpha edges, and many shades do not meet the requested chunky, flat, limited-palette, hard-edged pixel style. No text or props are visible.

Review is limited to the raw source, exact prompt, and provenance. No cleanup or production registration was performed.
