# Kraken `shoot` gameplay review — track attempt35

**Disposition: ACCEPTED.** This is the approved Kraken J.07 `shoot` ball track and live-gameplay framing.

## Candidate

- Source: `kraken-shoot10-attempt01-generated-raw.png`, ImageGen generation `exec-20014507-d570-42f5-9ad7-6c2f9e4c6b03`.
- Reviewed cleanup: ten distinct right-facing poses, 5×2 runtime atlas, 80×96 cells, transparent background, common baseline y=94. Cleanup and source reviews are linked from the parent candidate `REVIEW.md`.
- Atlas candidate: `../../../kraken-shoot10-attempt01-runtime-candidate.png`; copied losslessly to `public/assets/animation/kraken-shoot-right.webp` for production registration.
- Track attempt35 uses the attempt30 low arc: height `[1.1,0.95,1.25,1.6,2,2.25,2.15,1.9,1.15,1.05]`, forward `[4,5,4,3,1,4,5.5,4.5,5,5]`, `releaseVz: 0.46`.
- Shooter is placed at x142/right and x58/left, y90. Current renderer's zoom-aware shot pan is 16px at 120%; a direction-relative +10 world camera focus offset frames the rim at release.

## Review findings

- Ten authored frames selected in order at ticks `[0,3,6,8,10,13,14,16,19,23]` at 100% and 120% zoom for both facings. Left-facing correctly selects mirrored art.
- The actual simulation releases at tick13 with `ownerId: null`, `lastTouch: "kraken"`; the ball remains separately simulated and scores without post-release state writes.
- All four runs make a three-pointer. Right-facing Kraken is team0 and scores `[3,0]`; left-facing Kraken is team1 and scores `[0,3]`. The team labels and scores in the HUD agree with the report.
- At 120%, the ball clears the fixed scoreboard/event banner; the hoop stays in-frame at release and late flight. Contact at release is visually legible. Kraken's feet and ground shadows remain inside the viewport, including the lower margin.
- 72/72 capture paths are unique and their hashes match. There are no browser errors or failed requests.
- Independent reviewer: `kraken_shoot_review`, pass after correcting an initial misread of the home/away scoreboard order.

## Rejected and superseded trials

All earlier ball-track, player-position, zoom-pan and camera-offset attempts remain preserved in sibling attempt directories. Attempt31's high arc clipped shot-stage framing, attempt33 missed in both directions, and attempt34's release framing left the rim too close to the screen edge. Attempt35's +10 offset fixes the side crop while retaining the score, contact and full-frame checks. Other exploratory attempts remain evidence only. No source drawings were altered or synthesized during track calibration.

## Evidence

- Full capture state, candidate vectors, score outcomes and screenshot hashes: `report.json`.
- 120% release: `left-zoom120-tick13-frame05.png`, `right-zoom120-tick13-frame05.png`.
- 120% late flight: `left-zoom120-flight-sample010-tick23-shoot-frame09.png`, `right-zoom120-flight-sample010-tick23-shoot-frame09.png`.
- 120% score completion: `left-zoom120-score-complete.png`, `right-zoom120-score-complete.png`.
- HUD score attribution was checked against the left-facing run's configured home/away labels and the recorded `[0,3]` score array.

## Registered normal-loader confirmation

After registration, attempt36 repeated the same four runs with `NORMAL_LOADER=1`; the harness did not inject an atlas or ball track. The normal manifest selected `./public/assets/animation/kraken-shoot-right.webp` in all runs and mirrored it only when facing left. The integrated `athleteBallTracks.kraken.shoot` released at tick13 and scored `[3,0]` for team0 or `[0,3]` for Kraken's team1 in the reversed home/away setup. 72/72 additional capture hashes matched, with no browser errors or failed requests. See sibling `../../track-attempt36/offset-+10.0/report.json` and its release/late-flight captures.
