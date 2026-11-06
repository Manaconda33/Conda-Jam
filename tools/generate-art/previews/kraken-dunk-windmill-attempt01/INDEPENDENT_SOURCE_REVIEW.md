# Independent source review — Kraken `dunk-windmill`, attempt01

**Verdict: reject as a production source. True alpha and 15 main figures are present, but the windmill arc, cell margins and pixel-art requirements are not met. Preserve raw and provenance; do not pack or register.**

## Source/provenance verification

- Raw source: `tools/generate-art/sources/kraken-dunk-windmill-attempt01-generated-raw.png`, 1536×1024 RGBA.
- Generation ID: `exec-5cfae420-b0f9-45d7-8225-3cedbc7389b5` (`2026-10-29T04:49:00Z`).
- Raw SHA-256 `779dbe64f5db8bf89ef2dd11505606486faea70ce20e1dca745c0a36f034b0f1` matches provenance.
- Exact prompt SHA-256 `259b1e118e17ea8cbb317b71ca3d43e857e7c36342348d971955363b0b4bbb4a` matches provenance.

## Findings

- **True alpha and fringe: partial pass.** The file has real RGBA transparency. Alpha is 0–254; 1,020,404 pixels are alpha 0 and 552,460 are partially transparent. The brown field shown by some viewers is RGB data under zero-alpha pixels rather than a fully opaque backdrop. At alpha≥64 there are exactly 15 main sprite components and no small fragments; at alpha≥1 there are 735 components, including 721 small low-alpha fragments. The abundance of semitransparent edge pixels and hidden brown RGB can produce colored fringes if resampled without alpha-aware processing. This is substantially better than the opaque checkerboard dunk attempts, but it is not a pristine pixel-art edge.
- **Pose count and broad action: partial pass.** Fifteen full-body figures appear in the requested 5×3 order. Approach, gather, load, jump, descent, landing and recovery are represented. Most silhouettes are distinct enough at sheet scale. The sprites remain empty-handed and contain no basketball or props.
- **Windmill arm path: fail.** Frames 8 and 9 show nearly the same arm extended backward/horizontally; frame 10 jumps to the arm overhead. The intervening arm rotation is too subtle to read as a continuous circular windmill path. Several nearby frames also repeat running or airborne body shapes. The key dunk variation therefore is not clearly animated from these silhouettes.
- **Cell separation and margins: fail.** The 5×3 grid is recognizable, but figures are not contained within equal nominal cells. With 1536×1024 and five columns, a cell is about 307 pixels wide. Several alpha≥64 bounds cross those boundaries: top-row pose 2 reaches x=649 across the x≈614 boundary; pose 3 starts at x=643 and runs to x=938 across x≈921; pose 4 extends to x=1248 across x≈1229. Other row figures also touch or cross column seams. This violates the prompt's no-boundary-crossing and generous-gutter requirements and makes straightforward cell extraction unsafe.
- **Kraken identity and anatomy: gross pass.** The same athletic male elf appears throughout with auburn hair, pointed ears, natural warm skin, copper amulet, burgundy/copper uniform, socks and shoes. Figures are full-body and limbs appear attached. Raised hands/arms remain visible. No monster traits, extra characters, or ball are present.
- **Pixel-art style: fail.** The source uses smooth illustrated shading, blended ramps and antialiased contours instead of the requested hard-edged 16-bit pixel clusters and discrete palette. Cleanup can isolate pixels but cannot safely turn the painted shading into a coherent sprite without substantial redrawing.

## Recommendation

Preserve this as a rejected source. It can inform the windmill action design, but it is not acceptable as a cleanup-ready runtime atlas. A new source needs clearly different frames 8–10, contained silhouettes with real transparent cell gutters, and a genuinely crisp pixel-art treatment. Keep the basketball on a separate athlete-specific track.
