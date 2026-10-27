# J.105 Leo `pass` track calibration — 2026-10-27

`tools/generate-art/j105-leo-pass6-prompt.md`, `j105-leo-pass6-provenance.json`, `sources/j105-leo-pass-generated-raw.png`, `leo-pass6-layouts.json`, and the packed candidate `public/assets/animation/leo-pass-right.webp` preserve the source artwork and lineage. Generation ID: `exec-89d2bf88-8242-466a-8c1a-429d0e79abef`. The six 112×96 poses pass source review for Leo's identity, anatomy, uniform, transparency, distinct pose order, and empty hands. The simulation release anchor is frame 3 at tick 5, matching the authored sequence.

The source sheet remains unregistered in the runtime manifest. It has no accepted Leo-specific ball track yet. Two native Jam Stage trials are retained under `tools/generate-art/previews/leo-pass-track-candidate/`:

| Attempt | Height by frame | Forward by frame | Result |
| --- | --- | --- | --- |
| 01 | `[1.2, 1.3, 1.45, 1.55, 1.45, 1.05]` | `[3, 4.5, 9, 13, 12, 7]` | Rejected: ball sits below Leo's chest-ready and extending hands. |
| 02 | `[2.0, 1.95, 2.1, 2.15, 2.0, 1.05]` | `[5.5, 5.5, 8, 10.5, 10, 7]` | Rejected: chest gather rises above the hands and tick-5 free-ball placement still misses the release hand. Left-facing images also fell back to a legacy atlas while temporary manifest mirror status was pending; those left captures are invalid. |

Attempt reports and screenshots record six action ticks in both facings at 100% and 120%. The production canvas rendered without browser errors. The wrong left-facing fallback was traced to the temporary registry status and not the athlete or source art. Re-run both facings after a candidate track is attached to the corrected approved mirror policy, then verify the ball between the hands through tick 4, the single release at tick 5, and the free-ball path. Do not register or count the pass until that review succeeds.
