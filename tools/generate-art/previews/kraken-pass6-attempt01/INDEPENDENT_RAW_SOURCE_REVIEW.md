# Kraken J.07 `pass` attempt01 — independent raw-source review

**Verdict: pass for cleanup/layout trials only. Not approved for packing, gameplay, or runtime registration.**

- Generation: `exec-fab9a322-b6aa-47cc-8092-07f52cc5a91f`.
- Exact prompt: `tools/generate-art/kraken-pass6-attempt01-imagegen-prompt.txt`.
- Raw RGBA PNG: `tools/generate-art/sources/kraken-pass6-attempt01-generated-raw.png`, 1402×1122, SHA-256 `12ac9be2ea709c4edcb456c5955b354b377633979dd2e72fcc69c12000311316`.
- Reference: registered Kraken idle atlas `public/assets/animation/kraken-idle-right.webp`.

The sheet contains six separated full-body figures in a 3×2 row-major arrangement. At alpha ≥16 there are exactly six major connected components. Their source bounds are `[(72,58)-(371,531), (534,67)-(855,531), (942,73)-(1363,531), (51,603)-(502,1058), (511,603)-(975,1055), (1020,601)-(1323,1058)]`. No pose is cut off; heads, hands, pointed ears, amulet, and shoes are visible. The broad arm extension in poses 3–5 needs a wider packed cell than Kraken's 80px locomotion cells; at 88px sprite height, plan on 96×96 cells with baseline y=94 so the release and follow-through retain side clearance.

Kraken identity and kit read consistently across the set: short auburn hair, pointed ears, natural skin, copper amulet, burgundy uniform with copper/gold trim, wristbands, and matching shoes. The shading and outlines closely follow the idle reference, with brighter highlights but no apparent uniform-color or anatomy change. No basketball or other prop is visibly baked into any pose; the cupped setup/windup hands and open release fingers remain empty.

The motion is a coherent chest pass: frame0 sternum setup; frame1 rib-level windup; frame2 forward step and extending wrists; frame3 full horizontal release; frame4 softened follow-through with loaded front knee and lifted rear heel; frame5 balanced recovery. Frame3 reads distinctly as the release anchor at catalog tick5. The poses are visibly different, though frames3–4 have similar extended-arm silhouettes and should retain their small wrist/elbow differences during extraction.

The canvas has fully transparent background around the six large figures, without a diffuse haze. It contains a low-alpha antialias/fringe field (1,053,865 fully transparent pixels; 517,937 partially transparent; 1,242 fully opaque), so cleanup should isolate the six silhouettes and their original-alpha edge fringe, then remove detached alpha specks. Preserve source RGB/alpha on the figures, align both rows to a common baseline, and inspect native/light/dark previews before any packing or gameplay review. No cleanup, atlas, track, or runtime clip has been accepted by this raw-source review.
