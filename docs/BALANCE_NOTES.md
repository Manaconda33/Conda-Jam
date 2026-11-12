# Balance notes

Current defaults: `createMatch` advances at 60 ticks/s, quarters use the menu's 60/120/180-second setting (3:00 default), shot clock is 24 seconds, overtime is 60 seconds, turbo drains stamina when used, and same-team player collisions are not modeled. Ratings influence movement speed and shot likelihood in the current core; several listed skills are content metadata only.

Open shots are weighted by rating, defender distance, and range. A made shot has a deterministic ballistic path aimed to reach the hoop on its descending arc. A defender who jumps into the shot path can deflect the attempt. Rookie, Pro and Legend now adjust CPU shot range and frequency, passing, steal/block attempts and shot accuracy; local human shooting remains governed by player rating, openness, range and charge timing. The 100-game AI benchmark uses 30-second quarters and is not a human fun/balance study.

## CPU team play (`src/core/ai.js`)

Every CPU athlete is driven by a team AI: sticky man-to-man assignments, goal-side on-ball pressure that anticipates drives, rim help when the ball defender is beaten, block jumps timed to the real release point (only when the release is below block reach), landing-aware rebounding, off-ball spacing and cuts, and a handler that compares its shot value with the drive and the extra pass. Defenders see attackers with a reaction delay, which is what lets cuts and drives create separation. CPU players hold turbo whenever moving with purpose, because turbo raises top speed even with an empty stamina bar.

Difficulty scales the opposing CPU only (a human's CPU partner always plays Pro):

| | Rookie | Pro | Legend |
|---|---|---|---|
| On-ball cushion | 8 | 4.2 | 3.2 |
| Reaction lag on / off ball (ticks) | 8 / 24 | 2 / 10 | 0 / 4 |
| Help at the rim | never | 55% | always |
| Block-jump chance at a contestable release | 30% | 50% | 75% |
| Shot accuracy | −10% | 0 | +7% |

`node tools/ai-benchmark.mjs [games]` reproduces the table below (80 seeded games per row, 60-second quarters, original AI = commit `f2788aec`). The "casual human" is a scripted player who drives with turbo, shoots near the rim or when open, and mashes steal; it is a regression signal, not a human playtest.

| CPU vs CPU, per team | Pro before | Pro after | Legend before | Legend after |
|---|---|---|---|---|
| Points | 17.5 | 20.5 | 28.0 | 24.2 |
| Assisted baskets | 13% | 27% | 14% | 30% |
| Ball handler's teammate unguarded | 65% | 13% | 60% | 9% |
| Steals | 11.2 | 8.0 | 14.7 | 11.3 |
| Blocks | 0.7 | 1.2 | 1.2 | 1.6 |
| Dunks | 1.4 | 5.1 | 1.1 | 4.8 |
| Three-point share of shots | 16% | 20% | 82% | 55% |

| Casual human team win rate | Rookie | Pro | Legend |
|---|---|---|---|
| Before | 50% (13.7–17.8) | 42% (12.1–19.2) | 42% (16.3–28.5) |
| After | 63% (26.0–20.5) | 49% (23.3–22.6) | 42% (21.6–27.3) |

Blocks stay low because the default jump-shot release is above block reach (see Known issues); steals include intercepted passes.
