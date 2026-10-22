# J.29 locomotion source generations

Generation date: 2026-10-22. Generated outputs are retained under `tools/generate-art/sources/`; image-generation IDs are recorded in `assemble-supporting-locomotion42.py` and source provenance.

## Moss Granite

Canonical read from the portrait and isolated gameplay reference: adult human man; warm medium-deep brown skin; dark eyes; full shaped black beard; short dark wavy hair under an olive/moss-green and gold athletic headband; broad muscular build. Greenwall Giants kit is moss-green and stone/cream with gold trim and dark olive shoes.

### Base generation — accepted as 28 source poses

Image generation ID: `exec-fb70fa07-573c-436e-be17-818397be17c7`

Prompt:

> Create an original polished full-body 2D character sprite sheet for a 1990s arcade basketball game. Exactly28 separate complete drawings of the SAME adult human man, 7 columns × 4 rows, strict row-major, true transparent RGBA background. Use attached Moss Granite portrait and isolated gameplay crop as strict identity references. Moss is an adult human with rich medium-deep warm-brown skin, dark brown eyes, a strong face, full neatly shaped black beard, dense short dark hair beneath an olive-green/gold athletic headband with small gold motif, broad muscular adult build. Outfit: sleeveless moss-green basketball jersey and shorts with pale stone/cream panels and fine gold trim, dark olive-green court shoes. Preserve his face, beard, headband, skin, build and Moss Green/Stone/Gold Greenwall Giants identity in all28 drawings. High quality hand-painted 2D arcade sports game art; natural adult anatomy and clean dark contours. Pose grid: cells0-5 relaxed upright idle variations; cell6 upright ball-ready stance, tall torso, one open hand at waist; cells7-13 low stationary right-hand dribbles; cells14-20 distinct upright running strides; cells21-27 low forward dribble-run strides, leaning, varied limbs and right hand reaching through low bounce phases. Hands empty; runtime draws separate ball. Keep headband and hair in every pose, whole fingers and shoes in bounds, consistent 3/4 gameplay view and scale, feet near common baseline per row, large clear transparent gutters, one full separated body per cell, no cropping or touching. True RGBA, not checkerboard. No animal anatomy, no tattoos, mask, extra armor, ball, lettering, number, logo, floor, court, grid line, shadows, glow or props.

### Supplement generation — rejected, do not pack

Image generation ID: `exec-b4169617-b316-49d7-977b-a2d9ce6a281e`; preserved as `moss-granite-locomotion-supplement-14-incomplete-fused.png`.

Prompt:

> Using the Moss Granite portrait and accepted base as strict identity and style references, create exactly14 new separate complete full-body drawings in a transparent 7-column × 2-row RGBA sprite sheet. Same adult human muscular man, warm medium-deep brown skin, dark eyes, full shaped black beard, dark hair under olive-green/gold athletic headband, sleeveless moss-green jersey and shorts with stone/cream panels and fine gold trim, dark olive court shoes. Match the accepted base face, hair, beard, headband, adult body and palette exactly. Row1 cells0-2: three upright standing ball-ready poses, tall torso, knees only slightly bent, empty right hand open at waist/hip, no crouch. Cells3-6: four distinct upright run strides. Row2 cells7-9: three low stationary right-hand dribble poses with bent knees and empty hand reaching low. Cells10-13: four forward low dribble-run strides with varied leg positions and right hand through bounce phases. Game runtime draws the ball, so empty hands. One full body per cell, clear wide transparent gutters, no touching or cropping; complete headband/hair, hands and shoes remain within cell. Same 3/4 camera scale, natural human anatomy, subtle action changes, no duplicate frames. True transparent RGBA, no checkerboard. No beard change, no animal features, ball, text, number, logo, court, floor, grid lines, shadows, glow, tattoos or props.

Audit found only12 alpha components in the intended14-pose grid. One broad lower-row component joins multiple motion figures. The source is kept for rejection history and must not be cropped into fake separate poses. Generate a new wider-spaced supplement before attempting Moss assembly.

## Thump Alder

