# J127 Leo alley-oop-reverse ball track trials

Native capture reports and raw screenshots for every calibration candidate are preserved under `attempt-02` through `attempt-09`. Each successful run captured 15 timing samples at both facings and 100%/120% zoom (60 captures). The renderer loaded the candidate atlas through a temporary in-page manifest override; no runtime manifest was changed.

The best reviewed attached-ball contact run is attempt-08. The best structurally correct candidate is attempt-09: the ball is ownerless in pass mode through tick9, owned/carried by Leo from the catch at tick10 through tick20, and separate/ownerless in dunk mode from tick21. Attempt-09 needs further review before acceptance because the tick9-to10 screenshots appear to jump vertically despite similar recorded world height. The samples do not run a ball to the hoop or simulate score and landing, so those gameplay behaviors remain unverified here.

Attempt-01 had an accidental path collision with pre-existing tracked captures. The parent recovered the tracked content and preserved the new candidate output and selector-fallback rejection evidence in that path. It is left untouched. See `track-trials.json` for the collision provenance and attempt-by-attempt rejection reasons.

Attempt-10 reran the current candidate at the requested `courtY=90`. High poses at ticks 10, 12, and 14 crop against the scoreboard/HUD, so 90 is not a usable contact-review placement with the current camera and zoom. This is recorded as a blocker; attempt-09 at `courtY=115` is only provisional, not a substitute for the required placement.

## Correct camera framing at courtY=90

The high poses were clipped because `alley-oop-reverse` does not activate Jam Stage's dunk camera. Attempts 11–13 preserve failed in-page Canvas pan experiments; they had no effect. Attempt 14 preserved a selector failure from an incomplete temporary alias. Attempts 15–16 use a temporary same-atlas `dunk-alley-oop-reverse` alias in both the manifest and animation timing table, so the normal Jam Stage dunk camera path activates. The renderer pans by its production `stageAttackPanY(z)` (0–42 logical pixels). To keep the asset/court view at requested zoom 100% or 120% through the production dunk push-in, the slider input is set to `requestedZoom / stageAttackZoom(z)` at each sample. `courtY=90` is retained. Attempts 15–16 now clear the HUD, but attempt16 remains provisional because the hands at ticks 10/12/14 do not all meet the ball closely enough.

## Current best candidate: attempt20

Attempt20 keeps the attempt19 carry offsets, which gave close visual contact across the catch at tick10 and carried samples 12/14/17/19/20 in both facings. It lowers the separate release ball at tick21 to align with Leo's descending release hand. The capture uses courtY90 and the production dunk camera path described above. It has 60 native screenshots and verified selector/mirror checks. This is the best ball-track candidate from the sampler, not a gameplay acceptance: the center-court capture does not simulate a hoop approach, live flight, scoring collision, or landing.

Attempt-21 moved Leo to x185 (courtY90) to see the right hoop. The production camera tracks toward the hoop and crops Leo at the right edge, so this diagnostic does not prove the candidate release enters the rim. The sampler assigns static poses and ball modes; it does not run simulation physics or score/landing logic. A live gameplay capture in an unclipped basket approach is still required before the track can be accepted.


## Attempts 22–24: catch endpoint and release continuity

Attempts 22–24 retain courtY=90 and use the production dunk camera pan with effective 100%/120% zoom. Each has 60 native captures across 15 authored timing samples, both facings, and both zoom levels; selector, candidate atlas source, mirror flip, and browser error checks passed. Attempt22 assigns Leo as the aerial target for the ownerless pass through tick9, so the approach ball is drawn using his elevation mapping before the tick10 catch. At 120%, tick9 places the pass close to the extended hand and tick10 places it at the catch pose; carried contacts at ticks12/14/17/19/20 remain close.

Attempt22 was rejected because tick21 release remained too high above the descending frame10 hand, with a larger mismatch in left-facing. Attempt23 lowered tick21 but its left-facing x adjustment overshot. Attempt24 adjusts the two facing release origins independently: right `[-8.4, 1.45]`, left `[-1.5, 1.45]` (local forward offset, ball height). Visual inspection shows tick21 near the lowering hands for both facings; samples 22/23/26 continue into free flight with expected directional progression. The best provisional candidate track is recorded in `track-trials.json` and attempt24 `native/report.json`.

This remains a calibration candidate only. The static sampler cannot validate live pass/catch ownership, ball physics, hoop entry, score, or landing. A real gameplay test with the selected track is required before acceptance.

## Final acceptance — 2026-10-27

Attempt24 was independently reviewed across right/left, 100%/120%, 60 native captures. The reviewer approved pass-to-catch contact, carried poses, release continuity, selector/mirror behavior, framing, and absence of HUD obstruction. The attempt24 vector is now integrated in `src/core/animation.js` and the manifest provenance. `tests/animation.test.js` validates ownerless lob through tick9, Leo ownership from tick10 through tick20, one release at tick21, score/assist at tick23, and grounded post-score state, in both facings. `tests/animation-sprites.test.js` checks all 15 source frames and mirroring. The full suite passes. Earlier attempt 9–23 issues and attempt24's capture-local release offsets remain documented above; production ownership and scoring are verified by simulation rather than those static overlays.
