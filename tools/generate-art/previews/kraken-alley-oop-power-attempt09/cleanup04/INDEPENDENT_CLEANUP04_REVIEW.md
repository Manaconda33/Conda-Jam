# Kraken alley-oop-power attempt09 cleanup04 — independent review

**Verdict: pass for candidate gameplay review only; do not register yet.** The cleanup now has clean cell silhouettes and baseline alignment, and the 16-color/nearest-neighbor result is close enough to judge in-game. It remains less refined than the production sprite and needs native-scale visual confirmation.

- **Alpha/fragments:** binary alpha and transparent light/dark gutters. Each of the 15 cells has exactly one connected figure. The detached hand fragment below frame 3 is gone; the extended arm, both legs and shoes remain intact. No visible residue remains.
- **Fit/baseline:** 15 unique 80×96 frames; baselineY92 and a uniform 4 px bottom margin. Reported left/right margins are 8–44 px and top margins 8–22 px. Main silhouettes fit without clipping.
- **Pose sequence and anatomy:** the sheet reads as preparation/approach, gather/plant, takeoff, one-hand aerial catch, two-hand control, downward extension/follow-through, descent, low landing and upright recovery. The open catch and overhead two-hand control remain distinct. Heads, hands, limbs and shoes are intact, and no ball is baked in.
- **Style:** the 16-color palette makes the sprite-scale edges and shapes read as pixel art, and improves on cleanup03. Remaining skin/cloth highlights are still coarse, irregular clusters from the illustrated source, so it is not as polished as Kraken's production art. Suitable to check in native gameplay, pending that visual review; do not register from this sheet alone.
- **Report detail:** `cleanup-layout-report.json` says detached components under 12 pixels are removed, although cleanup04 no longer contains the previously reviewed 37-pixel frame3 component. It also does not clearly state the new `<64 px` rule. Correct the cleanup-method metadata so it matches the actual derivative.

Candidate-only review; no production files changed.

## Superseding documentation correction — 2026-10-29

The report-metadata concern above is superseded. The current `cleanup-layout-report.json` and `tools/generate-art/clean-kraken-alley-oop-power-attempt09-cleanup04.py` both specify removal of isolated 8-connected components smaller than 64 output pixels. The earlier `<12` statement describes stale metadata or an earlier revision; it does not describe the current cleanup04 derivative. The cleanup-method documentation now matches the cleanup script. The original note is retained above as review history.
