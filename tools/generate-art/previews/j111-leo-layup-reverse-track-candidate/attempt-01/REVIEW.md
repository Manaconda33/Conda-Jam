# J111 Leo `layup-reverse` track candidate 01 review

## Verdict: reject for runtime use; diagnostic candidate only

The selector/capture harness confirms that the intended 8-cell atlas is selected for every sampled pose, the left-facing selection flips, and the browser reports no uncaught errors. This is useful technical evidence, but the output does not establish an acceptable gameplay ball track and is not suitable for registration.

## Review findings

- All 40 PNGs show the game's centered **PAUSED / GAME FROZEN** overlay across the player and ball. This materially blocks the hand, ball, and torso contact points needed for visual review. The harness sets `s.pause=true` immediately before capture and leaves that state in place; `g.tick(0)` does not clear it. This is a capture defect, not an artwork defect.
- Captures are staged snapshots, not gameplay progression. The script directly assigns `p.z` from the hand-authored `Z` table and assigns the ball at each sample. It does not advance a layup through `createMatch`, normal animation selection/ticking, shot release, rim collision, or scoring. It therefore cannot verify timing, ownership transitions, or the release trajectory.
- The release sample at tick 12 is explicitly `[0, 0]`. At that sample the player has `z=1.802` but the ball is placed at court-level `z=0` at Leo's horizontal origin. The visible diagnostic frame shows the ball below the airborne player near the court, so this is not a credible hand release point. Tick 13's `[3, 2.5]` is likewise a manually placed follow-up point, not a measured or simulated trajectory.
- In the visible carried-ball samples, frame 2/tick 5 places the ball near Leo's right torso/arm, but the overlay prevents confirmation that the ball contacts the intended hand. The later gather/contact pose at frame 4 and release pose at frame 5 are obscured, so the key reverse-layup handoff cannot be approved.
- Left/right captures exist and their selector metadata is consistent (`flip` is false for right and true for left). However, because the capture is mirrored output from one candidate track and the hand/ball contact is obscured, facing-specific hand alignment is still unverified.

## Required next iteration

1. Remove the pause overlay from captures: keep the simulation running, or hide only the overlay after staging while retaining the normal production renderer. Capture a fresh light/clear court view at both zoom levels and both facings.
2. Exercise the actual gameplay path and record the real player height, clip tick, ball owner/mode, and ball world position at gather, takeoff, release, and scoring. Do not set the athlete's `z` from a synthetic table for acceptance evidence.
3. Calibrate carried-ball positions at each frame against Leo's hands. For the release frame, start at the actual release hand point (`x`/height relative to player plus the gameplay player height), then use a continuous shot trajectory with the real release timing. Keep the ball separate from the athlete atlas.
4. Verify both facings through catch/ownership, release, and shot outcome. Retain this attempt as rejected diagnostic evidence.

## Evidence reviewed

- `native/report.json` (40 captures; candidate track and release samples; selector metadata)
- `native/frame02-tick05-right-zoom120.png`
- `native/frame04-tick11-right-zoom120.png`
- `native/frame05-tick12-right-zoom120.png` and left-facing equivalent
- `native/frame06-tick13-right-zoom120.png`
- `native/frame07-tick17-right-zoom120.png`
- `../../../../../../capture-j111-leo-layup-reverse-track.py`
