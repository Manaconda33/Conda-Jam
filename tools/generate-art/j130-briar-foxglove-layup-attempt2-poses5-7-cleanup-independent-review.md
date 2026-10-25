# J.130 frames 5–7 cleanup candidate independent review

Date: 2026-10-25. Result: **REQUEST CHANGES for all three cleanup candidates**.

Reviewed `clean-j130-briar-layup-poses5-7.py`, matching candidate JSON, raw retry1 sources, candidate light/dark preview, and accepted Briar shoot/receive/idle references. This review changes no source, candidate, acceptance status, or production asset.

## Required correction

The script labels the largest nonzero-alpha component but never applies `main_mask` to the RGBA pixels. `crop = rgba.crop(...)` therefore retains disconnected residue inside that component's rectangular bounds. The JSON claim that all other components are cleared is inaccurate for these outputs.

Independent 8-connected component analysis of the actual candidate PNGs found:

| Frame | Nonzero-alpha components | Satellite pixels outside largest component | Maximum satellite alpha | Margins L/T/R/B | Result |
| --- | ---: | ---: | ---: | --- | --- |
| 5 | 61 | 118 | 1 | 429/251/430/251 | Cleanup retry |
| 6 | 70 | 103 | 1 | 392/257/393/257 | Cleanup retry |
| 7 | 23 | 40 | 1 | 415/314/416/314 | Cleanup retry |

All margins meet the exact 20% minimum of ceil(1254 × 0.20) = 251 pixels. However, surviving disconnected alpha=1 specks fail the required clean transparent background. Isolate the original main component before resizing or placement, regenerate candidates and metadata, and review again.

## Preservation and visual findings

Both source and candidate SHA-256 values match the candidate JSON for every frame. Independent reconstruction from each original rectangular crop, documented resize, and centered placement matches every candidate RGBA pixel exactly. Frame 6 and frame 7 preserve every original nonzero-alpha crop sample unchanged after translation. Frame 5 uses the documented 0.9960264900662251 uniform scale and 395 × 752 Lanczos crop; it consequently resamples authored pixels rather than preserving their values byte for byte. No visual loss of hands, fingers, shoes, locs, anatomy, or costume was observed.

Every disconnected component in the original images has maximum alpha 1; none contains alpha >=64 pixels. Thus main-component isolation can remove the identified residue without removing visible authored anatomy or costume. The current script discards only material outside the crop, while leaving the above low-alpha satellites inside it.

The trio remains visibly distinct: frame 5 retains high empty-hand follow-through and descending legs; frame 6 has both arms lowered with an extended lead leg and higher trailing foot; frame 7 has a grounded two-foot bent-knee recovery. Both wrists remain bare, hands empty, and no number or prohibited logo is visible. Briar's face, brown skin, dark locs, red headband, russet/cream kit, cream socks and matching shoes remain consistent with the previously reviewed raw sources and recognizable against accepted atlases. The larger leaf accents already noted in the raw review persist. These visual findings pass; strict alpha cleanup does not yet pass.

## Candidate hashes reviewed

- Frame 5: `39af0962fcf3f6bc63d16cb5bda73a48f66c0858fff1b77cfd4e1a35275c9ecb`
- Frame 6: `f9077f0e22ccbfa25816ee4ba9b0309d8c1b2f2c7f6cedafd375ad36aae47426`
- Frame 7: `3b65358d3759b36c0146245e2ac9022bfb7a12e1b908336afbf6ce1f6b104578`

This is a review of cleanup candidates only, with no production acceptance or full-sequence registration. J.106 helper was not modified.
