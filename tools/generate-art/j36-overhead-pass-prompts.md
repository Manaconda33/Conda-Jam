# Action 02 — Reed Ashcroft and Juniper Vale, overhead pass

Create six original right-facing full-body poses for the `pass-overhead` clip in `src/core/animation.js`, arranged three columns by two rows in row-major order. The runtime sequence has durations `[2,3,2,1,2,3]`; frame3 is the release at tick7. The accepted prompt and per-source provenance are recorded in each athlete's `*-pass-overhead6-provenance.json` file.

## Identity and prompt

Reed uses supporting-player cell0: medium-brown skin, dark eyes and brows, small dark goatee, dark-purple/black braids in a high topknot, natural young-adult human athletic build, and Chicago Condas purple/gold uniform with white lower-leg wear and matching shoes. His references were `reed-ashcroft-portrait-reference.png`, `reed-ashcroft-gameplay-reference.png`, and his clean standard-pass atlas. Juniper uses supporting-player cell1: light-warm skin, dark eyes, focused adult face, abundant dark-purple curls gathered high with the small gold tie, compact natural human athletic build, and the same purple/gold uniform with dark knee pads and matching shoes. Her portrait, gameplay crop, and clean standard-pass atlas were attached. Both prompts prohibit balls, held objects, numerals, props, fantasy traits, floor/shadows, and extra figures; both specify a clear three-quarter view and consistent scale.

The exact six-pose sequence for both: (0) balanced open-hand ready stance; (1) bend and gather empty hands near the upper chest; (2) raise both hands above the forehead with bent elbows; (3) step and extend both arms above the head in the overhead release; (4) distinct high follow-through; (5) recover to ready. The source prompt text is copied without edits into the provenance JSON alongside all reference paths.

## Accepted sources and packaging

| Athlete | Runtime cell | Source SHA-256 | C2PA claim | Atlas |
|:--|--:|:--|:--|:--|
| Reed Ashcroft | 0 | `5d79b9e21e92ecbfcd01c52b172e2b5edea54bd816fb675edcfe266cbad7223a` | `urn:c2pa:8824cde9-9672-4ef1-95c6-5df8b69d322b` | `reed-ashcroft-pass-overhead-right.webp` |
| Juniper Vale | 1 | `f4c63e9c1eb7efb6f63132e860fbd1770278efae50436b75bac8474d8a41f61c` | `urn:c2pa:04a84ded-b735-4d59-b786-879d38d7ad2f` | `juniper-vale-pass-overhead-right.webp` |

Each 1536×1024 RGBA source has exactly six complete, distinct figures at alpha threshold64, in row-major order. Every pose has empty hands and no visible uniform numbers or ball. The source claim and XMP instance IDs are recorded because the image-generation response did not expose a separate job ID. The component packer isolates existing figures and performs uniform resize and transparent placement only; each lossless atlas is 288×192 with 96×96 cells and six unique decoded frame hashes. Source crops, scale and atlas geometry are in the two `*-pass-overhead6-layouts.json` files.

## Native review

The source and packed cells were inspected over light and dark backgrounds. The right-facing art preserves each athlete's canonical identity and human anatomy. The overhead gather, release and follow-through are distinct; frame3 is the release pose. The registered canon mirror policy allows horizontal body mirroring, with no fixed-side detail or handed prop introduced by these clips.

Separate athlete-specific ball tracks are in `src/core/animation.js`. At release, Reed uses height2.15 / forward12.5 and Juniper uses height2.15 / forward10.5. Native Canvas previews at standard scale and zoom120 load112 images and capture87 snapshots per athlete. Both clips select production art in each facing, and the separate ball meets the raised hands at release. Screenshots are under `artifacts/native-render-preview/{reed-ashcroft,juniper-vale}{,-zoom120}`.
