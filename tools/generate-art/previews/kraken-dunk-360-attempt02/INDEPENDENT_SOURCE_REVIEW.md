# Independent source review — Kraken dunk-360 attempt02

**Verdict: reject as a complete dunk source.** The sheet has a clear rotating/inverted airborne sequence and usable Kraken figures, but it does not complete the dunk: the final frames stay in raised-arm poses and omit the forceful extension/contact/follow-through. The raw also misses the requested pixel-art style and strict cell containment.

## Provenance

- Raw source: `tools/generate-art/sources/kraken-dunk-360-attempt02-generated-raw.png`
- SHA-256 verified: `c572f7028c9fd46e81232139f58286b214a4a23c285502919bdabaa414c7432e`, matching `tools/generate-art/kraken-dunk-360-attempt02-provenance.json`.
- Prompt SHA-256 verified: `a631244cc331661c142bd4d3be64ae8b0fda7b54886fd1da68bc7a24e1227334`.

## Findings

- **Alpha/background:** RGBA 1536×1024. Sampled corners and gutters are alpha 0; the brown tone in the raw viewer is hidden RGB beneath transparent pixels, not a baked opaque backdrop. Edges are antialiased (alpha 0–254) and need cleanup.
- **Figures and cell layout:** There are 15 large, separate full-body figures. Identity is consistent: warm natural skin, auburn hair, pointed ears, copper pendant, burgundy/copper uniform, dark socks and burgundy shoes. No ball/prop is visible. However, several components cross nominal 5×3 cell boundaries: top-row column 2 reaches x=630 past x=614; multiple middle-row figures begin 3–11 px above y=341; bottom-row figures begin as high as y=659, 24 px above y=683. Fixed-cell extraction would crop or misassign parts. Global component extraction could retain the 15 figures, but it cannot fix the action defects.
- **Rotation/action:** The middle row turns from front/three-quarter to back, then to an inverted pose and back toward the front. This makes the 360 rotation visible, though it reads partly as a backflip/inversion rather than a smooth vertical spin. The crucial ending is absent: one-based frames 11–13 do not show a clear forceful downward dunk extension, rim contact, and separate follow-through. Frames 11 and 12 are both raised-arm reach poses; frame 13 transitions to a crouch instead of a clear post-release follow-through. This blocks the requested dunk sequence.
- **Anatomy:** All 15 main figures appear full-body with plausible limbs and shoes; the inverted pose is unusual but not visibly missing anatomy. The 15 components remain separate at alpha thresholds 16, 64 and 128.
- **Pixel style:** The raw is smooth, shaded illustration with antialiased contours rather than hard-edged limited-palette pixel art. A reduction/quantization pass might pixelate it, but it should not proceed as a complete clip while the final dunk beats are missing.

The rotation poses may be retained as references for a targeted revision. Generate or replace the final dunk-contact and follow-through beats, then review the sequence and pixel-style derivative before any gameplay trial.
