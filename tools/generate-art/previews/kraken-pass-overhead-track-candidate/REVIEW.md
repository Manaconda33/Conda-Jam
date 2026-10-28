# Kraken J.07 overhead-pass track candidate review

Status: **Attempt 01 rejected for hand alignment and visible flight. Attempt 02 is a candidate for independent track review only. No runtime asset or track was registered.**

The harness in `tools/capture-kraken-pass-overhead-track-candidate.py` uses the current Chromium Jam Stage route and the v2 atlas that independently passed cleanup review: `tools/generate-art/previews/kraken-pass-overhead6-attempt02/kraken-pass-overhead6-attempt02-runtime-candidate-v2.png` (SHA-256 `21b8433d251adc476bc5feabe6738a8bf294f9543c8e450614eb9646a8b9e4a4`). The six frame starts `[0,2,5,7,8,10]` include the canonical frame-3 release at tick 7 and post-release frames 4–5. Each attempt records all six frames × both facings × 100%/120% (24 screenshots), selector frame/facing behavior, and a normal simulation pass/catch check.

The in-page manifest override temporarily sets `reviewed:true` so the unregistered candidate can be selected by the production sprite selector. This is harness-only and is not an asset review or production registration. Right-facing art is selected for both directions, with `flip:false`/`flip:true` respectively.

## Attempt 01: rejected Krios baseline

Track used (Krios J.128 accepted candidate):

- Heights: `[0.8, 1.1, 2.3, 2.3, 2.85, 1.4]`
- Forward: `[9, 2, 5, 7, 13, 9]`
- Tick-8/tick-10 visual samples: `[16, 5.2]`, `[24, 6.5]`

All 24 static captures selected the expected candidate frame and facing. The pass action released at simulation tick 7. However, the offsets did not fit Kraken's artwork: at frame 0 the ball sat too far right and low of his abdomen gather; at frame 1 it was below the raised hands; at frame 2 it was too high relative to the hands behind the crown; and at frame 3 it sat above the release fingertips. More seriously, the tick-8 and tick-10 samples at heights 5.2/6.5 were outside the visible playfield under the fixed HUD. Reject this vector for Kraken.

Normal stepMatch pass runs (both facings × both zooms) did reach the intended teammate and preserve the 0–0 score, but this does not rescue the visible track mismatch. Evidence: `attempt-01/native/report.json` and its 24 frame captures.

## Attempt 02: Kraken-adjusted candidate

Candidate track:

- Heights: `[1.05, 1.85, 1.75, 1.9, 2.1, 1.2]`
- Forward: `[5, 3, 4, 6, 10, 14]`
- Tick-8/tick-10 visual samples: `[10, 2.1]`, `[15, 2.3]`

I inspected the 120% captures for both facings and the 100% captures for both facings. The ball now sits near Kraken's abdomen gather at frame 0, overhead hands at frame 1, crown windup at frame 2, and release fingertips on frame 3/tick 7. The two post-release samples remain on screen at ticks 8 and 10 and advance away from the hands. No sprite is missing or falling back; 24/24 selector records have the expected frame and left-facing flip. No browser or request errors were recorded.

Four normal Jam Stage `stepMatch` runs used Kraken's actual `pass-overhead` action at tick 7. At the release event, the harness positioned the ownerless ball at the candidate frame-3 offset (height 1.9, forward 6) and let normal simulation resolve the pass. Marin Dusk caught it on step 28 in both facings and zooms, the ball owner changed to `marin-dusk`, and the score remained 0–0. This checks the game handoff and receiver catch; because the clip is not registered, normal pre-release sampling still uses the current generic fallback. Candidate-specific pre-release track values were reviewed in the 24 static captures.

Evidence: `attempt-02/native/report.json`, `gameplay-release-facing±1-zoom100/120.png`, `gameplay-catch-facing±1-zoom100/120.png`, and the six `frame*-{right,left}-zoom{100,120}.png` sets. The report has 24/24 captures, four successful receiver catches, correct selectors/mirroring, unchanged score, and no browser/request errors.

**Disposition:** Attempt 02 is ready for an independent ball-track review. Keep it unregistered until that review and full production clip validation are complete.
