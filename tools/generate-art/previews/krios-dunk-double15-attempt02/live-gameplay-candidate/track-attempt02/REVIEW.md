# Independent review: Krios `dunk-double` track attempt 02

**Disposition: reject for registration; retain this capture set as the second candidate review.** This is candidate-injected evidence only and does not validate runtime registration.

## Setup and result

- 60 Jam Stage production-renderer screenshots: both facings at 100% and 120% zoom, 15 action ticks each.
- Candidate atlas: attempt02 runtime candidate; candidate athlete-specific ball track injected before game start. No shared registry or core runtime files were changed for these captures.
- Track height: `[1.0, 0.9, 1.2, 1.6, 0.85, 1.0, 0.85, 0.75, 1.9, 1.55, 2.0, 1.2, 1.0, 0.8, 0.7]`.
- Track forward: `[5, 4, 3, 3.5, 1.5, -1, -1, -1, 1.2, 2.0, 12, 10, 8, 6, 4]`.
- No uncaught browser errors. The action selector chose the expected atlas/frame in all four runs.

## Visual and gameplay review

- **Tick 7 first pump: fail, although improved over attempt01.** The ball is now at the raised-hand area instead of centered on the face, but it still visibly overlaps the side/lower face at 120% in both facings. The face is not completely hidden, yet the requested face clearance is not achieved. Evidence: `right-frame03-tick07-zoom120.png`, `left-frame03-tick07-zoom120.png`.
- **Tick 9 fold: pass.** The ball is down at the upper torso and the face is clear; the pose reads as a fold/resecure. Evidence: frame 04 at 100% and 120%, both facings.
- **Ticks 10–14 resecure and second gather/apex: pass with minor contact ambiguity.** Ball remains carried by Krios, relocates from the torso into a compact chest gather, and stays clear of the rim. The gather is legible, though the small pixel hands do not fully wrap around the ball. Evidence: frames 05–07.
- **Ticks 17–19 second extension/gather: pass.** The ball is positioned between/against the raised hands at tick 17 and remains at the hand-side overhead position at tick 19; this corrects the prior attempt's detached shoulder/head placement. Evidence: `right-frame08-tick17-zoom120.png`, `right-frame09-tick19-zoom120.png` and their left-facing counterparts.
- **Tick 21 contact/release and tick 23 score: pass for gameplay timing.** At tick 21 the ball is in dunk mode with no owner and the score is still 0; at tick 23 Krios scores 2 for the appropriate side in both facings. Evidence: frames 10–11 at both zooms.
- **Tick 30 landing: pass.** Krios is upright and stable in both facings. Evidence: frame 14 at both zooms.
- **HUD, framing, and mirroring: pass.** No ball/athlete overlap with the HUD, and action remains in frame in all four facing/zoom combinations. Mirror selection is consistent.

## Conclusion

Attempt02 materially improves the fold and second-pump hand contact, while preserving the score and landing anchors. It still does not meet the explicit tick-7 face-clearance target, so it should not be registered as accepted. Retune the tick-7 point outward from the face while preserving contact with the raised hand, then recapture the same 60-view matrix. Keep the successful tick-9 fold, tick-17/19 hand placement, tick-21 release, tick-23 score, and tick-30 landing unchanged unless the next capture shows a regression.
