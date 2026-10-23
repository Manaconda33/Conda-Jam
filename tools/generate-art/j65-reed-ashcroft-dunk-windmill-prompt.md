# J.65 — Reed Ashcroft windmill dunk

## Generation prompt

Create one original 15-pose production basketball windmill-dunk sprite sheet for Reed Ashcroft, exactly five columns by three rows in strict row-major order. Use the attached Reed portrait, gameplay sprite and accepted power-dunk atlas as the identity references. The Manaconda windmill atlas is only a guide to the circular arm action and the game's 1990s arcade pixel-art style; do not copy Manaconda's appearance.

Reed is the same young adult human man in every pose: medium-brown skin, dark focused eyes and brows, small dark goatee, dark purple-black braids gathered into the compact high topknot, and natural athletic muscular build. Preserve the blank Chicago Condas uniform in deep purple with gold trim, white lower-leg wear, and purple-and-gold basketball shoes. Match his face, hair, body proportions, and colors to the attached Reed references. His braids stay attached to his head and trail naturally behind him; they are hair, never a cape, scarf, extra limb, or separate prop. Do not add glasses, headband, armor, fantasy anatomy, numbers, or logos.

Draw fifteen complete and distinct full-body right-facing three-quarter poses, one per cell, separated by transparent space. Keep a consistent character scale and camera. Keep the entire topknot, braid tips, fingers, shoes, and outlines within the sheet and separate each silhouette from every neighbor. Preserve a shared foot baseline because the game adds the jump height. Use crisp richly colored 1990s arcade pixel-art clusters, bold clean outlines, and readable muscle and cloth highlights. The background must be true RGBA transparency. Do not draw a floor, shadow, glow, backdrop, grid, tile boundary, text, hoop, rim, opponent, basketball, or any other held object. Both hands stay empty; the game renders and tracks the basketball separately.

Windmill action: Reed completes one broad right-arm circle from the gather beside his waist, behind his shoulder, down past his hip, low beside his knee, forward across his torso, up past his shoulder and overhead, then forward/down into the dunk release. His torso turns naturally with the sweep. His left arm balances the rotation. Keep the right arm attached at the shoulder with natural human joints and proportions; never stretch, detach, or duplicate it. The ball is invisible in the sprite and follows the right hand as a separate game object.

Exact pose order, top row left to right, then the second and third rows:

0. Balanced approach stance with the right hand near the waist and the left hand relaxed.
1. Deep knee gather; right hand lowers toward the right hip as the shoulders coil.
2. Takeoff from one foot, one knee lifting, right arm beginning its backswing.
3. Airborne backswing, right arm extends behind the shoulder at shoulder height.
4. Continue the circle down behind the hip, torso rotating with the arm.
5. Right hand sweeps low behind the hip and beside the knee; the left arm counterbalances.
6. Right hand rounds forward below the waist, still attached at the shoulder.
7. Peak at the flight apex; right arm circles upward in front of the chest, legs naturally spread for balance.
8. Right hand rises past the shoulder as the circle continues.
9. Right arm reaches fully overhead and forward toward the imaginary rim.
10. Release pose: the right arm whips forward/down with a clear wrist snap toward the rim. Hands stay empty.
11. Finish follow-through with the right arm drawn down and the left arm balancing, still airborne.
12. Descend with knees folding and arms moving forward to prepare for landing.
13. Land in a deep two-foot knee bend.
14. Recover to a stable upright basketball-ready stance.

All poses must be visibly different, anatomically natural and in this order. Do not duplicate, mirror, merge, crop, touch or overlap figures. No ball or other object is drawn.

## References

- `tools/generate-art/references/reed-ashcroft-portrait-reference.png` — face and hair identity.
- `tools/generate-art/references/reed-ashcroft-gameplay-reference.png` — full-body design and kit.
- `public/assets/animation/reed-ashcroft-dunk-power-right.webp` — accepted Reed identity, pixel scale and body anatomy.
- `public/assets/animation/manaconda-dunk-windmill-right.webp` — windmill-arm sequence and project style only; do not copy Manaconda's face, body, accessories, or colors.

## Provenance

Generation record, accepted-source hash, source crops, atlas hash, mirror review, athlete-specific ball track, and standard/zoom120 native previews are recorded in `tools/generate-art/reed-ashcroft-dunk-windmill15-provenance.json` and its generated layout JSON.
