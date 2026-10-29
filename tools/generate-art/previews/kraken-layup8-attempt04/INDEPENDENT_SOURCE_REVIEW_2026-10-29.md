# Kraken layup attempt04 source review

Verdict: **PASS for cleanup/layout trials only.** This is not final source or packing approval.

The eight row-major silhouettes read gather, takeoff, ascent, extension, release/peak, follow-through, descent, landing. Kraken's auburn hair, pointed ear, face, copper amulet and burgundy/gold kit are consistent. The hands are empty and no ball-like mark is visible. The same near/front shooting arm appears connected through poses2–5; the guide hand stays distinct and lower. Complete bodies, hands and shoes are present.

Compared with accepted `public/assets/animation/kraken-idle-right.webp`, the source has chunkier stepped clusters and flatter color groups than rejected attempt03; a nearest-neighbor 80×96 preview reads plausibly as pixel art. It still shows red/orange/cream edge fringe and some soft contours. Cleanup must remove fringe without nicking the outline. Frames4 and5 are similar but visibly differ in arm/body placement and need a close runtime distinctness review. Cropping and normalization can create cell gutters without clipping, but shoes currently leave only 2px at the bottom of the packed cell.

Do not calibrate a ball track until cleaned-sheet review passes. Preserve the raw, exact prompt, provenance, cleanup script/layout, and light/dark previews. Reject any cleanup that harms the outline/anatomy or leaves frames4/5 visually duplicated.

Raw: `tools/generate-art/sources/kraken-layup8-attempt04-generated-raw.png` (`exec-372eebb2-64cc-4a98-995a-024d4078e912`); prompt: `tools/generate-art/kraken-layup8-attempt04-imagegen-prompt.txt`.

Reviewer: independent Kraken layup asset audit agent. Review date: 2026-10-29.
