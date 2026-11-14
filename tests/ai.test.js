import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, stepMatch, createInput, court, cpuAccuracyFor } from '../src/core/simulation.js';
import { laneBlocked, predictLanding, aiTuningFor, BLOCK_LEAD_TICKS } from '../src/core/ai.js';
import { anchorTick } from '../src/core/animation.js';
import { teams } from '../src/content/teams.js';

const hoopFor = team => ({ x: team === 0 ? court.hoops[1] : court.hoops[0], y: 50 });
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const place = (p, x, y) => Object.assign(p, { x, y, vx: 0, vy: 0 });
const still = id => createInput(id);

function match(options = {}) {
  return createMatch({ seed: 99, home: teams[0], away: teams[13], ...options });
}

test('lane check sees defenders on the segment and ignores ones behind the ball', () => {
  const from = { x: 100, y: 50 }, to = { x: 180, y: 50 };
  assert.equal(laneBlocked(from, to, [{ x: 140, y: 52 }], 4), true);
  assert.equal(laneBlocked(from, to, [{ x: 140, y: 60 }], 4), false);
  assert.equal(laneBlocked(from, to, [{ x: 90, y: 50 }], 4), false);
});

test('landing prediction follows the ball arc to the floor', () => {
  const landing = predictLanding({ x: 100, y: 50, z: 0, vx: 1, vy: 0.5, vz: 0.26 });
  assert.ok(Math.abs(landing.x - 120) < 0.01, `landing x ${landing.x}`);
  assert.ok(Math.abs(landing.y - 60) < 0.01, `landing y ${landing.y}`);
});

test('CPU defenders split assignments and the ball defender stays goal-side', () => {
  const m = match();
  const [handler, partner, d0, d1] = m.players;
  place(handler, 120, 50); place(partner, 150, 85); place(d0, 175, 20); place(d1, 175, 80);
  for (let t = 0; t < 180; t++) stepMatch(m, [still(handler.id), still(partner.id)]);
  assert.notEqual(m.ai.marks[d0.id], m.ai.marks[d1.id], 'each defender has its own man');
  const onBall = [d0, d1].find(d => m.ai.marks[d.id] === handler.id);
  const offBall = [d0, d1].find(d => d !== onBall);
  const hoop = hoopFor(handler.team);
  assert.ok(dist(onBall, hoop) < dist(handler, hoop), 'on-ball defender is between handler and basket');
  assert.ok(dist(onBall, handler) < 8, `on-ball defender pressures (${dist(onBall, handler).toFixed(1)})`);
  assert.ok(dist(offBall, partner) < dist(offBall, handler), 'off-ball defender stays with the partner instead of doubling');
});

test('a CPU handler passes to a wide-open teammate', () => {
  const m = match({ difficulty: 'Legend' });
  const [h0, h1, a0, a1] = m.players;
  m.possession = 1; h0.hasBall = false; a0.hasBall = true;
  Object.assign(m.ball, { mode: 'carried', ownerId: a0.id, lastTouch: a0.id });
  // Both home defenders crowd the handler; the CPU partner sits alone near the rim.
  place(a0, 90, 50); place(a1, 30, 40); place(h0, 86, 50); place(h1, 88, 54);
  let passedTo = null;
  for (let t = 0; t < 240 && !passedTo; t++) {
    stepMatch(m, [still(h0.id), still(h1.id)]);
    if (m.ball.mode === 'pass') passedTo = m.ball.targetId;
  }
  assert.equal(passedTo, a1.id);
});

