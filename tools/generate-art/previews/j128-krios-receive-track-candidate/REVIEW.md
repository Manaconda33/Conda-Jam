# J128 Krios receive ball track candidate

## Candidate

Use `height: [1.1, 2.0, 2.1, 1.2]` and `forward: [5, 9, 9, 5]` for `krios.receive`. These values are calibrated against `public/assets/animation/krios-receive-right.webp`, whose four visible receive poses are separate transparent art; the atlas itself contains no basketball. The ball remains a separate gameplay sprite.

## Evidence and review

- `attempt-01/native/` preserves the initial rendered captures and report from visual tuning. It established that the real pass reached Krios and suggested the candidate vector; its report predates the selector/facing assertions added to the capture script.
- `attempt-02/native/report.json` and its 20 screenshots are the validation run. The production renderer selected the Krios receive atlas for all 20 captures. Right-facing renders use `flip: false`; left-facing renders use `flip: true`. All captures are in `phase: playing`, with no pause overlay and no browser errors.
- The fixture places Flint Rooker and Krios once, then initiates a single normal teammate pass. The normal `jamverse.tick` / `stepMatch` progression advances the pass, queues `receive`, applies the catch anchor, transfers ownership, and continues into the held receive pose. No ball or player is teleported per tick.
- At receive tick 0 and tick 2, the ball remains in flight and has no owner. At receive tick 4, selected atlas frame 2 is active, the ball is carried by Krios, and the `Krios catches it` event occurs at the matching global tick (`receiveStartStep + 4`). At ticks 5 and 7, ownership remains Krios and the ball stays at the held position.
- The same ownership/catch result is recorded at 100% and 120% camera zoom in both facings. Screenshot review confirms the incoming ball meets the reaching hands, settles against the catch/secure poses, then remains held through the end of the clip. Player anatomy, identity, and court baseline remain intact; the athlete art has clean alpha transparency and no baked ball.

## Capture provenance

Run `python tools/capture-j128-krios-receive-track.py`; set `ATTEMPT` for a new preserved capture directory and `TRACK_JSON` for a new vector trial. The script serves the production game and injects only the candidate atlas/track into the browser page memory. It does not modify runtime sources, asset registries, tests, or manifests.

## Disposition

Candidate recommended for runtime integration and the strict asset audit. This capture lane intentionally does not edit runtime, tests, or manifest; integration remains with the owning production task.
