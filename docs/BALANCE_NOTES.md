# Balance notes

Current defaults: `createMatch` advances at 60 ticks/s, quarters use the menu's 60/120/180-second setting (3:00 default), shot clock is 24 seconds, overtime is 60 seconds, turbo drains stamina when used, and same-team player collisions are not modeled. Ratings influence movement speed and shot likelihood in the current core; several listed skills are content metadata only.

Open shots are weighted by rating, defender distance, and range. A made shot has a deterministic ballistic path aimed to reach the hoop on its descending arc. A defender who jumps into the shot path can deflect the attempt. The 100-game AI smoke used 30-second quarters, seeds 1–100, and 35 different home/away franchise pairings; all 100 reached a final state within 60,000 ticks. Average scores were 4.97 home / 5.75 away points, with 24 overtime periods. These compressed AI-vs-AI results are an engineering sanity check, not a human fun/balance study.
