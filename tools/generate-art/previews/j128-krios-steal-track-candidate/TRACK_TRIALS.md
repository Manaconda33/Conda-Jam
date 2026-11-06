# J.128 Krios `steal` track trials

All captures use the production Jam Stage canvas and `stepMatch` with the candidate atlas and a candidate-only `athleteBallTracks.krios.steal` injection. The current court is sampled at y=90. Full-pose showcase runs use a real steal input against a carrier outside reach so frames0–7 remain visible. Separate contact runs keep Krios at his current steal stat (63), use a valid in-range opponent carrier, and find a deterministic seed that reaches the real frame3/tick5 steal. The simulation, not per-frame ball teleporting, creates the loose ball from Krios's athlete-specific held-ball point. Candidate assets and tracks in these reports are not registered production state.

- `attempt-01/native/`: rejected. Contact setup placed the test athletes at court y=50 despite report metadata saying y=90 and put their sprites directly on top of one another.
- `attempt-02/native/`: rejected track trial. Court and actor spacing were corrected, but contact height 0.95 put the loose ball visibly above the knee-level hook.
- `attempt-03/native/`: rejected track trial. Height 0.1 and forward offset 10.5 put the ball at court level and too far ahead of the hand.
- `attempt-04/native/`: current candidate under independent review. Height `[1.0,0.9,0.75,0.5,0.6,0.9,1.05,1.0]`, forward `[6,8,10,8,10,8,8,7]`. At tick5 the ball is ownerless and loose after a real steal, and the 100%/120% right/left captures place it against the empty hook. No production acceptance until the review passes and a no-candidate registered-runtime capture succeeds.
