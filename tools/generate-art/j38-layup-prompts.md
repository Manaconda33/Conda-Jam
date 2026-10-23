# J.38 layup generation and review — Reed Ashcroft / Juniper Vale

Generation date: 2026-10-23. Both athletes are Chicago Condas supporting identities, runtime cells0/1. This checkpoint integrates Reed's eight-frame `layup`; Juniper has no eligible source yet.

## Reed Ashcroft — cell0

Reed remains an adult human man with medium-brown skin, dark eyes, a small dark goatee, dark purple-black braids in a high topknot, a natural athletic build, purple/gold Condas kit, white lower-leg wear, and matching shoes. Hands stay empty because gameplay renders the separate ball. The reviewed frames are row-major: approach, gather, plant/crouch, takeoff, high release, airborne follow-through, descent, landing.

| Status | Source / generation | SHA-256 | C2PA claim | XMP instance | Review |
| --- | --- | --- | --- | --- | --- |
| Accepted for art and atlas packing | `reed-ashcroft-layup8-candidate1.png` / `exec-6209cbd2-2268-4528-95de-c979eb4087d5` | `38a9bf398e438392d041fb404124454e85ca712b397d646feb11d9860add733e` | `urn:c2pa:4bf739e2-3342-46e6-955b-b41b0714dca1` | `xmp:iid:c3d764a7-741f-46fb-b19e-835b9913b2ba` | Eight complete distinct bodies, clear gutters and zero-alpha sheet edges; identity, anatomy and blank uniform pass review. The exact original prompt was not retained in the source checkpoint; the prompt is reconstructed and explicitly marked nonverbatim. Strict audit records this gap. |
| Rejected backdrop | `reed-ashcroft-layup8-attempt2-rejected-background.png` / `exec-8e53f228-d660-421f-90c9-f9f19f2aa844` | `e9f0058726e688028a6af41de7f9588d3aa2ddd9758a20b6b7f9dabab0f31d82` | `urn:c2pa:da3d239a-18c5-42dc-b3fe-cb5d3bb6eea5` | `xmp:iid:f926c062-f3b7-4caf-b250-932bdb80257b` | Painted translucent gradient remains connected between figures. |
| Rejected backdrop | `reed-ashcroft-layup8-attempt3-rejected-background.png` / `exec-5ee7e3fa-a064-4ca8-94b2-a20a682e15d3` | `84e26da39bfdbf859a4d8a96fee40b4b5e6a66158670c342b506a70adc9c7ded` | `urn:c2pa:4bd8c1dd-825c-412a-b27e-0a6b9d77393d` | `xmp:iid:fb0d3994-9664-46d2-a9f7-3c02822a5b54` | Concise retry still paints a translucent gradient behind and between the figures. |
| Rejected edit | `reed-ashcroft-layup8-attempt4-rejected-background-edit.png` / `exec-719fb388-0bb8-4daf-88e6-ef4d651af2f0` | `aef80c9ba088a64c28764e85b6e68f650a372bac9144da9aa735f03eceb2e5b2` | `urn:c2pa:22036c2f-800e-4da2-b0cc-7d6575aa2d43` | `xmp:iid:339c6c9e-b910-49c1-9b92-c39e2b605493` | Edit preserved the gradient instead of removing it. |

The accepted source is a 1774×887 RGBA sheet. It packs into an 80×96-cell, 4×2 lossless WebP atlas using component isolation and uniform resizing only. The atlas is `public/assets/animation/reed-ashcroft-layup-right.webp`; its SHA-256 is `9624ba5e1ee8620281ef3d86194102c61fe705ad7e97ffc5c4e90f3f97cef0fc`.

The recorded prompt below is a reconstruction from the accepted sheet and action requirements, not the prompt text returned in the original image-generation call:

```text
RECONSTRUCTED PROMPT, NOT VERBATIM. Generate an original transparent RGBA 4-column by 2-row sheet of eight distinct complete right-facing three-quarter full-body layup poses for Reed Ashcroft, Chicago Condas supporting athlete cell0. Preserve his medium-brown skin, dark eyes, small dark goatee, high dark purple-black braided topknot, natural adult human athletic build, blank purple-and-gold Condas uniform, white lower-leg wear, and purple/gold shoes. Use consistent scale and baseline, wide transparent gutters, and complete uncut figures. The game draws its own ball, so both hands stay empty. In row-major order: running approach, gather step, planted crouch, takeoff with raised knee, high one-hand layup release, airborne follow-through, descending, balanced landing. No ball, rim, lettering, numerals, logo, fantasy anatomy, background, floor, shadow, or props.
```

The common `layup` runtime clip has durations `[2,3,3,2,1,3,4,4]`; frame4 is the release at tick10. Reed's 80×96 atlas hand track is recorded in `src/core/animation.js`: height `[1.101,1.015,0.986,2.278,2.135,2.049,0.842,0.929]`, forward `[0.731,2.924,1.827,10.233,7.676,5.482,8.407,9.869]`. The standard J.01 Reed mirror review applies to both facings; the eight production frames were individually selected and checked in both directions. Standard and zoom120 actual Canvas previews are under `artifacts/native-render-preview/reed-ashcroft{,-zoom120}`; each loads121 images and captures87 clip snapshots plus32 action-frame snapshots, including all8 layup frames in both facings.

The packer is now generic for reviewed eight-pose `steal`, `layup`, and `layup-reverse` clips. Its overlap isolation, frame order, distinct decoded crops, edge rejection and accepted-source gate are covered by `tools/generate-art/test_package_motion.py`.

Exact generation prompts, hashes, dates, C2PA IDs and rejection notes for Reed's three backdrop failures are in `tools/generate-art/reed-ashcroft-layup8-rejected-provenance.json`.

## Juniper Vale — cell1

Juniper remains an adult human woman with light warm skin, dark eyes, abundant dark-purple curls gathered high with a small gold tie, compact natural athletic proportions, plain purple uniform with gold trim, dark knee pads and matching shoes. No digits, lettering, logos, ball or props are allowed.

Seven source attempts were reviewed and rejected. Fresh generations and direct backdrop edits all retained a visible painted or translucent gradient. Some had clear outer sheet edges, but the background still connected across gutters, so none was packed or registered. The source images remain in `tools/generate-art/sources/juniper-vale-layup8-*.png`; their hashes, C2PA claims, XMP instances, generation IDs and rejection reasons are recorded in `tools/generate-art/juniper-vale-layup8-rejected-provenance.json`. Original prompt text was not retained for those earlier attempts and is not reconstructed as verbatim. Generate a new clean transparent sheet before Juniper's `layup` can enter the runtime.
