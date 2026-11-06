# Jam Stage late-shot camera pan experiment — 2026-10-28

**Result: renderer-only projection pan at 120% is a viable framing candidate, not yet a production change.** The trial used current Jam Stage, the current 0.8 shot-flight scale, normal simulation, and unregistered Kraken shoot art/track overlays. No manifest, track, simulation, or production source was modified by this experiment.

## Tested camera transform

The harness intercepted `src/render/jam-stage.js` and changed the projected Y coordinate for every stage world point by:

```js
32 * Math.min(1, Math.max(0, (Number(zoom) || 100) - 100) / 20)
```

This adds 0 px at 100% and 32 logical canvas px at 120%. Because court markings, both hoop assemblies, actors, ball and shadows all use `projectJamStagePoint`, the same offset moves the whole stage scene while leaving fixed HUD text in place. It changes no simulation coordinates or event timing. Source screenshots are under `reed-ashcroft/` and `kraken/`; both `report.json` files contain hashes and simulation states for every capture.

## Results

- **Reed Ashcroft, registered production shooter:** both facings at 100% and 120%; 4/4 released on tick13 and scored 3 points on the correct side. No browser errors or failed requests. At 120%, late-flight frames at steps73/83 show the ball below the fixed HUD beside the backboard/rim area; the no-pan baseline hid the ball while leaving its shadow visible. At 100%, the original framing remains unchanged and the ball is visible.
- **Kraken, unregistered shoot candidate:** both facings at 100% and 120%; all 4/4 released on tick13 and scored 3 points. The 76 captures have no browser errors or failed requests. At 120%, the ball remains visible through flight; the score-complete capture records 3 points in both orientations.
- The pan preserves ball-to-rim geometry: it adds the same vertical translation to every projected world point. The fixed HUD does not move.
- At 120%, the near-sideline shooter’s shoes remain fully visible but sit within a few screen pixels of the canvas bottom; the ground shadow is partly cropped. That bottom margin needs a final visual check if this is adopted.

## Rejected trials

- A 24-logical-pixel projection offset still lets Reed’s late-flight ball overlap the fixed scoreboard boundary; see `../compare-projection-pan24/`.
- A `ctx.translate` injected into `render()` (32 px, then 80 px) did not move the rendered court/hoop in captures, so it was abandoned in favor of translating through the common projection function. Those scratch capture scripts/images remain in `../compare-camera-pan/` and `../compare-camera-pan-constant80/`.

## Recommendation and limit

If adopting a renderer fix, apply a common projection-space Y offset rather than scaling the ball alone. 32 logical px is the smallest tested value that clears the late ball below the HUD at 120%; 24 fails. The near-sideline bottom margin is the remaining visual limit to assess before integrating. This trial does not replace normal-loader review of the registered clip after any persistent change.
