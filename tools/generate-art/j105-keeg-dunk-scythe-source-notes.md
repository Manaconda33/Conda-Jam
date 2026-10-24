# J.105 — Keeg scythe dunk source notes

## Candidate review

The first request was blocked by HTTP 429 `usage_limit_reached`. The provider reported a reset at 2026-10-24 13:10:15 UTC. After the quota window, two candidates were generated and reviewed; both are rejected, and neither is eligible for packing.

- Attempt 01: `exec-04a0d663-afc4-47d4-b28c-6e1d86e9d478`; preserved as `sources/j105-keeg-dunk-scythe-attempt-01-rejected.png` (SHA-256 `12af612a3f1b4c33fd40056a11789d87cc1413ad3807cdd01918a701231094ea`). Pose10's raised hand crosses the top edge of its cell, violating the required safe margin.
- Attempt 02: `exec-89c23132-73b9-45fc-a718-a2ac1714cc7b`; preserved as `sources/j105-keeg-dunk-scythe-attempt-02-rejected.png` (SHA-256 `06b2c70f9dfb3db592580d4d7f8213d61bedc75ed2be3fc88b54c2798bee7c01`). The 1536×1024 RGBA sheet has clipped cell margins: multiple hands, hats, and feet touch/cross cell edges (including poses 1, 2, 6, 7, 10–13). Cropping it would remove anatomy. No accepted source or atlas has been created.
- Exact prompts are retained in `j105-keeg-dunk-scythe-prompt.md` and `j105-keeg-dunk-scythe-retry-02-prompt.md`.
- Retry 03 generation `exec-45c28032-fad4-44bb-9223-3100a9cbe291` is retained at `sources/j105-keeg-dunk-scythe-attempt-03-review.png` (SHA-256 `b435795ec5d1dfad808280d43c2bbdf471730cc7409aa1b58b25bbf241c8bb5a`). The RGBA sheet has five nontransparent outer-edge pixels, pose silhouettes do not retain broad cell margins, and orange basketballs remain in gather poses 1 and 2. Exact prompt and review are in `j105-keeg-dunk-scythe-retry-03-prompt.md`; the black/white grid composite is `../../artifacts/native-render-preview/j105-keeg-dunk-scythe-attempt-03-review.png`.
- Retry 04 generation `exec-c7b23b96-d5e0-4df7-8294-8be123bc7dd1` is retained at `sources/j105-keeg-dunk-scythe-attempt-04-review.png` (SHA-256 `f209a7db086a42f81d94b40964f5b628f36a68013ccc68d9091b3f2822450c77`). It has transparent outer corners but incomplete within-cell margins; orange basketballs remain in gather poses 1 and 2. Its exact prompt and review are in `j105-keeg-dunk-scythe-retry-04-prompt.md`; preview: `../../artifacts/native-render-preview/j105-keeg-dunk-scythe-attempt-04-review.png`.
- Retry 05 edit generation `exec-062ce935-4ecd-4670-82bd-d0bf771cf16d` is retained at `sources/j105-keeg-dunk-scythe-attempt-05-review.png` (SHA-256 `a50088ae6d1a1b905131ae0560c4599ac01c37850d5bdd1438bb1b03fbfccf60`). Alpha is transparent at all four outer corners and no nontransparent outer-edge pixels were found, but silhouette margins miss the required 50 pixels in every row; several figures touch cell edges (including poses 5, 6, 11, and 12). Orange basketballs remain in gather poses 1 and 2. Exact prompt and measured margins are in `j105-keeg-dunk-scythe-retry-05-prompt.md`; preview: `../../artifacts/native-render-preview/j105-keeg-dunk-scythe-attempt-05-review.png`. All five sheets remain rejected; none is eligible for cleanup, packing, or registration.
- Visual review of retries 03–05 confirms recognizable adult human Keeg anatomy, black hair and beard, tall purple mushroom hat, and the purple/lavender/silver kit; the images also show a broadly readable dunk sequence. Their ball handling does not meet the separate-ball requirement because gather poses still paint an orange ball. Separate Keeg ball-track alignment cannot be validated until a source passes the no-ball and cell-margin checks.

- Clip: Keeg `dunk-scythe`, right-facing, canon K.03.
- Prompt: `j105-keeg-dunk-scythe-prompt.md` (exact attempted prompt).
- Status: generation tool is available, but five reviewed candidates are rejected for ball contamination, inadequate margins, and/or edge pixels; `eligibleForPacking` is false.
- No cleaned source, atlas, or layout exists.

## Planned action and ball policy

The scythe name refers to the body motion only: Keeg sweeps the invisible ball low behind his hip, then reverses into a rising diagonal and a single release at pose10/tick21. The game ball must be separately rendered and must not appear in the sprite drawings. A proposed Keeg-specific track is recorded in the blocked provenance as planning data only; it has not been visually validated against generated art.

Next action: revise the prompt and generation approach to prevent painted basketballs and force compact within-cell pose scale; review alpha, every cell margin, anatomy, sequence, and empty hands before any cleanup or packing. No atlas layout or separate-ball alignment preview exists because no source has passed acceptance. `review_j105_keeg_dunk_scythe.py` regenerates the black/white grid review composites for all five candidates.
