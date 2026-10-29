# J.104 attempt10 candidate03 — accepted calibration evidence

This candidate keeps the tick13 release contact while shortening the shot arc and framing the full action at review zooms without cropping Leo's feet.

- Track H: `[0.95,1.1,2.1,2.1,2.2,2.5,2.3,2.7,2.1,1.05]`
- Track F: `[6,7,6.5,4,3,4,4,4,6.5,5.5]`
- Court position for review: x130, y95; this is a native Jam Stage gameplay state, not a post-release ball staging operation.
- Release: tick13, player z2, H2.5 maps via `flightHeightFromHand` to ball z3. The capture applies candidate `vz=.65` exactly once at the tick13 release boundary; production target-relative vx/vy equations produce right/left vx1.0834/1.2415 and vy-.8892 toward the rim.

The actual gameplay set at `gameplay/rendered-courty95/report.json` stepped `window.jamverse.tick` continuously. The ball is aligned to the track while carried through tick12, then advances from the candidate launch solely under `integrateBall`; no flight samples or screenshot-time ball coordinate edits are used. Both directions clear the release to ownerless `shot`, retain Leo as last touch, and score3–0. The report has 24 captures across both facings, ticks13/14/16/19/23 and score completion at100%/120%, with zero browser errors.

Visual review: tick13 ball meets Leo's raised fingers; tick14 stays on the release edge; tick16 separates on the arc; ticks19/23 stay fully within the court viewport. At courtY95, Leo's feet remain visible in tick23 and score-completion captures at120%; courtY100 was rejected previously because it cropped her feet. Candidate02's courtY90 frame nearly clipped the ball at120%, so this nearby court position is retained for the reviewed capture. The frame itself and source/rig did not change.

Static pre-release selector/mirror evidence for this vector is in `native/` (48 captures) and `native/report.json`. Exact candidate vectors are repeated there. No ImageGen prompt or generation ID applies; this lane changes only the athlete-specific separate ball track/release profile.
