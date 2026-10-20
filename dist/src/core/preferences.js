export const preferenceStorageKey='jamverse96-v5';
const legacyStorageKey='jamverse96-v1';
const previousStorageKeys=['jamverse96-v4','jamverse96-v3','jamverse96-v2'];
const finite=(value,fallback)=>Number.isFinite(value)?value:fallback;

function validSeason(value,homeId,createSeason,seasonLength){
  if(!value||typeof value!=='object'||value.teamId!==homeId)return createSeason(homeId);
  const {round,wins,losses,complete,lastResult}=value;
  if(!Number.isInteger(round)||round<0||round>seasonLength||!Number.isInteger(wins)||wins<0||!Number.isInteger(losses)||losses<0||wins+losses!==round||typeof complete!=='boolean'||![null,'win','loss'].includes(lastResult))return createSeason(homeId);
  if((round===0&&lastResult!==null)||(round>0&&lastResult===null)||(losses>0&&!complete)||(round===seasonLength&&!complete)||(lastResult==='loss'&&losses===0))return createSeason(homeId);
  return {teamId:homeId,round,wins,losses,complete,lastResult};
}

function leagueRecords(value,league){
  return Object.fromEntries(league.map(team=>{
    const row=value?.[team.id];
    const valid=row&&['played','wins','losses','pointsFor','pointsAgainst'].every(key=>Number.isInteger(row[key])&&row[key]>=0)&&row.wins+row.losses===row.played;
    return [team.id,valid?{played:row.played,wins:row.wins,losses:row.losses,pointsFor:row.pointsFor,pointsAgainst:row.pointsAgainst}:{played:0,wins:0,losses:0,pointsFor:0,pointsAgainst:0}];
  }));
}

function careerRecords(value,league){
  const keys=['points','fgm','fga','threeMakes','threeAttempts','dunks','assists','rebounds','steals','blocks','turnovers'];
  return Object.fromEntries(league.flatMap(team=>team.roster.map(athlete=>{
    const row=value?.[athlete.id],required=keys.filter(key=>key!=='dunks'),valid=row&&Number.isInteger(row.games)&&row.games>=0&&required.every(key=>Number.isInteger(row[key])&&row[key]>=0)&&(row.dunks===undefined||(Number.isInteger(row.dunks)&&row.dunks>=0))&&(row.highestStreak===undefined||(Number.isInteger(row.highestStreak)&&row.highestStreak>=0))&&row.fgm<=row.fga&&row.threeMakes<=row.threeAttempts&&row.threeAttempts<=row.fga&&(row.dunks??0)<=row.fgm&&(row.highestStreak??0)<=row.fgm;
    return [athlete.id,valid?{games:row.games,highestStreak:row.highestStreak??0,...Object.fromEntries(keys.map(key=>[key,key==='dunks'?row[key]??0:row[key]]))}:{games:0,highestStreak:0,...Object.fromEntries(keys.map(key=>[key,0]))}];
  })));
}

function normalize(source,league,createSeason,seasonLength,validateTournament){
  const defaults={schemaVersion:5,home:league[0].id,away:league[26].id,homePartnerId:null,awayPartnerId:null,musicVolume:.55,effectsVolume:.55,screenShake:true,reducedFlash:false,audioCaptions:true,teamMarkers:false,textSize:100,controls:null,season:createSeason(league[0].id),tournament:null,leagueRecords:leagueRecords(null,league),careerRecords:careerRecords(null,league),difficulty:'Pro',quarter:180,twoPlayers:false,sameTeam:false};
  if(!source||typeof source!=='object'||Array.isArray(source))return defaults;
  const validIds=new Set(league.map(team=>team.id));
  const home=validIds.has(source.home)?source.home:defaults.home;
  let away=validIds.has(source.away)?source.away:defaults.away;
  if(home===away)away=league.find(team=>team.id!==home)?.id??defaults.away;
  const legacyVolume=Math.max(0,Math.min(1,finite(source.volume,.55)));
  const musicVolume=Math.max(0,Math.min(1,finite(source.musicVolume,legacyVolume)));
  const effectsVolume=Math.max(0,Math.min(1,finite(source.effectsVolume,legacyVolume)));
  const textSize=Math.round(Math.max(90,Math.min(120,finite(source.textSize,defaults.textSize))));
  return {...defaults,home,away,homePartnerId:typeof source.homePartnerId==='string'?source.homePartnerId:null,awayPartnerId:typeof source.awayPartnerId==='string'?source.awayPartnerId:null,musicVolume,effectsVolume,screenShake:source.screenShake!==false,reducedFlash:Boolean(source.reducedFlash),audioCaptions:source.audioCaptions!==false,teamMarkers:Boolean(source.teamMarkers),textSize,controls:Array.isArray(source.controls)?source.controls:null,season:validSeason(source.season,home,createSeason,seasonLength),tournament:validateTournament(source.tournament,league),leagueRecords:leagueRecords(source.leagueRecords,league),careerRecords:careerRecords(source.careerRecords,league),difficulty:['Rookie','Pro','Legend'].includes(source.difficulty)?source.difficulty:'Pro',quarter:[60,120,180].includes(Number(source.quarter))?Number(source.quarter):180,twoPlayers:Boolean(source.twoPlayers),sameTeam:Boolean(source.sameTeam)};
}

export function loadPreferences(storage,league,createSeason=teamId=>({teamId,round:0,wins:0,losses:0,complete:false,lastResult:null}),seasonLength=8,validateTournament=()=>null){
  let current=null,previous=null,legacy=null;
  try{current=storage.get(preferenceStorageKey,null);if(current===null){for(const key of previousStorageKeys){previous=storage.get(key,null);if(previous!==null)break}if(previous===null)legacy=storage.get(legacyStorageKey,null)}}catch{}
  const source=current?.schemaVersion===5?current:current?.schemaVersion>=2&&current?.schemaVersion<=4?current:current===null&&previous?.schemaVersion>=2&&previous?.schemaVersion<=4?previous:current===null&&previous===null?legacy:null;
  const result=normalize(source,league,createSeason,seasonLength,validateTournament);
  try{storage.set(preferenceStorageKey,result)}catch{}
  return result;
}
