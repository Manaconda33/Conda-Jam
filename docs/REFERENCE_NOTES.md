# Reference notes

## Confirmed from the supplied specification

The master build prompt defines the functional target as a 2-on-2, side-scrolling, depth-simulated arcade basketball game. It calls for directional movement, three action buttons, turbo, fast possession changes, 2/3-point shots, fire streaks, four periods, a 24-second clock, and the exact JAMVERSE character roster. These are product requirements supplied by the creator, not claims about every detail of a 1993 rule variant.

## External historical references

- Historical source repository identified by the prompt: <https://github.com/historicalsource/nba-jam>
- The prompt calls out `BB.ASM`, `PLYR.ASM`, `PLYRSEQ.ASM`, `DUNK.ASM`, `DRONE.ASM`, and `GAME.EQU` for behavioral research only.

This first pass did not inspect the external repository, operator manuals, screenshots, or control guides. No observation below is attributed to that archive. The new implementation contains independent original JavaScript and original generated Canvas artwork; none of the source/archive assets are included.

## Current approximations

- 60 Hz deterministic step, seeded xorshift RNG, 4 regulation periods, 24-second shot clock, quick inbounds and overtime are implemented from the prompt's requirements.
- Human input is WASD/J/K/L; optional second keyboard athlete uses arrows and numpad 1/2/3. The face-button mapping follows the supplied table.
- Blocks, rim/backboard collisions, goaltending, hard-push collision windows, variable shot charging, and the exact historical fire-streak bookkeeping remain incomplete or approximate. See the feature matrix.
