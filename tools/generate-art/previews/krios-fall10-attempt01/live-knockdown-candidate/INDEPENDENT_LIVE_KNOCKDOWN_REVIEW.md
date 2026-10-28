# Krios J.128 fall attempt01 — live knockdown candidate review

**Verdict: PASS for candidate gameplay trials only.** The fall clip is not yet registered or production accepted; these captures use the candidate atlas in memory.

Reviewed all 40 Jam Stage screenshots: ten frame starts (`[1,3,5,8,11,14,18,23,29,35]`), both facings and 100%/120% zoom. The deterministic sequence triggers `Leo knocks Krios down!` at simulation tick 8 and selects the fall clip on the next step. Every capture selects the expected frame and candidate atlas; right facing is unflipped, left facing is mirrored. The reported ball remains `dead` and unowned throughout, and the browser error list is empty.

The court screenshots show the intended hit reaction, stagger, fall, ground impact, sprawl, roll, brace, kneel and recovery. Krios's horns, beard, red skin and charcoal/ember kit remain recognizable through the sequence; the corrected atlas has no opaque green spill under the cleanup-review threshold. The zoomed view confirms complete anatomy without cell clipping. Leo stands very close after the shove and partially occludes Krios in some views, especially during the low frames; the fall remains legible, but spacing/occlusion should be checked in the normal registered runtime.

The trigger and ball-state behavior pass this candidate trial. Production integration and normal-loader captures remain required before registration.

## Review 02 — 2026-10-28 isolated fall framing

The capture harness was revised to keep the actual Leo shove and fall trigger, then remove Leo from the visual roster after contact. I reviewed the refreshed 40 captures. The live sequence still shows `Leo knocks Krios down!` at tick 8; each run samples all ten frames in order at both facings and 100%/120%. The source atlas and expected mirrored orientation are selected on every capture. The ball is dead and unowned in all 40 states, and browser errors remain zero.

The low poses are now fully visible without the shover overlapping Krios. The midcourt composition leaves room around the lying poses; impact, sprawl, roll, brace and recovery read clearly at both zooms. Krios remains identifiable, anatomy is complete, no cell clipping is visible, and the despill scan remains clean. This framing adjustment resolves the occlusion concern from Review 01 for candidate gameplay trials. The captures still inject the candidate atlas and do not count as registered normal-loader verification.
