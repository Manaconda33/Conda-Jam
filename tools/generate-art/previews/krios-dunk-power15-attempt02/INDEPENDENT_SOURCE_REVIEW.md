# Krios J.128 `dunk-power` attempt02 — independent source review

**Verdict: PASS for Jam Stage trials only. Do not register from this review.**

Generation `exec-e8fdac96-3a90-4a0b-b5cd-17369c3244de`; raw SHA-256 `02cf2217388ee25de37692fcbe6769f5a56fa213f538202660d8d24315534f02`; prompt SHA-256 `6ae633075abf3a2a405ff9825c846c82818dd14000b51958917ad1d572765874`.

## Source and cleanup findings

- The raw sheet contains fifteen full Krios figures in a 5×3 left-to-right order. Cleanup finds fifteen components and produces fifteen unique frame hashes in 128×96 cells, with a shared baseline and transparent outside pixels. The light/dark previews show no obvious remaining green fringe.
- Krios remains recognizable across all poses: red skin, black curled ram horns, charcoal beard, massive human build, charcoal uniform and ember piping. The sheet has no baked basketball. The revised plain chest avoids attempt01's non-canonical emblem; no face, limb or horn crop is visible.
- The cleanup uses one nearest-neighbor scale and preserves the generated pose pixels. Output poses are about 44–103 pixels wide and 69–86 pixels high. Several cells have modest vertical clearance (8 pixels at top, baseline y=94), which is acceptable for a trial but requires packed and runtime margin confirmation.
- The pixel treatment is crisp at the normalized size. Some generated interior shading is dense for 128×96, so assess silhouette/readability in the live court.

## Animation concerns for trials

- Frames 5–7 (grab, late ascent, peak) are very similar overhead shapes. At target size, frame5's bent arms distinguish it somewhat, while frames6 and7 read almost as a held overhead pose with a subtle torso/hand change. Verify that this pause reads intentional at production timing.
- Frames 9–11 (descent, pre-release, release) are also close. The release pose has open fingers, but the extension angle changes only slightly from the preceding reaches. At Jam Stage scale confirm that the single release remains legible and does not look like a repeated hold.
- The air sequence and landing are coherent, and the distinctive takeoff/approach/landing shapes separate well from the overhead cluster. The candidate keeps all anatomy connected.

## Required gate

Use normal Jam Stage rendering in both facings and at 100%/120% to review all frame starts, then inspect the six dunk anchors with Krios's separate track. Compare the complete uniform beside accepted Krios art. Track contact, release, live dunk scoring and landing remain unverified. Attempt02 is a better chest-mark match than attempt01, but source review alone does not establish runtime quality.
