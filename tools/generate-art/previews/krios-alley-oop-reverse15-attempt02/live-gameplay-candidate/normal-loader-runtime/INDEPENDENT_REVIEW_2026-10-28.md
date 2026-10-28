# Independent normal-loader review: Krios `alley-oop-reverse` attempt04

**Date:** 2026-10-28
**Verdict:** **PASS for normal-loader gameplay review.**

## Runtime path and capture integrity

- `report.json` confirms `runtimeIntegration=true`, `candidateAtlasInjected=false`, `candidateBallTrackInjected=false`, and `cameraShim=false`. The captured atlas is the registered public asset `./public/assets/animation/krios-alley-oop-reverse-right.png` (SHA-256 `10ca9bdcc859183fd7b88a32235274b37971ad1cd8499ed46aee3912781abd0c`).
- Four runs cover right/left facing at 100%/120% zoom, with 15 captures per run (60 total), no uncaught browser errors, and the normal current Jam Stage. The selected frame sequence is exactly 0–14 in every run. Right-facing uses `flip=false`; left-facing uses the reviewed mirrored source with `flip=true`.

## Visual review

- **Catch and hand contact:** The actual teammate alley-oop event is recorded at tick17. In frame9/tick19 the ball remains visibly at Krios's receiving hand while he is airborne and `hasBall=true`. The foreground passer partly overlaps Krios's lower body in these screenshots, but does not hide the receiving hand or ball.
- **Release:** At frame10/tick21, Krios's reverse finish reaches the rim and the separate ball is visibly at the rim. State changes to `mode=dunk`, `owner=null`, with `action.released=true`. No basketball is baked into the atlas.
- **Score:** At frame11/tick23, the ball is dead/unowned and the correct two points are on the scoreboard: `[2,0]` for right-facing and `[0,2]` for left-facing.
- **Landing:** Frame14/tick30 shows Krios grounded (`z=0`), with the score intact.
- **HUD and visibility:** The athlete, ball at catch/release, hoop, and HUD remain in view at both native zoom levels. The P1 marker does not cover the hand-ball contact or the release ball. No frame-selection fallback or missing-sprite state appears.

## Conclusion

The registered normal-loader asset and existing athlete-specific track produce the expected 15-frame sequence, actual teammate catch, held contact, rim release, score, and landing in both facings and zooms. No production asset was changed during this review.