Canonical read from the portrait and isolated gameplay reference: adult human woman; fair warm-peach skin; dark brown eyes; abundant black wavy hair in large high rounded/twin ponytail puffs with green, orange and gold ties; natural athletic-curvy build. Greenwall Giants kit is moss-green with stone and gold trim.

### Base generation — accepted as 28 source poses

Image generation ID: `exec-bdcea393-c60b-4ff6-9e64-63a5ef1aa144`

Prompt:

> Create a polished original 2D basketball sprite sheet for a 1990s arcade game. Exactly28 separate complete full-body drawings of the SAME adult human woman, arranged 7 columns × 4 rows, row-major on true transparent RGBA. Attached portrait and isolated gameplay crop are strict Thump Alder identity references. She is a mature adult human athlete with fair warm peach skin, dark brown eyes, confident face, abundant thick black wavy hair arranged in a large high side ponytail/bun with several loose bangs and short green, amber-orange and gold hair ties; strong natural athletic-curvy proportions. Her Greenwall Giants uniform is a sleeveless deep moss-green basketball jersey and shorts with royal-gold/stone piping and dark moss shoes. Keep the single voluminous black ponytail silhouette, loose face-framing locks and multicolor ties visible across the poses; no animal anatomy. Natural adult hands/feet/face, high-quality hand-painted 2D arcade sports game style, clean dark contour. Pose cells0-5: six upright relaxed idle variations; cell6 upright ball-ready with hand open at waist. Cells7-13: seven low stationary right-hand dribbles. Cells14-20: seven distinct upright running strides with ponytail following motion. Cells21-27: seven low forward dribble-run strides, varied leg phases and right hand reaching low. Empty hands, the game draws the ball. Same 3/4 view and scale; each complete ponytail, fingers and shoes fits in its own cell; use extra wide side gutters so the voluminous high ponytail never touches another figure; one separated body per cell, feet near row baseline. True transparent alpha, not checkerboard. No ball, text, number, logo, floor, court, shadows, glow, red selection halo, props, tattoos or fantasy effects.

### First supplement generation — rejected, do not pack

Image generation ID: `exec-868b9ac4-9ff1-4ea0-9db0-4d7c8c9a0945`; preserved as `thump-alder-locomotion-supplement-14-edge-clipped-rejected.png`.

The 7×2 sheet had two clipped outer poses and a touching pair. Audit leaves11 isolated usable components, so this is retained only as rejected source history. The original full prompt text was not separately persisted; its categories were three upright ball-ready, four running, three stationary dribble, and four dribble-run poses.

### Safe-margin retry — accepted as 14 source poses

Image generation ID: `exec-1b0c5f3d-b2b7-4615-a54b-31348e6105b5`

Prompt:

> Regenerate a safer exact14-frame Thump Alder source sheet using the attached portrait and accepted base as strict identity references. Transparent RGBA sheet, 7 columns × 2 rows, strict row-major, with a wide 90-pixel transparent outer margin on all four edges and at least45 pixels of transparent gutter between cells. Draw each full figure at 78% of the previous cell scale so both outside columns remain wholly inside the image; no body, shoes, hands, hair buns or pixels may touch the image boundary. Adult human woman, fair warm peach skin, dark eyes, confident face, black wavy hair in two large rounded high ponytail puffs/buns tied with green, amber-orange and gold bands, athletic-curvy natural build, moss-green sleeveless Greenwall Giants uniform with royal-gold/stone trim and dark moss shoes. Match the base identity, proportions and hand-painted arcade 2D style. Exactly one separated figure in every cell; exactly14 figures, not fewer. Row1 cells0-2 tall upright ball-ready poses with an open empty right hand at waist height; cells3-6 four upright run strides. Row2 cells7-9 low stationary right-hand dribble poses; cells10-13 low forward-running dribble strides. Keep all hair, hands, fingers and shoes complete and comfortably centered; ample transparent gutters; no touching. No ball because game adds it, no text, number, logo, court, floor, shadows, glow, checkerboard or props. Do not crop either end column; preserve true alpha.

The safe retry has14 separated in-bounds components and has been assembled into `sources/thump-alder-locomotion42.png`. Mapping follows the standard42-pose map documented in the source provenance and handoff.
