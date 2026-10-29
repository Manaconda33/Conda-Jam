# Kraken J.07 `pass` attempt02 cleanup review — 2026-10-28

**Verdict: PASS for separate ball-track trials only. Not registered or production accepted.**

## Materials reviewed

- Source: `tools/generate-art/sources/kraken-pass6-attempt02-generated-raw.png` (1402×1122 RGBA; SHA-256 `1b8957e8f8266e0a42ee35fa76ab46563b5808d795c46977d2abd4466b599994`).
- Runtime candidate: `kraken-pass6-attempt02-runtime-candidate.png` (240×192; SHA-256 `36e2a4e3fd62d19d6a471a26b837203b440fd7f13ae3ca66d255b54bdac60810`).
- `layout.json`, `cleanup-layout-report.json`, all six normalized poses, and light/dark previews.

## Findings

- All six cells contain complete, legible Kraken figures: copper skin, short auburn hair, pointed ear, copper amulet, and burgundy/copper Vesper Harbor uniform remain consistent. Hands and limbs are intact. There is no basketball baked into the source or cleaned atlas; the final pose's round shape is the curled fist/knuckle silhouette, not a ball.
- Six normalized pose hashes and alpha hashes are unique. The sequence is visually legible as ready, gather, final pre-release gather, release, follow-through, and recovery. Pose 3 is fully extended at the documented release frame/tick 5. Pose 2 is closer to the torso than pose 1, but both read as distinct preparatory/gather positions rather than premature release; gameplay trials must confirm ball contact through tick 4 and continuity across tick 5.
- Transparency is preserved, with no visible matte box or cell-edge collision on either light or dark preview. The documented nearest-neighbor scaling and common baseline are consistent across the atlas. Margins are 4–15 px horizontally, 21 px at the top, and 2 px below the shoe baseline; no visible anatomy is clipped.
- Cleanup selected each figure's largest alpha component and omitted detached source fragments more than two source pixels from that silhouette (121 excluded components across the six source crops). No removed fragment appears to be needed to complete a hand, hair, limb, uniform, or shoe in the normalized frames. The raw source remains preserved. This automated fragment-removal choice is reviewable in `cleanup-layout-report.json` and should remain documented.
- Both previews show clean garment edges, outlines, and anti-aliasing at runtime scale. No meaningful difference or contamination is visible on the two backgrounds.

## Scope of approval

The cleaned six-frame atlas is suitable to proceed to independent Kraken-specific ball-track calibration and real normal-loader gameplay trials. This review does not approve track timing/placement, mirroring, runtime registration, or production acceptance. Reject the candidate if testing shows the ball detaches before the frame3/tick5 release or jumps at release. Keep the atlas unregistered until those checks and the usual dual-facing/current-court captures pass.
