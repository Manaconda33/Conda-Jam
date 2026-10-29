# Kraken dunk-windmill attempt05 cleanup01: independent review

**Verdict:** Pass as a candidate cleanup for gameplay trials. This review does not authorize production registration or acceptance of a ball track.

## Review scope and source integrity

Reviewed the component-aware cleanup script, its `cleanup-layout-report.json`, the 440×288 atlas, and the 3× light and dark previews. Compared the cleanup against raw source `tools/generate-art/sources/kraken-dunk-windmill-attempt05-generated-raw.png` and its provenance. The source SHA-256 in the report and provenance matches (`133b9f5a4f02144ee2c8211aa6fdacb122afb00be3930b9e093d20fcd87f3eff`). The cleanup script extracts complete alpha components globally instead of cutting fixed source cells, and records no pose repainting or invention.

## Findings

- **Frame count and separation:** 15 complete, visibly distinct figures are present in row-major sequence. Reported normalized frame hashes are all unique. The same figure is not duplicated as a substitute pose.
- **Action readability:** The sequence reads as run-in and gather, jump, arm wind-up, overhead windmill/strike, follow-through, descent, crouched landing/recovery, then upright recovery. The arm moves from the side/forward positions through the folded-behind-head and overhead arc into the strike; the transition remains legible after cleanup. The exact ball/hand contact and timing still require candidate gameplay review with a separate ball track.
- **Anatomy and identity:** Head, hair, torso, both arms, hands, legs, socks and shoes remain present across the sequence. No visible limb or hand was cut off by source-cell boundaries. Kraken's red hair, dark red/gold uniform, pendant, and overall build remain consistent. Poses are coherent, though the small face and hand detail is necessarily simplified at sprite scale.
- **Cells, baseline and margins:** 5×3 cells at 88×96; visible feet align to y=94 in all 15 cells (baseline delta 0). Side margins are at least 7 px and top margins at least 5 px. Each frame has 2 px below the baseline within its cell. The shortest visible pose height is 58 px; the tallest is 89 px. No frame is clipped or crosses a packed cell boundary.
- **Alpha, edges and palette:** Atlas alpha is binary (0/255); transparent pixels are retained and transparent RGB is cleared by the cleanup. Light and dark previews show clean outlines with no obvious brown background remnants or fringe. Cleanup consolidates visible art to a shared 16-color palette; edge pixels remain crisp after nearest-neighbor scaling. This reduces the raw illustration's shading detail but does not create an apparent edge defect or remove anatomy.
- **Detached detail:** The layout report records zero removed small components for every pose. I found no missing detached anatomy attributable to cleanup.

## Recommendation

Proceed to a candidate gameplay trial using this atlas and a separately calibrated athlete-specific ball track. Keep it unregistered pending review of contact, release/score timing, both facing directions, transitions, and gameplay captures. The artwork cleanup itself passes the requested visual and layout checks.
