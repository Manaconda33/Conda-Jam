# Kraken dunk-tomahawk attempt05 cleanup01: independent review

**Verdict:** Pass as candidate cleanup art for gameplay trials. Do not register this atlas as production artwork on the basis of this review.

## Scope and lineage

Reviewed the cleanup script, layout report, atlas, light and dark previews, and the raw source lineage. The report's source SHA-256 matches the provenance record and the raw image (`d1d905c4efd0263049f1ed68a1612a13be0271f6711f6c688f6e889a19bfe82c`). The script extracts whole alpha-connected figures globally, preserves row-major pose order, resizes uniformly with nearest-neighbor, and does not repaint or synthesize poses.

## Findings

- **Frames and cells:** The atlas contains 15 visibly distinct figures; all 15 normalized frame hashes are unique. They occupy 5×3 cells of 88×96 pixels. Full figures fit each cell; no limbs are clipped or crossing packed cell boundaries.
- **Anatomy and identity:** Head, auburn hair, pointed ears, torso, both arms/hands, legs, socks, and shoes remain visible. The face, copper pendant, burgundy uniform with copper trim, and proportions stay consistent. The cleanup does not visibly remove anatomy. Fine face and hand details are small, but remain coherent at the presented scale.
- **Action sequence:** The action remains readable through the reduction. Frame index 6–7 shows the right hand cocked behind the head; index 8 arcs overhead; index 9 clearly drives the hand down below the head for the tomahawk strike; index 10 continues into a distinct low follow-through. The overhead-to-downstrike change is clear, and the landing and recovery follow. The separate ball position, contact, and gameplay timing have not been reviewed here.
- **Baseline and margins:** All feet align exactly to baseline y=94 (zero delta). Across cells the minimum left/right margins are 8/9 px, minimum top margin is 5 px, and each pose has 2 px below the baseline. Visible pose heights range from 58 to 89 px.
- **Transparency and edges:** Atlas alpha is binary (0/255), and transparent regions remain transparent. Light and dark previews show crisp edges without an obvious source-background remnant or red fringe. The report says no detached output components were removed.
- **Palette and pixel style:** The atlas uses one shared 16-color visible palette. Nearest-neighbor resizing produces coherent pixel edges and uniform treatment across the clip. The raw source uses smooth illustrated shading and partial alpha, but the cleaned output reads as compact arcade sprite art; quantization loses some subtle shading while retaining readable costume, face, and limbs.

## Recommendation

Use this atlas for candidate gameplay calibration with a separate Kraken-specific ball track. Keep it unregistered pending contact/release/score/recovery checks, both facing directions, normal-loader integration, and capture review. The cleanup itself passes the requested anatomy, pose, layout, alpha, palette, and preview checks.
