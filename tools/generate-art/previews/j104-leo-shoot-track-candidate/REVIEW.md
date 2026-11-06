# J.104 Leo shoot: native track calibration

Each attempt staged the production Jam Stage at courtY 90 on Scoria Rams vs Blackthorn Court Kings, without modifying runtime registration. The candidate atlas was loaded before a single stage start to avoid stale/fallback rendering. Every successful attempt records 40 captures across ten canonical frame starts, both facings, and 100%/120% zoom. Reports confirm the generated full-roster atlas renderer, the Leo candidate atlas selected at every frame, correct left mirroring, and no browser errors. The basketball remains a separate rendered object.

## Attempt 01 — rejected

Track height `[0.95,1.1,1.25,1.55,1.9,2.15,2.1,1.8,1.35,1.05]`, forward `[6,7.5,8.5,9.5,10.5,11.5,10.5,8.5,6.5,5.5]`; release positions are retained in the native report. At gather frame3/tick8 the ball is too far forward and low relative to the two-hand set. At frame4/tick10 and release frame5/tick13 the hand contact is also missed. Keep as rejected calibration evidence.

## Attempt 02 — rejected

Track height `[0.95,1.1,2.1,2.8,3.5,4.2,3.9,3.3,2.1,1.05]`, forward `[6,7,6.5,4,3,4,4,4,6.5,5.5]`; frame3/tick8 is high, and frame4/tick10 remains above Leo's hands. At release frame5/tick13, horizontal placement is close but the ball remains visibly below the raised shooting hand. Flight samples are not continuous with the release pose. Keep as rejected.

## Attempt 03 — best provisional candidate, not accepted

Track height `[0.95,1.1,2.1,2.1,2.7,5.8,5.2,4.0,2.1,1.05]`, forward `[6,7,6.5,4,3,4,4,4,6.5,5.5]`; separate flight samples at ticks13/14/16/19/23 are `[4,8.8]`, `[4.5,8.8]`, `[7,9.3]`, `[15,8]`, `[26,3]`. Gather and set placement is closer, and tick13 horizontal contact is close in both facings. The tick13 ball still sits below the elevated hand in the right-facing 120% capture, and the free-flight transition needs additional tuning/review. This remains a candidate only; do not register it as accepted without correcting/reviewing those points and validating actual gameplay release.

Exact captures and report files for all attempts are in their respective `attempt-01`, `attempt-02`, and `attempt-03` native directories. Script: `tools/capture-j104-leo-shoot-track.py`.

## Attempt 04 — provisional candidate, independent review pending

Track height `[0.95,1.1,2.1,2.1,2.7,11.5,10.5,7.0,2.1,1.05]`, forward `[6,7,6.5,4,3,4,4,4,6.5,5.5]`; release/free-flight samples at ticks13/14/16/19/23 are `[4,14.5]`, `[4.5,14.8]`, `[7,15.5]`, `[15,13]`, `[26,4]`. The tick13 height corrects the clearly low release contact in attempt03: it is the sampled player height3 plus H11.5. Visual inspection at 100% and120%, both facings, shows the ball touching Leo's raised right hand at release and immediately departing above the hand at tick14. Gather frame3/tick8 contacts the two hands; frame4/tick10 has slight facing-dependent offsets but overlaps the raised hand/ball silhouette. Ticks16/19/23 form a continuous-looking flight path.

This remains a candidate pending independent review. The large relative height at frame5 is unusual and must be checked against live gameplay before runtime integration. Native report confirms 40 captures, correct atlas/frame selection and mirroring, current Jam Stage, and zero browser errors. Retain attempts01–03 as rejected evidence.

## Attempt 04 — independently accepted native visual candidate

