# Attempt 07 post-review simulation audit

**Decision: reject the track despite clean receiver contact screenshots.** Independent visual review confirmed HUD clearance and ball contact at Marin’s hands, but direct inspection of the recorded normal simulation trace found that the ball reaches `z=0` at step20, bounces, then moves from `z=0.7452` before catch to `z=1.7` on catch at step27. This is a visible and mechanically incorrect floor bounce/catch correction that the sparse screenshots missed.

The normal-loader atlas and facing selection passed; the defect is only in the separate flight track. Attempt08 trials `releaseVz=.232`, preserving the source and hand-contact points while keeping the ball airborne through the receiver catch. Attempt07 remains preserved as a failed track, including the reviewer’s source/mirroring/HUD findings.
