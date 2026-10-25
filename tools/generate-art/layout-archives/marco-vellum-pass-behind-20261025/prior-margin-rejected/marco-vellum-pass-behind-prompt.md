# Marco Vellum — `pass-behind`

## Exact generation prompt

```text
Create one original transparent RGBA PNG spritesheet, exactly 1536 × 1024 pixels, divided into a strict row-major grid of 3 columns × 2 rows. It must contain exactly six separate complete full-body drawings, one centered in each 512 × 512 cell, with clear transparent gutters and at least 35 pixels of cell margin. These are sequential animation poses for Marco Vellum, matching the supplied Marco portrait and gameplay sprite references. Maintain crisp outlined 1990s arcade pixel art, clean limited colors, and the gameplay sprite's compact scale.

Identity is fixed in every cell: Marco is the same compact athletic adult human MAN, medium-light olive skin, angular strong clean-shaven face, thick short slightly waved black hair, no beard, no mustache. He wears a black Blackthorn Court Kings jersey and shorts with crimson piping and white trim, black wristbands, and black high-top shoes. Preserve exactly two natural arms and hands, two legs and shoes, and consistent face, hair, skin, uniform and body proportions in all six drawings.

Right-facing `pass-behind` move, read left-to-right then top-to-bottom: 0 balanced ready stance, empty hands; 1 turns shoulders slightly and gathers an imaginary basketball at his near hip, hands remain empty; 2 rotates his torso and draws the imaginary ball behind his lower back, with one elbow bent; 3 reaches his passing hand around behind his back toward image-left while the other hand opens for balance; 4 completes one clear behind-the-back pass motion with the passing arm extended back toward image-left, fingers open, body still facing mainly image-right; 5 relaxes the arm and returns to a balanced ready stance. Keep this a readable basketball pass with clearly different poses and full anatomy. No actual basketball in any pose, including the invisible gather and release: the game ball is separately rendered by Marco's own runtime path.

Transparent alpha-zero background and gutters. No shadows, haze, checkerboard, floor, court, hoop, text, logos, extra characters, props or basketball. Do not crop any head, hand, limb or shoe. Return only the sprite sheet.
```
