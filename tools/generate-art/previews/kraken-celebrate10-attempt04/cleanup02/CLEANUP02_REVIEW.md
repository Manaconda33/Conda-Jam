# Kraken J.07 `celebrate` attempt04 cleanup02

**Verdict: accepted and registered.**

Cleanup02 keeps all ten original attempt04 poses and supersedes cleanup01's undersized 76px figures. Kraken's registered idle occupies 92px vertically, so each cleanup02 figure is resized uniformly to 88px high and aligned to the same baseline y=94. Each frame uses an 88×96 cell, leaving at least four clear pixels beside the broadest arms-open pose, six above the hair, and two below the soles. All ten frames are distinct, full-body, and ball-free; the atlas is 880×96. The original source RGB and alpha are retained within a 1.5 source-pixel edge fringe, with no new shading or body redraw.

Independent source review accepts cleanup02 for gameplay trials. A 40-capture candidate-injected score review passes all frame starts, facings and zooms. Then a separate 40-capture normal-loader scoring review loads the registered asset from `public/assets/animation/manifest.json`, passes both facings at 100%/120% zoom, confirms the two-point score and dead/unowned ball, and shows no Krios fallback, crop, HUD collision or browser error. The reviewer finds the brighter, bolder outlines coherent with Kraken at court scale. See `../scoring-transition/normal-loader-review/INDEPENDENT_NORMAL_LOADER_REVIEW.md`. The clip is registered and accepted.
