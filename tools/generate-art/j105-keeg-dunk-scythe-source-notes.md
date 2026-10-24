# J.105 — Keeg scythe dunk source notes

## Candidate review

The first request was blocked by HTTP 429 `usage_limit_reached`. The provider reported a reset at 2026-10-24 13:10:15 UTC. After the quota window, two candidates were generated and reviewed; both are rejected, and neither is eligible for packing.

- Attempt 01: `exec-04a0d663-afc4-47d4-b28c-6e1d86e9d478`; preserved as `sources/j105-keeg-dunk-scythe-attempt-01-rejected.png` (SHA-256 `12af612a3f1b4c33fd40056a11789d87cc1413ad3807cdd01918a701231094ea`). Pose10's raised hand crosses the top edge of its cell, violating the required safe margin.
- Attempt 02: `exec-89c23132-73b9-45fc-a718-a2ac1714cc7b`; preserved as `sources/j105-keeg-dunk-scythe-attempt-02-rejected.png` (SHA-256 `06b2c70f9dfb3db592580d4d7f8213d61bedc75ed2be3fc88b54c2798bee7c01`). The 1536×1024 RGBA sheet has clipped cell margins: multiple hands, hats, and feet touch/cross cell edges (including poses 1, 2, 6, 7, 10–13). Cropping it would remove anatomy. No accepted source or atlas has been created.
- Exact prompts are retained in `j105-keeg-dunk-scythe-prompt.md` and `j105-keeg-dunk-scythe-retry-02-prompt.md`.

- Clip: Keeg `dunk-scythe`, right-facing, canon K.03.
- Prompt: `j105-keeg-dunk-scythe-prompt.md` (exact attempted prompt).
- Status: generation resumed; two rejected candidates; `eligibleForPacking` is false.
- No cleaned source, atlas, or layout exists.

## Planned action and ball policy

The scythe name refers to the body motion only: Keeg sweeps the invisible ball low behind his hip, then reverses into a rising diagonal and a single release at pose10/tick21. The game ball must be separately rendered and must not appear in the sprite drawings. A proposed Keeg-specific track is recorded in the blocked provenance as planning data only; it has not been visually validated against generated art.

Next action: retry image generation after the provider quota resets, review the source, then clean and package only if an acceptable fifteen-pose source is produced.
