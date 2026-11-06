# Kraken J.07 `pass` track attempt02 independent review — 2026-10-28

**Verdict: REJECT for production registration at this checkpoint.** The source, cleaned atlas, release, and flight pass review, but the captured catch is visibly detached from Marin Dusk's hands. Keep this as a successful candidate trial and correct the recipient catch placement/animation integration before registering the pass asset.

## Evidence reviewed

- Candidate report: `report.json`; 44 captures from the Chromium current Jam Stage production canvas, with in-page candidate-only atlas/track overrides (`runtimeIntegration: false`). Court: Vesper Harbor Undertow vs Scoria Rams. Candidate atlas hash: `36e2a4e3fd62d19d6a471a26b837203b440fd7f13ae3ca66d255b54bdac60810`.
- Capture summary `REVIEW.md`, all tick 0/2/4/5 representative screenshots at 100% and 120% for both facings, and flight/catch screenshots at ticks 11/14/18/22/26.
- Source review and cleanup review at `tools/generate-art/previews/kraken-pass6-attempt02/`.

## Findings that pass

- The raw/source review and separate cleanup review are adequate for track use. The atlas is the reviewed 240×192 six-frame candidate with six distinct frames and genuine transparency; raw art/provenance remain preserved. No source or cleanup defect blocks this track trial.
- Ticks 0, 2, and 4 show a separate ball carried by Kraken in/against the gathering hands in both directions at both zooms. It remains owner `kraken` through tick4; no score or ball-ownership transition occurs early.
- At tick5, frame3 is selected and the ball cleanly releases: mode `pass`, owner `null`, last touch `kraken`, target `marin-dusk`. The release is adjacent to the extended hands in all four facing/zoom runs. The track is `[height 1.25, 1.25, 1.3, 1.5, 1.35, 1.05]`, `[forward 2, 4, 5, 6, 12, 8]`.
- Flight remains ownerless at ticks 11/14/18. The target receives possession by tick22 in all four runs; score stays `[0,0]` in all 44 captures. Both facings select candidate frames 0–5 at the authored starts, with horizontal mirror enabled only for left-facing. No capture errors or unintended sprite fallbacks were recorded. The post-pass transition to Kraken idle is expected.

## Blocking catch defect

At tick22 the simulation says Marin has the ball, but the actual Jam Stage screenshot places it beside the outside of his arm rather than in either receiving hand. In the report the right-facing catch has Marin at `x=126` and the ball at `x=118.045...`; the left-facing catch mirrors this (`x=74`, ball `x=81.954...`). At tick26, the carried ball remains in the same visibly detached side position. The normal-loader capture at `frame-22-right-zoom120.png` makes the gap clear: Marin's fists are gathered at the chest while the ball sits to their left. This is a visual ownership/attachment defect even though the simulation transfers ownership and the event message fires.

The test captures validate the pass flight and logical catch, but not a visually correct catch. Correct the receiving ball anchor/track or receiving pose integration, then repeat both directions at 100% and 120% through tick26. Do not register this pass as production-ready until the owned ball visibly meets Marin's catching hand after tick22. This verdict does not reject Kraken's source art, cleanup, or the attempt02 release/flight track itself.
