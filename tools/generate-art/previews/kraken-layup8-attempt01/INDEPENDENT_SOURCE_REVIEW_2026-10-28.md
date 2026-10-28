# Kraken J.07 `layup` attempt01 source review — 2026-10-28

**Verdict: APPROVE FOR CLEANUP TRIALS ONLY. Do not register or calibrate a ball track from the raw sheet.**

## Provenance

- Verbatim prompt: `tools/generate-art/kraken-layup8-attempt01-imagegen-prompt.txt`, SHA-256 `922a4acd641d42d07dbdd510376fbba9f2b9fe3ef2bde50734c40c9404a80422`.
- ImageGen generation: `exec-cc45af49-445c-4d92-8e5a-c7790bece5fd`.
- Raw source: `tools/generate-art/sources/kraken-layup8-attempt01-generated-raw.png`, 1536×1024 RGBA, SHA-256 `f19895e7f680d76f205bf265b18f8631e27d32b256887c120034a12c973375bb`. Raw source remains unchanged.

## Source review

- The sheet contains eight distinguishable full-body poses in the requested four-by-two order. Limbs, hands, hair, pointed ears, and shoes are present. Identity and kit are coherent with Kraken's reference: short auburn hair, copper skin, pointed ear, copper amulet, burgundy uniform with copper/gold trim, wrist details, and shoes. The art contains no basketball; the small gold circle on the chest is the character's amulet.
- The action sequence reads as gather, takeoff, rise, extension, release/peak, descent, landing approach, and finish. Pose1 shows the push-off and lifted opposite knee at the tick2 takeoff. Pose4 shows the highest fully extended shooting arm and is the clear release/peak at tick10. Pose7 is a balanced landing finish. Durations `[2,3,3,2,1,3,4,4]` map frame1 to tick2, frame4 to tick10, and frame7 to the final pose as specified.
- The same raised shooting arm appears to carry through frames2–5, although frame4 rotates the torso farther away and shifts the raised arm's screen position relative to frames2–3 and 5. The visible action remains plausibly continuous, but the side swap is not fully unambiguous in a static sheet. During cleanup review, preserve a consistent anatomical right arm and reject the source if the pose cutout sequence cannot demonstrate continuity without a hand switch.
- The PNG has genuine transparency and no broad visible brown alpha haze when composited over light and dark. Alpha is 0–254; roughly 73% of canvas pixels are fully transparent. The dark/light composites show crisp outlines and no background veil, glow, or matte. Component analysis finds hundreds of detached alpha islands per raw cell, including a few larger islands near cell boundaries. These are localized rather than a broad haze, but must be checked against the untouched source and not removed by a blind largest-component rule.
- Cleanup is viable: poses are visually well separated and their main silhouettes can be isolated and padded into fresh cells. Preserve the raw sheet, record cell/source rectangles, retain any detached hand/finger details that belong to the figure, remove unrelated islands, and preview every cleaned pose on light and dark. Several hands reach close to a cell boundary; include explicit margin and full-anatomy checks before track trials.

## Limits

This review approves cleanup trials only. It does not approve the cleaned atlas, ball placement, athlete-specific track, gameplay timing, mirroring, or production registration. Gameplay trials must verify held-ball contact through frame3, exact right-hand release at frame4/tick10, release/peak continuity, and the frame7 landing/finish.
