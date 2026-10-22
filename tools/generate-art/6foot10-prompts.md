# 6foot10 locomotion sprite generation

Canon K.29: towering huge muscular tuskless green orc; messy high top-knot/man-bun; rugged practical athlete; dark forest-green basketball uniform with stone-gray trim. Keep the mouth smooth/closed, with no visible tusks or protruding fangs. No weapon appears in basketball animation. Art uses a transparent sprite atlas and the polished illustrated sports-game language from the supplied JAMVERSE target image.

## Accepted source sheets

- `idle`: six distinct idle poses, 3x2, source `exec-6e3b72ac-9fcc-475f-aad8-5f1124ef8b8a.png`; one top-edge cell is omitted and a clean ready pose replaces it.
- `idle-ball`: four ready/receive poses, 2x2, source `exec-d737db72-dec5-41a0-85cd-f4f102ac78df.png`; hands empty so the game draws the ball.
- `dribble`: ten stationary dribble phases, 5x2, source `exec-8a799cf0-488d-4f51-958f-a2795c4036f3.png`; all accepted cells have complete silhouettes and no ball.
- `run`: eleven stride poses from two 3x2 sources, `exec-fae99d6f-e488-45d3-9943-a18208e7beb1.png` and `exec-210b162b-a7ad-4b57-b996-2525c23ee4b9.png`. The one edge-touching frame from the first source is excluded.
- `dribble-run`: eleven forward dribble strides from three 2x2 sources. `exec-6f6f9a85-373d-476d-8346-352222b0d520.png` is the approved resized output retaining a four-pose sheet; `exec-32f0e130-d804-4760-9fce-08669bc072f8.png` adds four poses after removing baked balls and shrinking figures; `exec-7beb2fda-a5aa-4e34-b61a-7a90ad13525a.png` contributes three further empty-hand poses.

Each source output is genuine RGBA. Accepted cells are inspected in alpha-composited view, isolated to the main character silhouette, checked for transparent cell margins and unique pixel hashes, then downsampled uniformly into the production atlas. The game draws the ball separately.

## Rejected attempts

The first 5x2 dribble candidate (`exec-c242f661-7b01-400a-b9a3-a7648f5e3741.png`) crowded hands, hair and shoes against cell boundaries. `exec-44a918f4-6186-4381-afda-b35772b2bdcc.png` was replaced by the clearest stationary dribble sheet. The 3x2 and 5x2 dribble-run sheets (`exec-defbeefc-32aa-4973-8953-17f29f5cf9e9.png`, `exec-e37fd60a-3b71-43e5-ad39-e0636237b674.png`) also touch cell boundaries. Three large 2x2 sheets (`exec-f9931988-9d64-47d1-814e-f94bc1163722.png`, `exec-4a8f9682-5e64-4a4c-89a3-21e2626d796a.png`, `exec-46ea8a67-32aa-46c7-b990-ca7becdc3fd5.png`) were replaced by resized versions with full clear margins. A sheet with basketballs baked into art (`exec-f21f2cad-d6c8-4518-aae6-7b0c1a925dba.png`) and its unscaled cleanup (`exec-c5d9e67e-d147-4923-8eab-6724752b5cf1.png`) are excluded. Two early generation requests were rejected at image review and produced no usable file.
