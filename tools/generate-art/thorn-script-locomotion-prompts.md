# Thorn Script J.23 locomotion source record

The inspected canonical source cells are 44 in `tools/generate-art/references/thorn-script-portrait-reference.png` and `tools/generate-art/references/thorn-script-gameplay-reference.png`. Thorn Script is the adult human male supporting player in Inkspire's forest-green and black kit: medium-brown skin, short black hair/locs brushed back beneath a dark green headband, close dark beard and moustache, and visible dark shoulder/arm tattoos. The master roster identifies him as an Inkspire Razors player (J.23); the reference atlas establishes the supporting-player appearance.

## Base sheet

- Retained imagegen output: `/workspace/generated_images/exec-a7f297b8-4eb9-4045-92cb-7dd6c8006814.png`
- Working copy: `tools/generate-art/sources/thorn-script-locomotion-base.png`
- Generated before this resumed production checkpoint. The full prompt text was not present in the retained workspace/session handoff, so it is not reconstructed as if verbatim. The source was visually reviewed here: 35 complete figures, 7 by 5, consistent face/headband/beard/tattoos/uniform, all alpha-separated. Some alpha-component bounding rectangles overlap, so assembly keeps each existing connected figure isolated; no body is redrawn or merged.
- Source inspection: `package-motion42.py inspect_source(...,35,7,isolate=True)` passed with exactly 35 components. Default rectangle-only inspection reports neighboring bounding-box overlap.
- Source SHA-256 and file date are recorded in the generated provenance JSON.

## Supplement A: run and dribble-run

- First output `/workspace/generated_images/exec-93fad9b6-cc2c-4d3b-b7e0-ac3d2f50aea2.png` is retained as `thorn-script-locomotion-supplement-a-style-rejected.png`: it was transparent and separated, but the smaller body and reduced tattoo detail visibly popped against the base during the gameplay preview.
- Identity-matched regeneration `/workspace/generated_images/exec-88620cd5-a52a-4bbb-aa15-cf3a3ff74439.png` is retained as `thorn-script-locomotion-supplement-a-checker-rejected.png`: it matched the base physique and tattoo design, but returned an opaque checkerboard instead of alpha.
- Background cleanup `/workspace/generated_images/exec-c75fb125-651f-4045-b230-38a61d76ae8f.png` is retained as `thorn-script-locomotion-supplement-a-flat-rejected.png`: the checker was removed, but output still had no alpha.
- Accepted imagegen output: `/workspace/generated_images/exec-86897230-3961-4316-9b07-908d23fa0ff6.png`
- Working copy: `tools/generate-art/sources/thorn-script-locomotion-supplement-a.png`
- Identity-reference prompt sent verbatim:

> Use the attached Thorn Script sprite sheet and portrait/gameplay images as the exact visual identity and art-style reference. Generate a NEW transparent horizontal 7-pose animation strip; do not copy/paste existing poses. Exactly seven separate, complete full-body drawings of the SAME adult man, evenly spaced left-to-right, with generous transparent gutters and safe outer margins. No overlap, no clipped hair/hands/shoes, no contact with canvas edges. Preserve the base sheet's broad, muscular athletic build and head/body proportions, warm medium-brown skin, short black locs brushed backward under the same dark forest-green headband, same close dark beard and moustache, and the SAME highly visible dark tattoo work across the shoulders and upper arms in every drawing. Preserve the identical forest-green/black jersey and shorts with thin white piping and matching dark shoes. Match the source sheet's painterly 2D game-art rendering, line weight, color palette, texture and scale. Keep adult human anatomy and the same face. Poses 1-3 are distinct running strides, natural arm swing. Poses 4-7 are low forward-leaning dribble-run strides with right hand reaching down in four different dribble stages; hands empty, the game adds the ball. All silhouettes are visibly different yet consistent as one looping animation. No text, grid, court, shadows, basketball or props. True transparent RGBA background.

- Alpha-cleanup prompt sent verbatim:

> Preserve the attached seven Thorn Script figure drawings, their exact poses, facial identity, muscular body, black locs/headband, beard, shoulder and arm tattoos, forest-green uniform, proportions, colors and outline style. Make only a clean transparency/background correction: remove the entire flat background tint around and between the seven figures so all surrounding pixels are true alpha transparency. Do not paint a checkerboard. Do not crop, redraw, resize, merge, recolor or change any of the seven separate figures. Keep all seven complete figures with clear space around every hand, hair tip and shoe, on a transparent RGBA canvas.

- Review: exactly seven alpha-separated full-body poses. The muscular build, headband, beard, tattoo pattern, uniform, palette and line weight now match the base. No figure touches the opaque-pixel edge; separated hair/arm bounding rectangles are handled by component isolation without redrawing pixels.
- Mapping: source poses 0-2 to run frames 8-10; source poses 3-6 to dribble-run frames 7-10.

## Supplement B: idle-ball

- First output `/workspace/generated_images/exec-9905b8d7-8b87-4f8b-9ca4-c9d5cdc9477b.png` is retained as `thorn-script-locomotion-supplement-b-style-rejected.png`: it had transparency, but drifted from the base physique and art details.
- Identity-matched regeneration `/workspace/generated_images/exec-c0137c2a-4326-41a3-85ff-9443436e89ed.png` is retained as `thorn-script-locomotion-supplement-b-checker-rejected.png`: its figures matched the base, but its background was opaque checkerboard.
- Accepted imagegen output: `/workspace/generated_images/exec-5c8eff23-6df4-42ec-9117-3e0d45ddc12f.png`
- Working copy: `tools/generate-art/sources/thorn-script-locomotion-supplement-b.png`
- Identity-reference prompt sent verbatim:

> Using the attached Thorn Script base sprite sheet as the exact character and painterly sports-game style guide, create a NEW transparent horizontal strip of exactly seven separate, complete full-body drawings of the same adult man. Wide transparent gutters, ample outer margins, no silhouettes touching or overlapping, no cropped body parts, no background. Preserve the base's broad muscular build, warm medium-brown skin, short black brushed-back locs under the same dark forest-green headband, close dark beard and moustache, clearly visible dark shoulder/upper-arm tattoos on every figure, and the identical forest-green/black uniform with thin white piping and dark shoes. Match the exact 2D linework, color, lighting and proportions of the reference sheet; do not make him thinner or change his face. Poses 1-4: distinct stationary ball-ready stances, slight knee flex, balanced athletic posture, right hand relaxed open beside hip at ball height, left hand open for balance, small natural weight shifts; hands are empty so the game can overlay the basketball near that hand. Poses 5-7: three different relaxed idle stances with subtle shoulder/head motion. All seven poses are visibly distinct and aligned to a shared foot baseline. No text, grid, court, shadow, ball or props. Genuine RGBA alpha transparency.

- Alpha-cleanup prompt sent verbatim:

> Keep the attached seven Thorn Script drawings unchanged in pose and character design. Remove the entire checkerboard background and replace it with actual transparent alpha only; every pixel outside the seven character silhouettes must be fully transparent, not gray, white, beige or a painted checker pattern. Preserve all seven complete tattooed, muscular characters, their hair, headband, face, outfit, proportions, color and linework. Do not crop, redraw, resize, merge, or change any character. Output a genuine transparent RGBA image with visible clear gutters between the figures.

- Review: exactly seven alpha-separated poses; first four provide ball-ready variations, last three remain unselected. Muscular proportions, visible tattooed arms, headband, beard and game-art style match the base. Component isolation keeps existing separated figures intact.
- Mapping: source poses 0-3 to idle-ball frames 0-3.

## Production map

The final right-facing atlas has 42 distinct authored drawings: idle 6, idle-ball 4, dribble 10, run 11, and dribble-run 11. Base poses 0-5 supply idle; 7-16 supply dribble; 20-27 supply run frames 0-7; 28-34 supply dribble-run frames 0-6. No pose is generated by interpolation, mirroring, or duplication. The exact source files, hashes, timestamps, per-pose map, normalized pose hashes, and exclusions are recorded in `tools/generate-art/thorn-script-locomotion42-provenance.json`.
