// CPU team play: man-to-man defense, off-ball spacing and cuts, and
// expected-value decisions for the ball handler. Pure and deterministic:
// every random draw goes through the match RNG passed in by the simulation.
import { anchorTick, sampleBallHeight, sampleBallForward, flightHeightFromHand } from './animation.js';

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
// Ticks before release at which a defender jumps so the block apex meets the ball.
export const BLOCK_LEAD_TICKS = 6;
const CONTEST_RANGE = 6.5;
const RIM_PROTECT_RANGE = 7;
// Defender height at the first apex tick of a timed block jump; the game's
// blockReach(defender) is added on top to find the highest deflectable ball.
const BLOCK_APEX_Z = 1.6;
const JUMP_SHOT_PEAK = 2;
// Share of missed shots on which the shooting team sends a crasher from range.
const CRASH_RATE = 0.35;

export const AI_TUNING = {
  Rookie: { onBallGap: 8, help: 0, shotThreshold: 0.85, passMargin: 0.3, reaction: 30, driveDistance: 26, blowBy: false, stealCooldown: 120, defenseLag: 24, onBallLag: 8 },
  Pro: { onBallGap: 4.2, help: 0.55, shotThreshold: 0.95, passMargin: 0.1, reaction: 12, driveDistance: 42, blowBy: true, stealCooldown: 100, defenseLag: 10, onBallLag: 2 },
  Legend: { onBallGap: 3.2, help: 1, shotThreshold: 1.2, passMargin: 0.05, reaction: 6, driveDistance: 48, blowBy: true, stealCooldown: 80, defenseLag: 4, onBallLag: 0 }
};

export function aiTuningFor(difficulty = 'Pro') {
  return { ...(AI_TUNING[difficulty] ?? AI_TUNING.Pro) };
}

function attackHoop(court, team) {
  return { x: team === 0 ? court.hoops[1] : court.hoops[0], y: 50 };
}

function towards(from, to, amount) {
  const dx = to.x - from.x, dy = to.y - from.y, d = Math.hypot(dx, dy) || 1;
  return { x: from.x + dx / d * amount, y: from.y + dy / d * amount };
}

function inCourt(court, point) {
  return { x: clamp(point.x, court.minX + 3, court.maxX - 3), y: clamp(point.y, court.minY + 4, court.maxY - 4) };
}

function nearestDistance(point, players) {
  return players.reduce((best, p) => Math.min(best, dist(point, p)), 99);
}

// True when any defender stands within `width` of the segment from `from` to `to`.
export function laneBlocked(from, to, defenders, width) {
  const dx = to.x - from.x, dy = to.y - from.y, len2 = dx * dx + dy * dy || 1;
  return defenders.some(d => {
    const t = ((d.x - from.x) * dx + (d.y - from.y) * dy) / len2;
    if (t <= 0.04 || t >= 1) return false;
    return Math.hypot(from.x + dx * t - d.x, from.y + dy * t - d.y) < width;
  });
}

// Mirrors the make-probability inputs used by the simulation's makeShot so the
// CPU values a spot the same way the shot resolver will.
export function expectedShotValue(ctx, match, player, at = player) {
  const { court, scoreValue } = ctx;
  const hoop = attackHoop(court, player.team);
  const defenders = match.players.filter(p => p.team !== player.team);
  const open = nearestDistance(at, defenders);
  const quality = clamp((open - 5) / 30, 0, 1);
  const distance = Math.abs(hoop.x - at.x);
  const accuracy = ctx.accuracyFor ? ctx.accuracyFor(player) : (match.cpuProfile?.accuracy ?? 0);
  const base = player.shoot / 100 * 0.35 + quality * 0.32 + (distance < 42 ? 0.2 : 0.04) + accuracy + (player.onFire ? 0.3 : 0);
  const points = scoreValue({ ...player, x: at.x, y: at.y }, player.team);
  const rimDunk = player.dunk > 70 && Math.hypot(hoop.x - at.x, hoop.y - at.y) < 18 && !laneBlocked(at, hoop, defenders, 3.5);
  return Math.max(clamp(base, 0.2, 0.88) * points, rimDunk ? 1.9 : 0);
}

