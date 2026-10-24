# Marco Vellum `shoot` — attempt 6 rejected

Generation ID: `exec-96a1869d-3a16-4ab0-a8a0-8ccb368e69e6`.
Exact prompt: `tools/generate-art/marco-vellum-shoot-attempt6-prompt.md`.
Unmodified raw: `tools/generate-art/sources/marco-vellum-shoot-attempt6-generated-raw.png` (1536x1024 RGBA; SHA-256 `3864c8caae2f4ad7ea78154bbc1f9fd46bd6e6a38a9ccc111e23387e857b300f`).
Review previews: `tools/generate-art/previews/marco-vellum-shoot/attempt6-safe-zone-review.png` (red cell-safe bounds), `attempt6-alpha-review.png` (source alpha channel).

Rejected; do not clean or pack. The sheet has the requested dimensions, 5x2 order, ten distinct full-body drawings, and empty hands/no visible basketball. Marco’s short black hair, clean-shaven face, olive skin, black kit and red/white trim are consistent. The jersey chest is black and unmarked. Anatomy is generally complete with two arms and legs per pose. Poses 3 and 4 are close set-point variants; pose 5 remains grounded at the forehead set rather than visibly beginning a jump, so the action transition is weak there.

The strict alpha-zero requirement fails. All four corners are alpha 0, but 103,211 pixels have alpha 1–31. Alpha=1 reaches the top edge at x=771–772 and left edge at y=149–159 (2 and 6 pixels respectively). The raw file’s RGB channels also retain brown background-like color in transparent pixels, so use the alpha preview as evidence rather than RGB values in transparent areas. No alpha cleanup was performed.

The 30px side inset appears satisfied on the visible silhouettes. The 70px vertical inset fails: in the red-safe-area preview, all five top-row poses extend below the lower safe boundary; bottom-row pose 5 begins above the upper safe boundary, poses 6 and 7 cross the row seam/upper safe boundary with raised hands, pose 8 begins above the upper safe boundary, and pose 9 extends below the lower safe boundary. Therefore reject the whole sheet. No source cleanup, extraction, atlas, manifest, tracker, or runtime changes were made.
