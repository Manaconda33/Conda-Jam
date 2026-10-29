# Kraken J.07 `pass` track attempt07 independent review — 2026-10-28

**Verdict: PASS for the Kraken source/clip/ball-track candidate, with Marin's separately owned catch tracks required for a production gameplay integration.** Do not ship Kraken's candidate alone against Marin's current production tracks: attempt02 demonstrated the visible detached-ball defect that attempt07 corrects through a temporary Marin override. The Marin track change is a separate production modification and needs its own validation beyond this pass candidate review.

## Materials and scope

- Reviewed attempt07's `REVIEW.md`, full `report.json`, and representative current Jam Stage captures for Kraken ticks 0, 2, 4, 5, 11, 18, 22, and 26 at both facings and both 100%/120% zooms.
- Renderer: Chromium current Jam Stage production canvas; Vesper Harbor Undertow vs Scoria Rams.
- Candidate integration is explicitly temporary in-page response overrides (`runtimeIntegration: false`). The capture supplied the reviewed Kraken pass atlas/track and Marin's `receive`/`idle-ball` track vectors; it did not modify production files.
- Attempt07 uses the same reviewed Kraken source/cleanup and pass track as attempt02. The reviewed source and cleanup remain trial-only evidence; no new art changes were made here.

## Kraken pass review

- In all four facing/zoom runs, frames 0–2 select candidate atlas cells 0–2 and retain Kraken as ball owner through tick4. Visual contact remains coherent through ticks 0/2/4; no early release or detached carry is visible.
- At tick5, frame3 is selected and the ball releases cleanly, ownerless with Kraken as last touch and Marin as target. The release stays adjacent to the extended hands in both facings and zoom levels. The authored frame progression and tick5 anchor are correct.
- The ownerless flight continues through ticks 11/18, then Marin's catch event fires at tick21. At tick22 the report shows Marin owns the ball in receive tick5; at tick26 she still owns it in idle-ball tick1. Both screenshots show the ball overlapping the receiver's hands/upper-torso cluster, correcting attempt02's detached side placement.
- Receiver facing turns toward Kraken in each run. Kraken's right-facing selection is unmirrored; left-facing selection uses horizontal mirroring, with the candidate source and expected frame matching at each authored frame start.
- Report records 44/44 expected captures, no uncaught browser errors, no capture-level errors, and score `[0,0]` throughout. No unintended fallback was observed during the candidate pass; the later expected post-action Kraken idle selection is normal. Candidate frames are selected through tick8.

## Separate Marin production change

The successful catch visual in attempt07 depends on injected athlete-owned Marin tracks:

```json
{
  "receive": {
    "height": [1.3, 1.35, 1.2, 1.45],
    "forward": [4, 4, 2, 1]
  },
  "idle-ball": {
    "height": [1.45, 1.45, 1.45, 1.45],
    "forward": [1, 1, 1, 1]
  }
}
```

These yield `{x:0,z:0}` receiver attachment deltas at the sampled catch/held frames in all four runs. This review supports those values for this demonstrated Kraken-to-Marin pass, but it does not validate every other source of Marin possession (other passes, rebound, pickup) or all receive/idle-ball poses. Promote the Marin entries as a separate production change and test those cases before considering Marin's general ball track fully accepted. Do not alter Kraken's pass vector to compensate for a receiver-side offset.

## Evidence gap

There is no tick21 screenshot in the attempt07 capture directory. The report logs the catch event at tick21 and the first post-catch image at tick22, where ownership and visible attachment pass. The event timing is therefore confirmed by simulation data, while the visual proof is at the next captured tick.
