# J.107 Keeg alley-oop reverse — pose 03 background edit prompts

Attempt02 prompt (input generation `exec-c11c7782-cc44-4423-b33d-d3818089de6f`):

> Make a production transparent sprite image from this exact Keeg pose. Preserve Keeg's shape, facial identity, full hat, clothing, hands, limbs and pose with no new elements. Remove only the gray-and-white checkerboard pattern and set all background pixels to alpha zero. Do not add another background; keep all existing character pixels including white uniform details. Return one transparent PNG.

Attempt03 prompt (same input):

> Clean this image to a transparent production sprite. Keeg remains exactly the same airborne pose and exact character. Keep only his connected complete silhouette. Remove the checkerboard background and all isolated detached pixels or specks; the final canvas around him must have alpha zero. Preserve all connected character pixels, hands, hat, uniform, legs and shoes, including natural silver and white details. Do not add any ball/object, glow, particles, background or extra pixels. Keep the same full-body pose, right-facing orientation and no cropping. Output only one transparent PNG.

Neither result is accepted because a detached red/green cluster is visible beside the hand. No cleanup or atlas packing was applied.
