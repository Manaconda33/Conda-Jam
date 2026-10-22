# Viper Veil J.28 locomotion source record

Identity: J.28 Venom Delta Fangs, supporting cell55: adult human woman, fair warm skin, dark eyes, confident face, abundant vivid electric-blue wavy high ponytail with loose side locks, small silver fish-shaped hairpin near one temple, and navy/electric-blue kit with cyan/white piping. References are the source-cell54/55 identity crops in `tools/generate-art/references/viper-veil-portrait-reference.png` and `viper-veil-gameplay-reference.png`. The gameplay crop isolates the largest connected character from the shared atlas cell.

## Base sheet

- ImageGen output: `/workspace/generated_images/exec-a12428fe-b247-4ec7-a980-513e88774b22.png`
- Accepted source: `tools/generate-art/sources/viper-veil-locomotion-base.png`
- Prompt sent verbatim:

> Create a polished original 2D sprite sheet for a 1990s arcade basketball game with exactly28 separate complete full-body drawings of the SAME adult human woman in a strict 7-column × 4-row transparent grid, row-major. Use attached Viper Veil portrait and isolated gameplay crop as identity references. She is an adult human woman with fair warm skin, dark eyes, a confident face, long abundant vivid electric-blue wavy hair in a high ponytail, loose side locks and a small silver fish-shaped hairpin visible near one temple. Keep both eyes human and her anatomy fully human. Her Venom Delta Fangs uniform is sleeveless deep-navy/electric-blue jersey and shorts with cyan/white piping and dark-blue court shoes. Match the source face, hair, hairpin, skin tone and electric-blue identity in every pose. High quality hand-painted 2D arcade sports art, consistent natural adult proportions and clean dark outlines. Do not add fangs, scales, reptile features, mask, beard, tattoos, extra accessories, armor or supernatural effects. Long ponytail remains behind head and upper back, contained inside its cell; keep wide horizontal gutters so ponytails never touch neighboring figures. Pose map: row1 cells0-5 six upright idle variations; cell6 upright standing ball-ready with an open hand at waist. Row2 cells7-13 seven low stationary right-hand dribble stances. Row3 cells14-20 seven distinct upright running strides with bouncing ponytail. Row4 cells21-27 seven low forward dribble-run strides with varied legs and right hand reaching through separate low bounce phases. Empty hands; game draws the separate ball. Complete hair ends, fingers and shoes inside every cell; exactly one complete drawing per cell, same 3/4 camera, consistent scale, feet near a common baseline per row. True RGBA transparency, not checkerboard. No ball, text, number, logo, floor, court, grid lines, shadow, glow, red highlight, background or props.

- Review: the 7×4 sheet contains28 complete, separated figures. Base cells0-5 map to idle, cell6 to idle-ball0, cells7-13 to dribble0-6, cells14-20 to run0-6 and cells21-27 to dribble-run0-6.

## Mixed fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-516078a2-82ea-4847-b18e-4751f4703bc4.png`
- Accepted source: `tools/generate-art/sources/viper-veil-locomotion-supplement-14.png`
- Prompt sent verbatim:

> Create exactly14 separate complete full-body Viper Veil poses in a transparent RGBA sprite sheet, 7 columns × 2 rows, row-major. Use the attached Viper portrait and accepted base as strict canon/style. Same adult human woman with fair warm skin, dark eyes, long vivid electric-blue wavy high ponytail, loose side locks, visible small silver fish-shaped hairpin near one temple, fully human anatomy and navy/electric-blue cyan/white-trim Venom Delta Fangs uniform, dark-blue basketball shoes. Match the exact base proportions, face, hair volume, kit and hand-painted 2D rendering. Keep each complete long ponytail compact and inside its own cell; leave wide empty horizontal gutters and generous row spacing so no hair or figures touch. Row1 cells0-2: upright tall ball-ready standing stances, knees slightly bent, empty right hand at waist height; cells3-6: four upright running strides, varying arm/leg cycle. Row2 cells7-9: low stationary right-hand dribbles with bent knees and empty hand reaching down; cells10-13: low forward-running dribble strides, varied legs and right hand through bounce phases. Every cell has one full figure with head/hair/fish hairpin, hands, feet fully visible. No duplicated poses, no clipping. Hands empty; game adds a separate ball. True transparency, clean natural dark contour only, no red selection halo/glow. No ball, writing, jersey number, logo, floor, court, checkerboard, gridlines, shadows or props.

- Review and map: exactly14 complete figures. Supplement cells0-2 add idle-ball1-3; cells3-6 add run7-10; cells7-9 add dribble7-9; cells10-13 add dribble-run7-10.

## Production and gameplay review

The mapped poses form42 authored drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11; none are synthesized, duplicated or reflected. Hashes, crop rectangles, connected-component counts and frame maps are in `viper-veil-locomotion42-provenance.json` and `viper-veil-locomotion-layouts.json`. All five packed right atlases passed dark/light contact-sheet review. Native gameplay previews select every clip in both directions and show the separate ball following the hand and reaching court on the bounce.
