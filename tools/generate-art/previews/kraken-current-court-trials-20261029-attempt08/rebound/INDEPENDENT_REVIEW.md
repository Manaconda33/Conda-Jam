# Kraken rebound attempt02 track attempt02 — independent review

**Verdict: FAIL for ball-track acceptance; retain as candidate-only evidence. Do not register.**

Reviewed current-court attempt08 report and rebound captures for ticks 0, 2, 4, 5 and 7 at both facings and 100%/120% zoom. This is a candidate override only (`candidateOverridesOnly: true`, `productionRegistration: false`), using the cleanup01 atlas at `tools/generate-art/previews/kraken-rebound5-attempt02/cleanup01/kraken-rebound5-attempt02-cleanup01-atlas-candidate.png`. Selection reports the correct candidate source; facing-left uses `flip: true`, facing-right uses `flip: false`.

The live setup is Vesper Harbor Undertow vs Blackthorn Court Kings at courtY75. Leo's actual three-point shot misses (`shotMade: false`) and generates a loose rebound; all four facing/zoom runs report `actualRebound: true` and a transfer to Kraken. No browser errors are reported, and the score remains 0–0.

The adjusted track H `[1.1, 1.2, 1.4, 1.2, 0.65]`, F `[4, 3, 1, 0.5, 1]` improves the carried-ball position by tick7 but still fails visual contact at the grab. At tick0 the ball is only a tiny mark above Kraken's head instead of a readable loose ball near the ready reach. At tick2 it is above the raised fingertips. At tick4 it is not visible near the overhead hands in the zoom120 evidence while the reported loose-ball height is z=3.14. At catch tick5/frame3, it is still above Kraken's head/face rather than in the gathered hands at chest level in both facings and at both zooms. By tick7/frame4 it has lowered into the torso/abdomen area, but the earlier catch contact is missing. The report's `hasBall`/owner state therefore does not match a visibly caught ball. Recalibrate approach/grab height and forward placement so the loose ball reaches the overhead hands at tick4/tick5 and transitions into the frame3 chest gather on the catch tick; then inspect again in all four view configurations.

The artwork remains recognizable as Kraken in gameplay: auburn hair, natural skin, copper-gold details and burgundy uniform, with coherent limbs and a five-pose crouch → jump → overhead reach → chest gather → landing sequence. The source sheet is the edited raw derivative documented in `tools/generate-art/kraken-rebound5-attempt02-edit-provenance.json`; the original generated attempt02 with the opaque vignette remains rejected. Keep the artwork and track unregistered until ball contact is corrected and reviewed.

Reviewer: independent gameplay/art audit. Review date: 2026-10-29.
