# Independent integration review — J.128 Krios `receive`

## Verdict: approved

The manifest registers the accepted four-frame Krios receive atlas (`krios-receive-right.webp`) with four unique reviewed frame hashes and accepted source/ball-track provenance. Runtime `athleteBallTracks.krios.receive` matches the reviewed track exactly: height `[1.1,2.0,2.1,1.2]`, forward `[5,9,9,5]`. The catch anchor is receive frame2 at tick4.

I reviewed the 20 current Jam Stage captures and report at `attempt-02/native/`. The fixture uses one normal Flint-to-Krios teammate pass and advances through `jamverse.tick`/`stepMatch`; it does not teleport players or ball coordinates. The renderer selects the Krios receive atlas in all captures. It selects frame2 at tick4, with `flip:false` facing right and `flip:true` facing left. At that tick, the ball has transferred from an ownerless pass to Krios, the catch event is emitted at `receiveStartStep + 4`, and ownership remains with Krios through receive ticks5 and7.

Both facing directions were captured at 100% and 120% zoom. Screenshots show the airborne ball meeting Krios's extended hands, then settling at the chest catch and secure poses. His horns, beard, uniform, complete limbs and baseline remain legible. The ball is runtime art separate from the transparent athlete sprites. All four gameplay runs report no browser errors.

The gameplay capture predates manifest integration and injects the candidate atlas/track into the page to test it. The checked-in manifest and runtime vector now match that exact candidate; `tests/captain-track-integration.test.js` verifies frame selection/mirroring, vector values, atlas hash and the captured catch evidence.
