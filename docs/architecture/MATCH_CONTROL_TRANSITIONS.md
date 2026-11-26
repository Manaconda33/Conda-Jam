# Match-control transition contract: design draft only

**Status:** Proposed architecture, not implemented. No runtime behavior changes authorized by this document.

## Decision

Introduce one small, dependency-free pure transition/assignment layer for the browser-to-simulation seam, starting with stable on-court control slots and pause/quit handling. Do **not** migrate ball physics, shot/action anchors, scoring, animation playback, persistence, or Captain Studio gates into a new state-machine framework.

## Nonduplicated authority

- `match.phase`, `match.pause`, ball ownership, animation, score and RNG stay authoritative in `src/core/simulation.js`.
- The browser owns its menu/dialog presentation and physical device identities.
- One narrowly scoped control-session object owns controller-to-slot associations and the quit-dialog context. It must not store a second authoritative copy of `match.phase`, score, pause flag, or active athlete roster.
- A **slot** is `{team: 0|1, position: 'captain'|'partner'}` (or another validated equivalent), resolved against `match.players` at the moment of input dispatch; an athlete ID identifies an occupant, not the controller's permanent assignment.
- For now, match.players has a stable two-athletes-per-team array order. Test this as an assumption; do not hard-code positions silently without invariant checks.

## Candidate pure interface (illustrative, not final code)

```js
// Proposed module: src/core/match-control.js
const decision = resolveControlEvent({
  event: { type: 'SUBSTITUTE_REQUEST', team: 0 },
  session,       // control claims + quit context
  matchView,     // read-only phase/pause/active slot IDs
});
// { accepted, reason, nextSession, effects }
// No DOM calls, audio, localStorage, clock advancement, random,
// network, direct simulation mutations, or asset work inside the resolver.
```

The browser applies accepted effects through existing sanctioned operations, e.g. `substitutePlayer(match, team)` or updates to the authoritative `match.pause`. The resolver may compute a new controller mapping, but must not silently change gameplay state outside the existing simulator.

## Proposed events / guards

| Event | Guard and intended decision | Effect boundary |
| --- | --- | --- |
| `START_MATCH` | Valid teams/session is in menu; clear old assignments | Existing `beginMatch` owns match construction |
| `ATTACH_CONTROLLER` | Connected device, available slot, no duplicate claimant | Assign physical controller to stable court slot |
| `DETACH_CONTROLLER` | Claim exists | Release slot; existing CPU fallback handles unclaimed athlete |
| `SUBSTITUTE_REQUEST` | Existing match and `match.phase === 'break'`; team has bench | Call `substitutePlayer`; **retain slot claim**, resolve new athlete ID on next input |
| `PAUSE_REQUEST` | Running match, nonfinal; no open quit confirmation | Set `match.pause=true` once; avoid toggle races |
| `RESUME_REQUEST` | Paused match and safe focus/dialog context | Set `match.pause=false` once; distinguish intentional pause from focus safety |
| `FOCUS_LOST` | Active, nonfinal match | Set paused; retain existing control claims but discard stale input edges |
| `REQUEST_QUIT` | Nonfinal active match | Record prior pause and focus context; open quit prompt; pause |
| `CANCEL_QUIT` | Quit prompt open | Restore prior safe pause state; never resume if focus is absent |
| `CONFIRM_QUIT` | Quit prompt open | Existing return-to-menu cleanup; no final-record commit |
| `MATCH_FINAL` | `match.phase === 'final'` | Existing result settlement remains idempotent; retire match-control claims |

Use explicit named actions instead of a toggle operation when translating keyboard, gamepad or dialog events. A 'pause toggle' from physical input can be resolved at the boundary to one named request before entering the transition contract.

## Observable invariants

1. For each physical controller, at most one active control-slot claim; for each active slot, at most one assigned controller unless a separately approved shared-input mode exists.
2. Every human input frame's `playerId` resolves to a currently active athlete. A benched athlete ID cannot consume an active controller's input after legal substitution.
3. Substitution only occurs during the existing period break; no new substitution rules or animation/box-score changes.
4. Pause/quit transitions cannot advance a simulation tick, release a shot twice, or record the final result twice.
5. A closed quit dialog does not unconditionally resume a match that was already paused or is hidden.
6. Non-gameplay visual modes do not introduce or change an authoritative simulation phase.
7. Every refused request has a stable reason code (`NOT_IN_BREAK`, `NO_BENCH`, `NO_ACTIVE_MATCH`, `CLAIM_CONFLICT`, `DIALOG_OPEN`, or similar), without logging private input content.
8. All accepted changes preserve current deterministic seeds, RNG advancement, game rules, animation anchors, art provenance, and existing v5 saved data.

## Implementation slices for separate future approvals

- **Slice A:** introduce a pure resolver with tests, no browser wiring or player-visible changes.
- **Slice B:** wire the browser's controller assignments through court-slot resolution; characterize/verify keyboard co-op, gamepad hot-plug and touch fallback.
- **Slice C:** unify pause, blur, visibility and quit-dialog requests; preserve UI keyboard support and existing audio behavior.
- **Slice D:** optional debug-only transition cause trace, without adding it to deterministic match state.

## Test and acceptance strategy

- Reuse existing `tests/game-core.test.js`, `tests/animation.test.js`, `tests/integration/match.test.js`, `tests/gamepad-controls.test.js`, and `tools/e2e_smoke.py`. Add isolated pure-contract tests under `tests/match-control.test.js` only after approval.
- Pin seeded input tapes and compare match state, ball custody, scores, pause behavior and animation ticks for unaffected interactions.
- Reproduce the suspected substitution bug first, then write a failing browser assertion for the intended *court slot* contract before implementing the correction.
- Verify Enter/Escape, gamepad Start, focus loss, quit cancel, touch held input and gamepad disconnect/reconnect. Test while playing, break, final, and already paused.
- No external dependency, TypeScript migration, storage schema revision, new production asset, or Captain Studio scope relaxation beyond the specifically reviewed v3 bootstrap.

## Risks and rollback

- Changing controller identity could alter CPU takeover or co-op semantics; pin baseline input sequences and review each mode before merge.
- Centralized pause may expose double-press or focus order issues; use explicit guarded events and browser assertions.
- A new contract could accidentally become a competing state source; keep it pure and avoid copying `match.phase`/`match.pause` into persistent state.
- Each slice reverts independently. Never couple rollback to historical asset cleanup or Myth workspace changes.

## Owner gate

The current approval authorizes **preparation of this design draft and baseline characterization**, not implementation, merge, deployment, artwork work or Captain Studio promotion. Obtain separate owner approval before gameplay behavior changes or merging any PR.
