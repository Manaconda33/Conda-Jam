# Marco Vellum — `pass-behind` source review correction

- The prior accepted label is superseded by an independent source/layout measurement; this source is **rejected for packing**.
- Six poses appear complete and read as a behind-the-back pass. Marco’s identity, black/crimson/white kit and human anatomy are consistent; no ball is painted.
- The exact prompt requires at least35px margins. Alpha>=64 bounds measured in the cleaned 512×512 cells leave margins (left,right,top,bottom): frame0 56,57,50,33; frame1 66,63,44,32; frame2 69,26,50,32; frame3 37,0,34,48; frame4 48,14,36,44; frame5 78,39,43,44. Frame3 touches the right cell boundary.
- The packer crop for frame3 extends to x35+w479=514, across the 512px cell. Do not pack this layout.
- `marco-vellum-runtime-ball-tracks.json` and the Marco block in `src/core/animation.js` have no `pass-behind` athlete-specific runtime track. Add and review the separate ball path before integration.
- Preserve the original generated sheet, attempt1 reject, prompt, hashes, cleanup, layout, atlas and preview. Regenerate with safe margins at this roster turn.
