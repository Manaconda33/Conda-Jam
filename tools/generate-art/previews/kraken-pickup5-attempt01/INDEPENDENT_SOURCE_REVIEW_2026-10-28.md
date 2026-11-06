# Kraken J.07 pickup attempt01 independent source review — 2026-10-28

**Verdict: REJECT for cleanup, gameplay trials, and registration.** Preserve the raw generated sheet and this review as rejected work. Do not remove the prop and treat this source as approved; the grab pose itself needs regeneration or a carefully reviewed edit before cleanup.

## Provenance checked

- Prompt: `tools/generate-art/kraken-pickup5-attempt01-imagegen-prompt.txt` (SHA-256 `4bb24bc9ebb6221281705e271977b0cd9cf6566a2a40abba0d3ff09fe8f63dc1`). It explicitly bans a visible ball and defines five poses with durations `[2, 3, 2, 1, 4]` and grab anchor pose `3` at tick `7`.
- Raw: `tools/generate-art/sources/kraken-pickup5-attempt01-generated-raw.png` (SHA-256 `5f22ac0799e1a859d45fc935672d7edfbe3527f525010fd6dffa6a766b958ed3`, dimensions `2172×724`, RGBA alpha range `(0, 255)`).
- Generation ID: `exec-1ecf089e-9c32-433e-9eda-e4f14bb66b12`.

## Findings

- **Fatal ball-policy failure:** pose index 3 (fourth/anchor frame, canonical grab tick 7) contains a clearly visible round orange object directly under the closing hand at ankle height. Its circular contour, orange fill, dark rim/highlight and placement in the grasp make it read unambiguously as the basketball. This is a baked-in prop even though the prompt forbids one. It will conflict with the separate runtime ball track. Pose 4's cupped hands are empty; the fatal object is at the pose-3 grab frame.
- **Timing and pose sequence:** all five expected action stages are represented in row-major order: approach/spot, lower/reach, deep fold/fingertip approach, grab at frame 3, then recovery securing the invisible ball. The pose order and authored anchor position match the prompt. The prop at the anchor means the actual art does not satisfy the runtime ball policy.
- **Identity and anatomy:** Kraken is recognizable across the sheet: auburn hair, pointed elf ear, copper medallion, burgundy/copper kit, wrist details and matching shoes. All five figures appear full-body with two arms/hands and two legs/shoes; no obvious cropping or missing major body parts. Poses are visibly distinct.
- **Alpha and cleanup viability:** the RGBA source has a transparent background (alpha range 0–255) and separated figures, so geometric layout would be possible. However, a conspicuous red fringe/glow is visible around silhouette edges and should not be accepted as clean anti-aliasing without a separately reviewed mask treatment. The sheet is heavily shaded illustrative art rather than the requested crisp, clean-cluster arcade pixel-art style. Since the required grab pose contains a ball, cleanup is not authorized by this review; preserve this raw and correct the source first.

## Disposition

Attempt01 is rejected. Keep its exact prompt, generation metadata, raw image and this report. No layout, runtime atlas, track trial, or registration was produced by this review.
