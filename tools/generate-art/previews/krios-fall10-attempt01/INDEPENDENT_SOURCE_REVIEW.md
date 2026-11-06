# Krios fall / recovery attempt01 — independent source review

## Verdict

**Pass to careful cleanup and candidate trials; not accepted for registration.** The raw sheet contains ten readable poses in the requested order, with consistent Krios identity, anatomy, and charcoal/ember uniform. Cell dividers and several tight silhouette margins need to be handled without cropping or altering the athlete. Final 64×96 crops still require independent review before candidate acceptance.

## Source examined

- Raw: `tools/generate-art/sources/krios-fall10-attempt01-generated-raw.png`
- Generation ID: `exec-1c23ddb7-b556-4864-9d0c-71b8cc466f15`
- Dimensions/mode: 1774×887 RGB
- SHA-256: `1b37dd30afeb77f179cb3bcf9b379083807a28d868f3f3cbba91f781a21a698e`
- Prompt: `tools/generate-art/krios-fall10-attempt01-imagegen-prompt.txt`

## Findings

- The two-by-five sheet contains exactly ten figures, read left-to-right across the first row and then the second row. The sequence reads as hit reaction, stagger, fall, impact, sprawl, roll recovery, brace, kneel, stand, and recovered stance. The silhouettes are distinct enough to identify the transitions; no pose appears duplicated or omitted.
- Krios remains recognizable in all ten drawings: red skin, black curled ram horns, charcoal beard, and the Scoria charcoal uniform with ember-red edging. The costume and overall sprite style are consistent with the existing Krios art.
- All poses show two connected arms/hands and two connected legs/feet. I found no clear extra limb, missing limb, or cut-off horn, hand, foot, or shoe. The low poses retain readable body parts.
- The green background is flat, but thin white row and column dividers cross the sheet. Remove these as sheet separators without changing the athlete pixels. Do not treat them as part of the transparent matte.
- Several silhouettes sit close to a cell edge: top-row poses 3–5 and bottom-row poses 6–10 have particularly tight margins in at least one direction. The figures are not visibly clipped in the raw sheet, but extraction must retain safe transparent margins. In particular, do not grid-crop based on uniform assumed cell rectangles if that cuts the wide impact/recovery silhouettes.
- The impact and sprawl poses are naturally much wider and shorter than the standing poses. At a 64×96 preview scale, all ten remain recognizable, but the horizontal poses occupy less vertical area. Check that the runtime renderer preserves consistent feet/baseline placement without scaling the lying figures up enough to crop them.
- No basketball, opponent, hoop, or other gameplay object is visible in the athlete art.

## Cleanup and next review requirements

Use component-aware figure bounds or verified per-cell bounds, remove only the white separators and green matte, preserve complete anatomy, and record per-pose source rectangles and any changed pixels. Produce light and dark previews plus a native-size 64×96 contact sheet. Review all ten crops for margins, transparency, identity, pose separation, and baseline alignment before gameplay trials. The prompt's no-vertical-shift requirement remains in force; use the actual game fall/recovery simulation and inspect timing there.
