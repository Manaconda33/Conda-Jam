# Animation asset audit

Issue #3 targets 29 clips and 293 distinct authored frame crops per athlete in one direction: 30,765 target frames across 105 athletes, before separately drawn left directions. The accepted minimum is 278 per athlete (29,190 across 105): standing dribble 8 versus target 10, run 8 versus 11, running dribble 8 versus 11, shoot 8 versus 10, push 8 versus 11, celebration 8 versus 10. Other clip minima equal the defined targets. The audit reads each clip's `minimumUniqueFrames` when provided; otherwise its frame-definition count is the minimum. Playback repetition and ping-pong sequences do not increase authored frame counts. `src/core/animation.js` is the authoritative clip inventory; the audit imports its frame definitions.

The preexisting assets provide three distinct run poses, used as a four-step ping-pong playback, a base gameplay pose, and two frames for nine actions. These sheets are useful fallback artwork, but do not satisfy the requested new frame counts, dunk variants, direction review, or provenance manifest. They are not registered as complete issue #3 production art. A runtime animation controller or a passing code test does not establish art completeness.

## Commands

Run from the repository root. Node and ImageMagick `identify`/`convert` on PATH are required. No npm dependencies are added.

```sh
node tools/audit-animation-assets.mjs
node tools/audit-animation-assets.mjs --report-only --json /tmp/animation-audit.json --markdown /tmp/animation-audit.md
node --test tests/animation-audit.test.js
```

The normal audit returns exit code 1 for incomplete production assets. `--report-only` still reports `ok:false`, while permitting a report-generation command to finish with exit code 0. This production completeness gate is intentionally separate from the default regression test suite. The audit's fixture tests are part of that suite and remain useful while artwork is incomplete.

The default manifest is `public/assets/animation/manifest.json`; `--manifest path` selects another manifest. JSON output distinguishes `requiredFramesMinimum` and `targetFramesTotal`; `targetShortfalls` records decoded clips below target without failing minimum-compliant clips. JSON output contains every finding, source file SHA256, actual dimensions, decoded frame hashes, and nontransparent pixel counts. Markdown output summarizes findings. Minimum clip/frame totals assume approved mirroring; characters requiring separate left art need additional frames.

## Manifest contract

```json
{
  "version": 1,
  "characters": {
    "athlete-id": {
      "mirrorSafe": false,
      "mirrorReview": { "status": "pending", "notes": "" },
      "directions": {
        "right": {
          "run": {
            "src": "./public/assets/animation/athlete-id-locomotion-right.webp",
            "columns": 11,
            "rows": 1,
            "frames": [{ "x": 0, "y": 0, "w": 128, "h": 128, "hash": "computed SHA256" }],
            "sha256": "encoded file SHA256",
            "source": "imagegen",
            "provenance": {
              "prompt": "Exact prompt or stable prompt file reference",
              "generatedAt": "2026-10-21T00:00:00Z"
            },
            "reviewed": false
          }
        },
        "left": {}
      }
    }
  }
}
```

The example has one frame and pending review, so deliberately fails completeness. Frame coordinates are absolute integer source pixels, including non-square images/cells; each crop must be in bounds. `columns` and `rows` describe source layout capacity, not an instruction to infer or stretch cells. Different clips may reference subsets of the same atlas. Extra provenance fields such as generation artifact, reference identity, reviewer and review date are encouraged.

Every athlete requires a recorded `mirrorReview.status:"reviewed"` with nonempty notes. Set `mirrorSafe:true` only after checking character identity in both directions. Otherwise supply every clip in both `right` and `left`. E. Indigo's mismatched sclera, Alex's headset and cheek nodes, GB Design's flag markings, and every other canonical asymmetry require deliberate review. The registration tool always starts a new character at `mirrorSafe:false` with a pending review.

## Registering genuine generated art

Save original imagegen results and exact provenance before export. Produce a layout JSON containing one entry or an array of entries with `athlete`, `direction`, `clip`, `src`, `columns`, `rows`, `frames` and `provenance` as above. Then run:

```sh
node tools/register-animation-atlas.mjs /tmp/layout.json public/assets/animation/manifest.json
```

When writing the production manifest path, registration also writes the equivalent `src/content/animation-assets.js` export for synchronous runtime and standalone use. Registration computes the real file SHA256 and decoded crop hashes, rejects blank/out-of-bounds crops, and sets the clip `reviewed:false`. Review the actual exported sheet, each crop, playback continuity, canonical identity and direction handling. Record approval only after that review. Re-registration resets that clip's approval and the character's mirror review to pending. The helper API `inspectAtlas(filename, frames)` returns `{width,height,sha256,frames}` for production registration scripts; each returned frame includes coordinates, hash, visiblePixels and index, or an error.

