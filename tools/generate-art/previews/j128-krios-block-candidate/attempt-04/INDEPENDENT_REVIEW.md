# Independent Jam Stage candidate review — J.128 Krios `block`, attempt04

**Disposition: clears candidate-injection gameplay/render review for production registration. This is not final registered-runtime acceptance.**

I inspected all 16 screenshots and the report across right/left facing at 100%/120% zoom on the current Jam Stage court (courtY 90). Candidate frame0 now renders Krios correctly in both facings and zoom levels; the frame0 fallback seen in attempt02 is resolved. The remaining poses also display the candidate atlas, with left-facing sprites mirrored consistently. Full-body silhouettes remain in the viewport; the apex hand is visible at 120%, and there is no overlap with the HUD or hoop.

Timing matches the `block` clip definition: post-input tick1 selects frame0, tick2 selects frame1/takeoff, tick5 selects frame2/apex, and tick8 selects frame3/landing. Candidate source and selected frame agree in every report row. There are no browser errors. Across all captures `hasBall` is false, ball mode stays `dead`, and owner stays null; the four poses contain no ball.

I inspected the harness implementation as well as the images. Attempt04 decodes the candidate atlas and inserts it into the app's actual `productionSpriteImages` map before the input/render loop, addressing the attempt02 loading race. The report's `captureMethod` now documents this decoded-image insertion, so both the implementation and capture metadata reflect the correction.

Candidate evidence is sufficient to register this atlas and proceed to actual registered-runtime verification. It does not complete Krios `block` until the registered manifest/core path is reviewed.
