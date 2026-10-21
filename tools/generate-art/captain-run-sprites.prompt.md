# Captain run-pose atlas

- Output: `public/assets/captain-run-sprites.png` (RGBA, 1484×1060; 7×5, 35 captain slots)
- Source: ImageGen edit using `public/assets/captain-gameplay-sprites.png` as the identity and cell-order reference.
- Mapping: row-major, one run pose for each canonical captain in league manifest order.
- Runtime: the original run atlas is the first frame in a four-step movement cycle with the two supplemental keyframes in `run-cycle-keyframes.prompt.md`.

## Prompt

Create a transparent PNG sprite atlas edit based on this exact 7-column by 5-row sheet of 35 original fictional basketball character full-body sprites. Preserve the exact grid, 35 identities, anatomy, clothing, colors, hairstyles, signature accessories, scale, and cell order from the reference. In every cell redraw that same athlete in one clearly distinct dynamic sprint/run pose, leaning forward with one leg extended and one arm driving, with a basketball only if the reference character already has one (prefer no added ball). No text, no court, no shadows outside the sprite, no borders, no new props, no merged cells, no extra sprites. Transparent background. Keep each character fully contained within its original cell with clear transparent gaps. Crisp detailed 2D arcade sports game sprite illustration with bold readable silhouette and vibrant painted cel shading. Strictly preserve unusual identities and anatomies: Paprika is a four-footed fox, Dragon Queen is a four-legged dragon with wings and tail, Suga has a cobra hood and coiled body, Steeb is a compact wombat, Quirky has zebra/orangutan traits and long arms, Alexithymia has a blank display face, Manaconda has backwards driftwood signature. Output dimensions and alignment should match the reference atlas.

The ImageGen output was visually reviewed against its source. Runtime computes each cell from the atlas dimensions and cycles through four timed frames during movement.
