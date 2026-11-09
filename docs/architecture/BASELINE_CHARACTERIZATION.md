# JAMVERSE '96 match-control baseline characterization

**Read-only source / test characterization. Not a player-visible bug-fix PR.**

## Source and authorization boundary

- Baseline: `main` commit `7d96e1bbb5e966a48f7748e87127f1008b1c25e8` (November 9, 2026).
- This change is intentionally stacked behind the **draft and unmerged** Captain Studio v3 policy. It may not merge before that policy has independently passed and received owner merge approval.
- Characterization adds no runtime modules, saved-data fields, dependencies, artwork, production gates, deployments, or Myth/Codex worktree changes.
- Historical Captain Studio expectations remain 746 inherited findings (706 missing directional clips, 40 historical prompt disclosures), 17 original pinned source blobs, and no art/pilot/production authorization.

## Authoritative sources and owner

| State or action | Current owner | Direct source evidence |
| --- | --- | --- |
| Active court roster and bench | `match.players`, `match.lineups` in simulation | [`simulation.js` L41–86](../../src/core/simulation.js) |
| Human control identity | Browser `controlled`, `keyboardPlayers`, `ui.gamepadIds` | [`main.js` L65, 205, 270–273](../../src/main.js) |
| Human vs CPU per simulation tick | `inputFrames` IDs and `match.humanPlayerIds` | [`simulation.js` L294–320, 427–430](../../src/core/simulation.js) |
| Substitution trigger | Keyboard `p`/`o`, gamepad pass during break | [`main.js` L265, 285](../../src/main.js) |
| Pause and quit | `match.pause`, `mode`, dialog and audio state | [`main.js` L205–214, 265–290](../../src/main.js) |
| Action edge semantics | `keys`/`pressed` and `ui.gpPending` | [`main.js` L257–273](../../src/main.js) |
| Ball/action/score authority | Deterministic simulation | [`simulation.js` L104–124, 173–288, 410–445](../../src/core/simulation.js) |
| Persisted preferences and mode progress | `loadPreferences` + browser `save()` | [`preferences.js` L3–53](../../src/core/preferences.js), [`main.js` L188, 287](../../src/main.js) |

## Characterized behavior (verified in code, tests added)

1. `substitutePlayer(match, team)` only succeeds during `match.phase === 'break'`, rotates the partner/bench athlete IDs and preserves the previous partner's box score. The active **array slot** remains in place.
2. `stepMatch` decides who is human-controlled by the presence of **athlete IDs** in the input tape. A stale input ID is still treated as an input ID but does not claim the substituted athlete's new ID. The browser's controller maps are independent of the substitution operation.
3. A pause-press input toggles `match.pause`; while paused, normal ticks do not advance clocks, RNG or ball state. Keyboard/gamepad/browser pause orchestration is split across event handlers.
4. `commitScore` is protected by attempt-ID idempotence and final-phase guard.
5. Seeded input sequences with the same post-substitution active ID yield deterministic model snapshots.
6. Gamepad button mapping and analog movement are pure input adapters; browser edge detection is separate.

## Suspected player-visible risks, not yet reproduced

- **Control detachment after substitution:** browser controller maps can continue pointing to a benched ID. Expected symptom: AI controls the new on-court partner instead of the former player's controller. Reproduce in local same-team two-player and gamepad modes; don't report a confirmed user-visible bug before that.
- **Pause/quit reason loss:** multiple paths mutate `match.pause`; canceling quit unconditionally resumes. Reproduce from an already-paused game, and from focus-loss/quit-dialog overlap.
- **Touch held-key cleanup:** keyboard and touch share key state. Reproduce pointer held during blur, visibility change and quit; examine key edge and controls after resume.
- **Persistence failure observability:** local storage failures are swallowed; establish whether users can distinguish an unsaved result, without modifying schema or claiming historical loss.

## Reproducible browser test protocol for the next approved stage

1. Capture `main` commit and settings, deterministic seed, control mode, and browser/device mode.
2. Start same-team 2P with captain + partner. Record `window.jamverse.controlledPlayers`, `state.players.map(p=>p.id)`, `state.lineups`, `state.humanPlayerIds` before and after `p` at a quarter break.
3. After the period restarts, move only the P2 controls. Record which player physically moves and whether the new partner is claimed as human in the active input set. Repeat with a gamepad and then four-pad-only mode; test disconnect/reconnect.
4. Repeat pause with Enter, gamepad Start, window blur, visibility change, and quit/cancel. Confirm unchanged seed, RNG, clocks, ball, score, animation tick, and no duplicate record write while paused.
5. Repeat with a touch pointer down during focus loss and quit, ensuring no sticky movement or repeated action release.
6. Record actual browser screenshots/state snapshots and explicit pass/fail results. A passing unit test is not visual gameplay acceptance.

## Characterization tests in this PR

`tests/match-control-characterization.test.js` covers guarded substitution, active-slot vs athlete-ID distinction, stale versus current human input ID, frozen pause ticks, idempotent scoring, deterministic replay, and gamepad adapters.

These tests target existing core behavior and must pass without changing production code. They do not claim that browser substitution, physical controllers or touchscreen interruption has been tested. The browser cases above are required before approving any behavior change.

## Constraints on subsequent PRs

- Controller ownership is **stable court slot**, resolved to the currently active athlete ID each frame. The match simulation remains authoritative for period/ball/action state.
- Keep 60 Hz ticks, existing seed/input tape behavior, old save format `jamverse96-v5`, and public-facing game controls except separately reviewed bug corrections.
- Do not touch animation atlas/track/prompt provenance, source pins, Captain Studio activation gates, or the separate Myth recovery work.
- Every later behavior PR needs deterministic and browser regression evidence, independent review and a fresh owner merge decision.
