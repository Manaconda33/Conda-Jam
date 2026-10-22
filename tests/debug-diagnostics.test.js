import test from 'node:test';
import assert from 'node:assert/strict';
import { createDebugDiagnostics, debugLines, recordDebugFrame, recordDebugTick, setDebugEnabled } from '../src/render/debug-diagnostics.js';

test('diagnostics stay inert until explicitly enabled', () => {
  const stats = createDebugDiagnostics();
  recordDebugFrame(stats, 1000);
  recordDebugTick(stats, 4);
  assert.equal(stats.windowStart, null);
  assert.equal(stats.frames, 0);
  assert.equal(stats.ticks, 0);
  assert.deepEqual(debugLines(stats, { phase: 'playing' }), []);
});

test('diagnostics report measured frame rate and average simulation tick cost', () => {
  const stats = createDebugDiagnostics({ enabled: true });
  for (const now of [0, 250, 500, 750]) recordDebugFrame(stats, now);
  recordDebugTick(stats, 2);
  recordDebugTick(stats, 4);
  recordDebugFrame(stats, 1000);
  assert.equal(stats.fps, 4);
  assert.equal(stats.averageTickMs, 3);
  assert.equal(stats.frames, 0);
  assert.equal(stats.ticks, 0);
});

test('diagnostic lines include seed, match state, score, and ball ownership', () => {
  const stats = createDebugDiagnostics({ enabled: true });
  stats.fps = 59.9;
  stats.averageTickMs = 0.042;
  const lines = debugLines(stats, {
    seed: 42,
    phase: 'playing',
    period: 2,
    clock: 91.25,
    score: [7, 5],
    ball: { mode: 'carried', ownerId: 'home-1' }
  });
  assert.match(lines[0], /FPS 59\.9  TICK 0\.042 ms/);
  assert.equal(lines[1], 'SEED 42');
  assert.equal(lines[2], 'STATE PLAYING Q2 91.3s');
  assert.equal(lines[3], 'SCORE 7-5  BALL carried/home-1');
});

test('toggling diagnostics resets old timing samples', () => {
  const stats = createDebugDiagnostics({ enabled: true });
  recordDebugFrame(stats, 0);
  recordDebugFrame(stats, 500);
  recordDebugTick(stats, 1);
  setDebugEnabled(stats, false);
  assert.equal(stats.enabled, false);
  assert.equal(stats.windowStart, null);
  assert.equal(stats.frames, 0);
  assert.equal(stats.ticks, 0);
  assert.equal(stats.fps, 0);
});
