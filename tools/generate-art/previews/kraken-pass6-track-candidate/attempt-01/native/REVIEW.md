# Kraken J.07 chest pass candidate track — attempt 01

**Verdict: reject baseline hand contact; retain the capture as a gameplay and selector baseline only.**

The run used the cleaned source at `tools/generate-art/previews/kraken-pass6-attempt02/kraken-pass6-attempt02-runtime-candidate.png` (SHA-256 `36e2a4e3fd62d19d6a471a26b837203b440fd7f13ae3ca66d255b54bdac60810`). Source and cleanup reviews allow separate track trials only; see `tools/generate-art/previews/kraken-pass6-attempt02/INDEPENDENT_SOURCE_REVIEW_2026-10-28.md` and `INDEPENDENT_CLEANUP_REVIEW_2026-10-28.md`.

## Candidate track

The first baseline reused Krios's chest-pass offsets:

- Height: `[1.05, 1.15, 1.4, 1.5, 1.35, 1.05]`
- Forward: `[8, 9, 11, 13, 12, 8]`

That track does **not** hold the ball close enough to Kraken's hands in frames 0, 2, and 4. At 120%, the ball is visibly detached to the front of the clasped or gathering hands; the right-facing frame 2 gap is especially clear, and the left-facing frame 2 ball sits well ahead of the hands. The vector is a starting calibration baseline, not a production candidate.

## Gameplay and selector checks

The candidate-only harness started Vesper Harbor Undertow versus Scoria Rams on the current Jam Stage and issued Kraken a real `pass` input. Its temporary manifest and track overlays exist only in the browser response; no production registry or runtime file was modified.

- 40 captures completed across both facings and 100%/120% zoom.
- Frame starts `[0, 2, 4, 5, 6, 8]` selected atlas frames `[0, 1, 2, 3, 4, 5]` with the expected horizontal mirror in every run.
- Kraken owns the carried ball through tick 4. The real pass action releases on authored frame 3 at tick 5; the ball becomes a separate ownerless `pass` with Kraken as last touch.
- The target catches later in the flight by tick 18. No score change is expected for a chest pass; the score remains `[0, 0]` throughout.
- No browser errors or selector fallbacks occurred.

## Evidence

`report.json` contains the exact candidate vector, capture states, selected source/frame/mirror values, ball ownership and flight values, score, clock, event messages, and all 40 screenshot paths. Screenshots cover the six authored frame starts plus post-release flight at ticks 11, 14, 18, and 22.

Next calibration should reduce the forward offsets during the carried frames to bring the ball onto the clasped/chest gathering hands. Keep the tick-5 release and the separately simulated pass flight unchanged while tuning those points.
