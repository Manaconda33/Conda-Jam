# Independent live gameplay review — Krios J.128 `dunk-power`

**Verdict: PASS for normal-loader runtime verification only. Do not register from these captures.**

## Scope and evidence

Reviewed all 60 current Jam Stage captures in this folder: 15 canonical frame starts × both facings × 100% and 120% zoom. The report records the attempt02 candidate atlas SHA-256 `ddbd2e5d12c04d25e9a9d72c043a340cdd83cd79aff4e2ec8339ad68380073c7`, track attempt04, current Jam Stage courtY90, and no uncaught browser errors. Production selector metadata matches all 15 requested cells; the left-facing runs use the expected mirror flag. This is a candidate injection run, so normal-loader registration is not yet proven.

## Visual findings

- Krios remains recognizable as the red-skinned, black-horned, bearded Scoria captain. Full anatomy and the plain charcoal/red-trim uniform read consistently. The art remains ball-free.
- The sequence reads as approach, load, takeoff, overhead gather, peak, forward drive, release, follow-through, and landing in both directions. Poses 5–7 and 9–11 remain close in silhouette, as earlier source review noted, but the required timing distinctions can be read at native gameplay size.
- Track attempt04 is substantially improved over attempts01–03. Frames4–7 now keep the separate ball around the gathered/raised hands in the live dunk trajectory; frame9 reaches toward the rim. The ball is correctly ownerless at the release anchor and the normal simulation commits one two-point score at tick23 in both directions.
- The dunk release ball is not clearly visible in the tick21 screenshot because the simulation places it at the rim and the hoop/net overlap hides it before the score transition. This capture does not establish a visible ball-flight arc after release. Confirm the normal-loader scoring transition and ball ownership there; do not infer a post-release trajectory from this candidate report.
- At peak, the updated `stageAttackPanY(140)` keeps Krios's body inside the viewport at both zooms. It exposes a broad black gap between the HUD and audience/court backdrop during the highest poses. That is a presentation concern for the court camera, not a missing-pixel or anatomy defect in the atlas. Check this composition in the normal-loader run before accepting the art.
- Both facings keep the athlete and rim in view. No HUD collision or clipped horns/feet were visible in the reviewed samples after the camera-pan adjustment.

## Required next check

Proceed to a normal-loader runtime verification using the reviewed attempt02 atlas and track04, then inspect both facings, zoom levels, all 15 frame selections, score-to-celebration transition, and separate-ball ownership at tick21. Resolve or explicitly approve the black top gap and verify the hidden tick21 ball at rim scale before production registration. Preserve this candidate set and the prior track attempts.
