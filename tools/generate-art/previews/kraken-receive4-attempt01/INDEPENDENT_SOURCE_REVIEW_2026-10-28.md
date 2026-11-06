# Kraken receive attempt 01 — independent source review (2026-10-28)

**Decision: approve for cleanup/layout trials only. Source, atlas, ball track and runtime remain unaccepted.**

Source: `tools/generate-art/sources/kraken-receive4-attempt01-generated-raw.png`  
Exact prompt: `tools/generate-art/kraken-receive4-attempt01-imagegen-prompt.txt`  
Generation ID: `exec-73626bfe-e2fb-4dc5-8768-f297ab8edbdf`  
Source SHA-256: `d76b0b4ef3cee3427f0e8fdaf919982a95291e6967b3d6a9a351a2554a827d11`  
Prompt SHA-256: `926923ad27341a3a9d01716e3864c44165a43143abec0205b6049de2c5f4b2b1`  
Dimensions/mode: 1312×1199 RGBA.

## Findings

- **Identity/anatomy:** All four poses show the same auburn-haired elf with pointed ear, copper amulet, burgundy-and-gold Vesper Harbor uniform, wrist details, shorts and shoes. Full bodies and limbs are present. No clear extra limbs or missing anatomy.
- **Pose/timing:** The order is readable and follows the prompt: ready/open anticipation; two-handed forward reach; catch pose with hands closed at the sternum; post-catch cradle at abdomen. The grab occurs on frame 2 (index 2) at tick 4, with frame 3 following the grab. The two pre-catch poses have open hands; frame 2 closes around the separate, invisible ball. No ball is baked into the artwork.
- **Transparency/separation:** The canvas background is transparent, with clear margins and four separated complete figures. Alpha range is 0–255. An 8-connected scan yields exactly four main components at thresholds 24–96, so thresholded component isolation can separate all four cells. At lower thresholds there are detached specks; document discarded fragments and preserve the untouched raw. Visible red edge fringe surrounds much of the silhouette. Thresholding alpha alone may retain some of this colored rim; inspect/despill it in cleanup trials on light and dark backgrounds, preserving the dark outline and natural antialias pixels.
- **Runtime scale/style:** The source has painterly gradients and smooth edges rather than the established crisp pixel-art finish. Its full-body poses are complete and similarly proportioned; nearest-neighbor reduction to the existing 80×96 cells is worth a trial and should retain the major anatomy/identity cues. It is not accepted as-is. Inspect each downscaled pose at 1× and 2× against Kraken's current idle sprite, focusing on pointed ear, hands/fingers, amulet, costume trim, shoes and red fringe. If nearest-neighbor reduction leaves a visibly different smooth-rendered style or harms edge/hand clarity, reject and regenerate in the current runtime style.

## Trial gate

Proceed with cleanup/layout trials only. Do not pack or register until cleanup removes the red edge contamination without shaving the silhouette, all four poses have suitable margins and baseline, both background previews pass, and an independent small-scale visual review accepts the result. Calibrate the separate Kraken ball path only after that source/layout gate and review the catch/contact through tick 4 in gameplay.
