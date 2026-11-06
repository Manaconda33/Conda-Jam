# Kraken pass-overhead attempt 01 — independent source review (2026-10-28)

**Decision: reject for cleanup and gameplay trials. Preserve the raw output and exact prompt as a rejected attempt.**

Source: `tools/generate-art/sources/kraken-pass-overhead6-attempt01-generated-raw.png`  
Prompt: `tools/generate-art/kraken-pass-overhead6-attempt01-imagegen-prompt.txt`  
Source SHA-256: `421f3d2bef5960c3f8db0a556e21fce2d8c47e3b56d3b773111bf48e88df3de9`  
Dimensions/mode: 1536×1024 RGBA.

## Findings

- **Identity:** All six figures read as the same auburn-haired, pointed-ear elf in the burgundy and gold uniform. The copper amulet is not consistently legible at this scale, but the face, hair and uniform are broadly coherent.
- **Pose/timing:** The sheet follows the intended progression: upper-abdomen gather, overhead lift, behind-crown windup, overhead release, follow-through and recovery. Pose 3 reads as the release, with pose 2 before and poses 4–5 after it. The six figures are separated and no limbs appear cropped. This is broadly consistent with the catalog's release at frame 3/tick 7.
- **Anatomy:** Full bodies and limbs are present in all six cells. Hands are less cleanly readable in the upper poses, but no clear extra limb or major anatomy failure is apparent.
- **Ball policy:** Pose 0 visibly contains a basketball between Kraken's hands. The runtime ball must be separate and no basketball may be baked into athlete art. This alone blocks cleanup/trials.
- **Background/transparency:** The PNG has transparency, but the visible dark brown/orange vignette and glow contaminate the sheet. Alpha is 0–254 with no fully opaque pixels; all 373,914 nonzero-alpha pixels are partial, consistent with a broad semi-transparent generated background. Cleanup would need to remove substantial spill without damaging the figure edges.
- **Style:** The source is highly rendered painterly/semi-realistic art rather than the established crisp arcade pixel-art sprite style. Nearest-neighbor scaling may reduce detail but cannot be assumed to resolve the stylistic mismatch.
- **Other artifact:** A bright detached-looking white spot is visible beside the face/raised arm in pose 4. It needs removal or clarification in a replacement source.

Because the ball is baked into pose 0 and the background/style contamination is substantial, do not clean or register this attempt. Request a corrected source with an empty hand gap at pose 0, genuinely clean transparent surroundings, and the established pixel-art finish; preserve this rejected source and its provenance.
