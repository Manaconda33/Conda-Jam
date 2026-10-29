# Kraken push attempt04 — attempt14 current-court review

**Verdict: PASS for candidate visual/mechanics trials with the Sable y=72.5 offset. Not a production registration approval.** At contact tick8, both staggered Kraken hands are visible against Sable in both facings and at 100%/120% zoom.

Reviewed all four push runs (44 captures) on Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75. This is candidate-only evidence (`candidateOverridesOnly=true`, `productionRegistration=false`); old Scoria/courtY50 trials are excluded.

- At tick8/frame5, the offset separates the bodies enough to show both outstretched hands contacting Sable's upper/mid torso. The prior attempt12 torso occlusion is resolved in right and left captures at both zoom levels. The contact is readable; Sable begins to recoil and is down in the later recovery captures.
- Push sprite selection uses `kraken-push11-attempt04-runtime-candidate.png` and sequential frames0–10 at the recorded ticks. Right facing uses `flip:false`; left facing uses `flip:true`. Frame5 is selected at contact tick8 in all four runs.
- Simulation records one knockdown and 44 stun ticks at tick8. Sable owns the ball through tick7; contact makes it loose and unowned with `lastTouch=kraken`. It remains separate from the athlete art. The score stays 0–0 throughout. No browser errors are recorded.
- HUD and contact/event banner remain visible at both zooms. No viewport clipping or score overlay obscures the interaction.

Keep this as candidate trial evidence only. A normal-loader review is still required before acceptance or registration.

Reviewer: independent asset audit. Review date: 2026-10-29.
