export function createLeagueTable(teams){
  return Object.fromEntries(teams.map(team=>[team.id,{played:0,wins:0,losses:0,pointsFor:0,pointsAgainst:0}]));
}

export function recordLeagueResult(table,homeId,awayId,score){
  if(!table||!Object.hasOwn(table,homeId)||!Object.hasOwn(table,awayId)||homeId===awayId||!Array.isArray(score)||score.length!==2||score.some(points=>!Number.isInteger(points)||points<0)||score[0]===score[1])return table;
  const next={...table},home={...table[homeId]},away={...table[awayId]};
  home.played++;away.played++;home.pointsFor+=score[0];home.pointsAgainst+=score[1];away.pointsFor+=score[1];away.pointsAgainst+=score[0];
  if(score[0]>score[1]){home.wins++;away.losses++;}else{away.wins++;home.losses++;}
  next[homeId]=home;next[awayId]=away;return next;
}

export function rankLeague(table,teams){
  return teams.map((team,index)=>{const record=table?.[team.id]??{played:0,wins:0,losses:0,pointsFor:0,pointsAgainst:0};return {teamId:team.id,teamName:team.name,...record,winPercentage:record.played?record.wins/record.played:0,pointDifferential:record.pointsFor-record.pointsAgainst,index}})
    .sort((a,b)=>b.winPercentage-a.winPercentage||b.pointDifferential-a.pointDifferential||b.wins-a.wins||a.index-b.index);
}
