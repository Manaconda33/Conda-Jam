# CODEX MASTER BUILD DIRECTIVE: JAMVERSE '96

**Build:** a complete, original, browser-playable 1990s arcade 2-on-2 basketball video game starring all 35 canonical original characters listed below. **Working title:** *JAMVERSE '96: Legends of the Hardwood*. **Primary audience:** the project's creator playing at home on desktop with keyboard or controllers. **Mission:** make a *real game* that is immediately enjoyable, not a menu, mockup, tech demonstration, concept document, video, or static image.

You are the lead gameplay engineer, 2-D technical artist, animator, tools programmer, sound designer, test engineer, QA lead, and release integrator. Execute work rather than merely describing a plan. Continue autonomously for as much of a **24-hour development budget** as the available execution environment actually supports, using checkpointed milestones and resumable handoffs. You cannot guarantee that a platform will run you for 24 uninterrupted hours; do not claim that it will. Do not burn time to satisfy a clock: prioritize durable, working improvements. If the execution session ends early, leave a detailed handoff sufficient for a subsequent Codex session to resume. Stop only for genuinely blocked external permissions or irreversible actions, not normal engineering decisions.

## A. Immutable objectives and boundary conditions

1. The spiritual reference is the **1993 arcade NBA Jam**, specifically the original 2-on-2, side-scrolling, depth-simulated, pixel-rich experience. Preserve *functional feel*: snappy movement, generous turbo, arcadey collision, dramatic multi-frame dunks, fast breaks, ball flight, hilarious knockdowns, crisp 2/3-point scoring, readable score/clock, strong CPU competition and fire streaks. Do NOT substitute an overhead basketball diagram, flat pong clone, turn-based simulator, NBA Live-style 3D basketball, or moving circles/silhouettes in place of final recognizable player sprites.
2. Reference for historical behaviors: https://github.com/historicalsource/nba-jam . Also inspect original 1993 arcade operator manuals, period gameplay capture/screenshots, and credible control guides. In particular, inspect the historic assembly modules `BB.ASM`, `PLYR.ASM`, `PLYRSEQ.ASM`, `DUNK.ASM`, `DRONE.ASM`, `GAME.EQU` as *behavioral research only* where accessible. Maintain a `docs/REFERENCE_NOTES.md` listing which observations are confirmed by sources vs design approximations. The provided archive appears to contain copyrighted assembly without an established permissive license; **DO NOT copy historical source code, game sprite assets, recordings, logos, team marks, NBA names, real player likenesses, or proprietary text into this project.** Reimplement mechanics independently and generate wholly original audiovisual assets. The interface must be branded JAMVERSE, not NBA Jam.
3. This is a *standalone new project*. If placed inside an existing directory/repository, inspect its instructions and structure before changing anything. Do not modify unrelated project repositories, migrate their branches, deploy publicly, purchase services, configure billing, or push to a remote without clear authorization. Local `git` branches/commits and a buildable local artifact are encouraged; publish to an authorized GitHub Pages destination only if its repository and release permission are already established.
4. All **35** canonical characters below must lead exactly one own franchise each; their franchise must contain the actual character as a selectable, playable roster member. Cleo is **not** on the active roster. All franchises must be selectable and participate in exhibition and season/tournament modes. Do not silently trim the league down to an MVP of 4–8 teams.
5. Each team must have **three distinct playable athletes** (the canonical star, a named partner, and a named alternate); selecting a two-athlete on-court lineup and substituting between periods must work. This means **35 teams, 105 uniquely named athletes, and no duplicate athlete IDs**. Supporting athletes are *new fictional sports-roster inventions*, not permanent additions to the creator's canonical fictional-character universe. They should be thematically suitable, never impersonate another team captain, and have distinct visual palettes and gameplay roles.
6. Present an intentionally original 1990s arcade aesthetic. Strong visual fidelity to the *era* is mandatory, not copying proprietary pixels. All characters must remain recognizable in their canonical anatomy. Specific players (Paprika, Dragon Queen, Suga, Quirky, Steeb, GB Design) require distinct custom sprite rigs and proportional treatments; do not force them into a generic human silhouette.
7. **Definition of done:** launch in an ordinary current Chrome, Edge, or Firefox browser; start from a menu; choose any two distinct teams and starting pair; play a full 2-on-2 match against a competent CPU; complete all four quarters/overtime; receive correct scoring, possessions, steals, rebounds and results; start another match without refreshing; enjoy working animation, sound, collision, UI, and original art. Additionally support local human vs human, accessible settings, save state, and representative campaign progression. No major errors, invisible ball, unplayable characters, softlocks, or placeholder black screens.

## B. Work style, progress, and decision policy

- Begin by checking the actual working directory, README, repository policies, toolchain, available browser automation, image-generation and audio-generation capabilities, and CI/test commands. Never claim to use an unavailable image model or browser automation framework. If you can generate art through tools, use them; otherwise render unique pixel art programmatically into PNG/spritesheets and build custom sprite components, rather than leaving placeholders. Commit original generators and generated outputs.
- Create `docs/PLAN.md`, `docs/FEATURE_MATRIX.md`, `docs/ASSUMPTIONS.md`, `docs/QA_REPORT.md`, `docs/ASSET_CATALOG.md`, and `docs/SESSION_HANDOFF.md`. Build a brief evidence-based architecture, identify critical path, then implement, run, and test. Update status files after milestones; distinguish **implemented / exercised / blocked / planned**, never call a feature complete merely because it is mentioned in docs.
- Work in this sequence: **vertical playable slice → correct gameplay → complete league → presentation polish → modes/saves → broad validation**, while maintaining testability throughout. Every major visual upgrade must keep a working game. Keep a development branch and small reviewable commits.
- Never intentionally spend hours on research without writing and exercising code. If scope pressure occurs, preserve a fully working core plus the entire 35-team roster first. Reduce optional cosmetics before sacrificing possession/scoring logic, animation readability, playable full matches, or the 35 franchises.
- For a 24-hour effort target, plan milestones around first 1–2 hours (run/score/move), 3–5 (shoot/block/steal/AI), 6–9 (complete quarters, game modes), 10–15 (35 characters, procedural athlete art), 16–20 (animation/audio/polish), 21–24 (full validation and bug fixes). These are *planning windows*, not promises of actual elapsed work or instruction to pause. Adapt based on test evidence.
- Use a clear severity policy: `P0` game won't start/crashes/cannot finish; `P1` bad possession/score/clock/collision/controls or major art fidelity failure; `P2` minor polish or tuning. Fix P0/P1 before adding stretch features. Record residual defects with reproduction steps rather than concealing them.

## C. Browser architecture, performance and hosting

**Preferred stack:** Vite + TypeScript + Phaser 3 for rendering, camera, spritesheets, layers, inputs and audio, **with a dedicated deterministic gameplay simulation**. You may choose PixiJS plus a custom state machine if it objectively lowers risk; explain the tradeoff in `docs/ARCHITECTURE.md` before coding. No server required, no backend logins, no monetization, no copyrighted external asset hotlinks. Keep dependencies lean, pinned and audited.

