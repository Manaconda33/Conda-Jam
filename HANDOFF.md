# JAMVERSE ’96 — Active Handoff

Updated 2026-10-22. This file is the current resume point; `docs/SESSION_HANDOFF.md` retains the longer historical record.

## Mission and completion status

Continue issue [#3](https://github.com/Manaconda33/Conda-Jam/issues/3) against the full authoritative spec at `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. The user wants the finished, playable 1990s arcade basketball game and complete, canon-faithful 2D animation assets. The game is playable; the full specification and animation assignment are **not complete**. Keep developing autonomously, generate the assets, run the requested build/tests/match validation, publish to GitHub Pages, and update this handoff as work advances. The user has authorized pushing and deployment; do not ask for that approval again.

Issue #3's animation target is 29 action clips per athlete for all105 athletes: 30,765 target authored drawings (29,190 minimum). Runtime mirroring, held frames, duplicate crops and rejected source drawings do not count as authored art. Full canon descriptions and anatomy restrictions are in the master spec. Issues #1 and #2 also remain open; the full floor/arena presentation and real-browser portrait acceptance work is not complete.

## Repo, branch, deployed preview

- Repository: `/workspace/Conda-Jam`, branch `main`.
- Latest pushed game checkpoint: `ccc3c5ebc30b8387198f09339a84e30798942f2e` (J.28, Nox Striker and Viper Veil).
- GitHub Pages workflow run #63 succeeded: <https://github.com/Manaconda33/Conda-Jam/actions/runs/39856300881>.
- Preview: <https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=ccc3c5e> (fully embedded standalone game).
- `dist/JAMVERSE_96.html` remains the J.28 build. J.29 source art described below is not registered in game code or included in the deployed preview.

## Current J.29 source checkpoint

J.29 is Moss Granite and Thump Alder, Greenwall Giants. References and generated source sheets are local and should be committed with this handoff checkpoint. No J.29 atlases are registered in `public/assets`, the production manifest, runtime animation selection, or `dist`.

**Moss Granite** — adult human man with warm medium-deep brown skin, dark eyes, full black beard, dark wavy hair under a moss/olive-green and gold athletic headband, broad muscular build; moss-green/stone/gold kit.

- Accepted 28-pose base: `tools/generate-art/sources/moss-granite-locomotion-base.png`.
- The intended14-pose supplement is rejected and renamed `moss-granite-locomotion-supplement-14-incomplete-fused.png`. Alpha audit found12 separate components, including a wide fused group. Do not crop the fused bodies into supposed frames. Moss has no assembled42-pose sheet yet; generate a new supplement with large transparent margins/gutters and independently separated figures.
- Reference crops: `tools/generate-art/references/moss-granite-{portrait,gameplay}-reference.png`.

**Thump Alder** — adult human woman with fair warm-peach skin, dark eyes, abundant black wavy hair in large high rounded ponytail puffs with green/orange/gold ties, natural athletic-curvy build; moss-green/stone/gold kit.

- Accepted28-pose base: `tools/generate-art/sources/thump-alder-locomotion-base.png`.
- First14-pose supplement was rejected: two outer drawings are clipped and a pair touches. It is archived as `thump-alder-locomotion-supplement-14-edge-clipped-rejected.png`.
- Safe-margin retry has14 separated, in-bounds drawings at `tools/generate-art/sources/thump-alder-locomotion-supplement-14.png`.
- Thump's42-pose assembled source and provenance now exist at `tools/generate-art/sources/thump-alder-locomotion42.png` and `tools/generate-art/thump-alder-locomotion42-provenance.json`. This source has not yet been packed into five atlases or visually approved in the native renderer.
- Reference crops: `tools/generate-art/references/thump-alder-{portrait,gameplay}-reference.png`.

Source prompts and image-generation IDs: `tools/generate-art/j29-locomotion-prompts.md`. Source assembly map: `tools/generate-art/assemble-supporting-locomotion42.py`. The accepted standard map fills idle6, idle-ball4, dribble10, run11 and dribble-run11 without generated duplicates. Pack only after component, border, identity and anatomy review.

## Next actions

1. Read this handoff and the full master spec before changing art or game code.
2. Generate a clean Moss supplement (three upright ball-ready, four upright run, three low stationary dribble, four low dribble-run poses). Ensure all14 figures are separate, in bounds and have true transparent alpha. Assemble Moss's42 original poses and preserve the rejected sheet.
3. Pack/review Thump's five locomotion atlases; do the same for Moss after a valid source exists. Update manifest, generated JS, canon mirror review, athlete hand tracks, focused animation tests, native previews, production inventory and QA/handoff records. Keep character identity/anatomy exact; use the reference crops and master spec.
4. Continue image generation through all missing canonical roster members in order, then fill missing action clips for every represented athlete. Do not stop at a compile-only or menu-only state.
5. Run the requested build, automated tests, full-match/browser journey, strict asset audit, and repair significant failures. Update standalone `dist/JAMVERSE_96.html`, push, verify the Pages run succeeds, and refresh the preview SHA in this file.

## Latest validated baseline

Validation below was performed at J.28 before the unintegrated J.29 source work:

- `npm run build`; `npm test` (all24 files); `npm run lint`; `npm run validate:content` (35 franchises/105 athletes/35 captains); `npm run simulate:league` (100 full matches); `python tools/generate-art/test_package_motion.py` (12 checks); and the offline Chromium `npm run test:e2e` journey all passed.
- J.28's ten reviewed atlases load in the native renderer, select all five locomotion actions in both facings, and use character-specific ball tracks. Full details and test counts are in `docs/SESSION_HANDOFF.md` and `docs/QA_REPORT.md`.
- Strict animation audit is still incomplete:510 reviewed clips /4,357 drawings /91 represented athletes,2,187 missing-clip findings,14 athletes without registered clips, and three below-target clips. Full animation coverage across105 athletes remains open. The J.29 raw source does not change that audit.
- GitHub reports repository `Manaconda33/Conda-Jam` is public. Pages run #63 is successful.

## Copy/paste resume prompt

> Continue the JAMVERSE ’96 implementation in `/workspace/Conda-Jam`. Read `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, and the entire authoritative specification `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md` first. The game is playable, but the full task is unfinished. The last deployed game is J.28 at commit `ccc3c5e` (Pages run #63 succeeded). Start by checkpointing the handoff commit if it is not already pushed. J.29 source generation is partial: Thump Alder has a generated28-pose base, a rejected clipped supplement, a valid14-pose retry, and an assembled42-pose source/provenance, but no atlas integration or runtime preview. Moss Granite has a valid28-pose base; its proposed14-pose supplement has fused figures and was rejected. Generate a safe replacement supplement for Moss, complete and review both athletes' original sprites using `tools/generate-art/j29-locomotion-prompts.md` and the image-generation tool, then integrate them through atlas registration, animation selection, mirror review, athlete-specific ball tracks, native previews and tests. Preserve the exact human identities and anatomy in the references/master spec. Then continue across the complete105-athlete roster and all required action clips, gameplay polish, full build/test/match validation and Pages deployment. Keep this handoff current, push meaningful checkpoints, verify Actions before reporting a preview, and do not stop at a plan or a compiling prototype. The user has already authorized continuous work, image generation, tests, pushes and deployment; do not ask for approval again.
