# J.84 — Keeg jump shot

## Initial exact prompt

Create one original transparent RGBA production sprite sheet for Keeg’s right-facing `shoot` action in JAMVERSE ’96. Match the canonical Moonmorel Hex athlete shown in the references: a flamboyant adult human man with black hair and a neatly trimmed close black beard; an extremely tall ornate purple witch hat with silver trim and small mushroom ornaments; layered lavender, purple and silver Moonmorel Hex athletic cloth, belts, rings and restrained occult detailing. Keep his human face, normal athletic human anatomy, hat height and outline, mushrooms, beard, uniform palette and body proportions consistent in every pose. Keep the hat fully visible and never clipped; no horns, cloak, staff, magic effects, white beard or different character. Match the crisp, chunky 1990s arcade sprite style and scale of his existing production sprites. Draw original new shot poses; do not reuse existing animation frames.

Output exactly one 1536×1024 transparent RGBA sprite sheet arranged as five columns by two rows, with ten separate, complete, right-facing full-body Keeg drawings in strict row-major order. Place exactly one pose in each cell with broad transparent gutters, generous outer margins and enough space above the unusually tall hat. No figure may touch an image edge, overlap another pose or cross a cell boundary. Keep consistent human anatomy and pixel-art scale. The game renders the basketball separately: no basketball, sphere, ball seams, hoop, rim, court, floor, cast shadow, glow, effects, text, labels, border, teammate, opponent, staff, spell or extra object may appear anywhere. His natural hands are empty and mime the shot.

Pose 0: planted balanced ready stance, knees soft, hands empty near waist, looking toward the rim.
Pose 1: begin the shot, bend knees and gather empty hands to the lower chest.
Pose 2: compact chest gather, elbows flexed, feet planted, eyes fixed on target.
Pose 3: start upward drive, extend legs and raise both empty hands past chest level.
Pose 4: rise into a jump, raise the shooting hand above and just to the right of the hat brim, guide hand beside it; do not hide or deform the hat.
Pose 5: release at the apex at simulation tick13, shooting wrist flicks forward/up and guide hand opens; both hands remain visibly empty.
Pose 6: clear high follow-through, shooting elbow and wrist extended, guide hand relaxed, hat intact and readable.
Pose 7: descend under control with a soft high follow-through, feet moving toward the ground.
Pose 8: land balanced on both feet with flexed knees, arms lowering naturally.
Pose 9: recover to a calm upright ready stance, both hands empty and feet settled.

The sequence must read as one connected, mechanically sound jump shot: set, bend, gather, rise, clear-hat overhead extension, single release at pose5, follow-through, landing and recovery. Keep the beard, black hair, ornate purple/silver mushroom hat and natural human anatomy faithful to the reference. Keep all body parts complete and the same hat visible in all ten poses. Preserve true alpha-zero transparency outside each figure with clean dark outlines and no exterior matte, speckles or shadow haze. Return only the transparent sprite sheet.

## Generation history

- Initial generation `exec-975b3f60-11b7-4c16-8595-df6b4c4d5d38`, raw `tools/generate-art/sources/j84-keeg-shoot-generated-raw.png`, SHA-256 `0ce958854b7eb77bc7b895b0ffbb59ce8adf133078302d38e50acc64946bbd96`. Rejected because pose2 visibly contains an orange basketball between Keeg’s hands, contrary to the separate-ball requirement.

## No-ball correction exact prompt

This exact Keeg shooting sheet has one prohibited basketball visible between the hands in pose2, the top-row third cell. Edit this sheet and remove that basketball completely: remove its orange circle, outline, seams, shadow and every remaining ball pixel. Redraw only Keeg’s two natural hands at the same locations as empty shooting-set hands, with no round object between them. No pose in any cell may contain a ball, sphere, ball outline, seams or prop. Preserve all ten full-body Keeg poses, their order, framing, size, anatomy, face, beard, black hair, tall purple/silver mushroom hat, uniform, colors, outlines and all pixels outside the small pose2 hand area. Keep the hat intact and uncropped, preserve the 1536×1024 transparent RGBA 5×2 sheet and true alpha-zero background. Add no effects, backdrop, shadow, labels or extra objects. Return only the corrected transparent sprite sheet.

- No-ball edit `exec-7a399a13-31d1-4230-bfab-182592bd8dab`, raw `tools/generate-art/sources/j84-keeg-shoot-correction-generated-raw.png`, SHA-256 `5cb79e1aea538eecf35a9067eb3df8c60a9eb4122318ab61b429164725927549`. Rejected because pose2 still contains an orange basketball after the edit.

## Empty-hand correction exact prompt

The source shows the canon Keeg shot, but the orange basketball still present in pose2 (top-row third cell) is an unacceptable error. Remove the ball with certainty: there must be NO round shape or object between Keeg’s hands in any of the ten frames. In pose2, replace the ball and its seams entirely with empty air and two visible human hands held naturally a few inches apart in an empty shooting set; do not make the hands touch or close into a circle. Keep only the ten athlete drawings. Preserve Keeg’s same poses, timing, anatomy, black hair, trimmed beard, tall ornate purple/silver mushroom hat, clothing, palette, framing and true transparent background. Do not redraw anything except the small hand/ball area of pose2. No ball, circle, sphere, object, prop, shadow, glow, labels or scenery anywhere. Return the edited transparent RGBA sheet.

- Empty-hand edit `exec-2811f407-65da-4596-813b-8a76721ca84a`, raw `tools/generate-art/sources/j84-keeg-shoot-emptyhands-generated-raw.png`, SHA-256 `2c4f288a44845d1a7c2ce870531bd878e365f25ae1167fbc2593521e6fed4c2b`. Rejected because pose1 (top-row second cell) still visibly contained a basketball.

## Final no-ball correction exact prompt

Edit this exact transparent RGBA sprite sheet. There is exactly one forbidden orange basketball between Keeg's hands in pose 1, the top-row second cell. Remove that entire basketball, its orange fill, outline, seams, shadow and every ball pixel. Redraw two natural empty hands at their current positions with a visible gap of empty air between them; do not let fingers curve into a circle. Inspect all ten poses and ensure no pose anywhere contains any basketball, sphere, circular ball shape, seams, prop, or object between hands. The earlier pose 2 is already corrected; leave that pose and all other body pixels unchanged. Preserve exactly ten separate full-body right-facing Keeg drawings in the same 5 by 2 positions, with the same pose anatomy, muscular adult human body, black hair, neatly trimmed black beard, very tall complete purple witch hat with silver trim and mushroom ornaments, purple/lavender/silver uniform, details, colors, proportions and clear outlines. Never crop, bend, shorten or alter the hat. Preserve sheet size 1536 by 1024 and true transparent RGBA background, no scenery or shadows. Do not add, erase or alter anything except the basketball and hand area in pose 1. Return only the corrected image.

- Final no-ball correction `exec-56bb6a3a-c31d-4e4d-b024-9329861ba30d`, raw `tools/generate-art/sources/j84-keeg-shoot-emptyhands2-generated-raw.png`, SHA-256 `259bc3b65141f666e85f35d7dc656d1628e5cc8f6e7bf1047fc49a61f74bc295`. Accepted after full-sheet visual review: all ten hands are empty, Keeg's human face and trimmed black beard remain clear, the tall purple/silver mushroom hat is fully present in every pose, all poses are complete and distinct, and the background is alpha-bearing halo only for cleanup.
