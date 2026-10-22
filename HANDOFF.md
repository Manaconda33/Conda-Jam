# JAMVERSE ’96 — Active Handoff

Updated 2026-10-22. This file is the concise resume point; `docs/SESSION_HANDOFF.md` preserves the longer production history.

## Mission and status

Continue issue [#3](https://github.com/Manaconda33/Conda-Jam/issues/3) against the full authoritative specification at `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`. The game is playable, but the game specification and animation assignment are not complete. The user has authorized continuous development, image generation, tests, pushes and GitHub Pages deployment; do not request that authorization again.

The animation target is29 action clips per athlete across105 athletes:30,765 target drawings (29,190 minimum). Mirroring, held frames, duplicate crops and rejected source drawings do not count. Issues #1 and #2 also remain open: full arena presentation and real-browser portrait acceptance need further work.

## Repository and deployment

- Repository: `/workspace/Conda-Jam`, branch `main`.
- Starting handoff/source checkpoint: `99c1c45d6ff879e967bd60c0f8a94bb57d14b17e`.
- Previous deployed game: J.28 at `ccc3c5ebc30b8387198f09339a84e30798942f2e`; Pages run #63 succeeded.
- Previous preview: <https://manaconda33.github.io/Conda-Jam/JAMVERSE_96.html?v=ccc3c5e>.
- Current J.29 integration is in this working tree; it has not yet been checkpointed or deployed. Update this section after pushing and verifying Pages.

## J.29 — Moss Granite and Thump Alder

Both Greenwall Giants now have original reviewed 42-pose locomotion sources, five packed right-facing atlases, production manifest registration and runtime selection, canon-reviewed mirror policy, separate ball tracks and focused tests. They use five actions: idle6, idle-ball4, dribble10, run11 and dribble-run11. Each still needs the other24 action clips.

**Moss Granite** remains an adult human man with warm medium-deep brown skin, dark eyes, full black beard, dark wavy hair under a moss/olive-green and gold headband, broad muscular build, and moss/stone/gold kit. His accepted28-pose base plus safe14-pose retry assemble to42 distinct in-bounds figures. The fused supplement was rejected and preserved; it is never cropped into frames.

**Thump Alder** remains an adult human woman with warm-peach skin, dark eyes, abundant black waves in large high rounded puffs with green/orange/gold ties, natural athletic-curvy build, and moss/stone/gold kit. Her accepted28-pose base plus safe14-pose retry assemble to42 distinct in-bounds figures. The clipped/touching supplement was rejected and preserved.

- Exact prompts, generation IDs, rejected attempts, raw sources, source maps and provenance: `tools/generate-art/j29-locomotion-prompts.md`, `tools/generate-art/assemble-supporting-locomotion42.py`, `tools/generate-art/*granite*`, and `tools/generate-art/*alder*`.
- Reviewed native preview captures: `artifacts/native-render-preview/moss-granite`, `thump-alder`, `moss-granite-zoom120`, and `thump-alder-zoom120`. Both athletes load104 images /87 snapshots; all five clips select production sprites in each facing.
- Canon mirror review: `docs/animation-production/CANON_MIRROR_REVIEW.md`; source and runtime policy in `src/content/animation-mirror-policy.js`.
- Current decoded audit: 520 reviewed clips /4,441 drawings /93 represented athletes. It reports2,235 missing clips,12 unrepresented athletes and three clips below target. The J.29 athletes' remaining24 clips each account for48 missing-clip findings. The strict audit correctly remains incomplete.

## Required continuation

1. Finish remaining clips across the full105-athlete roster, keeping art original and canon-faithful. Use the master spec for required action names, per-clip frame targets, identities and anatomy. The current inventory and strict audit are `docs/animation-production/GENERATED_POSES.md`, `docs/animation-production/ASSET_STATUS.md` and `public/assets/animation/ASSET_STATUS.json`.
2. Continue gameplay and presentation polish and address the outstanding spec/known issues.
3. Run the full build, automated tests, lint/content validation, 100-match simulation, Python atlas packaging checks, full-match/browser E2E and strict asset audit. Repair meaningful failures. The audit should stay marked incomplete until its actual full-roster criteria pass.
4. Build the self-contained `dist/JAMVERSE_96.html`, push a meaningful checkpoint, verify the GitHub Pages workflow, and update this file with the deployed commit and preview URL.

## Latest J.29 checks performed

- Both athletes' five packed atlases reviewed on light and dark grounds; right-facing sources retain transparent backgrounds.
- Native Canvas previews at standard scale and zoom120 loaded104 images /87 snapshots per athlete and selected all five clips in both facings.
- `node tests/animation.test.js`:109/109 pass; `node tests/animation-sprites.test.js`:25/25 pass. Tests verify separate ball placement, five reviewed clips, exact frame counts, distinct frames, accepted provenance, and both-facing production selection.
- Strict asset audit refreshed: 520 clips, 4,441 drawings, 93 athletes; still incomplete with2,235 missing clips,12 missing athletes and three below-target clips.
- Full suite/build/browser run is pending for this checkpoint.
