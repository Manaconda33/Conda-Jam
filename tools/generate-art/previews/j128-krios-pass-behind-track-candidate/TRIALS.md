# J128 Krios `pass-behind` ball-track candidates

The candidate atlas is `public/assets/animation/krios-pass-behind-right.webp`. The six-frame action releases on frame3/tick7. Every successful capture uses a real Jam Stage match and `stepMatch`; a temporary in-page export/injection adds only the candidate track to the served animation module. Production files, manifest, and tests are untouched.

## Attempt01 — rejected capture batch

Track H `[1.05,1.0,0.9,1.25,1.25,1.2]`, F `[5,2,-5,-14,-18,-22]`. Captures landed on idle after the 13-tick action at step14, so selector validation rejected the batch. Partial screenshots and the failure note are preserved in `attempt-01/`.

## Attempt02 — incomplete receiver verification

Same vectors as attempt01. The uncluttered candidate action captures validate 44 frame selections, both facings and both zooms, and show ball ownership clearing at tick7. The simulation window was too short to reach the receiver, so this was not eligible for acceptance. Full report and captures are preserved in `attempt-02/native/`.

## Attempt03 — initial gameplay candidate

Same vectors. The simulation continued through teammate catch at step44 (100% and 120%, both facing directions). Krios stays on frame3 through the separate-ball release; pass target is Flint Rooker. This attempt’s native screenshots include other stage players as context and are retained. See `attempt-03/native/report.json`.

## Attempt04 — gameplay candidate, screenshots rejected

- Height: `[1.05,1.3,1.2,1.25,1.25,1.2]`
- Forward: `[5,2,-3,-9,-12,-8]`
- Release: frame3 / tick7. The separate ball is carried through tick6 and changes to ownerless `pass` with `targetId=flint-rooker` on release.
- Teammate catches at simulation step38, in both facings and at 100%/120%; catch is recorded in `attempt-04/native/report.json`.
- The `stepMatch` gameplay and receiver catch passed in both facings and both zoom settings.
- The capture setup injected the manifest after the initial match but did not restart Jam Stage before rendering; therefore the production renderer kept its previous atlas image map and drew fallback artwork. The direct selector check used a separately injected image map, so its pass did not validate the canvas artwork. Keep the report and screenshots as rejected visual evidence.

The same gameplay-validated vectors are being recaptured in attempt05 after restarting Jam Stage with the candidate manifest loaded. Only attempt05 can supply visual track approval.

## Attempt05 — candidate atlas loaded in the production renderer, review pending

Same candidate vectors as attempt04. The capture now restarts Jam Stage after the temporary candidate manifest and track are installed, so the production image map loads and displays `krios-pass-behind-right.webp` during rendered gameplay. The native report has 64 screenshots, expected `flip` in both facings, no pause overlay or browser errors, and the same actual receiver catch at step38. Hand-contact crops are preserved as `attempt-05/native/release-contact-{right,left}-zoom120.png`. Independent review is pending before parent integration.
