# Independent source review — Kraken dunk-windmill attempt04

**Decision: reject as a source candidate; do not proceed to cleanup.** The alpha gutters are real, but the requested windmill arm arc is not completed at the required beats and the source rendering is too soft.

## Provenance and alpha

- Raw: `tools/generate-art/sources/kraken-dunk-windmill-attempt04-generated-raw.png`
- SHA-256: `7549a7eaec2e4b0b23310090370b48c7fdb64c198b9f181562ff8820e8386b23`, matching provenance.
- Generation ID: `exec-f930938a-bcaf-425f-a4dd-8bdb99a345aa`.
- Prompt SHA-256: `187e21dc6ec805ec7aa2c08aa420a6153cc4973a6bed5984ce9388f5fe5e7343`.
- Dimensions: 1536×1024 RGBA. Sampled inter-cell gutters have alpha 0, so the brownish RGB there is hidden transparent-pixel color rather than an opaque background. Alpha is soft throughout figure edges: 525,612 pixels are partially transparent and there are no alpha-255 pixels.

## Findings

- Fifteen full-body figures are recognizable and broadly consistent as Kraken, with no ball/hoop. Anatomy is generally intact.
- The sequence covers approach, gather, takeoff, descent, landing and recovery. However, frames7–11 do not form the required five distinct windmill positions. The arm moves from a low/back position through a horizontal extension to overhead, but frames10 and 11 both remain high/overhead. The first obvious forward/down strike appears in frame12, making the requested frame11 strike late and leaving the sweep short of a readable full circle.
- The 1536×1024 canvas does not divide evenly into 5×3 cells. Several figures sit close to their nominal cell boundaries; the strict 10% padding and safe fixed-cell crop are not established.
- The art is smooth shaded illustration rather than hard-edged pixel clusters. Soft alpha edges and painted gradients violate the prompt's opaque limited-palette style; the repeated high-arm silhouettes are a separate pose-sequence blocker.

## Recommendation

Preserve as rejected. A retry should explicitly place the frame11 arm forward/down at the imaginary rim, with frame12 as a distinct below-shoulder follow-through; use five separate arm silhouettes for frames7–11, equal divisible cells with generous transparent margins, and crisp opaque pixel clusters.
