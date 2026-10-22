# Digger Finch J.24 locomotion source record

Portrait/gameplay identity references are source cell47 in `tools/generate-art/references/digger-finch-portrait-reference.png` and `tools/generate-art/references/digger-finch-gameplay-reference.png`. The roster identifies Digger Finch as a Lantern Hollow supporting player in the olive/amber team palette. The reference atlas shows an athletic adult human woman with fair warm peach skin, brown eyes, long abundant chestnut-brown curls in a high ponytail, and a green/gold uniform.

## Base sheet

- Imagegen output: `/workspace/generated_images/exec-cfdc60cd-9028-4ce9-8df5-52bb2ddf0799.png`
- Working copy: `tools/generate-art/sources/digger-finch-locomotion-base.png`
- Prompt sent verbatim:

> Create one polished transparent 2D character-art contact sheet for an arcade basketball production pipeline. Exactly 35 separate, complete full-body drawings of the SAME adult human woman athlete, in a clear 7-column by 5-row grid, strict left-to-right and top-to-bottom reading order. Each full figure must fit in its own cell with generous transparent gutters and outer margins; no cropped ponytail, hands or shoes, no touching or overlapping figures, especially at edges. Use the attached portrait/gameplay reference images to preserve her canonical look. Digger Finch: athletic adult human woman, fair warm peach skin, expressive brown eyes, long abundant chestnut-brown curls gathered into a high ponytail with textured braids, green basketball jersey and shorts with bright gold/yellow piping, matching dark/green court shoes. Preserve the same face, fair skin, brown eyes, large curly high ponytail, adult human anatomy, green-and-gold kit and shoes in every pose. Render as polished hand-painted 2D arcade sports art with clean, readable outlines. Row 1 poses 0-6: subtle relaxed upright idle variations. Row 2 poses 7-13: low stationary right-hand dribble poses with empty hands; game supplies the ball. Row 3 poses 14-20: distinct continuing stationary dribble and transition poses with varied arms, all hands empty. Row 4 poses 21-27: varied natural running strides. Row 5 poses 28-34: low forward dribble-run strides, right hand reaching down through different bounce stages, empty hand. Every pose is unique, natural and full body at a consistent scale with feet near the cell baseline. No basketball, text, numbers, labels, grid lines, floor, shadows, logos or effects. True transparent RGBA.

- Review: exactly35 alpha-separated complete bodies in a7 by5 grid; bounding rectangles cross because of the large ponytail, but the alpha components are distinct. Inspect/package isolates only existing antialias edges. Her face, fair skin, chestnut high ponytail, adult human proportions and green/gold uniform are consistent.
- Mapping: base0-5 to idle0-5; base7-16 to dribble0-9; base20-27 to run0-7; base28-30 to dribble-run0-2. The remaining four original dribble-run poses are retained but not needed after supplementing the loop.

## Mixed 21-pose supplement

- Imagegen output: `/workspace/generated_images/exec-96a8a650-a95e-4b8c-9f24-587148f6c198.png`
- Working copy: `tools/generate-art/sources/digger-finch-locomotion-supplement-21.png`
- Prompt sent verbatim:

> Use the attached Digger Finch portrait/gameplay images as the exact face, hair, body, uniform and illustration reference. Create a transparent source contact sheet with exactly three horizontal rows of seven separate full-body poses (21 total), strict 7-column by 3-row reading order. Large clear transparent gaps between figures and ample edges; do not crop or let hair, hands or shoes touch another figure. The same adult human woman in every cell: athletic proportions, fair warm peach skin, expressive brown eyes, long abundant chestnut-brown curls in a high ponytail with textured braids, green jersey and shorts with bright gold/yellow piping, dark green shoes. Match the source 2D hand-painted arcade sports art and body/head scale. Row 1 poses 1-3 are three varied running strides with natural arm swing; poses 4-7 are four low dribble-running poses with the right hand lowered at different dribble stages, empty hands. Row 2: seven more low dribble-running poses, all distinct, changing leg and arm positions in a smooth continuation, empty hands. Row 3: seven different stationary ball-ready stances with light knee bend and relaxed right hand beside the hip for a separately composited game ball, left hand balancing, empty hands. All poses are different full-body drawings at a consistent scale with feet aligned near each cell baseline. No ball, text, grid, floor, shadow or props. True transparent RGBA.

- Review: exactly21 alpha-separated complete figures in3 rows, no clipped bodies. The ponytail, face, fair warm skin, adult human anatomy, green/gold uniform and art style match the accepted base. Six unneeded poses are retained in source provenance.
- Mapping: supplement0-2 to run8-10; supplement3-6 to dribble-run3-6; supplement7-10 to dribble-run7-10; supplement14-17 to idle-ball0-3. The other ten figures remain unselected.

## Production map

The packed right-facing source has42 distinct authored drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. Prompt, source hashes, timestamps, crop geometry, normalized pose hashes and exact assembly details are in `tools/generate-art/digger-finch-locomotion42-provenance.json`.
