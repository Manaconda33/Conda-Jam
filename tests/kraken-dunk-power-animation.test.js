import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {animationAssetManifest} from '../src/content/animation-assets.js';
import {animationMirrorPolicy} from '../src/content/animation-mirror-policy.js';
import {animationClips,anchorTick,athleteBallTrackSource,sampleAnimation,sampleBallHeight,sampleBallForward} from '../src/core/animation.js';
import {selectProductionSprite} from '../src/render/animation-sprites.js';
import {createInput,createMatch,stepMatch} from '../src/core/simulation.js';
import {teams} from '../src/content/teams.js';
import {decodeImage} from '../tools/animation-assets.mjs';

const athleteId='kraken';
const atlas='./public/assets/animation/kraken-dunk-power-right.webp';
const trackHeight=[1,1,1.15,1,.9,.8,1.6,1.65,1.7,1.8,1.95,.85,.95,.8,.62];
const trackForward=[5.5,5,7.5,4.5,3,2,1,1,8,6,12,3,8,8,-1];

test('J.07 Kraken power dunk has reviewed source poses, separate hand track, and production-renderer coverage',async()=>{
 const character=animationAssetManifest.characters[athleteId],clip=character?.directions?.right?.['dunk-power'];
 const mirror=animationMirrorPolicy[athleteId];
 assert.ok(clip,'registered Kraken power-dunk atlas');
 assert.equal(character.mirrorSafe,true);assert.equal(character.mirrorReview.status,'reviewed');
 assert.equal(mirror.mirrorSafe,true);assert.equal(mirror.mirrorReview.status,'reviewed');
 assert.equal(clip.reviewed,true);assert.equal(clip.src,atlas);assert.equal(clip.source,'imagegen');
 assert.equal(clip.baselineY,92);assert.equal(clip.frames.length,15);assert.equal(new Set(clip.frames.map(frame=>frame.hash)).size,15);
 assert.equal(clip.provenance.generationId,'exec-70464830-b9cf-44ba-ba73-ee7444aced0a');
 const bytes=readFileSync(new URL('../public/assets/animation/kraken-dunk-power-right.webp',import.meta.url));
 assert.equal(createHash('sha256').update(bytes).digest('hex'),clip.sha256);
 const decoded=await decodeImage(fileURLToPath(new URL('../public/assets/animation/kraken-dunk-power-right.webp',import.meta.url)));assert.deepEqual([decoded.width,decoded.height],[400,288]);
 assert.equal(athleteBallTrackSource(athleteId,'dunk-power','height'),athleteId);
 assert.equal(athleteBallTrackSource(athleteId,'dunk-power','forward'),athleteId);
 const starts=[];let tick=0;
 for(let frame=0;frame<15;frame++){starts.push([frame,tick]);tick+=animationClips['dunk-power'].frames[frame].duration;}
 assert.deepEqual(starts.map(([frame,at])=>sampleAnimation('dunk-power',at).frame),Array.from({length:15},(_,i)=>i));
 const images=new Map([[atlas,{complete:true,naturalWidth:400,naturalHeight:288,file:atlas}]]);
 for(const [frame,at] of starts){for(const [facing,flip] of [[1,false],[-1,true]]){const sprite=selectProductionSprite({id:athleteId,facing,animation:{clip:'dunk-power',tick:at}},{manifest:animationAssetManifest,images});assert.equal(sprite?.src,atlas);assert.equal(sprite?.frame,frame);assert.equal(sprite?.flip,flip);}}
 assert.deepEqual(['takeoff','grab','peak','release','finish','land'].map(name=>anchorTick('dunk-power',name)),[4,10,14,21,23,30]);
 assert.deepEqual(starts.map(([,at])=>sampleBallHeight('dunk-power',at,athleteId)),trackHeight);
 assert.deepEqual(starts.map(([,at])=>sampleBallForward('dunk-power',at,athleteId)),trackForward);
 const report=JSON.parse(readFileSync(new URL('../tools/generate-art/previews/kraken-dunk-power-attempt08/normal-loader-runtime/report.json',import.meta.url),'utf8'));
 assert.equal(report.runtimeIntegration,true);assert.equal(report.candidateAtlasInjected,false);assert.equal(report.candidateBallTrackInjected,false);assert.equal(report.captureCount,60);assert.deepEqual(report.uncaughtBrowserErrors,[]);
 for(const run of report.runs){assert.equal(run.captures.length,15);assert.deepEqual(run.captures.map(c=>c.selectedFrame),Array.from({length:15},(_,i)=>i));assert.ok(run.captures.every(c=>c.selectedSrc===atlas&&c.flip===(run.facing<0)));const release=run.captures.find(c=>c.tick===21);assert.equal(release.ball.mode,'dunk');assert.equal(release.ball.owner,null);const scored=run.captures.find(c=>c.tick===23);assert.equal(scored.score[run.facing===1?0:1],2);assert.equal(scored.clip,'dunk-power');assert.equal(run.captures.at(-1).clip,'dunk-power');}
});

test('Kraken keeps the power-dunk landing poses visible after the score commits',()=>{
 const home=teams.find(team=>team.roster.some(athlete=>athlete.id===athleteId)),away=teams.find(team=>team!==home);
 const match=createMatch({quarterSeconds:60,seed:128,home,away,homePartnerId:athleteId});
 const k=match.players.find(player=>player.id===athleteId);for(const player of match.players)player.hasBall=false;
 k.hasBall=true;k.x=186;k.y=50;k.vx=.2;k.dunk=99;k.facing=1;k.animation={clip:'idle-ball',tick:0};k.anim='idle-ball';
 Object.assign(match.ball,{mode:'carried',ownerId:athleteId,lastTouch:athleteId,x:k.x+sampleBallForward('idle-ball',0,athleteId),y:k.y,z:sampleBallHeight('idle-ball',0,athleteId),vx:0,vy:0,vz:0,scored:false});match.possession=k.team;
 const neutral=()=>match.players.map(player=>createInput(player.id));
 stepMatch(match,neutral().map(input=>input.playerId===athleteId?createInput(athleteId,{x:1,turbo:true,shootPressed:true,dunkVariant:'power'}):input));
 while(k.animation.tick<20)stepMatch(match,neutral());assert.equal(k.hasBall,true);assert.equal(match.ball.ownerId,athleteId);
 stepMatch(match,neutral());assert.equal(k.animation.tick,21);assert.equal(match.ball.mode,'dunk');assert.equal(k.hasBall,false);assert.equal(match.score[k.team],0);
 while(!match.scoredAttempts?.length)stepMatch(match,neutral());assert.equal(k.animation.tick,23);assert.equal(match.score[k.team],2);assert.equal(k.animation.clip,'dunk-power');
 while(k.animation.clip==='dunk-power')stepMatch(match,neutral());assert.equal(k.animation.clip,'celebrate');assert.equal(match.score[k.team],2);
});
