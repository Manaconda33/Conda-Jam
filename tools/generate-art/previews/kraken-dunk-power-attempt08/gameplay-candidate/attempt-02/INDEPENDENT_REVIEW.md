# Kraken dunk-power attempt02 — candidate gameplay review

**Verdict: the attempt01 contact corrections pass at the reviewed beats; continue as candidate only.** This remains an injected art/track trial, not a production-loader test (`runtimeIntegration: false`, `candidateAtlasInjected: true`, `candidateBallTrackInjected: true`).

## Contact and motion

- **Frames3–5:** the updates fixed the attempt01 defects in both facings and at both zooms. At frame3/tick7, the ball is forward of the face and meets the hands at chest/shoulder height. At frames4–5/ticks9–10, it stays with the gather/plant hands instead of floating above the head.
- **Frame9/tick19:** reducing `forward[9]` to 6 brings the ball to the raised hand. At 120% the ball edge meets the fingertips in both facings; it no longer sits out near the hoop. The carry into the peak reads continuously from the prior frames.
- **Frame10/tick21 release:** the ball enters dunk mode at the rim with possession cleared; the reaching arm is at the hoop. The score arrives at tick23/frame11. Both facings score two points: right `[2,0]`, left `[0,2]`. The post-release ball is ownerless/dead.
- **Landing and continuity:** all 15 frames progress in order through both facings. The full body stays visible. Kraken has returned to `z=0` by frame11/tick23, then continues through low recovery frames12–13 and upright frame14/tick30. The landing is quick over two ticks but reads as a dunk follow-through and recovery. No HUD occlusion or browser errors are reported.

## Runtime selection and scope

- All 60 captures select frames 0–14 from `kraken-dunk-power-attempt08-cleanup04-atlas.png`, across right/left and 100%/120%. Right-facing has `flip:false`; left-facing has `flip:true`.
- Candidate injection is explicit and appropriate for this trial. `uncaughtBrowserErrors` is empty.

These results support further candidate gameplay review only; do not treat them as normal-loader or registration evidence. No production assets or tracks were changed.
