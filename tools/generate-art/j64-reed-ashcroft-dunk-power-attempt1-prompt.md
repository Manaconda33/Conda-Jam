# J.64 — Reed Ashcroft power dunk

## Generation prompt

Create one original 15-pose production basketball power-dunk sprite sheet for Reed Ashcroft, laid out as exactly 5 columns by 3 rows in strict row-major order. Use the attached Reed portrait and gameplay sprite as the identity references, and the existing Manaconda dunk sheet only as a guide to the project's 1990s arcade pixel-art style, sprite scale, and 15-pose action progression.

Reed is the same young adult human man in every pose: medium-brown skin, dark focused eyes and brows, a small dark goatee, dark purple-black braids gathered into his compact high topknot, and a natural athletic muscular build. Preserve his blank Chicago Condas uniform in deep purple with gold trim, white lower-leg wear, and purple-and-gold basketball shoes. Match the attached face, hair shape, body proportions, and colors. His braids stay attached to his head and trail naturally behind him; they are hair, never a cape, scarf, extra limb, or separate prop. No glasses, headband, armor, or fantasy anatomy.

Draw every figure in a consistent right-facing three-quarter view at one uniform camera scale. Every cell contains exactly one complete, distinct, independently articulated full-body Reed with clean transparent space on all four sides. Keep the same foot baseline in every cell because the game supplies jump height. Keep the whole topknot, braid tips, fingers, and shoes inside the sheet. Preserve true RGBA transparency; do not add a background, floor, shadow, glow, grid, panel, text, number, logo, hoop, rim, opponent, basketball, or other held object. His hands are empty in every pose; the game renders and tracks the basketball separately. Use crisp, richly colored 1990s arcade pixel-art clusters, bold readable edges, and clear muscle and cloth highlights.

Pose order, top row then left to right, followed by the next row:

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

Make all 15 silhouettes visibly different and connected as one coherent action. Do not duplicate, mirror, merge, crop, or transform a neighboring pose. Keep natural human hands, feet, joints, and limb lengths in every cell.

## References

- `tools/generate-art/references/reed-ashcroft-portrait-reference.png` — face and hair identity.
- `tools/generate-art/references/reed-ashcroft-gameplay-reference.png` — complete body, uniform, and colors.
- `public/assets/animation/reed-ashcroft-layup-right.webp` — Reed's accepted in-game sprite rendering.
- `public/assets/animation/manaconda-dunk-power-right.webp` — action sequence and project pixel-art style only; do not copy Manaconda's appearance.

## Provenance

Generation record, accepted-source hash, frame-isolation inspection, atlas hash, packing layout, mirror review, runtime ball-track review, and native preview results are recorded in `tools/generate-art/reed-ashcroft-dunk-power15-provenance.json` and the generated layout JSON.
