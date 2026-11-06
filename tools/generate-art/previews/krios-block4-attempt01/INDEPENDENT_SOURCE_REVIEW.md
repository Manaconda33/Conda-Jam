# Independent source review — J.128 Krios `block`, attempt01

**Disposition: acceptable for isolated cleanup/layout trials only. Not accepted production art.**

Reviewed the raw 1536×1024 RGB sheet against the saved prompt, the current Krios references, and the four-pose `block` definition (durations 2/3/3/4; takeoff tick2, apex tick5, finish tick8).

- All four poses depict the same red-skinned Krios with curled dark ram horns, beard, broad muscular bipedal anatomy, Scoria black/ember/gold kit, and rugged boots. Hands are empty; no basketball or other scene object is present. All figures are visually separated, with no actual overlap or missing body parts.
- The sequence reads as defensive crouch, takeoff, high block, and bent-knee landing. The four silhouettes are distinct. The top-right takeoff is already reaching high; the bottom-left apex has the strongest vertical reach. This is acceptable as source for layout review, with the timing and continuity still requiring native-size/runtime inspection.
- The nominal grid boundaries do not contain every figure: the top-right hand reaches to approximately y=9 at the canvas top, and the bottom-left raised hand extends to approximately y=491, about 21px above the second row. They remain isolated from neighboring poses, so per-figure crop and uniform fit into 128×96 target frames is possible without redrawing, but the raw sheet fails the requested 64px per-cell edge margin.
- The background is opaque and green-keyable, but not perfectly flat `#00FF00`; sampled corner colors range around RGB(17,238,18) to RGB(21,243,15), with visible variation. Cleanup must use a documented color range plus connected-background isolation, inspect for green spill on outlines/skin, and retain alpha transparency. Do not accept it until light/dark edge review and native-size cell-margin checks pass.

Raw image: `tools/generate-art/sources/krios-block4-attempt01-generated-raw.png`. Exact prompt: `tools/generate-art/krios-block4-attempt01-imagegen-prompt.txt`. This review does not approve the cleanup, atlas, track, or runtime integration.
