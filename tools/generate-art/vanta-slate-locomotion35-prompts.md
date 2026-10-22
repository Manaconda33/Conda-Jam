# Vanta Slate locomotion generation record

## Raw base-source prompt

Create a production sprite atlas for JAMVERSE '96, using the attached portrait and gameplay references as the exact identity guide for Vanta Slate. He is an adult human man with pale skin, short thick textured silver-white curls, strong dark eyebrows, visible gray stubble (not a full beard), broad athletic shoulders, and a black basketball uniform with vivid crimson-red and white trim and matching high-top shoes. Preserve masculine human anatomy and the same face, hair, build and uniform in every drawing. No ball, no extra players, no text, no numbers, no logos. Cleanly shaded 1990s arcade pixel-art raster with crisp readable silhouettes and full head-to-shoe bodies.

Exact contact-sheet layout: 7 columns by 5 rows = exactly 35 separate drawings, centered in equal invisible cells, fully contained, with transparent gaps so silhouettes never touch. Side-facing 3/4 view, facing screen-right in every cell. No gutters, grid lines, borders, background, labels, or extra body. Keep sprite scale and baseline consistent. Basketball shorts and high-top shoes.

Rows in reading order:
1) six subtly distinct relaxed idle stance drawings;
2) four ball-ready idle drawings, hands poised, empty hands because the game ball is separate;
3) ten low dribble cycle poses with alternating hand position and changing footwork (no ball drawn);
4) eight upright running poses with alternating arm and leg strides;
5) seven forward-leaning low dribble-run poses with different hand reach and successive footfalls.
All poses visibly different and anatomically coherent. True transparent alpha, no cropping. Do not depict any ball because it is a separate runtime sprite.

This candidate yielded34 connected components: six idle, four ball-ready, nine low-dribble components, eight run and seven dribble-run. The first low-dribble component visibly joins two neighboring drawings, so the whole ambiguous crop is excluded. The accepted source uses the eight individually separated low-dribble bodies plus two separately imagegen-authored drawings from the dribble supplement, as documented in `vanta-slate-locomotion35-assembly.json`.
