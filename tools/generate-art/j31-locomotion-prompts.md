# J.31 Coppermoon Skyblades locomotion sources

Generation date: 2026-10-22. Runtime roster mapping places Draya Staffwind at zero-based supporting gameplay/portrait cell60 and Kael Rune at cell61. These exact cells were extracted from the current atlases; isolated gameplay crops retain each athlete's largest in-cell alpha component. The supporting-gameplay prompt table is corrected in `supporting-gameplay-sprites.prompt.md` and must stay aligned with `src/content/teams.js`.

Both athletes are original game-only human partners for Coppermoon Skyblades. Preserve the references' distinct faces, hair, builds and plum/copper/pale-gold uniform palette. Names are identifiers, not a reason to invent fantasy props, weapons or anatomy.

## Draya Staffwind

Reference identity: warm medium-brown skin, dark-brown eyes, adult human woman with a focused face, long abundant chestnut-brown locs gathered back in a high ponytail and small gold ties/beads, natural athletic-curvy proportions. Coppermoon kit is deep plum and burnt-copper/rust with pale-gold or cream piping and dark court shoes. No horns, wings, pointed ears, staff or mage details.

### Correct-cell base generation — pending

Generation ID: pending. Source path: `sources/draya-staffwind-locomotion-base.png`.

Prompt:

> Create an original full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human woman, arranged 7 columns by4 rows, strict row-major, transparent RGBA. Use both attached Draya Staffwind actual runtime roster cell60 references as strict identity. Preserve warm medium-brown skin, dark eyes, focused adult face, long abundant chestnut-brown locs gathered into a high ponytail with small gold ties/beads, natural athletic-curvy human build. Match Coppermoon Skyblades colors and reference outfit: sleeveless deep plum and burnt-copper/rust basketball jersey/shorts with pale-gold/cream piping, dark court shoes with pale trim. Clearly human; no elf ears, horns, wings, staff, armor or fantasy props. Keep the 1990s arcade sports illustration style of the references.
>
> Use true transparent background and wide transparent gutters. Each full figure is separate, complete, in-bounds, consistent in scale, three-quarter gameplay view, anatomy and shared row baselines. Keep all locs, hands, fingers and shoes visible. Empty hands, no basketball; game draws its own. No floor, shadow, labels, numbers, logos, grid, checkerboard, border, panels, other people, duplicates or mirrored versions.
>
> Row1: seven upright relaxed idle variations, with pose6 upright and ball-ready, open empty right hand near waist. Row2: seven distinct low stationary right-hand dribbles, bent knees and changing hand bounce phases. Row3: seven distinct upright running strides. Row4: seven low forward dribble-run strides, forward lean and changing legs/right-hand bounce phases.

### Safe supplement — pending

Generate exactly14 additional complete Draya figures after reviewing the accepted base. Preserve the exact cell60 identity and plum/copper/gold kit. The sheet must contain seven upright ball-ready/run poses in its first row and seven dribble/dribble-run poses in its second row, with wide gutters, transparent RGBA, no clips/touching/fused components and no ball or props.

## Kael Rune

Reference identity: warm medium-brown skin, dark eyes, angular adult human man with short dense dark navy-black curls and a close connected beard/mustache, compact muscular natural proportions. Coppermoon kit is deep plum and burnt-copper/rust with pale-gold or cream piping and dark court shoes. Keep him human; the surname does not imply runes, armor or magic props.

### Correct-cell base generation — pending

Generation ID: pending. Source path: `sources/kael-rune-locomotion-base.png`.

Prompt:

> Create an original full-body 2D arcade basketball sprite sheet with exactly 28 separate complete drawings of the same adult human man, arranged 7 columns by4 rows, strict row-major, transparent RGBA. Use both attached Kael Rune actual runtime roster cell61 references as strict identity. Preserve warm medium-brown skin, dark eyes, strong angular adult human face, short dense dark navy-black curls, close connected beard and mustache, compact muscular natural adult build. Match Coppermoon Skyblades colors and reference outfit: sleeveless deep plum and burnt-copper/rust basketball jersey/shorts with pale-gold/cream piping, dark court shoes with pale trim. Keep Kael clearly human, not a creature or armored fantasy warrior. Match the illustrated 1990s arcade sports style of the references.
>
> Use true transparent background and wide transparent gutters. Each full figure is separate, complete, in-bounds, consistent in scale, three-quarter gameplay view, anatomy and shared row baselines. Keep curls, hands, fingers and shoes visible. Empty hands, no basketball; game draws its own. No floor, shadow, labels, numbers, logos, grid, checkerboard, border, panels, other people, duplicates or mirrored versions.
>
> Row1: seven upright relaxed idle variations, with pose6 upright and ball-ready, open empty right hand near waist. Row2: seven distinct low stationary right-hand dribbles, bent knees and changing hand bounce phases. Row3: seven distinct upright running strides. Row4: seven low forward dribble-run strides, forward lean and changing legs/right-hand bounce phases.

### Safe supplement — pending

Generate exactly14 additional complete Kael figures after reviewing the accepted base. Preserve the exact cell61 identity and plum/copper/gold kit. The sheet must contain seven upright ball-ready/run poses in its first row and seven dribble/dribble-run poses in its second row, with wide gutters, transparent RGBA, no clips/touching/fused components and no ball or props.

## Assembly and review

Expected assembled source per athlete:42 unique drawings across idle6, idle-ball4, dribble10, run11 and dribble-run11. Map each reviewed 28-pose base and14-pose supplement to the standard 42-frame sequence. Preserve all raw sources, generation IDs, hashes, source rectangles, exclusions, pose maps, atlas layouts and visual review. Never crop fused figures into separate poses.
