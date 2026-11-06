# Independent source review — Kraken dunk-tomahawk attempt04

**Decision: reject as a source candidate; do not proceed to cleanup.** The tomahawk beats improve, but the source has irrecoverable crop risk and fails the requested pixel style.

## Provenance and alpha

- Raw: `tools/generate-art/sources/kraken-dunk-tomahawk-attempt04-generated-raw.png`
- SHA-256: `4a648661a74cdd297bea9426fd1689570a0b3103ab7055c8752f57dfec143e13`, matching provenance.
- Generation ID: `exec-f82d9325-5898-4033-b741-561535cc568c`.
- Prompt SHA-256: `598666a2d806a12afb02ea35a25b066b65a63ebe4b18c4c19edec0da7e76b6ef`.
- Dimensions: 1487×1058 RGBA. Background gutters are transparent (sampled alpha 0), not an opaque backdrop. The sheet has many partial-alpha edge pixels and a conspicuous bright red/orange fringe around figures.

## Findings

- Kraken identity and anatomy are consistent overall: warm skin, auburn hair, pointed ears, copper pendant, burgundy/copper kit, dark socks and shoes. Fifteen recognizable full-body poses appear in the intended row-major progression; no ball or hoop is baked in.
- The action is improved over the previous attempt: the backswing/overhead beats lead to a clear frame10 downstroke and frame11 lower follow-through, then descent, landing and upright recovery. Frames8–11 differ enough in arm direction to understand the tomahawk.
- The canvas dimensions do not divide into 5×3 equal cells. The top-right figure reaches and is clipped by the right canvas edge; fixed-cell crop or normalization cannot restore the missing outline/anatomy. The cell margins are not reliably recoverable as drawn.
- Rendering is smooth shaded illustration with antialiasing rather than hard-edged limited-palette arcade pixel art. The red/orange halo is visible around nearly every silhouette and would remain prominent at sprite scale.

## Recommendation

Preserve as rejected. A retry should keep the improved arm sequence but use a divisible 5×3 canvas with clear gutters, keep every figure inside its cell and outer canvas, and use hard pixel clusters with clean transparent edges and no red fringe.
