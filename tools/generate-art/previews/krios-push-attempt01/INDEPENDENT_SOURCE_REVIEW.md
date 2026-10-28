# Independent raw source review — Krios J.128 `push` attempt01

Disposition: **pass for cleanup/layout trials only**. This is not production or runtime acceptance.

Reviewed the preserved 1448×1086 opaque RGB source against the exact prompt and Krios canon references. The image has eleven row-major, full-body figures in a 4×3 arrangement with cell12 blank. The figures consistently read as Krios: volcanic red skin, black curled horns, charcoal beard, and black/ember uniform. Joints and anatomy are coherent, the action is ball-free, and no opponent or unrelated prop appears.

All eleven poses read in order. Frame5 (index5, tick8) clearly shows two-arm full extension with open hands and a braced forward leg. Frames4–6 separate anticipation, contact, and lowered-wrist follow-through. Recovery, settle and ready poses are similar but remain distinguishable by hands, lean and foot placement; verify that native-size reduction preserves their differences.

Cleanup risk: frame5 nearly fills its cell (approximately four pixels at the left edge and none at the right); frame6 begins on the adjacent cell boundary. The figures remain visually separable because their closest parts are at different heights, but cleanup must isolate components rather than blindly crop the grid. Other figures leave wider margins. The green matte is opaque, close-keyable, and not perfectly flat (corners vary around RGB 14–20, 239–245, 10–16); inspect edge contamination after keying and retain alpha transparency. Normalize with a consistent scale into safe 128×96 native frames, then independently review frame uniqueness, anatomy, margins and edge quality.

Reviewer result delivered by `/root/krios_block_source_review`, 2026-10-28. Raw image and prompt remain unchanged.
