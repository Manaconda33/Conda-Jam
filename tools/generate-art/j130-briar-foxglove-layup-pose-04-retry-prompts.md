# J.130 Briar layup pose 04 retries — 2026-10-26

Appearance reference: accepted Briar `shoot` pose02 at `tools/generate-art/sources/j109-briar-foxglove-shoot-pose-02-attempt-1.png`.

## Retry 27 — exact ImageGen prompt

> Create one original JAMVERSE '96 pixel-art animation sprite of Briar Foxglove, using the attached accepted Briar image only for her identity and uniform: adult human woman, warm deep-brown skin, shoulder-length dark locs, vivid red headband, compact athletic build, sleeveless russet-and-cream Emberwood basketball kit, cream socks, matching russet/cream trainers. No fox features. Bare wrists; absolutely no wristbands, bracelets, gloves or jewelry.
>
> Show exactly one complete right-facing three-quarter human figure with full anatomy from head to both shoes, exactly two arms and two legs. This is J.130 layup frame 4: the compact peak and one-hand release at tick 10. Briar is airborne, torso lifted and angled toward the hoop, knees bent asymmetrically with the trailing heel tucked behind. Her shooting arm is raised diagonally forward in a compact high layup release: elbow remains bent and close enough to keep a readable compact silhouette, forearm angled up-forward, palm turned upward/forward with fingers gently extended. The release hand is clearly higher than frame 3's cheek-level prerelease, but it is not a towering vertical overhead reach and does not extend far above the head. The guide arm balances open at chest/shoulder height, separated from the shooting arm. No ball is visible or painted into the figure.
>
> Use a transparent square canvas with broad empty space around the subject, complete silhouette and clean in-bounds feet; keep the figure relatively compact for later uniform resampling into a 128×96 sprite cell. Match the reference’s warm deep-brown complexion and palette; not orange, bronze, copper or lightened. Crisp readable 16-bit arcade pixels and restrained shading. No text, grid, court, ground, floor, shadow, backdrop, extra figure, duplicate pose, wrist accessory, haze, detached flecks or edge-touching pixels. True transparent alpha at every corner.

Generation `exec-b9d506d5-6035-4c0c-bd72-1996ed01a413`; raw SHA-256 `2e92d56af22d560e096d266aa2efb08a5b42ea3905454887bda0bf17ad771743`.

## Retry 28 — exact ImageGen edit prompt

> Edit the FIRST image only. Keep Briar’s face, hair, red headband, warm deep-brown complexion, russet-and-cream uniform, bare wrists, torso, orientation and bent airborne legs exactly as shown. Use the SECOND image only to preserve Briar identity and palette.
>
> Make the layup release arm more compact. Bend the shooting elbow to roughly 90 degrees and keep it below the top of the head/locs. Rotate the forearm diagonally forward and up, not vertically overhead. Lower the shooting hand so its palm-up release point is just above the red headband, no more than one palm-height above the crown. Fingers extend forward/up gently. This is still J.130 frame4’s single high layup release at tick10, distinct from frame3’s cheek-level prerelease, but it must NOT read as a towering overhead reach or a straight-arm jump shot. Keep the guide hand open at chest height and separated. Do not alter legs, body or pose scale. No ball, wristbands, jewelry, props, backdrop or text. Preserve clean transparent background and crisp pixel edges.

Generation `exec-9c790e10-8824-4cef-821b-5793e3e99bf9`; target retry27 raw, identity reference J109 shoot pose02; raw SHA-256 `bc5adfea89a48931021a7fe22520b89dd6b90d1d51afa37234ee802e1d2df793`.

## Retry 29 — exact ImageGen edit prompt

> Edit the FIRST image only. Preserve its compact bent-arm layup release pose, full body, right-facing orientation, bare wrists, uniform, hair and headband exactly. Use the SECOND accepted Briar image only as the warm deep-brown complexion reference. Change only exposed skin pixels to match the second image: target opaque-skin median RGB approximately (164,69,30), shadow around (85,35,17), highlight around (193,114,70). The first image is too bright and orange; deepen it and reduce the red/orange shift. Preserve hands and faces as skin, do not alter red headband or russet/cream uniform, and do not add wristbands or jewelry. Do not change pose, proportions, framing or transparency. No ball, no props. This is a complexion palette correction only.

Generation `exec-013148de-0e40-427e-a361-55735537a764`; target retry28 raw, identity reference J109 shoot pose02; raw SHA-256 `16b94b312a19689140989d0dc92657d1734ec659078d4c392a69bf759056300a`.

## Retry 31 — prompt archive gap

Generation `exec-74081656-5f8e-45ee-9e00-bf4e80faa262`; raw SHA-256 `c56047884fdc7ad57302bcacb893744c2d91a153d4eaabb3c1980cea6beb1730`. The exact prompt was not found in the current repository or working copy. No replacement prompt is reconstructed; see `j130-briar-foxglove-layup-prompt-archive-gaps.md`.

## Retry 32 — exact ImageGen edit prompt

> Edit this single sprite for J.130 Briar Foxglove layup pose 04. Preserve the same recognizable adult human woman, deep warm-brown skin, dark shoulder-length locs, vivid red headband, compact athletic build, exact russet-red and cream Emberwood uniform, pixel-art style, right-facing three-quarter view, scale, anatomy and tucked airborne legs. Keep exactly two arms and two legs, full body and shoes, clean true alpha transparency. This is the release pose immediately after her pre-release pose: keep the shooting elbow clearly bent, but move the open shooting palm farther forward toward screen-right and slightly upward so it sits clearly in front of the forehead, around headband height, not above the crown and not in an overhead reach. Palm faces upward/forward as a compact layup release. Keep the guide hand lower near chest height. No ball or props. Do not alter face, clothing, body proportions, or add bands or accessories. No glow, shadows, checkerboard, court, background, text, frame, border or effects. One isolated pose only.

Generation `exec-123a4611-96ba-4dfd-8724-ec0abe7b4430`; edited source retry31; identity reference J109 shoot pose02; raw SHA-256 `172553a0c518213ece5ec8f7896153048dd970caf37c4fa42f01d009fd659d7e`.

## Retry 33 — exact ImageGen edit prompt

> Edit the FIRST image only, removing the added chest mark. Use the SECOND image only to verify Briar's exact canon identity and uniform design. Preserve the first image's compact airborne layup release pose, right-facing three-quarter orientation, face, dark shoulder-length locs, vivid red headband, warm deep-brown skin, body proportions, bent limbs, all costume construction and colors, and exact pixel-art style. Remove the conspicuous white square/crest on the central upper chest: the russet-red jersey front is plain, with only the established cream side/neck trim seen in the identity reference; add no number, badge, emblem, lettering, jewelry, wristbands or other mark. Do not change any pose or anatomy. Keep exactly two complete arms and legs, full hands and shoes. No ball, no scenery, no background, transparent RGBA, no floor, shadow, glow, checkerboard, text or effects. Preserve the image's framing and size.

Generation `exec-5bb3cf51-709c-4555-9587-b8a4b1044c59`; edited source retry31; identity/uniform reference J109 shoot pose02; raw SHA-256 `6bfaf194e2fc5acd935a569978face7cddfc88f8cc3028d3764c404e50ebc77b`.
