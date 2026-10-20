const GAMES_PER_RUN = 8;

export function createSeason(teamId) {
  return { teamId, round: 0, wins: 0, losses: 0, complete: false, lastResult: null };
}

export function seasonOpponent(season, league) {
  if (!season || season.complete || !Array.isArray(league) || league.length < 2) return null;
  const opponents = league.filter(team => team.id !== season.teamId);
  return opponents[(season.round * 7) % opponents.length] ?? null;
}

export function recordSeasonResult(season, won) {
  if (!season || season.complete || season.round >= GAMES_PER_RUN) return season;
  const next = { ...season, round: season.round + 1, lastResult: won ? 'win' : 'loss' };
  if (won) next.wins++;
  else next.losses++;
  next.complete = !won || next.round >= GAMES_PER_RUN;
  return next;
}

export const seasonLength = GAMES_PER_RUN;
