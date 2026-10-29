# Kraken alley-oop-power attempt09 — independent source review

**Verdict: reject for production; retain as a pose reference.** The raw has 15 distinct figures, true transparent gutters, and a generally readable catch-to-dunk sequence. Its painterly rendering does not match Kraken's crisp pixel-art style, and a few cells have little to no padding at one edge.

## Provenance and alpha

- Raw: `tools/generate-art/sources/kraken-alley-oop-power-attempt09-generated-raw.png` (1536×1024 RGBA), generation ID `exec-acc4c354-79ac-4caa-a8ff-b08eeedf16b0`.
- Raw SHA-256 `134c514b8266ae45844ce2a858241e9283ff5dba9693042797086ba552838d68` and prompt SHA-256 `3a942eee85b5a471a1f4c6e0c7718a29146f0053722a21a6dc42889079aa4585` match provenance.
- The background is genuinely transparent: tested inter-cell samples are alpha 0, and light/dark composites show clean negative space with no baked backdrop. The alpha range is 0–254; low-alpha pixels occur around figure edges, and 31 very faint pixels (max alpha 1) touch the bottom canvas edge. Check for edge softness after reduction, but there is no broad background haze.

## Art review

- **Count and action sequence: pass.** There are 15 row-major figures. The sequence reads from ready/approach through gather, plant and takeoff, then rising reach, open-hand aerial catch, two-hand overhead control, downward extension, follow-through/descent, landing crouch and upright recovery. The catch (frame 10) is clearly open-handed; the two-hand transfer (frame 11) and downward action (frame 12) are distinct. The final three poses separate descent, landing and recovery.
- **Cell boundaries: mostly pass.** At alpha ≥16, each of the 15 main silhouettes forms a separate component contained in its nominal 5×3 cell; no figure crosses into another cell. Most have visible padding. Some bounds touch the grid edge: row 1 columns 3 and 4 touch the bottom edge; row 2 column 1 touches the bottom edge; row 2 columns 3 and 4 start at the top edge; row 3 column 1 starts at the top edge. These can be cropped without cutting the main silhouette, but leave no spare padding at those edges.
- **Identity and anatomy: pass at source scale.** The same warm-skinned auburn-haired elf with pointed ears, copper pendant, burgundy/copper uniform, dark socks and burgundy shoes is consistent across the sheet. No ball is baked in. Limbs, hands, heads and shoes appear complete and connected.
- **Style: fail, decisive.** The figures use blended muscle and clothing gradients, fine painted detail, and smooth antialiased contours. This is not the hard-edged, limited-palette pixel art used by Kraken's production sprites. The softness will be more noticeable after reduction to gameplay cell size.

No production files were changed.
