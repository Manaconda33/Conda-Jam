# J.31 Coppermoon Skyblades locomotion sources

Generation date: 2026-10-23. Runtime roster mapping places Draya Staffwind at zero-based supporting gameplay/portrait cell60 and Kael Rune at cell61. These exact cells were extracted from the current atlases; isolated gameplay crops retain each athlete's largest in-cell alpha component. The supporting-gameplay prompt table is corrected in `supporting-gameplay-sprites.prompt.md` and must stay aligned with `src/content/teams.js`.

Both athletes are original game-only human partners for Coppermoon Skyblades. Preserve the references' distinct faces, hair, builds and plum/copper/pale-gold uniform palette. Names are identifiers, not a reason to invent fantasy props, weapons or anatomy.

## Draya Staffwind

Reference identity: warm medium-brown skin, dark-brown eyes, adult human woman with a focused face, long abundant chestnut-brown locs gathered back in a high ponytail and small gold ties/beads, natural athletic-curvy proportions. Coppermoon kit is deep plum and burnt-copper/rust with pale-gold or cream piping and dark court shoes. No horns, wings, pointed ears, staff or mage details.

### Correct-cell base generation — accepted

Accepted generation ID: `exec-ec41ee7e-271a-4ed2-a26e-dac1c8464815`. Source path: `sources/draya-staffwind-locomotion-base.png`. SHA256: `d7ad1b00ae0be501a04799b9438f3f8d433ac831376f426789f5854f27e04aef`.

Review: 1659×948 transparent RGBA; 28 substantial alpha-connected figures, all in bounds. Four seven-figure rows are visually separated. The retry was reviewed against both exact-cell references: identity, uniform, human anatomy, complete limbs, action rows and empty hands match the prompt. The red edge fringe also appears in the extracted in-game reference sprites and is not an added opaque background.

Prompt:

> Create an original full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human woman, arranged 7 columns by4 rows, strict row-major, transparent RGBA. Use both attached Draya Staffwind actual runtime roster cell60 references as strict identity. Preserve warm medium-brown skin, dark eyes, focused adult face, long abundant chestnut-brown locs gathered into a high ponytail with small gold ties/beads, natural athletic-curvy human build. Match Coppermoon Skyblades colors and reference outfit: sleeveless deep plum and burnt-copper/rust basketball jersey/shorts with pale-gold/cream piping, dark court shoes with pale trim. Clearly human; no elf ears, horns, wings, staff, armor or fantasy props. Keep the 1990s arcade sports illustration style of the references.
>
> Use true transparent background and wide transparent gutters. Each full figure is separate, complete, in-bounds, consistent in scale, three-quarter gameplay view, anatomy and shared row baselines. Keep all locs, hands, fingers and shoes visible. Empty hands, no basketball; game draws its own. No floor, shadow, labels, numbers, logos, grid, checkerboard, border, panels, other people, duplicates or mirrored versions.
>
> Row1: seven upright relaxed idle variations, with pose6 upright and ball-ready, open empty right hand near waist. Row2: seven distinct low stationary right-hand dribbles, bent knees and changing hand bounce phases. Row3: seven distinct upright running strides. Row4: seven low forward dribble-run strides, forward lean and changing legs/right-hand bounce phases.

Retry prompt addition: every hand is empty in all28 drawings; absolutely no basketballs, spheres, held objects or round props anywhere, including dribble poses. Dribble poses show only the athlete's hands; runtime renders the separate ball.

### Base rejected with balls

Generation ID: `exec-47231036-5f56-4050-b2ca-53dad11cda24`. Source path: `sources/draya-staffwind-locomotion-base-rejected-with-balls.png`. SHA256: `85b3baa104f0ce9edf51fac30a428b3df0022f9b43b02ae9059feefdc53f2bb1`. The sheet had28 separated in-bounds figures, but generated basketballs appeared in the ball-ready and dribble poses despite the prompt's empty-hands instruction. It is retained unmodified as rejected history and never packed. Its prompt is the base prompt above before the retry addition.

