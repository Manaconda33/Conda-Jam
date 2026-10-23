# J.88 — Keeg receive

Keeg gains the four-frame `receive` clip, taking him to10/29 clips and74 authored drawings. Frame2 is the catch at tick4; the ball is rendered separately.

## Generation history

### Candidate 1 — rejected

Generation `exec-56904677-1447-4b53-9ddd-f453e211f530`, preserved at `tools/generate-art/sources/j88-keeg-receive-candidate1-rejected-background-ball.png`.

Exact prompt:

> Create a transparent RGBA production sprite sheet for Keeg's right-facing `receive` action in JAMVERSE '96. Use the attached accepted Keeg action sprite sheet as strict identity, anatomy, scale, and pixel-art style reference. Keeg is an adult human man with black hair, a neatly trimmed close black beard, an extremely tall ornate purple witch hat with silver trim and small mushroom ornaments, layered lavender, purple and silver athletic cloth, belts, jewelry, rings and restrained occult detailing. Preserve the exact human identity, face, beard, hairstyle, hat height and intact silhouette, mushroom ornaments, natural human proportions, outfit, palette, and chunky arcade sprite art consistently in every pose. No horns, white beard, cloak, staff, magic effects, new character, or distortion. Return exactly four separate complete full-body right-facing poses on a 1536x1024 transparent RGBA sheet, 2 columns by 2 rows, row-major. Broad transparent gutters, generous padding, consistent scale and foot baseline. Each whole figure including entire hat, hands and shoes stays within its cell and away from image edges. Chunky readable 1990s arcade pixel art with crisp dark outlines, original 1990s arcade sports art. The basketball is a separately rendered game object: every hand is empty in the artwork; do not draw any ball, circle, sphere, seams, held object, court, floor, shadow, glow, text, numbers, logo, grid, border, teammate, opponent or extra object. True alpha-zero outside the figures. Pose0 balanced right-facing ready stance, open empty hands relaxed near waist and eyes tracking incoming pass; pose1 step toward incoming pass, raise both open empty hands forward and slightly upward toward chest, eyes tracking; pose2 marked catch at simulation tick4, bring empty hands together at chest height as if securing an invisible ball, elbows bend naturally to absorb impact, hands remain visibly empty; pose3 cushion the catch and draw both empty hands slightly toward chest, settle into balanced stable possession stance while game ball remains separate. Same proportions and hat in every frame. The action must read as a controlled pass reception, with one clear catch on pose2. Return only the sprite sheet.

The sheet contained an atmospheric backdrop and baked basketball in the catch poses, so it was excluded.

### Candidate 2 — rejected

Generation `exec-0e19dfc9-4dc6-4b70-b251-27231003d861`, preserved at `tools/generate-art/sources/j88-keeg-receive-candidate2-rejected-background-ball.png`.

Exact prompt:

> Create a transparent RGBA production sprite sheet for Keeg's right-facing `receive` action in JAMVERSE '96. Use the attached accepted Keeg action sprite sheet as strict identity, anatomy, scale, and pixel-art style reference. Keeg is an adult human man with black hair, a neatly trimmed close black beard, an extremely tall ornate purple witch hat with silver trim and small mushroom ornaments, layered lavender, purple and silver athletic cloth, belts, jewelry, rings and restrained occult detailing. Preserve his exact identity, human proportions, complete intact hat silhouette and palette in every pose. Return exactly four separate complete full-body right-facing poses on a 1536x1024 transparent RGBA sheet, 2 columns by 2 rows, row-major. Broad gutters and padding, consistent scale and foot baseline, no cell crossing or edge clipping. Chunky readable 1990s arcade pixel art with crisp dark outlines. Basketball rendered separately in game: all hands visibly empty, draw no ball, circle, sphere, seams, props, court, floor, shadows, glow, text, logo, border, grid, teammate or opponent. Pose0 balanced ready stance, eyes track incoming pass, open hands near waist. Pose1 step toward incoming pass and raise both open empty hands forward/up toward chest. Pose2 clear marked catch at simulation tick4, hands come together at chest height as though securing invisible ball, elbows absorb impact; hands remain empty. Pose3 cushion catch and draw still-empty hands slightly toward chest, stable possession stance. Same hat, black hair, close black beard, face, adult human anatomy and lavender-purple-silver kit in all four. Keep entire extremely tall ornate purple hat with silver trim and mushroom ornaments intact and within each source cell. No horns, white beard, cloak, staff or magic. Return only the sprite sheet.

