# Independent candidate track review — Krios `dunk-reverse` attempt 01, track03

**Verdict: PASS FOR NORMAL-LOADER VERIFICATION; candidate-only, not accepted for registration.**

Reviewed all 60 current Jam Stage candidate captures: 15 frame/tick samples at both facings and 100%/120% zoom. The capture report confirms the attempt01 candidate atlas and track were injected for this trial (`runtimeIntegration:false`), selector results use the requested frame in both directions, left-facing is flipped, and there are no uncaught browser errors.

## Findings

- **Carry and hand alignment:** At frames05/tick10 and 07/tick14 the ball is fully visible and closely held by the joined hands behind the head in both facings. At frame09/tick19 it stays near the overhead finishing hand as Krios drives toward the rim. At zoom120 the ball clears the HUD with margin in both directions. The captured poses remain legible through the compact airborne gather passage; no clip fallback is visible.
- **Release and gameplay:** The ball remains carried/owned by Krios through tick19. At frame10/tick21 it becomes an ownerless dunk-mode ball at the rim with the reverse extension reading clearly. At frame11/tick23 it is dead and unowned with the expected Krios two-point score, in the correct team's score slot for each facing. The authored recovery continues through frame14/tick30 with the ball dead/unowned.
- **Court and browser:** Current Jam Stage court and HUD are visible; athlete and rim remain framed. No browser errors, wrong athlete selection, or missing sprite were reported.

Track03 is the best candidate so far. This review approves it for registered-source normal-loader verification only. Re-run the same full 60-capture matrix using the actual manifest and registered Krios track before production acceptance.
