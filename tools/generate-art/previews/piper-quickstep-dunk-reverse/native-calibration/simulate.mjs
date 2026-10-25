import { writeFile } from 'node:fs/promises';
import { createInput, createMatch, stepMatch } from '../../../../../src/core/simulation.js';
import { sampleBallHeight, sampleBallForward } from '../../../../../src/core/animation.js';

const athleteId = 'piper-quickstep';
const home = (await import('../../../../../src/content/teams.js')).teams.find(team => team.roster.some(player => player.id === athleteId));
const teams = (await import('../../../../../src/content/teams.js')).teams;
const away = teams.find(team => team !== home);
const match = createMatch({ quarterSeconds: 60, seed: 116, home, away, homePartnerId: athleteId });
const piper = match.players.find(player => player.id === athleteId);
if (!piper) throw new Error('Piper is not in the active home lineup');
for (const player of match.players) player.hasBall = false;
piper.hasBall = true;
piper.x = 186; piper.y = 50; piper.vx = .2; piper.dunk = 99; piper.facing = 1;
piper.animation = { clip: 'idle-ball', tick: 0 }; piper.anim = 'idle-ball';
Object.assign(match.ball, {
  mode: 'carried', ownerId: athleteId, lastTouch: athleteId,
  x: piper.x + sampleBallForward('idle-ball', 0, athleteId), y: piper.y,
  z: sampleBallHeight('idle-ball', 0, athleteId), vx: 0, vy: 0, vz: 0, scored: false,
});
match.possession = piper.team;
const neutral = () => match.players.map(player => createInput(player.id));
stepMatch(match, neutral().map(input => input.playerId === athleteId
  ? createInput(athleteId, { x: 1, turbo: true, shootPressed: true, dunkVariant: 'reverse' })
  : input));
if (piper.animation.clip !== 'dunk-reverse') throw new Error(`Unexpected dunk clip: ${piper.animation.clip}`);
const observations = [];
while (piper.animation.tick < 20) {
  stepMatch(match, neutral());
  observations.push({
    tick: piper.animation.tick, clip: piper.animation.clip,
    owner: match.ball.ownerId, mode: match.ball.mode,
    ball: { x: match.ball.x, y: match.ball.y, z: match.ball.z },
    track: { height: sampleBallHeight('dunk-reverse', piper.animation.tick, athleteId), forward: sampleBallForward('dunk-reverse', piper.animation.tick, athleteId) },
  });
}
if (match.ball.ownerId !== athleteId || match.ball.mode !== 'carried') throw new Error('Piper did not own the ball through tick20');
stepMatch(match, neutral());
const releaseAttempt = match.ball.attemptId;
const release = { tick: piper.animation.tick, owner: match.ball.ownerId, mode: match.ball.mode, score: [...match.score], attemptId: releaseAttempt };
if (release.tick !== 21 || release.owner !== null || release.mode !== 'dunk') throw new Error(`Unexpected release state: ${JSON.stringify(release)}`);
const scoring = [];
for (let i = 0; i < 8 && !match.scoredAttempts?.includes(releaseAttempt); i++) {
  stepMatch(match, neutral());
  scoring.push({ step: i + 1, animationTick: piper.animation.tick, owner: match.ball.ownerId, mode: match.ball.mode, score: [...match.score], scoredAttempts: [...(match.scoredAttempts ?? [])] });
}
if (match.score[0] !== 2 || match.scoredAttempts?.filter(id => id === releaseAttempt).length !== 1) {
  throw new Error('The real dunk-reverse attempt did not score exactly two points once');
}
const report = {
  runner: 'createMatch/stepMatch using the candidate track injected by native-calibration-preload.mjs',
  athlete: athleteId, clip: 'dunk-reverse', releaseTick: release.tick,
  possessionThroughTick20: true, release,
  scoring: { points: match.score[0], attemptCount: match.scoredAttempts.length, stepsAfterRelease: scoring.length, observations: scoring },
  tick20Track: observations.at(-1)?.track,
  candidateFile: process.env.JAMVERSE_CANDIDATE_FILE,
};
const out = process.env.JAMVERSE_SIMULATION_REPORT;
if (out) await writeFile(out, JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
