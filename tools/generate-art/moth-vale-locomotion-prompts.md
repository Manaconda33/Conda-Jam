# Moth Vale J.26 locomotion source record

Identity references: Duskmere Nightwings, roster section J.26, source cell50 in `tools/generate-art/references/moth-vale-portrait-reference.png` and `moth-vale-gameplay-reference.png`. The inspected references establish an adult human woman with warm light-medium brown skin, dark eyes, abundant deep-violet textured locs gathered in a high ponytail, and deep-violet/silver uniform. The gameplay reference preserves only Moth's connected source-cell figure.

## Base sheet

- ImageGen output: `/workspace/generated_images/exec-0b71f830-6c84-469a-b64b-7e04dbadf619.png`
- Working copy: `tools/generate-art/sources/moth-vale-locomotion-base.png`
- Prompt sent verbatim:

> Create one production-ready transparent 2D character-art contact sheet for a fast 1990s arcade basketball game. Exactly35 separate complete full-body drawings of the SAME adult human woman, in a precise 7-column by 5-row grid, strict row-major order. Use the attached Moth Vale portrait and isolated gameplay crops as identity references. Leave wide transparent gutters and margins; every complete figure stays inside its cell, no cropped hair/hands/shoes, no silhouettes touching. Moth Vale is an adult human basketball player with warm light-medium brown skin, dark eyes, a mature confident face, extremely abundant deep purple/violet textured locs gathered back in a high ponytail with subtle violet ties, natural athletic adult proportions, no fantasy anatomy. Her uniform is a sleeveless deep-violet and silver Duskmere Nightwings basketball jersey and shorts with crisp pale silver/white piping, dark violet court shoes. Preserve her face, skin tone, large purple loc ponytail, adult human anatomy and deep-violet/silver palette across every pose. Match polished hand-painted 2D arcade sports game art and line weight of the attached references. Pose layout: cells0-6 subtle upright idle variations with relaxed arms; cells7-13 low stationary dribble stances, empty right hand low toward court; cells14-16 three further distinct stationary dribble follow-through poses; cells17-20 four running strides; cells21-27 seven more distinct running strides continuing a smooth cycle; cells28-34 low forward dribble-run strides, right hand reaching down through changing bounce phases. All hands empty; runtime draws the ball. Every pose has natural adult human anatomy, same camera angle/scale, feet near a common baseline. True transparent RGBA, not checkerboard or painted transparency. No ball, lettering, numbers, logo, floor, court, grid lines, shadows, glow or extra objects.

- Review: the generator returned four complete rows /28 separated, in-bounds RGBA figures. The source was accepted as four seven-pose bands; pose layout was mapped to the actions actually visible in each cell. The distinct identity (skin, face, high violet locs, build, kit, shoes) is consistent.
- Mapping: base0-5 to idle0-5; base6 to idle-ball0; base7-13 to dribble0-6; base14-20 to run0-6; base21-27 to dribble-run0-6.

## Mixed fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-524ef2d9-d542-4b11-91ff-c0df6fc17676.png`
- Working copy: `tools/generate-art/sources/moth-vale-locomotion-supplement-14.png`
- Prompt sent verbatim:

> Using the attached Moth Vale portrait, isolated gameplay reference, and accepted source base sheet as strict identity references, create a transparent 2D sprite sheet with EXACTLY fourteen separate full-body drawings in a 7-column × 2-row grid, row-major. Keep her adult human anatomy, warm light-medium brown skin, dark eyes, abundant deep-violet textured high ponytail, deep-violet/silver sleeveless Nightwings kit, dark shoes and the base's hand-painted arcade style unchanged. Every pose must fit inside its own cell with clear transparent gaps. Row1 cells0-2: three upright standing ball-ready poses: tall torso, only slightly bent knees, right hand open at waist/hip height for the game ball, left arm balancing; absolutely do not crouch or run. Row1 cells3-6: four upright running strides with natural arm swing, distinct leg positions. Row2 cells7-9: three low stationary right-hand dribble stances, knees bent, empty right hand reaching toward the court. Row2 cells10-13: four low forward-running dribble strides, leaning body, varied legs, empty right hand at different bounce phases. All hands empty because the runtime adds the ball. Match same scale/view and maintain generous clear gutters, complete hair/hands/shoes, no touching or cropping. True transparent RGBA; no checkerboard, ball, text, numbers, logos, court, gridlines, shadows or props.

- Review: exactly14 complete, separate RGBA poses, all in bounds and identity-consistent. Cells0-2 are upright ball-ready stances;3-6 are running strides;7-9 are stationary low dribbles;10-13 are forward dribble-run poses.
- Mapping: supplement0-2 to idle-ball1-3; supplement3-6 to run7-10; supplement7-9 to dribble7-9; supplement10-13 to dribble-run7-10.

## Production map

The final 42 frames across idle6, idle-ball4, dribble10, run11 and dribble-run11 select all28 base figures and all14 supplemental figures once each. Source hashes, generated-image IDs, cell rectangles, frame hashes and the exact map are in `tools/generate-art/moth-vale-locomotion42-provenance.json` and `moth-vale-locomotion-layouts.json`.
