# Kraken pass-overhead attempt 02 — resumed independent review (2026-10-28)

**Decision: retain as a calibration candidate only. Do not register or accept for production.**

I inspected the v2 runtime-candidate atlas and the native Jam Stage captures at ticks 0, 2, 5, and 7, along with the capture report, prior review, and harness implementation.

## Art and contact

The six-frame sequence reads as a coherent overhead pass, keeps Kraken's recognizable face, horns, red skin, anatomy, and uniform, and has no baked-in ball. The candidate is presented in both facings at 100% and 120%; the mirrored framing remains consistent in the sampled images. The tick-7 release ball sits at the raised hands. Contact is weaker earlier: at tick 0 the ball is low and offset around the torso rather than clearly supported by the hands, and at tick 5 it sits beside the raised head/hand area without convincing two-hand contact. Tick 2 is the strongest held pose. These visible gaps keep the track below acceptance.

The report records 24 static selector captures and four normal gameplay pass/catch smoke runs, with the pass event at tick 7 and Marin catching at step 28. Those are useful coverage checks, but they do not prove continuous candidate-driven possession.

## Harness limitation

The static captures manually set the ball to the candidate offsets for each sampled frame. In each normal gameplay run, the game advances the registered generic fallback offsets until release; the harness then manually moves the ball to the candidate frame-3 release point after the pass event and lets flight/catch physics continue. Therefore the simulation never applies the candidate track to ticks 0–6, and the successful catches do not validate candidate-driven contact, release position, or transition behavior.

## Required next step

Refine the gather and wind-up ball offsets, then rerun a normal simulation that uses the candidate track continuously before release and transitions naturally on tick 7. Keep this attempt labeled calibration-only until contact, both facings, zooms, release, and catch have been independently reviewed under that integrated setup.
