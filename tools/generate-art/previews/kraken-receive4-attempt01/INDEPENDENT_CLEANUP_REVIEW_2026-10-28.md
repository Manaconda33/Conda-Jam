# Kraken receive attempt 01 — independent cleanup/layout review (2026-10-28)

**Decision: approve this cleaned candidate for separate Kraken ball-track trials only. It is not approved for packing, registration, or production.**

Reviewed:

- Raw source and prompt/provenance for `kraken-receive4-attempt01`.
- `tools/generate-art/clean-kraken-receive4-attempt01.py`.
- `cleanup-layout-report.json`, `layout.json`, `kraken-receive4-attempt01-runtime-candidate.png`, all four normalized poses, and light/dark previews/contact sheets.

## Findings

- **Pose sequence and timing:** Four unique pose hashes are reported and visibly distinct. Pose 0 anticipates with open hands; pose 1 reaches forward with open hands; pose 2 closes the hands at chest/sternum for the exact catch at index 2/tick 4; pose 3 secures the catch lower at the abdomen after the event. Pose 2 and 3 remain distinct after downscale.
- **Ball policy:** No ball is drawn into any pose. Hands leave space for a separate runtime basketball at the catch and holding poses.
- **Identity and color:** Kraken remains recognizable across all four frames. Auburn hair, pointed ear, natural skin, copper amulet, burgundy/gold uniform, wrist details and shoes remain consistent. I do not see hair, skin or garment pixels being recolored by cleanup; the script retains original RGBA color values and only gates alpha.
- **Anatomy:** All heads, arms, hands, legs and shoes remain present in each normalized pose. Pose 1’s extended fingers are small but remain separate enough at the preview size to read as open hands. Catch hands in pose 2 meet naturally at the sternum; recovery hands remain together at the abdomen. No crop is visible.
- **Halo/background:** Cleanup removes the broad red haze from the transparent field, but the reduced candidate still shows a faint gray/red edge fringe in places, especially against dark preview. The current threshold/fringe treatment is adequate for contact trials, not final quality sign-off. Review edge pixels against both backgrounds after any correction and ensure hand/foot edges are not shaved.
- **Scale and pixel style:** Nearest-neighbor scaling consolidates the painterly source into a legible pixel-cluster sprite at the 80×96 cell scale. Kraken’s silhouette and major kit cues remain clear. The face and fingers are understandably small; inspect the actual runtime draw as well. The result is close enough for ball-path contact testing but should still be compared directly against the registered idle sprite before acceptance.
- **Layout/baseline:** All frames share uniform scale `0.12743` and baseline y94, with no visible vertical jump in the feet. Unique normalized poses: 4. The reported horizontal minimum margin is 4 px (frame 1); this is below the usual 5 px production packing clearance. Bottom margin is 2 px, matching baseline y94 in a 96 px cell. Keep this candidate unregistered; increase horizontal clearance during final layout if the production packing rule requires at least 5 px.
- **Cleanup implementation/reporting:** The script's component extraction and local alpha fringe handling are adequate for a trial. The JSON report enumerates hundreds of tiny discarded alpha islands and is very large; a summary count plus largest/representative exclusions would be easier to audit, while preserving raw source and cleanup method.

## Trial limits

A Kraken-specific separate-ball track may now be trialed against this cleaned candidate to check hand contact through tick 4 and catch continuity after the grab. Do not register it or claim source acceptance. Production acceptance still requires resolving/reviewing the edge fringe, confirming horizontal clearances, reviewing actual runtime captures in both directions/zoom levels, and an independent final atlas review.
