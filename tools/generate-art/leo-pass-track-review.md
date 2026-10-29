# J.105 Leo `pass` track calibration — 2026-10-27

Source artwork, exact prompt, generation ID, raw generated sheet, six extracted poses, layout and packed atlas remain recorded in `tools/generate-art/j105-leo-pass6-prompt.md`, `j105-leo-pass6-provenance.json`, `tools/generate-art/sources/j105-leo-pass-generated-raw.png`, `tools/generate-art/leo-pass6-layouts.json` and `public/assets/animation/leo-pass-right.webp`. Generation ID: `exec-89d2bf88-8242-466a-8c1a-429d0e79abef`; raw SHA-256 `4e63db8875624152a65d47fa80eb8fb0da4b85165a705d7f0c9492a1c8af74c4`; atlas SHA-256 `27e6ed011e08274d37819765638f33ede90f448c31a58ad42e925411a86c7e83`. Six 112×96 poses pass identity, anatomy, uniform, alpha, separation and action order review. The source contains no basketball. The authored release is frame3/tick5.

Each candidate is preserved under `tools/generate-art/previews/leo-pass-track-candidate/attempt-NN/`. Attempts 1–5 are rejected, not discarded. Attempts 1–2 exposed poor hand alignment; attempt2 also used a temporary mirror-pending manifest state, so its left-facing captures fell back to legacy art and are invalid as a mirror review. That registry-state defect was corrected before attempts3–6. The remaining attempts were calibrated with both directions through the production Jam Stage renderer.

| Attempt | Height by frame | Forward by frame | Result |
| --- | --- | --- | --- |
| 01 | `[1.2,1.3,1.45,1.55,1.45,1.05]` | `[3,4.5,9,13,12,7]` | Rejected: ball sits below the chest-ready and extending hands. |
| 02 | `[2,1.95,2.1,2.15,2,1.05]` | `[5.5,5.5,8,10.5,10,7]` | Rejected: gather floats above hands and release misses; left capture invalid due temporary mirror status. |
| 03 | `[1.65,1.8,1.9,2.65,2,1.05]` | `[5,5.5,8.5,8.5,8.5,7]` | Rejected: gather peaks too high relative to hands. |
| 04 | `[1.65,1.8,1.85,2.4,2,1.05]` | `[5,5.5,8,9.5,8.5,7]` | Rejected: raised gather and release alignment still miss the empty palms. |
| 05 | `[1.65,1.8,1.85,2.1,2,1.05]` | `[5,5.5,8,9.5,8.5,7]` | Rejected: gathers align better, but tick5 ball placement remains ahead of the open hands. |
| 06 | `[1.65,1.9,1.9,2.05,2,1.05]` | `[3.75,4.75,8.5,9.75,9,7]` | **Accepted.** Ball meets the palms at release tick5, then becomes ownerless and advances along the free-ball path. |

Attempt06 was independently reviewed in both directions at 100% and 120% on the current production Jam Stage. Captures sample ticks 0, 2, 4, 5, 6 and 8; the report records no browser errors. Through tick4 the ball is carried by Leo and remains at the cupped/open hands; at tick5 it releases once, the owner clears, and later frames show the free ball moving ahead. Both directions display the registered black/crimson source atlas, without legacy fallback, neighboring atlas bleed, clipping or visible discontinuity. The mirrored face, long hair and blank uniform have no fixed-side markings. Native images and exact candidate values are kept with the attempt report.

The accepted runtime track is recorded separately as `provenance.runtimeBallTrack`; the original source proposal remains unchanged in `provenance.ballTrack` for lineage. Runtime arrays: height `[1.65,1.9,1.9,2.05,2,1.05]`; forward `[3.75,4.75,8.5,9.75,9,7]`. Acceptance adds one bespoke six-drawing source clip; it does not count the separate ball as athlete artwork.
