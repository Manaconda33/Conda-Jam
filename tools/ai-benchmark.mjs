// CPU team-play benchmark. Plays seeded 4-minute matches (60-second quarters)
// CPU-vs-CPU and against a scripted "casual human" (drives with turbo, shoots
// near the rim or when open, mashes steal on defense), per difficulty. Also
// follows missed jumpers to their outcome and splits blocks by shot type.
// Usage: node tools/ai-benchmark.mjs [games=60] [root=repository root]
import { pathToFileURL } from 'node:url';
const games = Number(process.argv[2] ?? 60);
const root = process.argv[3] ?? new URL('..', import.meta.url).pathname;
const { createMatch, stepMatch, court } = await import(pathToFileURL(`${root}/src/core/simulation.js`));
const { teams } = await import(pathToFileURL(`${root}/src/content/teams.js`));
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function casualHuman(m, id, mem) {
  const p = m.players.find(q => q.id === id), hoop = { x: court.hoops[1], y: 50 }, own = { x: court.hoops[0], y: 50 };
  const opp = m.players.filter(q => q.team !== p.team), mate = m.players.find(q => q.team === p.team && q !== p);
  const go = (t, turbo) => { const dx = t.x - p.x, dy = t.y - p.y, l = Math.hypot(dx, dy) || 1; return l < 1.5 ? { x: 0, y: 0 } : { x: dx / l, y: dy / l, turbo }; };
  const input = { playerId: id }; mem.t++;
  if (m.ball.mode === 'loose' || (m.ball.mode === 'pass' && m.ball.targetId === id)) return Object.assign(input, go(m.ball, true));
  if (p.hasBall) {
    const open = Math.min(...opp.map(o => dist(o, p))), toHoop = dist(p, hoop);
    Object.assign(input, go(hoop, p.stamina > 5));
    if (toHoop < 18) input.shootPressed = true;
    else if (open < 3.5 && mem.t - mem.lastPass > 60 && Math.min(...opp.map(o => dist(o, mate))) > 10) { input.passPressed = true; mem.lastPass = mem.t; }
    else if (toHoop < 45 && (open > 9 || m.shotClock < 5)) input.shootPressed = true;
    return input;
  }
  if (m.possession === p.team) return Object.assign(input, go({ x: hoop.x - 20, y: p.y < 50 ? 30 : 70 }, false));
  const handler = opp.find(o => o.hasBall) ?? opp[0];
  Object.assign(input, go({ x: handler.x + (own.x - handler.x) * 0.1, y: handler.y }, dist(p, handler) > 6));
  if (dist(p, handler) < 5 && mem.t - mem.lastSteal > 40) { input.stealPressed = true; mem.lastSteal = mem.t; }
  const shooter = opp.find(o => ['shot', 'dunk'].includes(o.animation.action?.kind));
  if (shooter && dist(p, shooter) < 6 && shooter.animation.tick >= 4) input.blockPressed = true;
  return input;
}

function run(difficulty, withHuman) {
  const t = { pts: 0, fga: 0, fgm: 0, threes: 0, ast: 0, stl: 0, blk: 0, dunks: 0, wins: 0, home: 0, away: 0, open: 0, samples: 0,
    misses: 0, missOut: 0, offReb: 0, defReb: 0, shotBlk: 0, dunkBlk: 0 };
  for (let seed = 1; seed <= games; seed++) {
    const m = createMatch({ quarterSeconds: 60, seed: withHuman ? seed * 7 : seed, home: teams[(seed - 1) % teams.length], away: teams[(seed + 12) % teams.length], difficulty });
    const id = m.players[0].id, mem = { t: 0, lastPass: -99, lastSteal: -99 };
    let miss = null, blocks = 0;
    for (let n = 0; n < 300000 && m.phase !== 'final'; n++) {
      const before = m.ball.mode, dunking = before === 'dunk' || m.players.some(p => p.animation.action?.kind === 'dunk');
      stepMatch(m, withHuman ? [casualHuman(m, id, mem)] : []);
      const b = m.ball, nowBlocks = m.players.reduce((sum, p) => sum + p.blocks, 0);
      if (nowBlocks > blocks) { if (dunking) t.dunkBlk++; else t.shotBlk++; }
      blocks = nowBlocks;
      // Follow each missed jump shot to its outcome: out of bounds or a rebound.
      if (b.mode === 'shot' && before !== 'shot') miss = b.made ? null : (t.misses++, { team: m.possession });
      else if (miss && before === 'loose' && b.mode !== 'loose') {
        if (b.mode === 'dead') t.missOut++;
        else if (b.mode === 'carried') { if (m.players.find(p => p.hasBall)?.team === miss.team) t.offReb++; else t.defReb++; }
        miss = null;
      }
      if (b.mode !== 'carried') continue;
      const carrier = m.players.find(p => p.hasBall), mate = m.players.find(p => p.team === carrier.team && p !== carrier);
      t.samples++; if (Math.min(...m.players.filter(p => p.team !== carrier.team).map(p => dist(p, mate))) > 12) t.open++;
    }
    if (m.phase !== 'final') throw new Error(`seed ${seed} did not finish`);
    for (const p of [...m.players, ...m.playerBox]) { t.pts += p.points; t.fga += p.fga; t.fgm += p.fgm; t.threes += p.threeAttempts; t.ast += p.assists; t.stl += p.steals; t.blk += p.blocks; t.dunks += p.dunks; }
    t.home += m.score[0]; t.away += m.score[1]; if (m.winner === 0) t.wins++;
  }
  const g = games * 2, r = (x, d = 1) => +x.toFixed(d);
  return withHuman
    ? { difficulty, humanTeamWinRate: r(t.wins / games, 2), humanTeamPoints: r(t.home / games), cpuPoints: r(t.away / games) }
    : { difficulty, pointsPerTeam: r(t.pts / g), fgaPerTeam: r(t.fga / g), fgPct: r(t.fgm / t.fga, 3), threeShare: r(t.threes / t.fga, 2), dunksPerTeam: r(t.dunks / g), assistedShare: r(t.ast / t.fgm, 2), stealsPerTeam: r(t.stl / g), blocksPerTeam: r(t.blk / g), shotBlocksPerTeam: r(t.shotBlk / g), dunkBlocksPerTeam: r(t.dunkBlk / g), teammateUnguarded: r(t.open / t.samples, 2),
      missedJumpersPerTeam: r(t.misses / g), missesOutOfBoundsPerTeam: r(t.missOut / g), reboundsAfterMissPerTeam: r((t.offReb + t.defReb) / g), offensiveReboundShare: r(t.offReb / Math.max(1, t.offReb + t.defReb), 2) };
}

const report = { games, cpuVsCpu: [], vsCasualHuman: [] };
for (const difficulty of ['Rookie', 'Pro', 'Legend']) {
  report.cpuVsCpu.push(run(difficulty, false));
  report.vsCasualHuman.push(run(difficulty, true));
}
console.log(JSON.stringify(report, null, 2));
