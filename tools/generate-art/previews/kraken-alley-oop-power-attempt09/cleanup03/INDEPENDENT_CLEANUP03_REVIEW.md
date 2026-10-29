# Kraken alley-oop-power attempt09 cleanup03 — independent review

**Verdict: the detached fragment is removed without cutting the athlete; candidate only.** The remaining style and baseline concerns prevent production acceptance.

## Findings

- The transparent binary-alpha atlas has 15 unique 80×96 frames at baselineY92. Component inspection finds one connected main figure in every cell. The 37-pixel fragment below frame 3 is gone in both light and dark previews. Comparing its position to the raw source cell shows that it is a neighboring pose's raised hand bleeding across the source row boundary, not Kraken's foot or hand. The athlete retains both legs/shoes and full arm anatomy after removal. No other detached specks are visible.
- Main silhouettes remain within their cells with margins reported as 8–44 px left/right and 8–22 px top. Bottom margin is 4 px for most poses. Frames 3 and 5 have 10 and 11 px bottom margins after the fragment removal, leaving their visible body pixels roughly 6–7 px above baselineY92; these approach/plant beats need baseline review before gameplay trials.
- The 15-pose sequence remains distinct and readable: preparation/approach, gather and plant, ascent, open-hand catch, two-hand overhead control, downward extension/follow-through, descent, landing and recovery. The catch and transfer are clear, with no ball baked in. Kraken's identity, kit, hands and shoes remain consistent.
- Nearest-neighbor and shared-palette conversion make contours hard-edged, but the 24-color render still carries over the source's blended shading as noisy, muddy clusters. Compared with Kraken's production sprite, it lacks the same deliberate pixel grouping and facial/kit definition. Style remains a production blocker.
- **Report mismatch:** `cleanup-layout-report.json` still says only detached components under 12 pixels are removed. The 37-pixel component is absent in cleanup03, so the report must document the raised threshold/operation accurately.

No production files were changed.
