# Kraken pass / Marin receiver-track candidate review — attempt 07

## Decision

Candidate-only visual pass for the Kraken `pass` atlas and Marin Dusk catch placement. This is not production registration or runtime acceptance. Production files and art remain unchanged.

## Candidate-only injection and no-injection flags

The Playwright harness appended temporary response overrides in the page for the existing Jam Stage modules. It supplied the Kraken pass atlas, Kraken pass track, and Marin recipient tracks only for this capture. The match used the normal simulation, real Kraken chest-pass action, ownerless pass flight, Marin's normal catch action, and normal rendering.

- `runtimeIntegration`: `false`
- `productionManifestModified`: `false`
- `productionRuntimeModified`: `false`
- `productionAthleteTrackModified`: `false`
- `productionSourceArtModified`: `false`
- `productionRegistryModified`: `false`
- `candidateAtlasInjected`, `candidateBallTrackInjected`, `candidateReceiverTrackInjected`: `true` (temporary in-page response overrides only)

## Final recipient track vector

```json
{
  "receive": {
    "height": [1.3, 1.35, 1.2, 1.45],
    "forward": [4, 4, 2, 1]
  },
  "idle-ball": {
    "height": [1.45, 1.45, 1.45, 1.45],
    "forward": [1, 1, 1, 1]
  }
}
```

For the sampled caught pose, Marin is in `receive` tick 5 at simulation tick 22, which resolves to the fourth authored receive-frame entry: height `1.45`, forward `1`. At simulation tick 26, she is in `idle-ball` tick 1, which resolves to the first idle-ball entry: height `1.45`, forward `1`. Both resulting attachments are at the upper torso/hand cluster in the reviewed artwork.

## Capture coverage and evidence

`report.json` records 44 Jam Stage captures: 11 timeline samples for each of Kraken facing right and left at 100% and 120% zoom. It includes atlas/frame/mirror selection, Kraken pass track, receiver facing, recipient track source/sample, ball mode/owner/position, score, and event data.

The reviewed screenshots at ticks 22 and 26 show the ball overlapping Marin's hands/upper torso in both facings and both zoom settings. Representative proof:

- `frame-22-right-zoom100.png`, `frame-22-right-zoom120.png`
- `frame-26-right-zoom100.png`, `frame-26-right-zoom120.png`
- `frame-22-left-zoom100.png`, `frame-22-left-zoom120.png`
- `frame-26-left-zoom100.png`, `frame-26-left-zoom120.png`

Machine checks passed for all four facing/zoom runs:

- Atlas selection matched the candidate on all six pass frame starts; left-facing selection was mirrored and right-facing selection was not.
- Kraken retained the ball through tick 4, released it ownerless at pass frame 3 / tick 5, and did not regain possession.
- Marin's ordinary pass catch event occurred at tick 21. At tick 22 she was still in `receive` and owned the ball; at tick 26 she remained owner in `idle-ball`.
- At ticks 22 and 26 the reported recipient attachment delta was exactly `{ "x": 0, "z": 0 }` in all four runs.
- Score remained 0–0. The injected recipient track does not alter pass flight or catch timing.
- No browser exceptions; 44 of 44 expected captures were produced.

The full field-level evidence is in `report.json`. The candidate track used for Kraken, release frame/tick, frame samples, and normal catch event are also recorded there.

## Rejected predecessor vectors retained

- Attempt 02 retained the initial Kraken/Krios pass vector without a Marin override. Independent review found Marin's logically held ball roughly 8 world units away from her catch hands at ticks 22/26.
- Attempt 03 changed only Marin's facing policy to test whether orientation explained that offset. It moved the ball to the opposite side but left it about 9.1 world units from the hands. Its rejection and images remain in `attempt-03/native/REVIEW.md` and `report.json`.
- Attempts 04–06 retain the successful candidate progression before adding attachment-delta assertions and explicit no-injection metadata. No rejected captures were deleted.

## Production change indicated by this evidence

If production adopts this candidate, add the two athlete-owned entries under `athleteBallTracks['marin-dusk']` in `src/core/animation.js`, using the exact values above. The track resolver prefers an athlete-owned entry over Marin's supporting-library donor track, so these values are not multiplied by her donor track scale. Do not change Kraken's `pass` vector to correct a receiver-side attachment offset.

The values should correct Marin's ball position during her `receive` and `idle-ball` clips generally, including other successful catches that enter those clips. That is an architectural expectation, not a claim that every pass source, rebound, pickup, or other Marin possession transition has been separately visually verified. It does not generalize directly to other recipients: each athlete needs hand-aligned recipient track entries for their own artwork and facing behavior. Production integration should review Marin's other catch sources before acceptance.
