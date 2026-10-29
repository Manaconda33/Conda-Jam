# Independent source review — Kraken `dunk`, attempt03

**Verdict: reject as a production source; preserve raw and provenance. Cleanup may diagnose alpha bleed, but should not be treated as a viable cleanup/layout path toward acceptance.**

## Source and prompt verification

- Raw: `tools/generate-art/sources/kraken-dunk-attempt03-generated-raw.png`, 1536×1024 RGBA.
- Generation ID: `exec-462c03b3-d90d-4bd5-a8b8-bd5be38c21a0`, timestamp `2026-10-29T04:00:00Z` per provenance.
- Raw SHA-256 `e49854d0b94a4cd148be4f9b96b0ac9e2b61e4281e424de2721fe29d9894840a` matches provenance.
- Saved prompt SHA-256 `fe73fca1bc3b7efdec4bf967700a7df9367cdba93dac57ee166441831fbc436b` matches provenance.

## Review findings

- **Transparency: technically present, but raw has edge risks.** Alpha is 0–254; 1,093,425 pixels are fully transparent. All remaining 479,439 pixels are partially transparent and none are fully opaque. The background areas have alpha 0, so the brown gradient visible in some viewers is hidden RGB under transparent pixels, not an opaque alpha backdrop. That RGB contamination can bleed during filtered resampling. At alpha≥32 the ten figure silhouettes separate cleanly; at alpha≥1 there are 1,279 connected components, including 1,269 small fragments. Preserve true alpha and use alpha-aware or nearest-neighbor processing if diagnosing the fringe.
- **Cell separation and margins: fail.** Ten main bodies are present in a 5×2 arrangement, but some pass through nominal cell boundaries: the second top-row figure extends about 40 px into the third column, and the ninth figure extends about 6 px into the fifth. The sixth figure's main alpha starts at y=508, only four pixels below the row boundary at y=512. The ten silhouettes remain mostly separate at alpha≥32, but low-alpha halos bridge or fragment around them. They do not meet the prompt's no-crossing and 15% margin requirement.
- **Pose distinctions and readability: partial.** The broad sequence reads from approach and gather through plant, takeoff, rise, peak, slam, descent, landing and recovery. The peak/slam/descent poses (6–8) are close variations of arms raised overhead; their differences in hand spacing and elbow angle are visible at full sheet scale but may collapse at runtime scale, especially with no ball drawn. Landing and recovery are distinct. A separate ball track would need to clarify the dunk event without relying on a ball baked into the art.
- **Kraken identity and anatomy: pass at gross silhouette level.** The same adult male elf appears throughout, with auburn hair, pointed ears, warm skin, copper pendant, burgundy/dark uniform with gold trim, socks and shoes. No monster traits, extra characters, obvious missing limbs, or basketball are present. Heads, hands and shoes are visible in each main figure. The overhead hands/fingers are crowded; detail quality needs direct inspection after any reduction.
- **Pixel-art quality and edges: fail.** The figures are smooth, high-resolution illustrations with blended shading, antialiased contours and many semi-transparent pixels rather than hard-edged pixel clusters and a clean dark outline. Bright red fringe is visible around the bodies and appears in the edge RGB. The hidden RGB under transparent gutters and the low-alpha fragments further risk colored edge contamination. Cleanup can isolate figures but cannot correct the painterly rendering without redrawing.

## Recommendation

Do not create a candidate runtime atlas from this generation. It has good broad action intent and a coherent Kraken design, but the style, cell crossings, edge fringe, and weak distinction among peak/slam/descent fail explicit requirements. Preserve this raw result and provenance as rejected source work. A new source should retain the approach/plant/jump/landing sequence while using actual low-resolution pixel art, true clean alpha gutters, contained silhouettes, and visibly different peak, contact, and descent body poses. Keep the basketball separate.
