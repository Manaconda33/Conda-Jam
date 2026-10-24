# Marco Vellum — source-only animation status

Marco has six accepted source clips: five baseline locomotion clips plus `pass-behind`. The `shoot`, `pass`, and `pass-overhead` generated packages are retained but rejected by independent review pending margins/background cleanup; `receive` is rejected for clipped hair and an unrequested chest emblem. These four candidates are ineligible for packing or authored-clip counts.

`pass-behind` is the only new accepted action atlas in this source-only set. It has six distinct right-facing poses, short waved black hair, clean-shaven adult human identity, black/crimson/white kit, no painted basketball, and preserved raw/cleaned/atlas hashes and review preview. It remains outside the shared runtime manifest.

The generated `shoot`, `pass`, `pass-overhead`, and `receive` provenance records contain athlete-specific ball-path claims, but Marco's runtime mapping only defines `idle-ball`, `dribble`, and `dribble-run` tracks. Implement and verify separate Marco-specific action paths when those clips are replaced and later integrated.

The next source action is `pickup`; its exact prompt is saved at `tools/generate-art/marco-vellum-pickup-prompt.md`. Generation is paused by HTTP 429 `usage_limit_reached`; the provider reported reset at 2026-10-24 13:10:15 UTC.
