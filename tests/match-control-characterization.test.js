// Baseline characterization ONLY: capture existing deterministic contracts.
// This file intentionally does not change runtime or assert a browser repro.
import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import {
  createMatch, createInput, stepMatch, substitutePlayer, commitScore,
} from '../src/core/simulation.js';
import {
  readGamepadActions, readGamepadMovement,
} from '../src/input/gamepad-controls.js';

const newMatch = (seed = 96) => createMatch({
  home: teams[0], away: teams[26], seed, quarterSeconds: 60,
});
const activeIds = match => match.players.map(player => player.id);

test('baseline: substitution preserves the partner court slot, but changes its athlete ID', () => {
  const match = newMatch();
  const before = activeIds(match);
  const oldPartner = match.players[1];
  const replacementId = match.lineups[0].benchId;
  assert.ok(replacementId && replacementId !== oldPartner.id);
  assert.equal(substitutePlayer(match, 0), false, 'no substitution during live play');
  match.phase = 'break';
  assert.equal(substitutePlayer(match, 0), true);
  assert.deepEqual(activeIds(match).filter((_, index) => index !== 1),
    before.filter((_, index) => index !== 1));
  assert.equal(match.players[1].id, replacementId);
  assert.equal(match.lineups[0].partnerId, replacementId);
  assert.equal(match.lineups[0].benchId, oldPartner.id);
  assert.equal(match.playerBox.some(player => player.id === oldPartner.id), true);
});

test('baseline: stale athlete input ID is not recognized as the substituted on-court athlete', () => {
  const match = newMatch(103);
  const oldId = match.players[1].id;
  match.phase = 'break';
  assert.equal(substitutePlayer(match, 0), true);
  const newId = match.players[1].id;
  match.phase = 'playing';
  match.periodBreak = 0;
  stepMatch(match, [createInput(oldId, { x: 1, turbo: true })]);
  assert.deepEqual(match.humanPlayerIds, [oldId]);
  assert.ok(!match.humanPlayerIds.includes(newId));
  // The browser must map an assigned court slot to the CURRENT on-court ID.
  // This documents the existing simulation contract, not a browser outcome.
  stepMatch(match, [createInput(newId, { x: 1, turbo: true })]);
  assert.deepEqual(match.humanPlayerIds, [newId]);
});

test('baseline: substitution is guarded by a break and a valid team', () => {
  const match = newMatch();
  const before = activeIds(match);
  assert.equal(substitutePlayer(match, 0), false);
  match.phase = 'break';
  assert.equal(substitutePlayer(match, -1), false);
  assert.equal(substitutePlayer(match, 2), false);
  assert.deepEqual(activeIds(match), before);
  match.phase = 'final';
  assert.equal(substitutePlayer(match, 0), false);
  assert.deepEqual(activeIds(match), before);
});

test('baseline: pause requests toggle once and freeze simulated clocks, RNG and ball state', () => {
  const match = newMatch(202);
  const p = match.players[0];
  stepMatch(match, [createInput(p.id, { pausePressed: true })]);
  assert.equal(match.pause, true);
  const before = {
    clock: match.clock,
    shotClock: match.shotClock,
    rng: match.rng,
    ball: structuredClone(match.ball),
    events: structuredClone(match.events),
    animation: structuredClone(p.animation),
  };
  for (let n = 0; n < 5; n++) stepMatch(match, [createInput(p.id, { x: 1, shootPressed: true })]);
  assert.equal(match.pause, true);
  assert.equal(match.clock, before.clock);
  assert.equal(match.shotClock, before.shotClock);
  assert.equal(match.rng, before.rng);
  assert.deepEqual(match.ball, before.ball);
  assert.deepEqual(match.events, before.events);
  assert.deepEqual(p.animation, before.animation);
  stepMatch(match, [createInput(p.id, { pausePressed: true })]);
  assert.equal(match.pause, false);
  stepMatch(match, [createInput(p.id)]);
  assert.ok(match.clock < before.clock);
});

test('baseline: a scored attempt is idempotent and blocked after final', () => {
  const match = newMatch();
  const scorer = match.players[0];
  const attempt = { id: 'shot-baseline-1', team: 0, playerId: scorer.id, points: 2 };
  assert.equal(commitScore(match, attempt), true);
  assert.equal(commitScore(match, attempt), false);
  assert.equal(match.score[0], 2);
  assert.equal(scorer.points, 2);
  match.phase = 'final';
  assert.equal(commitScore(match, { ...attempt, id: 'shot-baseline-2' }), false);
});

test('baseline: identical seeded tapes after substitution stay deterministic', () => {
  const simulate = () => {
    const match = newMatch(315);
    match.phase = 'break';
    assert.equal(substitutePlayer(match, 0), true);
    match.phase = 'playing';
    match.periodBreak = 0;
    const currentId = match.players[1].id;
    for (let i = 0; i < 40; i++) {
      stepMatch(match, [createInput(currentId, {
        x: i < 25 ? 1 : 0, y: i % 3 === 0 ? -1 : 0,
        turbo: i < 20, passPressed: i === 29,
      })]);
    }
    return {
      seed: match.seed, rng: match.rng, phase: match.phase,
      score: match.score, period: match.period, clock: match.clock,
      ball: match.ball, players: match.players, events: match.events,
    };
  };
  assert.deepEqual(simulate(), simulate());
});

test('baseline: gamepad action edges are an adapter responsibility, not simulator state', () => {
  const pad = {
    axes: [0.5, -0.6],
    buttons: Array.from({ length: 16 }, (_, i) => ({ pressed: i === 2 || i === 9, value: i === 2 || i === 9 ? 1 : 0 })),
  };
  assert.deepEqual(readGamepadActions(pad), {
    shoot: true, pass: false, turbo: false, pause: true,
  });
  assert.deepEqual(readGamepadMovement(pad), { x: 0.5, y: -0.6 });
});
