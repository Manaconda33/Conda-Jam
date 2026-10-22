# Auric Scale J.27 locomotion source record

Identity: J.27 Crownfire Sovereigns, supporting source cell52. The portrait/gameplay crops show an adult human man with warm light-tan skin, dark eyes, clean-shaven youthful face, dense golden-blond curls, muscular build and royal-blue/gold uniform. References are preserved as `tools/generate-art/references/auric-scale-portrait-reference.png` and `auric-scale-gameplay-reference.png`. Gameplay reference removes the adjacent atlas poses while retaining the largest connected character sprite.

## Base sheet

- ImageGen output: `/workspace/generated_images/exec-df54b4de-a01b-48b1-a9b7-f057796c2a3a.png`
- Accepted copy: `tools/generate-art/sources/auric-scale-locomotion-base.png`
- Prompt sent verbatim:

> Generate a polished original arcade basketball sprite sheet: exactly28 separate complete full-body drawings of the SAME adult human man, arranged in a precise transparent 7-column × 4-row grid, strict row-major. The attached Auric Scale portrait is the identity reference. The gameplay atlas crop is not used because it contains unwanted red UI selection artifacts. Auric is an adult human male player, warm light-tan skin, dark eyes, strong youthful clean-shaven face, very full short golden-blond curls, broad muscular adult build and fully human anatomy. Outfit is sleeveless royal-blue and bright-gold Crownfire Sovereigns basketball jersey and shorts, fine gold piping, dark royal-blue court shoes. Keep the face, skin, distinct rounded golden curls, muscular silhouette and blue/gold kit consistent in every frame. Beautiful clean high-resolution hand-painted 2D sports-game character rendering, crisp controlled outlines using dark navy/brown only, careful polished edges. There must be no red outline, no red rim light, no selection glow, no red fringe, no red shadow, no scanline or chromatic fringe; do not add any outline other than a fine natural dark ink contour. Transparent alpha around each figure, true RGBA. Pose map: first row cells0-5 six relaxed upright idle variations plus cell6 an upright ball-ready stance with right hand near waist; second row cells7-13 seven low stationary right-hand dribble poses; third row cells14-20 seven distinct run strides; fourth row cells21-27 seven low forward-running dribble strides. Empty hands; runtime adds ball. Natural human body, consistent 3/4 gameplay view, same scale, complete hair/hands/fingers/shoes inside each cell, feet at a common baseline within each row; generously spaced with transparent gutters, every silhouette distinct and separated. No ball, lettering, jersey number, logo, floor, court, checkerboard, grid line, drop shadow, glow, props or other objects. Ensure completely transparent background, zero colored pixels outside the figures.

- Layout: 7×4 bands of seven poses, mapped to idle6 + ball-ready1, dribble7, run7 and dribble-run7. The accepted sheet contains28 distinct, separated in-bounds RGBA human figures. A first Auric attempt using the gameplay crop retained distracting red selection-edge color from the sprite atlas; it is retained unselected. An ImageGen edge-cleanup attempt did not remove the fringe and is also unselected.

## Mixed fourteen-pose supplement

- ImageGen output: `/workspace/generated_images/exec-13185796-e218-4909-8259-5811ea4dcb43.png`
- Accepted copy: `tools/generate-art/sources/auric-scale-locomotion-supplement-14.png`
- Prompt sent verbatim:

> Using the Auric Scale portrait and accepted sprite base as strict identity/style references, create a transparent RGBA sheet of EXACTLY fourteen separate complete full-body original drawings in a 7-column by 2-row grid. Adult human man, warm light-tan skin, dark eyes, youthful clean-shaven face, dense golden-blond curls, broad muscular build, royal-blue/gold Crownfire Sovereigns sleeveless jersey and shorts with clear gold piping, dark-blue shoes. Match the accepted base's body proportions, 3/4 camera view, hand-painted arcade rendering and colors exactly. No red UI selection fringe or colored glow; clean natural dark contours. Row1 cells0-2: THREE upright standing ball-ready poses: tall torso, nearly straight legs, one open hand at hip/waist height; no crouching. Cells3-6: four upright running strides with varied arm and leg positions. Row2 cells7-9: three low stationary right-hand dribble poses, bent knees and empty right hand reaching low. Cells10-13: four forward-leaning low dribble-run strides, varied legs and empty right hand passing through different bounce phases. All hands empty; game runtime supplies the ball. Full hair, hands, fingers and shoes inside each cell; generous transparent space between bodies and rows, no figure touching or clipping. Keep exactly one drawing per cell, consistent scale and complete anatomy. No ball, lettering, number, logo, floor, court, checkerboard, grid lines, shadow, aura, red highlight, props or extra objects.

- Review: fourteen separate complete poses, in row-major order. Row1 cells0-2 add upright ball-ready; cells3-6 add run. Row2 cells7-9 add stationary dribble; cells10-13 add dribble-run.

## Production map

The final42 drawings contain idle6, idle-ball4, dribble10, run11 and dribble-run11; pose frames are not synthesized, mirrored or duplicated. The frame-to-source map, image hashes, crops and source component records are in `auric-scale-locomotion42-provenance.json` and `auric-scale-locomotion-layouts.json`. Packed atlases were reviewed on dark and light backgrounds. Native gameplay preview checks all clips in both facings with the separate basketball.

## Unselected image-generation candidates

- `/workspace/generated_images/exec-ca7e55fa-b138-44e3-b67a-b1246953bc3e.png` (`tools/generate-art/sources/auric-scale-locomotion-base-red-fringe-rejected.png`): first base candidate used both portrait and gameplay atlas reference and carried distracting atlas-red edge color; none of its poses are packed.
- `/workspace/generated_images/exec-4c973699-72de-46ea-bb33-123c8a1e28b6.png` (`tools/generate-art/sources/auric-scale-locomotion-base-edge-cleanup-attempt.png`): image-gen cleanup attempt retained red fringe; none of its poses are packed.
