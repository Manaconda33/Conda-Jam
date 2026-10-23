# J.94 — Keeg fall and get-up

## Action and canon

Ten original right-facing fall/get-up poses for Keeg, canonical K.03. The movement goes from loss of balance through a safe side landing, roll to a knee, hands-and-knee recovery, crouch and standing finish at frame9 / tick33. The complete tall ornate purple hat, silver trim and mushrooms stay on; Keeg’s black hair, close black beard, adult human anatomy and lavender/purple/silver kit remain recognizable. His hands are empty; the basketball remains separately simulated and may be loose after contact. K.03 approves body mirroring.

## Accepted generation and cleanup

Accepted generation `exec-a0a69c34-d642-4fb6-910c-cb2a9bd0d661`; raw source `tools/generate-art/sources/j94-keeg-fall-generated-raw.png` SHA-256 `549f8e2b2d1b379115c6733bfca05aab538b0f61c6e5c3d413c722f88e7e5f1d`. The image service returned a1774×887 transparent RGBA sheet with ten complete, separate poses arranged in the 5×2 packer order; all silhouettes remain inside the outer canvas. Four-pixel halo cleanup with `tools/generate-art/clean-dunk-halo.py` cleared93,712 exterior pixels, including11,559 vivid-red artifacts. All ten body components remain complete and separate; no active red artifacts remain.

The cleaned source `tools/generate-art/sources/j94-keeg-fall10.png` SHA-256 is `a31dc90fe8049642f40653fd091eb09d5e67a382c82d0ef27fc6c6d426847b09`. Component bounds, row-major mapping, crop isolation and normalized atlas positions are recorded by `tools/generate-art/package-action10.py` in `tools/generate-art/keeg-fall10-layouts.json`.

## Exact generation prompt

> Create a transparent RGBA production sprite atlas for JAMVERSE '96 with exactly ten distinct full-body poses of the same Keeg character in a five-column by two-row grid, row-major order, exact sheet size 1600x800 and exact cell size 320x400. Every complete figure must be isolated inside its own cell with at least28px transparent edge clearance. Leave no paint, lighting, shadow, caption, border or grid marks outside the characters; no court, floor, ball, opponent, props, special effects or text. All poses face right. Keep body scale and ground baseline consistent where the pose permits.
>
> Keeg is a flamboyant adult male human witch with athletic natural adult anatomy, black hair and a neat close black beard, very tall ornate purple witch hat with silver trim and tiny mushrooms, layered lavender/purple/silver basketball clothes with fine mushroom motifs and athletic purple/silver shoes. The complete hat stays on his head and recognizably consistent through the fall and recovery; preserve his face, hair, beard, kit and human anatomy in every frame. Both hands are empty. There is no basketball in this animation sheet; the live ball remains separate game art.
>
> Make a clear basketball collision fall followed by a get-up, as ten sequential unique poses: frame0 loses balance in a defensive stance; frame1 staggers with arms raised for balance; frame2 knees buckle and torso leans right; frame3 drops onto one hip with one hand bracing; frame4 settles safely onto his side/shoulder, hat still on; frame5 rolls from side onto a knee and palm; frame6 pushes the upper body off the ground; frame7 rises into a low crouch; frame8 begins standing, regaining balance; frame9 finishes in a stable ready stance. Plausible joints and grounded balance, no injury cues. Pose transitions must be distinct and readable; the falling body must not hide the hat or beard. Keep every hat ornament, finger and shoe inside the cell with transparent separation. Ensure no silhouettes touch neighboring cells.

## Visual review

The cleaned RGBA sheet was composited on white for review. Ten complete Keeg silhouettes remain distinct through the tumble and get-up; the hat remains attached and fully visible, anatomy and uniform are consistent, and the late poses show clear support from hand/knee through crouch to standing. The image contains no ball or opponent. The runtime uses a separate ball object.
