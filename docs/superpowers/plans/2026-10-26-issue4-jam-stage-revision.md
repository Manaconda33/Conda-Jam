# Issue 4 NBA Jam Stage Revision Implementation Plan

> **For agentic workers:** Follow this approved plan task by task; use test-first changes and visual review after every capture revision.

**Goal:** Make the opt-in Issue #4 stage match the supplied NBA Jam references in court depth, backboard orientation and detail, elevated attack poses, and dunk camera framing without changing production gameplay or animation assets.

**Architecture:** Keep the stage renderer isolated behind `?stagePreview=1`. Expand only the rendered court depth and keep athlete sprite scale independent of that expansion. Model the hoop as a projected court-plane assembly aligned to the endline, and add a smoothed preview-only attacker camera that preserves gameplay camera behavior.

**Tech Stack:** Existing JavaScript Canvas renderer, Node test runner, Playwright/Chromium capture script, current animation and court projection helpers.

**Spec:** `docs/ISSUE_4_STAGE_PREVIEW.md` plus the owner-approved target direction in conversation and four retained NBA Jam screenshots.

## Global Constraints

- Keep all new visuals and camera motion behind `?stagePreview=1`.
- Leave simulation court bounds (0–200 × 0–100), scoring, authored sprites, animation tracks, and production Pages unchanged.
- Preserve court player sprite scale at matched y/zoom while increasing north–south screen space.
- Keep distinct world tracks for ball and athlete; don't fake contact by changing authored animation assets.
- Capture both mirrored endlines and verify court lines, hoop, players, ball, and camera remain in frame.

## Review Focus

- Far/near player sprite height remains stable when the rendered Y depth expands: assert equal `stageDepthScale` and standing-height values at matching y/zoom.
- Board plane stays parallel to projected endline in both attack directions: assert projected board/endline angular error <= 2°.
- Rim ellipse and net remain attached to hoop court coordinates at both ends: assert projected center and arc bounds mirror within one logical pixel.
- Dunk camera follows a moving attacker without hiding board, rim, base, or ball: assert eased focus and test camera safety bounds; review a short sequence.
- Portrait layout, production camera, and scoring remain unchanged: assert `stagePreview` opt-in and run existing regression suite.

---

### Task 1: Expand court depth without scaling athletes

**Files:** `src/render/jam-stage.js`, `tests/jam-stage-projection.test.js`.

- [ ] Add a failing projection test proving projected court depth increases by at least 12% while `stageDepthScale()` and standing sprite height at y=0/50/100 stay unchanged.
- [ ] Run `node tests/jam-stage-projection.test.js` and confirm the new depth assertions fail on revision 6.
- [ ] Adjust the stage Y floor mapping only; leave simulation bounds and sprite scale curve unchanged.
- [ ] Re-run the focused projection test and confirm all old and new assertions pass.

### Task 2: Rebuild the hoop as a perspective court-plane assembly

**Files:** `src/render/jam-stage.js`, `src/main.js`, `tests/jam-stage-projection.test.js`.

- [ ] Add failing geometry assertions for the backboard's alignment with the projected endline, near/far crossbar foreshortening, a court-plane rim ellipse, and support attachment in mirrored views.
- [ ] Replace the screen-axis rectangle and flat ellipse with projected board corners, rim points, net strings, padded post, brace members, and off-court base; keep the user-directed rim scale/placement open to measured refinement.
- [ ] Draw the board and support as depth-sorted parts so athletes correctly pass in front/behind them.
- [ ] Run focused tests, then capture left and right attack frames and inspect geometry visually.

### Task 3: Add attacker-centered dunk follow and high aerial framing

**Files:** `src/render/jam-stage.js`, `src/main.js`, `tests/jam-stage-projection.test.js`, `tests/camera-tracking.test.js`.

- [ ] Add failing tests for a smoothed preview focus that follows attacker x/y and jump apex, preserves normal camera behavior outside preview, and clamps framing to retain hoop and player.
- [ ] Add preview-only Y camera offset and dunk push-in; keep the HUD fixed and avoid changing `cameraZoom` preferences.
- [ ] Use existing authored dunk/shoot clips and separate ball tracks; adjust only the stage projection/lift needed to match target jump height and preserve ball-to-hand alignment.
- [ ] Capture approach, apex, and landing frames; verify the athlete rises at least 0.5 standing-body heights above the rim at peak and the ball stays at the authored hand/contact point.

### Task 4: Add court detail, refresh evidence, and validate

**Files:** `src/main.js`, `tools/capture-issue4-stage.mjs`, `docs/ISSUE_4_STAGE_PREVIEW.md`, `docs/QA_REPORT.md`, `HANDOFF.md`, `docs/SESSION_HANDOFF.md`, `docs/FEATURE_MATRIX.md`, current screenshots/manifest.

- [ ] Add failing render-level checks for projected paint, wood seams, and baseline/endline detail under the same court transform.
- [ ] Add perspective wood-plank joints and painted key markings without changing rules or score overlays.
- [ ] Capture a sequence for both attack directions, measure court depth/player scale/hoop alignment/jump height, and review all frames independently before accepting them.
- [ ] Run focused tests, full tests, build, lint, content validation, simulation, and Chromium E2E; update audit/handoff records and create a preview-only checkpoint.
- [ ] Obtain independent visual and code review; fix any critical/important mismatch and recapture before presenting the preview.
