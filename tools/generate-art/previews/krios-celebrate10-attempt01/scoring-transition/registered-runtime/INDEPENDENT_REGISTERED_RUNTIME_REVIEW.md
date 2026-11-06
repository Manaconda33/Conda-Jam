# Krios celebrate attempt01 — independent registered-runtime review

**Verdict: FAIL for this capture set.** This is a capture-harness defect, not a rejection of the atlas or source art. Preserve this set and rerun the first frame after an explicit current-canvas render.

## Checks passed

- The report identifies the production WebP atlas `./public/assets/animation/krios-celebrate-right.webp`, with runtimeIntegration `true` and candidateAtlasInjected `false`.
- The production `commitScore` transition starts Krios's `celebrate` clip at tick 0, records “Krios scores 2!”, updates the appropriate team's score to 2, and leaves the ball dead and unowned.
- In the 36 nonzero-tick screenshots, frames 1–9 are selected at the canonical starts `[5,10,16,24,34,44,52,59,65]` across both facings and 100%/120% zoom. The registered sprite URL, frame indices, mirror flags, scoreboard, dead/unowned ball state, and anatomy/uniform appearance are correct. I saw no clipping, spill, occlusion, or HUD collision in these captures. The report records zero browser errors.

## Blocking defect

All four `frame0-tick0` PNGs (both facings at both zooms) are essentially black. Their mean channel values are about 0.016 and the only detected nonblack row is a one-pixel baseline at y=631. The harness calls `commitScore` and records tick 0, then captures tick 0 without invoking the renderer. The subsequent nonzero ticks call `jamverse.tick`, which renders, so those images are valid. Call `window.jamverse.tick(0, [])` (or the production render function) after the scoring transition and before the tick-0 screenshot, then regenerate all four first-frame captures and rerun the registered-runtime review.

Because the first canonical pose is absent from the actual capture images, this set cannot establish complete ten-frame presentation. Do not mark celebrate production review complete from these screenshots.

## Review 02 — 2026-10-28 corrected tick-0 capture

**Verdict: FAIL for production runtime acceptance; pose 9 is clipped at the court edge.** The original black tick-0 capture defect is corrected: all four tick-0 screenshots now render frame0, Krios, the scoreboard, and the current Jam Stage. Preserve the original Review 01 rejection above.

### Passed

The report still confirms normal-loader integration (`runtimeIntegration=true`, `candidateAtlasInjected=false`), and `commitScore` starts `celebrate` at tick0 with the expected 2-point score and dead/unowned ball. All 40 records select the registered Krios atlas, expected frame indices at `[0,5,10,16,24,34,44,52,59,65]`, and the correct mirrored left-facing art. Both zooms and both orientations use the expected score side. The browser error list is empty. The corrected frame0 images are no longer blank. Visual spot checks of several poses show coherent Krios anatomy, consistent charcoal/ember uniform, readable gestures, and no visible chroma spill or HUD collision.

### Blocking presentation issue

Krios drifts toward the right edge as time advances during the scoring transition. At tick65/frame9, his body is cut by the right canvas edge in `left-frame9-tick65-zoom100.png`, `left-frame9-tick65-zoom120.png`, and `right-frame9-tick65-zoom120.png`; the remaining right-facing 100% capture leaves little edge clearance. Frame8 at 120% is also close to the edge. This is a runtime/camera staging issue in the capture, not a finding against the source atlas. Rework the gameplay capture setup or centering so every canonical pose remains fully visible, then regenerate and review all frames.

The harness invokes production `commitScore` directly, rather than simulating a made shot. It verifies the score-to-celebration state transition and normal renderer selection, but it does not verify shot flight/scoring physics. Record this scope accurately in the eventual acceptance evidence.

## Review 03 — 2026-10-28 centered score-transition capture

**Verdict: PASS for registered production scoring-transition runtime review.** Review 01's tick-0 black screenshots and Review 02's end-of-clip edge crop remain preserved above as superseded capture failures; they do not describe this regenerated set.

The new 40-capture set now renders tick0 and keeps the full Krios figure in frame at all ten canonical starts, both facings and 100%/120% zoom. I reviewed the complete 40-image contact sheet and full-size endpoints, including all tick65 captures. No pose is clipped by the viewport; frame8 also has safe clearance. The poses remain readable at runtime scale, with consistent Krios identity, red skin, ram horns, beard, charcoal/ember kit and connected anatomy. I found no visible green spill, fallback art, HUD overlap or browser error.

The report confirms that the registered `./public/assets/animation/krios-celebrate-right.webp` was selected in normal-loader mode (`runtimeIntegration=true`, `candidateAtlasInjected=false`). `commitScore` starts `celebrate` at tick0 and produces the correct two-point score; all ten frame indices match their canonical starts, left-facing uses the expected mirror, and the basketball remains dead/unowned throughout. This verifies the production scoring transition and renderer selection. The capture invokes `commitScore` directly, so it does not independently verify a preceding shot's flight or scoring physics.