// Turbo raises top speed even with an empty stamina bar (stamina only adds
// acceleration), so the CPU holds it whenever it is moving with purpose.
const TRAIL_LENGTH = 24;

function aiState(match) {
  match.ai ??= { tick: 0, marks: {}, cuts: {}, nextSteal: {}, trail: {} };
  return match.ai;
}

function recordTrail(match, state) {
  for (const p of match.players) {
    const trail = state.trail[p.id] ??= [];
    trail.push({ x: p.x, y: p.y });
    if (trail.length > TRAIL_LENGTH) trail.shift();
  }
}

// Where a defender perceives an attacker: `lag` ticks in the past. This reaction
// delay is what lets cuts and drives create separation, and scales difficulty.
function perceived(state, player, lag) {
  const trail = state.trail[player.id];
  if (!trail?.length || lag <= 0) return player;
  return { ...player, ...trail[Math.max(0, trail.length - 1 - lag)] };
}

// Pair each defender with one attacker, keeping the previous pairing unless a
// switch saves a clear amount of total distance (prevents jittery swaps).
function assignMarks(match, state) {
  for (const defendingTeam of [0, 1]) {
    const defenders = match.players.filter(p => p.team === defendingTeam);
    const attackers = match.players.filter(p => p.team !== defendingTeam);
    if (defenders.length !== 2 || attackers.length !== 2) {
      for (const d of defenders) state.marks[d.id] = attackers[0]?.id;
      continue;
    }
    const [d0, d1] = defenders, [a0, a1] = attackers;
    const straight = dist(d0, a0) + dist(d1, a1), swapped = dist(d0, a1) + dist(d1, a0);
    const current = state.marks[d0.id];
    const valid = (current === a0.id || current === a1.id) && state.marks[d1.id] !== current;
    const keepStraight = valid ? current === a0.id : straight <= swapped;
    const useStraight = keepStraight ? straight <= swapped + 12 : straight + 12 < swapped;
    state.marks[d0.id] = useStraight ? a0.id : a1.id;
    state.marks[d1.id] = useStraight ? a1.id : a0.id;
  }
}

function move(p, target, turbo) {
  const dx = target.x - p.x, dy = target.y - p.y, d = Math.hypot(dx, dy);
  if (d < 1.5) return { x: 0, y: 0, turbo: false };
  return { x: dx / d, y: dy / d, turbo: turbo && d > 3 };
}

function shotInProgress(p) {
  const action = p.animation?.action;
  if (!action || p.stun > 0) return null;
  const clip = p.animation.clip, release = anchorTick(clip, 'release');
  if (action.kind === 'shot') {
    const point = { x: p.x + p.facing * sampleBallForward(clip, release, p.id), y: p.y };
    const z = flightHeightFromHand(sampleBallHeight(clip, release, p.id), JUMP_SHOT_PEAK);
    return { release, atRim: false, point, releaseZ: z };
  }
  if (action.kind === 'dunk' && !action.released && !action.awaitingCatch) return { release, atRim: true, releaseZ: 3 };
  return null;
}

