# Conda Jam Modular Sprite System | Manaconda-first pilot

**Status:** isolated code-only art/engineering prototype. **Not a production-art replacement**. No ImageGen calls, prompt-to-image output, reference-image pixel tracing, sprite-sheet editing, or preexisting player art is used to generate these pixels.

## Run

Requires Python 3.10+ and Pillow (`pip install -r requirements.txt`). The application itself is standard-library Python except Pillow raster drawing; no new dependency is added to Conda Jam's game.

```sh
python build_pilot.py
python -m unittest discover -s tests -v
```

Open **`workbench.html`** directly in a browser. The complete `outputs/` folder must remain alongside it. No server or network access is necessary. The viewer composes **19 independently encoded layers** from two pixel atlases, plays/scrubs six idle poses, overlays live rig joints, hides components, and swaps one part at a time using a third atlas. Pixel layers are reassembled at runtime without editing any of the others.

## Production compatibility

- Code-only assets are RGBA **128×192** with a transparent gutter; Manaconda and Reed each have a **3×2 idle atlas** of 128×192 cells.
- A **64×96** comparison reduction of Manaconda is exported. It does not replace a production clip or manifest entry.
- Original animation uses **64×96** rectangles, authored right-facing. This pilot does not implement the full real-game pose clock, physics timing, front/back body perspective, or mirror acceptance.
- **No edits to `src/`, `public/assets/animation/`, `src/content/animation*` or runtime manifests.**

## Reuse proof

`modular_sprite/rig.py` provides a named athletic humanoid joint structure shared by Manaconda and Reed Ashcroft. `modular_sprite/components.py` implements **19 separable raster components** using that rig. `recipes.py` assigns different identity components and palette for each. Reed deliberately has no glasses, crest, or scarf, and his head/hair, facial hair and build differ from Manaconda's.

Four demonstrable edits change only one component's pixel array (checked by the unit tests):

| Edit | Component affected | Parameters |
| --- | --- | --- |
| Thin glasses | `glasses` | `glasses_thickness: 2 -> 1` |
| Extra blossoms | `crest_front` | `blossom_count: 8 -> 11` |
| Longer scarf | `scarf_back` | `scarf_length: 1.00 -> 1.23` |
| Shorter beard | `beard` | `beard_fullness: 1.00 -> 0.58` |

## The honest quality bar

This is **the architecture proof**, not a claim that procedural code now rivals the generated production art. While continuity across frames and edit locality are reproducible, the character still has limited articulation and lacks the nuanced shapes of the reference images. The next gate should be *visual acceptance at live game scale* before expanding to additional clips or humanoid athletes. Reuse does not guarantee beautiful art; each bespoke component still needs skilled art direction.

## Outputs

- `outputs/manaconda-modular-idle.png`, `manaconda-modular-idle6.png`, `manaconda-modular-64x96.png`
- `outputs/reed-ashcroft-modular-idle.png`, `reed-ashcroft-modular-idle6.png`
- `outputs/manaconda-component-debug.png`: inspect 19 transparent layers independently
- `outputs/manaconda-edit-variants.png`: edited part comparison
- `outputs/manaconda-idle6-preview.png`, `modular-v1-overview.png`: consistent-size previews
- `outputs/parts-{manaconda,reed-ashcroft}.png`: workbench sprite-part atlases
- `outputs/parts-manaconda-variants.png`: swappable sublayers
- `outputs/workbench-manifest.json`, `validation.json`: format and joint data
- `workbench.html`: dependency-free interactive renderer of those parts

See **`SPEC.md`** for component contracts, coordinate system, acceptance gates and a staged route to game integration.
