import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { canonicalJson } from './canonical-json.mjs';

const sorted = x => Object.keys(x).sort();
const digest = b => createHash('sha256').update(b).digest('hex');
const fingerprint = row => digest(canonicalJson(row));

export function assertBlobInventory(expected, actual) {
  const fold = inventory => {
    const map = new Map();
    for (const item of inventory) {
      assert(item.path && !map.has(item.path), 'duplicate or empty artifact inventory path');
      assert.match(item.blob, /^[a-f0-9]{40}$/, 'bad blob fingerprint');
      assert.match(item.sha256, /^[a-f0-9]{64}$/, 'bad SHA-256 fingerprint');
      map.set(item.path, [item.blob, item.sha256]);
    }
    return map;
  };
  const pinned = fold(expected), observed = fold(actual);
  assert.equal(observed.size, pinned.size, 'artifact inventory count mismatch');
  for (const [path, blob] of pinned) assert.deepEqual(observed.get(path), blob, 'artifact blob mismatch: ' + path);
}

export function assertRuntimeRows(base, candidate, pins, expectedCount) {
  assert.deepEqual(sorted(candidate), sorted(base), 'athlete identity mismatch');
  const changed = [];
  let count = 0;
  for (const athlete of sorted(base)) {
    assert.deepEqual(sorted(candidate[athlete]), sorted(base[athlete]), 'clip identity mismatch: ' + athlete);
    for (const clip of sorted(base[athlete])) {
      count++;
      const old = base[athlete][clip], now = candidate[athlete][clip];
      const permitted = athlete === 'myth' && Object.hasOwn(pins, clip);
      if (!permitted) {
        assert.deepEqual(now, old, 'runtime change outside approved Myth tracks: ' + athlete + '/' + clip);
        continue;
      }
      assert.deepEqual(now.slice(2, 7), old.slice(2, 7), 'changed release velocity, timing or anchors: ' + clip);
      assert.equal(fingerprint(old), pins[clip].runtimeBeforeSha256, 'baseline fingerprint mismatch: ' + clip);
      assert.equal(fingerprint(now), pins[clip].runtimeAfterSha256, 'reviewed fingerprint mismatch: ' + clip);
      assert.notDeepEqual(now, old, 'approved set must be complete: ' + clip);
      changed.push(clip);
    }
  }
  assert.equal(count, expectedCount, 'runtime row count mismatch');
  assert.deepEqual(changed, sorted(pins), 'approved set mismatch');
  return { rows: count, changed };
}

const historicalTest = 'tests/animation-ball-tracks-parity.test.js';
const historicalFixture = 'tests/fixtures/animation/tracked-action-runtime-baseline.json';
const manifest = 'public/assets/animation/manifest.json';
const runtimePaths = [
  'package.json', 'src/core/animation.js', 'src/content/teams.js', 'src/content/animation-ball-tracks.js',
  'src/content/animation-assets.js', 'src/content/supporting-donor-map.js', 'src/content/supporting-animation-libraries.js',
  'src/content/supporting-uniform-profiles.js', 'tools/captain-studio/canonical-json.mjs',
  historicalTest, historicalFixture,
];

