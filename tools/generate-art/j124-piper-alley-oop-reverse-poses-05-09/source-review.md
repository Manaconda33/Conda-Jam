# J.124 Piper `alley-oop-reverse` — source candidate review, poses05–09

Status: source candidates only; independently reviewed, but full-clip parent acceptance and native track review are pending.

| Pose | Beat | Raw alpha>16 margins L/T/R/B | Fit80 candidate margins | Candidate source |
|---|---|---|---|---|
| 05 | overhead catch, tick10 | 334/67/279/98 | see layout JSON | `layout-candidates/pose-05-fit80.png` |
| 06 | shoulder/chest secure | 404/57/266/137 | see layout JSON | `layout-candidates/pose-06-fit80.png` |
| 07 | rotated airborne peak, tick14 | 323/78/212/188 | see layout JSON | `layout-candidates/pose-07-fit80.png` |
| 08 | behind-head reverse gather | 326/71/158/135 | see layout JSON | `layout-candidates/pose-08-fit80.png` |
| 09 | closed-fist pre-release | 277/77/215/114 | see layout JSON | `layout-candidates/pose-09-fit80.png` |

All five original prompt outputs were rejected for direct atlas placement because at least one raw alpha>16 margin is below80px. They are retained unchanged. The selected candidates use only conservative alpha cleanup and uniform size/position fitting; all selected PNGs satisfy >=80px alpha>16 margins on each edge. Prompt, raw source, cleanup, layout and selected-source SHA-256 values are in each pose's `provenance/pose-NN-attempt1.json`.

Visual source-lane review finds Piper identity/anatomy, transparent backgrounds and ball-free action art. Beats progress from overhead catch through shoulder gather and reverse turn to behind-head gather and closed-fist pre-release. Pose07 uses both hands joined near the crown, so its distinct turn/leg silhouette must be checked against pose05's overhead catch at native atlas size. Pose09's fist is clearly closed in source, but separation from pose10's release remains pending. The pose05 rendering is slightly smoother in line detail than J.123; palette, contour and pixel shading remain consistent enough for candidate comparison, not final acceptance.

Independent native-cell review confirms the ordered poses remain readable at128×96. Pose07's three-quarter torso twist and leg silhouette distinguish it from pose05 despite their overhead hand positions. Pose08's behind-head forearm route becomes hard to parse at native size and must be checked in the assembled sequence. Pose09 reads as a diagonal one-arm pre-release, but its fist needs comparison with pose10's open palm. Identity and anatomy look consistent, no duplicated or missing anatomy is apparent, and the separate ball is absent. Style is close enough for provisional comparison; final full-atlas review must confirm the smooth pixel clusters stay consistent with J.123.

This lane remains unaccepted and has not been packed. The five original source sheets failed the requested top margin and remain retained as rejected direct-pack candidates; only their uniform fit80 layouts are comparison candidates. All margins, provenance hashes, transparency proofs and cleanup records are retained above.
