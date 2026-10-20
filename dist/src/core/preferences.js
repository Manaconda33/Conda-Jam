export const preferenceStorageKey='jamverse96-v3';
const legacyStorageKey='jamverse96-v1';
const previousStorageKey='jamverse96-v2';
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

function normalize(source,league,createSeason,seasonLength){
  const defaults={schemaVersion:3,home:league[0].id,away:league[26].id,homePartnerId:null,awayPartnerId:null,volume:.55,reducedFlash:false,teamMarkers:false,textSize:100,controls:null,season:createSeason(league[0].id),leagueRecords:leagueRecords(null,league),difficulty:'Pro',quarter:180,twoPlayers:false,sameTeam:false};
  if(!source||typeof source!=='object'||Array.isArray(source))return defaults;
  const validIds=new Set(league.map(team=>team.id));
  const home=validIds.has(source.home)?source.home:defaults.home;
  let away=validIds.has(source.away)?source.away:defaults.away;
  if(home===away)away=league.find(team=>team.id!==home)?.id??defaults.away;
  const volume=Math.max(0,Math.min(1,finite(source.volume,defaults.volume)));
  const textSize=Math.round(Math.max(90,Math.min(120,finite(source.textSize,defaults.textSize))));
  return {...defaults,home,away,homePartnerId:typeof source.homePartnerId==='string'?source.homePartnerId:null,awayPartnerId:typeof source.awayPartnerId==='string'?source.awayPartnerId:null,volume,reducedFlash:Boolean(source.reducedFlash),teamMarkers:Boolean(source.teamMarkers),textSize,controls:Array.isArray(source.controls)?source.controls:null,season:validSeason(source.season,home,createSeason,seasonLength),leagueRecords:leagueRecords(source.leagueRecords,league),difficulty:['Rookie','Pro','Legend'].includes(source.difficulty)?source.difficulty:'Pro',quarter:[60,120,180].includes(Number(source.quarter))?Number(source.quarter):180,twoPlayers:Boolean(source.twoPlayers),sameTeam:Boolean(source.sameTeam)};
}

export function loadPreferences(storage,league,createSeason=teamId=>({teamId,round:0,wins:0,losses:0,complete:false,lastResult:null}),seasonLength=8){
  let current=null,previous=null,legacy=null;
  try{current=storage.get(preferenceStorageKey,null);if(current===null){previous=storage.get(previousStorageKey,null);if(previous===null)legacy=storage.get(legacyStorageKey,null)}}catch{}
  const source=current?.schemaVersion===3?current:current===null&&previous?.schemaVersion===2?previous:current===null&&previous===null?legacy:null;
  const result=normalize(source,league,createSeason,seasonLength);
  try{storage.set(preferenceStorageKey,result)}catch{}
  return result;
}
