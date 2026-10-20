import { createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';
const totals=[0,0];let completed=0,overtimePeriods=0,ticks=0;
for(let seed=1;seed<=100;seed++){
  const home=teams[(seed-1)%teams.length],away=teams[((seed-1)+13)%teams.length];
  const match=createMatch({quarterSeconds:30,seed,home,away});match.teamNames=[home.name,away.name];
  let count=0;for(;count<60_000&&match.phase!=='final';count++)stepMatch(match,[]);ticks+=count;
  if(match.phase!=='final')throw new Error(`seed ${seed} did not finish in 60,000 ticks`);
  completed++;totals[0]+=match.score[0];totals[1]+=match.score[1];overtimePeriods+=Math.max(0,match.period-4);
  if(match.players.reduce((n,p)=>n+p.points,0)!==match.score[0]+match.score[1])throw new Error(`seed ${seed}: score/stat mismatch`);
}
console.log(JSON.stringify({completed,ticks,averageTeamScore:totals.map(n=>+(n/completed).toFixed(2)),overtimePeriods},null,2));
