# J.104 Leo `shoot` track attempt07 — accepted calibration candidate

This is the final candidate for parent integration. It keeps attempt06's visually accepted hand track and captures the actual rim-directed trajectory separately for both facings. The simulation release is tick13 with `player.z=2.0`; no athlete art was modified and the ball remains a separate sprite/object.

Track vector:

- Height: `[0.95,1.1,2.1,2.1,2.7,7.5,6.5,4.5,2.1,1.05]`
- Forward: `[6,7,6.5,4,3,4,4,4,6.5,5.5]`
- Release at frame5/tick13, H7.5; `flightHeightFromHand(7.5,2.0) = 12.1667`.
- Release/flight samples: tick13 right `[4,12.1667]`, left `[-4,12.1667]`; tick14 right `[4.584,13.3301]`, left `[-3.3585,13.3360]`; tick16 right `[5.752,15.5790]`, left `[-2.076,15.5968]`; tick19 right `[7.505,18.7573]`, left `[-0.147,18.7929]`; tick23 right `[9.842,22.6311]`, left `[2.5,22.6904]`. These are absolute horizontal offsets from Leo's staged court point, so the left-facing test still follows the actual team0 target rim to the right.

Visual review: the frames show the ball close to Leo's two-hand gather at tick10 and tracking into the release; at tick13 the ball meets the raised hand for both facings; tick14 separates above the fingers; ticks16/19/23 continue smoothly toward the target. Checked at 100% and 120% zoom on current Jam Stage. At 120%, the right-facing tick13 and tick14 captures are `native/frame05-tick13-right-zoom120.png` and `frame06-tick14-right-zoom120.png`; mirrored equivalents are available for left. Tick14 left-facing moves toward the right-side team0 rim instead of following the incorrect mirrored flight path retained in attempt06.

The capture report contains 48 native captures (10 clip-frame starts plus ticks11/12/13/14/16/19/23), both facing directions, 100%/120%, production selector and expected flip for every frame, current Jam Stage renderer, and no browser errors. At tick12 the ball is carried by Leo; tick13 is `mode=shot`, `owner=null`, and `lastTouch=leo` in capture state. The actual simulation check with candidate launch inputs confirms a scored three in both facings, with the owner cleared and last-touch retained; see `gameplay/release-and-score.json`.

Provenance: no ImageGen call was made for this track calibration, so there is no new generation prompt/ID; the accepted Leo shooting atlas is unchanged. Exact capture script and vectors: `tools/capture-j104-leo-shoot-track.py`, `ATTEMPT=7`, `TRACK_JSON` and `RELEASE_JSON` values recorded in `native/report.json`. Attempt04's synthetic staging, attempt05's premature high gather, and attempt06's mirrored left flight remain preserved with their reviews.
