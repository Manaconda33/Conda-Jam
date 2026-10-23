# J.76 Juniper Vale Reverse Dunk Implementation Plan

> **For agentic workers:** Use the native implementation path under the user's standing continuous-development authorization. Complete each checkbox and validation before pushing.

**Goal:** Add fifteen reviewed original Juniper Vale `dunk-reverse` poses and a separate athlete-specific ball track, raising Juniper to22/29 required clips.

**Architecture:** Follow J.74/J.75 production: generate a right-facing transparent 5×3 source using Juniper's canonical reference, preserve generation and cleanup provenance, isolate and pack the fifteen original poses to the reviewed 128×96-cell atlas, register it with J.01-approved mirroring, and wire/test the separate runtime ball track. Keep source art, runtime code, atlas, manifest, generated `dist`, audit, and handoffs synchronized.

**Tech Stack:** Existing image generation tool, Python/Pillow dunk packer, JavaScript animation runtime and `node:test`, project audit/build scripts, Chromium E2E.

**Spec:** `docs/JAMVERSE_96_CODEX_MASTER_PROMPT.md`, `docs/SESSION_HANDOFF.md`, and roster/action ordering in `HANDOFF.md`.

## Global Constraints

- Preserve Juniper Vale as a compact natural human with her canonical face, high dark-purple curls and gold tie, blank purple/gold Condas kit, dark knee pads, and purple/gold shoes.
- Keep the basketball separate from sprite artwork; track it on Juniper's own hand coordinates.
- Author fifteen distinct complete poses; do not copy, mirror, interpolate, or count held frames as drawings.
- Use the existing J.01 reviewed safe-mirroring policy and shared dunk markers: takeoff4, catch10, peak14, release21, finish23, land30.
- Preserve verbatim prompts, generation IDs, raw and accepted sources, rejected generations, cleanup history, hashes, layouts and review record.

## Review Focus

- Identity, anatomy, kit, true alpha, unique complete poses, and clear behind-the-crown reverse carry: source review on light and dark grounds.
- Separate ball stays on Juniper's hand during the turn and reaches the release hand in both facings: runtime tests and native previews.
- Mirrored pose selection stays within approved J.01 asymmetry: sprite selection test in both facings.
- Atlas source, frame hashes, provenance and action count remain aligned: strict asset audit and manifest test.
- Full game startup and match/season journey remain intact: full tests, build and Chromium E2E.

---

### Task 1: Author and integrate J.76

**Files:**
- Create: `tools/generate-art/j76-juniper-vale-dunk-reverse-prompt.md`
- Create: `tools/generate-art/juniper-vale-dunk-reverse15-{layouts,provenance}.json`
- Create: `tools/generate-art/sources/j76-juniper-vale-dunk-reverse*`
- Create: `public/assets/animation/juniper-vale-dunk-reverse-right.webp`
- Modify: `public/assets/animation/manifest.json`, `src/content/animation-assets.js`, `src/core/animation.js`, tests, generated `dist`, `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/animation-production/{ASSET_STATUS.md,GENERATED_POSES.md,ASSET_AUDIT.json}`, `docs/ANIMATION_ASSET_AUDIT.md`.

**Interfaces:** Existing `animationClips['dunk-reverse']`, `anchorTick`, `sampleBallHeight`, `sampleBallForward`, `selectProductionSprite`, J.01 mirror review, and `package-dunk15.py`.

- [x] Write failing runtime and sprite tests for all fifteen reviewed Juniper poses, both facings, her reverse carry behind the crown, separate-ball hand positions, release21 and finish23.
- [x] Verify those tests fail before wiring the runtime track or atlas.
- [x] Generate and review the source; retain rejected candidates and cleanup provenance; pack, register, and add the Juniper-specific ball track.
- [x] Run focused tests, full `npm test`, lint, content validation,100-match simulation,36 packer tests, report-only strict asset audit, build, full Chromium E2E, and standard/zoom120 native previews.
- [x] Update handoffs/status/audit with Juniper22/29 clips and188 drawings.
- [ ] Push the validated code checkpoint and verify GitHub Pages.
- [ ] Record the deployment in a follow-up documentation commit.
