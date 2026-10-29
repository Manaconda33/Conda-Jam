# Kraken J.07 `pass-behind` attempt01 source review — 2026-10-28

**Verdict: APPROVE FOR CLEANUP ONLY. No runtime use, track calibration, registration, or production acceptance.**

## Provenance reviewed

- Prompt: `tools/generate-art/kraken-pass-behind6-attempt01-imagegen-prompt.txt` (verbatim flag true; SHA-256 `cd711c23fc44cc071872d4ddc54dd817e0b5f0a4a15955c8f6c97f5e259576a8`).
- ImageGen generation: `exec-fd0b1354-ad58-4283-b43b-bf6eb19f0234`.
- Raw: `tools/generate-art/sources/kraken-pass-behind6-attempt01-generated-raw.png` (1536×1024 RGBA; SHA-256 `330048b48d179ac85252eaba2f04417e0fd6c2e42c59bb91342ed6fce7ef2a04`). Raw source is unchanged.

## Review findings

- All six figures visibly retain Kraken’s copper skin, auburn hair, pointed ear, copper amulet, burgundy Vesper Harbor kit, trim, wrist details, and shoes. Full bodies and hands are visible, and the six poses are distinct. No basketball or other ball-shaped prop appears.
- Pose 2 (top-right) has the needed passing arm visibly wrapping behind the lower back to the opposite rear hip. The upper arm, elbow, forearm, wrist, and open fingers read as one naturally attached limb; the torso occlusion is consistent with the intended behind-the-back action. Do not erase or discard its rear hand as an alpha fragment.
- Pose 3 (bottom-left) is a legible release pose: the torso untwists toward the right-facing target and the arm emerging from behind the opposite hip opens/flicks outward toward the left. This is the correct fourth drawing and can use the documented tick-7 release anchor. Pose 2 remains the last pre-release hold. Pose 4 reads as follow-through and pose 5 as recovery. These source poses support the intended sequence; gameplay still needs to prove ball contact through tick 6 and release continuity at tick 7.
- The sheet has true transparency and no visible matte or glow when composited over light and dark. There is no broad background contamination. The alpha channel ranges 0–254; a handful of tiny residual alpha pixels touch the outer left and bottom image edges, so remove them only during documented cleanup. No essential silhouette is clipped at the canvas edge.
- Component inspection finds many detached alpha islands, and fixed 512×512 cell crops include cross-cell residue near a few boundaries. Therefore **largest-component-only cleanup or blind equal-grid slicing is unsafe**: a secondary component can be a finger/hand or can belong to the neighboring row. Cleanup is viable with per-figure silhouette/crop review, proximity-aware retention of attached hand/finger pieces, explicit exclusion of neighboring figure residue, and visual comparison against the untouched raw. Preserve the raw sheet and log every removed island. Review each cleaned pose over both light and dark backgrounds before any track trial.

## Scope

Source identity, anatomy, pose order, wrapped-arm continuity, release readability, and transparency are adequate to proceed to careful cleanup. This review does not approve a cleaned atlas, timing/ball alignment, mirroring, runtime registration, or final asset acceptance.
