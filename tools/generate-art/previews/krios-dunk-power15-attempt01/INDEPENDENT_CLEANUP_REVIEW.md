# Krios J.128 dunk-power attempt01 — independent cleanup review

**Verdict: PASS for gameplay trials only. Do not register from this review alone.**

## Checks passed

- The cleanup report contains exactly 15 components, ordered in three source rows from left to right, and 15 unique frame hashes. The resulting atlas is 1920×96 with fifteen 128×96 cells.
- All cells retain complete silhouettes and share the same nearest-neighbor scale (`0.2679`) and baseline y=94. Alpha is binary (0/255); per-cell bounds stay inside the 128×96 cells with clear margins. The widest pose has 20 horizontal pixels of left clearance and 20 right. The tallest pose keeps 8 pixels above the sprite.
- An independent spill scan (`G > R+20`, `G > B+15`, `G > 60`) finds zero opaque green-dominant pixels. The source red skin is not green-dominant; cleanup reports only edge despill within each extracted component. Light and dark previews show no visible chroma fringe.
- Pose order reads approach, load, takeoff, ascent, gather, grab, late ascent, peak, descent start, pre-release, release, finish, drop-away, landing approach, and land. The release pose at index10 opens both hands after the two-hand overhead gather; no basketball is baked into the atlas.
- Krios remains recognizable through red skin, curled black horns, charcoal beard, muscular human anatomy, and charcoal/ember kit. The conspicuous chest mark is retained from the raw generation and should be compared with the accepted Krios artwork at gameplay scale before final production acceptance.

## Candidate gameplay follow-up required

Frames5–7 use similar overhead silhouettes for grab, late ascent, and peak, and frames9–11 cluster around the forward-down release/follow-through. They remain distinct in the extracted sheet, but verify the timing and visual separation in Jam Stage. The accepted Krios references use more yellow trim than this attempt's red piping; confirm the team palette and chest mark remain coherent when shown beside the accepted Krios sprites. Review the separate Krios ball track at takeoff, grab (frame5/tick10), peak (frame7/tick14), release (frame10/tick21), finish (frame11/tick23), and landing (frame14/tick30) before registration.

Raw source, exact prompt, generation ID, cleanup script/report, isolated poses, and both previews are retained. This is a cleanup/layout pass only; source art has not been changed or promoted.
