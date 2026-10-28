# Independent source review — J.07 Kraken `shoot`, attempt01

**Disposition: acceptable for cleanup/layout trials only. Not production art.**

The 1254×1254 opaque RGB source contains ten figures in the intended row-major order across a 4×3 layout, with the final two cells empty. Kraken reads consistently as a natural-skinned adult male elf with short dark hair, pointed ears, refined face, athletic human anatomy, burgundy/copper uniform and amulet. Full anatomy and boots are present. No actual ball or prop is visible; the hands mime only. The sequence reads as gather, dip, takeoff, ascent, late ascent, release, early descent, descending follow-through, landing recoil and finish.

Raw pose frames4 and5 are similar overhead follow-through poses but differ in wrist/elbow shape, guide-hand position and torso angle; verify distinct hashes and action read at native size. The export dimensions differ from the prompt's requested 1536×1536, and it contains raw figures close to or crossing nominal row boundaries: top-row feet are only about7–19px from the next row, pose6 extends about3px into the bottom row, and bottom poses have about30px clearance. Components remain spatially separable, so crop by the reviewed silhouettes and fit into safe runtime cells without drawing new anatomy. The near-green background is not perfectly flat; sampled corners range about RGB(15–18,239–244,10–15), so range-based matte cleanup and edge review are required.

Raw source: `tools/generate-art/sources/kraken-shoot10-attempt01-generated-raw.png`. Exact prompt: `tools/generate-art/kraken-shoot10-attempt01-imagegen-prompt.txt`. This review approves only cleanup/layout trials; it does not approve an atlas, ball track, or gameplay integration.