function defenseInput(ctx, match, state, p, tuning) {
  const { court, rand, profile } = ctx;
  const ball = match.ball;
  const attackers = match.players.filter(a => a.team !== p.team);
  const hoop = attackHoop(court, 1 - p.team); // the basket this player protects
  const actualHandler = attackers.find(a => a.hasBall);
  const actualMan = attackers.find(a => a.id === state.marks[p.id]) ?? actualHandler ?? attackers[0];
  const handler = actualHandler && perceived(state, actualHandler, tuning.onBallLag);
  const man = actualMan && perceived(state, actualMan, actualMan.hasBall ? tuning.onBallLag : tuning.defenseLag);
  const out = { x: 0, y: 0 };

  // Contest an attempt that is gathering: close out, then time the jump.
  const shooter = attackers.find(a => shotInProgress(a));
  if (shooter) {
    const shot = shotInProgress(shooter);
    const releasePoint = shot.atRim ? hoop : shot.point;
    const toRelease = shot.release - shooter.animation.tick;
    const range = shot.atRim ? RIM_PROTECT_RANGE : CONTEST_RANGE;
    if (dist(p, releasePoint) < range + 6) Object.assign(out, move(p, towards(releasePoint, hoop, 1.5), true));
    const blockable = shot.releaseZ <= BLOCK_APEX_Z + (ctx.blockReach ? ctx.blockReach(p) : 5.2);
    if (toRelease === BLOCK_LEAD_TICKS && blockable && dist(p, releasePoint) < range && rand() < profile.blockChance) out.blockPressed = true;
    if (dist(p, releasePoint) < range + 6) return out;
  }

  if (ball.mode === 'pass' && dist(p, ball) < 9) return { ...out, ...move(p, ball, true) };

  let target, chase = false;
  if (man?.hasBall) {
    // Anticipate the drive: guard where the handler is heading, goal-side.
    const lead = { x: man.x + actualMan.vx * 6, y: man.y + actualMan.vy * 6 };
    target = towards(lead, hoop, tuning.onBallGap);
    chase = Math.hypot(actualMan.vx, actualMan.vy) > 0.22 || dist(actualMan, hoop) < dist(p, hoop);
  } else if (man) {
    target = towards(man, hoop, 5);
    if (handler) {
      // Sag toward the ball so the cutter's lane is not a free pass.
      target = { x: target.x + (handler.x - target.x) * 0.2, y: target.y + (handler.y - target.y) * 0.2 };
      const mate = match.players.find(d => d.team === p.team && d.id !== p.id);
      const handlerToHoop = dist(handler, hoop);
      const mateBeaten = !mate || mate.stun > 0 || dist(mate, hoop) > handlerToHoop + 1.5 || dist(mate, handler) > 9;
      if (tuning.help > 0 && handlerToHoop < 30 && mateBeaten && rand() < tuning.help) target = towards(handler, hoop, 3);
    }
  } else {
    target = towards(ball, hoop, 8);
  }
  const t = inCourt(court, target);
  Object.assign(out, move(p, t, chase || dist(p, t) > 3));

  if (actualMan?.hasBall && dist(p, actualMan) < 6 && state.tick >= (state.nextSteal[p.id] ?? 0) && match.possessionAge > tuning.reaction) {
    if (rand() < profile.stealChance) { out.stealPressed = true; state.nextSteal[p.id] = state.tick + tuning.stealCooldown; }
    else if (rand() < 0.0015) { out.shovePressed = true; state.nextSteal[p.id] = state.tick + tuning.stealCooldown; }
  }
  return out;
}

