# J.128 Krios `alley-oop-power` candidate track attempt 05

Status: **visual track review passes for continued candidate review only**. This does not register, accept, or publish the clip or track.

## Provenance and capture method

- Candidate artwork: `../../krios-alley-oop-power15-attempt01-runtime-candidate.png` (SHA-256 `6b1322b75eee484319558b086efefc2bcfbb5b481005b5cedd7f15b3901a7a10`).
- Runtime used the actual current Jam Stage renderer and camera (`cameraShim: false`). The atlas and candidate Krios ball vector were injected in memory only; production registries and manifests were not changed.
- The capture harness started a live Scoria Rams / Blackthorn Court Kings match, threw a real turbo alley-oop pass from teammate Flint Rooker, and advanced ordinary game ticks.
- 60 PNGs cover 15 sampled ticks, both facings, and 100%/120% zoom. Four runs × 15 captures; zero uncaught browser errors.
- Capture report: `report.json`; exact vectors and every sampled frame/state are retained there.

## Candidate athlete-specific vector

Frame-indexed `height` and `forward` values injected for Krios only:

```json
{
  "height": [1.37, 1.71, 2.22, 2.16, 1.96, 0.65, 0.55, 0.70, 0.45, 1.60, 0.70, 0.64, 0.39, 0.37, 0.65],
  "forward": [9.50, 10.23, 7.67, 5.12, 8.40, 2.50, 0.00, 7.50, 10.00, 2.50, 5.12, 1.10, -2.19, -1.10, -2.92]
}
```

The visual correction targeted the gather/power phase: frames 5–6 keep the catch/gather ball on Krios, frames 7–8 follow the extended arm, and frame 9 moves the ball to the raised dunk hand while keeping it below the HUD. Mirroring retained the same hand relationship in the opposite direction. Review samples: `right-frame05-tick10-zoom120.png`, `right-frame07-tick14-zoom120.png`, `right-frame08-tick17-zoom120.png`, and both `*-frame09-tick19-zoom120.png` files.

## Gameplay checks

- At tick 10 Krios owns the carried ball; the real catch event has fired. The report records zero carried-ball position delta against the injected Krios vector (up to floating-point precision).
- No score is recorded in any capture before tick 21.
- At tick 21 the action is released; the ball is in dunk mode at `(x=188.83 or 11.17, y=50, z=3)`, matching each facing's rim. The capture shows rim contact.
- At tick 23 the intended team scores exactly 2; tick 30 remains in the landing/recovery portion with the score stable.
- Both directions select the candidate atlas, use the expected horizontal flip, and render at both requested zoom values. No fallback or browser errors were recorded.

## Rejected trials retained

- Track attempt 01 used the canonical projected hand centers. On visual review after the production camera correction, its gather/power ball position was too high relative to the candidate's posed hands.
- Attempt 02 lowered the catch/gather points but left frames 7–8 high/forward relative to the animated arm.
- Attempt 03 improved the reaching arm alignment at frame 8; frame 9 still placed the ball away from the raised hand.
- Attempt 04 moved frame 9 to the raised hand but clipped the ball into the top HUD at tick 19, so it was rejected.

Each trial's full vector, report, and 60 captures remains in its `track-attemptNN/` directory. Attempt 05 is the best reviewed candidate; it still requires independent review and normal asset-registration validation before any acceptance.
