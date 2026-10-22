# Willow Root J.25 locomotion source record

Identity references: roster section J.25, Cedarbrook Wardens, source cell48 in `tools/generate-art/references/willow-root-portrait-reference.png` and `willow-root-gameplay-reference.png`. Willow is an adult human athlete with warm light-medium skin, dark eyes and abundant emerald-green wavy hair gathered in a high ponytail with restrained orange/gold ties. Preserve her human anatomy and the Wardens' turquoise/forest-green kit with pale piping. The gameplay reference isolates Willow's connected figure from adjacent source-cell pixels.

## Base sheet

- ImageGen output: `/workspace/generated_images/exec-3d3cc0f5-5d42-4383-93eb-db3fecb100be.png`
- Committed working copy: `tools/generate-art/sources/willow-root-locomotion-base.png`
- Prompt sent verbatim:

> Create one production-ready transparent 2D character-art contact sheet for a fast 1990s arcade basketball game. Exactly 35 separate full-body drawings of the SAME adult human woman, arranged in a precise 7-column by 5-row grid, strict left-to-right row-major order. Use both attached Willow Root portrait and gameplay crops as identity references. Keep clear transparent gutters and margins; every figure completely inside its own cell with no clipped hair, fingers or shoes and no touching silhouettes. Canonical Willow Root: an adult human basketball player with warm light-medium skin, dark brown eyes, a confident face, very abundant vivid emerald-green wavy hair gathered back in a high ponytail with small restrained orange/gold ties, natural athletic adult proportions, no fantasy anatomy. She wears a sleeveless turquoise/forest-green Cedarbrook Wardens basketball jersey and shorts with clean pale mint/white piping, matching turquoise accents and dark turquoise court shoes. Preserve the same face, exact green hair silhouette, skin tone, adult human anatomy and Wardens palette in all 35 frames; match the polished hand-painted arcade sports illustration style and line weight of the references. Pose layout: cells 0-6 subtle upright idle stance variations, balanced feet and relaxed arms; cells 7-13 low stationary dribble stance variations, empty right hand poised toward the floor; cells 14-16 three more distinct low dribble follow-through poses; cells 17-20 four clearly different running strides with natural arm swing; cells 21-27 seven distinct running strides continuing a seamless cycle; cells 28-34 low forward dribble-run strides with the right hand reaching down at different bounce phases. All hands empty; the game draws its own separate ball. Every figure distinct, anatomically natural and fully visible, same camera angle and scale, feet near a shared baseline. True transparent RGBA alpha, not a checkerboard or painted transparency. No ball, text, jersey numbers, logos, floor, court, grid lines, shadows, glow or extra props.

- Review: the accepted RGBA sheet has35 separated complete figures with no clipped component. Willow's green ponytail, face, skin, adult human build and Wardens kit remain consistent. The six mapped idle frames, ten stationary dribbles, eleven runs and seven dribble-run strides are distinct; base pose6 remains unused.
- Mapping: base0-5 to idle0-5; base7-16 to dribble0-9; base17-27 to run0-10; base28-34 to dribble-run0-6.

## Fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-cddecd5e-7cb6-449e-ae6a-92c1732f47d9.png`
- Committed working copy: `tools/generate-art/sources/willow-root-locomotion-supplement-14.png`
- Prompt sent verbatim:

> Using the attached Willow Root portrait, gameplay crop, and accepted 35-pose Willow base sheet as strict identity/style references, create a new transparent 2D sprite source with exactly14 separate complete full-body drawings in 7 columns × 2 rows, row-major. Same adult human woman in every cell, same face, warm light-medium skin, dark eyes, abundant emerald-green wavy high ponytail with restrained orange/gold ties, natural athletic build, turquoise/forest-green sleeveless Cedarbrook Wardens jersey and shorts with pale mint piping and dark turquoise shoes. Match the exact hand-painted 2D arcade sports style and body proportions of the base. Row1 cells0-6: seven distinct calm upright ball-ready poses, knees slightly flexed, right hand relaxed near hip at runtime ball height, left arm balancing; empty hands. Row2 cells7-13: seven dynamic forward-running dribble strides, clearly changed legs/arms through a continuous loop, right hand reaching low through different bounce phases; empty hands. Keep the entire hair, fingers and shoes inside each cell, generous transparent gutters, no touching figures, no props. True transparent RGBA alpha, no checkerboard, no ball, no text, number, grid, court, floor, shadows, glow or logos.

- Review: fourteen complete RGBA figures are separated and in bounds. The four ball-ready frames keep the right hand at the runtime ball position; the running dribble frames provide a distinct forward cycle. Cells4-6 and11-13 stay unselected.
- Mapping: supplement0-3 to idle-ball0-3; supplement7-10 to dribble-run7-10.

## Production map

The packed set contains42 distinct drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. It selects34 of35 base figures and eight of14 supplemental figures. Per-pose rectangles, source hashes, frame hashes, image dimensions and provenance are in `tools/generate-art/willow-root-locomotion42-provenance.json` and `willow-root-locomotion-layouts.json`.
