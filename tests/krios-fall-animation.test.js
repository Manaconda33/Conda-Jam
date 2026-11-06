import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, sampleAnimation } from '../src/core/animation.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage } from '../tools/animation-assets.mjs';

test('J.128 Krios fall has ten reviewed ball-free poses and a deterministic live shove trigger', async () => {
  const character = animationAssetManifest.characters.krios;
  const clip = character.directions.right.fall;
  const path = fileURLToPath(new URL(`../${clip.src.slice(2)}`, import.meta.url));
  assert.equal(character.mirrorSafe, true);
  assert.equal(character.mirrorReview.status, 'reviewed');
  assert.equal(clip.reviewed, true);
  assert.equal(clip.frames.length, 10);
  assert.equal(new Set(clip.frames.map(frame => frame.hash)).size, 10);
  assert.equal(clip.sha256, createHash('sha256').update(readFileSync(path)).digest('hex'));
  const image = await decodeImage(path);
  assert.deepEqual([image.width,image.height],[1280,96]);
  assert.deepEqual(animationClips.fall.frames.map(frame=>frame.duration),[2,2,2,3,3,4,5,6,6,7]);
  assert.equal(sampleAnimation('fall',33).frame,9);
  const imageMap = new Map([[clip.src,{complete:true,naturalWidth:1280,naturalHeight:96,file:clip.src}]]);
  for(const facing of [1,-1]){
    const scoria=teams.find(team=>team.id==='scoria-rams'),blackthorn=teams.find(team=>team.id==='blackthorn-court-kings');
    const match=createMatch({quarterSeconds:180,seed:2654435761,home:scoria,away:blackthorn});
    const target=match.players.find(player=>player.id==='krios'),attacker=match.players.find(player=>player.id==='leo');
    match.players=[target,attacker];match.possession=target.team;match.rng=2654435761;
    Object.assign(attacker,{x:100,y:93,vx:0,vy:0,vz:0,z:0,facing,hasBall:false,stun:0,animation:{clip:'idle',tick:0}});
    Object.assign(target,{x:100+facing*4.7,y:90,vx:0,vy:0,vz:0,z:0,facing:-facing,hasBall:false,stun:0,animation:{clip:'idle',tick:0}});
    Object.assign(match.ball,{mode:'dead',ownerId:null,targetId:null,aerialTargetId:null,attemptId:null,scored:false,x:100,y:90,z:0,vx:0,vy:0,vz:0});
    stepMatch(match,[createInput(attacker.id,{shovePressed:true}),createInput(target.id)]);
    assert.equal(attacker.animation.clip,'push');
    while(attacker.animation.tick<8)stepMatch(match,[createInput(attacker.id),createInput(target.id)]);
    stepMatch(match,[createInput(attacker.id),createInput(target.id)]);
    assert.equal(target.animation.clip,'fall');
    assert.equal(target.animation.tick,1);
    assert.ok(target.stun>0);
    assert.equal(target.hasBall,false);assert.equal(match.ball.mode,'dead');assert.equal(match.ball.ownerId,null);
    const ticks=[1,3,5,8,11,14,18,23,29,35], frames=[0,1,2,3,4,5,6,7,8,9];
    for(let i=0;i<ticks.length;i++){
      const current=sampleAnimation('fall',ticks[i]).frame;assert.equal(current,frames[i]);
      for(const [dir,flip] of [[1,false],[-1,true]]){
        const sprite=selectProductionSprite({id:'krios',facing:dir,animation:{clip:'fall',tick:ticks[i]}},{manifest:animationAssetManifest,images:imageMap});
        assert.equal(sprite?.src,clip.src);assert.equal(sprite?.frame,frames[i]);assert.equal(sprite?.flip,flip);
      }
    }
  }
  const runtime=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/krios-fall10-attempt01/live-knockdown-candidate/registered-runtime/report.json',import.meta.url),'utf8'));
  assert.equal(runtime.runtimeIntegration,true);assert.equal(runtime.candidateAtlasInjected,false);assert.equal(runtime.captureCount,40);assert.deepEqual(runtime.uncaughtBrowserErrors,[]);
});
