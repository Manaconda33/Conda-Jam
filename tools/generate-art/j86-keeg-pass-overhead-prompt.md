# J.86 — Keeg overhead pass

## Initial exact prompt

Create a transparent RGBA production sprite sheet for Keeg’s right-facing `pass-overhead` action in JAMVERSE ’96. Match the exact canonical Moonmorel Hex character shown in the supplied references: an adult human man, black hair, neatly trimmed close black beard, extremely tall ornate purple witch hat with silver trim and small mushroom ornaments, layered lavender/purple/silver athletic cloth with belts, rings, jewelry and restrained occult detailing. Keep his normal human anatomy, face, hair, beard, hat height and intact silhouette, mushrooms, outfit, palette, proportions and arcade sprite rendering consistent throughout all six poses. The tall hat stays fully visible, intact and uncropped; the arms pass beside it, never through it. No horns, white beard, cloak, staff, spell or new character.

Return exactly one 1536×1024 transparent RGBA image with six separate complete right-facing full-body Keeg drawings in a 3-column by 2-row grid, strict left-to-right row-major order. Each pose must be fully inside its cell, with broad clear gutters and generous outer margins, especially above the hat. Keep the same body scale; no figure may touch the image edge, cross a cell boundary, overlap another figure or have any body part clipped. Show a mechanically connected two-handed overhead pass, with distinct poses and a clear release.

The game renders the basketball separately. Every hand is empty. Do not include any basketball, orange circle, sphere, ball seams, hoop, rim, court, floor, cast shadow, glow, spell, effect, label, text, logo, border, grid line, staff, prop, extra object, teammate or opponent. Empty hands may mime a ball but must not draw one. Preserve true alpha-zero transparency outside Keeg; no painted background, checkerboard or matte. Use crisp original 1990s arcade sprite art with clean dark outlines and readable anatomy. Return only the sprite sheet.

Pose0: balanced planted stance, elbows relaxed, empty hands low near the sternum as he spots a teammate.
Pose1: bend knees slightly and gather both empty hands to the chest, preparing to lift the ball overhead.
Pose2: raise both hands above the forehead beside the hat brim; keep the tall hat intact and fully readable.
Pose3: overhead pass release pose at simulation tick7; extend both arms up and slightly forward beside, not across, the witch hat, wrists open and fingers splayed, both hands empty.
Pose4: clear overhead follow-through with empty hands extended and shoulders leaning toward the receiver; hat remains fully visible.
Pose5: recover to a steady balanced stance as both arms lower naturally.

Ensure all six full-body drawings are distinct and sequential: gather, load, raise, one overhead release at pose3 /tick7, follow-through and recover. Keep both hands visibly empty in all six. Return exactly six poses in the requested transparent sheet.

## Generation history

- First generation `exec-c92b097a-58b9-41c7-a6a1-d627317bc61a`, raw `tools/generate-art/sources/j86-keeg-pass-overhead-generated-raw.png`, SHA-256 `787f277ec7a57b35f5a1ce95d454df4dd2c89702b8d1e4a1f265e2ea206cf795`. Rejected because pose4 in the bottom-center cell extended18px across that cell’s right boundary into the next cell.

## Cell-crossing correction exact prompt

This six-pose Keeg overhead-pass sheet has one layout defect: pose4, the bottom-center cell’s overhead follow-through, extends18 pixels beyond its right cell boundary. Shift only this entire pose4 drawing 40 pixels left, keeping its size, body anatomy and all parts intact within the center cell. Its current left clearance is72 pixels, so shifting left40 still leaves32 pixels; the right hand will then be20 pixels inside the right cell edge. Preserve the other five pose pixels and every Keeg identity detail. Keep his normal human anatomy, black hair, neatly trimmed black beard, extremely tall intact purple witch hat with silver trim and mushroom ornaments, layered purple/lavender/silver uniform, belts and jewelry. Preserve exactly the transparent RGBA1536×1024 3-column by2-row sheet and row-major six-pose order. Keep the hat whole and uncropped, and all hands empty. No ball, sphere, circle, seams, props, floor, shadow, effect, background, labels or added objects. Do not alter or duplicate any other pose. Return only the corrected transparent sheet.

- Cell-crossing correction `exec-a2ce2873-2876-414f-bc1f-76488b2a99e7`, raw `tools/generate-art/sources/j86-keeg-pass-overhead-correction-generated-raw.png`, SHA-256 `2f6c413a3ecf126d19790e04aef40b9d4ce459cb90945d9b78b4e30e70580218`. Accepted after review: pose4 moved left, all six bodies remain complete and inside their own cells, all empty hands remain ball-free, and Keeg’s black beard and intact hat/mushroom identity remain visible.
