# Kraken J.07 pickup attempt02 independent source review — 2026-10-28

**Verdict: PASS for cleanup/layout trials only. Not approved for runtime registration, gameplay trials, or production use.** The raw source must remain unchanged. Any cleanup must be independently reviewed before a separate-ball track trial.

## Provenance checked

- Exact edit prompt: `tools/generate-art/kraken-pickup5-attempt02-edit-prompt.txt` (SHA-256 `1a52595671c43c0cb8a614292998dfd345b329d954cd4f38a5f4b6f12bf73323`), which explicitly removes balls and red fringe, preserves the five poses, and asks for crisp pixel-art style.
- Raw image: `tools/generate-art/sources/kraken-pickup5-attempt02-generated-raw.png` (SHA-256 `20657a266be1a0214ad9c2cdec93df5fd342c157e6744668f469ea49bca53ffe`), 2172×724 RGBA, alpha range 0–255.
- Generation ID: `exec-29e04400-b16e-47a7-97e1-e76d6cd56f97`.
- Required durations `[2,3,2,1,4]`; grab frame index 3 at tick 7.

## Findings

- **Ball-free hands:** I inspected the complete sheet and enlarged poses 3 and 4. No orange basketball or other orange ball-shaped object remains. In pose 3, the low grab hand is empty; the dark opening around the fingertips is negative space, not a ball. In pose 4, the waist-level hands mime securing an invisible ball and have no orange fill or ball contour. This corrects attempt01's explicit baked-ball failure.
- **Timing and pose order:** Five visibly distinct poses appear left-to-right in the required order: approach, lower/reach, deep fold, grab at frame 3/tick 7, then recovery. Pose3 is the low ankle-height grab; pose4 occurs after it with a crouched recovery. No timing/order conflict is visible.
- **Identity and anatomy:** Kraken's auburn hair, pointed ear, copper amulet, burgundy Vesper Harbor uniform with copper/gold trim, wrist details and shoes remain recognizable and consistent. All five figures appear complete with two arms/hands and two legs/shoes, without cropped limbs. The reaching and crouched silhouettes differ clearly.
- **Transparency and fringe:** The background is transparent with no broad vignette. At alpha threshold 32, the sheet separates into exactly five major connected silhouettes. However, the red edge fringe remains visibly around the outlines, despite the edit prompt. It needs a cleanup trial that proves the rim can be reduced without cutting hair, ears, skin, hands, shoes, uniform trim, or the black outline. At the intended small runtime size, the source is heavily shaded illustrative art; nearest-neighbor downscaling may yield acceptable clustered pixel art, but this must be visually checked on both light and dark backgrounds.

## Disposition

The absent ball and separable silhouettes make attempt02 suitable for a conservative cleanup/layout trial. Keep the raw and provenance untouched. Do not accept, pack or register until cleanup removes the red edge fringe without damaging anatomy and light/dark previews show a clean small-scale sprite. Gameplay pickup/grab and carried-ball alignment remain unreviewed.
