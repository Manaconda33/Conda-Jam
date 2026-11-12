import test from 'node:test';
import assert from 'node:assert/strict';
import { createMatch, stepMatch, createInput, court, missAim, blockReach } from '../src/core/simulation.js';
import { anchorTick } from '../src/core/animation.js';

const neutralInputs = match => match.players.map(p => createInput(p.id));
const hoopRight = court.hoops[1];
// Spread small seeds across the generator (a fresh small seed draws tiny values).
const scramble = (match, seed) => { match.rng = (Math.imul(seed, 2654435761) >>> 0) || 1; return match; };
const inBounds = b => b.x >= court.minX && b.x <= court.maxX && b.y >= court.minY && b.y <= court.maxY;

function prepareBlock(match, defender) {
  stepMatch(match, [...neutralInputs(match).filter(i => i.playerId !== defender.id), createInput(defender.id, { blockPressed: true })]);
  while (defender.animation.tick < anchorTick('block', 'apex') - 1) stepMatch(match, neutralInputs(match));
}

// Freeze every athlete far from the rim so nothing touches the ball in flight.
function isolatedShooter(seed) {
  const match = scramble(createMatch({ quarterSeconds: 60, seed }), seed);
  const shooter = match.players.find(p => p.hasBall);
  Object.assign(shooter, { x: 150, y: 50, shoot: 0, facing: 1 });
  const others = match.players.filter(p => p !== shooter);
  // One defender stands behind the shooter (a contested, likely miss); the rest are far away.
  others.forEach((p, i) => Object.assign(p, p.team !== shooter.team && i === others.findIndex(o => o.team !== shooter.team)
    ? { x: 147, y: 50 } : { x: 100, y: [5, 50, 95][i] }));
  return { match, shooter };
}

test('missed jumpers aim at the rim, the glass or short, never past the baseline', () => {
  const types = new Set();
  for (let seed = 1; seed <= 400; seed++) {
    const match = scramble(createMatch({ seed }), seed);
    const quality = seed % 2 ? 0 : 0.6;
    const aim = missAim(match, hoopRight, 1, quality);
    types.add(aim.type);
    if (aim.type === 'airball') {
      assert.equal(quality, 0, 'only badly contested shots fall short as air balls');
      assert.ok(aim.x < hoopRight - 3.5);
    } else if (aim.type === 'glass') {
      assert.ok(aim.x > hoopRight && aim.x < hoopRight + 5 && aim.z > 2.95, 'glass misses meet the backboard');
    } else {
      const ring = Math.hypot(aim.x - hoopRight, aim.y - 50);
      assert.ok(ring >= 1.3 && ring < 2.6, `${aim.type} aim stays on the ring (${ring.toFixed(2)})`);
    }
    assert.ok(aim.x < court.maxX - 5, 'no miss is aimed beyond the baseline');
  }
  assert.deepEqual([...types].sort(), ['airball', 'back-rim', 'front-rim', 'glass', 'side-rim']);
});

test('real missed jumpers meet the rim or glass and stay in bounds as live rebounds', () => {
  // Air balls may roll out like real ones; every miss off iron or glass stays live.
  let misses = 0, touched = 0, airballs = 0;
  for (let seed = 1; seed <= 60; seed++) {
    const { match, shooter } = isolatedShooter(seed);
    stepMatch(match, [...neutralInputs(match).filter(i => i.playerId !== shooter.id), createInput(shooter.id, { shootPressed: true })]);
    let released = false, contact = false, wentLoose = false;
    for (let t = 0; t < 400; t++) {
      stepMatch(match, neutralInputs(match));
      const b = match.ball;
      if (b.mode === 'shot') released = true;
      if (b.rim || b.backboard) contact = true;
      if (b.mode === 'loose') wentLoose = true;
      if (b.scored || (b.mode === 'dead' && b.missType === 'airball')) break;
      assert.notEqual(b.mode, 'dead', `seed ${seed}: a ${b.missType} miss must not end out of bounds`);
    }
    if (!released || match.ball.scored) continue;
    misses++;
    if (match.ball.missType === 'airball') { airballs++; continue; }
    if (contact) touched++;
    assert.ok(wentLoose, `seed ${seed}: a miss becomes a live loose ball`);
    assert.ok(inBounds(match.ball), `seed ${seed}: the carom settles inside the court`);
  }
  assert.ok(misses >= 25, `enough misses sampled (${misses})`);
  assert.ok(airballs / misses < 0.2, `air balls stay rare (${airballs}/${misses})`);
  assert.ok(touched / (misses - airballs) > 0.9, `non-air-ball misses touch iron or glass (${touched}/${misses - airballs})`);
});

