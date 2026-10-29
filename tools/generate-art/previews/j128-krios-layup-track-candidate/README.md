# Krios J.128 `layup` ball-track calibration

All screenshots are from the current Jam Stage source in this worktree. Candidate attempts inject only the unregistered Krios layup atlas and track before startup; these are not registered-runtime acceptance evidence. The capture script warms the current court camera with normal carried-ball ticks and starts a fresh match per facing with Scoria attacking right and Blackthorn attacking left.

- `attempt-01`: harness validation ran beyond the clip and incorrectly expected the layup atlas after the expected transition to idle. Preserved as a harness failure.
- `attempt-02`: initial track `[.65,.9,1.2,1.65,2.35,2.1,1.2,.65]` / `[3,5,7,9,13,10,7,5]`; used a midcourt fixture, so its 3-point location does not establish near-rim layup contact.
- `attempt-03`: catalog-derived initial track at midcourt; same fixture limitation.
- `attempt-04`: invalid JavaScript ternary in the capture fixture; no capture completed.
- `attempt-05`: moved Krios to the attacking end but did not warm the camera; the athlete was outside the frame.
- `attempt-06`: tested whether camera metadata alone would fix framing; no camera warmup, so preserve as failed framing.
- `attempt-07`: right-facing contact/release/score looked promising, but independent review rejected it for left-facing home-team mismatch and stale events.
- `attempt-08`: first valid both-facing current-court trial, 64 captures / four runs at 100% and 120%, correct team/end/camera per facing, tick9 carried contact, tick10 single frame4 release, 2-point scores at tick49, clean events and zero browser errors. Track H `[0.9,1.15,1.55,2.05,2.25,2.0,1.1,0.7]`, F `[4,4.5,4.5,5,6,6,6,4]`, releaseVz `.45`. Independent review clears this candidate for registered-runtime validation only.

The required next validation is the same action on the actual registered manifest and production athlete track, with no injection, followed by a final independent reviewer check.
