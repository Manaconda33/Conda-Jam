# Independent review: Krios `dunk-double` track attempt 03

**Disposition: pass as an unregistered candidate for parent review.** This validates the injected track in captured gameplay; it does not constitute runtime registration or acceptance.

## Capture setup

- Current Jam Stage production renderer; actual queued `dunk-double` action.
- 60 screenshots: right and left facing at 100% and 120% zoom, sampled at ticks 0, 2, 4, 7, 9, 10, 12, 14, 17, 19, 21, 23, 26, 28, and 30.
- Candidate atlas and candidate ball track injected for the capture only. No runtime registry/core edits or registration.
- Zero uncaught browser errors. All sampled frames selected the expected candidate atlas and direction/flip.

## Exact candidate track

Height: `[1.0, 0.9, 1.2, 1.6, 0.85, 1.0, 0.85, 0.75, 1.9, 1.55, 2.0, 1.2, 1.0, 0.8, 0.7]`

Forward: `[5, 4, 3, 5.0, 1.5, -1, -1, -1, 1.2, 2.0, 12, 10, 8, 6, 4]`

Compared with attempt02, the retained successes at tick9, tick17, and tick19 are unchanged. The tick7 forward value moves from 3.5 to 5.0 to clear Krios's face toward the raised hand.

## Review findings

- **Tick 7 first pump: pass.** The ball is visibly clear of the side/lower face in both facings at 120% and sits against the raised-hand area. It remains inside the play view and clear of the HUD. Evidence: `right-frame03-tick07-zoom120.png`, `left-frame03-tick07-zoom120.png`.
- **Tick 9 fold/resecure: pass.** The ball returns to the upper torso with Krios's face clear; the gather reads as controlled. Evidence: frame 04 at both zooms and facings.
- **Ticks 12–14 gather/apex: pass.** The ball remains carried and compact at the chest through the low apex, without rim collision or a stray ball trajectory.
- **Ticks 17–19 second extension: pass.** The ball meets the raised-hand area and stays with the overhead gather in both facings. Evidence: frames 08–09 at both zooms.
- **Tick 21 release/contact: pass.** The ball switches to dunk mode, loses Krios as owner, and is visibly at the rim; score remains 0 at this sample.
- **Tick 23 score: pass.** Krios scores 2 in the correct team's score for each facing. The score event is recorded at tick 23.
- **Tick 30 landing: pass.** Krios is grounded and stable in both facings; no missing sprite or visible discontinuity.
- **HUD, framing, facing, zoom: pass.** Action, ball, score, and landing remain legible at 100% and 120%; no HUD collision or clipping was observed.

This candidate is suitable for parent consideration. Keep it unregistered pending the captain asset lane's required review/acceptance process.
