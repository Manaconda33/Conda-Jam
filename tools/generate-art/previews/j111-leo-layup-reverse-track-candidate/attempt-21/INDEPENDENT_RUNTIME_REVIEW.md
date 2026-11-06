# J111 Leo `layup-reverse` attempt21 registered-runtime review

**Disposition: approved.** The registered runtime clip passes the visual gameplay review in both facing directions at both tested zoom levels.

## Evidence reviewed

- `runtime/left/report.json` and `runtime/right/report.json`: 16 captures each; fresh process per facing and zoom; runtime integration is true; candidate atlas is `public/assets/animation/leo-layup-reverse-right.webp`.
- Registered Leo track H `[0.4,1.61,1.98,2.6,2.65,2.65,1.45,0.84]`, F `[5.85,6.58,4.02,4.5,5.5,6.8,6.58,5.85]`; release velocity `0.45`.
- Inspected release and flight images at 100% and 120% in both facings, including tick11, tick13, tick20, tick30/40, and tick50 score completion.
- Both reports show empty `uncaughtBrowserErrors` and actual production `stepMatch` progression. Leo retains the ball through local tick11, releases at tick12, and each shot scores at tick49.

## Findings

- **Framing:** Leo, ball and the attacking hoop remain visible in the inspected captures for left/right at 100%/120%. Unlike attempt20, no inspected release or flight frame is empty or clips Leo.
- **Selector and mirroring:** the report records frame 4 at tick11, frame 5 at release tick12, frame 6 at tick13, and frame 7 at tick20. Left-facing captures use `flip: true`; right-facing captures use `flip: false`. Both resolve `./public/assets/animation/leo-layup-reverse-right.webp` from the registered manifest.
- **Release and ball path:** tick11 shows the carried ball at Leo's raised hand; tick12 transfers it to shot mode and clears ownership. The independent ball remains visible near the rim through the sampled flight. The reduced launch velocity keeps the arc readable in the production court view.
- **Completion:** both directions reach the expected scoring rim and award two points at tick49 (`[0,2]` for the left-facing away team and `[2,0]` for the right-facing home team). Tick50 shows Leo in the post-score celebration state. There are no browser errors or unexpected fallbacks.

Attempt21 is accepted as registered-runtime evidence for J111 `layup-reverse`.
