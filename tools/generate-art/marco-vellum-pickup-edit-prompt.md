# Marco Vellum — `pickup` background cleanup edit

## Exact image edit prompt

```text
Edit only the transparency and background of this exact Marco Vellum pickup sprite sheet. Preserve the exact 1536x1024 canvas, all five existing complete figures, their pose designs, identity, anatomy, clothes, colors, outlines, scale, positions and row-major order. Keep the bottom-right sixth cell empty. Do not redraw, move, resize, crop, replace or add any athlete or pose. Remove every non-athlete background artifact everywhere: dark brown/black haze, glow, halos, shadows, speckles, stray pixels, and all row/column divider or grid lines. Make all empty gutters, the outer margin and the unused sixth cell fully alpha-zero transparent. Keep the five crisp figure silhouettes and their shoe/hand outlines intact with visible clean margins. No props, no basketball, no background, no shadow, no cell lines. Return only this cleaned sheet with genuine transparent background.
```

This edit produced generation `exec-aedea74a-0e0e-4015-9c5c-02beac63e518` and still left semitransparent background haze/speckles. The output was rejected; the cleaned candidate was subsequently created with the recorded per-cell component-isolation cleanup script.
