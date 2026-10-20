const statKeys=['points','fgm','fga','threeMakes','threeAttempts','assists','rebounds','steals','blocks','turnovers'];

export function createCareerRecords(teams){
  return Object.fromEntries(teams.flatMap(team=>team.roster.map(athlete=>[athlete.id,{games:0,...Object.fromEntries(statKeys.map(key=>[key,0]))}])));
}

export function recordCareerMatch(records,match){
  if(!records||!match||!Array.isArray(match.players)||!Array.isArray(match.score)||match.phase!=='final')return records;
  const next={...records};
  for(const player of [...(match.playerBox??[]),...match.players]){
    if(!Object.hasOwn(records,player.id))continue;
    const prior=next[player.id]??{games:0,...Object.fromEntries(statKeys.map(key=>[key,0]))};
    const row={...prior,games:prior.games+1};
    for(const key of statKeys)row[key]+=Number.isFinite(player[key])&&player[key]>=0?player[key]:0;
    next[player.id]=row;
  }
  return next;
}

export function rankCareerLeaders(records,teams,limit=10){
  const athletes=teams.flatMap(team=>team.roster.map(athlete=>({athlete,team:team.name,record:records?.[athlete.id]})))
    .filter(entry=>entry.record?.games>0)
    .sort((a,b)=>b.record.points-a.record.points||b.record.assists-a.record.assists||a.athlete.name.localeCompare(b.athlete.name));
  return athletes.slice(0,limit).map(({athlete,team,record})=>({athleteId:athlete.id,name:athlete.name,team,...record}));
}
