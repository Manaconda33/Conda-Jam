# Lossless delivery atlases

Eleven original generated PNG atlases remain unchanged in `public/assets`. Their
`-lossless.webp` derivatives preserve every decoded 8-bit RGBA byte, including
partially transparent pixels and RGB values beneath fully transparent pixels.
Dimensions and artwork are unchanged. Runtime and offline builds load these
committed derivatives; the GitHub deployment build needs no image encoder.

The conversion reduced 35,675,636 bytes of PNGs to 28,123,678 bytes of WebP
(21.17%). Base64 embedding saves 10,069,276 bytes in the standalone page.
The initial sequential encoding took 59.349 seconds on the shared task machine.
This reduces encoded delivery size; decoded image memory remains unchanged.

`LOSSLESS_ATLAS_PROVENANCE.json` records input/output hashes, decoded RGBA hashes,
byte sizes and initial encoding times. The originals contained no ICC profiles,
gamma, or sRGB metadata. These are delivery derivatives of the existing artwork,
not additional animation drawings.

Reproduce with ImageMagick (optional authoring dependency):

```sh
node tools/encode-lossless-atlases.mjs
```

The script runs this command for each recorded source, then requires exact
RGBA equality before recording the output hash:

```sh
convert INPUT.png -define webp:lossless=true -define webp:exact=true -quality 100 OUTPUT-lossless.webp
```

Verify committed derivatives without re-encoding:

```sh
node tools/encode-lossless-atlases.mjs --verify-only
node --test tests/lossless-atlases.test.js
```

Different encoder versions may produce different compressed bytes. Regeneration
updates derivative hashes only after pixel equality succeeds; original hashes
are checked before encoding. The source PNGs are never written by this tool.
