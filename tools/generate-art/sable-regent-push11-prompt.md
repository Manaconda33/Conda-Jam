# Sable Regent — controlled push / press

- Canon references: `tools/generate-art/references/sable-regent-portrait-reference.png`, `tools/generate-art/references/sable-regent-gameplay-reference.png`.
- Source layout: eleven right-facing full-body poses in the first eleven cells of a 4-column × 3-row grid; bottom-right cell remains transparent.
- The orange basketball is separate runtime art; do not draw it, another athlete, or an opponent.

## Exact generation prompt

```text
Create an original JAMVERSE '96 basketball press/push sprite sheet. The sheet is transparent RGBA, 1536×1024, arranged as four columns by three rows in strict row-major order. It contains exactly eleven distinct complete full-body right-facing poses of the same Sable Regent, one in each of the first eleven cells; keep the bottom-right twelfth cell entirely transparent. Leave broad transparent gutters and canvas margins. Every pose is fully inside its own cell, never touching another pose. Keep consistent figure scale, face, hair silhouette, outfit, outlines, and shoe baseline where the action permits.

Use the supplied Sable Regent portrait and gameplay sprite as exact canon identity and game-art references. Sable is the same warm-brown-skinned adult human woman in every pose, with her recognizable face, black hair gathered back, distinctive red headband, natural athletic adult human anatomy, black and crimson Blackthorn Court Kings basketball uniform with crisp white trim, wristbands, knee pads, and basketball shoes. Preserve two arms, two hands, two legs, natural proportions, and her same kit colors. Do not turn her into another athlete or change her identity.

Animate one controlled one-arm defensive shove toward an unseen opponent. The opponent is not drawn; gameplay supplies other players. The ball is also separate runtime art and must never appear. Sable's hands are empty throughout; do not add a ball, extra person, hoop, court, floor, shadow, glow, lettering, numbers, logos, props, or contact marks. Keep her rear arm balancing naturally while the leading hand pushes; all visible fingers and limbs must be anatomically clear.

Eleven distinct poses in order: (0) balanced alert defensive ready stance, knees soft and hands open; (1) step toward the unseen target, lower her hips and lean forward; (2) rotate shoulders and draw the leading open hand back beside the chest, other arm counterbalancing; (3) plant the lead foot and drive from the rear leg, leading palm open; (4) extend the leading forearm forward while transferring body weight; (5) contact anchor: controlled shove at chest height, leading arm extended with open palm, rear foot driving, torso braced and focused gaze toward the unseen target; (6) hold the extended follow-through as shoulders and hips continue forward; (7) begin retracting the arm as momentum carries her forward; (8) take a recovery step and lower both arms; (9) regain a balanced defensive stance; (10) settle into the ready pose with a small natural weight shift. All eleven drawings must be visibly distinct, complete, cleanly separated, and correctly ordered.

Crisp limited-palette 1990s arcade basketball pixel art, clear chunky dark outlines, rich but controlled shading, not painterly, glossy, 3D, or photoreal. The background is genuinely transparent alpha-zero RGBA; no checkerboard or matte. Return only the sprite sheet.
```