- Organized directories: `src/core/` fixed-timestep simulation (game clock, state machine, match, rules, physics), `src/gameplay/` movement/possession/shot/dunk/rebound/AI, `src/render/` camera/layers/effects/animation, `src/ui/`, `src/input/`, `src/audio/`, `src/content/teams.ts` and `players.ts`, `src/storage/`, `tools/generate-art/`, `public/assets/`, `tests/unit/`, `tests/integration/`, `tests/e2e/`, `docs/`.
- Type-check everything. Separate *game state* from rendering. Seedable RNG for repeatable tests. Fixed step at 60 simulation ticks per second; requestAnimationFrame accumulator with bounded catch-up and interpolation. Pause gameplay updates cleanly during tab inactivity or settings overlay. No duplicate RAF loops on restart. Keep collisions and ball possession deterministic within an acceptable test tolerance.
- Render to a 4:3 internal art viewport (e.g. 400×300 or 480×360) or another documented authentic-feeling arcade aspect ratio with **nearest-neighbor pixel scaling** and dynamic letterboxing in widescreen. Maintain correct physical UI hit targets, readable sprite sizes and player labels at 720p/1080p. Avoid blurry filtering, half-pixel sprite jitter, stuttering camera and tween artifacts.
- Keyboard and Gamepad API with hot-plug support. Support 1–4 local humans (one per active athlete), mapping them flexibly across the two teams; unclaimed athletes are CPU controlled. One human per team and two humans on one team must both work. Provide sensible 1P and 2P keyboard layouts, rebinding, gamepad profiles, controller disconnect fallback, key ghosting safeguards and active-focus handling. Controller rumble optional; no need for network multiplayer to reach core acceptance.
- Use procedural locally generated WebAudio SFX/music or wholly original licensed tracks and record attribution. Support mute, independent sliders, reduced motion, colorblind-friendly indicators, flashes/shake limiter, captions, and reliable mute persistence. Browser audio unlock after user gesture.
- Use `localStorage` with versioned schema/migrations and defensive parsing for settings, tournament progress, player records and last teams; app works with storage blocked and no network. Provide `npm run dev`, `npm run build`, `npm run preview`, `npm run test`, `npm run test:e2e`, `npm run lint` if configured. Use relative asset paths and GitHub Pages-safe Vite base configuration with documented preview/release process. No uncaught console errors, missing assets or 404s.
- Target a steady 60 rendered FPS on typical desktop hardware, playable at 30 FPS on modest integrated GPUs. Cache textures, atlas generated art, cull off-screen actors, object-pool particles, and monitor collision/frame timing. Avoid >150ms input lag. Minimize startup bundle and loading time. Provide diagnostics screen showing tick time/FPS, seed and game state when debug mode is enabled.

## D. Authentic-feeling 2.5D court / perspective (critical)

**The scene must look and behave like a side-scrolling 1993 basketball arcade cabinet, not a top-down tactical board.**

- Court occupies the lower ~55–65% of the viewport, hoop/backboard at left and right ends, with an audience wall, scoreboard/scorer's table and lively benches at the back. Render a richly dithered hardwood pattern, distinct key/paint, arcs, half-court circle, boundaries and believable court lines. Distinguishable near and far sideline widths and perspective mapping. Crowd rows should have varied original pixel humans/creatures with animation cycles, signs and flashes. Scorer's table is themed to the home team's universe without licensed ads.
- Create a world coordinate system: x along length, y for floor depth (near/far), z for ball/jump height. Use a well-documented 2.5D projection from (x,y,z) to pixels; perspective changes screen y and modest sprite scale/foreshortening. Player movement is eight-directional **on the ground plane**; sort sprites by depth using their **feet**, not their sprite-top position. Shadows are pinned to world-ground position; airborne players/ball rise above their separate shadows. The backboard, rim, net and player overlap order must look correct during dunks and blocks.
- Horizontal camera tracks the active action and scrolls across a court wider than the displayed playfield. Smooth predictive follow with limited deadzone, bounded camera coordinates and no sudden jumps on turnovers or player switching. Keep score and clock fixed to screen, not world. Render hoop and ball clearly throughout flight; add trajectory guidance or indicators when ball exits view vertically.
- The left/right baskets are real world objects with *two planes* (backboard and rim) and visible front/back net segments. Rim collision is geometry/state based; ball can bank, rattle, bounce or swish through. 2 or 3 points determined by the launcher's ground location relative to the **correct basket's** three-point arc at release. Score once and only once when a valid descending ball crosses hoop plane; dunk is a valid alternative scoring event. Prevent backboard collision from causing phantom made shots.
- Nonhuman characters get bespoke collision/silhouette abstractions that preserve fairness: visible height ≠ collision footprint; giant dragon may be perspective-scaled for match readability, with regulation-equivalent collision/shot heights so species doesn't automatically break balance. Their *visual* species must never change into an unrecognizable human athlete.
- Shot/dunk camera: brief optional screen shake, quick anticipation, stretch/smear frames, rim bend, original particle/confetti effects, fireball treatment for streaks and a readable result overlay. No excessive cutscenes interrupting responsive gameplay.

## E. Rules, ball simulation and possession (non-negotiable)

**Teams:** precisely two athletes on court per side at all times; no real-world teams, referees or licensed uniforms. Three athletes rostered per team, choose starters; substitutions at quarter boundaries or legal stoppages. Four regulation quarters, default **3:00 displayed game-clock minutes per quarter**, configurable shorter or longer. Game clock pauses for between-quarter screens and designated inbound states. Provide 24-second possession clock, tipoff possession, turnovers, inbounds after scores, period-end handling, halftime side switch, overtime (e.g. 1:00 clock repeated until decided) and final scores/stats.

**Authentic arcade law:** no personal fouls, no free throws, no out-of-bounds throw-in delays longer than needed, no travelling/double dribble violations; hard pushes and cartoon contact are integral. Call goaltending when a defender illegally touches a potentially scoring ball on its downward arc above the rim within the protected cylinder/area before a valid rim touch; award 2/3 to the appropriate offense once, not multiple times. Implement 24-second violations and controlled out-of-bounds, with quick opposing possession reset. Exact arcade variant differences should be documented and reasonable settings-based compromises made explicit. No 4-point shots unless a clearly separate **optional fantasy mutator**; baseline baskets are 2 or 3.

**Player actions:** accelerate and decelerate across all 8 directions; dribble states and direction-aware ball anchor; sprint using turbo that depletes and recharges (unless on fire); pass to smart target (normal and turbo pass); catch/interception/deflection; shot button presses and held-charge release with tuned timing window; layup; spectacular dunk on approach with momentum, range and dunk stat; post-shot landing; rebound (offensive and defensive); block with high leap timing; steal attempt; press/push that can knock an opponent back or cause loose ball; short stun and get-up; turbo-enhanced shove and turbo-boosted jumps; automatic reasonable handoff of ball-control and input roles. AI partners must pursue rebounds, avoid obstructing human drives, cut for passes and recover on defense.

**Ball:** model independent ball state (`carried`, `pass`, `loose`, `shot`, `dunk`, `rim_contact`, `dead`), position x/y/z, velocity and last-touch owner. Use an authoritative finite-state machine and event idempotence (a single `ScoreCommitted` event per successful attempt). Smooth ballistic flight with configurable gravity and shooter release vector; bank/rim collision, loose-ball bounces, pickup rules and sane possession arbitration. A visibly released shot cannot teleport into the hoop or remain attached to the shooter. Never allow two players to possess one ball.

**Shooting:** probabilistic accuracy based on 2PT/3PT attribute, distance, shot quality/release timing, defender proximity, blocks, momentum, turbo and fire state. Seed RNG for reproducibility. Shooting must be fun: most open close shots succeed, contest matters, long-range heat-checks occasionally succeed, impossible late-clock shots remain thrilling but not guaranteed. Field-goal rate and other outcome statistics should be tracked and tuned using simulations. Shooting over backboard or own basket needs graceful outcomes. Handle tip-in/jump shot/dunk priority deterministically.

