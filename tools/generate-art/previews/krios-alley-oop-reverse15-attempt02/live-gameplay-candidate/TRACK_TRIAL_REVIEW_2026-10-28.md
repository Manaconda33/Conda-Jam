# Krios J.128 `alley-oop-reverse` attempt02 — ball-track trials

**Result: PASS for track trials only.** This does not accept/register the atlas or track for runtime. The clean attempt02 atlas was injected in memory into the current Jam Stage renderer, and the candidate athlete-specific track was injected in memory. No core, manifest, or runtime registry files were changed by these trials.

## Candidate track (attempt04)

`height`: `[1.15, 1.3, 1.5, 1.5, 1.35, 1.6, 1.5, 1.8, 1.55, 0, 2.1, 1.8, 1.3, 0.8, 0.65]`

`forward`: `[5, 7, 9, 8, 6, -1, 4, 5, 2, 4, -10, -8, -4, 2, 4]`

`height` and `forward` entries correspond to the 15 atlas cells in order. The track is separate from the athlete atlas, preserves original assets, and is not active runtime data.

## Gameplay evidence

The harness ran Krios with teammate Flint Rooker executing the production reverse alley-oop pass on the current Jam Stage court. It captured all 15 animation frames at both facings and 100%/120% zoom: 4 runs, 60 captures, zero uncaught browser errors. Every capture selected the expected atlas cell and used the expected right-facing sprite or mirrored left-facing sprite.

- Catch: tick 10 selected frame 5; ball mode was `carried`, owner Krios, for all four runs. Visually, the ball meets the raised clasping hands in both facing directions.
- Windup: tick 14/frame 7 and tick 17/frame 8 keep the ball at the elevated hand through the reverse windup in both facings. Tick 19/frame 9 carries it down into the reaching hand just before contact.
- Release/rim contact: tick 21 selected frame 10 and transitioned to `dunk`, with score still 0–0 in all runs.
- Score: tick 23 selected frame 11 and registered 2 points for the attacking side in both directions.
- Landing: tick 30 selected frame 14; Krios had returned to z=0 in all runs.

The four full capture sets and machine-readable report are in [`track-attempt04`](./track-attempt04/). Representative native captures: [right catch, 100%](./track-attempt04/right-frame05-tick10-zoom100.png), [left catch, 120%](./track-attempt04/left-frame05-tick10-zoom120.png), [right windup, 120%](./track-attempt04/right-frame07-tick14-zoom120.png), [left windup, 100%](./track-attempt04/left-frame07-tick14-zoom100.png), [right pre-contact, 100%](./track-attempt04/right-frame09-tick19-zoom100.png), [left pre-contact, 100%](./track-attempt04/left-frame09-tick19-zoom100.png), [release/contact, 100%](./track-attempt04/right-frame10-tick21-zoom100.png), [score, 100%](./track-attempt04/right-frame11-tick23-zoom100.png), and [landing, 100%](./track-attempt04/right-frame14-tick30-zoom100.png).

## Rejected trials preserved

- `track-attempt01`: rejected; catch/windup track placed the ball too high and detached from the hands during windup.
- `track-attempt02`: rejected; gather still detached from the catch pose.
- `track-attempt03`: rejected for visual spacing; frame 9 approached the rim too early and sat beyond the reaching hand.

Each rejected trial's full 60 captures and `report.json` are preserved in its own directory. No attempt data was overwritten. `track-attempt04/report.json` records the passing attempt and all four event checkpoints.
