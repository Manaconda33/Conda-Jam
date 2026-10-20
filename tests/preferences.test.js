import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { createSeason, seasonLength } from '../src/core/season.js';
import { loadPreferences, preferenceStorageKey } from '../src/core/preferences.js';
import { validTournament } from '../src/core/tournament.js';
import { createTournament } from '../src/core/tournament.js';

function memoryStore(initial={}){
  const data=new Map(Object.entries(initial));
  return {get(key,fallback){return data.has(key)?data.get(key):fallback},set(key,value){data.set(key,value)},data};
}

test('migrates v1 local settings and season progress into v5 without dropping valid choices',()=>{
  const old={home:teams[3].id,away:teams[8].id,homePartnerId:'accu-ally',volume:.37,textSize:115,reducedFlash:true,teamMarkers:true,season:{teamId:teams[3].id,round:4,wins:4,losses:0,complete:false,lastResult:'win'}};
  const store=memoryStore({'jamverse96-v1':old});
  const next=loadPreferences(store,teams,createSeason,seasonLength,validTournament);
  assert.equal(next.schemaVersion,5);
  assert.equal(next.home,old.home);
  assert.equal(next.away,old.away);
  assert.equal(next.musicVolume,.37);assert.equal(next.effectsVolume,.37);assert.equal(next.screenShake,true);
  assert.equal(next.textSize,115);
  assert.deepEqual(next.season,old.season);
  assert.equal(store.data.get(preferenceStorageKey).schemaVersion,5);
  assert.equal(store.data.get('jamverse96-v1'),old);
});

test('corrupt, unsupported and blocked saves fall back to playable defaults',()=>{
  const invalid=loadPreferences(memoryStore({[preferenceStorageKey]:{schemaVersion:99,home:teams[2].id,volume:NaN}}),teams,createSeason,seasonLength);
  assert.equal(invalid.schemaVersion,5);
  assert.equal(invalid.home,teams[0].id);
  assert.equal(invalid.away,teams[26].id);
  assert.equal(invalid.musicVolume,.55);assert.equal(invalid.effectsVolume,.55);
  const blocked=loadPreferences({get(){throw new Error('storage blocked')},set(){throw new Error('storage blocked')}},teams,createSeason,seasonLength);
  assert.equal(blocked.home,teams[0].id);
  assert.equal(blocked.season.round,0);
});

test('rejects internally inconsistent saved season records',()=>{
  const store=memoryStore({[preferenceStorageKey]:{schemaVersion:4,home:teams[0].id,away:teams[1].id,season:{teamId:teams[0].id,round:2,wins:2,losses:0,complete:false,lastResult:'loss'}}});
  assert.equal(loadPreferences(store,teams,createSeason,seasonLength).season.round,0);
});

test('migrates v3 settings and league standings into v5',()=>{
  const old={schemaVersion:3,home:teams[4].id,away:teams[9].id,volume:.2,leagueRecords:{[teams[4].id]:{played:3,wins:2,losses:1,pointsFor:21,pointsAgainst:18}}};
  const store=memoryStore({'jamverse96-v3':old});
  const next=loadPreferences(store,teams,createSeason,seasonLength);
  assert.equal(next.schemaVersion,5);
  assert.equal(next.home,teams[4].id);
  assert.equal(next.musicVolume,.2);assert.equal(next.effectsVolume,.2);
  assert.deepEqual(next.leagueRecords[teams[4].id],old.leagueRecords[teams[4].id]);
  assert.deepEqual(next.leagueRecords[teams[0].id],{played:0,wins:0,losses:0,pointsFor:0,pointsAgainst:0});
  assert.equal(Object.keys(next.careerRecords).length,105);
});

test('migrates v2 preferences directly to v5',()=>{
  const old={schemaVersion:2,home:teams[2].id,away:teams[7].id,volume:.15};
  const store=memoryStore({'jamverse96-v2':old});
  const next=loadPreferences(store,teams,createSeason,seasonLength);
  assert.equal(next.schemaVersion,5);
  assert.equal(next.home,teams[2].id);
  assert.equal(next.musicVolume,.15);assert.equal(next.effectsVolume,.15);
  assert.equal(Object.keys(next.leagueRecords).length,35);
});

test('preserves separate v4 music and effects levels',()=>{
  const store=memoryStore({[preferenceStorageKey]:{schemaVersion:4,home:teams[0].id,away:teams[1].id,musicVolume:.18,effectsVolume:.83}});
  const next=loadPreferences(store,teams,createSeason,seasonLength);
  assert.equal(next.musicVolume,.18);assert.equal(next.effectsVolume,.83);
});

test('adds dunk and streak fields without dropping earlier v4 career totals',()=>{
  const career={games:2,points:12,fgm:5,fga:8,threeMakes:1,threeAttempts:3,assists:2,rebounds:3,steals:1,blocks:0,turnovers:1};
  const saved={schemaVersion:4,home:teams[0].id,away:teams[1].id,careerRecords:{'juniper-vale':career}};
  const next=loadPreferences(memoryStore({[preferenceStorageKey]:saved}),teams,createSeason,seasonLength);
  assert.equal(next.careerRecords['juniper-vale'].points,12);
  assert.equal(next.careerRecords['juniper-vale'].dunks,0);
  assert.equal(next.careerRecords['juniper-vale'].highestStreak,0);
});

test('screen shake defaults on and respects the saved accessibility toggle',()=>{
  const saved={schemaVersion:4,home:teams[0].id,away:teams[1].id,screenShake:false};
  assert.equal(loadPreferences(memoryStore({[preferenceStorageKey]:saved}),teams,createSeason,seasonLength).screenShake,false);
});

test('migrates v4 records and validates a saved cup bracket into v5',()=>{
  const tournament=createTournament(teams[5].id,teams,2026);
  const old={schemaVersion:4,home:teams[5].id,away:teams[1].id,tournament,leagueRecords:{[teams[5].id]:{played:1,wins:1,losses:0,pointsFor:7,pointsAgainst:3}}};
  const store=memoryStore({'jamverse96-v4':old});
  const saved=loadPreferences(store,teams,createSeason,seasonLength,validTournament);
  assert.equal(saved.schemaVersion,5);
  assert.deepEqual(saved.tournament,tournament);
  assert.equal(saved.leagueRecords[teams[5].id].wins,1);
  assert.equal(loadPreferences(memoryStore({[preferenceStorageKey]:{...old,schemaVersion:5,tournament:{...tournament,round:2}}}),teams,createSeason,seasonLength,validTournament).tournament,null);
});
