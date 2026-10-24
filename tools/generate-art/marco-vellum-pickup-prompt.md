# Marco Vellum — `pickup`

## Exact generation prompt queued for the next image-generation window

```text
Create one original transparent RGBA PNG spritesheet exactly 1536 × 1024 pixels in a strict 3-column × 2-row grid, read left-to-right top row then left-to-right bottom row. Draw exactly five separate, complete full-body poses of Marco Vellum, one pose centered in each of the first five 512 × 512 cells. Leave the bottom-right sixth cell completely transparent and empty. Keep heads, hands, limbs and shoes fully inside every used cell, with at least 35 pixels clear margin. Use crisp outlined 1990s arcade pixel art matching Marco's portrait and gameplay sprite references.

Marco is the same compact athletic adult human MAN in all five poses: medium-light olive skin, angular clean-shaven face, thick short black hair with a slight natural wave, no beard and no mustache. He wears a black Blackthorn Court Kings jersey and shorts with crimson piping and white trim, black wristbands and black high-top shoes. Preserve his face, hairstyle, compact human proportions and exact kit consistently.

Right-facing basketball `pickup`, five distinct sequential poses in strict row-major order: 0 notices a loose ball near the floor, lowers his stance and reaches one empty hand down; 1 bends farther at the waist and steps forward, reaching toward the court with the near hand; 2 drops into a deep balanced crouch and places his open fingertips at court level to collect an imaginary ball; 3 closes the empty hand around the invisible ball at the pickup point and stabilizes with the other arm extended for balance; 4 begins rising into a secure low carry, drawing the imaginary ball toward his waist. Every pose must visibly change the reach, body crouch, arm position or recovery. No visible ball anywhere: Marco's separately animated game ball is placed by runtime.

Exactly five figures, exactly five used cells and one blank cell. True alpha-zero background and gutters. No shadow, haze, checkerboard, floor, court, hoop, words, logos, props, opponents, extra figures or basketball. Return only the sheet.
```

The provider returned HTTP 429 `usage_limit_reached` on both the prior attempt and one retry on 2026-10-24. The latest response reports a reset in 32,756 seconds. Tool discovery found no alternate image-generation route in this session. No `pickup` generation or accepted source exists yet; stop image-generation attempts until the provider quota resets.
