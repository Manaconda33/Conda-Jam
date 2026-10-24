# Nova Stitch — pickup

## Verbatim generation prompt

```text
Use the supplied Nova Stitch gameplay sprite only as an identity and visual-style reference. Create a new original 1536×1024 transparent RGBA sprite sheet for JAMVERSE '96 containing exactly five separate complete full-body Nova Stitch ball-pickup poses, in a three-column by two-row grid and row-major order. Leave the last cell (bottom row, third column) completely transparent. Put one pose centered in each of the other five cells, with clear margins. Same player, same right-facing source direction, camera, scale, palette and anatomy throughout. No scenery, court, floor, shadow, glow, borders, text, numbers, prop, other athlete or opponent.

Nova is a young athletic fair-tan woman with a long curly teal ponytail tied high, teal jersey and shorts with purple/black trim, black knee pads, teal-and-black shoes and matching wristbands. Keep her individual human face, build, hair, outfit, silhouette and colors consistent. Hands are empty; the basketball is a separate game object and never drawn into poses.

Action: Nova jogs up to a loose basketball on the court, reaches down with her right hand, touches it at floor level, and begins to rise. Exactly five distinct poses:
0 approach in a right-facing stride, hands relaxed;
1 decelerate and bend knees, eyes toward the floor;
2 deep crouch, reach right hand toward the ball's ground position;
3 GRAB at simulation tick7: fingertips meet the floor at the pickup point, palm open, left arm balances;
4 lift from the crouch, right hand closed near her waist after pickup.
Show no basketball or prop. Keep the exact floor contact in pose3 so the separate ball can meet the hand; pose4 starts recovery. All poses full-body with natural two-arm anatomy and complete ponytail and shoes.

Match the tiny 2D gameplay reference: crisp limited-palette 1990s arcade pixel art with chunky dark outlines, not painterly, photoreal, 3D, glossy or anime. True RGBA transparent background and empty cell, no alpha haze, matte or checkerboard. Return only the sprite sheet.
```
