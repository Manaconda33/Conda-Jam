# J111 Leo `layup-reverse` attempt 03 review

## Verdict: rejected as candidate evidence

The recapture corrected the framing and used the real `stepMatch` progression, but the capture script did not successfully inject the declared candidate track into the served animation module. The report's `candidateTrack` field therefore did not describe the track actually sampled by simulation. Captures show the built-in default hand track, so they cannot accept the proposed candidate values.

The one-time diagnostic fixture did keep Leo centered at court y=90 and removed other athletes from the rendered frame. The simulation progressed without a pause overlay and changed ball ownership from Leo-held at tick 11 to an ownerless shot at tick 12. Selector metadata correctly chose the candidate atlas for both facings. Those points validate the framing and simulation harness only.

## Correction

Attempt 04 corrected the in-page module interception so it adds the candidate track after the existing Leo track initialization. Attempt 03 PNGs and report are retained unchanged as rejected evidence.
