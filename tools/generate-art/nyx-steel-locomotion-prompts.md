# Nyx Steel J.23 locomotion source record

The inspected canonical source cells are 45 in `tools/generate-art/references/nyx-steel-portrait-reference.png` and `tools/generate-art/references/nyx-steel-gameplay-reference.png`. Nyx Steel is the adult human woman supporting player in Inkspire's forest-green and black kit: fair warm skin, dark eyes, abundant long black wavy hair in a high ponytail with textured braided locks, dark supports/sleeve and dark court shoes. The master roster identifies her as an Inkspire Razors player (J.23); the reference atlas establishes the supporting-player appearance.

## First base candidate (rejected at the edge)

- Imagegen output: `/workspace/generated_images/exec-cca979ee-9915-48ab-a998-ff6ae3866bd0.png`
- Preserved working copy: `tools/generate-art/sources/nyx-steel-locomotion-base-border-rejected.png`
- This source was created before the resumed checkpoint; its original prompt text was not present in the retained workspace/session handoff. It was visually reviewed as a 35-pose 7 by 5 sheet, but one full figure touches the artboard edge. It is retained only as rejected provenance and is never packed.

## Replacement base sheet

- Imagegen output: `/workspace/generated_images/exec-019ce342-ec1f-47cf-9c82-63ded85727f5.png`
- Working copy: `tools/generate-art/sources/nyx-steel-locomotion-base-retry.png`
- Prompt sent verbatim:

> Create one polished transparent 2D character-art contact sheet for an arcade basketball sprite production pipeline. Exactly 35 separate, complete, distinct full-body drawings of the SAME adult human woman, arranged in a clean 7-column by 5-row grid, in strict left-to-right then top-to-bottom reading order. Every full figure must fit entirely inside its own cell, with generous clear space between neighboring bodies and at least 6% transparent outer margin on all four sides. No cropped hair, hands, shoes, no touching canvas edge, no overlap between silhouettes. No text, labels, grid lines, shadows, props, or basketball. Transparent RGBA background, crisp hand-painted anime-sports game art with bold clean outlines and readable color shapes. Canonical Nyx Steel identity: athletic adult woman, fair warm skin, expressive dark brown eyes, long abundant black wavy hair gathered into a high ponytail with a few textured braided locks; her hair is distinctive and must remain black and voluminous in every drawing. Forest-green basketball jersey and shorts with black panels and fine white piping, dark forearm compression sleeve and dark knee supports, black court shoes with green accents. Keep consistent face, proportions, outfit and hair silhouette throughout all 35 poses. Individual small character scale, centered feet near each cell's baseline. Row 1: seven subtly varied upright relaxed idle stances, hands moving slightly, ponytail naturally swaying. Row 2: seven low stationary right-hand dribble body poses, empty hands (the game adds the ball), realistic athletic crouch. Row 3: seven more low stationary left-hand dribble poses, empty hands, clear alternating hand/arm positions. Row 4: seven distinct running poses, empty hands, rising and falling stride cycle. Row 5: seven distinct running dribble poses, empty hands, clear cadence and body bounce. This is a 7 by 5 sprite source sheet; use exactly 35 drawings, never put multiple poses in one cell, never let extended arms or hair touch another figure. Maintain clean transparent gutters and especially generous inset for the last column and bottom row. Avoid cropping and merged figures at all costs.

- Review: 35 alpha-separated figures; full bodies are inside the image with clear outer margins. Some long ponytail bounding boxes overlap, but alpha shapes remain disconnected; only those existing components' antialiased fringe is isolated during packing. Identity, black ponytail, green/black/white kit, dark supports and adult anatomy are consistent.
- Mapping: base poses 0-5 idle; 7-16 dribble; 20-27 run frames 0-7; 28-34 dribble-run frames 0-6.

## Supplement A: run and dribble-run

