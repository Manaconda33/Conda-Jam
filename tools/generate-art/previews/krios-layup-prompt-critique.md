# Independent prompt critique — J.128 Krios `layup`

## Verdict: ready for one source-generation attempt, with a margin clarification recommended

The prompt's eight-frame order and action anchors match `tools/generate-art/pose-catalog.json` exactly:

- frame1 takeoff at tick2;
- frame4 release and peak at tick10;
- frame7 finish at tick18.

It also preserves the other catalog poses in order: low gather, rising ascent, high-forward release, early descent, landing approach, and stabilized finish. It asks for the correct eight unique frames, one right-facing rig, full anatomy, no baked ball, and no background/hoop. The right-hand shooting action and left guide hand are understandable and suitable for a mirrored source atlas; the separate ball track must still be calibrated independently.

Krios's protected identity reads clearly in the prompt: volcanic-red skin, two curled near-black ram horns, charcoal beard, muscular giant proportions, Scoria Rams uniform colors and rugged boots. The style direction cites an approved Krios action atlas and explicitly rejects soft rendering, glow and background haze. There is no material timing, anatomy or character-canon conflict.

## Recommended tightening before generation

The phrase “comfortably within its own cell with clear transparent gutters” leaves margin size subjective, especially for the high-forward frame4 release. Add a numeric lower bound, such as **at least 24 source pixels of transparent clearance from each cell edge**, and state that the release hand and both horns must stay inside that margin. The packer will normalize the source into the 104×96 atlas, but a stated source-cell margin reduces the chance of clipped anatomy before packing.

The pose map itself needs no changes. After generation, inspect every cell separately at source scale and packed/gameplay scale for frame4 fingertip/horn margins, guide-arm separation, both legs/boots, clean alpha edges, and clear visual distinction between frames3–5. Then calibrate catch, release and landing contacts with a separate Krios track.
