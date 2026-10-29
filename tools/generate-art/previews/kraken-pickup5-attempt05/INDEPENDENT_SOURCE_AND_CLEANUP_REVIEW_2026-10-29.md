# Kraken `pickup` attempt05 pose03 and cleanup01 review (2026-10-29)

**Decision: pass for Kraken-specific ball-track trial only. No production registration yet.**

Review covered the exact pose03 prompt, raw generated PNG, provenance, isolated source crop, assembled 5-pose cleanup atlas, light/dark native previews, nearest-neighbor zoom proofs, layout, and registered Kraken idle reference. The generated pose preserves Kraken's tied auburn/dark-brown hair, medium skin, face, maroon/red-gold uniform, necklace, wristbands, and shoes. It has one coherent body, no Krios traits, no extra figure, and no ball baked into the art. The compact crouch differs from the notice, lower-reach, low-reach, and recovery frames: pose03 reaches forward/down with an open palm near ankle height, while pose04 rises upright. The downsized palm remains legible in the 4× proof and is suitable to test against the tick7 grab.

The 80×96 cells retain baseline y90 and at least 5px horizontal clearance; new pose03 has 13px left/right margin and 6px bottom margin. Transparency/fringe looks clean on both background proofs. Style is compatible with the idle sprite, with slightly smoother shading than the registered art. The complete 5-pose atlas remains a candidate; the source art must still pass gameplay timing/contact and normal-loader review before registration.

Generation provenance is preserved, but the ImageGen tool response exposed no generation ID; the provenance records this limitation rather than inventing an ID.

## Invalid trial preserved

Track trial `attempt-03` is retained but invalid for acceptance because its Jam Stage fixture used the stale Vesper Harbor vs Scoria matchup. It was run at courtY75, but not on the current Vesper Harbor vs Blackthorn Court Kings setup. `attempt-04` is the corrected current-court set and is the only trial set eligible for review.