### Safe supplement — accepted

Generation ID: `exec-a58be28b-1597-4119-b4be-8c6b3195859f`. Source path: `sources/draya-staffwind-locomotion-supplement-14.png`. SHA256: `e2eff8d8c9e52dde7833d08d6b510069e03c3fbffbd6cac39e935806e78f2ce3`.

Review: 2032×774 transparent RGBA; exactly14 substantial, separated alpha components across two seven-pose rows, none clipped, and all14 image hashes are unique. Reviewed visually against both exact-cell references and the accepted base. All hands are empty; no basketball or props are embedded.

Prompt:

> Generate exactly14 new complete full-body drawings of Draya Staffwind on a wide transparent RGBA sheet, 7 columns by2 rows, strict row-major. Use the attached exact-cell portrait, isolated gameplay crop and accepted28-pose base as strict identity and style references. Keep her warm medium-brown skin, dark-brown eyes, focused adult human face, long abundant chestnut-brown locs gathered into a high ponytail with small gold ties/beads, and natural athletic-curvy adult proportions. Match the base's sleeveless deep-plum and burnt-copper/rust basketball jersey and shorts with pale-gold/cream piping and dark court shoes with pale trim. No horns, wings, pointed ears, staff, armor, fantasy details, number, text, logo, ball or prop.
>
> Use true transparency, wide outer margins and generous gutters. Draw each full figure at about55% of its cell width and60% of its row height. Separate every silhouette; no touching, clipping, overlap or fused alpha components. Keep every loc, hand, finger and shoe well inside the canvas. Preserve the accepted base's three-quarter gameplay camera, scale, shared row baselines, human anatomy and illustrated arcade shading. No floor, shadow, grid, checkerboard, border, labels, panels, extra people, duplicate drawings or mirrored pose variants. The game draws its own separate basketball, so every hand is empty.
>
> Exact order: row1 cells0–2 are three upright ball-ready stances with distinct weight shifts and open empty right hands near waist height; cells3–6 are four clearly different upright running strides. Row2 cells0–2 are three low stationary right-hand dribbles at distinct bounce phases; cells3–6 are four low forward dribble-run strides with varied leg positions and the right hand cycling through different low bounce phases. Draw14 distinct complete in-bounds figures.

## Kael Rune

Reference identity: warm medium-brown skin, dark eyes, angular adult human man with short dense dark navy-black curls and a close connected beard/mustache, compact muscular natural proportions. Coppermoon kit is deep plum and burnt-copper/rust with pale-gold or cream piping and dark court shoes. Keep him human; the surname does not imply runes, armor or magic props.

### Correct-cell base generation — accepted

Generation ID: `exec-796741ae-88ca-42b3-9bed-e0abfaa1be81`. Source path: `sources/kael-rune-locomotion-base.png`. SHA256: `2d0b114d82986cb31a1231ae1bc049ddc54cda82f88a549eed1301c3bd2a5cd9`.

Review: 1659×948 transparent RGBA; 28 substantial alpha-connected figures, all in bounds. Four seven-figure rows are visually separated. Reviewed against both exact-cell references: short dense navy-black curls, connected beard/mustache, angular face, compact muscular human build and Coppermoon uniform are consistent. Hands are empty in every pose; no ball or prop is embedded.

Retry prompt addition: every hand is empty in all28 drawings; absolutely no basketballs, spheres, held objects or round props anywhere, including dribble poses. Dribble poses show only the athlete's hands; runtime renders the separate ball.

Prompt:

