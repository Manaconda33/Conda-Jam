# J.138 Briar Foxglove dunk-power — attempt 04 review

Status: **rejected as a production atlas; source preserved**.

Parent attempt03 (`exec-ffb5f31c-6502-4a35-b6bd-c5b921539fe8`) contained a visible basketball in row 1, column 2. Edit attempt04 (`exec-6d91699a-5666-4920-ac90-44f44a71dd12`) removed that basketball. The 1536×1024 RGBA source has real alpha-zero background pixels. Both exact prompts, parent/raw source files, generation IDs and hashes remain in this folder.

Independent art review identified these production blockers:

- Row 1, column 4 has a raised hand too close to the cell top; row 3, column 1 crosses its row boundary. Fixed-cell packing risks cropping or mixing silhouettes.
- Several aerial/raised-arm poses repeat; the release and follow-through are not distinct enough to verify the requested downward snap.
- The style is smooth painterly cel shading rather than crisp arcade pixel art.
- The catch reads overhead rather than shoulder-height.
- No Briar-specific dunk-power ball track exists. Current generic hand-center values appear mismatched at gather, frame8, release and follow-through; no track has passed both-facings/100%/120% review.

The timing order broadly corresponds to approach, gather, takeoff at frame2/tick4, catch at frame5/tick10, peak frame7/tick14, release frame10/tick21, score frame11/tick23 and land frame14/tick30. These observations do not constitute acceptance. Do not pack or register this sheet.
