# J.128 Krios `push` attempt02

Status: raw source passed independent identity/action review for cleanup trials. A transparent candidate layout has been generated; independent cleanup/native-size review passes for gameplay trials only. No production atlas is registered.

- Exact corrected prompt, ImageGen ID/time, reference hashes, and raw SHA are recorded in `tools/generate-art/krios-push-attempt02-provenance.json`.
- Raw source: `tools/generate-art/sources/krios-push-attempt02-generated-raw.png` (1536×1024 RGB).
- Independent raw review confirms both parallel arms and two distinct open hands at frame5/tick8 at approximate 128×96 fit; it also notes the contact silhouette crosses into the preceding nominal column. Cleanup therefore isolates by complete connected figure, never by blind grid cell.
- Deterministic candidate: `tools/generate-art/clean-krios-push-attempt02.py`; layout/unique-frame/edge report: `cleanup-layout-report.json`; native-scale light and dark sheets are preserved. Eleven unique poses are fitted at one shared scale into 128×96 transparent cells with common baseline y=94.
- The candidate removes the green matte with a green-dominance mask, retains all eleven figure components, and decontaminates documented green-dominant pixels without creating alpha holes. Independent cleanup review confirms frame5/tick8 has both separate arms and open hands, and accepts native-size distinction, safe margins, shared baseline, transparency and zero visible green spill for gameplay trials. Candidate Jam Stage contact and normal runtime checks remain pending.
- Attempt01 remains rejected and recoverable: its cleaned frame5/tick8 pose presents only one readable hand. See the attempt01 README and independent reviews.
- Push art is empty-handed; no basketball is painted into the source and no athlete ball track is required. Gameplay review uses the simulation’s target push and current Jam Stage court at y=90.
