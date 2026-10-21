# Supporting-athlete run-pose atlas

- Output: `public/assets/supporting-player-run-sprites.png` (RGBA, 1500×1049; 10×7, 70 support-athlete slots)
- Source: ImageGen edit using `public/assets/supporting-player-gameplay-sprites.png` as the identity and cell-order reference.
- Mapping: row-major, two support athletes per team in roster order.
- Runtime: this is the first frame in a four-step movement cycle with the two supplemental keyframes in `run-cycle-keyframes.prompt.md`.

## Prompt

Create a transparent PNG sprite atlas edit based on this exact 10-column by 7-row sheet of 70 original fictional basketball character full-body sprites. Preserve the exact grid, 70 identities, anatomy, clothing, team colors, hairstyles, facial features, signature accessories, scale, and cell order from the reference. In every cell redraw that same athlete in one clearly distinct dynamic sprint/run pose, leaning forward with one leg extended and one arm driving. No text, no court, no shadows outside the sprite, no borders, no merged cells, no extra sprites. Transparent background. Keep each character fully contained within its original cell with clear transparent gaps. Crisp detailed 2D arcade sports game sprite illustration with bold readable silhouette and vibrant painted cel shading. Preserve every original character's species, body shape, skin tone, hair, and uniform details exactly. Output dimensions and alignment should match the reference atlas.

The ImageGen output was visually reviewed against its source. Runtime computes each cell from the atlas dimensions and cycles through four timed frames during movement.
