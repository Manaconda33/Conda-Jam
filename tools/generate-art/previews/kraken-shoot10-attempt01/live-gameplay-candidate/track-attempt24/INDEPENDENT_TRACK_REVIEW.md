# Independent track review — Kraken `shoot`, attempt24

**Verdict: FAIL for visible release contact; not accepted for runtime registration.**

Reviewed the production Jam Stage reports and release/flight captures at ticks10, 13 and14 for right/left facings and 100%/120% zoom.

- The ball is carried at tick10/frame4 and enters ownerless `shot` mode at tick13/frame5, then continues in flight at tick14/frame6. Frame selection/mirroring records are present for both facings and all screenshots are hash-verified.
- At tick13 the ball is too close to Kraken’s sprite and is partly hidden behind the head/raised arm, most clearly at 100% and 120% on the right-facing capture. The immediate tick14 view keeps it occluded/overlapping the head. This makes release contact less readable than attempt23. Moving the forward offset from1.5 to0.5 and raising release height from5.5 to6 appear to have moved the ball behind the silhouette.
- The ball remains visible in sampled flight at ticks16, 19 and23. Each run reaches score completion: right-facing produces `[3,0]`, left-facing `[0,3]`, `scoredAttempts` contains `shot-1`, and the ball is dead/unowned. The score-complete state selects `celebrate` with `src:null`, and the captured image shows Krios fallback artwork for Kraken. The shot scores, but Kraken's celebration animation remains missing and visibly falls back to Krios.

Keep attempt24 rejected as a release-contact calibration because the ball is obscured at release. Attempt23 has the more readable release. The gameplay shot itself completes in both facings, but the wrong Krios celebration fallback remains a separate defect. Attempt24 uses H `[1.1,0.95,1.25,1.6,2,6,2.15,1.9,1.15,1.05]`, F `[4,5,4,3,1,0.5,5.5,4.5,5,5]`, with release at tick13.
