# Animation asset status

Issue 3 remains incomplete. The decoded strict audit inspects **666 clips / 5,844 authored drawings** across all **105 athletes**. It reports **2,437 missing clips**, 3 clips below target (Dorian Mycel dribble and dribble-run; Luca Velori run), and 4 inherited `prompt-not-verbatim` findings. No athlete is unrepresented. Paprika, Reed and Juniper are complete at **29 clips / 293 drawings** each. Keeg has **25/29 clips / 243 drawings**, including J.103 double dunk.

J.103 `7f925af` is pushed to `main` and deployed in Pages run #141 (https://github.com/Manaconda33/Conda-Jam/actions/runs/40049640158). Preview: https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=7f925af. The next action is Keeg `dunk-clutch`.

Dorian Mycel has a complete source-only package: 29/29 keys including the newly authored `idle-ball`, with25 new action atlases /255 distinct drawings. Source hashes, accepted provenance, layouts, atlas bounds, nonblank unique frame crops and exact 29-key coverage passed an independent check. These assets are not in the registered totals above until roster-order integration after Moxie.

Moxie Capwell, Accu, Nova Stitch and Echo Catwalk also have complete, independently verified source-only packs: each covers all29 runtime keys, with the new atlases totaling251 drawings for Moxie and241 each for the other three. Their sheets, source hashes, prompts, layouts, provenance, unique-frame and separate-ball checks passed. These generated assets are committed but remain outside the registered audit until roster-order integration after Keeg.

New verified source-only checkpoints: Marco Vellum now has9/29 source clips including `pass-behind`; Krios has8/29 including `pass-overhead` (with `shoot` and `pass`); Sable Regent has15/29 including `steal`. The Krios atlas/source hashes, exact prompts, six-frame layouts, separate ball tracks and accepted/rejected timing history were checked; those three action atlases remain outside the five-key runtime manifest. Keeg J.104 `dunk-clutch` has15 authored poses and is ready for roster-order integration; the deployed runtime remains J.103 until that integration passes.

Full target:30,765 authored drawings across3,045 required clips, with a minimum of29,190 drawings. Mirroring, holds, duplicate crops and rejected source art do not count. See `docs/ANIMATION_ASSET_AUDIT.md` and `docs/animation-production/GENERATED_POSES.md` for decoded detail.
