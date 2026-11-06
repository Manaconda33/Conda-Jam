# Kraken pass normal-loader attempt08 — rejected capture setup

**Disposition:** reject the capture as invalid evidence; the art and track are not rejected by this run.

The run used `NORMAL_LOADER=1` and did not inject an atlas or track, but the newly registered pass entry still had `reviewed:false`. The production selector therefore returned no sprite at tick0 even though the atlas path and track existed. The harness correctly failed at the first selector assertion and did not complete a valid gameplay report.

All 44 captured PNGs are preserved. Their fallback/missing-sprite state must not be interpreted as an art, identity, mirror or gameplay result. The entry's independent source and cleanup reviews already pass for gameplay trials; the manifest review flag is now enabled for the next normal-loader run. Repeat with attempt09 before drawing any runtime conclusion.