**Fire:** three consecutive **made field goals by the same player, without another player scoring between those makes**, triggers original-style individual streak mode. Set unlimited turbo and elevated shot accuracy/flashy ball FX. Opposing team's made basket ends it; optionally expire after four additional made baskets by the burning player as in 1993-style descriptions. Teammate makes do not erroneously extinguish a burning player if the chosen historical rule does not require it; set and document exact streak bookkeeping. Add animated FIRE status and celebratory burst with an original non-licensed audio sting.

**Possession fairness:** CPU and player obey identical shot-clock, ball, score and collision rules. No rubber-banding by secretly teleporting players or ignoring collisions. An optional mild arcade comeback tension modifier can be exposed in settings and disabled by default. Avoid permanently pinning ball under rim, repeated inbound loops, unstoppable shove-locks or accidental auto-scores.

## F. Controls and four-player local multiplayer

The 1993 arcade control vocabulary was joystick plus **Shoot/Block, Pass/Steal, Turbo**. Design around that simplicity. Support combinations, holds, taps and modern controller mapping, showing labels contextually in a one-screen tutorial:

| Context | Direction | Shoot/Block | Pass/Steal | Turbo |
|:--|:--|:--|:--|:--|
| Offense | Move/dribble/drive | Jump-shot, layup or dunk depending on momentum/zone | Pass (turbo+pass = laser pass) | Sprint and amplify dunks |
| Defense | Move/guard | Jump/block/contest | Steal; turbo+steal = shove | Sprint/stronger leap |
| Loose ball | Chase/recover | Jump/rebound | Catch/recover where appropriate | Sprint |

- Default P1 keyboard: WASD move, J shoot/block, K pass/steal, L turbo; Enter pause/start. Default P2: arrow keys move, Num1 shoot/block, Num2 pass/steal, Num3 turbo; a visible settings panel allows remap to avoid keyboard conflicts. For 3P/4P strongly prefer gamepads; indicate workable mappings and device availability. For gamepad, left stick/D-pad move, south face pass/steal, west face shoot/block, right trigger turbo, Start pause. Support input edges/held events in a replayable input frame data structure, not ad hoc DOM events.
- Team selection supports P1/P2 selecting side, specific lineup from three-person roster and CPU difficulty; P3/P4 may join on the matchup screen or at a designated period break. Shared keyboard with WASD + arrows and two gamepads must not drop inputs. Include start/pause/resume/restart/quit confirmation and direct return to team select.
- CPU difficulty: Rookie, Pro, Legend. Rookie helps learn; Pro competitively defends and uses passes; Legend demands skill without obvious cheating. Human teammate AI is competent but not overpowered.

## G. CPU decision-making / tuning

Implement hierarchical AI instead of one actor perpetually chasing the ball. Each AI athlete understands team possession, role (ball handler, off-ball cutter, primary defender, help defender), basket direction, open lanes and shot clock. Use a steering/utility controller evaluated 5–15Hz with per-frame movement integration; choose cover distances, contest timing, switch assignment, chase rebounds, pressure turnovers, avoid own-teammate collisions, opportunistic steal/shove, inbound safely, execute fast break, seek appropriate shot vs pass. Make skills and difficulty matter; use seeded imperfect human-like reaction, not omniscient aim. Ensure the AI itself can score repeatedly and finish an entire match if both teams CPU; expose CPU-vs-CPU quick-sim for automated testing. Add controlled timeout recovery from AI or stuck-ball deadlocks, with exact event logging.

Tune numerical movement/shot/dunk outcomes with a small sandbox (`/dev`) allowing reproducible shots and replays. Seeded unit tests must cover conversion rate bands, on-fire trigger/break, shot-clock and period boundaries, scoreboard, no NaNs, no overlapping human assignments and complete match termination. Generate `docs/BALANCE_NOTES.md` explaining defaults and shot probabilities; calibrate for entertainment rather than real-NBA statistics.

## H. Original sprite art / scene assets: production specification

Visual target: **lush, brightly saturated, slightly gritty 1990s arcade raster art** with readable pixel silhouettes, digitized-sprite-era shading, occasional chunky dithering, expressive facial closeups and colorful wooden arena. Avoid default vector stick figures, minimalist rectangles, emoji sprites, flat geometric avatars or AI-art pasted on uncut backgrounds.

**Asset pipeline:** original pixel portrait/bust for every captain (35), gameplay sprite atlases for all 105 athletes using archetype-based rig components plus bespoke species silhouettes, **unique team jersey palettes and numbers**, court tiles, crowd and parallax layers, hoop/backboard/net, ball + shadow, effects, logo crests, title/cards/UI typography. Give every file transparent background as applicable and store human-editable generation recipes/configs. If image generation is available, obtain coherent master sheets and validate sprite extraction; if not, build pixel anatomy using a deliberate programmatic art authoring pipeline (layer masks, limited palettes, highlights/shadows, correct directions and proportions). Do not claim image generation happened if it did not. Generated assets must be original and compatible with the game's license/deployment goals.

**Sprite animation minimums for on-court star rigs:** idle breathing (4+ frames), 8-direction running (at least 4 frames per direction, mirror only where visually safe), ball-carry/dribble (4+), turbo run (4+), pass windup/release/catch (3+), standing jumper (8+), multi-pose dunk ascent/finish/descent (10+), defensive stance, jump block, steal/shove, recoil, knockdown/get-up, rebound, celebration/fire and bench. Supporting teammates may reuse animation *logic*, not indistinguishable face/jersey sprites. Provide a few signature dunk animations adapted to animal/dragon/serpent anatomies. Design each action with clear startup, active and recovery frame windows, separate gameplay collision windows, shading, shadow and motion FX.

**Faithful anatomy instructions:** Manaconda's crest grows backwards off both temples rather than upright antlers; do not omit beard/blue glasses. Paprika must be small four-footed kit fox, never a humanoid. Dragon Queen must remain a true four-legged or otherwise clearly nonhumanoid dragon with visible long tail; she may grasp/dribble/dunk via forelimb/muzzle/tail and heroic jump without becoming a human. Suga remains a cobra with recognizable hood; invent snake-appropriate dribble/pass maneuvers using tail/coils without humanizing him. Quirky retains zebra-stripe/orangutan hybrid torso and astonishingly long arms. Steeb remains a compact wombat. GB Design remains a jaguar; Kraken remains an elf-like humanoid with pointed ears and no default tentacles. Avek's guitar, Steeb's lantern, Keeg's hat, Jennifer's glasses, E. Indigo's facial orbit and golden heart, Alexithymia's blank black screen face, Jragena's wings/horns and Lavi's short curls must appear in portraits and in small-sprite interpretation where legible; on court, props may be safely stowed or stylized to permit athletic moves, but must appear in intro/celebration and cannot be canonically removed.

Camera visuals: scrolling arena with distinct near/far court, pitch-dark but animated audience, front-layer rail, scorer's table with fictional sponsor graphics, eight-bit spark highlights, three-point line and hoop support posts; animated nets/rebound effects and fire/flame overlays. In debug screenshot compare side-by-side with period-relevant *historical reference for composition only*, not exact asset pixels. Render team select cards with captain portrait, team name, three athletes, numbers, all category ratings and OVR, wins/losses.

**Audio:** original squeaking shoes/footsteps, dribble variants, swish, iron clang, glass/rim strain, horn, pass, steal, impact, crowd rise, chants, short looping retro breakbeat/chiptune/sampled-style cues, menus, game over. The announcer can be optional synthesized or entirely subtitle-based; do not reproduce original game voice samples or signature callouts. Consider playful *new* announcer lines for the original cast.

## I. Core UX / modes / save data / accessibility

