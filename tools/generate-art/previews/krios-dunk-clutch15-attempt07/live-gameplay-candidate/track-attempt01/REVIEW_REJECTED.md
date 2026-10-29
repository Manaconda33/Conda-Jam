# Track attempt01 review

**Verdict:** Reject; preserve all vectors and captures.

Candidate vectors are in `track.json`; live captures and actual simulation state are in `native/report.json` and the PNGs. The 56-capture run reached the expected dunk, score, and land events in both facings and zooms, but the visual hand contact failed:

- At ticks 10/12/14 (frames 5/6/7), the ball floated around Krios's face/head instead of the chest, low between knees, and rib positions.
- At frames 8/9 the ball remained too high and too far forward from the raised/cocked hand.
- The large change from frame9 (`forward: 7`) to frame10 (`forward: 12`) interpolated during tick20, visibly pulling the ball toward the rim before the production release at tick21.

Representative rejection captures: `native/right-tick10-frame05-zoom100.png`, `native/right-tick12-frame06-zoom100.png`, `native/right-tick14-frame07-zoom100.png`, and `native/right-tick20-frame09-zoom100.png`. All facings/zooms and full vectors remain preserved.
