import test from 'node:test';
import assert from 'node:assert/strict';
import { teams } from '../src/content/teams.js';
import { createSeason, seasonLength } from '../src/core/season.js';
import { loadPreferences, preferenceStorageKey } from '../src/core/preferences.js';

function memoryStore(initial={}){
  const data=new Map(Object.entries(initial));
  return {get(key,fallback){return data.has(key)?data.get(key):fallback},set(key,value){data.set(key,value)},data};
}

test('migrates v1 local settings and season progress into v2 without dropping valid choices',()=>{
  const old={home:teams[3].id,away:teams[8].id,homePartnerId:'accu-ally',volume:.37,textSize:115,reducedFlash:true,teamMarkers:true,season:{teamId:teams[3].id,round:4,wins:4,losses:0,complete:false,lastResult:'win'}};
  const store=memoryStore({'jamverse96-v1':old});
  const next=loadPreferences(store,teams,createSeason,seasonLength);
  assert.equal(next.schemaVersion,2);
  assert.equal(next.home,old.home);
  assert.equal(next.away,old.away);
  assert.equal(next.volume,.37);
  assert.equal(next.textSize,115);
  assert.deepEqual(next.season,old.season);
  assert.equal(store.data.get(preferenceStorageKey).schemaVersion,2);
  assert.equal(store.data.get('jamverse96-v1'),old);
});

test('corrupt, unsupported and blocked saves fall back to playable defaults',()=>{
  const invalid=loadPreferences(memoryStore({[preferenceStorageKey]:{schemaVersion:99,home:teams[2].id,volume:NaN}}),teams,createSeason,seasonLength);
  assert.equal(invalid.schemaVersion,2);
  assert.equal(invalid.home,teams[0].id);
  assert.equal(invalid.away,teams[26].id);
  assert.equal(invalid.volume,.55);
  const blocked=loadPreferences({get(){throw new Error('storage blocked')},set(){throw new Error('storage blocked')}},teams,createSeason,seasonLength);
  assert.equal(blocked.home,teams[0].id);
  assert.equal(blocked.season.round,0);
});

test('rejects internally inconsistent saved season records',()=>{
  const store=memoryStore({[preferenceStorageKey]:{schemaVersion:2,home:teams[0].id,away:teams[1].id,season:{teamId:teams[0].id,round:2,wins:2,losses:0,complete:false,lastResult:'loss'}}});
  assert.equal(loadPreferences(store,teams,createSeason,seasonLength).season.round,0);
});