function handlerInput(ctx, match, state, p, tuning) {
  const { court, rand, profile } = ctx;
  const hoop = attackHoop(court, p.team), dir = Math.sign(hoop.x - 100);
  const defenders = match.players.filter(d => d.team !== p.team);
  const mate = match.players.find(m => m.team === p.team && m.id !== p.id);
  const toHoop = dist(p, hoop), open = nearestDistance(p, defenders);
  const laneClear = !laneBlocked(p, hoop, defenders, 4.5);
  const out = { x: 0, y: 0 };
  const settled = match.possessionAge > tuning.reaction;

  // Finish at the rim: dunk when moving downhill, otherwise lay it in.
  const towardRim = (hoop.x - p.x) * p.vx > 0.12;
  if (p.dunk > 70 && toHoop < 18 && towardRim) return { ...move(p, hoop, true), shootPressed: true };
  if (toHoop < 11 && settled) return { ...out, shootPressed: true };

  const myValue = expectedShotValue(ctx, match, p);
  let alternative = laneClear && toHoop < tuning.driveDistance ? 1.6 : 0;
  if (settled && mate && mate.stun === 0) {
    const mateValue = expectedShotValue(ctx, match, mate) + (match.humanPlayerIds?.includes(mate.id) ? 0.15 : 0);
    const lane = !laneBlocked(p, mate, defenders, 4.5);
    if (lane) alternative = Math.max(alternative, mateValue);
    const pressured = open < 5 && match.possessionAge > 30 && nearestDistance(mate, defenders) > 10 && mateValue >= myValue;
    if (lane && (mateValue > myValue + tuning.passMargin || pressured) && rand() < profile.passChance) {
      const mateToHoop = dist(mate, hoop);
      const lob = mate.dunk > 70 && mateToHoop < 20 && nearestDistance(mate, defenders) > 6;
      return { ...out, passPressed: true, turbo: dist(p, mate) > 30, alleyOop: lob };
    }
  }

  const urgent = match.shotClock < 4;
  const threshold = match.shotClock < 8 ? tuning.shotThreshold - 0.25 : tuning.shotThreshold;
  const inRange = Math.abs(hoop.x - p.x) < profile.shotDistance;
  // Take the shot only when it beats the drive or the extra pass.
  const worthIt = myValue >= threshold && myValue >= alternative - 0.1;
  if (settled && inRange && (urgent || (worthIt && rand() < profile.openShotChance))) return { ...out, shootPressed: true };

  // Movement: attack an open lane, otherwise probe for an angle.
  let target, turbo;
  const guard = defenders.reduce((best, d) => dist(d, p) < dist(best, p) ? d : best, defenders[0]);
  const hipSide = guard && Math.abs(guard.y - p.y) > 1 ? (guard.y > p.y ? -1 : 1) : (Math.floor((match.possessionAge + p.x) / 80) % 2 ? 1 : -1);
  const beaten = guard && dist(guard, hoop) > toHoop;
  const crowded = open < 4.5;
  if ((laneClear || beaten) && toHoop < tuning.driveDistance + (beaten ? 15 : 0)) { target = { x: hoop.x - dir * 2, y: 50 }; turbo = true; }
  else if (toHoop < tuning.driveDistance + 10 && ((crowded && tuning.blowBy) || match.possessionAge % 150 > 70)) {
    // Attack the defender's hip: an angled turbo drive to the side he is not on.
    target = { x: hoop.x - dir * 6, y: 50 + hipSide * 12 }; turbo = true;
  }
  else if (Math.abs(hoop.x - p.x) > 46) { target = { x: hoop.x - dir * 30, y: 50 + (p.y < 50 ? -8 : 8) }; turbo = true; }
  else {
    target = { x: hoop.x - dir * 24, y: 50 + hipSide * 20 };
    turbo = open > 4;
  }
  return { ...out, ...move(p, inCourt(court, target), turbo) };
}

function offBallInput(ctx, match, state, p, tuning) {
  const { court } = ctx;
  const ball = match.ball;
  const hoop = attackHoop(court, p.team), dir = Math.sign(hoop.x - 100);
  const handler = match.players.find(a => a.hasBall && a.team === p.team);
  const defenders = match.players.filter(d => d.team !== p.team);
  if (ball.mode === 'pass' && ball.targetId === p.id) return move(p, ball, true);
  if (!handler) return move(p, inCourt(court, { x: hoop.x - dir * 30, y: p.y < 50 ? 30 : 70 }), false);

  const guard = defenders.find(d => state.marks[d.id] === p.id) ?? defenders.reduce((b, d) => dist(d, p) < dist(b, p) ? d : b, defenders[0]);
  const toHoop = dist(p, hoop);
  const cutUntil = state.cuts[p.id] ?? 0;
  const guardLost = guard && (guard.stun > 0 || dist(guard, hoop) > toHoop + 2 || dist(guard, p) > 12);
  const canCut = state.tick >= cutUntil + 50 && toHoop < 60 && Math.abs(handler.x - hoop.x) < 55;
  if (canCut && (guardLost || ctx.rand() < 0.012)) state.cuts[p.id] = state.tick + 55;
  const side = handler.y < 50 ? 1 : -1;
  if (state.tick < (state.cuts[p.id] ?? 0)) return move(p, { x: hoop.x - dir * 6, y: 50 + side * 6 }, true);

  if (match.shotClock < 5) return move(p, inCourt(court, towards(handler, hoop, -12)), false);
  const shooter = p.shoot >= 80;
  const spot = shooter ? { x: hoop.x - dir * 40, y: 50 + side * 36 } : { x: hoop.x - dir * 24, y: 50 + side * 26 };
  const t = inCourt(court, spot);
  return move(p, t, dist(p, t) > 8);
}

