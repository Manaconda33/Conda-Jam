# Krios dunk-clutch attempt 01 source review

**Review date:** 2026-10-28  
**Verdict:** **REJECT for the canonical `dunk-clutch` clip. Not registered.**  
**Permitted use:** Preserve as rejected source evidence only. Do not calibrate or accept an athlete-specific ball track against this source.

## Source and cleanup

- Raw ImageGen source: `tools/generate-art/sources/krios-dunk-clutch15-attempt01-generated-raw.png` (1619×971 RGB; SHA-256 `ca4e26ce0904eda2efa882fa1574ab1ae32294aee3482fa0872e31e5373e3d2c`).
- Generation ID: `exec-bbb0e2dd-be51-4cb7-a35f-a04357c7d305`.
- Exact prompt: `tools/generate-art/krios-dunk-clutch15-attempt01-imagegen-prompt.txt` (SHA-256 `617a9946aa70d16c0c940fe53333395b4d26bc5367b68eaa7f1e597c7d550838`).
- Cleanup script: `tools/generate-art/clean-krios-dunk-clutch15-attempt01.py`.
- Cleanup report: `cleanup-layout-report.json`; extracted 15 components, with 15 unique normalized pose hashes. The candidate is a 15×1 atlas of 128×96 RGBA cells, uniformly nearest-neighbor scaled, with common baseline y=94. Green background was removed and green spill was despilled; no pose redraw was done.
- Candidate: `krios-dunk-clutch15-attempt01-runtime-candidate.png`; inspect alongside the retained light and dark previews and all `pose-00`–`pose-14` isolated frames.

## Review findings

**Identity and anatomy:** The sheet consistently depicts the intended red-skinned, horned, bearded, heavily built Krios in the charcoal uniform. The isolated frames show two arms, two legs, hands, and shoes; there are no obvious merged bodies or cropped extremities after extraction. The athlete art contains no basketball, as required. Pixel style and red/charcoal contrast remain readable on both light and dark previews. Target-size frames have transparent backgrounds and share the specified baseline; the cleanup report records no cell overflow. These structural and identity checks do not cure the action-pose failures below.

**Pose separation:** All fifteen silhouettes hash distinctly and the approach, jump, aerial reach, and landing phases are broadly recognizable. Several adjacent gestures still collapse into generic crouched or one-arm-reaching silhouettes. Hash uniqueness alone is not evidence that the specified clutch action is present.

**Canonical sequence failures:** Compared with the `dunk-clutch` sequence and anchors in `tools/generate-art/pose-catalog.json`:

- Frame 5 does not clearly show the finishing hand securing the ball below the abdomen while the guide hand peels away.
- Frame 6 raises the arm diagonally instead of extending it low between the lifted knees in the protected underbody clutch. This misses the defining action.
- Frame 7's apex reads as an upward reach rather than the prescribed elbow pull across the far ribs with the free arm high. The required clutch-to-pull transition is absent.
- Frame 10 reads as an overhead/crossed arm shape and does not clearly communicate the specified diagonal reach followed by a downward release flick. The release anchor is therefore not visually dependable.
- Frames 12–14 become compact crouched poses; they only weakly convey the empty-arm swing, airborne landing approach, and the distinct impact absorption specified for frame 14.

Since the core underbody clutch and its release are not legible, this source cannot support a trustworthy action-specific ball track. No gameplay timing or ball-placement acceptance is claimed.

## Disposition

Keep the raw image, prompt, cleanup script, intermediate candidate, isolated frames, and previews intact for provenance and rejection history. Do not register this atlas, count it as accepted captain coverage, or calibrate ball coordinates from it. A replacement must make the low underbody carry, apex pull, diagonal release, and landing progression unmistakable at target size before another source review.
