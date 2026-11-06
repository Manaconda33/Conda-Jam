# Krios J.128 `dunk-windmill` attempt01 source review

**Verdict: PASS for cleanup and Jam Stage trials only. Do not register from this raw-source review.**

Generation `exec-e362d332-cdaf-4e6d-96a9-fb153343d137`; raw source `tools/generate-art/sources/krios-dunk-windmill15-attempt01-generated-raw.png` (1619×971 RGB; SHA-256 `e460fc5a962c09371017194bf2784e53d781c67e9817101717fd99b1f750fbf`); exact prompt `tools/generate-art/krios-dunk-windmill15-attempt01-imagegen-prompt.txt` (SHA-256 `e9afc233c05f5636a6b5372a4922e61ce8267355f22eb1617f7fd99b1f750fbf`).

## Findings

- The sheet visibly contains a 5×3 arrangement of fifteen full-body figures in the requested row-major order. All figures share Krios’s red skin, curled black ram horns, charcoal beard, large muscular build, charcoal Scoria kit with ember piping, and dark shoes. No logo, number, text, emblem, basketball, hoop, teammate, or floor is visible.
- The arm motion reads as a one-handed circular sweep from behind/down, through the overhead peak, toward the rim and down through release. The release and follow-through silhouettes (frames10–11) differ. The takeoff and landing are legible.
- Some poses are close: frames0–1 are near-identical approaches, and frames6–7 both hold a nearly vertical overhead arm. Check these as isolated 128×96 candidates with canonical timing; if the distinctions collapse at gameplay size, reject or regenerate rather than treating nominally different cells as sufficient.
- Identity and anatomy look consistent; I see two attached arms and two legs per figure. The horns, hands, and footwear remain inside the sheet. Green-background contact and fine edge spill still need cleanup inspection.

## Required next checks

Count and hash the isolated/normalized figures; inspect cell margins, alpha cleanup, baseline and light/dark proofs; verify the approach and overhead frame separation at target size; then calibrate a separate Krios ball track and review all anchors in current-court Jam Stage gameplay. This review covers only the raw sheet.