1. Title + controllable attract screen / original animated montage; press to start, sound toggle, tutorial, controls, settings, credits and `Play` immediately accessible.
2. Exhibition mode: choose any two of 35, roster starters and alternates, CPU difficulty, 1–4 humans, arena, quarter length and court direction; allow a full game and rematch. Teams and player stats shown in selection UI.
3. Season/Tournament: configurable single-elimination bracket or ladder of opposing franchises (at least eight-round or similarly meaningful progression), wins/losses, upcoming opponent, between-match roster substitutions, persistent unlocked cosmetic court variants/jersey palettes where practical. The underlying matchup outcome must derive from actual games, not from forced cutscene outcomes. Resume saved progression after browser reload.
4. Practice: free-shooting with a controllable player, replace ball, practice turbo/dunks/blocks; optional guided tutorial covering offense/defense and shot timing.
5. Options: difficulty, quarter length, speed/difficulty sliders only where safe, audio volumes, screen shake, reduced flash/reduced motion, text size, high contrast/colorblind markers, control rebinding, reset progress with confirmation.
6. Match HUD: visible home/away scores, period and clock, shot clock, controlling player names and turbo bars, possession marker, `ON FIRE` status, selected athletes, ball-offscreen pointer. Result screen: final scores and per-athlete points, 2FG/3FG, dunks, assists, steals, blocks, rebounds and highest streak. Score overlay never obscures action for long.
7. Excellent restart handling: back-to-back games, changes in controllers, tab blur/focus, quarter transition, overtime repeat, pause/unpause, match aborted to menu, save migration and blocked storage all behave gracefully.
8. Include responsive keyboard navigation, screen-reader labels for settings/menus, accessible instructions and reduced-motion mode. Actual fast gameplay remains principally visual/motor but menu controls must not become inaccessible.

## J. Franchise and athlete manifest (authoritative seeds)

Use these **exact 35 franchise identities and three athlete display names** as initial canonical *game data*. The first athlete is an established original character; the second and third are brand-new supporting game-only athletes. You may improve fictional city punctuation or style if necessary but keep identity stable. All players are selectable. `OVR` numbers are *initial target ratings* and may be mechanically recalculated with a documented formula if the targets remain approximately preserved. Each athlete must also have typed stats: speed, two-point shooting, three-point shooting, dunk, pass, steal, block, rebound, turbo and strength (0–99). Compute an OVR weighting with position/archetype awareness and a rarity-free balance; no team's strength should make a beginner unable to win.

| # | City / realm | Franchise | Canonical captain (OVR) | Teammate (OVR) | Alternate (OVR) | Team accent / strategic identity |
|---:|:--|:--|:--|:--|:--|:--|
| 01 | Chicago | **Condas** | **Manaconda (92)** | Reed Ashcroft (84) | Juniper Vale (79) | Indigo / bark gold; all-around floor leadership |
| 02 | Emberwood | **Kits** | **Paprika (90)** | Piper Quickstep (83) | Briar Foxglove (78) | Russet / cream; speed, steals, fast breaks |
| 03 | Moonmorel | **Hex** | **Keeg (89)** | Moxie Capwell (82) | Dorian Mycel (80) | Purple / silver; trick passing, long balls |
| 04 | Neo Runway | **Precision** | **Accu (92)** | Nova Stitch (84) | Echo Catwalk (78) | Teal / violet; quick-release shooting |
| 05 | Blackthorn | **Court Kings** | **Leo (91)** | Sable Regent (84) | Marco Vellum (78) | Black / crimson; patient picks and shooting |
| 06 | Scoria | **Rams** | **Krios (94)** | Flint Rooker (82) | Ash Harth (78) | Ember red / charcoal; dunks and power |
| 07 | Vesper Harbor | **Undertow** | **Kraken (89)** | Marin Dusk (83) | Cove Knell (78) | Burgundy / copper; steals and blocks |
| 08 | Rainbow Alley | **Runners** | **Lavi (88)** | Pixel O'Keeffe (83) | Fern Tempo (77) | Emerald / rainbow; hustle and midrange |
| 09 | Firenze | **Serenity** | **Ria (88)** | Luca Velori (82) | Sera Bellini (79) | Jade / wine; passing precision |
| 10 | Lumen Bay | **Circuits** | **Gummiefish (90)** | Mira Wavelength (84) | Azul Voss (79) | Aquamarine / electric blue; perimeter offense |
| 11 | Crimson Harbor | **Chains** | **Colossus (91)** | Roxie Coil (83) | Vanta Slate (77) | Black / blood-red; physical defense |
| 12 | New Orleans | **Fleur Noire** | **McFleurdel (89)** | Sylvie Shutter (83) | Noelle Pinstripe (80) | Monochrome / fleur violet; finesse |
| 13 | Thornvale | **Breakers** | **Toph (87)** | Cade Brixton (84) | Fenn Static (79) | Black / thorn-purple; gritty defense |
| 14 | Gildforge | **Titans** | **Heph (91)** | Ember Rivet (83) | Bronze Calder (78) | Sapphire / molten gold; blocks and fundamentals |
| 15 | Nightshade Vale | **Blooms** | **Liv (89)** | Violet Lorne (82) | Cassian Quill (80) | Lavender / night-black; outside shooting |
| 16 | Astral Drift | **Orbits** | **E. Indigo (92)** | Sol Meridian (83) | Mist Halo (77) | Azure / gold; vertical finishing |
| 17 | Blueglass | **Knights** | **Myth (89)** | Wren Bravado (82) | Eden North (80) | Cobalt / black; balanced counters |
| 18 | Darkspire | **Hellcats** | **Wicked (90)** | Raven Lux (84) | Thorn Sable (78) | Scarlet / black; intimidate and drive |
| 19 | Solstice Coast | **Surf** | **Anna (90)** | Kai Suncrest (82) | Talia Kestrel (78) | Sea-green / orange; athletic transitions |
| 20 | Nocturne City | **Blankfaces** | **Alexithymia (89)** | Detective Halftone (82) | Trace Noire (79) | Black / steel; tactical steals |
| 21 | Neon Circuit | **Pilots** | **Alex (90)** | Jett Byte (85) | Cass Pixel (78) | Cyan / magenta; rapid passing |
| 22 | Amp City | **Thunderchords** | **Avek (92)** | Riff Voltage (83) | Fret Nova (78) | Copper / electric white; monster dunks |
| 23 | Inkspire | **Razors** | **Cilia (91)** | Thorn Script (82) | Nyx Steel (79) | Forest-green / black; disruptive defense |
| 24 | Lantern Hollow | **Wombats** | **Steeb (88)** | Moss Quarry (81) | Digger Finch (78) | Olive / amber; rebounds and hustle |
| 25 | Cedarbrook | **Wardens** | **Jennifer (89)** | Willow Root (83) | Rowan Bark (78) | Forest green / turquoise; team defense |
| 26 | Duskmere | **Nightwings** | **EOW (88)** | Moth Vale (82) | Owl Argent (77) | Deep violet / silver; steals and closeouts |
| 27 | Crownfire | **Sovereigns** | **Dragon Queen (93)** | Auric Scale (84) | Cinder Royal (78) | Navy / royal gold; finishing and rim defense |
| 28 | Venom Delta | **Fangs** | **Suga (92)** | Nox Striker (82) | Viper Veil (78) | Navy / electric blue; quick steals |
| 29 | Greenwall | **Giants** | **6foot10 (92)** | Moss Granite (82) | Thump Alder (79) | Moss green / stone; paint domination |
| 30 | London | **Royal Spots** | **GB Design (89)** | Camden Union (83) | Poppy Stitch (78) | Cobalt / red / white; versatile shooters |
| 31 | Coppermoon | **Skyblades** | **Jragena (93)** | Draya Staffwind (83) | Kael Rune (79) | Copper / violet; height and passing |
| 32 | Cheshire Hollow | **Grinners** | **Dea (89)** | Lilt Smile (82) | Violet Wink (78) | Magenta / violet; deception and midrange |
| 33 | Emerald Den | **Wolves** | **Pack Mama (89)** | Fern Howl (82) | Koa Vale (79) | Emerald / teal; teamwork and defense |
| 34 | Stripewood | **Longarms** | **Quirky (90)** | Scribble Turner (82) | Palette Spry (78) | Black/white stripes / paint orange; steals and reach |
| 35 | Verdant Reach | **Archers** | **Lula (90)** | Sage Fletch (83) | Hazel Bloom (78) | Leaf green / amber; precision and passing |

