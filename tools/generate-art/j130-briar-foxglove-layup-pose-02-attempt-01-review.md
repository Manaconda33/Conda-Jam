# J.130 Briar Foxglove layup — pose 02 attempt 01 review

Generation: `exec-d4bc2883-a117-4884-a0d8-15d361899112`  
Source: `tools/generate-art/sources/j130-briar-foxglove-layup-pose-02-attempt-01-raw.png`  
SHA-256: `188c51703e8d2b7644949a02d19caaec20e2c32e47b836246e315785b52a9cb1`  
Prompt: `tools/generate-art/j130-briar-foxglove-layup-pose-02-attempt-01-prompt.md`

**Rejected. Do not clean or pack this generation.** The pose gesture is close to the requested airborne gather: the shooting arm is compact beside the ribs, the hand stays outside the face silhouette near chin height, and the other hand is chest-high. Identity is broadly consistent and the body is complete, but the image has an unrequested red wristband on the shooting arm. The pose is also much too large for the prompt's 27–30% canvas-height target: alpha>=16 bounds are `(419,264)-(887,958)` in a 1254×1254 source, or 55.3% canvas height. Alpha>=1 residue spans `(65,29)-(1241,1224)`, so the prompt's clean-margin condition fails even though all four corners are alpha zero. Color appearance is more orange/bronze than the accepted Briar reference and needs explicit palette comparison; no acceptance.

Preserve the raw unchanged. This rejection is based on scale, residue, wristband and palette; pose geometry alone does not override those defects.

Exact prompt recovery status is recorded in `tools/generate-art/j130-briar-foxglove-layup-prompt-archive-gaps.md`; the prompt path referenced above is absent from the current GitHub main tree and working copy. No prompt text was reconstructed.
