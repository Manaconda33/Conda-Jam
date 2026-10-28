# Krios `dunk-double` attempt01 independent source review

**Review date:** 2026-10-28  
**Verdict:** REJECT — do not proceed to ball-track trials or registration.

## Evidence reviewed

Reviewed the raw ImageGen sheet, the canonical `dunk-double` pose catalog, all 15 isolated 128×96 crops, the cleanup layout report, and the light and dark atlas previews.

## Findings

- Krios's identity and costume remain coherent across the sheet: volcanic-red skin, curled black horns, charcoal beard, muscular anatomy, black/ember kit and dark shoes. All 15 figures are full-body, and the pose cells contain no basketball or other prop.
- Component extraction produced exactly 15 poses and 15 unique normalized frame hashes. The transparent 1920×96 atlas uses 128×96 cells, shared baseline y94, minimum top margin 8 px and minimum horizontal margin 22 px. The light/dark proofs show no distracting green fringe. Nearest-neighbor scaling retains the hard pixel edges.
- The initial approach/load, first overhead pump, gather, and final two-hand release/follow-through/landing poses are individually readable. Frame10 release and frame11 follow-through are distinct.
- **Blocking canonical pose error at frame07:** the catalog requires Krios at the jump apex with the ball held low at his chest and both elbows deeply bent, after the first pump and second gather. The generated frame07 instead has both arms raised overhead. It reads as another raised extension, close to frames08–09, and removes the required held-low second-gather/apex beat. A separate ball track cannot correct this mismatch between the authored pose and action timing.
- Frame04 is still partway through the overhead fold rather than a clear return toward the face, but frame07 is the decisive rejection.

## Required correction

Preserve this attempt and its cleanup evidence as rejected. Generate a corrected source that puts frame07 in the unmistakable low-chest held position at the apex, clearly separates it from frames06 and08, and retains exactly one release at frame10. Do not use attempt01 for track calibration or registration.

## Provenance checked

- Generation ID: `exec-80760b40-c628-4061-8b4c-4a53993f61db`
- Raw source SHA-256: `95cc4f6faa4a7e90c55033965e8494ec84b67265d055dfc4491eed33d056bd49`
- Exact prompt: `tools/generate-art/krios-dunk-double15-attempt01-imagegen-prompt.txt`
- Prompt SHA-256: `e39dd61c512e917803431c5f13201157034005466c23a3c352f0f871551b7f88`
- Cleanup layout: `cleanup-layout-report.json`
- Candidate atlas SHA-256: `412d63364091074f68a8d21f1e056e25fbd0fc03c71df278a3b0becfa65ef13f`