- Each team has distinct primary/secondary/accent colors, home/away jersey treatments, logo crest, captain portrait, court center mark and at least one crowd slogan. Avoid confusing team pairs on the same court; adjust away palette automatically if colors clash.
- Give every athlete: unique slug/id, full display name, fictional uniform number (0–99 unique within team), height category, rig/species, archetype, jersey palette, visual seed, short play style, and skill vector (0–99). OVR is not the sole factor in probability. Use team archetype diversity and ensure captain OVR roughly in the high-80s to mid-90s, supporting athletes mid-70s to mid-80s as above. Gameplay must support any legal cross-team combination, including visually extreme creature matchups.
- Produce **all 35 × 3 roster records** in data; build a validation script that fails if captain/team identity missing, player reused, ratings out of range, identical three-person rosters, required sprite rig/portrait missing, empty cities, or missing team presentation. Make `npm run validate:content` run in CI.

## K. Canonical character reference for art generation and animation

The following describes **all 35 currently active canonical characters**. These instructions are intentionally embedded here because the model generating the game may have **zero access to previous conversations**. Honor fixed anatomy/features in character portraits, selection art, idle frames, celebrations, and gameplay sprite silhouettes. Generic player jerseys may overlay garments while preserving recognizable face/skin/species/body/hair/features; preserve signature items in intro/celebration and where safe in on-court pose. Do not invent permanent universe lore or permanent magical powers to explain gameplay. Cleo is excluded.

### 01. Manaconda — Chicago Condas
Human male scholar-adventurer, olive-brown skin, weathered expressive features; gray-streaked, curly dark hair; full salt-and-pepper beard; striking deep-blue **rectangular glasses**. His **Driftwood Crest** is made of real-looking living driftwood branches that grow from **both temples and sweep compactly backward hugging the skull**, with small blossoms along them. NOT upright antlers, Viking horns, a crown or branches sprouting out of his forehead. Layered weather-worn leather adventurer armor with purple accents and an indigo scarf, and a very large backpack full of books, papers and tools. Intelligent, durable, gentle but capable. Basketball sprites can simplify the pack on-court but must retain the crest, glasses, beard and indigo palette; show full pack in portrait/intros.

### 02. Paprika — Emberwood Kits
A **real four-footed tiny kit fox**, nonhumanoid; compact wild-fox anatomy, pointed muzzle, extremely large triangular ears, bright expressive eyes, russet-orange fur, cream/white muzzle, chest, underside and a big bushy pale-tipped tail. Curious, quick, affectionate, observant; especially close companion to Manaconda. She is neither a child-sized human, a wolf, a furry anthropomorphic fox, nor a large dog. Uncloaked by default; a gray hooded cloak may appear only in scene-specific solo portraits, not the basketball uniform. Design distinct quadruped forepaw/nose basketball control, lightning-footed cuts and a small-fox high-flying dunk animation without transforming her anatomy.

### 03. Keeg — Moonmorel Hex
Flamboyant male witch with black hair, neatly trimmed/tight black beard, extravagant **extremely tall ornate purple witch hat** with silver trim. Layered lavender, purple and silver cloth, belts, jewelry, rings, occult detailing and repeating mushroom iconography. Friendly theatrical showman and clever magical trickster in presentation, without giving him unestablished permanent powers in sports rules. Hat silhouette and mushrooms must be legible on portraits and celebrations. Purple/silver jersey adaptation.

### 04. Accu — Neo Runway Precision
Stylish confident young woman with vivid **green eyes**, black twin ponytails, blunt bangs, and a modern precisely faded/closely cropped treatment at the sides from her most recent redesign. Ponytails remain long and unmistakable. Hair accents are outfit-coordinated (teal is appropriate here), not canonically fixed. Precision-tailored contemporary stage/runway fashion, sleek athletic silhouette, polished makeup/nails, purposeful confidence; modern stylish sportswear with teal/black, no unwanted frilly ruffles, pink costume default or military armor. Convey precision, balance and explosive dance-like footwork.

### 05. Leo — Blackthorn Court Kings
Pale aristocratic adult man with long **wavy black hair** and refined mustache. Clean, controlled Victorian/gothic-inspired black formalwear with restrained crimson accents and occasional red rose or hibiscus-like blooms. Handsome, composed, intellectually intimidating and imperious; not a feral villain or clownish vampire. Tailored black/crimson basketball variation and master-strategist poise.

### 06. Krios — Scoria Rams
Enormously muscular giant red-skinned male brute with huge black **ram horns**, wild dark beard, imposing build; sturdy hides, rough primitive layers, heavy rugged boots. Loyal, proud, aggressive, domineering but fully intelligent. Make colossal mass evident while gameplay collision stats remain fair. A brutally powerful dunker.

### 07. Kraken — Vesper Harbor Undertow
Default form is **elf-like adult male**, natural skin tone, short/closely cropped hair, pointed ears, calm refined face; tasteful burgundy and dark gothic layers, copper accents and a Cthulhu-themed amulet. Calm, controlled, quietly eerie. He is **not** a tentacle-faced mindflayer, blue-skinned monster or sea creature under ordinary conditions; tentacled forms are rare separate transformations and NOT allowed as the default basketball portrait/sprite.

### 08. Lavi — Rainbow Alley Runners
**Female** human with **short** fiery ginger curls, freckles, bright green eyes, silver-rim glasses; green sweater, black trousers and boots with rainbow-colored shoelaces. Energetic approachable look, warm humanity and distinct rainbow-lace shoes. Never render Lavi male or give her long red hair. Basketball kit may adapt her green sweater but preserve curls, glasses and lace motifs.

### 09. Ria — Firenze Serenity
Elegant adult Italian woman; long softly wavy dark hair with subtle iridescent sheen where light catches; measured, refined face and introspective, observant demeanor. Fashion is sophisticated tailoring and muted jewel tones rather than oversized fantasy armor. Occasionally associated with a very small realistic hamster, optional in portrait or sidelines, never replace character anatomy with hamster attributes. Restrained emerald/wine jersey.

### 10. Gummiefish — Lumen Bay Circuits
Human woman of mixed Asian/European heritage with **vivid blue hair**, signature fish-shaped hairpin, subtle aquatic color gradients and almost invisible beneath-skin microcircuit/nanotech textures. Luminous aquatic blue/silver styling. She remains human, NOT a mermaid or fish-headed being. Technical and graceful with synthetic-water motif effects.

### 11. Colossus / Col — Crimson Harbor Chains
Pale cyber-gothic woman; long silver-white hair, red round glasses, crimson flowers woven into hair, black layered outfits with chains, chokers, belts and sharply controlled red accents. Luminous skin and commanding severe composure. Gothic industrial styling, not generic metal armor or monochrome hairstyle without red glasses. Chain-inspired defensive flourish is visual, not a weapon in gameplay.

