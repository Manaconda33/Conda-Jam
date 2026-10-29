import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { animationAssetManifest } from '../src/content/animation-assets.js';
import { anchorTick, sampleAnimation, sampleBallForward, sampleBallHeight } from '../src/core/animation.js';
import { createInput, createMatch, stepMatch } from '../src/core/simulation.js';
import { selectProductionSprite } from '../src/render/animation-sprites.js';

const athleteId='kraken';
const atlas='./public/assets/animation/kraken-receive-right.webp';
const height=[1.3,1.4,1.74,1.2];
const forward=[3,4.5,3,2];
const clip=animationAssetManifest.characters[athleteId].directions.right.receive;

test('J.07 Kraken receive registers four reviewed poses with a separate track',()=>{
  assert.equal(clip.reviewed,true);
  assert.equal(clip.src,atlas);
  assert.equal(clip.columns,2);
  assert.equal(clip.rows,2);
  assert.equal(clip.frames.length,4);
  assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,4);
  assert.equal(clip.source,'imagegen');
  assert.equal(clip.provenance.classification,'bespoke-source-composite');
  assert.equal(clip.provenance.review.status,'accepted');
  assert.equal(clip.provenance.generationId,'not exposed by the image-generation tool response');
  assert.equal(anchorTick('receive','grab'),4);
  assert.equal(sampleAnimation('receive',4).frame,2);
  assert.equal(sampleAnimation('receive',5).frame,3);
  assert.deepEqual(clip.provenance.runtimeBallTrack,{
    height,forward,reviewed:true,status:'accepted-normal-loader-review',
    review:'tools/generate-art/previews/kraken-receive4-attempt02/track-candidate/attempt-04/normal-loader/INDEPENDENT_GAMEPLAY_REVIEW_2026-10-29.md'
  });
  const bytes=readFileSync(new URL('../public/assets/animation/kraken-receive-right.webp',import.meta.url));
  assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
  for(const facing of [1,-1]){
    const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'receive',tick:4}},{
      manifest:animationAssetManifest,
      images:new Map([[atlas,{complete:true,naturalWidth:160,naturalHeight:192,file:atlas}]])
    });
    assert.equal(sprite?.atlas.file,atlas);
    assert.equal(sprite?.frame,2);
    assert.equal(sprite?.flip,facing<0);
  }
});

test('Marin’s pass meets Kraken’s raised receive hands without a catch snap',()=>{
  for(const facing of [1,-1]){
    const match=createMatch({quarterSeconds:60,seed:110,home:{roster:[{id:athleteId},{id:'marin-dusk'}]}});
    const kraken=match.players.find(player=>player.id===athleteId);
    const marin=match.players.find(player=>player.id==='marin-dusk');
    for(const player of match.players){
      player.hasBall=false;player.vx=player.vy=player.vz=player.z=0;
      if(player!==kraken&&player!==marin){player.x=player.team===kraken.team?35:175;player.y=8;player.stun=999;}
    }
    kraken.x=100;kraken.y=75;kraken.facing=-facing;kraken.stun=0;
    marin.x=100-facing*20;marin.y=75;marin.facing=facing;marin.stun=0;marin.hasBall=true;
    match.phase='playing';match.pause=false;match.possession=marin.team;
    Object.assign(match.ball,{mode:'carried',ownerId:marin.id,targetId:null,aerialTargetId:null,lastTouch:marin.id,attemptId:null,scored:false,x:marin.x,y:marin.y,z:1,vx:0,vy:0,vz:0});
    const neutral=pass=>match.players.map(player=>createInput(player.id,player===marin&&pass?{passPressed:true,passVariant:'pass'}:{}));
    stepMatch(match,neutral(true));
    let previous={x:match.ball.x,z:match.ball.z},catchDelta=null;
    for(let i=0;i<20&&!kraken.hasBall;i++){
      stepMatch(match,neutral(false));
      if(kraken.hasBall)catchDelta={x:match.ball.x-previous.x,z:match.ball.z-previous.z};
      else previous={x:match.ball.x,z:match.ball.z};
    }
    assert.equal(kraken.animation.clip,'receive');
    assert.equal(kraken.animation.tick,4);
    assert.equal(sampleAnimation('receive',4).frame,2);
    assert.equal(kraken.hasBall,true);
    assert.equal(match.ball.ownerId,athleteId);
    assert.ok(Math.abs(catchDelta.x)<0.02,`catch x correction ${catchDelta.x}`);
    assert.ok(Math.abs(catchDelta.z)<0.01,`catch z correction ${catchDelta.z}`);
    assert.equal(sampleBallHeight('receive',4,athleteId),1.74);
    assert.equal(match.ball.x,kraken.x+kraken.facing*sampleBallForward('receive',4,athleteId));
    assert.equal(match.ball.z,kraken.z+1.74);
    stepMatch(match,neutral(false));
    assert.equal(kraken.animation.tick,5);
    assert.equal(sampleAnimation('receive',5).frame,3);
    assert.equal(sampleBallHeight('receive',5,athleteId),1.2);
    assert.equal(sampleBallForward('receive',5,athleteId),2);
    assert.equal(match.ball.x,kraken.x+kraken.facing*2);
    assert.equal(match.ball.z,kraken.z+1.2);
    stepMatch(match,neutral(false));stepMatch(match,neutral(false));
    assert.equal(kraken.animation.tick,7);
    assert.equal(match.ball.ownerId,athleteId);
    assert.equal(match.ball.x,kraken.x+kraken.facing*2);
    assert.equal(match.ball.z,kraken.z+1.2);
    assert.deepEqual(match.score,[0,0]);
  }
});
