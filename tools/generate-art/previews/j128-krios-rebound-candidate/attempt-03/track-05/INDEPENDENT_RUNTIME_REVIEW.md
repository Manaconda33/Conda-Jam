# Independent runtime review — J.128 Krios rebound attempt03, track05

**Result: PASS for gameplay trials only.** Registered-runtime review remains required before production acceptance.

Reviewed all 20 current Jam Stage captures in `native/`: five frame starts (ticks 0, 2, 4, 5, 7), right and mirrored left facings, and 100%/120% zoom. The reviewed candidate atlas SHA-256 is `85250ba5f2fff647f9ec599b7547daa305ee6c866182f960f8ac82160cba08b9`. Its Krios-specific candidate track is height `[1.1,1.7,2.0,2.1,1.3]`, forward `[4,3,1,0.5,1]`.

The ball is visibly between Krios's empty raised hands at frame3/tick5 in both facings and zoom levels. At frame4/tick7 it is held against the chest/hands. The earlier track02 float is corrected. The x=14/186 actor placement keeps Krios clear of the backboard and supports through the catch; no visible clipping, fallback, HUD obstruction, or green matte spill remains. Opaque green-dominant pixels in the candidate atlas: zero, measured after widening channels to signed integers to avoid uint8 overflow.

The report verifies the actual Leo miss, `Rebound!` loose-ball flight, Krios catch at tick5, Krios ownership through recovery, correct selector frame and mirror state for all 20 captures, zero hand-point delta while carrying, and no browser errors. Actors and ball are positioned only once before the shot; subsequent movement is from normal simulation ticks, with no per-tick teleportation. No ball is baked into the athlete art.

This set is a candidate gameplay trial: `runtimeIntegration` is false and the candidate atlas was injected in-page for review. The clip and track are not production accepted until the registered asset is reviewed through the normal loader.
