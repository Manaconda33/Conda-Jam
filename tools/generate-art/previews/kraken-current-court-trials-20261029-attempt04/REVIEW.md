# Kraken push and rebound candidate trial review

Date: 2026-10-29

## Scope and setup

- Match: Vesper Harbor Undertow vs Blackthorn Court Kings.
- Test players are actual roster entries: Kraken, Sable Regent, and Leo.
- Push actors start at the current lower-court position (`y=75`). The rebound shooter's live shot starts at `y=75` and naturally travels toward the target hoop at `y=50`; Kraken is stationed near the actual landing point (`x=69, y=50.5`).
- Candidate atlases and tracks are injected only through browser response overrides. No production asset manifest, simulation, or animation module was edited.
- Each action was captured at both zoom 100 and 120 and for both facing directions.
- The older Scoria Rams / y=50 captures remain preserved as invalid for this current-court review.

## Push

Four combinations passed the live carrier-shove behavior check. Kraken starts a genuine shove action against ball-carrying Sable Regent. At contact tick 8, Sable is stunned and knocked down, the ball changes to loose with Kraken as last touch, and the score remains unchanged. The selector uses the injected push atlas and correctly flips left-facing presentation.

This establishes gameplay timing and action integration for further calibration only. The artwork is still provisional: painterly rendering does not match the game's pixel-art atlas, and previous source review identified narrow poses and insufficient bottom/side margins. Do not register it.

## Rebound

Four combinations passed a real missed-shot-to-catch sequence with Leo as the Blackthorn shooter. The shot is released by the normal shoot action and misses. In engine tick 85 the shot becomes loose; Kraken selects the candidate rebound clip on the next update, and catches the ball at grab tick 5 (timeline tick 78 relative to the post-shot capture window). The ball ownership changes from loose to carried, Kraken records the rebound, and score remains unchanged. The candidate selector selects frames 0–4 at configured start ticks `[0, 2, 4, 5, 7]`, and mirrors left-facing runs.

At grab tick 5 and recovery tick 7 the live ball is attached to the candidate's separate athlete-specific track. Before the catch anchor, the ball follows the live projectile: its height differs from the candidate attached-ball track by about 0.4 world units at clip tick 0, 0.5 at tick 2, and 1.1 at tick 4. It is a visible incoming rebound, not a carried-ball track sample. The catch anchor reattaches it at the track point. Inspect the five per-pose captures before any future acceptance.

The source art remains visually provisional due to painterly style, cramped overhead poses, and margin issues recorded in source review. This gameplay pass does not make it runtime-ready.

## Final evidence

- `report.json` contains per-run snapshots, actual ball mode/ownership, animation selector frame, facing/zoom, shot result, and capture paths.
- `push/` contains 44 action screenshots (11 frames × four runs).
- `rebound/` contains 20 selected-pose screenshots (5 frames × four runs) plus timeline screenshots.
- No production registration or acceptance occurred.

## Preserved earlier trial attempts

- `../kraken-current-court-trials-20261029/` contains the first script run. Push passed; the first rebound setup did not produce a miss because the controlled shooter had not yet reached the shot release anchor. It has no acceptance value.
- `../kraken-current-court-trials-20261029-attempt02/` records the corrected live miss, but Kraken was stationed on the wrong side of the trajectory (`x=146`; the actual miss went toward the team 0 hoop and became loose near `x=68`). The catch failed. Push passed.
- `../kraken-current-court-trials-20261029-attempt03/` corrected Kraken's intercept point and completed all rebound catches, but only recorded the first rebound pose. This attempt04 run supplies full pose evidence.