// Where a ball in flight will come down, read from its current velocity
// (gravity matches the simulation's 0.026 per tick).
export function predictLanding(ball, maxTicks = 40) {
  const a = 0.013, disc = ball.vz * ball.vz + 4 * a * Math.max(0, ball.z);
  const t = clamp((ball.vz + Math.sqrt(disc)) / (2 * a), 0, maxTicks);
  return { x: ball.x + ball.vx * t, y: ball.y + ball.vy * t };
}

function looseBallInput(ctx, match, p) {
  const { court } = ctx;
  const ball = match.ball;
  const spot = inCourt(court, predictLanding(ball, 12));
  const mates = match.players.filter(m => m.team === p.team && m.stun === 0);
  const chaser = mates.reduce((best, m) => dist(m, spot) < dist(best, spot) ? m : best, mates[0] ?? p);
  if (chaser.id === p.id || dist(p, ball) < 10) return move(p, spot, true);
  const ownHoop = attackHoop(court, 1 - p.team);
  return move(p, inCourt(court, towards(ball, ownHoop, 16)), false);
}

function reboundInput(ctx, match, state, p) {
  const { court } = ctx;
  const ball = match.ball, shooterTeam = match.possession;
  const hoop = { x: ball.targetX ?? attackHoop(court, shooterTeam).x, y: 50 };
  const descending = ball.vz < 0 && ball.z < 6;
  const landing = inCourt(court, descending ? predictLanding(ball) : towards(hoop, { x: 100, y: 50 }, 6));
  const mate = match.players.find(m => m.team === p.team && m.id !== p.id);
  const crasher = !mate || mate.stun > 0 || dist(p, landing) <= dist(mate, landing);
  // The shooting team crashes only from close range or on some attempts; the
  // defense has inside position, so both defenders hunt a short carom.
  if (p.team === shooterTeam) {
    // Decide once per attempt whether the shooting team crashes the glass.
    if (state.crashFor !== ball.attemptId) { state.crashFor = ball.attemptId; state.crash = ctx.rand() < CRASH_RATE; }
    const crash = crasher && (dist(p, hoop) < 20 || state.crash);
    return move(p, crash ? landing : inCourt(court, towards(hoop, p, 30)), crash);
  }
  if (crasher || dist(p, landing) < 14) return move(p, landing, true);
  const man = match.players.find(a => a.id === state.marks[p.id]);
  return move(p, inCourt(court, man ? towards(man, hoop, 3) : towards(hoop, p, 6)), true);
}

export function teamAiInputs(match, controlled, ctx) {
  const state = aiState(match);
  state.tick++;
  recordTrail(match, state);
  assignMarks(match, state);
  // Difficulty describes the opponent: a CPU partner of a human plays at Pro.
  const humanTeams = new Set(match.players.filter(p => controlled.has(p.id)).map(p => p.team));
  const opponentTuning = { ...aiTuningFor(match.difficulty), ...(match.aiTuning ?? {}) };
  const allyTuning = { ...aiTuningFor('Pro'), ...(match.aiTuning ?? {}) };
  const allyCtx = { ...ctx, profile: ctx.allyProfile ?? ctx.profile };
  const out = [];
  for (const p of match.players) {
    if (controlled.has(p.id)) continue;
    const ally = humanTeams.has(p.team);
    const tuning = ally ? allyTuning : opponentTuning, c = ally ? allyCtx : ctx;
    const mode = match.ball.mode;
    let input;
    if (p.stun > 0 || mode === 'dead') input = { x: 0, y: 0 };
    else if (mode === 'loose') input = looseBallInput(c, match, p);
    else if (mode === 'shot' || mode === 'dunk') input = reboundInput(c, match, state, p);
    else if (p.team !== match.possession) input = defenseInput(c, match, state, p, tuning);
    else if (p.hasBall) input = handlerInput(c, match, state, p, tuning);
    else input = offBallInput(c, match, state, p, tuning);
    out.push(ctx.createInput(p.id, input));
  }
  return out;
}
