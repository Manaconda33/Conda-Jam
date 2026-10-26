# J.130 Briar Foxglove `layup` outer-pose geometry review — 2026-10-26

Independent read-only calculation of provisional frames0–1 and5–7. This is a geometry check, not acceptance of any pose or a full-sequence normalization review. Frames2–4 have no accepted sources.

## Measured alpha-positive bounds

All candidates are in 1254×1254 cells. Bounds are `(left, top, right, bottom)` with exclusive right/bottom edges:

| Frame | Bounds | Required transparent margin |
|---|---|---:|
| 0 | `(322,219,931,1034)` | 220 px / 17.5% |
| 1 | `(364,219,890,1034)` | 220 px / 17.5% |
| 5 | `(429,251,824,1003)` | 251 px / 20% |
| 6 | `(392,257,861,997)` | 251 px / 20% |
| 7 | `(415,314,838,940)` | 251 px / 20% |

At current size, frames0–1 have219px top padding, one pixel under their minimum. A common centered scale `s=0.996` with zero translation increases those margins to about220.6px and raises the smallest frames5–7 margin to about252.5px. Approximate resulting silhouette heights are64.73%,64.73%,59.73%,58.76%, and49.60%; all remain under the respective occupancy ceilings.

The bottom coordinates span94px (frame0/1 at1034 to frame7 at940). A single shared translation preserves that scaled spread (about93.6px at `s=0.996`). Aligning frame7's feet to frame0/1 therefore cannot satisfy the same ground baseline under one transform: the required shift leaves only about220px at the frame5–7 bottom edge, below their251px margin requirement. This does not prove that a more complete trajectory/normalization scheme is impossible; it establishes that one uniform scale plus one translation cannot satisfy both the current common-baseline convention and these margins.

## Conclusion and limits

No outer pose is accepted or packed. The calculation shows that margins and occupancy alone allow a shared transform, while common foot-baseline alignment does not. Frames2–4 remain rejected, so consistent scale, flight path, pose separation, anatomy, identity, cell clearance and timing across all eight frames remain unproven. Recheck the complete sequence together after new middle-pose generations are reviewed. Keep the basketball on Briar's separate athlete-specific track.
