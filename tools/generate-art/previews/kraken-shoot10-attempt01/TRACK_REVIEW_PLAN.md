# Kraken J.07 `shoot` track review plan — attempt01

Status: independent planning note only. The raw source and cleanup are accepted for gameplay trials, not production. No runtime track, atlas registration, or gameplay acceptance is claimed here.

## Source and canonical timing

The ten transparent 80×96 frames are distinct and share baseline y=94. Their sequence is gather, dip, takeoff, ascent, late ascent, release, early descent, follow-through, landing recoil, finish. `src/core/animation.js` defines durations `[3,3,2,2,3,1,2,3,4,4]` and anchors takeoff frame2/tick6, release and peak frame5/tick13, finish frame9/tick23. Frame5 lasts one tick, so the ball must visibly contact its raised shooting hand on tick13; track ownership changes at that canonical release. The basketball remains separate from the atlas.

## Candidate vector for first calibration trial

Use this only as a starting hypothesis, then adjust from actual Jam Stage captures:

- height: `[1.1, 0.95, 1.25, 1.6, 2.0, 2.25, 2.15, 1.9, 1.15, 1.05]`
- forward: `[4, 5, 4, 3, 1, 4, 5.5, 4.5, 5, 5]`

The release estimate is intentionally near the elevated shooting hand in frame5. Frames4–7 need especially close review: the raised hands sweep laterally, frame5 is a brief release pose, frame6 extends the shooting arm and guide arm outward, and frame7 is the overhead follow-through. The chosen vector is not calibrated and must not be registered on these estimates alone. The selected frame5 hand center appears around the upper part of its cell and slightly forward of the body's anchor; compare the separate ball against the actual rendered hand at 100% and 120% before deciding whether to raise or move the release point.

## Required trial and runtime checks

1. Start a trial directory per vector; preserve the full JSON vector and every rejected report/capture. Use the current Jam Stage court at `courtY=90`, Scoria Rams vs Blackthorn Court Kings, both facings, both 100% and 120% zoom.
2. Review all ten authored frame starts at ticks `[0,3,6,8,10,13,14,16,19,23]`. Also capture ticks11 and12 to inspect the carried approach into release; include frame selector/source/flip and athlete elevation in the report. Require ten distinct registered/candidate frames in order, no blank/fallback art, complete anatomy, baseline stability, no ball painted into the art, and no browser errors.
3. During candidate-only contact review, make the carried ball follow the candidate hand centers with production track interpolation. Check that it remains held through tick12 and sits in the raised shooting hand at tick13/frame5. Do not use image-side teleporting as proof of the flight path.
4. Run the real `window.jamverse.tick`/`stepMatch` path in both facings: trigger a shot with real input, confirm one release at tick13, owner cleared and `lastTouch` Kraken, then let the production flight simulation continue without coordinate overrides. Capture the release and ticks14/16/19/23 plus score completion. Record actual made/missed result, ball launch point and velocity, score, and finish/landing state.
5. Check other roster players still render normally, no stuck possession or disappearing/missing ball, no camera/HUD collision, mirroring correct, and no transition pop between frames4→5→6→7→8. Test desktop and mobile canvas sizing if the selected track/asset is registered.
6. If actual simulation misses the target because of launch height/velocity rather than visual hand placement, tune only Kraken's athlete-specific `releaseVz` with a separate preserved trial. Do not alter shared shoot timing/physics for this captain.

## Harness notes and risk

`tools/capture-j128-krios-shoot-track.py` already demonstrates full selector/mirror capture using a temporary manifest entry; adapt its atlas path and identity to Kraken only after choosing a trial. It is a candidate-art visual harness and does not prove real post-release gameplay. `tools/capture-j104-shoot-real-gameplay.py` demonstrates continuous production simulation through actual shot release and scoring, but currently names Leo and uses Leo's atlas; make a Kraken-scoped copy/configuration rather than overwriting either tool. Keep atlas selection, track override, and output paths isolated. On the normal production path after registration, remove candidate injection and confirm the registered manifest/core track are what every capture uses.
