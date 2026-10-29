# Independent gameplay review — Kraken alley-oop-reverse attempt05, track attempt05

**Verdict: reject this track candidate for production-loader review.** The pass, catch transition, release, scoring, mirroring, and recovery work, but the ball does not stay attached to Kraken through frames6–9. Retain these captures and retune the Kraken-specific carry track.

## Provenance and run integrity

- Atlas SHA-256: `f34573531c32521196adfa40ad1d2687f4cebef663ae0dc179c97c442519a899` (matches the report).
- Candidate report SHA-256: `e23add519dc1686d44ae1cc265e2f52d85266c932fa17a0d52a0118836c5379d`.
- Track JSON SHA-256: `249a28687e49a74b8b14a8ac5bc60ef6c92a66d81251240f8fab75944b788a3e`.
- Capture script SHA-256: `2a125235cb194678938b26ae9f4f903c93b94519fc00f6d54eb7fb79ae594037`.
- The report records 60 captures, both facings and both zooms, `runtimeIntegration:false`, injected candidate atlas and track, and no browser errors. All 15 frames are selected in order; the left-facing run mirrors correctly.

## What passes

Marin Dusk’s real turbo alley-oop pass is used. The pass is caught by Kraken at the authored grab transition (global event tick17; the matching sampled action frame is frame5/animation tick10). The action releases to the rim at frame10/animation tick21, scores two for Kraken at frame11/animation tick23 in both directions, and reaches the landing/recovery frame14/tick30. Kraken and the basket remain in view at 100%/120%, with no HUD obstruction in the reviewed catch, finish, and recovery captures. Both facings use the same Kraken atlas with correct mirroring.

## Blocking contact defect

I inspected the 120% captures for frames5–9 in both facings. Frame5 shows the incoming ball near Kraken’s hands and the catch changes ownership to Kraken. From frame6 onward, the ball pulls away from the raised hand: at frame6/tick12 it is visibly above and forward of the hand; frames7–9 continue to show a clear gap rather than a controlled carry. Mirroring preserves the same separation. The candidate height/forward pairs for frames6–9 are `(1.3, 6)`, `(1.6, 7)`, `(1.5, 6)`, and `(0.9, 6)`; they do not match this cleanup atlas’s hand positions. This fails the requested attached-ball continuity even though simulation ownership remains assigned to Kraken.

The low-hand reverse finish is readable in the atlas and both screen orientations. The ball reaches the hoop for release and the score is correct, but those later successes do not resolve the separation during frames6–9. Do not try the production loader with this track attempt. Retune the carry values against the frame6–9 hands and capture both facings/zooms again for independent review.
