# J.128 Krios `pass-behind` source review

## Accepted source art

Attempt03 (ImageGen `exec-bacc1e68-e632-48c3-a10e-626382c9a505`) is accepted as source artwork after cleanup01. The six pose cells are ordered 0–5; pose3 (bottom-left) is the exact behind-the-back release and pose4 follows through with the arm extended behind the torso. Pose5 recovers. All six figures preserve Krios's volcanic-red giant anatomy, curled black horns, dark beard, black/ember/gold Scoria Rams kit, and boots. No basketball is drawn.

The generated raw sheet had a low-alpha red/black glow around each figure. `clean-krios-pass-behind6-attempt03.py` zeros alpha below 96 and makes alpha 96–254 opaque, preserving the source RGB pixels. It removed 86,371 nonzero-alpha haze pixels. Component inspection found exactly six silhouettes at alpha≥64, all safely inside their 512×512 source cells. Independent review of checker, light and dark previews found no meaningful anatomy, face, uniform, or equipment pixels lost. At native 80×96 size, the pixel clusters remain legible and the softened shading is acceptable against the accepted Krios action style.

Packed atlas: `public/assets/animation/krios-pass-behind-right.webp`, six distinct 104×96 frames in a 520×192 lossless WebP, baseline y94. An independent packed-atlas review accepts transparency, frame margins, baseline, Krios identity, pose separation, rear-turn arm separation, pose3 release, and pose4 follow-through.

## Rejected attempts retained

- Attempt01, generation `exec-b6f026dc-7243-4210-bc6a-f8d5cd00637e`, raw SHA-256 `5acf3beb93c26f019468a5cf502d0b470efb8bd9dd893861e603d1e249ad5c63`: six distinct poses and correct release, but partial red/black glow and overly painterly rendering. Independent reviewer rejected it.
- Attempt02, edit generation `exec-f2582f28-7a75-402b-b259-5b9f748e772c`, raw SHA-256 `258e6b248ac58de5a36806cc2850890f2d05b1a88053a64d115ae203bbc10092`: background-removal edit retained the same glow and shading. Rejected; original and edited outputs remain preserved.
- Attempt03 raw, SHA-256 `0a9b9ecc7726af2f50eae3da5239c7be645e8656cda36f60031b6a59b79442f7`: rejected as-is for the glow; cleanup01 is accepted.

Exact prompts and per-attempt provenance are recorded in the matching `krios-pass-behind6-attemptNN-*` files. The accepted attempt03 raw image, cleanup output/report, layout and light/dark/checker previews are retained. Runtime registration and Krios's athlete-specific ball track are pending; this source-art review does not approve track alignment or gameplay.
