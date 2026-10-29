# Kraken dunk-scythe attempt02 — cleanup03 scaled repack

This separate derivative uniformly scales the accepted cleanup02 component-repack poses by `89/82` using nearest-neighbor interpolation. It expands the cells from 80×96 to 88×96, producing a 440×288 atlas, and keeps the visible feet aligned to baselineY94. It uses the same 15 components and their source order; no poses, colors, or anatomy were added or redrawn.

Measured output: 15 distinct frame hashes, maximum occupied height89px, minimum horizontal margin7px, minimum top margin5px, and bottom margin2px. This addresses the previously noted small in-game scale while preserving cell clearance. The derivative awaits independent art review and has not been used in gameplay or registered.
