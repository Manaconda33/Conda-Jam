# Kraken `rebound` attempt01 current raw source triage

**Verdict: reject for cleanup/layout trial as an animation source. Preserve raw and provenance; do not pack or register.**

This review covers the current source at `tools/generate-art/sources/kraken-rebound5-attempt01-generated-raw.png`, not the earlier source described by the sibling `INDEPENDENT_SOURCE_REVIEW.md`.

## Exact source and prompt

- Athlete/clip: J.07 / J.129 Kraken, `rebound`, right-facing.
- Exact prompt: `tools/generate-art/kraken-rebound5-attempt01-imagegen-prompt.txt` (SHA-256 `853b7b759e132980d1ce8f9b4189ee5ea70ad77169e2a560524d7e2952586e1f`).
- Current generation ID: `exec-42873269-f086-4d8e-8a08-85d16a4cc185`, generated `2026-10-29T03:37:59Z`.
- Current raw: 1983×793 RGBA, SHA-256 `1b294d8391027af9d7edcc33ba67a35f08214c2109199db5c789a2272b4f7db5`; provenance currently records the same hash, dimensions and generation ID.
- The prior sibling source review describes another image (1536×1024, SHA `97fb6b…`, generation `exec-f5c0870b-b24a-4660-9e24-7ab13a1bb4e4`) with a different layout and background. It is stale for this current raw and should not be used as its acceptance review.

## Findings

- **Identity and costume: pass.** All five figures read as the same athletic male elf with auburn hair, pointed ear, copper amulet, natural skin and burgundy/copper Vesper Harbor uniform. No obvious appearance or palette discontinuity appears between poses.
- **Anatomy: gross pass, detail limited.** Hair, ear, hands and shoes remain in bounds; all five figures have complete head-to-shoe anatomy, two arms and two legs. Raised hands are present and the two hands meet at the overhead catch. Finger and hand separation at that pose is not sufficiently clear to approve at runtime size.
- **Pose count and sequence: pass.** The one-row sheet contains five distinct poses in the prompted order: balanced set, upward reach, overhead catch at apex, descending draw-in, and protective landing. The landing stance shares a crouched base with the initial set but the gathered chest-level hands make it distinguishable. The source/provenance grab anchor is frame 3, which is the descending pose; verify that gameplay timing intentionally catches on descent rather than at the frame 2 apex.
- **Ball separation: pass.** No basketball or other prop appears in the athlete art.
- **Transparency and fringe: reject for source quality.** The canvas has true zero-alpha background and the five bodies separate cleanly at alpha thresholds 32–128. However, raw alpha spans 0–255 with 418,971 partially transparent pixels; threshold 1 yields 1,011 connected components, including 1,006 small isolated components beyond the five main figures. The sprite contours also carry conspicuous red/orange semi-transparent fringe. The prompt explicitly forbids colored fringe and calls for alpha-zero background. The wide gutters are mostly transparent, but the outer edge pixels require cleanup that risks damaging outlines.
- **Style: reject.** The raw looks like a smoothly shaded illustration with gradients, blended highlights, antialiased contours and soft edge glow. It does not meet the prompt's hard-stepped low-resolution pixels, crisp one-pixel outline or restrained color-cluster requirement. Nearest-neighbor scaling and cutout could isolate the bodies, but would leave the painterly shading and would not make this a suitable pixel-art source without substantial redraw.

## Decision

Do not create a production-style cleanup atlas from this raw. Identity, gross anatomy and action order are promising, but the palette/shape edges and rendering style fail the exact prompt. Preserve the raw and this rejection note; source cleanup cannot correct the style defect safely. Any later attempt should retain these useful pose descriptions while requiring a genuinely low-resolution hard-edged sprite result. Keep the basketball separate and re-evaluate the grab anchor during gameplay validation.