> Create an original full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human man, arranged 7 columns by4 rows, strict row-major, transparent RGBA. Use both attached Kael Rune actual runtime roster cell61 references as strict identity. Preserve warm medium-brown skin, dark eyes, strong angular adult human face, short dense dark navy-black curls, close connected beard and mustache, compact muscular natural adult build. Match Coppermoon Skyblades colors and reference outfit: sleeveless deep plum and burnt-copper/rust basketball jersey/shorts with pale-gold/cream piping, dark court shoes with pale trim. Keep Kael clearly human, not a creature or armored fantasy warrior. Match the illustrated 1990s arcade sports style of the references.
>
> Use true transparent background and wide transparent gutters. Each full figure is separate, complete, in-bounds, consistent in scale, three-quarter gameplay view, anatomy and shared row baselines. Keep curls, hands, fingers and shoes visible. Empty hands, no basketball; game draws its own. No floor, shadow, labels, numbers, logos, grid, checkerboard, border, panels, other people, duplicates or mirrored versions.
>
> Row1: seven upright relaxed idle variations, with pose6 upright and ball-ready, open empty right hand near waist. Row2: seven distinct low stationary right-hand dribbles, bent knees and changing hand bounce phases. Row3: seven distinct upright running strides. Row4: seven low forward dribble-run strides, forward lean and changing legs/right-hand bounce phases.

### Safe supplement — accepted

Generation ID: `exec-2d8a16f5-0097-4a40-98ae-f15755ce5331`. Source path: `sources/kael-rune-locomotion-supplement-14.png`. SHA256: `bb0755bb6ec3233567e0c529f8d0b40e18e40d3a6657dcdfb6151d7cc0d8ad40`.

Review: 1983×793 transparent RGBA; exactly14 substantial, separated alpha components across two seven-pose rows, none clipped, and all14 image hashes are unique. Reviewed against both exact-cell references and the accepted base. All hands are empty; no basketball or props are embedded.

Prompt:

> Generate exactly14 new complete full-body drawings of Kael Rune on a wide transparent RGBA sheet, 7 columns by2 rows, strict row-major. Use the attached exact-cell portrait, isolated gameplay crop and accepted28-pose base as strict identity and style references. Keep his warm medium-brown skin, dark eyes, angular adult human face, short dense dark navy-black curls, close connected beard and mustache, and compact muscular natural adult proportions. Match the base's sleeveless deep-plum and burnt-copper/rust basketball jersey and shorts with pale-gold/cream piping and dark court shoes with pale trim. Keep Kael clearly human; no runes, horns, wings, pointed ears, armor, fantasy details, number, text, logo, ball or prop.
>
> Use true transparency, wide outer margins and generous gutters. Draw each full figure at about55% of its cell width and60% of its row height. Separate every silhouette; no touching, clipping, overlap or fused alpha components. Keep curls, head, hands, fingers and shoes well inside the canvas. Preserve the accepted base's three-quarter gameplay camera, scale, shared row baselines, human anatomy and illustrated arcade shading. No floor, shadow, grid, checkerboard, border, labels, panels, extra people, duplicate drawings or mirrored pose variants. The game draws its own separate basketball, so every hand is empty.
>
> Exact order: row1 cells0–2 are three upright ball-ready stances with distinct weight shifts and open empty right hands near waist height; cells3–6 are four clearly different upright running strides. Row2 cells0–2 are three low stationary right-hand dribbles at distinct bounce phases; cells3–6 are four low forward dribble-run strides with varied leg positions and the right hand cycling through different low bounce phases. Draw14 distinct complete in-bounds figures.

## Assembly and review

Expected assembled source per athlete:42 unique drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. Map each reviewed 28-pose base and14-pose supplement to the standard 42-frame sequence. Preserve all raw sources, generation IDs, hashes, source rectangles, exclusions, pose maps, atlas layouts and visual review. Never crop fused figures into separate poses.

J.31 assembly and review completed: Draya and Kael each have a 7×6 transparent source, five registered right-facing atlases, canon-safe mirror review, and athlete-specific right-hand tracks. All10 atlases were checked on dark and light grounds. Native Canvas previews for each athlete at standard and zoom120 load105 images and capture87 snapshots; every authored locomotion clip selects the production art in both facings. Ball-ready and low dribble/run hand positions were reviewed in the rendered court views. The preview harness samples the authored bounce anchor for dribble clips. Outputs are under `artifacts/native-render-preview/{draya-staffwind,kael-rune}{,-zoom120}/`.
