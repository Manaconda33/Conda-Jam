# Independent cleanup/layout review — J.128 Krios `push`, attempt01

**Disposition: reject this candidate for gameplay trials in its current state. Do not register it.**

The corrected cleanup order now follows the source’s 4×3 row-major sequence: frames 0–3 from the top row, 4–7 from the middle row, and 8–10 from the bottom row. This fixes the prior centroid-bucket interleaving. All 11 native frames have distinct hashes; frames 8–10 also remain visibly different at native size: frame8 recoils with both hands raised, frame9 settles into a broad stance with lowered hands, and frame10 returns to the ready pose with a changed hand position and stance.

The critical failure is the frame5/tick8 contact pose. The isolated crop, raw source crop and native preview each show only one forward-reaching arm and one visible open hand. The second arm/hand is not separately visible as the prompt requires. The source was preserved rather than redrawn, so this cannot be repaired by cleanup without inventing anatomy. The prior raw-source review’s claim that this pose had two-arm full extension is not supported by the image; the frame needs a corrected source generation before gameplay review.

Other inspected properties pass for this cleanup proof. The surrounding frames retain consistent Krios identity and connected anatomy, and the sheet contains no basketball or other prop. Component extraction contains the source cell crossings; the corrected 11×128×96 candidate uses one 0.29927 nearest-neighbor scale, y=94 shared baseline, and its reported 8px/7px minimum side/top margin target. Frame5 uses the expected source bounds `[366,419,717,669]`, confirming that the one-hand defect is in the selected source pose rather than a crop omission. Frames 8–10 have distinct source and native hashes.

The raw PNG remains unchanged. Cleanup keys the documented green-dominant matte, attaches nearby small components, and modifies 32 strong green-dominant source pixels locally by adjusting only their green channel; alpha stays opaque for those silhouette pixels. The report records these changes. After packing, no strong green-key pixels remain; light/dark previews show no visible green fringe, and transparency is present outside each silhouette. No pose pixels were redrawn or synthesized.

Correct the two-hand contact frame in a new source attempt, retain this candidate and its review as rejected evidence, then repeat source and cleanup review before gameplay calibration.
