# J.131 Briar Foxglove `layup-reverse` — attempt 01 review

## Disposition: rejected, preserve raw

Raw ImageGen output `exec-463947e6-39a3-43cd-96b2-eb6ba84581d2` is preserved at `sources/j131-briar-foxglove-layup-reverse-attempt-01-raw.png`, with the exact prompt, SHA-256, and identity references in the adjacent provenance and prompt files. The output was also composited over light and dark previews. Its RGBA channel has transparent corner pixels, but this alone does not make the layout cell-safe or production-ready.

## Why it failed

- Identity cues (locs and red headband) are recognizable, but the kit changes: the jersey has a new heart/leaf-like emblem, shorts have black panels, and multiple costume details do not match Briar's accepted russet/cream uniform.
- The smooth shaded rendering does not match the project's crisp limited-palette pixel-art sprites.
- Poses 6 and 7 both read as an overhead arm extension, so release and follow-through do not have sufficiently distinct silhouettes.
- Figures touch or exceed their nominal 384x512 cell bounds. Alpha probes find artwork at the outer edge of poses 3, 4, and 6, and the generated group is not safely contained with transparent margins per cell.
- No cleanup, normalization, packing, or runtime registration was performed.

Independent review requested the same rejection and recommended a more tightly constrained kit, cell inset, pixel-art style, and release-versus-follow-through silhouettes for the next attempt. The full eight pose plan remains: approach; takeoff; rising turn/cross-under; distinct far-side gather; peak; release at tick 12; post-release descent; landing/recovery.
