# J.85 — Keeg chest pass

## Initial exact prompt

Create one original production sprite sheet for Keeg’s right-facing `pass` action in JAMVERSE ’96. Match Keeg’s canonical Moonmorel Hex identity in the supplied sprite references: an adult human man with black hair and a neatly trimmed close black beard; an extremely tall ornate purple witch hat with silver trim and small mushroom ornaments; layered lavender, purple and silver athletic cloth, belts, jewelry and occult detailing. Keep his normal human athletic anatomy, face, beard, hair, hat height and silhouette, mushrooms, uniform palette and body proportions consistent in all six drawings. The hat must be fully visible, intact and uncropped in every pose. No horns, white beard, cloak, staff, spell effects, different character or permanent magic.

Output exactly one transparent RGBA sprite sheet, canvas 1536×1024, arranged as three columns by two rows. Draw exactly six separate, complete, right-facing full-body Keeg poses in strict row-major order. Each cell contains one whole figure and broad transparent gutters; use a consistent readable arcade sprite scale and leave generous outer margins, especially above the tall hat. Do not let a figure touch the canvas edge, cross a cell boundary, overlap another pose, or lose any body part.

The basketball is rendered by the game as a separate object. Every hand is empty: do not draw a basketball, circle, sphere, ball seams, hoop, rim, court, floor, cast shadow, aura, text, number, logo, grid, border, teammate, opponent, staff, spell, prop or other object anywhere. Hands may mime a chest-height ball in the gathering poses but there must be clear empty air between them. This is a crisp, chunky, original 1990s arcade sports sprite sheet, not a painted poster: clean dark contours, solid colors, readable limb positions and alpha-zero transparency outside the figures. Return only the transparent sprite sheet.

Pose 0: planted balanced ready stance, knees relaxed, both empty hands open near the lower chest, eyes toward a teammate ahead.
Pose 1: dip slightly through the knees and draw empty hands toward the sternum, elbows comfortably bent for a two-hand chest pass.
Pose 2: gather and load the chest pass; torso rotates a little, shoulders brace, both empty hands remain separated at chest height.
Pose 3: at the `pass` release anchor, simulation tick5, step and extend both arms forward together from the chest; wrists and fingers open in a clear empty-handed release. Keep the hat out of the arm path.
Pose 4: follow through with both arms extended forward, palms open and fingers naturally spread, shoulders and leading foot showing the delivery.
Pose 5: recover to a stable balanced ready stance with both empty hands lowering naturally and feet planted.

Make all six drawings visibly different and mechanically continuous in the order gather, load, deliver, release at pose3, follow through and recover. Keep Keeg’s human face, black hair, neatly trimmed beard, tall purple hat with silver trim and mushroom ornaments fully readable in all poses. Do not draw a ball in any frame; game code supplies the separate ball and its flight. Return exactly six complete figures and nothing else.

## Generation history

- First generation `exec-30af1187-14cb-472d-8841-0a579e014a51`, raw `tools/generate-art/sources/j85-keeg-pass-generated-raw.png`, SHA-256 `ff44b9ce6a5cb6e885473a52bfdf891ced6ffead5cc562ee00114023e6a5828f`. Visually accepted for identity, pose sequence and empty hands; layout correction required because pose3 in the bottom-left cell came within4px of that cell's right boundary.

## Cell-margin correction exact prompt

This accepted six-pose Keeg chest-pass sheet is anatomically good and contains no visible basketball. Correct one layout defect only: the figure in pose3, the bottom-left cell with both arms extended for the release, reaches to within four pixels of the right edge of its own cell. Shift the entire pose3 drawing 44 pixels left, keeping its full size and keeping every hand, hat, arm and foot inside the bottom-left cell. Its leftmost foot currently has 95 pixels of margin, so the shift still leaves ample left clearance. Re-center the full pose in its own cell as a whole; do not bend or crop anything. Preserve the transparent 1536×1024 RGBA 3-column by 2-row sheet, exact row-major order, all other five pose pixels and spacing, and all Keeg identity details: normal human anatomy, black hair, trimmed black beard, extremely tall intact purple witch hat with silver trim and mushroom ornaments, layered purple/lavender/silver kit, jewelry and matching body scale. Keep all six hands empty; no ball, circle, sphere, seams, prop, floor, glow, background, shadow, text or other addition anywhere. Keep the existing successful six chest-pass poses and their drawing order. Return only the corrected transparent sheet.

- Layout correction `exec-29254ac3-4c01-43af-b644-67ca287cb3f1`, raw `tools/generate-art/sources/j85-keeg-pass-correction-generated-raw.png`, SHA-256 `f747ecd9da30b5dc0d6a5db6a429234b7a238f178a345acc953e6aa150098ef3`. Accepted after visual review: pose3 moved left to open a broad gutter; six complete bodies remain, the delivery/release/follow-through sequence reads clearly, Keeg’s face/beard/mushroom hat stay recognizable, and all hands remain empty.
