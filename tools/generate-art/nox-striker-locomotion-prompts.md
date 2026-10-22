# Nox Striker J.28 locomotion source record

Identity: J.28 Venom Delta Fangs, supporting cell54: adult human man, deep warm-brown skin, dark eyes, clean-shaven angular face, dense short electric-blue curls, muscular build and sleeveless navy/electric-blue kit with cyan/white piping. References are the source-cell54/55 identity crops in `tools/generate-art/references/nox-striker-portrait-reference.png` and `nox-striker-gameplay-reference.png`. The gameplay crop isolates the largest connected character from the shared atlas cell.

## Base sheet

- ImageGen output: `/workspace/generated_images/exec-7e71723a-e102-4a49-8685-760f2b1c449a.png`
- Accepted source: `tools/generate-art/sources/nox-striker-locomotion-base.png`
- Prompt sent verbatim:

> Create a polished original 2D character sprite sheet for a 1990s arcade basketball game. Exactly28 separate complete full-body drawings of the SAME adult human man in a 7-column by 4-row transparent grid, strict row-major. Use the attached Nox Striker portrait and isolated gameplay sprite as identity references; the gameplay crop contains only Nox. Canonical features: adult human man, deep warm-brown skin, dark brown eyes, confident angular clean-shaven face, dense short textured bright electric-blue curls with blue-black roots, muscular athletic human body. His Venom Delta Fangs kit is sleeveless deep-navy and electric-blue basketball jersey and shorts with thin cyan/white piping and dark-blue court shoes. Match his face, skin, short blue curls, anatomy, proportions and navy/electric-blue identity in every pose. High quality hand-painted 2D arcade sports-game art with clean dark ink contours, rich fabric texture, readable silhouette at 96px. Do not add beard, mustache, tattoos, mask, scales, animal features or extra armor. Pose grid: cells0-5 upright subtle idle variations, cell6 standing ball-ready with open hand at waist; cells7-13 low stationary right-hand dribble poses; cells14-20 seven visibly distinct upright running strides; cells21-27 seven low forward-moving dribble-run poses with varied leg and arm phases, right hand low toward court. Hands are empty; game runtime adds ball. Same 3/4 gameplay view and body scale; every figure complete, hair/fingers/shoes in bounds, one figure per cell, wide transparent gutters and rows, no silhouettes touching or clipped. True transparent RGBA, not a checkerboard. No red halo, glow or UI selection outline. No ball, text, numbers, logo, court, floor, grid lines, shadow, background or props.

- Review: the 7×4 sheet contains28 complete, separated figures. Base cells0-5 map to idle, cell6 to idle-ball0, cells7-13 to dribble0-6, cells14-20 to run0-6 and cells21-27 to dribble-run0-6.

## Mixed fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-43256946-8a05-4bd4-8c82-1d0e9ac88445.png`
- Accepted source: `tools/generate-art/sources/nox-striker-locomotion-supplement-14.png`
- Prompt sent verbatim:

> Use the attached Nox Striker portrait and accepted base sheet as strict references. Create exactly14 full-body, separated original Nox poses in a transparent 7-column × 2-row grid, one pose per cell. Adult human man with deep warm-brown skin, dark brown eyes, clean-shaven angular face, dense short textured electric-blue curls, muscular athletic build; navy/electric-blue sleeveless Venom Delta Fangs jersey and shorts with cyan/white piping and dark shoes. Keep identity, style, proportion and camera exactly like the base. No beard, mustache, tattoos, mask, scales or fantasy anatomy. Row1 cells0-2: upright ball-ready standing poses, tall torso, nearly straight knees, empty right hand at waist; cells3-6: four different upright running strides. Row2 cells7-9: three low stationary right-hand dribbles, knees bent and empty right hand toward floor; cells10-13: four low forward-moving dribble-run poses with varied leg phases, leaning torso and empty right hand through the bounce. Every complete figure and hairstyle stays in its own cell with generous gutters, no touching or clipping, true RGBA transparency. Hands empty, runtime draws the ball. Clean dark outlines, do not add red halo, colored glow or selection outline. No ball, text, number, logo, floor, court, shadows or extra props.

- Review and map: exactly14 complete figures. Supplement cells0-2 add idle-ball1-3; cells3-6 add run7-10; cells7-9 add dribble7-9; cells10-13 add dribble-run7-10.

## Production and gameplay review

The mapped poses form42 authored drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11; none are synthesized, duplicated or reflected. Hashes, crop rectangles, connected-component counts and frame maps are in `nox-striker-locomotion42-provenance.json` and `nox-striker-locomotion-layouts.json`. All five packed right atlases passed dark/light contact-sheet review. Native gameplay previews select every clip in both directions and show the separate ball following the hand and reaching court on the bounce.
