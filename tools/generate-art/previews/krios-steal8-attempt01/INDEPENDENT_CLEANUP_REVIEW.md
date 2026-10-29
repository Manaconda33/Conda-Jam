# Independent cleanup/layout review — J.128 Krios `steal`, attempt01

**Disposition: pass for gameplay track/timing review only. Not production acceptance.**

I inspected the light and dark previews, 4×2 logical sheet, all eight keyed pose crops, 1024×96 runtime candidate and cleanup/layout reports, comparing them with the preserved raw source. Component extraction contains the raw cross-cell reaches without redrawing or synthesizing any pose. All eight source components remain complete, and each isolated crop preserves the entire figure. The raw RGB sheet remains separately preserved.

Pose order reads clearly at logical and native sizes: (0) low ready stance, (1) lane drive, (2) low swipe, (3) inward grab, (4) follow-through, (5) recoil, (6) wide recovery, (7) balanced ready finish. All eight cells have distinct hashes. The inward-grab hand in frame3 is a small empty C-shaped grip; close inspection shows no ball, sphere, seams, or other prop in any frame. The bright red rounded area is part of the hand, not an inserted basketball. No green pixels are visible on Krios.

All eight logical cells report at least 24px margins after the uniform 0.7981 layout fit. The native frames use one 0.26 source-to-runtime scale, nearest-neighbor resampling, and a shared y=94 baseline. Per-frame opaque bounds are nonblank and distinct; each cell retains transparent pixels around the figure. I measured zero opaque green-dominant pixels in the runtime candidate (`G>=50`, `G-R>=4`, `G-B>=4`). Light and dark composites show no visible green fringe or edge contamination. Native 128×96 readability is adequate for gameplay review, with complete horns, hands, boots and anatomy in every frame.

The cleanup report records the edge-connected green key, detached green island handling, local edge cleanup, RGB repairs, source bounds, margins and native layout. The logical/native previews preserve the same figures and order without redraw. Proceed to test the athlete-specific steal track and action timing in the current Jam Stage runtime, including both facings. Keep the clip unregistered until that gameplay review passes.
