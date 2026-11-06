# Marin / Juniper and Kraken: focused visual acceptance triage

**2026-11-05. REVIEW HOLD, not independent art signoff and not authorization to merge.** This is a screenshot-grounded, phase-specific visual review of the exact saved source already passing the full scoped **587/587** mechanical suite. It does not substitute simulation coordinates for sprite fingertip landmarks, nor does it change any game code.

## Exact input and visual evidence integrity

- Source pins: main `7e700c0eb392800794167007e076c51ac8357a77`, original PR #6 `55a2ab104d6b108cc08132fddc01b32afb958e75`, original PR #7 `97119d54fd24c442c15192a798cae1e8a279eb1d`.
- Corrected Marin animation source Git blob `2b1413fce2582fd588f7df111bfb719e8605f046`; strict regression test Git blob `9456ffdcdf73f397c15a520b48f75a6cc91ca569`. Neither was modified in this pass.
- Independently rehashed **all 260 original game-driven PNG screenshots**, matching each screenshot's SHA-256 in its companion `report.json`: 136 frames across the [16-scenario live-transition run 42101770297](https://github.com/Manaconda33/Conda-Jam/actions/runs/42101770297), 88 across the [full normal-dribble run 42103174543](https://github.com/Manaconda33/Conda-Jam/actions/runs/42103174543), 36 across the [9/8/9 turbo-bounce run](https://github.com/Manaconda33/Conda-Jam/actions/runs/42100569559). No reported browser errors. A selected **30 original full-resolution screenshot** evidence set and five contact sheets were assembled separately for manual review.
- Original archive ZIP SHA-256 values: live transitions `fe9bf63641ce4b7872f8f51701679e6ba763fd156e643d073441a59d5540e582`; normal dribble `5b9d428f1eb7a4acb0e642e237e35da4503c7ff1d06b449a6ccd9957640487c9`; 9/8/9 turbo `2c50bafcfc2cbfee65de35ffb6e79e75e8234d0bcba5c464d4f46df497604be5`.
- Local review ZIP `Marin_Juniper_Kraken_Visual_QA_2026-11-05.zip` (contains README, contact sheets, 30 exact full-resolution PNGs, all selected screenshots' hashes and phases) SHA-256 `5c30045235fd5ac553edde1a396738eb963d6e0818eaf8dab68bc2cc0f291727`. The bundle was generated from existing screenshots, not newly rendered or edited game frames. Original GitHub Actions image artifacts remain available only for their limited retention period.

## Visual-acceptance matrix

| Action / selected frames | Actual rendered observation | Mechanical check | Visual disposition |
| --- | --- | --- | --- |
| Marin idle-ball, steps 0, 8, 24, left/right | Ball remains in plausible forward-hand area; no obvious large visual jump across selected poses | Ownership and Juniper asset registration passed | **Provisional pass**, independent hand/palm pixel-contact signoff needed |
| **Marin normal dribble, steps 1–2, 31–32**, left/right, 120% | Ball appears near Marin's face/head height while forward working hand is much lower. Repeats at loop start and on return to first dribble frame | Game ball stays attached to Marin's ball-ownership state; no simulated position error | **VISUAL HOLD 1**: resolve intended release/recovery pose/contact before acceptance. Do not force ball to hand during intentionally airborne phases |
| Marin normal-dribble floor phase, steps 15–18, left/right, both zooms | Ball moves down to court ahead of the planted foot and visibly rebounds smoothly | Floor contact exact `z=0` at game tick 15; 30-tick loop returns at tick 30 | **Provisional floor-motion pass**; court edge/fingertip pixel review still needed |
| Marin turbo-dribble, steps 5–13, left/right | Corrected 9/8/9 path stays in plausible leading-hand lane as ball descends to court. Separation is expected during a released bounce | 9/8/9 horizontal controls, mirrored registration, tick-10 floor bounce all passed | **Provisional motion pass**, no blanket offset change |
| Marin pass and actual Kraken catch, steps 5, 7, 9, 10, 11, left/right | Ball visibly travels toward Kraken; catch occurs. Separately, Kraken's receiving-clip sprites visibly shift to dark, visually fragmented-looking poses at steps 7–9 relative to coherent full-color idle step 5 and completed catch step 10 | 4/4 genuine catches at step 10 and ownership transfers passed in native simulation | **VISUAL HOLD 2**: inspect the **Kraken `receive` source atlas, frame/palette/mask and rendered frame selection** independently of ball mechanics |

The two holds are **observed art-continuity concerns**, not proven root causes. In particular, “fragmented-looking” does not by itself establish a broken file, and high airborne-ball separation is not automatically a collision defect. Both require clip/phase-specific interpretation rather than changing global interpolation or weakening strict tests.

### Exact representative frame references (original PNG SHA-256 prefix)

| Finding | Facing | Screenshot name | Original SHA-256 prefix |
| --- | --- | --- | --- |
| Normal start gap | Right | `right-zoom120-dribble-step01-dribble-idle.png` | `c3eb7a254609d95c` |
| Normal start gap | Left | `left-zoom120-dribble-step01-dribble-idle.png` | `b2aa607bbfcab62f` |
| Normal restart gap | Right | `right-zoom120-dribble-step31-dribble-idle.png` | `2dce25e5cb7e175b` |
| Normal restart gap | Left | `left-zoom120-dribble-step31-dribble-idle.png` | `791ae1f147ec7834` |
| Normal floor bounce | Right | `right-zoom120-dribble-step16-dribble-idle.png` | `1241af4fb7681c2c` |
| Normal floor bounce | Left | `left-zoom120-dribble-step16-dribble-idle.png` | `617ad7db9a5e07e1` |
| Kraken coherent idle | Right | `right-zoom120-pass-catch-step05-pass-idle.png` | `32c8f016f0f15b35` |
| Kraken receive visual change | Right | `right-zoom120-pass-catch-step07-pass-receive.png` | `88d1bf7abeb15531` |
| Kraken receive visual change | Left | `left-zoom120-pass-catch-step07-pass-receive.png` | `7c089d5c3525eff1` |
| Kraken catch completed | Right | `right-zoom120-pass-catch-step10-pass-receive.png` | `c270ac687bc164f4` |

Complete hashes, directions, zooms and frame-phase coordinates are in the `qa_index.json` evidence bundle. The original input artifacts may expire; the text evidence is versioned in this review branch.

## Next *bounded* corrective work, without losing validated behavior

**First: Kraken receive appearance diagnosis.** Inspect **one** original Kraken `receive` atlas and its accompanying generation/provenance/frame metadata against `idle`/post-catch frames. Compare rendered atlas frame 0 and subsequent frames for crop bounds, palette/mask transforms, output scale and baseline. Determine whether the dark, fragmented-looking receive poses exist in accepted source art or are introduced by renderer selection/compositing. Do **not** regenerate the source or change the global renderer before proving which layer is at fault. Save any proposed fix on a separate review-only branch, then rerender only steps 5/7/9/10/11 in both facings and at 100%/120%.

**Second: Marin normal-dribble hand-contact phase.** Define exact intended `held→release→flight→court→rebound→catch` milestones for Juniper's 30-tick normal-dribble art. Identify the actual sprite fingertip position (not the `expectedHand` simulation surrogate) at frames 0 and the loop wrap, measure ball-center/radius displacement in full-resolution rendered coordinates, and test only affected Marin-specific normal-dribble track values if a fix is justified. Preserve the current court contact tick 15 and the accepted 9/8/9 turbo-dribble horizontal sequence.

**Then: Independent acceptance and integration.** Re-run precise visual screenshots, obtain actual independent art review, and only then assemble a dedicated integration branch with reviewed source. The scoped 587/587 `npm test` result remains a verified baseline, but a passing simulation cannot override the visual holds.

## Guardrails

This diagnostic only reads existing image evidence. It does not approve the 706 inherited missing captain clips, waive the 40 disclosed non-verbatim prompt findings, establish a complete historical non-sparse Git checkout, alter published PR #6/#7, rewrite saved PR #16 source, merge, deploy, or touch inaccessible Myth workspace.

**Verdict: mechanical validation PASS; independent visual acceptance HOLD on the two specific findings above.** Keep PR #13 and PR #16 draft/unmerged.
