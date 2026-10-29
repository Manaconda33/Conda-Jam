# Kraken J.07 `pass` attempt01 — cleanup01 review record

**Verdict: raw source passed for cleanup/layout trials only; cleanup01 is rejected for gameplay trials and runtime registration.**

ImageGen generation `exec-fab9a322-b6aa-47cc-8092-07f52cc5a91f` is preserved raw at `tools/generate-art/sources/kraken-pass6-attempt01-generated-raw.png`, with its exact prompt and provenance. The 1402×1122 RGBA source visibly contains six row-major complete figures, no basketball, and a truly transparent canvas outside the figures. Six large alpha components are separated at threshold16; cleanup retains only their original source pixels and the 1.5px anti-aliased fringe, removing isolated canvas specks.

The cleanup01 candidate is a 576×96 horizontal atlas with six unique 96×96 cells, 88px uniform sprite height, baseline y=94, at least two horizontal pixels around the widest pose, six rows above the tallest hair and two below the soles. Durations follow the canonical chest-pass clip `[2,2,1,1,2,3]`, with release at frame3/tick5. The sequence reads chest setup, windup, step/pre-release, horizontal empty-hand release, follow-through, recovery. No basketball is baked into any frame. Light/dark native and 4× nearest-neighbor previews are preserved.

Independent raw-source review accepted the identity, anatomy, transparency, and cleanup/layout trial only. Independent cleanup/gameplay review rejected the pose sequence: frame2 already reads as an extended release, and frames2–4 continue that release-like gesture, one tick before the canonical frame3/tick5 release anchor. Do not run track calibration or register cleanup01. Preserve it with the rejected cleanup report; attempt02 is the corrected source iteration.