## What the audit proves

The audit reads every referenced image, obtains actual dimensions, decodes RGBA, and hashes actual crop pixels. It rejects missing files, invalid coordinates, transparent crops, insufficient frames, repeated decoded crops, forged frame hashes, changed source files, missing provenance and pending reviews. Hashes include crop dimensions plus row-major RGBA, with RGB values under alpha zero normalized to zero. Inventing JSON hashes or changing invisible RGB cannot establish distinct frames.

Pixel differences alone cannot establish a genuinely new drawing. Tiny shifts, recoloring, scaling or noise can alter hashes while retaining the same pose; those transformations must never be used to claim the requested authored poses. Human review is required for meaningful pose progression, anatomy, visible ball release/grab, foot contact, padding, consistent scale, character fidelity and safe mirroring. `reviewed` records that review; a script cannot prove it happened. Production completion requires both a passing audit and actual visual approval.

## Packing per-frame roster sheets

`tools/pack-roster-animation.mjs` packs genuine per-frame source sheets into per-athlete right-facing clip atlases. The input JSON is an array of `{group,clip,frame,path,prompt,generatedAt}` jobs. Groups are `captains` (7 columns × 5 rows, captain in team order) and `supporting` (10 × 7, partner then alternate per team). Include exactly indices 0 through the clip's production target minus one, without holes or repeated indices. This tool deliberately does not fill missing target frames; the separate audit can accept minimum-compliant clips produced through other authoring layouts.

```sh
node tools/pack-roster-animation.mjs tools/generate-art/roster-jobs.json
node tools/pack-roster-animation.mjs tools/generate-art/roster-jobs.json --overwrite
node --test tests/roster-animation-pack.test.js
```

Existing per-athlete files are skipped by default, including any previously authored Manaconda run atlas. `--overwrite` explicitly authorizes replacing matching files. No registration or review occurs. Layout files are written to `tools/generate-art/layouts-<group>-<clip>.json`; prior entries for skipped athletes remain intact. Register these layouts separately after examining the output.

Source sheets in a clip may differ by at most 1% in each dimension (maximum minus minimum divided by minimum), and every roster cell must contain nontransparent pixels. Cells use exact floor edges: `floor(col*width/columns)` through `floor((col+1)*width/columns)` and equivalent row edges. Sources smaller than the grid or roster definitions that do not fill the grid fail. Non-square images and cells are supported. Border contact and absence of transparent padding are reported as warnings requiring visual inspection; they are never silently repaired or approved. These checks cannot establish that a generator placed the correct character in each cell.

Packing preserves the complete source cell, pads grid rounding and the accepted small source dimension variation to the shared maximum cell dimensions, and applies the same aspect-preserving fit into 64 × 88 pixels. It pads to a shared source-cell floor at y=94 inside each 64 × 96 frame. It never trims or independently scales each pose's visible bounding box. Natural source-space pose motion remains; inconsistent source artwork is reported for review rather than normalized into apparently correct animation. All actual frames appear in frame-index order in a `ceil(sqrt(frameCount))` column atlas, encoded as WebP quality 82. Unused terminal grid cells remain transparent.

The packer rejects identical decoded source crops and blank or identical final encoded frames. Every layout records final source SHA256 and decoded crop hashes, the shared transform, and **every** original frame's source file SHA256, actual width/height, crop rectangle/hash, exact prompt reference and generation time. Geometric packing of genuine drawings does not count as authoring additional drawings. A duplicate cannot be padded, shifted or recolored by this tool to satisfy a count. Layouts remain `reviewed:false`; the main asset audit and visual review remain necessary.

Source-grid and incomplete-batch errors remain fatal. Individual athletes with duplicate source crops or blank/duplicate encoded crops are rejected with exact frame-index groups in the report while valid athletes and their layouts are retained. The CLI exits nonzero if any athlete is rejected; it never fills a rejected pose. The report also records accepted dimension variation, border contact and fully opaque source cells.

The exported API `packRosterAnimation({jobs,root,groups,clips,overwrite})` permits fixture or future grid definitions of `{columns,rows,athletes:[id|{id}]}`. It returns packed/skipped records, warning details and layout paths. Production defaults come from the actual 105-athlete roster and current animation clip targets.