export async function verifyReview(repo, reviewHead) {
  const pins = JSON.parse(readFileSync(new URL('./myth-track-policy-review-pins.json', import.meta.url), 'utf8'));
  assert.equal(reviewHead, pins.head, 'not the immutable reviewed asset commit');
  assert.equal(pins.paths.length, 122);
  assert.equal(pins.clipsAdded.length, 20);
  assert.equal(sorted(pins.tracks).length, 15);
  const git = (...argv) => execFileSync('git', ['-C', repo, ...argv], {maxBuffer:64*1024*1024});
  const show = (ref, path) => git('show', ref + ':' + path);
  const output = (...args) => git(...args).toString('utf8').trim();
  assert.equal(output('rev-parse',reviewHead+'^{tree}'), pins.draftTree, 'candidate tree fingerprint mismatch');
  git('merge-base','--is-ancestor',pins.main,reviewHead);
  const diff = git('diff', '--name-only', '--no-renames', '-z', pins.main, reviewHead).toString('utf8').split('\0').filter(Boolean);
  assertBlobInventory(pins.paths, diff.map(path => ({
    path, blob: output('rev-parse', '--verify', reviewHead + ':' + path), sha256: digest(show(reviewHead, path)),
  })));
  for (const path of [historicalTest,historicalFixture]) assert.deepEqual(show(pins.main,path),show(reviewHead,path));
  const beforeArt=JSON.parse(show(pins.main,manifest)), afterArt=JSON.parse(show(reviewHead,manifest));
  const afterMyth=afterArt.characters.myth.directions.right;
  for (const clip of pins.clipsAdded) {
    const path='public/assets/animation/myth-'+clip+'-right.webp';
    assert.equal(afterMyth[clip].src,'./'+path);
    assert.equal(afterMyth[clip].sha256,digest(show(reviewHead,path)));
    delete afterMyth[clip];
  }
  assert.deepEqual(afterArt,beforeArt,'unapproved manifest drift');

  // Load JS only after authenticating the complete approved candidate tree.
  const dir = mkdtempSync(join(tmpdir(),'myth-policy-review-'));
  try {
    const load = async (ref, name) => {
      const root = join(dir,name);
      for (const path of runtimePaths) {
        const target=join(root,path);
        mkdirSync(dirname(target),{recursive:true}); writeFileSync(target,show(ref,path));
      }
      if(name==='historical')execFileSync(process.execPath,['--test',join(root,historicalTest)],{stdio:'inherit'});
      const request = path => import(pathToFileURL(join(root,path)).href);
      const { teams } = await request('src/content/teams.js');
      // Import raw registry from a separate module instance. Runtime animation
      // applies existing donor overrides in memory after import.
      const rawModule = pathToFileURL(join(root,'src/content/animation-ball-tracks.js'));
      rawModule.searchParams.set('mode','raw-review');
      const raw = await import(rawModule.href);
      const a = await request('src/core/animation.js');
      const athletes = teams.flatMap(t=>t.roster);
      assert.equal(athletes.length,105);
      assert.equal(sorted(a.animationClips).length,29);
      const rows = Object.fromEntries(athletes.map(({id})=>[id,Object.fromEntries(Object.entries(a.animationClips).map(([clip,def])=>{
        const n=a.animationDuration(clip);
        return [clip,[a.athleteBallTrackSource(id,clip,'height'),a.athleteBallTrackSource(id,clip,'forward'),a.sampleBallReleaseVz(clip,id),n,Boolean(def.loop),def.frames.map(f=>f.duration),def.anchors,Array.from({length:n+2},(_,i)=>[a.sampleBallHeight(clip,i,id),a.sampleBallForward(clip,i,id)])]];
      }))]));
      return {rows,raw};
    };
    const base = await load(pins.main,'historical'), candidate = await load(reviewHead,'candidate');
    const withoutMyth = o => Object.fromEntries(Object.entries(o).filter(([id])=>id!=='myth'));
    for (const key of ['athleteBallTracks','athleteBallTrackProvenance']) {
      assert.deepEqual(withoutMyth(candidate.raw[key]), withoutMyth(base.raw[key]), 'unapproved raw registry drift: '+key);
    }
    assert.deepEqual(sorted(candidate.raw.athleteBallTracks.myth),sorted(pins.tracks));
    assert.deepEqual(candidate.raw.athleteBallTrackProvenance.myth.trackKeys,sorted(pins.tracks));
    assert.deepEqual(sorted(candidate.raw.athleteBallTrackProvenance.myth.perClip),sorted(pins.tracks));
    const result=assertRuntimeRows(base.rows,candidate.rows,pins.tracks,pins.runtimeRows);
    assert.equal(fingerprint(base.rows),pins.historicalDigest);
    assert.equal(fingerprint(candidate.rows),pins.draftRuntimeDigest);
    return { baseline:pins.main, candidate:reviewHead, tree:pins.draftTree, changedMythTracks:result.changed,
      unchangedRuntimeRows:result.rows-result.changed.length, runtimeRows:result.rows, verifiedBlobs:diff.length };
  } finally {
    rmSync(dir,{recursive:true,force:true});
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const repo=resolve(process.argv[2]??'.'), head=process.argv[3];
  console.log(JSON.stringify(await verifyReview(repo,head),null,2));
}
