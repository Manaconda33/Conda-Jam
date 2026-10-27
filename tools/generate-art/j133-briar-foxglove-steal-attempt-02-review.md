# J.133 Briar Foxglove `steal` — attempt 02 review

## Accepted for production

All eight row-major poses are distinct and complete: set, load, lunge, grab, cross-body swipe, retract, recover and ready. Source review confirms Briar identity/anatomy, empty hands, and no painted ball. The accepted normalized candidate is 288×190: eight 72×95 cells, one shared scale of0.18 nearest-neighbor, baseline y=89 and at least6px alpha≥16 clearance on every edge. The light/dark proof is clean at packed size.

The separate Briar-specific trial02 track is accepted: H `[0.9,0.8,0.5,0.4,0.65,0.9,1.0,1.05]`; F `[8,9,10,6,7,7,9,10]`. The grab anchor is frame3/tick5 (timeline frames begin at ticks0,2,4,5,6,8,10,13). Independent native review at court y=75, 100%/120%, both facings confirms contact at the low reaching hand within a few pixels. After the steal touch the separate ball remains loose and ownerless; frame5 stays visible outside Briar's torso during the cross-body swipe. Trial1's bad grab offset and body-overlap are retained as rejected in `tools/generate-art/j133-briar-foxglove-steal-balltrack-trials.json`.

Attempt02 raw, exact prompt, generation ID, source SHA, normalizer/layout report, rejected attempt01, light/dark proof, candidate ball track, trial history and native captures are preserved. The clip has not yet been production-registered; do so only with the recorded Briar track and preserve loose/unowned semantics.
