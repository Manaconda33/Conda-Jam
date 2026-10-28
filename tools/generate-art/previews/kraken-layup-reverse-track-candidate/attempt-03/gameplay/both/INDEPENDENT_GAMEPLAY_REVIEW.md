# Independent gameplay review — Kraken `layup-reverse`, attempt03

**Verdict: FAIL for complete two-facing gameplay review. Keep unregistered.**

The report contains 52 native Jam Stage captures and no browser errors. On the right-facing runs, the candidate atlas is visible in the production canvas, frame selection is correct through release, the ball stays Kraken-owned through tick11, and `stepMatch` releases it to an ownerless `shot` at tick12. The game records a two-point score by tick100 at both zooms. In right-facing samples, frame4/tick10 and frame5/tick12 place the ball close to the raised far-side hand, and the contact/release remain clear of the HUD.

The left-facing simulation also releases at tick12 and scores by tick100, with the selector reporting the expected horizontal flip. However, the player projects offscreen for the entire left-facing gameplay run: report `screen.x` is negative (about -151 at tick0 and -112 at tick10). The saved left-facing screenshots therefore show only the court, not Kraken or the candidate atlas. This prevents visual verification of left-facing hand contact, release and camera framing. Score success alone does not establish the visual requirement.

The current report is useful for right-facing gameplay and simulation timing only. The first run with fallback artwork is separately preserved in `gameplay/harness-failure/`. Correct the left-facing fixture/camera placement, rerun gameplay with the candidate visibly on screen in both facings and zooms, and have that output reviewed before accepting the track. This review does not approve packing or runtime registration.
