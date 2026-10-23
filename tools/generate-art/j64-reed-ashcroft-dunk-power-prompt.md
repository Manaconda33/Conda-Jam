# J.64 — Reed Ashcroft power dunk

## Generation prompt

Create a clean original 15-pose production basketball power-dunk sprite sheet for Reed Ashcroft. The supplied first image is the pose-sequence reference only; the attached Reed portrait, gameplay sprite, and accepted Reed layup atlas define his identity and sprite rendering. The Manaconda dunk atlas is only a guide to the game's 1990s arcade pixel-art treatment and action timing; do not copy Manaconda's appearance.

The sprite sheet has exactly 5 equal-width columns and 3 equal-height rows, with exactly one complete Reed figure centered in each cell in strict row-major order. Treat every cell as an isolated drawing area. Keep each entire silhouette—including braid tips, fingers, shoes, and every outline pixel—within the middle 72% of its cell width and middle 76% of its cell height. Leave at least 12% of each cell genuinely transparent on every side. No figure may touch or cross a cell boundary, and no pose may overlap or merge with another. Make the body scale consistent across all 15 cells; only natural limb posture may change. Use one shared foot baseline for all poses because the game supplies jump height.

Reed is the same young adult human man in all cells: medium-brown skin, dark focused eyes and brows, a small dark goatee, dark purple-black braids gathered into his compact high topknot, and a natural athletic muscular build. Match his face, hair shape, body proportions, and colors to the Reed references. His braids stay attached to his head and trail naturally behind him; they are hair, never a cape, scarf, extra limb, or separate prop. He wears the blank Chicago Condas uniform in deep purple with gold trim, white lower-leg wear, and purple-and-gold basketball shoes. No glasses, headband, armor, or fantasy anatomy.

Use a consistent right-facing three-quarter view, crisp richly colored 1990s arcade pixel-art clusters, bold readable edges, and clear muscle and cloth highlights. Preserve real RGBA transparency, alpha 0 outside the sprites. Do not draw any background, floor, shadow, glow, grid, tile boundary, panel, lettering, number, logo, hoop, rim, opponent, basketball, or held object. Both hands are empty in every pose; the game renders the basketball separately.

Strict pose order, top row left to right, then the second and third rows:

0. Balanced ready stance, feet apart, hands low and relaxed.
1. Lower into the gather, knees bending and empty hands moving toward the waist.
2. Deep power gather, hips low, elbows bent and shoulders coiled.
3. Drive upward from both legs, torso rising and arms beginning to lift.
4. Takeoff with one knee lifted, the other leg extending, hands rising in front of the chest.
5. Continue upward, knees drawing in and both arms lifting above the head.
6. High ascent, both hands raised, body elongated and eyes focused ahead.
7. Apex preparation, knees folded naturally and hands high.
8. Peak power pose, legs spread for balance, both arms raised overhead.
9. Reach toward the imagined basket with the right arm high and forward, left hand open for balance.
10. Extend the right arm farther toward the rim, open guide hand visible, body moving forward.
11. Release anchor: right wrist snaps down from the imagined rim while the other arm balances. Hands remain empty.
12. Forceful finish: right arm follows down, torso extends, legs uncurl.
13. Descend from the finish, arms lowering and knees folding to absorb landing.
14. Land in a deep two-foot bend and settle into a stable athletic stance.

All 15 figures must be fully visible, anatomically natural, individually articulated, visibly distinct, and correctly ordered. Do not duplicate, mirror, merge, crop, clip, or transform a neighboring pose. Return only the transparent sprite sheet.

## References

- `tools/generate-art/references/reed-ashcroft-portrait-reference.png` — face and hair identity.
- `tools/generate-art/references/reed-ashcroft-gameplay-reference.png` — complete body, uniform, and colors.
- `public/assets/animation/reed-ashcroft-layup-right.webp` — Reed's accepted in-game sprite rendering.
- `public/assets/animation/manaconda-dunk-power-right.webp` — action sequence and project pixel-art style only; do not copy Manaconda's appearance.
- `tools/generate-art/sources/j64-reed-ashcroft-dunk-power-attempt1-rejected-tight-gutters.png` — pose sequence only; rejected for cropped/tight cell margins.

## Provenance

The prompt chain is preserved in `j64-reed-ashcroft-dunk-power-attempt1-prompt.md`, this file, `j64-reed-ashcroft-dunk-power-attempt3-edit-prompt.md`, and `j64-reed-ashcroft-dunk-power-final-prompt.md`. The first three sheets remain under `tools/generate-art/sources/` as rejected attempts. The accepted-source hash, component-isolation inspection, atlas hash, packing layout, mirror review, runtime ball-track review, and native preview results are recorded in `reed-ashcroft-dunk-power15-provenance.json` and `reed-ashcroft-dunk-power15-layouts.json`.
