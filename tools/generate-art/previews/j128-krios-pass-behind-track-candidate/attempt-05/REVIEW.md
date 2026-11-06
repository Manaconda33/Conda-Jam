# J128 Krios `pass-behind` track attempt05 — independent review

**Verdict: accepted track candidate.** The atlas loaded for this capture is the candidate runtime atlas, and the ball remains a separate game object.

Vectors:

- Height: `[1.05, 1.3, 1.2, 1.25, 1.25, 1.2]`
- Forward: `[5, 2, -3, -9, -12, -8]`
- Runtime release: tick 7 on authored frame 3.

I inspected attempt05's Jam Stage native captures at 100% and 120% for both facings. The report records the selected source as `./public/assets/animation/krios-pass-behind-right.webp`, correct frame indices and mirror flips, actual `p.facing`, separate ball mode/ownership, and no pause overlay. Unlike attempt04, the match was restarted after the candidate manifest entry was installed, so these captures display the candidate Krios atlas.

At frame 2/tick 6 the separate ball sits behind Krios's waist as he turns. At frame 3/tick 7 it is in contact with, and partly occluded by, the backward open hand, which reads as the release. Frame 4 and frame 5 continue the follow-through and recovery. The left-facing sequence mirrors that contact on the opposite screen side. Both facing directions retain the same hand-to-ball relationship.

Actual production `stepMatch` advances release and ownerless pass flight; it catches `flint-rooker` at step 38 in both facings at both zoom settings. There are no browser errors. The report contains 64 real Jam Stage captures and records the receiver event for each facings/zoom pair.
