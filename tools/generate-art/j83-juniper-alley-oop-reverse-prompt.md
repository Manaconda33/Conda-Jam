# J.83 — Juniper Vale reverse alley-oop

## Initial exact prompt

Create one original transparent RGBA production sprite sheet for Juniper Vale’s right-facing alley-oop-reverse action in JAMVERSE ’96. Match Juniper’s established game identity: compact natural human adult woman with warm light skin, focused dark eyes and brows, abundant dark-purple curls gathered into a high curly ponytail with a small gold tie, ordinary athletic human anatomy and realistic human hands, blank Chicago Condas deep-purple basketball uniform with gold trim, dark knee pads, white socks and purple-and-gold basketball shoes. Keep her face, hair, skin tone, build and uniform consistent in all poses. Use crisp chunky 1990s arcade pixel art, matching the body scale, palette, light and near-black/purple outlines of Juniper’s reviewed production sprites. Draw new action poses; do not reuse existing animation frames.

Output exactly one transparent RGBA sprite sheet arranged as five columns by three rows, with fifteen separate, complete, right-facing full-body Juniper drawings in strict row-major order. Use wide transparent gutters and generous clear margins. All figures must be entirely inside the canvas, never touching or overlapping. Preserve consistent pixel-art scale. Draw only Juniper. The gameplay supplies the basketball and hoop separately: no basketball, sphere, seams, hoop, rim, court, floor, cast shadow, ground haze, glow, effect, text, labels, border, teammate, opponent, equipment or prop may appear anywhere. Catch and release an invisible game ball using natural hands.

Pose 0: rightward approach, lightly bent knees, eyes tracking an incoming lob, both hands empty.
Pose 1: transition into takeoff, body rising, right arm reaching up, left arm balancing, both hands empty.
Pose 2: airborne high reach, right palm open toward the invisible lob, head and eyes tracking above the hand.
Pose 3: continue rising with right hand open and ready, left arm counterbalancing; no ball.
Pose 4: fully extended overhead reach, right palm open toward the incoming invisible lob; no ball.
Pose 5: overhead catch at the apex, fingers close naturally around the invisible lob, both arms raised; no visible object.
Pose 6: draw the invisible ball into a compact two-hand shoulder/chest gather; keep Juniper’s face visible and both hands empty.
Pose 7: begin rotating shoulders and hips away from the rim, maintaining a close invisible-ball gather at the shoulder.
Pose 8: turn farther away, carrying the invisible ball behind the crown with the right hand; clearly show the back/side shoulder turn.
Pose 9: reach the reverse apex, right elbow and hand loaded behind the crown, face partly visible in profile, left arm balancing.
Pose 10: one backward-over-shoulder reverse release, right arm extending behind and across the shoulder; the hand releases an invisible ball.
Pose 11: complete the single release with an extended empty right hand, body still turning away from the rim.
Pose 12: empty-handed follow-through, shoulders unwind, torso descends, arms naturally separating.
Pose 13: continue descending, both hands empty, knees preparing for landing.
Pose 14: balanced two-foot landing, upright recovery, both hands empty.

The action must read clearly as a reverse alley-oop: empty-handed approach, high invisible catch, compact face-visible gather, turn away from the rim, invisible ball carried behind the crown, exactly one backward-over-shoulder release, empty-handed follow-through and balanced landing. Keep Juniper unmistakably human and consistent with her compact canonical proportions. Do not alter hair, uniform, skin or footwear. Keep silhouettes separated, clean near-black/purple outlines, true transparent empty space outside each athlete, no external fringe, speckles or shadow haze. Return only the transparent sprite sheet.

## Generation history

- Initial generation `exec-7129c697-fe46-4458-8320-7bb0a11121a5`, raw source `tools/generate-art/sources/j83-juniper-alley-oop-reverse-generated-raw.png`, SHA-256 `c5fef41cee1d1d87ba141a05e80137c50f4a973d59d27451d8b7cd1ea339c43c`, 1536×1024 RGB. The 15 poses and Juniper identity are usable, but the background is an opaque checker pattern, so it is rejected for production pending a transparency-only correction.

## Transparency correction exact prompt

The source sheet has the correct fifteen ordered Juniper poses and identity, but its gray-and-white checker pattern is baked in as opaque RGB pixels. Edit this exact sheet. Preserve every character pixel, pose, silhouette, uniform detail, color, outline, body proportion, facial feature, hand position, spacing and framing exactly as shown. Remove only the checkerboard background and convert those background pixels, including the spaces between figures, to true alpha-zero transparency. Do not redraw, stylize, recolor, move, resize or alter Juniper or any pixel inside an athlete silhouette. Keep the 1536×1024 canvas. Do not add any object, shadow, glow, text or pattern. Return only the same sprite sheet with true transparent RGBA outside all fifteen figures.

- Transparency correction `exec-dfc0ac95-4e77-49ef-803a-e65271847677`, raw `tools/generate-art/sources/j83-juniper-alley-oop-reverse-correction-generated-raw.png`, SHA-256 `bead266c0ef136a8d36ee3228b4addeaacee0eae82bbbf94f86614e448c68331`. It has true alpha-zero background and preserves the sequence, but pose margins are too tight (18px bottom,20px right and27px top); retained and rejected before packing.

