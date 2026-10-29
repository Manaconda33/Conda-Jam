# Independent Jam Stage candidate review — J.128 Krios `block`, attempt02

**Disposition: gameplay timing and selector checks pass, but keep production registration pending one left-facing frame0 recapture.** This is candidate-injected evidence and is not final production acceptance.

The report records 16 captures on the current Jam Stage court at courtY=90, across right and left facing and 100%/120% zoom. Candidate mode injects the atlas into the in-memory manifest before app startup. For all four runs, selected candidate frames and mirror flags match the expected clip frames. The core defensive block input starts the clip; frame0 appears at post-input tick1, takeoff frame1 at tick2, apex frame2 at tick5, and landing frame3 at tick8. There are no browser errors. Krios remains without the ball; the ball remains dead with no owner throughout.

Visual review of the contact sheet and full-sized captures finds the right-facing poses and all later left-facing poses readable, anatomically complete, separated from the hoop/UI, and fully inside the viewport. No ball is painted into the art. The high arm remains visible at apex in both zoom levels.

**Recapture required:** both left-facing frame0 screenshots (`left-frame0-tick1-zoom100.png` and `left-frame0-tick1-zoom120.png`) show an unrelated large fallback/legacy sprite rather than the candidate Krios crouch. Left-facing frames1–3 render the candidate correctly. The reports' explicit selector check passes, so the likely cause is the production atlas image not having finished loading before the first render; this needs confirmation by preloading/waiting for the app's actual atlas image and recapturing. Do not use this pair to claim fully mirrored appearance or approve registration.

Report: `tools/generate-art/previews/j128-krios-block-candidate/attempt-02/native/report.json`. The earlier attempt01 capture set is retained separately; it also had an unsuitable courtY=50 framing for this review.
