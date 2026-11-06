# Kraken J.07 `pass` attempt15 — independent normal-loader review

**Verdict: PASS for production.** Kraken’s bespoke `pass` clip is accepted with its own separate-ball track and the Marin Dusk receiver-track adjustments used for this demonstrated handoff.

## Evidence reviewed

- Normal-loader capture report and 64 screenshots under this directory. The registered `kraken-pass-right.webp`, runtime track, Marin receive/idle-ball tracks and sprite selector were used without in-page atlas or track overrides.
- `tools/generate-art/previews/kraken-pass6-attempt02/INDEPENDENT_SOURCE_REVIEW_2026-10-28.md` and `INDEPENDENT_CLEANUP_REVIEW_2026-10-28.md`.
- `tools/generate-art/previews/marin-dusk-ball-track-review-05/report.json` and its 40 normal-loader screenshots.
- Rejected trajectory/contact captures in attempts 13 and 14.

## Findings

- The six distinct Kraken poses retain the captain’s elf identity, copper skin and amulet, auburn hair, burgundy/copper uniform, full anatomy and empty hands. No ball is baked into the atlas. Right-facing frames select the registered atlas; left-facing frames mirror it safely.
- Kraken retains possession through tick4 and releases the separate ball from frame3 at tick5. The accepted athlete-specific track is height `[1.25, 1.25, 1.3, 1.5, 1.35, 1.05]`, forward `[2, 4, 5, 6, 12, 8]`, and release velocity `0.2`.
- The corrected flight remains above the floor and approaches Marin through receive frames0–2. At tick21 the catch lands between Marin’s cupped hands. The ball remains attached through receive frame3/tick22 and idle-ball tick26, with reported attachment deltas `{x:0,z:0}` at ticks21, 22 and 26. Marin’s receive frame2/3 heights are `[1.7, 1.75]`; the idle-ball hand position remains stable at height1.45.
- The action selects Echo Catwalk receive and idle-ball derived atlases in the normal loader, mirrors the receiver correctly, scores remain 0–0, and no browser errors occur.
- All 64 expected captures pass across both facings and 100%/120% zoom at Vesper Harbor Undertow vs Scoria Rams, with the receiver recentered to avoid HUD overlap.

## Corrected defects and preserved rejects

- Attempts 08 and 09 are retained as failed capture harness runs; neither rejected source art.
- Attempt13 is rejected: the default low pass flight bounced, then snapped from Marin’s shin to her waist at the tick21 catch.
- Attempt14 is rejected: the revised airborne arc removed the bounce but still placed the catch below Marin’s hands.
- Attempt15 raises Marin’s receive frame2/3 hand track and passes independent visual review. The failed trials remain intact for comparison.

This review approves the demonstrated Kraken-to-Marin handoff. It does not claim every other Kraken pass recipient or every possible Marin rebound/pickup path was separately calibrated.