- Imagegen output: `/workspace/generated_images/exec-f4f88bb6-c797-45f0-b58d-a48206551fb2.png`
- Working copy: `tools/generate-art/sources/nyx-steel-locomotion-supplement-a.png`
- Prompt sent verbatim:

> Transparent 2D character-art sprite sheet for an arcade basketball game. Exactly seven separate full-body drawings of the SAME adult human woman, arranged in one horizontal row, strict left-to-right reading order, all bodies fully visible, evenly spaced with wide transparent gutters and generous transparent outer margins. No overlap, no touching edges, no cropped hair/hands/shoes. No text, numbers, grid, floor, basketball or props. Crisp hand-painted anime sports art, bold clean outline, consistent design. Nyx Steel: athletic adult woman, fair warm skin, dark brown eyes, very long abundant black wavy hair in a high ponytail with textured braided locks, forest-green jersey and shorts with black panels and fine white piping, dark forearm compression sleeve, dark knee supports, black court shoes with subtle green accents. Preserve the exact face, hair, skin, outfit and adult human anatomy in every pose. Poses 1-3 are three distinct running strides while carrying an imaginary basketball; hands are empty, natural running arms, progressively varied airborne/planting phases. Poses 4-7 are four distinct dribble-running strides, low forward athletic lean with the right hand reaching downward at different stages of a dribble, EMPTY hand, the game adds the ball. Maintain visibly different silhouettes and limb positions; no duplicates. Character proportions natural and athletic, cell-baseline feet align, high-quality polished 2D art on true transparent background.

- Review: seven alpha-separated complete poses; bounding boxes overlap due to long hair/limbs, while the silhouettes remain separate. Hair, face, outfit and adult anatomy are consistent. Component isolation retains the original figure pixels.
- Mapping: source poses 0-2 to run frames 8-10; source poses 3-6 to dribble-run frames 7-10.

## Supplement B: idle-ball

- Imagegen output: `/workspace/generated_images/exec-ba73b9ee-3484-4b4e-aa79-3cdfbb656d6d.png`
- Working copy: `tools/generate-art/sources/nyx-steel-locomotion-supplement-b.png`
- Prompt sent verbatim:

> A transparent 2D arcade basketball character sprite source: exactly seven small, separate full-body poses of the SAME adult human woman, in one horizontal row, clear reading order from left to right. Wide transparent gaps; figures must not touch, merge, overlap, or be cropped; leave a generous transparent margin on all sides, no item near canvas edge. No text, grid, court, shadow, or basketball. Refined hand-painted anime sports illustration with clean outlines. Nyx Steel is a recognizable adult athlete with fair warm skin, dark brown eyes, long abundant wavy black hair in a high ponytail with braided textured locks, forest-green jersey and shorts with black panels and thin white piping, a dark arm sleeve, dark knee pads and black/green court shoes. Same face, hair, outfit, anatomy and adult proportions across poses. First four are subtly different stationary ball-ready poses from front three-quarter view: soft athletic knee bend, controlled ready posture, right hand lowered and relaxed beside the hip as if tracking a ball which will be added later, left hand open for balance; vary weight shift and hand positions naturally while keeping space where a basketball can be composited. EMPTY HANDS, no ball. Last three are additional distinct upright idle poses with small variations in weight and ponytail sway. All feet visible and aligned near a shared baseline. Exactly seven different drawings, full body, high-quality, truly transparent RGBA background.

- Review: seven alpha-separated poses with clean margins; the first four supply ball-ready frames, the final three are retained as unselected source candidates. The long black ponytail and established outfit remain consistent.
- Mapping: source poses 0-3 to idle-ball frames 0-3.

## Production map

The final right-facing atlas has 42 distinct authored drawings: idle 6, idle-ball 4, dribble 10, run 11, and dribble-run 11. The first base candidate is excluded. Exact source hashes, timestamps, per-pose mapping, normalized pose hashes, and exclusions are recorded in `tools/generate-art/nyx-steel-locomotion42-provenance.json`.
