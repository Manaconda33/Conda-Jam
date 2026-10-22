# Moss Quarry J.24 locomotion source record

Portrait/gameplay identity references are source cell46 in `tools/generate-art/references/moss-quarry-portrait-reference.png` and `tools/generate-art/references/moss-quarry-gameplay-reference.png`. The roster identifies Moss Quarry as a Lantern Hollow Wombats supporting player in the olive/amber team palette. The reference atlas shows an adult human man with warm olive-tan skin, a clean-shaven face, short thick dark olive/black textured hair and a green/gold uniform.

## Base sheet

- Imagegen output: `/workspace/generated_images/exec-71453074-246e-4702-a7a2-39a7b70c8436.png`
- Working copy: `tools/generate-art/sources/moss-quarry-locomotion-base.png`
- Prompt sent verbatim:

> Create one polished transparent 2D character-art contact sheet for an arcade basketball production pipeline. Exactly 35 separate, full-body drawings of the SAME adult human male athlete, in a clean 7-column by 5-row grid, strict left-to-right/top-to-bottom reading order. Each body must fit fully in its own cell, spaced far apart with clear transparent gutters and ample outer margins; no clipped hair, hands, shoes, no touching/overlapping silhouettes, especially at right and bottom edges. Use the attached portrait/gameplay reference images for the canonical identity. Moss Quarry: adult human man, athletic muscular basketball build, warm olive-tan skin, dark focused eyes, thick dark brows, clean-shaven angular face, short thick tousled dark olive/black hair with textured waves, green basketball jersey and shorts with bright gold/yellow piping and trim, dark shoes. Preserve his same human face, skin, short tousled hair, body proportions, olive/forest-green and gold uniform and dark shoes in all frames. Match polished hand-painted 2D arcade sports game art with clean readable outlines. Row 1 poses 0-6: subtle upright idle variations. Row 2 poses 7-13: low stationary right-hand dribble stances, empty hands; runtime adds the ball. Row 3 poses 14-20: distinct continuing low stationary dribble and transition poses with varied arm/hand positions, empty hands. Row 4 poses 21-27: varied running strides, natural arm swing. Row 5 poses 28-34: low forward dribble-run stride cycle, right hand reaching down through different bounce phases, empty hands. Every pose distinct, natural adult anatomy, same camera scale, feet near cell baseline. No basketball, text, numbers, grid lines, floor, shadows, logos or effects. True transparent RGBA.

- Review: the generator returned four complete rows/28 separate alpha-connected drawings rather than the requested35. All28 are complete, in bounds and consistent with the reference identity. The seven-pose idle row, seven-pose low-dribble row and remaining14 action-transition/run drawings are retained; source pose6 remains unselected. Base source rows are `[7,7,7,7]`.
- Mapping: base0-5 to idle0-5; base7-16 to dribble0-9; base17-27 to run0-10. No image is duplicated or interpolated.

## Mixed 21-pose supplement

- Imagegen output: `/workspace/generated_images/exec-53d60214-d34e-4b5f-947c-a4bb9595410e.png`
- Working copy: `tools/generate-art/sources/moss-quarry-locomotion-supplement-21.png`
- Prompt sent verbatim:

> Use the attached Moss Quarry portrait/gameplay images as the exact face, anatomy and uniform reference. Create a transparent sprite source with exactly three separate horizontal rows of seven complete full-body drawings each (21 poses total), 7 columns × 3 rows, strict row-major order. Figures stay fully inside their cells with generous clear transparent gutters and outer margins; never overlap or touch. Same adult human man in every pose: athletic muscular build, warm olive-tan skin, dark focused eyes, thick brows, clean-shaven angular face, short thick tousled dark olive/black wavy hair, green basketball jersey/shorts with bright yellow-gold piping, dark shoes. Match the polished hand-painted 2D arcade sports art style and proportions of the attached identity. Row 1: seven distinct low forward-running dribble strides, empty right hand reaching down through seven different bounce stages. Row 2: seven more distinctly posed low dribble-run strides that continue a smooth loop; empty hands and changed leg/arm positions. Row 3: seven stationary ball-ready stances, light knee flex and balanced body, relaxed right hand beside the hip where the runtime ball will appear, left hand balancing; empty hands. Keep all poses visibly distinct and full body; no ball. True transparent RGBA, no background, text, labels, grid lines, court, shadow or props.

- Review: exactly21 alpha-separated complete figures in3 rows. The two running-dribble rows match Moss's base face, build, uniform, hair and game-art style. The ready row supplies four ball-ready frames; the final three poses in each row are retained as unselected candidates.
- Mapping: supplement0-6 to dribble-run0-6; supplement7-10 to dribble-run7-10; supplement14-17 to idle-ball0-3. The other six figures remain unselected.

## Production map

The packed right-facing source has42 distinct authored drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. It uses27 complete base drawings plus15 selected supplement drawings; all unused source poses remain recorded. Prompt, source hashes, timestamps, crop geometry, normalized pose hashes and assembly details are in `tools/generate-art/moss-quarry-locomotion42-provenance.json`.
