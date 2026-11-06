# Independent normal-loader review — Krios J.128 `alley-oop-power` track attempt05

**Verdict: PASS for this 60-capture normal-loader set.** This review accepts the registered runtime presentation and gameplay sequence shown in these captures. It does not change the art's or track's provenance status by itself.

## Runtime integration and selector

Reviewed `report.json` and all four 15-frame run records (right/left × 100%/120%). It reports `runtimeIntegration: true`, `cameraShim: false`, `candidateAtlasInjected: false`, and `candidateBallTrackInjected: false`. Each capture uses `./public/assets/animation/krios-alley-oop-power-right.png`, selects the expected frame index, and uses unflipped right-facing art or the expected horizontal flip for left-facing. All 60 captures have the matching `alley-oop-power` clip and atlas. `uncaughtBrowserErrors` is empty. No fallback is indicated: the selected source and frame match the registered runtime asset throughout.

## Visual and gameplay review

Inspected the 60-capture set through the contact sheet and representative full-resolution captures at frames8/9, catch, release, score, and landing. Frame8/tick17 and frame9/tick19 keep the separate ball at Krios's raised finishing hand in both facings and both zooms; the ball is adjacent to and partly occludes the hand pixels, but reads as held through the transition. Frame8-to-frame9 hand contact remains continuous enough to read as one carry, rather than a detached flight. The ball remains clear of the top HUD at 120%.

At the catch anchor frame5/tick10, the live teammate pass has changed from `pass` to `carried`, Krios owns the ball, and the capture records the alley-oop catch event. At frame10/tick21 the ball is released in `dunk` mode at the rim; Krios no longer owns it. At frame11/tick23 the score is 2–0 for the attacking team on right-facing and 0–2 on left-facing. Frame14/tick30 shows Krios in landing/recovery with the ball dead and the score stable.

The rim, backboard, attacker, and flight remain framed in all directions. The camera tracks the right attack around x=182.6–187.7 and the mirrored left attack around x=17.4–12.3, with no apparent abrupt pan, clipping, or loss of the action. HUD and court geometry remain visible. No missing sprites, selector errors, or browser errors were found.

## Scope and evidence

The report contains 60 captures: 15 frames × two facings × two zoom levels. The capture is a real teammate alley-oop in the current Jam Stage at courtY=90; it uses the registered atlas and Krios-specific runtime track, with no candidate injection or camera shim. The score state is present at action tick23; the report's event timestamp uses total match ticks (the pass starts earlier), so it records the final score event at tick30.
