# Supporting athlete portrait atlas

## Output

- File: `public/assets/supporting-player-portrait-atlas.png`
- Source: ImageGen edit of `supporting-player-gameplay-sprites.png`
- Output: RGBA PNG, 1499×1049 px; 10 columns × 7 rows for 70 support-athlete bust portraits
- Mapping: row-major, two portraits per team, partner then alternate, matching `src/content/teams.js`
- Runtime: `rosterPortraitInfo` selects these busts for the 70 supporting-athlete HUD cards; the existing captain portrait atlas supplies the 35 captain portraits

## Generation prompt

Edit the transparent 10×7 support-athlete gameplay atlas into a head-and-shoulders portrait atlas. Preserve each existing figure's exact cell and left-to-right, top-to-bottom order. Every cell depicts the same athlete from the source, retaining face, skin tone, hair, headband, glasses, facial hair, team colors and overall identity. Use the source sheet as the per-cell reference. Use saturated late-1990s raster arcade art, chunky clear pixel clusters, cel-shaded faces, subtle print grain and cyan/magenta/gold rim light. Keep one bust with shoulders in each transparent cell; no labels, text, backgrounds, frames, courts, balls or invented signatures. Keep support players distinct from canonical captains.

The accepted output is 1499×1049 rather than the requested nominal 1500×1050. Runtime mapping divides the actual image dimensions evenly across its 10×7 grid. Do not rescale or crop programmatically; source order and transparency were reviewed in the generated sheet.

## Validation

`tests/supporting-portrait-atlas.test.js` checks RGBA PNG dimensions, transparency and visible bust art in all 70 cells. The offline builder embeds the atlas as a data URI.
