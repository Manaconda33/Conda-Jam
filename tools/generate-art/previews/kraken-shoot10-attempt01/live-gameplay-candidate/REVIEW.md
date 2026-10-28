# Kraken J.07 `shoot` live gameplay track review

## Candidate dispositions

- Track attempt01 — **REJECTED**. At 100%/120%, both facings, the carried ball sat below Kraken's raised hands at takeoff tick6 and early ascent tick8; it was also too far forward in gather/dip. Shot timing and scoring worked, but visual hand contact did not.
- Track attempt02 — **REJECTED**. It corrected the gather/dip spacing but raised the ball too far above the hands at ticks6 and8. All screenshots and its exact vector remain in `track-attempt02/`.
- Track attempt03 — **SUPERSEDED**. The source/cleanup-approved frame track aligned at contact, but its late flight left the visible stage and the forced reverse-facing shot crossed the P1 marker.
- Track attempt04 — evidence-only recapture with collision-free names; independent review rejected production readiness because the same reversed team setup kept the ball out of view during flight and crossed P1.
- Attempts05–09 — **REJECTED**. These trials tested lower release velocities and mirrored team/court setups. Some made shots, but attempts05–07 still clipped flight or the athlete; attempts08–09 used edge positions that clipped the actor/ball. Reports preserve the exact inputs, four-run screenshots and shot outcomes.
- Track attempt10 — **REJECTED for full-flight acceptance**. It keeps the attempt03 contact vector, sets `releaseVz=0.60`, and mirrors Kraken's team/hoop and court position with facing (right/home x130; left/away x70; y100). All four runs score and early flight is visible, but the ball leaves the play area near its later apex. See the dated independent review in `track-attempt10/`.
- Track attempt11 — **REJECTED**. Lowering `releaseVz` to 0.52 and moving inward kept all four shots scoring, but 120% left-facing late flight remained offscreen.
- Track attempt12 — diagnostics-only recapture of attempt10; recorded the stage camera state and confirmed normal `stagePreview` projection/camera movement, with no hidden screenshot overlays. The same high apex remained.
- Track attempt13 — **REJECTED**. `releaseVz=0.46` reduced the peak, but mirrored x58/142 positions clip the athlete at the left edge. It made all four shots. Unique screenshot/hash checks pass.
- Track attempt14 — **REJECTED**. Keeping x58/142 and `releaseVz=0.46` but moving both mirrored shooters to y50 brings the athlete fully into the 120% frame. The exact late idle samples at 120% still place the ball beyond the left/right screen edges as it approaches the fixed hoop (left x13.24 at tick19; right x186.76). It scores in all four runs, but the y50 setup changes the game event to a 2-pointer and does not fix visibility. All 72 capture paths are unique and all file/hash/state checks pass. Full evidence is in `track-attempt14/`.
- Track attempt15 — **REJECTED**. Tried `releaseVz=0.46` at y100 with faster camera tracking after release. The camera shows the hoop at 120%, but teleporting the shooter to x142/58 while leaving the camera centered at midcourt still clips the actor before release, and the high ball is behind the HUD. All four runs scored. Evidence is in `track-attempt15/`.
- Track attempt16 — **REJECTED**. Extended the faster camera follow into the shooting clip, but the same direct-to-shot teleport left the camera too far from the shooter during early poses. Ball flight remained under the HUD at apex. All four runs scored. Evidence is in `track-attempt16/`.
- Track attempt17 — **REJECTED**. Lowered stage shot flight scale to 1.2. With the original 1.62 scale's retained release-elevation correction, the ball remained partially occluded at the HUD edge. Evidence is in `track-attempt17/`.
- Track attempt18 — **REJECTED**. Moved the mirrored shooter to y90 (preserving a 3-point shot) and lowered shot flight scale to 0.95. The late ball moved below the scoreboard but still overlapped the fixed event banner at 120%. Evidence is in `track-attempt18/`.
- Track attempt19 — **REJECTED as a capture setup**. At y90 and shot flight scale 0.8, the full late ball is visible, but the harness still teleported the player from center court without first following the carried ball. This caused early actor cropping and was not representative of a shot-ready live camera state. Evidence is in `track-attempt19/`.
- Track attempt20 — **PASS candidate**. The harness now seeds the camera to the steady carried-ball shot focus computed by `stageCameraFocusX` before triggering the action. At x142/58, y90, this corresponds to cameraX 163.545/36.455. The candidate makes a 3-pointer in all four right/left × 100/120 runs, keeps the athlete in frame at release and shows the complete late-flight ball near the fixed hoop without P1 overlap. The all-four-run output has 72 unique captures with matching file hashes and no browser errors. Evidence is in `track-attempt20/`.
- Track attempt21 — **PASS candidate and preferred evidence**. Repeated attempt20 with the existing baseline camera follow speed, removing the exploratory speed increase. The same four runs make 3-pointers, and the ball remains visible through the sampled late flight at both zooms and facings. The camera follows from the seeded steady shot approach naturally. Evidence is in `track-attempt21/`.

