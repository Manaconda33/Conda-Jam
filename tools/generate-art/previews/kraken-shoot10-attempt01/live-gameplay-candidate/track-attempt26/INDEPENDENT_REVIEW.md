# Kraken J.129 Shoot Attempt 26: Independent Gameplay Review

## Verdict: trajectory and score pass; 120% framing blocks acceptance

Reviewed all 72 production Jam Stage captures across both facings and 100%/120% zoom, including all ten authored frame starts, release tick 13, continuous flight samples, and score-complete captures. The report records 72 unique capture paths, no uncaught browser errors, and no failed requests.

The attempt uses `releaseVz: 0.46` as recommended. Release at tick 13 transitions from player-owned/carry state to a shot at z=3.21 with post-tick `vz=0.434`; the ball remains visible during the sampled flight, peaks around z=6.38, and descends. All four runs complete as a made three: right-facing `[3,0]`, left-facing `[0,3]`. The setup remains x=142/58, y=90. Thus this fixes attempt25's excessively high default arc and preserves the 3-point result.

The ten shoot frames progress coherently through set, lift/jump, release, and follow-through. At tick 13 the separately rendered ball is visibly at the raised shooting hand; following frames show a consistent release and trajectory, with ground shadow retained. The shot preview atlas gives way to the registered Kraken idle/celebrate artwork after its authored range; no Krios-looking celebration was observed in these attempt26 score-complete captures. Kraken identity, uniform palette, facing flip, and player scale remain visually coherent through the reviewed sequence. The report confirms shoot frame starts `[0,3,6,8,10,13,14,16,19,23]` at every facing/zoom.

## Blocking issue

At 120% the fixed hoop is cropped by the horizontal viewport edge in both facings: the left-facing rim/backboard is cut at the left edge and its mirrored right-facing counterpart is cut at the right edge. The ball is still on screen at the latest authored shoot frame, but sits immediately below the top HUD at 120%, leaving little margin. At 100% the full hoop and a comfortable ball/HUD margin are visible. Do not move the hoop or alter the 3-point setup to hide this; this candidate is not yet acceptable for both zoom levels.

## Next screening step

Keep attempt26's track, release vector, fixed hoop, and scoring setup unchanged. Test a zoom-aware camera focus/viewport framing adjustment that keeps the target rim fully in-frame at 120% in both directions while preserving the complete flight path below the HUD; then rerun all four facing/zoom cases and regression-check other registered shots such as Reed. The previous attempt21 visual evidence remains only a lead because it was captured with the temporary `flightScale=0.8`; attempt26 is current-renderer evidence and confirms the low-arc recommendation under production `flightScale=1.62`.