### 12. McFleurdel — New Orleans Fleur Noire
Modern goth / goth-punk woman with bold **black-and-white hair**, contemporary artistic clothing that is not Victorian costume and not gratuitously revealing. Fine **fleur-de-lis** detail and passion for photography; black-white-silver silhouette with violet accents. Do not substitute an unrelated gothic celebrity aesthetic. A camera/fleur detail may appear in portrait or celebration.

### 13. Toph — Thornvale Breakers
Shaggy blond hair; pale teal eyes; rectangular black spectacles; black ear gauges; pinned black beanie; oversized black hoodie featuring a distinctive **purple thorn** graphic. Casual, current, game-character-ready styling with relaxed tough silhouette. Preserve every identifier, especially beanie, gauges and thorn hoodie.

### 14. Heph / HephAIstus — Gildforge Titans
Ancient male artisan-deity; blue-gray/ashen skin shot through glowing **gold kintsugi-like fracture lines**, warm amber-gold glowing eyes, swept-back white/silver hair, very long white beard (may be braided). Sapphire/black layered robes, dark hood and restrained intricate gold filigree. Wise, warm, monumental craftsman. Fractures symbolize repaired beauty, not zombie rot. Preserve gold glowing pattern in sprite texture.

### 15. Liv — Nightshade Vale Blooms
Adult elf scholar with fair skin, silver eyes, long flowing light-lavender hair. Scholarly gothic romantic academy attire in black/violet/lavender, delicate lace and sheer layers, silver trim, poisonous-flower and **nightshade** botanical motifs. Intelligent, delicate and self-possessed; preserve ears and hair and do not transform her into generic sinister sorceress.

### 16. E. Indigo — Astral Drift Orbits
Male supernatural figure with azure blue skin, messy icy-white hair, **small blue deerlike antlers**, cyan irises with **left sclera black and right sclera white**, hollow/smoky **black tilted ring** orbiting the lower face. A **glowing golden heart outline** on the chest is vital. Ripped gray jeans, barefoot, often gently floating. His identity is surreal cosmic melancholy, not robot armor. The heart, mismatched eyes, ring and antlers remain recognizable, and float is visual flair rather than automatic basketball advantage.

### 17. Myth — Blueglass Knights
Human woman with fair skin, shoulder-length wavy brown hair with bangs, vivid **bright-blue rectangular glasses**, wide lively smile; fitted black clothing and black leather jacket. Grounded yet spirited and charismatic. No gratuitous horns, armor, sorceress props or species changes.

### 18. Wicked / PurrfectlyWicked — Darkspire Hellcats
Strong gothic woman with long vivid red hair, swept-back horns, tailored black leather fashion and powerful controlled stance. Poised, dangerous, stylish, not a ravening monster. Preserve actual horn shape and signature vivid hair; blood-red/black jersey variation.

### 19. Anna — Solstice Coast Surf
Human woman, warm bronzed complexion, striking blue-green eyes, athletic-curvy and strong body type without extreme bodybuilding or artificial thinness. Suitable performance sportswear. Canon does not establish specific magical powers or special species; do not invent either. Strong, confident, graceful all-around athlete.

### 20. Alexithymia — Nocturne City Blankfaces
Android with a **perfectly blank black display-screen face**, zero human facial features. Elegant dark noir suit, long trench coat and fedora, detective-like silhouette. Contrast the unreadable void of the face against other very expressive portraits. Can animate head tilt and screen glints but **do not draw a human face on the display**.

### 21. Alex — Neon Circuit Pilots
Adult woman with fair skin, short side-swept blonde hair, blue eyes, black rectangular glasses and gaming headset with cyan-magenta trim. Charcoal streamlined gaming/racing techwear; unmistakable glowing **cyan and magenta cheek circuit nodes**. Clever, competitive, warm expression. Not a generic faceless robot or cyber-soldier; headset, glasses, hairstyle and cheek nodes must show.

### 22. Avek — Amp City Thunderchords
Aggressive, commanding male metal deity/rock icon with face partly obscured by mask/visor; his hair color, natural skin color and eye color are **not canonically specified** and should stay obscured rather than invented as permanent truths. Metallic armor, leather, technological heavy-rock silhouette, molten orange-gold-white/lightning details. His **guitar is mandatory**, serving as signature divine-metal instrument, and must feature prominently in portraits and entrance celebrations (safely slung/stowed during actual basketball animation). Name is **Avek only**, no surname.

### 23. Cilia — Inkspire Razors
Pale woman with long intense red hair, piercing green eyes, extensive black/dark-green tattoos, several piercings. Heavy black leather, chains, studs, metal-inspired fashion; tattoo-activated dark arcane geometry may adorn introductions. Athletic but specific, not a generic punk woman. Preserve green-eyed/tattooed detail. Canonical display name **Cilia**, no surname.

### 24. Steeb — Lantern Hollow Wombats
**Small stocky anthropomorphic wombat**, gray-brown fur, rounded ears, wide blunt muzzle, cheeky expressive face. Earth-toned olive-green field adventurer clothes, rugged travel equipment, and his essential **warm amber lantern**. Lantern is core signature and should appear in portrait/bench celebration, not a royal stamp. Do **not** invent bureaucratic divinity, forged seals, royal decree magic or stamped documents as his theme. Name **Steeb**, no surname.

