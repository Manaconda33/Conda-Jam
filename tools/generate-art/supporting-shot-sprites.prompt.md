# Supporting-athlete jump-shot atlas

- Output: `public/assets/supporting-shot-sprites.png` (RGBA, 1500×1049; 10×7, 70 support-athlete slots)
- Source: ImageGen edit based on `public/assets/supporting-player-gameplay-sprites.png`.
- Mapping: team/partner/alternate manifest order.
- Runtime: replaces that athlete's base pose while simulation animation is `charge` or `shoot`.

## Prompt

Create a transparent RGBA 2D game sprite atlas edit from this exact 10-column by 7-row sheet of 70 original fictional basketball supporting athletes. Preserve every cell and exact row-major roster identity. Redraw each same character in a clear jump-shot release pose: body rising off the floor, one arm extended upward in follow-through, other arm guiding, legs tucked naturally. No basketball, no background, no floor or shadows, no text, no borders, no merged cells, no extra characters. Keep the complete body inside each cell and retain alpha transparency and clear gaps. Preserve each character's precise uniform colors, face, skin tone, hair and accessories. Consistent polished illustrated arcade sprite art, crisp edges, bold readable silhouette. Output same dimensions and grid alignment as reference.

ImageGen output was visually reviewed against the source sheet. Runtime derives cell size from the actual atlas dimensions.
