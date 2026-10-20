# Balance notes

Current defaults: `createMatch` advances at 60 ticks/s, quarters use the menu's 60/120/180-second setting (3:00 default), shot clock is 24 seconds, overtime is 60 seconds, turbo drains stamina when used, and same-team player collisions are not modeled. Ratings influence movement speed and shot likelihood in the current core; several listed skills are content metadata only.

Open shots are weighted by rating, defender distance, and range. A made shot has a deterministic ballistic path aimed to reach the hoop on its descending arc. A defender who jumps into the shot path can deflect the attempt. Rookie, Pro and Legend now adjust CPU shot range and frequency, passing, steal/block attempts and shot accuracy; local human shooting remains governed by player rating, openness, range and charge timing. The 100-game AI benchmark uses 30-second quarters and is not a human fun/balance study.
