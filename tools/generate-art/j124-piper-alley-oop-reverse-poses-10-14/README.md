# J.124 Piper Quickstep alley-oop-reverse — poses 10–14

These are source candidates only. Nothing here is registered or packed into production. The separate Piper ball track remains runtime work for the full clip review.

## Candidate sequence

| Pose | Beat | Candidate | Review state |
|---:|---|---|---|
| 10 | Reverse open-palm release, tick 21 | `layout-candidates/pose-10-attempt3-fit80.png` | Parent provisional source review passed for pose separation and style; full-sequence/track review pending. |
| 11 | Immediate reverse follow-through, tick 23 | `layout-candidates/pose-11-attempt1-fit80.png` | Candidate; open hand follows down/across as rotation continues. |
| 12 | Airborne descent | `layout-candidates/pose-12-attempt1-fit80.png` | Candidate; lower, wider balancing arms and bent knees. |
| 13 | Foot-first landing preparation | `layout-candidates/pose-13-attempt2-fit80.png` | Candidate; right foot reaches down and arms stay below shoulder height. |
| 14 | Grounded recovery, tick 30 | `layout-candidates/pose-14-attempt1-fit80.png` | Candidate; balanced two-foot stance. |

All candidate sources depict Piper as an adult athletic human woman with warm brown skin, dark eyes, vivid attached orange ponytail, blank russet/cream Condas uniform, white socks and red/cream basketball shoes. No candidate includes a basketball or other prop. The character sheet must be reviewed alongside the separate athlete-specific ball track.

## Pose 10 attempts

- Attempt 1 (`exec-1cc5c783-a77b-4ac3-91f0-6a7c5103962c`) is preserved in `sources/`; its rear arm reads too straight/up-diagonal and the silhouette is not distinct enough from a conventional raised-hand release.
- Attempt 2 (`exec-446cdd43-c32e-42e4-87dc-e8db9174bab3`) is preserved in `sources/`; it bends the arm more but has a less clear reverse under-rim silhouette and was superseded while resolving the style match.
- Attempt 3 (`exec-58970b75-225c-49bd-9d98-4bede4b00ae8`) is the provisional candidate. Its hand is open and lateral to the head, unlike pose09’s closed fist and pose03’s vertical standard release. It uses the J.123 atlas as an explicit pixel-cluster style reference. The parent compared light/dark composites and provisionally accepted its style and separation for sequence review.

Each prompt and source hash is recorded in `prompts/` and `provenance/`. Attempts 1–3 have alpha-cleaned files, fit80 layouts and light/dark proofs; rejected/superseded raw files remain untouched.

## Poses 11–14

Exact ImageGen request text is preserved as `prompts/pose-NN-attemptN-actual-request.md`. Raw files and generation IDs are linked in `provenance/`. Cleanup retains the largest alpha>16 component plus a one-pixel dilation halo, changing alpha only and not redrawing. `layout-candidates/` uses uniform premultiplied-alpha Lanczos scaling and centered placement with at least 80 transparent pixels on every edge in the 1254px candidate canvas. Light/dark proofs are in `proofs/`.

The first pose13 output (`exec-5e3681b5-173c-46df-be4a-c32162565904`) raised both arms overhead and read as another airborne reach. It is preserved as rejected. The stricter retry generated two candidate outputs; `exec-4e515ac4-8930-4c42-8e6e-2a251718540f` still raised both hands and is retained as rejected; `exec-03da00bb-f529-4b9b-a0a7-d171090fa950` has one foot extending down and both arms lowered, and is the provisional pose13 candidate.

The corrected native 128×96 cells and per-cell measurements are in `native-cells/`. Cropfit contact sheets are `proofs/pose09-14-native-cell-sequence-cropfit-corrected-light-3x.png` and `...-dark-3x.png`. The earlier full-height montage is retained as rejected evidence under `rejected-preview/`; its cell bounds hit y=0 and y=95 and it must not be used for review or packing. Independent re-review passed the corrected 09–14 cells; full poses00–14 and ball-track/runtime review remain pending.
