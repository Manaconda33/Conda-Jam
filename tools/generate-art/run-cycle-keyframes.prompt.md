# Extended run-cycle keyframes

## Outputs and mapping

- `public/assets/captain-run-sprites-2.png`: RGBA PNG, 1484×1060, 7×5, 35 captains in manifest order.
- `public/assets/captain-run-sprites-3.png`: RGBA PNG, 1484×1060, 7×5, same captain order.
- `public/assets/supporting-player-run-sprites-2.png`: RGBA PNG, 1500×1049, 10×7, 70 partner/alternate athletes in roster order.
- `public/assets/supporting-player-run-sprites-3.png`: RGBA PNG, 1500×1049, 10×7, same supporting roster order.
- All four atlases are original ImageGen edits of the base gameplay atlases. Keyframe 3 is an edit of keyframe 2 to preserve each design while making the opposite stride phase.

## Runtime

During the `run` simulation state, the renderer cycles through the original run pose, keyframe 2, keyframe 3, and keyframe 2 again at 95 ms per frame. This yields a four-step loop with three distinct generated poses for each of the 105 athletes. Shot and dunk animations retain their separate action atlases.

## ImageGen prompt guidance

For each source atlas, preserve the exact dimensions, transparent background, grid, slot order, identities, silhouettes, colors and equipment. Draw one different mid-stride phase per source cell: exchange the forward and trailing legs, reciprocate the arm swing, and naturally rotate the torso. Keep complete figures inside cells. Do not add balls, floor, scenery, lettering, borders, duplicates or extra props. Preserve canonical nonhuman anatomy exactly, including the four-footed fox and dragon, hooded coiled cobra, compact wombat, jaguar, long-armed striped orangutan-zebra and blank-screen android. For keyframe 3, use keyframe 2 as source and draw the opposite running phase again.

## Validation

`tests/run-pose-atlases.test.js` checks the dimensions, PNG RGBA format and populated athlete count for all six roster-wide pose atlases. The E2E match checks that all four cycle frames load in the standalone offline build.
