# J128 Krios overhead pass track trials

Candidate artwork: `public/assets/animation/krios-pass-overhead-right.webp` (six original, reviewed poses). Canonical frame starts are ticks `[0,2,5,7,8,10]`; pass releases at frame3 / tick7. Each successful attempt captured all six frames at both facings and at 100% and 120% zoom on the production Jam Stage Scoria Rams court at `courtY=90`, for 24 screenshots. The harness verifies the production atlas/frame selection, safe mirrored flip, no browser errors, and separate ball ownership up to release.

All successful captures and JSON reports remain under this folder. Frames4–5 after release use staged ownerless pass-flight points, not a physics validation. Only the carried frames0–3 inform the hand track. Runtime registration and real receiver/flight testing remain pending.

| Attempt | Height | Forward | Result |
| --- | --- | --- | --- |
| 01 | `[1.45,1.9,2.8,3,2.85,1.4]` | `[9,10,8,10,13,9]` | Rejected. Frame1 was forward of the chest gather; frames2–3 floated above the overhead hands. |
| 02 | `[1.45,1.25,2.8,3,2.85,1.4]` | `[9,10,8,10,13,9]` | Rejected. Frame1 improved, but frame2 and release remained too high. |
| 03 | `[1.45,1.25,1.4,1.5,2.85,1.4]` | `[9,10,8,10,13,9]` | Rejected. Frame2/3 dropped below the raised hands. |
| 04 | `[1.45,1.25,2.2,2.4,2.85,1.4]` | `[9,10,8,10,13,9]` | Rejected. Frame2/3 height improved, but frame1 remained too far forward and frame2 still needed lateral adjustment. |
| 05 | `[0.8,1.1,2.2,2.4,2.85,1.4]` | `[9,2,5,10,13,9]` | Capture failed before any screenshot: Chromium reported `EncodingError: The source image cannot be decoded`. Preserved as a failed attempt; no report was generated. |
| 06 | `[0.8,1.1,2.2,2.4,2.85,1.4]` | `[9,2,5,10,13,9]` | 24/24 capture checks pass with zero browser errors. Manual parent/independent contact review is pending. |
| 07 | `[0.8,1.1,2.3,2.3,2.85,1.4]` | `[9,2,5,7,13,9]` | 24/24 capture checks pass with zero browser errors. Independent reviewer accepts the carried contacts and tick7 release at both facings and zooms. |

Attempt07 is the best visually reviewed native candidate, but remains unregistered. Independent review confirms frame0 ball beside Krios’s low near hand, frame1 at the chest gather, frame2 against the forehead-height hands, and frame3 overlapping the extended fingertips at release. The frame1→2→release progression rises smoothly, and both facings mirror consistently. The static post-release samples are not flight proof; runtime ownership, receiver contact, and actual pass-flight behavior still require gameplay validation before registration.

Capture harness: `tools/capture-j128-krios-overhead-pass-track.py` (dedicated local port 4225).
