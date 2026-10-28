# Independent source-art review — J.128 Krios `pickup` attempt01

## Verdict: candidate is pose-approved for cleanup and packing trials; not production-accepted

I reviewed the uncleaned generated source (`krios-pickup-attempt01-generated-raw.png`), its cell-grid view, light/dark composites, prompt, and pose layout. The five occupied cells contain a readable and connected pickup sequence in the requested order. Krios remains recognizably the red-skinned giant with curled black horns, dark beard, heavy build, Scoria colors and rugged boots. Hands are empty, with no ball drawn.

## Pose and anatomy review

- Frame0 is a distinct low ready/spot pose, with the lead hand beginning to reach.
- Frame1 lowers into a wide deep crouch and extends the balance arm behind.
- Frame2 is visibly lower and more horizontal, with fingertips reaching beside the lead boot.
- Frame3 is the low grab pose: closed hand at ankle level beside the shoe and eyes angled down.
- Frame4 rises into a grounded crouch with both hands closing around the separate imaginary ball.
- Each pose has one complete head, two horns, two attached arms/hands and two legs/boots. I did not find a merged neighboring figure or a drawn ball.
- The frame0–2 boot baselines align closely; frames3–4 also share a baseline. The pose variation is sufficient for the five-keyframe action, with no duplicated silhouette.

## Issues to resolve before acceptance

- The raw image has no fully opaque pixels: alpha255 count is zero, with 422,900 partially transparent pixels. The five main figures remain connected at alpha32 and there are no large detached fragments, but alpha needs an explicit cleanup and an after-cleanup light/dark edge review before acceptance.
- The tightest source cell margins are about14px on frame2's reaching fingertips and18px on frame1's balance hand. Those are positive and do not cross cell boundaries, but are too tight to call “generous” without checking the final 104×96 packed crops. Uniformly shrink/recenter if the packed margin falls below the project's accepted minimum.
- The raw rendering has smoother, glossy shading than the hard pixel-cluster wording in the prompt. Krios's existing packed reference also uses outlined, modeled shading, so this is not by itself a rejection; review the reduced atlas at native/gameplay scale before accepting style consistency.

## Required next review

Perform documented alpha cleanup without repainting the athlete; save the cleanup method, pixel/component report, and before/after light/dark previews. Then pack and inspect all five cells at native atlas resolution for complete anatomy, cell margins, distinct poses, transparency fringe and baseline. Keep the sixth cell empty. This review approves the pose drawing for those cleanup/packing trials only; it does not authorize runtime registration or approve a ball track.