Track height `[0.95,1.1,2.1,2.1,2.7,11.5,10.5,7.0,2.1,1.05]`, forward `[6,7,6.5,4,3,4,4,4,6.5,5.5]`; release/free-flight samples are tick13 `[4,14.5]`, tick14 `[4.5,14.8]`, tick16 `[7,15.5]`, tick19 `[15,13]`, tick23 `[26,4]`. The 40 native captures cover both facings and 100%/120%; selector/mirror and browser-error checks pass. Independent reviewer accepts the tick13 hand overlap and tick14 departure above the hand, plus frame3 gather contact. Frame4/tick10 has a small facing-dependent offset, but the ball still meets the raised hands. Tick16/19/23 trajectory reads smoothly. Evidence: `attempt-04/native/report.json` and its captures.

Important limitation: the candidate's H11.5 frame-5 value is unusually high as a gameplay-relative track. Static stage captures establish visual contact only; actual simulation release, ball flight and scoring must be validated before runtime integration.

## Attempt 05 — rejected continuity probe

Used attempt04's track and added interpolated ticks11/12. The H2.7→11.5 rise places the ball above the crop at tick11 and obscures it near tick12; the interpolation is too steep to accept as a carried-ball path. The additional captures are retained under `attempt-05/native/`.

## Attempt 06 — rejected low release probe

Reduced frame5 height to7.5 and tick13 release height to10.5. The ball remains visibly below the right hand at release; this does not meet contact. Captures are retained under `attempt-06/native/`.

Attempt04 is accepted only as the best independent native visual candidate. Do not mark it production-ready until simulation and free-flight gameplay checks resolve the high track value and verify shot release/scoring.

## Gameplay-relative follow-up — attempt04 remains on hold

The 2026-10-28 gameplay check found that static attempt04 release samples were staged at `player.z=3`, while the real Leo `shoot` action reaches the tick13 release at `player.z=2`. With its `H=11.5` frame5 value, the production hand-to-flight mapping yields projectile `z=16.1667`, not the staged `14.5`. A manual shot continuation scored with an unusually high ~100-step flight, but this does not validate the hand contact visually in gameplay. Do not register attempt04 until a revised track is captured at the actual simulated jump height and reviewed for contact and flight continuity. Full evidence and reproduction details: `gameplay/REVIEW.md`.

## Final gameplay-relative recalibration — attempt07 accepted for integration

Attempt05 is rejected for a high frame4 gather. Attempt06 preserved corrected contact but mirrored left-facing post-release flight incorrectly. Attempt07 retains the accepted H7.5 contact vector, captures the actual player jump height (`z=2` at tick13), and stages the left-facing projectile toward the target rim. Its Jam Stage capture report has 48 captures, valid frame selection/mirroring and no browser errors. Simulation release and score checks pass both facings; the separate ball remains ownerless after release. See the attempt05/06/07 review files and gameplay evidence for details.

## Final actual gameplay-render check — attempt09 accepted for integration

The required simulation/render follow-up found that attempt07 H7.5's static grid concealed an ~80px high actual release because its shot preview omitted last-touch elevation compensation. Attempt08 lowered the release but remained high at the gather. Attempt09 uses H2.5 at release and H2.2 at the gather. Its actual Jam Stage captures use a real continuous shoot action and post-release physics, with 24 native frames across both facings, target ticks and zooms plus final score state; both real shots score and the ball is aligned at release. Preserve the rejected attempt07/08 evidence and the superseded committed attempt05/06 archives. See attempt07/gameplay/REVIEW.md, attempt08/REVIEW.md, and attempt09/REVIEW.md.

## Attempt10: lower actual flight profile and complete 120% coverage

Attempt09's late arc was clipped by the HUD at120%. Attempt10 candidate03 retains H2.5 at tick13 and applies `vz=.65` once at the real release boundary; actual post-release physics then scores from both facings. At courtY95, both ball and Leo remain visible through tick23 and score completion at100%/120%. The exact vectors, captures, selector/mirror evidence, simulations, and the rejected attempt10 probes are in `attempt-10/REVIEW.md`. No runtime behavior was changed by this calibration run.
