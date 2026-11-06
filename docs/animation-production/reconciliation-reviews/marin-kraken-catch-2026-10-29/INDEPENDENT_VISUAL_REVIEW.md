# Marin-to-Kraken catch review

Date: 2026-10-29
Candidate source commit: `5cdef03fb40b5a9577f4f92d5e96d83323e3b572`
Review state: **visually accepted as a reconciliation candidate; combined baseline remains unaccepted**

## Capture procedure

`capture_review.py` launches the normal local game server and Chromium against the isolated reconciliation candidate. It starts the real Vesper Harbor Undertow vs. Chicago Condas match, selects Marin Dusk as Kraken's partner, loads the production manifest through the game's normal asset loader, and manually advances the simulation through the pass and receive sequence while the browser animation loop is disabled. It captures both Marin facing directions at camera zoom 100% and 120%.

The run contains 56 full-canvas frames: pre-pass, pass release, each simulation tick through Kraken's tick-4 receive grab, and three held-ball frames for each facing/zoom combination. The screenshots and structured selector/simulation traces are stored in `attempt-02/`; `capture-review.json` records the source commit, selectors, state, and capture filenames.

The browser's automatic `/favicon.ico` request is answered with HTTP 204 by the harness because this game repository does not provide a favicon. The harness does not alter sprite requests or game rendering. Console errors, failed requests, and HTTP errors after that browser-only route are all empty.

## Findings

- Marin uses the production shared-library palette variant (`libraryId: juniper-vale`, `classification: derived-palette`); Kraken uses his own accepted artwork (`libraryId: kraken`, `classification: original-authored`). Both selected sprites are matched to actual `drawImage` calls by the same image object and source crop, so the screenshot evidence comes from the normal renderer rather than injected sprite artwork.
- Marin's pass is released at pass tick 5. The ball stays ownerless and airborne through Kraken receive ticks 0–3, then possession transfers to Kraken at receive tick 4. The final incoming ball coordinate (`103.0091`, height `1.7399`) and carried coordinate at grab (`103`, height `1.74`) differ by about `0.0091` world units in the horizontal axis.
- Visually, the ball meets Kraken's raised hands at the receive grab in both facings. The three following frames keep the ball attached through the receive-to-held-ball transition without a visible jump.
- The visual read was independently repeated by a separate read-only reviewer, who confirmed both facings and zoom levels, the tick-4 catch, held-ball continuity, production selector matches, and zero browser/request errors.

## Rejected capture attempt

The initial capture set at the review directory root is retained as rejected evidence. Its simulation was paused correctly, but the game's pause overlay covered the court action. It is not used for acceptance. `attempt-02/` is the corrected run: simulation ticks are frozen by the disabled animation loop, while the game itself renders with `pause=false`.

## Limits

This is a focused fixed-tick review of the Marin-to-Kraken handoff. It does not verify longer gameplay after the catch or approve/pin the combined PR #6/#7 baseline. No gameplay artwork, manifest, or production branch was changed by this review.