### 25. Jennifer — Cedarbrook Wardens
Tall (~5'9") human druidic herbalist/protector, ivory skin, angular oblong face; build balances lankiness, strength and gentle fullness. Deep teal eyes, **purple wire-rim glasses**, long dark chocolate-brown curls, frequently half-up with braids and feathers. Deep forest-green floral robes with bronze fringe, turquoise necklace and ring, plain sandals; can have an understated botanical staff. Quiet, protective, authoritative, kind. Newfoundland dog companion possible only in decorative sidelines, not mandatory or a new player.

### 26. EOW — Duskmere Nightwings
Very pale adult human gothic woman, long straight dark-brown hair, black/deep violet clothing, nocturnal wildlife motifs such as **moths, spiders, owls and rabbits**. Her visual language is elegant dark nature, not generic vampire armor. Preserve human anatomy and distinctive brown (not jet-black) hair.

### 27. Dragon Queen — Crownfire Sovereigns
**A true nonhumanoid female dragon**, deep navy-blue scales dusted/flecked with gold, molten-gold eyes, regal facial structure, **long visible tail**, powerful limbs and dragon wings, elegant ceremonial blue-and-gold layered cloth/embroidery and minimal gold jewelry. Benevolent, poised, majestic monarch. Never a woman in a dragon costume, human with wings, dragon-girl or permanently bipedal human. Implement a custom dragon on-court rig, scaled for competitive readability, with natural dragon forelimb/tail ball interactions and a mighty acrobatic dunk. Must remain recognizably a whole dragon.

### 28. Suga — Venom Delta Fangs
**Male cobra**, predominantly dark navy/electric-blue scales, widened iconic cobra hood, yellow eyes, sharp orange markings, reflective face mask; associated with **two venom daggers**. Sleek predatory serpent anatomy with coils/tail, not merely a human athlete with snake eyes. Daggers are nonfunctional ceremonial portrait props, stowed for fair play; design original tail-based basketball handling, coiling jump, darting steals. Preserve hood, mask, markings and blue scale palette.

### 29. 6foot10 — Greenwall Giants
Towering huge muscular **green-skinned orc without tusks** under any circumstances. Hair pulled into a messy high top-knot/man-bun. Rugged practical look, not monster parody; has an associated repaired handmade firearm in non-sports character imagery, but **no weapon use in basketball**. May include harmless mechanical repair details in a sideline illustration instead. Preserve green skin, tusklessness, giant scale and messy knot.

### 30. GB Design — London Royal Spots
**Anthropomorphic jaguar**, with readable feline snout/ears, spotted coat, expressive athletic limbs and a deliberate **Union Jack / British flag** visual identity on jersey fashion, patches and banner. Not a human in spotted clothes, not a tiger, and not a walking flag costume. Canonical biography is sparse, so keep introduced lore/game powers minimal. British flag red-white-blue + jaguar gold palette.

### 31. Jragena — Coppermoon Skyblades
Drow/tiefling-like adult woman, rich **very dark purple skin** with freckles, hazel-green eyes behind purple cat-eye glasses, long warm mahogany-to-copper hair. Curving ornate horns, jewelry/piercings, **large dragonlike wings** and magical double-ended staff. Majestic, focused, capable, controlled rather than a generic demon. Staff may be secured to back for gameplay, but wings, horns, glasses, freckles, and copper hair must remain visible. Do not give permanent free-flight basketball cheat.

### 32. Dea — Cheshire Hollow Grinners
Pale gothic woman, **feline ears**, red eyes, exaggerated supernatural **Cheshire-cat grin**, distinctive purple-magenta jacket/coat and pale or white ruffled blouse, patterned trousers. Charmingly uncanny, playful, confident, bright grin visible in portrait and celebration. She is not an ordinary housecat, nor should the defining grin vanish. Arcane sigils may appear as cosmetic flourishes.

### 33. Pack Mama — Emerald Den Wolves
Teal-haired protective woman with identifying **wolf-eared hood**, regal rich emerald-green dress/gown or athletic adaptation, magical/storybook warmth, strong compassionate pack-leader aura. She should **not** become a literal werewolf by default, or a grim military commander. Preserve teal hair, hood-ear outline and green palette. Pack Mama **is active in this general 35-character canon**; if a separate scene-specific document excludes her, that does not override this game's inclusion.

### 34. Quirky — Stripewood Longarms
An **orangutan-zebra hybrid animal**, NOT a human in zebra-stripe clothing. Zebra striping across a genuinely hybrid body; exceptionally elongated orangutan arms and hands, extremely quirky creature silhouette, expressive animal face. Known for paint, brushes, art-making tools and altering surfaces artistically. On-court rig must showcase long arms and striped nonhuman anatomy; brush decoration in portrait/celebration, no unfair auto-steal through visible physical reach.

### 35. Lula — Verdant Reach Archers
Green-haired female **elf archer** with amber eyes and facial magical rune markings. Her clothing consists of leaves and living plant/botanical materials. A graceful **bow** is an essential identifiable prop in portrait/intros and may be strapped in bench poses, safely stowed during sports. Long elf ears, woodland elegance, botanical construction, confident archer precision. Do not create a generic green-haired human athlete.

**Canon priority:** If the creator provides newer direct reference images or explicit corrections in the working session, those override this document where they conflict; otherwise treat the descriptions here as fixed. Some references originally originated in a separate 35-character canon document, not present in the Codex workspace: this full specification is provided to prevent missing or invented facts.

## L. Gameplay feel and delight: measurable experiential targets

This project will be judged on whether someone keeps playing for fun, not on code volume.

- **First 30 seconds:** from clean load, a keyboard-only new user must be able to press Play, choose a team, learn the controls with a visible one-screen cheat sheet, reach tipoff, dribble to the rim, perform a pass, attempt a shot and understand whether it went in. The ball and hoop must always be visible or signposted. The player must immediately feel acceleration, dribble beats and sound feedback.
- **First 2 minutes:** show an exciting fast break with a high-flying dunk, a missed-shot rebound, a steal/deflection, CPU defense and at least one natural pass exchange. Fast shot-to-inbound turnaround. Crowd/scoreboard react. Actions should be controllable, never passive animations masquerading as a simulation.
- **First complete game:** four quarters, all possession and clock transitions, overtime on a tie, halftime switch, quarter-break substitutions, per-player box score, winner/loser sequence and rematch that works without page reload.
- **Second complete game:** choose completely different teams, including at least one nonhuman captain and a different court color scheme; all graphics, ball hooks, character animations and match ending still work.
- **Personality:** 35 franchise logos/captain cards, original arena motifs, readable big-headed or slightly exaggerated proportions, dynamic facial portraits, sport-specific player ratings, identifiable jersey palettes, snappy sound effects and chaotic-but-intelligible contact/dunks. Optional goofy features may be added as *settings toggles* after core stability: big-head mode, low gravity, super-turbo, wild court lighting, fireball trails. Keep normal rules as the default.
- **Responsiveness:** inputs cause perceivable actions on the first simulated frame possible; animation anticipates but does not lock a character unreasonably; turbo makes a visible difference; defense has viable counters; players can win on skill rather than CPU dice rolls alone.
- **Scoring excitement:** variation in arcs, rim bounces, jump height and dunk poses; no instant guaranteed shots from half court except explicitly chosen mutator; any very strong or weak shooter still respects context.

## M. Test plan, acceptance contracts, and independent verification

You must **run** automated tests and a browser build, not just author them. Supply results with command, environment, exit status and artifact evidence. Use Vitest (or another justified TypeScript runner) for unit tests and Playwright/Chromium (or the available equivalent) for end-to-end smoke tests. If browser installation is blocked, report this truthfully and run best available headless or local manual checks; never mark browser-tested without a browser.

### M1. Rules / physics unit tests

1. A player at a valid inside-the-arc release scores exactly 2, even if his body moves behind the arc after release; behind arc scores exactly 3. Same for either direction. No 4-point score under normal rules.
2. Ball touching the top of backboard or rim does not automatically count; made basket requires specific hoop-crossing state with a unique scoring event. A scored dunk cannot score a second time when the falling ball enters hoop collider.
3. Player A holds possession ⇒ no other player can hold possession. Valid steal/pass/rebound correctly updates last touch, inbound and shot clock. Stolen possession resets shot clock as intended; rebound transition matches documented chosen variant.
4. Charge a shot then pause/restart while ball in flight: no leaked timers, detached ball, doubled score or stale event callbacks.
5. Three unbroken made baskets by one player ignite; two do not; an opposing made basket extinguishes; natural duration expiration works; power bonus and zero drain are applied and later cleared. All sequences repeat with a fixed seed.
6. Shot clock at 0 triggers one violation and a valid inbound, never repeated calls. Quarter at 0 transitions exactly once, excludes additional gameplay actions and preserves score. First/last-frame buzzer-beater rules are explicit and tested.
7. Invalid shot attempts, player leaving court, ball out of playable bounds, knockdown on scoring, tipoff and substitution leave sane player/ball positions and positive bounded velocities.
8. Goaltend only on qualifying descending shot before legal rim contact; touch on rising shot is a normal block; goal points go to shooting team and do not credit defender. A second collision cannot duplicate award.
9. Determinism: same teams, initial state, RNG seed and input tape ⇒ same simulation state/events after N ticks (within documented floating precision). Variable render FPS must not alter scoring outcomes.
10. Simulation of AI-vs-AI for 100 full games across several teams completes with no exceptions, timeouts, NaNs, runaway score, deadlocked inbound or unbounded ball coordinates. Log score distributions and shot percentages to tune playability.

### M2. Data / visual content tests

11. Exactly **35** teams, **105** unique athlete records, and **35 unique playable canonical captains**. Cleo is absent. Each captain ID exists in exactly one team and is the named starter by default.
12. Every team has city, display name, palette, 3 roster slots, logo, at least 1 captain portrait, full rating block and 3 playable sprites. Do not count a plain name card as a sprite. No blank asset paths, failed atlas loads or URL 404.
13. Special anatomy snapshots for Manaconda (backward crest), Paprika (kit fox), Kraken (elf, no tentacles), Steeb (wombat+lantern), Dragon Queen (full dragon/tail), Suga (cobra hood), Quirky (hybrid long arms), GB Design (jaguar+flag), Accu (twin ponytails), E. Indigo (eyes+golden heart+orbit), Jragena (wings/horns), Avek (guitar), Alexithymia (blank screen face). Check art in both roster card and in-game action, not merely metadata.
14. Different teams generate visually distinct **jerseys, logos, accents, names and floor paint**. Supporting athletes never all have the same face or an unmodified silhouette. Verify depth sorting while multiple creatures run across near/far lanes.
15. All minimum animation states in section H exist in atlas metadata and transition correctly; no sudden standing T-pose, clipping through floor, blinking sprites, upside-down camera transforms or floating shadow.

### M3. Browser E2E journeys

16. New browser context → load title → choose **Chicago Condas** vs **Crownfire Sovereigns** → tipoff → run left/right/up/down → pass to teammate → shoot → pause → resume → finish shortened full match → view box score → rematch → no page reload. Save annotated screenshot(s).
17. Choose **Emberwood Kits** vs **Venom Delta Fangs** → play Paprika vs Suga; verify genuinely nonhuman sprite rigs and no generic people in their places. Repeat with **Stripewood Longarms** vs **Lantern Hollow Wombats**.
18. P1 keyboard vs CPU, P1/P2 split-team keyboard, P1/P2 same-team local coop, two gamepads if available, mixed keyboard/controller, P3/P4 joined where connected. Controller-disconnect or lost-window-focus must not crash; game pauses/falls back safely.
19. Exhibition and campaign each complete a match; reload page and resume last campaign progress and settings. Blocked localStorage loads playable defaults. Browser resize/fullscreen letterbox keeps court, HUD and menu focus visible.
20. Directly reproduce buzzer-beater, timeout, tie overtime, goaltend, 24s violation, loose-ball rebound, fire/streak completion, substitutions, end-of-quarter lead change and return to title. Use dev/debug deterministic scenarios where needed. Assert visible state and internal event trace.
21. Browser has zero **uncaught** errors and zero missing resources during tested flow; `npm run build`, TypeScript, lint and all available tests pass. Achieve working `npm run preview` with no external network requests for assets.

### M4. Performance and review evidence

- Benchmark sustained typical gameplay with crowd, animation and at least four athletes; report median frame rate, 1%-low or percentile frame timing when measurable, simulation CPU time and bundle sizes. Catch frame stutters after a dunk, score or menu transition. Keep a `docs/PLAYTEST_CHECKLIST.md` for human QA of fun and polish.
- Capture actual screenshots (not mockups) of: title menu, 35-team selection grid, Chicago Condas captain card, Paprika/Dragon Queen nonhuman cards, normal court play, successful dunk, active fire effect, score at quarter end, final box score and campaign ladder. Put into `artifacts/screenshots/` and reference in README. Create a short captured gameplay clip/GIF if local tools support it, but do not block release on video generation.
- Take at least three passes over the **visual** render, checking camera projection, leg and arm readability, court line fidelity, team distinguishability, rim interaction and crowd coherence, rather than relying exclusively on test assertions.
- Include a reproducible smoke harness or debug input playback and a minimal `docs/KNOWN_ISSUES.md`. Do not claim “no major errors” unless full-match playthrough tests back it up.

## N. Deliverable files and handoff, in order of importance

1. **Complete running game source** in the working repository, with package manifest and Vite browser build. No proprietary archive files included. Generated original game artwork and audio resources bundled locally. Versioned content manifest of 35 teams and 105 athletes.
2. `README.md` with clear player instructions, complete controls (keyboard and gamepad), startup commands, how to choose teams, quarter length, on-fire rules and game modes. State tested browser(s).
3. `docs/FEATURE_MATRIX.md`: every mandatory mechanic as `PASS / FAIL / PARTIAL / NOT TESTED`, link to tests/evidence; remaining gaps cannot be called done.
4. `docs/QA_REPORT.md`: exact commands, results, coverage, actual screenshot paths, performance observations, validated team count, known defects and steps to reproduce.
5. `docs/REFERENCE_NOTES.md`: arcade behavioral references, cited URLs and each deliberate modern modification; note that the new implementation uses original code/assets.
6. `docs/ART_DIRECTION.md` and `docs/ASSET_CATALOG.md`: visual scale, palette rules, human vs creature rigs, animation frame recipes and attribution/original generation provenance.
7. `docs/SESSION_HANDOFF.md`: what has been completed with commit IDs, what is pending, what was attempted unsuccessfully, precise state of server/repo/tests, and the **single next best work item** with steps to resume. This file is essential if your autonomous runtime expires before the target.
8. Optional `npm run dev:scenario` / debug menus for deterministic physics and shot tuning. Optional deployment to a preauthorized Pages destination only; otherwise deliver steps and a tested production bundle (`dist/`).

## O. Git workflow / red lines

- First inspect environment and preserve existing work. Do not destroy or overwrite user changes. Use an isolated feature branch when repository structure permits. Make checkpoints on passing builds/tests. Commit messages describe actual completed functionality; avoid giant unreviewable 'finished everything' claims.
- Do **not** copy any source or runtime asset from the referenced historical code archive; do **not** ship NBA team/player names, NBA logo, NBA Jam title art, ROMs, original audio recordings or copied copyrighted sprites. Write new basketball logic and assets from scratch with documented inspiration. This enables a browser game with original IP and avoids basing release on unclear archival permissions.
- Do not deploy/release publicly or take external paid services actions without authorization. You may launch a local dev server and take screenshots/test recordings through supported tools.
- Never bypass failing tests, hardcode screenshots, cheat by inflating scores or force the result to pass the QA harness. Fix underlying game state/physics/controls. If a requirement is not viable, log exactly why and deliver the best robust implementation possible rather than quietly excluding it.

## P. Final response format you must deliver to the creator

Your final report should concisely include:

- **PLAY NOW:** actual tested development/preview URL if currently available, or exact two-command local launch path; link to deployed game *only if deployment really succeeded*. Do not invent a URL.
- **BUILT:** the playable features, 35-team/105-player validation result, art/animation system, modes, save and controller support with proof.
- **TESTED:** scripts run, result counts, browsers tested, screenshots/recordings, one full-game completion and nonhuman matchup.
- **GAPS:** remaining issues and any design approximation differing from 1993 rules.
- **RESUME:** current branch/commit, handoff file and specific next action if the full 24-hour development goal could not finish in a single session.

## Q. Immediate command: implement, don't summarize

Start now. Inspect workspace, create the project scaffold if clean, record key assumptions, and build the smallest *real and playable* four-athlete possession/score loop before beautifying the menu. Ensure **every subsequent step preserves playability**. Continuously turn the architecture and content above into working browser game code; actively test it, patch bugs and document evidence. Then build out all 35 teams and all 105 playable athletes, pixel sprites and original audio, complete regulation rules and game modes, and iterate until the formal acceptance criteria pass or your environment's execution budget genuinely runs out.

**Priority mantra: a playable arcade basketball game, correctly scoring and controlling, then a beautiful and complete 35-team universe. Never ship a beautiful static mockup in place of basketball.**
