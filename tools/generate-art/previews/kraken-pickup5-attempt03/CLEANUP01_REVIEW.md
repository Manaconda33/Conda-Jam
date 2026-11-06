# Kraken J.07 `pickup` — cleanup01 candidate review

**Status: visual trial prepared; independent review pending. Do not register.**

The raw five-figure sheet was separated by alpha>=32 connected components, ordered left-to-right rather than split at estimated cell positions. Each source crop preserves the original RGB channels and original alpha only for the principal figure plus its near-edge fringe. The sheet was normalized with one shared nearest-neighbor scale into five 80×96 frames. Candidate metadata records `baselineY: 90`; soles share that line and leave six transparent pixels below.

Automated layout results: five distinct source components, five unique pixel frames, uniform scale `0.1659090909`, visible frame sizes 70×71, 58×59, 55×50, 53×64, and 52×73, minimum L/R/T/B margins 5/5/17/6. The frame durations remain `[2,3,2,1,4]`, with frame3 as the tick7 grab. The source and derived atlas contain no basketball.

Local visual inspection of `cleanup01-light-native.png` and `cleanup01-dark-nearest4x.png` shows five distinct full-body silhouettes, readable auburn hair/pointed ears/copper amulet/burgundy-copper kit, no obvious detached pixels, and crisp clusters at native 80×96 size. The pixels look more detailed than the established pass atlas. Pose3's grabbing hand remains close to the lower knee/ankle and is not yet an unambiguous open cup around a separate ball. These are independent-review gates, not acceptance findings.

The previous no-safe-atlas-normalization note is retained as historical evidence from before support for a per-clip `baselineY` offset. The cleanup01 candidate has no manifest entry, no calibrated ball track, and no gameplay validation.
