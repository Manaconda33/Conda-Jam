# Eden North locomotion generation record

Canon references: `references/eden-north-portrait-reference.png` and `references/eden-north-gameplay-reference.png` (Cobalt / black, master roster section J.17, supporting atlas cell33). Eden is an adult human woman with fair warm skin, bright blue eyes, and a voluminous golden-blonde curly high ponytail.

## Rejected first base candidate

Exact imagegen prompt:

> Create one polished transparent character-art contact sheet for JAMVERSE '96 using BOTH attached Eden North reference images as the exact identity and uniform canon. Eden North is an adult human woman with fair warm skin, bright blue eyes, a mass of vivid golden-blonde curls gathered in a high secured ponytail, a friendly but competitive face, and a natural lean athletic adult basketball build. Match her recognizable face, tightly curly blonde ponytail, complexion, and existing Cobalt/black team styling from the images: dark navy/black basketball jersey and shorts with cobalt-blue piping and small restrained metallic-blue accents, purple/navy high-top basketball shoes. Keep her hair tied up and clearly separated from the arms; preserve normal human anatomy, natural athletic proportions, and her adult face. No animal or fantasy traits, no facial piercings, no jewelry or props. Render screen-right three-quarter profile with the face still visible.
>
> Exactly35 distinct complete full-body drawings, a strict7-column by5-row grid read left-to-right and top-to-bottom. Each drawing is a separate pose, not a duplicate or held copy. Pose order: indices0-5 subtle upright ready-idle breathing and weight shifts; index6 a spare ready pose; indices7-13 a low stationary right-hand dribble cycle with progressive reach and recovery; indices14-16 three more distinct low stationary dribble frames; indices17-19 unused transitional ready/cut poses; indices20-27 a continuous athletic run cycle with alternating arms and legs; indices28-34 a low forward-leaning dribble-run cycle with progressive lead-hand court reach and recovery. Hands stay empty and no ball is drawn; the game renders the real basketball separately.
>
> Consistent size, camera and foot baseline; preserve clear transparent gaps around every person. Keep hair, hands, shorts, legs and both shoes entirely inside each drawing. Elegant polished 1990s arcade basketball sprite illustration, clean readable limb silhouettes, crisp dark outlines and rich but controlled shading. Genuine transparent RGBA background. Absolutely no grid lines, dividers, cell boxes, floor, shadows, court, scene, gradients, text, numbers, logos, extra people, horns, animals or props.

Generated image: `/workspace/generated_images/exec-5941638a-d8f7-48c5-b3d1-9907907b361a.png`, retained as `sources/eden-north-locomotion-base-rejected-attached.png`. It contained a figure pair joined across the row4/row5 boundary (34 alpha-connected figures rather than35), so the complete candidate was rejected before assembly.

## Base sheet (accepted)

Exact retry prompt:

> Regenerate Eden North's JAMVERSE '96 production sprite base using the two attached Eden portrait/gameplay references as exact face, hair, skin and uniform canon. Adult human woman; fair warm skin; bright blue eyes; vivid blonde curls gathered high in a secured ponytail; natural lean athletic adult proportions; dark navy/black Cobalt team jersey and shorts with cobalt-blue trim; purple/navy high-top shoes. Keep her identity and anatomy consistent in every pose.
>
> Exactly35 separate, complete poses in an exact7-column by5-row grid. The five horizontal pose rows must have at least35 transparent pixels between their silhouettes so no figure can touch the next row. Keep every body no taller than150 pixels in this 1060px-tall sheet and each figure narrower than175 pixels; preserve both shoes, hands, curls and ponytail with transparent space around all edges. Each sprite must occupy only its own cell; do not let ponytails, legs or arms cross any row or column gap. Row-major actions: indices0-5 distinct upright idle; 6 spare ready pose; 7-13 low stationary right-hand dribble; 14-16 further low stationary dribble poses; 17-19 neutral transition poses; 20-27 alternating-leg running poses; 28-34 low forward dribble-run reaches. Screen-right three-quarter profile, face visible. Empty hands, no drawn ball.
>
> Polished crisp 1990s arcade sports sprite art, clear ink contours. Genuine transparent RGBA. Generous transparent gutters, especially between row4 and row5. No shadows, floor, court, dividers, boxes, grid marks, text, numbers, logos, extra people, props, clipping or cropping.

Generated image: `/workspace/generated_images/exec-c2e7fa27-bdfe-46a6-8a56-201329bcf9ee.png`, copied unchanged to `sources/eden-north-locomotion-base.png`. Review found exactly35 alpha-separated, complete figures with clear row gutters and no clipped borders.

## Run and dribble-run supplement

Exact imagegen prompt:

> Generate exactly seven distinct full-body running and dribble-running poses for Eden North as a transparent horizontal animation strip. Use the attached portrait, gameplay and accepted base sheet as the exact identity and team uniform references. Eden is an adult human woman with fair warm skin, vivid blue eyes, a high secured ponytail of abundant golden-blonde curls, natural lean athletic adult proportions, dark navy/black Cobalt jersey and shorts with cobalt-blue trim, purple/navy high-top basketball shoes. Preserve her face, eyes, ponytail, uniform and human anatomy in every pose. Seven separate screen-right three-quarter sprites with consistent scale, clear transparent gaps and complete curls, arms, fingers, legs and shoes. Poses1-3: varied natural alternating-leg run cycle. Poses4-7: low forward dribble-run strides with alternating legs and her lead hand reaching down toward a court bounce, then recovering. No ball drawn. Never let her ponytail join another figure or become a cape. Polished shaded 1990s arcade basketball sprites with strong clean outlines, no outer glow. Real transparent RGBA, no floor, shadow, text, labels, grid, boxes, logos, scenery or extra people.

Generated image: `/workspace/generated_images/exec-245f980c-f882-4dc3-bbea-f07125fe4caf.png`, copied unchanged to `sources/eden-north-locomotion-supplement-a.png`. Exactly seven transparent, separated poses passed border review.

## Upright ball-ready supplement

Exact imagegen prompt:

> Generate seven distinct upright ball-ready stance drawings for Eden North using the attached portrait, gameplay and accepted base sheet as exact canon. Adult human woman, fair warm skin, vivid blue eyes, golden-blonde high curly ponytail secured high, natural lean athletic adult proportions, dark navy/black Cobalt jersey and shorts with cobalt-blue trim, purple/navy high-tops. Keep face, complexion, hairstyle, team palette and human anatomy consistent. Seven full-body separate screen-right three-quarter poses in a transparent horizontal strip, identical camera scale, generous alpha gaps. Knees gently bent, chest upright, both hands curved at waist/chest height around an invisible basketball; vary shoulder angle, hand distance and weight placement. These are calm stationary receiving poses only: no run, deep crouch, dribble or ball. Keep the large ponytail attached and entirely inside each pose with no touching or overlap. Every finger and both shoes visible. Crisp shaded 1990s arcade basketball sprite art, dark readable outlines, no rim glow. True transparent RGBA; no floor, shadows, cell boxes, grid lines, words, numbers, logos, scenery, props or other figures.

Generated image: `/workspace/generated_images/exec-1c11c400-ad39-498e-a39a-499186beb803.png`, copied unchanged to `sources/eden-north-locomotion-supplement-b.png`. Exactly seven transparent, separated poses passed border review.
