# Independent source review — J.128 Krios `steal`, attempt01

**Disposition: acceptable for isolated cleanup/layout trials only. Not production art.**

The raw 1536×1024 RGB sheet consistently depicts Krios: red skin, paired curled near-black ram horns, dark beard, broad muscular bipedal anatomy, black/charcoal Scoria uniform with ember/gold trim, and rugged boots. All eight poses have complete connected anatomy and empty hands; no basketball, sphere, or other prop is visible. The sequence reads as low-ready, lane drive, low swipe, inward grab, follow-through, recoil, wide recovery, and balanced ready finish. Pose7 differs from the initial stance.

The figures are spatially separable, but several exceed their nominal 384px columns: the top-row second figure reaches about 36px into the next column, the bottom-row recovery pose approaches/crosses the next column, and multiple nominal margins are zero to 12px. Component isolation must retain complete silhouettes and prove safe cell margins before registration. The opaque green matte varies from exact `#00FF00`, with sampled corner colors around RGB(16,241,15) to RGB(20,244,16); keying and edge-contamination review are required.

Raw source: `tools/generate-art/sources/krios-steal8-attempt01-generated-raw.png`. Exact prompt: `tools/generate-art/krios-steal8-attempt01-imagegen-prompt.txt`. This review clears source/layout trials only; it does not approve a runtime track, asset packing, or gameplay integration.
