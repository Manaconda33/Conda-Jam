# Krios dunk-clutch attempt 06 source review

**Review date:** 2026-10-28  
**Verdict:** **REJECT for ball-track trials and runtime registration.**

## Provenance and cleanup

- Generation ID: `exec-0149927d-672b-47ce-a485-3a489666accb`; timestamp `2026-10-28T09:24:00Z`.
- Exact prompt: `tools/generate-art/krios-dunk-clutch15-attempt06-imagegen-prompt.txt`, SHA-256 `30ecc7017a7a5df15c5281942d010cc7ff182b7bb59d42093bcdaa71345d2248`.
- Raw source: `tools/generate-art/sources/krios-dunk-clutch15-attempt06-generated-raw.png`, 1536×1024 RGB, SHA-256 `648403b7d83cd306c003dcb52904dda3aea0a9cb08782d6fb3366b097fc91f9f`.
- The generated sheet includes black numeric labels and grid dividers. They can be excluded without cutting pose pixels: the cleanup uses measured cell boundaries and small separator margins, then retains each cell's largest 8-connected figure component. Labels, divider fragments, and a small isolated baseline stroke are recorded as discarded components. The 15 retained figure bounds remain inside each crop; notably frames 8 and 9 retain their extended hands with 14–20 source-pixel side margins. No pose pixels were redrawn.
- The resulting atlas is transparent RGBA, 15×1 cells of 128×96, uniformly nearest-neighbor scaled, at common baseline y=94. It has 15 distinct normalized frame hashes. Isolated frames, target-size contact sheet, light/dark previews, and enlarged raw cells 4–7 are retained here.

## Review findings

**Objects and identity:** I inspected the full raw sheet and enlarged frames 4–7. No basketball, orb, or other object is visible in the athlete poses. Krios's dark red-brown skin, tied-back black curls with green band, full beard, human muscular build, black uniform with red/gold piping, and dark shoes remain consistent. The cleanup removes numeric labels, grid dividers, and the separate baseline stroke without altering the character. Hands, feet, and limbs are present and generally anatomically coherent. The rendered shading is glossy and painterly compared with the pixel-art runtime references, but remains readable at the target atlas scale.

**Canonical anchors:**

- Frame 2 is the first airborne pose, with both feet clear of the floor: takeoff aligns.
- Frame 5 shows separate hands at the chest: grab aligns.
- Frame 7 has the torso twisted and an arm bent toward the ribs, but only one hand is visible; the other is concealed around the far side. It does not satisfy the prompt's requirement for both empty hands to be separately drawn across the ribs.
- Frame 10 is a clear diagonal one-hand extension: release aligns.
- Frame 11 is a distinct high airborne follow-through: finish aligns.
- Frame 13 remains above the floor with shadow/space under both shoes; frame 14 shows first baseline contact and knee absorption: land aligns.

**Gesture separation failure:** Frame 6 is supposed to show empty hands separated between the knees. At source and target size the hands overlap at the centerline, with fingers crossing/touching. This misses an explicit anatomy/pose requirement and makes the protected clutch hand state unclear. Frame 7 also hides one hand rather than presenting both hands separately at the ribs. These are the core clutch and apex gestures, so the sheet is not dependable for ball-track trials despite having no baked-in ball and otherwise good timing.

**Layout and alpha:** Gridlines and labels are excluded cleanly in the final light/dark previews. No visible green fringe or cell-border remnants remain. The character proportions and baseline alignment are consistent. The raw source's loose floor stroke under the landing pose was a detached component and is not in the cleaned output.

## Disposition

Preserve this cleaned candidate as review evidence only. Do not register it or calibrate a ball track. A replacement must keep the frame 6 hands visibly apart between the knees and show both frame 7 hands separately across the ribs.
