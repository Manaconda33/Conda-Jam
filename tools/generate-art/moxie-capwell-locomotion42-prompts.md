# Moxie Capwell — 42-frame locomotion source

## Canon references

- Portrait/gameplay identity: `public/assets/supporting-player-portrait-atlas.png` cell4 and `public/assets/supporting-player-gameplay-sprites.png` cell4; extracted references are `tools/generate-art/references/moxie-capwell-portrait-reference.png` and `tools/generate-art/references/moxie-capwell-gameplay-reference.png`.
- Existing attempts: `exec-ffd5c0d0-49c1-4cdc-a8bb-345c47198b55.png` has correct identity but only35 figures and touching source components; rejected for packing. Earlier wrong-identity attempt `exec-33d0859f-...` is also rejected.

## Image-generation prompt

Create one complete transparent PNG spritesheet with EXACTLY 42 separate full-body drawings of the same canonical basketball athlete, arranged in a clean reading-order grid of exactly 7 columns by 6 rows. Identity reference: the supplied close portrait of Moxie Capwell. She is an adult human woman with pale skin, lavender-purple eyes, very long thick lavender hair gathered into a high ponytail, and a small gold hair tie. Her uniform is purple and silver with white side panels, purple wristbands, and purple high-top shoes. Preserve this same face, hair silhouette, adult anatomy, and palette across all 42 drawings. She has ordinary human arms and legs, human hands, and human shoes.

Make polished 1990s arcade basketball sprite art with crisp pixel/cel shading and readable silhouettes, consistent scale and camera. Match the supplied gameplay reference's mature athletic proportions and detailed sprite rendering. The background is genuinely transparent RGBA only. Keep the antialiased edges clean with no red, blue, magenta or white halo fringe.

Each cell must contain exactly one complete figure, centered on a stable baseline, with wide transparent gutters between every cell. Keep every ponytail, hand, foot and shoe inside its own cell; no figure may touch, overlap, or share pixels with a neighbor. Leave a full transparent margin around the outer grid. No ground shadows, checkerboard, court, scenery, text, numerals, logos, borders, panels, basketball, or other props. Hands remain empty so the game draws the separate ball.

Map the 42 cells left-to-right, top-to-bottom into five coherent actions: cells1–6 quiet idle with subtle breathing/weight shifts; cells7–10 ball-ready idle with hands naturally placed to control the separate ball; cells11–20 low stationary dribble with ten distinct deep-bend poses and alternating reaches toward court level; cells21–31 fast running with eleven distinct alternating strides, visible foot lift, and arm swing; cells32–42 low dribble-running with eleven distinct forward-moving strides and one hand reaching low for the separately rendered ball. Keep the final eleven frames low enough for court-level bounces.

Exact grid order and complete anatomical separation are essential. Every cell contains a different pose of the same Moxie. Do not redesign her, substitute another character, bake in a ball, or crop any part of her body.
