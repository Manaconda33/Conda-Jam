# Kraken push attempt04 — independent current-court review

**Verdict: FAIL for visual acceptance; preserve as candidate trial evidence.** The simulation/contact checks pass, but at tick8 both staggered hands are not clearly visible on Sable because the opponent's torso occludes one hand in both facings and zooms.

Reviewed the 44 push captures in four runs (right/left × 100%/120%) on Vesper Harbor Undertow vs Blackthorn Court Kings, courtY75. The old Scoria/courtY50 runs are not part of this verdict.

- Candidate source selection is correct through push frame5: `kraken-push11-attempt04-runtime-candidate.png`, frames0–5 at ticks0,2,4,6,7,8. Right facing uses `flip:false`; left uses `flip:true`. At contact tick8, the source is frame5 in both directions.
- Tick8 registers one knockdown and 44 stun ticks. Sable owns the ball through tick7; at contact it becomes loose and unowned with `lastTouch=kraken`. Kraken gains possession by tick15. Score remains 0–0, with no browser errors. The loose ball is separate runtime state, though it is obscured by the overlapping players in the tick8 screenshots and is clearer again on the pickup frames.
- The HUD and event banner remain readable at both zooms. The contact frame shows the players overlapping; only one of Kraken's two staggered hands is clearly visible against Sable, while the second is lost behind Sable's torso. The state records a knockdown on tick8, but the target still reads mostly upright at that exact screenshot; the next captures begin the fall/recovery transition.
- After the push clip, the animation changes to `rebound`; those captures report no selected source (`src:null`), so this evidence does not validate rebound sprite selection or normal-loader fallback behavior.

Keep the push candidate unregistered. Revise composition/depth staging so both hands visibly contact the opponent at tick8, then repeat the four current-court runs. The existing mechanics results can be retained as valid trial evidence for ownership, knockdown count, score and error status.
