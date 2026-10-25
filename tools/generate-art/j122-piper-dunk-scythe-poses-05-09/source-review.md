# J.122 Piper Quickstep dunk-scythe poses 05–09 source review

Canonical section is J.122, `dunk-scythe`, 15 poses row-major. Ball is a separate Piper-specific runtime track. The game ball follows the curled hand through pose09 and releases only at pose10/tick21; this lane draws no ball. Pose references from accepted J.105 Keeg images were used only for movement mechanics; Piper references were first in every generation reference set to preserve Piper identity.

## Current source choices

| Pose | Beat | Selected source | Independent disposition |
|---|---|---|---|
| 05 | Deepest low rear sweep, below/behind hip, knees tucked | `cleaned/pose05-attempt3-scaled.png` | PASS. Piper identity/anatomy, no ball, alpha, margins, and action all pass. It is deeper than pose04: hand is curled lower behind the hip while pose04 is the higher/shallower rear sweep; pose05 also has the more compressed tuck. |
| 06 | Reverse upward arc behind shoulder | `cleaned/pose06-pose06-attempt2-scaled.png` | PASS. Bent right arm and curled carry grip are distinct from low pose05 and chest-cross pose07. |
| 07 | Diagonal carry across chest | `cleaned/pose07-attempt5-scaled.png` | PASS. Right forearm crosses the chest to a curled carry hand; visually distinct from poses06 and08. Alpha>128 margin minimum is 138px. |
| 08 | Rising above right shoulder | `cleaned/pose08-pose08-attempt2-scaled.png` | PASS. Right arm rises above the shoulder with curled carry hand; not release. |
| 09 | High pre-release, fingers still curled | `sources/pose09-attempt6-components-clean-scaled90.png` | Accepted isolated source candidate after uniform 90% scale. Independent review passed action, Piper identity/anatomy, no-ball, alpha and layout. The 1024×1536 canvas has alpha>128 margins L/T/R/B = 165/131/91/214px (min 91px), meeting the prompt’s 80px target. The complete accepted lane-scale atlas has since been reviewed; see `tools/generate-art/j122-piper-dunk-scythe-atlas-candidate/atlas-lane-scale-layout.json` and native runtime reports. The original 44px measurement remains preserved in `pose9-attempt6-layout.json`. |

Independent review of poses05–08 is in `pose05-08-independent-review.json`, provided by the poses10–14 lane. It reviewed both light and dark proofs and verified pose order/action, Piper identity, anatomy, separate ball, alpha artifacts, and margin checks.

## Rejected source history

- Pose05 attempt1 and pose06 attempt1 were Keeg multi-pose sheets rather than isolated Piper drawings. Pose05 attempt2 was a forward reach at hip height instead of the low rear sweep.
- Pose07 attempt1 was a low rear-hand pose, not the chest-cross beat. Attempt2 stopped at shoulder gather. Attempt3 had the right action but clipped a shoe at the raw canvas edge. Attempt4 crossed the chest but splayed its carry hand. Attempt5 is the independently reviewed choice.
- Pose08 attempt1 depicted Keeg; attempt2 is the selected Piper candidate after alpha cleanup and uniform scale.
- Pose09 attempt1 is a Keeg multi-pose sheet with visible ball(s), rejected for identity, layout, and separate-ball violations. Pose09 attempt6 is the selected Piper source candidate. Attempt2 was rejected as Keeg art, attempt3 transfer failed and no source was retained, attempt4 had a backdrop/halo, attempt5 background removal redrew the art and retained the backdrop. Attempt6 passes independent review after uniform 90% rescale and meets the 80px prompt margin. The complete lane-scale atlas and runtime ball track are accepted after independent sequence and parent native review; see the J.122 atlas/runtime records.
- All raw source images and verbatim prompts remain preserved. Per-attempt generation IDs, prompt hashes, source hashes, alpha bounds, rejection reasons, and cleanup records are in the `poseNN-attemptN-provenance.json` files.

## Cleanup and layout

Pose05 attempt3 was uniformly scaled to fit within 1344×896 and centered on a transparent 1536×1024 canvas. Pose06, pose08, and pose07 attempt5 cleanup candidates preserve the largest alpha>=8 component and a one-pixel halo, then fit uniformly within 896×896 and center on 1536×1024; pose07 attempt5 raw is the selected source, and its proofs/layout were independently passed without needing the scaled copy. No pixels were painted or anatomy redrawn. The accepted production atlas uses uniform alpha-crop resizing; runtime registration and track review are documented separately. Selected pose layouts and hashes are recorded in `pose05-08-selected-layouts.json`.

Previews: `previews/poses-05-09-sequence-light.png` and `previews/poses-05-09-sequence-dark.png`. Pose09 appears in the accepted production atlas after the documented 90% uniform scaling; its original tighter-margin layout remains preserved.
