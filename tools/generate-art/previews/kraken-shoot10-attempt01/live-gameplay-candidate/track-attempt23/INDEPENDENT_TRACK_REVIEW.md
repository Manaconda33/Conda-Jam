# Independent track review — Kraken `shoot`, attempt23

**Verdict: PASS for continued candidate review; not accepted for runtime registration.**

Reviewed the production Jam Stage reports and release/flight captures at ticks10, 13 and14 for right/left facings and 100%/120% zoom.

- The separate ball is carried by Kraken at tick10/frame4 and is ownerless in `shot` mode at the canonical tick13 release/frame5. At tick14/frame6 it remains in continuous flight. The release ball is visible beside the raised shooting-side hand/face and reads as a release; contact is better than attempt24, where the ball is pulled farther into the sprite.
- The 76 report entries have matching screenshot hashes. Expected candidate source/frame selection is recorded through the authored frames, with right-facing unflipped and left-facing mirrored. Both facings show the same release behavior; no discontinuity is apparent between the tick13 release and tick14 flight sample.
- The ball remains visible in sampled flight at ticks16, 19 and23 at both zooms and facings. Each run reaches score completion: right-facing produces `[3,0]`, left-facing `[0,3]`, `scoredAttempts` contains `shot-1`, and the ball is dead/unowned. The score-complete state selects `celebrate` with `src:null`, however, and the captured image shows Krios fallback artwork for Kraken. The shot itself scores in both facings, but Kraken's celebration animation remains missing and the fallback is a separate visible defect.

Keep this track unregistered pending review of the remaining gameplay/visual requirements and the missing Kraken celebration fallback. Attempt23 uses H `[1.1,0.95,1.25,1.6,2,5.5,2.15,1.9,1.15,1.05]`, F `[4,5,4,3,1,1.5,5.5,4.5,5,5]`, with release at tick13.