test('a CPU defender times its jump to meet the release', () => {
  // Ember Rivet releases jumpers low enough (~2.8) to be blockable; the default
  // jump-shot release (~7.7) is above any defender's reach.
  const m = match({ home: teams[13], away: teams[0], homePartnerId: 'ember-rivet' });
  m.cpuProfile.blockChance = 1;
  const [partner, shooter, d0, d1] = m.players;
  assert.equal(shooter.id, 'ember-rivet');
  for (const p of m.players) p.hasBall = false;
  shooter.hasBall = true; m.possession = 0;
  Object.assign(m.ball, { mode: 'carried', ownerId: shooter.id, lastTouch: shooter.id });
  place(shooter, 140, 50); place(partner, 60, 90); place(d0, 152, 50); place(d1, 60, 10);
  shooter.facing = 1;
  stepMatch(m, [createInput(shooter.id, { shootPressed: true }), still(partner.id)]);
  assert.equal(shooter.animation.action?.kind, 'shot');
  const release = anchorTick(shooter.animation.clip, 'release');
  let jumpedAt = null;
  for (let t = 0; t < 40 && jumpedAt === null; t++) {
    stepMatch(m, [still(shooter.id), still(partner.id)]);
    if (d0.animation.clip === 'block' && d0.animation.tick <= 1) jumpedAt = shooter.animation.tick;
  }
  assert.ok(jumpedAt !== null, 'defender contested');
  assert.ok(Math.abs(release - jumpedAt - BLOCK_LEAD_TICKS) <= 1, `jumped ${release - jumpedAt} ticks before release`);
});

test('CPU rebounders go to where the miss will land', () => {
  const m = match();
  const p = m.players[3];
  Object.assign(m.ball, { mode: 'loose', x: 150, y: 50, z: 2, vx: 0.8, vy: 0, vz: -0.1, ownerId: null });
  for (const q of m.players) q.hasBall = false;
  place(p, 150, 50);
  for (const q of m.players) if (q !== p) place(q, q.team === 0 ? 20 : 30, q.y);
  stepMatch(m, []);
  assert.ok(p.vx > 0, 'chaser moves toward the ball path, not its current spot');
});

test('team AI stays deterministic for a seed', () => {
  const run = () => { const m = match({ quarterSeconds: 30, seed: 4242 }); for (let t = 0; t < 4000; t++) stepMatch(m, []); return JSON.stringify([m.score, m.players.map(p => [p.x.toFixed(4), p.y.toFixed(4), p.points])]); };
  assert.equal(run(), run());
});

test('difficulty adjusts the opponent only: a human partner shoots at the neutral rate', () => {
  const m = match({ difficulty: 'Legend' });
  m.humanPlayerIds = [m.players[0].id];
  assert.equal(cpuAccuracyFor(m, m.players[1]), 0, 'CPU partner of a human is neutral');
  assert.equal(cpuAccuracyFor(m, m.players[2]), m.cpuProfile.accuracy, 'opponents keep the difficulty bonus');
  m.humanPlayerIds = [];
  assert.equal(cpuAccuracyFor(m, m.players[1]), m.cpuProfile.accuracy, 'CPU-only matches apply difficulty to both teams');
});

test('harder CPU tuning defends tighter and reacts faster', () => {
  const [rookie, pro, legend] = ['Rookie', 'Pro', 'Legend'].map(aiTuningFor);
  for (const key of ['onBallGap', 'defenseLag', 'onBallLag', 'reaction']) {
    assert.ok(rookie[key] > pro[key] && pro[key] >= legend[key], key);
  }
  assert.ok(rookie.help < pro.help && pro.help < legend.help, 'help defense');
});

test('CPU-only matches score, share the ball and finish', () => {
  // Rotate franchises across a league-like sample: a single fixed matchup in
  // short games averages ~14% assisted, right on the floor, so it was flaky.
  let points = 0, assists = 0, makes = 0;
  for (let seed = 1; seed <= 10; seed++) {
    const m = createMatch({ quarterSeconds: 60, seed, home: teams[(seed - 1) % teams.length], away: teams[(seed + 12) % teams.length] });
    for (let t = 0; t < 60000 && m.phase !== 'final'; t++) stepMatch(m, []);
    assert.equal(m.phase, 'final');
    for (const p of [...m.players, ...m.playerBox]) { points += p.points; assists += p.assists; makes += p.fgm; }
  }
  assert.ok(points / 20 > 6, `points per team ${points / 20}`);
  assert.ok(assists / makes > 0.15, `assist rate ${(assists / makes).toFixed(2)}`);
});
