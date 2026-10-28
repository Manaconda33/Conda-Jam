# J128 Krios `pass-behind` track attempt04 — independent review

**Verdict: capture retired; do not use for visual acceptance.** The gameplay state data remains useful, but the candidate manifest was installed after match startup, so these screenshots rendered a fallback player atlas. Attempt05 replaces this visual evidence.

Track vectors:

- Height: `[1.05, 1.3, 1.2, 1.25, 1.25, 1.2]`
- Forward: `[5, 2, -3, -9, -12, -8]`
- Runtime release: tick 7 on authored frame 3.

The report still verifies separate ball ownership and pass behavior: it stays carried by Krios through tick 6; at tick 7 the simulation clears `ownerId`, marks the ball `pass`, and assigns `flint-rooker` as target. Actual `stepMatch` advances to a catch at step 38 in both facings and both zoom settings. However, the rendered sprite source was the fallback because the temporary candidate manifest was loaded after match startup, invalidating this batch for hand-contact review.

No browser errors were recorded. The trajectory state is recorded rather than inferred from the staged screenshots.

The capture fixture suppresses unrelated players from the render during screenshots while restoring the full match roster before simulation continues. See `../attempt-05/REVIEW.md` for candidate-atlas visual acceptance of the same vector set.
