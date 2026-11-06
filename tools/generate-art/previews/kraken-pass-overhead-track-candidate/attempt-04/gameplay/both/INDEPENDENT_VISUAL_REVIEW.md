# Independent visual review — Kraken `pass-overhead`, attempt 04

**Visual track acceptance: FAIL.** The candidate-driven simulation is valid mechanics evidence, but the track is not visually acceptable yet.

I inspected the current corrected attempt04 run, which uses the exact attempt03 vector in both static and gameplay captures: height `[1.05,1.85,1.75,1.9,2.1,1.2]`, forward `[2.5,3,2,6,10,14]`. The candidate atlas is selected for all six frame starts in both facings; facing-left selection mirrors the same atlas. Kraken remains recognizable with auburn hair, pointed ears, copper amulet and burgundy/copper uniform. His full figure is visible in the 100%/120% captures, with no Kraken HUD crop, fallback art, or browser errors.

The production `stepMatch` test releases at tick 7 and Marin catches at step 22 in all four facing/zoom runs. Ownership transfers to Marin and the score remains 0–0. This confirms the current candidate track reaches the real release and catch without moving the ball after launch.

The carried-ball contact and release are still visibly wrong: at release, the separate ball is well forward and above Kraken's fingertips, leaving a clear gap in both facings at both zoom levels. The ball is already high at the raised-hand follow-through, so successful delivery to Marin does not establish hand contact. This is the acceptance blocker; reduce the frame3/tick7 forward offset substantially and recapture the whole carried sequence before another review. The teammate Marin is cropped at the top edge in this diagnostic layout, but that setup artifact does not obscure Kraken or cause the ball-contact finding.

The earlier directory `diagnostics/initial-mixed-track-run/` is explicitly marked as a configuration mismatch and was excluded from this review. Only `gameplay/both/report.json` and its screenshots are used here.
