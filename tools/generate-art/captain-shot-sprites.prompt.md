# Captain jump-shot atlas

- Output: `public/assets/captain-shot-sprites.png` (RGBA, 1484×1060; 7×5, 35 captain slots)
- Source: ImageGen edit based on `public/assets/captain-gameplay-sprites.png`.
- Mapping: manifest order; each captain keeps the same identity/anatomy and performs a jump-shot release follow-through.
- Runtime: replaces that athlete's base pose while simulation animation is `charge` or `shoot`.

## Prompt

Create a transparent RGBA 2D game sprite atlas edit from this exact 7-column by 5-row sheet of 35 original fictional basketball captain characters. Preserve every cell and exact row-major roster identity. Redraw each same character in a clear jump-shot release pose: body rising off the floor, one arm extended upward in follow-through, other arm guiding, legs tucked naturally. No basketball, no background, no floor or shadows, no text, no borders, no merged cells, no extra characters. Keep the complete body inside each cell and retain alpha transparency and clear gaps. Preserve each character's precise uniform colors, face, skin/fur/scales, hair, accessories and species anatomy; especially fox Paprika with four legs, Dragon Queen as a four-legged winged dragon with tail, Suga's hood/coils, compact wombat Steeb, spotted jaguar GB, zebra/orangutan Quirky's long arms, and Alexithymia's blank display face. Consistent polished illustrated arcade sprite art, crisp edges, bold readable silhouette. Output same dimensions and grid alignment as reference.

ImageGen output was visually reviewed against the source sheet. Runtime derives cell size from the actual atlas dimensions.