test('a miss meeting the ring caroms back toward the court', () => {
  for (const [targetX, vx] of [[hoopRight, 0.4], [court.hoops[0], -0.4]]) {
    const match = createMatch({ seed: 5 });
    for (const p of match.players) { p.hasBall = false; p.x = 100; }
    Object.assign(match.ball, { mode: 'shot', ownerId: null, made: false, attemptId: 'ring', value: 2, rim: false, backboard: false, rimTouches: 0,
      x: targetX - Math.sign(vx) * 1.6, y: 50.5, z: 2.7, vx, vy: 0, vz: -0.2, targetX, targetY: 50, targetZ: 2.6, lastTouch: match.players[0].id });
    stepMatch(match, neutralInputs(match));
    assert.equal(match.ball.rim, true);
    assert.equal(match.ball.rimTouches, 1);
    assert.equal(Math.sign(match.ball.vx), -Math.sign(targetX - 100), 'carom heads away from the baseline');
    assert.ok(match.ball.vz > 0);
  }
});

test('a well-timed jump reaches the default jumper release; a late one does not', () => {
  const apexZ = 1.67, releaseZ = 7.67;
  assert.ok(apexZ + blockReach({ block: 75 }) >= releaseZ, 'average blocker covers the release at the apex');
  assert.ok(apexZ + blockReach({ block: 75 }) < releaseZ + 1, 'one tick later the rising ball is out of reach');
  assert.ok(blockReach({ block: 99 }) > blockReach({ block: 60 }), 'block rating adds reach');

  const outcome = ballZ => {
    let blocks = 0;
    for (let seed = 1; seed <= 20; seed++) {
      const match = createMatch({ quarterSeconds: 60, seed });
      match.possession = 1;
      const defender = match.players.find(p => p.team === 0), shooter = match.players.find(p => p.team === 1);
      Object.assign(defender, { block: 75, x: 52, y: 50 }); Object.assign(shooter, { x: 160, y: 50 });
      prepareBlock(match, defender);
      Object.assign(match.ball, { mode: 'shot', ownerId: null, lastTouch: shooter.id, attemptId: 'jumper', made: true, value: 2,
        x: 53, y: 50, z: ballZ, vx: -0.2, vy: 0, vz: 0, targetX: court.hoops[0], targetY: 50, targetZ: 2.6, rim: false, backboard: false });
      for (const p of match.players) p.hasBall = false;
      stepMatch(match, neutralInputs(match));
      blocks += defender.blocks;
    }
    return blocks;
  };
  assert.ok(outcome(releaseZ - 1) > 5, 'jumpers at the release height can be blocked');
  assert.equal(outcome(releaseZ + 1.2), 0, 'a ball already above reach cannot be blocked');
});

test('miss trajectories stay deterministic for a seed', () => {
  const run = () => {
    const { match, shooter } = isolatedShooter(17);
    stepMatch(match, [...neutralInputs(match).filter(i => i.playerId !== shooter.id), createInput(shooter.id, { shootPressed: true })]);
    for (let t = 0; t < 200; t++) stepMatch(match, neutralInputs(match));
    return JSON.stringify([match.ball.x.toFixed(5), match.ball.y.toFixed(5), match.ball.missType, match.ball.rimTouches]);
  };
  assert.equal(run(), run());
});