## Margin correction exact prompt

The reference contains the right fifteen Juniper poses and true transparent background, but some figures come too close to the sheet edges. Keep the exact fifteen action poses and strict row-major order. Preserve Juniper’s face, hair, skin, uniform, shoes, anatomy and each pose’s silhouette and hand positions. Do not add a ball or any other object. Uniformly scale each complete figure down to about70% of its current size, without stretching or changing poses. Rebuild the transparent 1536×1024 sheet as five columns by three rows: center one complete figure in each cell, with at least48 transparent pixels between the sheet edge and every silhouette and at least24 transparent pixels between neighboring silhouettes. Keep true alpha-zero pixels everywhere outside the figures; do not add a checkerboard, colored backdrop, shadow, haze, glow, text or border. Return only the corrected transparent RGBA sheet.

- Margin correction `exec-2f09579f-02a2-4270-9eef-23e12ab734f1`, raw `tools/generate-art/sources/j83-juniper-alley-oop-reverse-margin-generated-raw.png`, SHA-256 `53ee70be44d2743f50ccab0f588ca24c6514b10742ddc91e1c5a88c0ae2f5be1`. The source is transparent and has15 distinct components, but its tightest silhouette clearances are43px right and45px top, below the48px minimum. It is retained as rejected.

## Final margin correction exact prompt

This reference has the correct fifteen Juniper poses and transparent background but does not meet the required clear margins. Preserve the same fifteen full-body poses, Juniper identity, costume, colors, hands and row-major order. Uniformly reduce every complete athlete figure to 60% of its current size, without stretching the body or changing the pose. Lay out five columns by three rows on the same 1536×1024 transparent canvas. Center each athlete in a separate cell with at least60 pixels of true alpha-zero clearance from every canvas edge and at least36 pixels of transparent space between neighboring silhouettes. Keep all fifteen figures complete and distinct. Remove no athlete pixels. Add no ball or object, background, checkerboard, shadow, glow, haze, effects, text or border. Return only this transparent RGBA sprite sheet.

- Final-margin candidate `exec-367b29bf-c66f-4667-b2cf-d5cb50076ec9`, raw `tools/generate-art/sources/j83-juniper-alley-oop-reverse-final-generated-raw.png`, SHA-256 `f80b50c0b48c791748da9801b9dc7a45d0602b6b24070d167c36fd3c2426402f`. It contains15 distinct transparent figures, but the tightest right clearance is50px, short of the60px prompt requirement. Retained and rejected before packing.

## Clear-space correction exact prompt

Keep the exact fifteen Juniper poses and identity shown in the reference. This is a spacing correction only. Uniformly scale each entire figure to about50% of its current dimensions and center all fifteen in five columns by three rows on a transparent 1536×1024 canvas. Preserve proportions, face, ponytail and gold tie, uniform, knee pads, socks, shoes, pose order and all gestures. Ensure every silhouette has at least80 transparent pixels to the canvas edge and at least48 fully transparent pixels between every neighboring pair, including diagonally. Each pose must be complete and separate. Retain true alpha-zero outside the silhouettes. Add no ball, props, background color or pattern, shadow, haze, effects, text or border. Return only the transparent sheet.

- Spacing candidate `exec-bdad8ad8-02b2-47fe-879c-60a5be0a4947`, raw `tools/generate-art/sources/j83-juniper-alley-oop-reverse-spaced-generated-raw.png`, SHA-256 `85d0bc381ea43afccfb2079505ff92b27e5030bcbcd3ba730213bd3186d04630`. It retains15 components but still leaves a50px right margin; alpha below2 also includes a faint outer haze. Retained and rejected for final spacing/edge cleanup.

## Final edge-clearance exact prompt

Make only these two corrections to this exact fifteen-pose reference sheet: move the five complete figures in the rightmost column exactly35 pixels to the left, preserving all their pixels and poses, and remove only nearly transparent (alpha1) exterior haze outside the fifteen silhouettes. Preserve all other poses, character pixels, sizes, colors, spacing, row-major order, true alpha transparency and the 1536×1024 canvas. Do not redraw or alter Juniper. After the move, the rightmost figures must have at least80 pixels of transparent clearance from the canvas edge. Keep all fifteen figures separate, with at least36 transparent pixels between neighboring silhouettes. Add no ball, props, background, shadow, haze, effects, text or border. Return only the corrected transparent RGBA sheet.

- Edge-clearance edit `exec-1f3402ac-6813-42b1-9302-66c0b2d069a3`, raw `tools/generate-art/sources/j83-juniper-alley-oop-reverse-edge-generated-raw.png`, SHA-256 `d890a9efd8a7cfaad3f5969769b9433d743a86f23469300f56e91621846901ed`. It preserves15 complete components and provides clear canvas margins62px left,47px top,72px right and50px bottom. The requested80px minimum was not reached on top/bottom, but all figures remain separated and fully in bounds; the reviewed47px minimum exceeds the40px clear-margin floor accepted in prior production sheets. Accepted for cleanup and packing. The existing halo-cleanup script removed55,496 exterior pixels, including2,135 vivid-red/coral pixels, without changing character-core pixels. Accepted cleaned source SHA-256: `1f936c32041acbdafe9c0ff5b6497a01061d008f56f2852ce3f547ecb2653094`.
