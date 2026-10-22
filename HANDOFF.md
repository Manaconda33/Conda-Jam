# JAMVERSE ’96 — Active Handoff

Updated 2026-10-22. This file is the concise resume point; `docs/SESSION_HANDOFF.md` preserves the longer production history.

## Mission and status

Continue issue [#3](https://github.com/Manaconda33/Conda-Jam/issues/3) against the full authoritative specification at `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. The game is playable, but the game specification and animation assignment are not complete. The user has authorized continuous development, image generation, tests, pushes and GitHub Pages deployment; do not request that authorization again.

The animation target is29 action clips per athlete across105 athletes:30,765 target drawings (29,190 minimum). Mirroring, held frames, duplicate crops and rejected source drawings do not count. Issues #1 and #2 also remain open: full arena presentation and real-browser portrait acceptance need further work.

## Repository and deployment

- Repository: `/workspace/Conda-Jam`, branch `main`.
- Starting handoff/source checkpoint: `99c1c45d6ff879e967bd60c0f8a94bb57d14b17e`.
- Latest deployed game: J.30 at `c38d819fa2a5e4c0a3b1a476873a12ea1d6b3480`; Pages run #65 succeeded: <https://github.com/Manaconda33/Conda-Jam/actions/runs/39866201859>.
- Preview: <https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=c38d819>.
- J.29 and J.30 are pushed and deployed. J.31 identity references and prompts are checkpointing; image generation retries are currently returning HTTP 400 `Unknown parameter: reasoning` from the image-generation service.

## J.29 — Moss Granite and Thump Alder

Both Greenwall Giants now have original reviewed 42-pose locomotion sources, five packed right-facing atlases, production manifest registration and runtime selection, canon-reviewed mirror policy, separate ball tracks and focused tests. They use five actions: idle6, idle-ball4, dribble10, run11 and dribble-run11. Each still needs the other24 action clips.

**Moss Granite** remains an adult human man with warm medium-deep brown skin, dark eyes, full black beard, dark wavy hair under a moss/olive-green and gold headband, broad muscular build, and moss/stone/gold kit. His accepted28-pose base plus safe14-pose retry assemble to42 distinct in-bounds figures. The fused supplement was rejected and preserved; it is never cropped into frames.

**Thump Alder** remains an adult human woman with warm-peach skin, dark eyes, abundant black waves in large high rounded puffs with green/orange/gold ties, natural athletic-curvy build, and moss/stone/gold kit. Her accepted28-pose base plus safe14-pose retry assemble to42 distinct in-bounds figures. The clipped/touching supplement was rejected and preserved.

- Exact prompts, generation IDs, rejected attempts, raw sources, source maps and provenance: `tools/generate-art/j29-locomotion-prompts.md`, `tools/generate-art/assemble-supporting-locomotion42.py`, `tools/generate-art/*granite*`, and `tools/generate-art/*alder*`.
- Reviewed native preview captures: `artifacts/native-render-preview/moss-granite`, `thump-alder`, `moss-granite-zoom120`, and `thump-alder-zoom120`. Both athletes load104 images /87 snapshots; all five clips select production sprites in each facing.
- Canon mirror review: `docs/animation-production/CANON_MIRROR_REVIEW.md`; source and runtime policy in `src/content/animation-mirror-policy.js`.
- Current decoded audit: 530 reviewed clips /4,525 drawings /95 represented athletes. It reports2,283 missing clips,10 unrepresented athletes and three clips below target. Moss Granite, Thump Alder, Camden Union and Poppy Stitch each still need24 action clips. The strict audit correctly remains incomplete.

## J.30 — Camden Union and Poppy Stitch

- Camden and Poppy are London Royal Spots partners. Runtime roster mapping uses zero-based cells58 and59; the stale supporting-gameplay prompt table was off after cell14 and has now been corrected against `src/content/teams.js`. `tests/supporting-gameplay-atlas.test.js` now asserts every prompt-table partner/alternate name, team and slot against the runtime roster. First generated candidates based on the wrong row are preserved as rejected art. Correct portrait/gameplay crops are in `tools/generate-art/references/`.
- Each athlete now has an accepted correct-cell28-pose base and safe14-pose supplement assembled into42 complete poses. Camden is a warm-tan, clean-shaven human man with short dense dark navy hair and a cobalt headband. Poppy is a fair-warm human woman with vivid red curls in a high ponytail and a navy headband. Both keep their London Royal Spots cobalt/red/white kit and natural human anatomy.
- Five atlases per athlete are registered; canon mirror policy and separate right-hand ball tracks are reviewed. Focused tests pass. Native Canvas previews at standard and zoom120 load109 images and capture87 snapshots each; all five clips select production art in both facings. Captures are under `artifacts/native-render-preview/{camden-union,poppy-stitch}{,-zoom120}`.
- Exact prompts, generation IDs, rejected candidates, source hashes, references, source maps and atlas provenance are recorded in `tools/generate-art/j30-locomotion-prompts.md`, `tools/generate-art/assemble-supporting-locomotion42.py` and `tools/generate-art/*-locomotion42-provenance.json`.

## J.31 source work — Draya Staffwind and Kael Rune

- Runtime roster mapping places Draya at zero-based cell60 and Kael at cell61. Exact portrait cells and gameplay crops with the primary in-cell athlete component isolated are saved under `tools/generate-art/references/`.
- Draya remains a warm medium-brown human woman with long chestnut locs in a high ponytail and gold ties; Kael remains a warm medium-brown human man with short dark curls and a close beard/mustache. Both retain Coppermoon Skyblades plum/copper/pale-gold kit and natural human anatomy.
- Base and safe-supplement prompts are recorded in `tools/generate-art/j31-locomotion-prompts.md`. Image-generation attempts for both corrected-cell source sheets currently fail with HTTP400 `Unknown parameter: reasoning`; retry the image tool until source generation succeeds. No J.31 sprites or atlases are registered.

## Required continuation

1. Finish J.31 in runtime roster order: Draya Staffwind and Kael Rune of Coppermoon Skyblades are the next unrepresented pair (reference cells60 and61).
2. Finish remaining clips across the full105-athlete roster, keeping art original and canon-faithful. Use the master spec for required action names, per-clip frame targets, identities and anatomy. The current inventory and strict audit are `docs/animation-production/GENERATED_POSES.md`, `docs/ANIMATION_ASSET_AUDIT.md` and `public/assets/animation/ASSET_STATUS.json`.
3. Continue gameplay and presentation polish and address the outstanding spec/known issues.
4. Run the full build, automated tests, lint/content validation, 100-match simulation, Python atlas packaging checks, full-match/browser E2E and strict asset audit. Repair meaningful failures. The audit should stay marked incomplete until its actual full-roster criteria pass.
5. Build the self-contained `dist/JAMVERSE_96.html`, push a meaningful checkpoint, verify the GitHub Pages workflow, and update this file with the deployed commit and preview URL.

## J.30 checks performed

- Source sheets and all ten packed atlases reviewed on light and dark grounds; identity, anatomy and transparency remain consistent.
- Native Canvas previews at standard scale and zoom120 loaded109 images /87 snapshots per athlete and selected all five clips in both facings. Rendered ball tracks were checked at idle-ball, dribble and dribble-run poses.
- `node tests/animation.test.js`:109/109 pass; `node tests/animation-sprites.test.js`:26/26 pass. Tests cover athlete-specific ball hand placement, correct reference cells, five reviewed clips, exact frame counts, unique crops, accepted provenance, and both-facing production selection.
- Strict asset audit: 530 clips, 4,525 drawings, 95 athletes; incomplete with2,283 missing clips,10 missing athletes and three below-target clips.
- J.30 full validation passed: build, all24 test files, lint, content validation,100-match simulation,12 atlas packaging checks and offline Chromium full-match/season E2E. Pages run #65 succeeded for `c38d819`; the preview link above contains the deployed game. The strict asset audit remains incomplete by design.
