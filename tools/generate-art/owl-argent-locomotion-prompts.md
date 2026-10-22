# Owl Argent J.26 locomotion source record

Identity references: Duskmere Nightwings, roster section J.26, source cell51 in `tools/generate-art/references/owl-argent-portrait-reference.png` and `owl-argent-gameplay-reference.png`. The inspected references establish an adult human man with fair warm skin, dark eyes, clean-shaven face, short dense silver-white swept curls and a deep-violet/silver uniform. The gameplay reference preserves only Owl's connected source-cell figure.

## Base sheet

- ImageGen output: `/workspace/generated_images/exec-39429ec7-cbaf-4938-86c0-455319f1f482.png`
- Working copy: `tools/generate-art/sources/owl-argent-locomotion-base.png`
- Prompt sent verbatim:

> Create one production-ready transparent 2D character-art contact sheet for a fast 1990s arcade basketball game. Exactly35 separate complete full-body drawings of the SAME adult human man, in a precise 7-column by 5-row grid, strict row-major order. Use the attached Owl Argent portrait and isolated gameplay crops as identity references. Leave wide transparent gutters and margins; every complete figure stays inside its cell, no cropped hair/hands/shoes, no silhouettes touching. Owl Argent is an adult human basketball player with fair warm skin, dark eyes, a strong youthful face, short dense silver-white wavy curls swept up and slightly to the side, clean-shaven jaw, athletic muscular adult proportions, no fantasy anatomy. His uniform is a sleeveless deep-violet and silver Duskmere Nightwings basketball jersey and shorts with crisp pale silver/white piping, matching purple details and dark court shoes. Preserve his face, fair skin, silver-white curly hairstyle, adult human anatomy and deep-violet/silver palette across every pose. Match polished hand-painted 2D arcade sports game art and line weight of the attached references. Pose layout: cells0-6 subtle upright idle variations with relaxed arms; cells7-13 low stationary dribble stances, empty right hand low toward court; cells14-16 three further distinct stationary dribble follow-through poses; cells17-20 four running strides; cells21-27 seven more distinct running strides continuing a smooth cycle; cells28-34 low forward dribble-run strides, right hand reaching down through changing bounce phases. All hands empty; runtime draws the ball. Every pose has natural adult human anatomy, same camera angle/scale, feet near a common baseline. True transparent RGBA, not checkerboard or painted transparency. No ball, lettering, numbers, logo, floor, court, grid lines, shadows, glow or extra objects.

- Review: the generator returned four complete rows /28 separated, in-bounds RGBA figures. The source was accepted as four seven-pose bands; pose categories were mapped to the actual drawings visible in each band. Silver-white curls, clean-shaven face, fair skin, adult human build, violet/silver kit and dark shoes are consistent.
- Mapping: base0-5 to idle0-5; base6 to idle-ball0; base7-13 to dribble0-6; base14-20 to run0-6; base21-27 to dribble-run0-6.

## Rejected fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-a18e294d-9fd4-4165-8e4f-ff3cdd6ce6ab.png`
- Retained as: `tools/generate-art/sources/owl-argent-locomotion-supplement-14-pose-mismatch-rejected.png`
- Prompt sent verbatim:

> Using the attached Owl Argent portrait, gameplay crop, and accepted 35-pose Owl base sheet as strict identity/style references, create a new transparent 2D sprite source with exactly14 separate complete full-body drawings in 7 columns × 2 rows, row-major. Same adult human man in every cell, same strong face, fair warm skin, dark eyes, clean-shaven jaw, short dense silver-white swept curls, athletic muscular adult build, deep-violet/silver sleeveless Duskmere Nightwings jersey and shorts with pale piping and dark shoes. Match the exact hand-painted 2D arcade sports style and body proportions of the base. Row1 cells0-6: seven distinct calm upright ball-ready poses, knees slightly flexed, right hand relaxed near hip at runtime ball height, left arm balancing; empty hands. Row2 cells7-13: seven dynamic forward-running dribble strides, clearly changed legs/arms through a continuous loop, right hand reaching low through different bounce phases; empty hands. Keep the entire hair, fingers and shoes inside each cell, generous transparent gutters, no touching figures, no props. True transparent RGBA alpha, no checkerboard, no ball, no text, number, grid, court, floor, shadows, glow or logos.

- Review: all14 separated figures were complete, but the first row was crouched low instead of upright ball-ready. The source is preserved as unselected evidence and none of its poses enter the production map.

## Unselected replacement candidates

The following candidates were separately generated and reviewed, then left unselected because the accepted mixed supplement supplies the needed categories in one 14-pose map:

- `owl-argent-idle-ball-strip-7.png`, ImageGen output `/workspace/generated_images/exec-38e6f78b-e81e-4344-85c1-a78af7138377.png`; seven upright standing poses.
- `owl-argent-dribble-run-strip-7.png`, ImageGen output `/workspace/generated_images/exec-e22b53e5-be78-441f-aafd-c880b592c409.png`; seven forward low dribble-run poses.

## Accepted mixed fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-1cf53fe0-de4f-4da6-9519-ac25b6f9d7b3.png`
- Working copy: `tools/generate-art/sources/owl-argent-locomotion-supplement-14.png`
- Prompt sent verbatim:

> Using the attached Owl Argent portrait, isolated gameplay reference, and accepted source base sheet as strict identity references, create a transparent 2D sprite sheet with EXACTLY fourteen separate full-body drawings in a 7-column × 2-row grid, row-major. Keep his adult human anatomy, fair warm skin, dark eyes, clean-shaven strong face, short dense silver-white swept curls, muscular build, deep-violet/silver sleeveless Nightwings kit, dark shoes and the base's hand-painted arcade style unchanged. Every pose must fit inside its own cell with clear transparent gaps. Row1 cells0-2: three UPRIGHT STANDING ball-ready poses: tall torso, only slightly bent knees, right hand open at waist/hip height for the game ball, left arm balancing. These must look like the base sheet's first standing idle row; no crouching, no low stance, no dribbling, no running. Row1 cells3-6: four upright running strides with natural arm swing, distinct leg positions. Row2 cells7-9: three low stationary right-hand dribble stances, knees bent, empty right hand reaching toward the court. Row2 cells10-13: four low forward-running dribble strides, leaning body, varied legs, empty right hand at different bounce phases. All hands empty because the runtime adds the ball. Match same scale/view and maintain generous clear gutters, complete hair/hands/shoes, no touching or cropping. True transparent RGBA; no checkerboard, ball, text, numbers, logos, court, gridlines, shadows or props.

- Review: exactly14 complete, separate RGBA poses, all in bounds and identity-consistent. Cells0-2 are upright ball-ready;3-6 running;7-9 stationary dribble;10-13 dribble-run.
- Mapping: supplement0-2 to idle-ball1-3; supplement3-6 to run7-10; supplement7-9 to dribble7-9; supplement10-13 to dribble-run7-10. Base pose6 supplies idle-ball0.

## Production map

The final 42 frames across idle6, idle-ball4, dribble10, run11 and dribble-run11 select all28 base figures and all14 accepted mixed-supplement figures once each. Source hashes, generated-image IDs, cell rectangles, exact maps and rejected/unselected candidates are recorded in `tools/generate-art/owl-argent-locomotion42-provenance.json` and `owl-argent-locomotion-layouts.json`.
