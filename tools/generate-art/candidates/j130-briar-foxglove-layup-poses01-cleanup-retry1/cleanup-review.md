# J.130 Briar layup frames 0–1 cleanup candidates

Status: **Provisional cleanup candidates, not accepted source poses.** The original generated sheets remain untouched and remain the source of truth for pose provenance.

## Candidate method

The reproducible operation is `tools/generate-art/j130-briar-layup-poses01-cleanup.py`. It preserves each source pixel inside a four-pixel square dilation around the alpha ≥64 figure, sets outside pixels fully transparent, crops, applies one uniform scale in premultiplied RGBA, and centers the result on a transparent 1254 × 1254 canvas. It does not repaint, clone, deform, or reconstruct body parts. SHA-256 hashes, crop geometry, scale, alpha bounds, prompts, provenance, and references are in `review-metadata.json`.

## Visual review

The two poses remain clearly separate in the light/dark proof:

- Frame 0 is grounded, leaning into the approach, with the hands gathered low near the hip and both feet near the imagined ground.
- Frame 1 is a distinct one-foot takeoff, with the rear leg extended, opposite knee raised, and hands lifting toward chest/face height.
- Both retain two arms, two hands, two legs, and two shoes. Hands are empty; no ball, props, extra figure, or animal traits are visible. Wrist skin is continuous with no bands or jewelry.
- Briar remains recognizable through warm brown skin, dark locs, red headband, and russet/cream uniform. The cream leaf marks remain more prominent than the accepted references; cleanup intentionally leaves that authored design unchanged.
- On both light and dark backgrounds, no external haze or isolated specks remain visible. The transparency is clean around the silhouette. Threshold-1 margins are at least 219 px vertically and 322 px horizontally on the 1254 px canvas (17.46%); alpha ≥64 margins are at least 223 px vertically and 326 px horizontally. Maximum figure occupancy is 64.99% at threshold 1.

## Limits before acceptance

This verifies only the cleanup candidates for frames 0–1. The rest of the layup sequence is not yet assembled, so relative character scale and frame-to-frame placement still require review against all eight poses. These files must not be packed or registered until that full-sequence review passes.
