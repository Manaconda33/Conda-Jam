# Kraken dunk-tomahawk attempt02: independent gameplay review

**Verdict:** Attempt02 improves ball height and release, but frames6–8 still do not follow the right hand. Frame9 strike contact is close; retune before accepting.

Reviewed both-facing 120% captures at frames6–9 and report metadata. The run has 60 captures across all 15 frames, both facings and zooms, no browser errors, correct side scores at tick23, release at tick21, and upright recovery at tick30. Candidate atlas/track are injected; no production registration.

## Contact findings

- **Frame6:** Ball overlaps the face while the right hand is cocked behind the crown to screen-left. Move it behind the head; vertical level is close.
- **Frame7:** Ball remains over the face, while the right hand is still behind the head. Move it farther backward; height is slightly low relative to the hand.
- **Frame8 overhead:** Ball is near the head but right/forward and below the raised hand. Move it back and raise it.
- **Frame9 downstrike:** Ball is close to the lowered striking hand in both facings, slightly high. This point needs only a small lowering adjustment.

## Suggested attempt03 estimates

For frames6–9, try `height=[1.4,1.5,1.9,0.7]` and `forward=[-4,-6,-2,4]`. These place the ball behind the cocked hand, higher at the overhead position, and slightly lower at the strike. Recheck both facings and smooth the transition from frame5 before accepting any values.
