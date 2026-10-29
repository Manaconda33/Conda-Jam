import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { animationClips, sampleAnimation, athleteBallTrackSource } from '../src/core/animation.js';
import { commitScore, createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { teams } from '../src/content/teams.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';
import { decodeImage } from '../tools/animation-assets.mjs';

test('J.128 Krios celebration follows scoring, uses ten reviewed poses, and keeps the ball dead',async()=>{
 const character=animationAssetManifest.characters.krios,clip=character.directions.right.celebrate;
 const path=fileURLToPath(new URL(`../${clip.src.slice(2)}`,import.meta.url));
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');assert.equal(clip.reviewed,true);
 assert.equal(clip.frames.length,10);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,10);
 assert.equal(clip.sha256,createHash('sha256').update(readFileSync(path)).digest('hex'));
 const image=await decodeImage(path);assert.deepEqual([image.width,image.height],[1280,96]);
 assert.deepEqual(animationClips.celebrate.frames.map(frame=>frame.duration),[5,5,6,8,10,10,8,7,6,5]);
 assert.equal(athleteBallTrackSource('krios','celebrate','height'),null);
 const imageMap=new Map([[clip.src,{complete:true,naturalWidth:1280,naturalHeight:96,file:clip.src}]]);
 const starts=[0,5,10,16,24,34,44,52,59,65];
 for(const [homeId,awayId] of [['scoria-rams','blackthorn-court-kings'],['blackthorn-court-kings','scoria-rams']]){
  const match=createMatch({quarterSeconds:180,seed:1013904226,home:teams.find(t=>t.id===homeId),away:teams.find(t=>t.id===awayId)});
  const k=match.players.find(p=>p.id==='krios');match.players=[k];match.score=[0,0];match.ball.mode='dead';match.ball.ownerId=null;
  const attempt={id:'krios-celebrate-test',team:k.team,playerId:k.id,points:2};assert.equal(commitScore(match,attempt),true);
  assert.equal(k.animation.clip,'celebrate');assert.equal(k.animation.tick,0);assert.equal(match.score[k.team],2);
  assert.equal(match.ball.mode,'dead');assert.equal(match.ball.ownerId,null);
  for(const [frame,tick] of starts.entries()){
   while(k.animation.tick<tick)stepMatch(match,[createInput(k.id)]);
   assert.equal(k.animation.clip,'celebrate');assert.equal(sampleAnimation('celebrate',tick).frame,frame);
   for(const [facing,flip] of [[1,false],[-1,true]]){
    const selected=selectProductionSprite({id:'krios',facing,animation:{clip:'celebrate',tick}},{manifest:animationAssetManifest,images:imageMap});
    assert.equal(selected?.src,clip.src);assert.equal(selected?.frame,frame);assert.equal(selected?.flip,flip);
   }
   assert.equal(match.ball.mode,'dead');assert.equal(match.ball.ownerId,null);
  }
 }
 const report=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/krios-celebrate10-attempt01/scoring-transition/registered-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(report.runtimeIntegration,true);assert.equal(report.candidateAtlasInjected,false);assert.equal(report.captureCount,40);assert.deepEqual(report.uncaughtBrowserErrors,[]);
});
