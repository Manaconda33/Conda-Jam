# Kraken J.07 chest pass track — attempt 03 receiver-placement trial

**Verdict: reject receiver-facing adjustment; catch possession remains visually detached.**

Attempt03 preserves the attempt02 Kraken pass vector:

- Height: `[1.25, 1.25, 1.3, 1.5, 1.35, 1.05]`
- Forward: `[2, 4, 5, 6, 12, 8]`
- Release frame3/tick5

The only trial change is Marin's initial facing. Attempt02 turned Marin toward the approaching ball; attempt03 makes her face the attack direction. This is a candidate simulation-state adjustment and does not change player artwork, manifests, core files or any athlete ball track.

## Capture results

44 current Jam Stage captures cover both pass directions and 100%/120% zoom: all six pass frame starts plus post-release flight at ticks11,14,18,22,26. Kraken's carried hand contacts, production selector/mirror, real release at tick5, ownerless ball flight and Marin's logical catch remain valid. Score stays `[0,0]`; no browser errors or fallback sprites occurred.

The facing adjustment does not align Marin's held ball with her visible hands. At tick22 and tick26 the inherited `marin-dusk` shared-library `receive`/`idle-ball` track places the carried ball about 9.1 world units to the attack-facing side of her body in every run. The reviewed screenshots show the ball outside her chest/receiving hands. With `toward-pass` (attempt02), the ball is instead about 9.1 world units to the opposite side. Changing Marin's root position cannot change this relative offset because the held-ball point follows the same inherited receiver track.

The normal catch timing is preserved: Marin transitions from an ownerless pass to logical possession by tick22. The failed part is visual hand attachment after possession. Attempt02 and attempt03 screenshots/report data preserve both placement trials.

## Constraint

The harness is limited to a Kraken pass candidate and must not modify production source, runtime manifest, Marin's track, or assets. Within those constraints, neither normal horizontal receiver facing aligns Marin's carried-ball point with the hands. Correcting the inherited shared receiver track would be a separate production change and is outside this calibration task.