It still included a ball and background and was excluded.

### Candidate 3 — rejected edit

Edit generation `exec-f4fdd5b1-3924-449f-85b3-8ad7fb409ebd`, preserved at `tools/generate-art/sources/j88-keeg-receive-candidate3-rejected-background-ball.png`.

Exact edit prompt:

> Edit the first attached four-pose Keeg receive sheet into a clean production sprite sheet, using the second attached accepted Keeg source only as reference for the original chunky, compact 1990s game sprite style. Preserve the exact 2x2 pose arrangement and character identity. CRITICAL corrections: remove the basketball currently visible in both bottom poses completely; all four poses must have visibly empty hands, with empty open hands in poses0 and1 and bare hands meeting at chest in poses2 and3, showing no object. Remove the entire dark/purple gradient background and make all area outside each character truly transparent RGBA alpha zero. Do not add background, floor, cast shadows, glow, panel, grid or any texture. Keep Keeg a consistent adult human man with black hair, close black beard, very tall intact purple witch hat, silver trim and small mushroom ornaments; preserve full hat within every source cell. Preserve lavender/purple/silver basketball clothing and 4 distinct catch poses, but render in compact chunky 1990s arcade sprite pixel art matching the second source, with clear dark pixel outlines rather than polished smooth illustration. Output exactly 1536x1024 transparent RGBA, four full body figures, strict 2 columns x2 rows, row-major. No lettering or extra objects. Do not alter framing or cell order. Return only the corrected sheet.

This edit removed the ball's obvious seams but left a ball-shaped clasp between the hands, so it was rejected.

### Candidate 4 — accepted

Generation `exec-26f3239e-0d2e-4e77-8915-78d7b4709283`; raw source `tools/generate-art/sources/j88-keeg-receive-generated-raw.png`; cleaned source `tools/generate-art/sources/j88-keeg-receive4.png`.

Exact accepted prompt:

> Create a new four-pose right-facing receive animation sheet for Keeg matching the attached accepted JAMVERSE gameplay sprite style and his exact identity. Adult human witch athlete, black hair and close neat black beard, whole very tall purple/silver hat decorated with mushrooms, purple lavender silver athletic kit, same proportions. Transparent RGBA 1536x1024 sheet, exactly four full body figures, strict 2x2 row-major cells, broad empty gutters and margins, aligned shoes. Crisp chunky 1990s arcade pixel sprite art; not smooth painting. The basketball is rendered at runtime by the game. Absolutely no basketball or other object in any frame. Critical hand construction for catch poses: palms face one another with a clear visible transparent empty gap between them; fingers are visibly separated, curved around an EMPTY SPACE, never touching or enclosing an object. At pose2 the game ball will be drawn into this gap separately. No sphere, circle, seam, ball, glow, orb, spell, prop, text, shadows, court, floor or ground. Poses: 0 eyes track incoming pass in relaxed balanced ready stance, open hands near waist; 1 step forward and raise separated open palms toward the incoming pass; 2 catch anchor at tick4, bring EMPTY open hands toward each other at chest, palms facing each other with unmistakably transparent empty space about basketball-sized between them, individually visible fingertips around perimeter but NO shape in the gap; 3 cushion catch, draw empty hands slightly closer while preserving the same completely clear EMPTY transparent gap, settle stable. Every frame entire hat and complete body, no edge clipping. Same outfit throughout. Do not draw background, panel, border or grid, only four figures with true transparent background. Return only the sprite sheet.

Cleanup used `tools/generate-art/clean-dunk-halo.py` with a four-pixel outline margin; 17,611 exterior pixels were removed, with no vivid red pixels. The cleaned sheet contains exactly four alpha-connected full bodies, one per source cell. All cells are in bounds. The original art shows no ball; the chest catch leaves a visible gap for runtime ball placement. The accepted poses preserve Keeg's adult human anatomy, black hair, close beard, complete tall purple hat, silver trim, mushroom ornaments and established purple/lavender/silver kit.

## Runtime and validation

The atlas `public/assets/animation/keeg-receive-right.webp` is 192×192, with four unique 96×96 crops. Keeg's separate receive track is height `[1.25,1.4,1.5,1.4]` and forward `[8,13,15,11]`; catch frame2 is tick4. Canon K.03 approves mirroring. Provenance and source rectangles are in `j88-keeg-receive4-provenance.json` and `keeg-receive4-layouts.json`. No C2PA claim metadata was returned.