## Most recent candidate vectors

```json
{
  "height": [1.1, 1.4, 1.9, 1.9, 2.0, 2.25, 2.15, 1.9, 1.15, 1.05],
  "forward": [2.8, 3.5, 4, 3.5, 1, 3.5, 5.5, 4.5, 5, 5],
  "releaseVz": 0.46
}
```

Attempt21's exact vector, mirrored setup, camera seed, per-step state, capture hashes and score results are in `track-attempt21/report.json`. Prior attempts and rejected evidence remain alongside their reports.

## Gameplay evidence

- Four live Jam Stage runs: right/left facing × 100%/120% zoom, current Jam Stage court. Candidate trials use reflected homeside/awayside positions so each live shot travels toward its assigned hoop. The direct setup places the actor in a shot-ready position; the camera is initialized to the equivalent steady carried-ball focus before shooting, avoiding an artificial midcourt-to-shooter camera lag.
- 10 distinct source frames observed in order at canonical ticks `[0,3,6,8,10,13,14,16,19,23]`; selector source/frame/mirror assertions passed.
- Actual simulation released frame5 at tick13 in every run. At release: `mode=shot`, `ownerId=null`, `lastTouch=kraken`, `attemptId=shot-1`.
- After release the harness performs no ball-position writes. The game advances the actual ball flight; all four deterministic attempt21 trial runs made and completed the three-point score. Trajectory samples, score-complete captures, and browser/network error lists are in `track-attempt21/report.json`.
- Attempt21 has 72 capture records and 72 unique paths, including distinct `shoot` and `idle` samples at repeated animation ticks. Its report verifies file existence and recorded screenshot SHA-256.
- Candidate image and track were supplied by temporary in-memory browser route overlays only. No manifest, core track, generated registry, source art, simulation, or production asset registration was changed. Renderer work is limited to the stage's rendered shot-height multiplier in `src/render/jam-stage.js`; it does not change simulated ball coordinates, release timing, or the fixed HUD. The review harness seeds the camera only before shot input to match the steady camera state at a live shot-ready position.

## Current blocker

The previous independent rejection was caused by two separate capture/rendering conditions: an unseeded camera in the harness (which teleported the actor into the 3-pointer zone without following it) and excessive stage-only shot-height scaling that pushed the true ball behind the fixed HUD. Attempts16–19 isolate those factors. Attempt21 corrects the capture setup and renders the ball lower in stage presentation while retaining the simulation's real trajectory and score; the actor, hand contact, P1 marker, late ball, and fixed hoop are visible in the reviewed 120% captures at both facings. The independent attempt21 review passed: all four runs score, contact/release/late-flight framing passes, and file/hash integrity is clean. No candidate is registered yet.
