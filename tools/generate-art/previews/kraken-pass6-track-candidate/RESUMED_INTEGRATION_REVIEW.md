# Kraken pass attempt07 integration review — 2026-10-28

## Finding

Attempt07 is a strong candidate for the Kraken `pass` track and demonstrates that Kraken and Marin require independently calibrated ball tracks. It is not yet a production-complete integration because the successful Marin positions exist only as a temporary capture override and were sampled at two post-catch points.

## Evidence reviewed

- `attempt-07/native/INDEPENDENT_REVIEW_2026-10-28.md`, `REVIEW.md`, and `report.json`.
- `tools/capture-kraken-pass6-track-candidate.py`.
- `src/core/animation.js`, where Marin Dusk currently has an athlete-specific `idle-ball` vector (`height` `[1.05,.75,.65,.9]`, `forward` `[8,9,9,8]`) but no athlete-specific `receive` vector. The active Kraken registry entry currently contains only the reviewed `steal` vector.

The temporary attempt07 receiver vectors are:

```json
{
  "receive": {"height": [1.3, 1.35, 1.2, 1.45], "forward": [4, 4, 2, 1]},
  "idle-ball": {"height": [1.45, 1.45, 1.45, 1.45], "forward": [1, 1, 1, 1]}
}
```

The 44-capture current Jam Stage run demonstrates the normal simulated Kraken pass, tick5 release, tick21 Marin catch, then Marin ownership at ticks22 (`receive`) and26 (`idle-ball`). Both sampled attachment deltas are `{x:0,z:0}` in both facings and both zooms; score stays 0–0 and no browser errors are recorded. There is no tick21 image, and the `receive` pose sequence and subsequent held poses are not reviewed exhaustively with these vectors.

## Recommended integration path

1. Add Kraken `pass` as its own athlete-owned entry in `athleteBallTracks.kraken`, retaining the reviewed pass vector. Do not adjust it to hide a Marin-side placement problem.
2. Add Marin's demonstrated `receive` and `idle-ball` vectors under `athleteBallTracks['marin-dusk']`. These are recipient-specific calibrated tracks; do not replace or scale them through Kraken.
3. Capture the actual production registry, without response overrides, through the full pass timeline for both directions and zooms. Include ticks20–22 to show the catch event and the exact first caught pose, and sample every authored `receive` and `idle-ball` frame start. Confirm candidate atlas selection, ownership transfer, continuous hand contact, mirroring, no missing-sprite fallback, and score/clock invariance.
4. Before accepting Marin's general tracks, exercise other ways she can enter `receive` or hold `idle-ball` (especially teammate pass and rebound/loose-ball pickup paths), and review the full receive-to-idle-ball transition. Retain any failed captures and recalibrate only Marin's vector if another source enters the hands differently.
5. Run the relevant animation/ball-track tests, production asset validator, and full gameplay/build checks after manifest/runtime registration. Keep this candidate's exact raw source, provenance, atlas, and rejected track attempts intact.

## Decision

**Candidate pass art/track: retain for integration. Marin track values: suitable starting values for the demonstrated Kraken pass, but conditional pending full-pose and alternate-possession validation. No production registration is justified by attempt07 evidence alone.**
