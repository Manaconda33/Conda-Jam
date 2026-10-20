import test from 'node:test';
import assert from 'node:assert/strict';
import { teams, validateLeague } from '../src/content/teams.js';

test('league contains every canonical captain in exactly one three-player franchise', () => {
  const result = validateLeague(teams);
  assert.deepEqual(result, { teams: 35, athletes: 105, captains: 35, errors: [] });
  assert.equal(teams.some(t => t.roster.some(p => /cleo/i.test(p.name))), false);
});

test('all 35 canonical captain identities and sprite rigs stay fixed', () => {
  const canonical = [
    ['manaconda','Manaconda','human'],['paprika','Paprika','quadruped-fox'],['keeg','Keeg','human'],
    ['accu','Accu','human'],['leo','Leo','human'],['krios','Krios','horned-giant'],
    ['kraken','Kraken','elf'],['lavi','Lavi','human'],['ria','Ria','human'],
    ['gummiefish','Gummiefish','human'],['colossus','Colossus','human'],['mcfleurdel','McFleurdel','human'],
    ['toph','Toph','human'],['heph','Heph','artisan-deity'],['liv','Liv','elf'],
    ['e-indigo','E. Indigo','cosmic-humanoid'],['myth','Myth','human'],['wicked','Wicked','horned-human'],
    ['anna','Anna','human'],['alexithymia','Alexithymia','blank-screen-android'],['alex','Alex','human'],
    ['avek','Avek','masked-rock-deity'],['cilia','Cilia','human'],['steeb','Steeb','wombat'],
    ['jennifer','Jennifer','human'],['eow','EOW','human'],['dragon-queen','Dragon Queen','dragon'],
    ['suga','Suga','cobra'],['6foot10','6foot10','orc'],['gb-design','GB Design','jaguar'],
    ['jragena','Jragena','winged-humanoid'],['dea','Dea','feline-human'],['pack-mama','Pack Mama','human'],
    ['quirky','Quirky','orangutan-zebra'],['lula','Lula','elf']
  ];
  const actual=teams.map(t=>[t.roster[0].id,t.roster[0].name,t.roster[0].rig]).sort((a,b)=>a[0].localeCompare(b[0]));
  assert.deepEqual(actual,canonical.sort((a,b)=>a[0].localeCompare(b[0])));
});

test('special anatomy tags stay attached to their canonical players', () => {
  const required = {
    'paprika': 'quadruped-fox', 'dragon-queen': 'dragon', 'suga': 'cobra',
    'quirky': 'orangutan-zebra', 'steeb': 'wombat', 'gb-design': 'jaguar',
    'kraken': 'elf', 'alexithymia': 'blank-screen-android'
  };
  for (const [id, rig] of Object.entries(required)) {
    const player = teams.flatMap(t => t.roster).find(p => p.id === id);
    assert.ok(player, `${id} is present`);
    assert.equal(player.rig, rig);
  }
});

test('content validator rejects missing identity, presentation and render requirements', () => {
  const league=structuredClone(teams);
  league[0].roster[2].name=league[0].roster[1].name;
  league[0].roster[2].number=league[0].roster[1].number;
  league[1].roster[0].rig='unrenderable';
  league[1].roster[0].visualSeed=undefined;
  league[2].roster[0].visualSeed=league[3].roster[0].visualSeed;
  league[1].slogan='';
  const errors=validateLeague(league).errors.join('\n');
  assert.match(errors,/duplicate roster name/i);
  assert.match(errors,/duplicate uniform number/i);
  assert.match(errors,/unsupported sprite rig/i);
  assert.match(errors,/visual seed/i);
  assert.match(errors,/duplicate visual seed/i);
  assert.match(errors,/missing presentation/i);
});
