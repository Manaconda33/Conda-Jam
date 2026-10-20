function random(seed) {
  let value = seed >>> 0 || 1;
  return () => {
    value ^= value << 13; value ^= value >>> 17; value ^= value << 5;
    return (value >>> 0) / 4294967296;
  };
}

function shuffled(values, next) {
  const result = [...values];
  for (let index = result.length - 1; index > 0; index--) {
    const swap = Math.floor(next() * (index + 1));
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function cpuWinner(pair, next) {
  return pair[Math.floor(next() * pair.length)];
}

export function createTournament(teamId, league, seed = 1) {
  if (!Array.isArray(league) || league.length < 8 || !league.some(team => team.id === teamId)) return null;
  const next = random(seed);
  const field = [teamId, ...shuffled(league.map(team => team.id).filter(id => id !== teamId), next).slice(0, 7)];
  const seeds = [field[0], ...field.slice(1)];
  const roundOne = [[seeds[0], seeds[7]], [seeds[3], seeds[4]], [seeds[2], seeds[5]], [seeds[1], seeds[6]]];
  const semifinalA = [roundOne[0][0], cpuWinner(roundOne[1], next)];
  const semifinalB = [cpuWinner(roundOne[2], next), cpuWinner(roundOne[3], next)];
  return {
    teamId, seed: seed >>> 0, field, round: 0, complete: false, champion: null,
    opponents: [roundOne[0][1], semifinalA[1], cpuWinner(semifinalB, next)],
    results: []
  };
}

export function recordTournamentResult(tournament, won) {
  if (!tournament || tournament.complete || tournament.round >= 3) return tournament;
  const result = { ...tournament, results: [...tournament.results, won ? 'win' : 'loss'] };
  result.round++;
  if (!won) result.complete = true;
  else if (result.round === 3) { result.complete = true; result.champion = result.teamId; }
  return result;
}

export function validTournament(value, league) {
  if (!value || typeof value !== 'object' || !Array.isArray(value.field) || value.field.length !== 8 ||
      new Set(value.field).size !== 8 || !value.field.every(id => league.some(team => team.id === id)) ||
      value.field[0] !== value.teamId || !Number.isInteger(value.seed) || value.seed < 0 ||
      !Number.isInteger(value.round) || value.round < 0 || value.round > 3 ||
      !Array.isArray(value.opponents) || value.opponents.length !== 3 ||
      !value.opponents.every(id => value.field.includes(id) && id !== value.teamId) ||
      !Array.isArray(value.results) || value.results.length !== value.round ||
      !value.results.every(result => result === 'win' || result === 'loss') || typeof value.complete !== 'boolean') return null;
  if (value.results.includes('loss') && (!value.complete || value.results.at(-1) !== 'loss')) return null;
  if (value.round === 3 && !value.complete) return null;
  if (value.champion !== null && value.champion !== value.teamId) return null;
  if (value.champion && (!value.complete || value.results.some(result => result !== 'win'))) return null;
  if (value.complete && value.round === 0) return null;
  return { ...value, field: [...value.field], opponents: [...value.opponents], results: [...value.results] };
}
