export function createDebugDiagnostics({ enabled = false } = {}) {
  return { enabled, windowStart: null, frames: 0, tickMs: 0, ticks: 0, fps: 0, averageTickMs: 0 };
}

export function setDebugEnabled(stats, enabled) {
  stats.enabled = Boolean(enabled);
  stats.windowStart = null;
  stats.frames = 0;
  stats.tickMs = 0;
  stats.ticks = 0;
  stats.fps = 0;
  stats.averageTickMs = 0;
  return stats;
}

export function recordDebugFrame(stats, nowMs) {
  if (!stats.enabled || !Number.isFinite(nowMs)) return stats;
  if (stats.windowStart === null) {
    stats.windowStart = nowMs;
    return stats;
  }
  stats.frames++;
  const elapsed = nowMs - stats.windowStart;
  if (elapsed < 1000) return stats;
  stats.fps = stats.frames * 1000 / elapsed;
  stats.averageTickMs = stats.ticks ? stats.tickMs / stats.ticks : 0;
  stats.windowStart = nowMs;
  stats.frames = 0;
  stats.tickMs = 0;
  stats.ticks = 0;
  return stats;
}

export function recordDebugTick(stats, elapsedMs) {
  if (!stats.enabled || !Number.isFinite(elapsedMs) || elapsedMs < 0) return stats;
  stats.tickMs += elapsedMs;
  stats.ticks++;
  return stats;
}

export function debugLines(stats, match) {
  if (!stats.enabled || !match) return [];
  const owner = match.ball.ownerId ?? 'none';
  const score = `${match.score[0]}-${match.score[1]}`;
  return [
    `FPS ${stats.fps.toFixed(1)}  TICK ${stats.averageTickMs.toFixed(3)} ms`,
    `SEED ${match.seed >>> 0}`,
    `STATE ${String(match.phase).toUpperCase()} Q${match.period} ${match.clock.toFixed(1)}s`,
    `SCORE ${score}  BALL ${match.ball.mode}/${owner}`
  ];
}
