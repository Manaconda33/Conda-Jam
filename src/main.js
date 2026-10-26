import { teams, validateLeague } from './content/teams.js';
import { createMatch, createInput, stepMatch, substitutePlayer, resetPracticeBall, court } from './core/simulation.js';
import { createSeason, seasonOpponent, recordSeasonResult, seasonLength } from './core/season.js';
import { musicStep } from './core/music.js';
import { loadPreferences, preferenceStorageKey } from './core/preferences.js';
import { createLeagueTable, recordLeagueResult, rankLeague } from './core/league.js';
import { createCareerRecords, rankCareerLeaders, recordCareerMatch } from './core/career.js';
import { createTournament, recordTournamentResult, validTournament } from './core/tournament.js';
import { animationAssetManifest } from './content/animation-assets.js';
import { selectProductionSprite, legacySpritePose, athleteVisualScale, ballDrawDepth } from './render/animation-sprites.js';
import { courtMarkings, ballHeightPixels } from './render/court-geometry.js';
import { updateCameraX } from './render/camera-tracking.js';
import { JAM_STAGE, projectJamStagePoint, stageDepthScale } from './render/jam-stage.js';
import { createDebugDiagnostics, debugLines, recordDebugFrame, recordDebugTick, setDebugEnabled } from './render/debug-diagnostics.js';
import { boxScoreHeader, formatBoxScoreRow } from './ui/box-score.js';
import { gamepadButtonLabels, normalizeGamepadButtons, readGamepadActions, readGamepadMovement } from './input/gamepad-controls.js';

const $=id=>document.getElementById(id), canvas=$('game'),ctx=canvas.getContext('2d',{alpha:false});
const screenStart=$('start-screen'), screenGame=$('game-screen'), homeSelect=$('home-team'),awaySelect=$('away-team'),homeLineup=$('home-lineup'),awayLineup=$('away-lineup');
const captainAtlas=new Image();captainAtlas.src='./public/assets/captain-portrait-atlas-lossless.webp';const eIndigoPortrait=new Image();eIndigoPortrait.src='./public/assets/captain-portraits/e-indigo.webp';const teamCrestAtlas=new Image();teamCrestAtlas.src='./public/assets/team-crest-atlas-lossless.webp';
const captainGameplayAtlas=new Image();captainGameplayAtlas.src='./public/assets/captain-gameplay-sprites-lossless.webp';
const supportingGameplayAtlas=new Image();supportingGameplayAtlas.src='./public/assets/supporting-player-gameplay-sprites-lossless.webp';
const supportingPortraitAtlas=new Image();supportingPortraitAtlas.src='./public/assets/supporting-player-portrait-atlas-lossless.webp';
const captainRunAtlas=new Image();captainRunAtlas.src='./public/assets/captain-run-sprites-lossless.webp';
const supportingRunAtlas=new Image();supportingRunAtlas.src='./public/assets/supporting-player-run-sprites-lossless.webp';
const captainRunAtlas2=new Image();captainRunAtlas2.src='./public/assets/captain-run-sprites-2-lossless.webp';
const supportingRunAtlas2=new Image();supportingRunAtlas2.src='./public/assets/supporting-player-run-sprites-2-lossless.webp';
const captainRunAtlas3=new Image();captainRunAtlas3.src='./public/assets/captain-run-sprites-3-lossless.webp';
const supportingRunAtlas3=new Image();supportingRunAtlas3.src='./public/assets/supporting-player-run-sprites-3-lossless.webp';
const captainRunCycle=[captainRunAtlas,captainRunAtlas2,captainRunAtlas3,captainRunAtlas2];
const supportingRunCycle=[supportingRunAtlas,supportingRunAtlas2,supportingRunAtlas3,supportingRunAtlas2];
const actionAtlasNames=['pass','receive','push','block','rebound','pickup','celebrate','shoot','dunk'];
const loadActionAtlas=src=>{const image=new Image();image.src=src;return image};
const actionAtlases={
  pass:{captain:[loadActionAtlas('./public/assets/action-pass-captains.webp'),loadActionAtlas('./public/assets/action-pass-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-pass-supporting.webp'),loadActionAtlas('./public/assets/action-pass-frame2-supporting.webp')]},
  receive:{captain:[loadActionAtlas('./public/assets/action-receive-captains.webp'),loadActionAtlas('./public/assets/action-receive-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-receive-supporting.webp'),loadActionAtlas('./public/assets/action-receive-frame2-supporting.webp')]},
  push:{captain:[loadActionAtlas('./public/assets/action-push-captains.webp'),loadActionAtlas('./public/assets/action-push-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-push-supporting.webp'),loadActionAtlas('./public/assets/action-push-frame2-supporting.webp')]},
  block:{captain:[loadActionAtlas('./public/assets/action-block-captains.webp'),loadActionAtlas('./public/assets/action-block-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-block-supporting.webp'),loadActionAtlas('./public/assets/action-block-frame2-supporting.webp')]},
  rebound:{captain:[loadActionAtlas('./public/assets/action-rebound-captains.webp'),loadActionAtlas('./public/assets/action-rebound-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-rebound-supporting.webp'),loadActionAtlas('./public/assets/action-rebound-frame2-supporting.webp')]},
  pickup:{captain:[loadActionAtlas('./public/assets/action-pickup-captains.webp'),loadActionAtlas('./public/assets/action-pickup-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-pickup-supporting.webp'),loadActionAtlas('./public/assets/action-pickup-frame2-supporting.webp')]},
  celebrate:{captain:[loadActionAtlas('./public/assets/action-celebrate-captains.webp'),loadActionAtlas('./public/assets/action-celebrate-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-celebrate-supporting.webp'),loadActionAtlas('./public/assets/action-celebrate-frame2-supporting.webp')]},
  shoot:{captain:[loadActionAtlas('./public/assets/action-shoot-captains.webp'),loadActionAtlas('./public/assets/action-shoot-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-shoot-supporting.webp'),loadActionAtlas('./public/assets/action-shoot-frame2-supporting.webp')]},
  dunk:{captain:[loadActionAtlas('./public/assets/action-dunk-captains.webp'),loadActionAtlas('./public/assets/action-dunk-frame2-captains.webp')],supporting:[loadActionAtlas('./public/assets/action-dunk-supporting.webp'),loadActionAtlas('./public/assets/action-dunk-frame2-supporting.webp')]}
};
function updateActionArtStatus(){if(actionAtlasNames.every(action=>[...actionAtlases[action].captain,...actionAtlases[action].supporting].every(atlas=>atlas.naturalWidth))){$('game').dataset.actionArt='generated-two-frame-nine-action-atlases-for-105-athletes';$('game').dataset.shotArt='generated-105-athlete-shot-poses';$('game').dataset.dunkArt='generated-105-athlete-dunk-poses'}}
for(const groups of Object.values(actionAtlases))for(const frames of Object.values(groups))for(const atlas of frames)atlas.addEventListener('load',updateActionArtStatus);
const productionSpriteImages=new Map();
function loadProductionSprites(athletes){
  const wanted=new Set();
  for(const athlete of athletes)for(const direction of Object.values(animationAssetManifest.characters[athlete.id]?.directions??{}))for(const clip of Object.values(direction))wanted.add(clip.src);
  for(const src of productionSpriteImages.keys())if(!wanted.has(src))productionSpriteImages.delete(src);
  for(const src of wanted)if(!productionSpriteImages.has(src)){const atlas=new Image();productionSpriteImages.set(src,atlas);atlas.src=src;}
}
const productionSpriteAssets={manifest:animationAssetManifest,images:productionSpriteImages};
canvas.dataset.animationRuntime='simulation-frame-timing';
function updateGameplayArtStatus(){if(captainGameplayAtlas.naturalWidth&&supportingGameplayAtlas.naturalWidth)$('game').dataset.gameplayArt='generated-full-roster-atlases'}
captainGameplayAtlas.addEventListener('load',updateGameplayArtStatus);supportingGameplayAtlas.addEventListener('load',updateGameplayArtStatus);
supportingPortraitAtlas.addEventListener('load',()=>{$('game').dataset.supportPortraits='generated-70-athlete-atlas'});
function updateRunArtStatus(){if([captainRunAtlas,supportingRunAtlas,captainRunAtlas2,supportingRunAtlas2,captainRunAtlas3,supportingRunAtlas3].every(atlas=>atlas.naturalWidth))$('game').dataset.runArt='generated-4-frame-105-athlete-run-cycles'}
[captainRunAtlas,supportingRunAtlas,captainRunAtlas2,supportingRunAtlas2,captainRunAtlas3,supportingRunAtlas3].forEach(atlas=>atlas.addEventListener('load',updateRunArtStatus));
const safeStore={get(key,fallback){try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}},set(key,value){try{localStorage.setItem(key,JSON.stringify(value))}catch{}}};
let match=null,raf=0,last=0,accumulator=0,controlled=[],keyboardPlayers=[],camX=100,mode='menu',practice=false,musicVolume=.55,effectsVolume=.55,screenShake=true,reducedFlash=false,audioCaptions=true,teamMarkers=false,textSize=100,cameraZoom=100,touchMode='buttons', campaign=false,tournamentMode=false, audio=null, ui={};
const diagnostics=createDebugDiagnostics({enabled:new URLSearchParams(location.search).get('debug')==='1'});
const stagePreview=new URLSearchParams(location.search).get('stagePreview')==='1';
canvas.dataset.debugMode=String(diagnostics.enabled);
canvas.dataset.stagePreview=String(stagePreview);
const teamById=id=>teams.find(t=>t.id===id)||teams[0];
const rosterDirectory=new Map();for(let teamIndex=0;teamIndex<teams.length;teamIndex++)for(let rosterIndex=0;rosterIndex<teams[teamIndex].roster.length;rosterIndex++)rosterDirectory.set(teams[teamIndex].roster[rosterIndex].id,{teamIndex,rosterIndex,athlete:teams[teamIndex].roster[rosterIndex]});
function syncLineup(teamSelect,lineupSelect,previousId=null){
  const roster=teamById(teamSelect.value).roster.slice(1),selected=lineupSelect.value||previousId;
  lineupSelect.replaceChildren();
  for(const athlete of roster){const option=document.createElement('option');option.value=athlete.id;option.textContent=`${athlete.name} · OVR ${athlete.ovr}`;lineupSelect.append(option)}
  lineupSelect.value=roster.some(p=>p.id===selected)?selected:roster[0]?.id??'';
}
for(const t of teams){const o=document.createElement('option');o.value=t.id;o.textContent=t.name;homeSelect.append(o);const a=o.cloneNode(true);awaySelect.append(a)}
const teamDialog=$('team-dialog'),teamGrid=$('team-grid'),teamDialogTitle=$('team-dialog-title');let pickingSide='home';
function drawCreatureCaptainCard(team,c,p,rig){
  const ink='#21171a',navy='#173654',gold='#d8ad49',cream='#f3e4c9';
  c.save();c.lineCap='round';c.lineJoin='round';
  if(rig==='quadruped-fox'){
    c.strokeStyle='#f0dfc7';c.lineWidth=5;c.beginPath();c.moveTo(27,41);c.quadraticCurveTo(10,36,12,19);c.stroke();
    c.strokeStyle='#c65b2d';c.lineWidth=3;c.beginPath();c.moveTo(12,19);c.quadraticCurveTo(11,13,16,12);c.stroke();
    c.fillStyle='#bd5129';c.beginPath();c.ellipse(42,40,19,9,-.12,0,Math.PI*2);c.fill();
    c.fillStyle=cream;c.beginPath();c.ellipse(45,43,10,4,0,0,Math.PI*2);c.fill();
    for(const [x,y] of [[30,42],[38,44],[51,43],[58,41]]){c.strokeStyle='#a74729';c.lineWidth=3;c.beginPath();c.moveTo(x,y);c.lineTo(x-1,y+6);c.stroke()}
    c.fillStyle='#c95a2d';c.beginPath();c.ellipse(58,31,10,8,-.2,0,Math.PI*2);c.fill();
    c.fillStyle='#bd5129';for(const side of [-1,1]){c.beginPath();c.moveTo(54+side*2,27);c.lineTo(51+side*4,9);c.lineTo(61+side*2,23);c.fill()}
    c.fillStyle=cream;c.beginPath();c.ellipse(65,34,6,3,0,0,Math.PI*2);c.fill();c.fillStyle=ink;c.fillRect(66,33,3,2);c.fillStyle='#fff3c5';c.fillRect(61,29,2,2);c.fillStyle=ink;c.fillRect(62,29,1,2);
    c.fillStyle='#eee4d3';c.beginPath();c.ellipse(31,34,5,10,-.2,0,Math.PI*2);c.fill();
  }else if(rig==='dragon'){
    c.fillStyle='#335f83';c.beginPath();c.moveTo(29,36);c.lineTo(17,12);c.lineTo(35,22);c.lineTo(41,34);c.fill();c.beginPath();c.moveTo(43,34);c.lineTo(57,9);c.lineTo(59,33);c.lineTo(49,38);c.fill();
    c.strokeStyle='#264e6e';c.lineWidth=4;c.beginPath();c.moveTo(31,40);c.quadraticCurveTo(17,51,10,43);c.lineTo(7,39);c.stroke();
    c.fillStyle=navy;c.beginPath();c.ellipse(40,39,19,9,0,0,Math.PI*2);c.fill();
    c.fillStyle='#e6c363';c.beginPath();c.moveTo(28,38);c.lineTo(49,38);c.lineTo(46,46);c.lineTo(31,46);c.fill();
    for(const [x,y] of [[28,42],[35,44],[47,42],[54,39]]){c.strokeStyle=navy;c.lineWidth=4;c.beginPath();c.moveTo(x,y);c.lineTo(x-1,y+6);c.stroke();c.fillStyle=gold;c.fillRect(x-2,y+4,3,2)}
    c.fillStyle=navy;c.beginPath();c.ellipse(58,29,11,7,-.12,0,Math.PI*2);c.fill();c.fillStyle='#204766';c.beginPath();c.moveTo(50,26);c.lineTo(47,17);c.lineTo(55,24);c.moveTo(59,24);c.lineTo(64,15);c.lineTo(63,26);c.fill();
    c.fillStyle='#f0c75a';c.fillRect(61,27,3,2);c.fillStyle=ink;c.fillRect(63,27,1,2);c.fillStyle='#e0bd64';c.beginPath();c.moveTo(65,31);c.lineTo(73,33);c.lineTo(64,35);c.fill();
    for(const [x,y] of [[34,34],[41,31],[48,34],[38,40],[47,40]]){c.fillStyle='#e5c05c';c.fillRect(x,y,2,2)}
  }else if(rig==='cobra'){
    c.strokeStyle='#12437b';c.lineWidth=8;c.beginPath();c.moveTo(35,50);c.bezierCurveTo(20,50,22,37,38,39);c.bezierCurveTo(59,42,60,52,44,52);c.stroke();
    c.fillStyle='#16437a';c.beginPath();c.moveTo(39,43);c.bezierCurveTo(24,29,27,12,42,9);c.bezierCurveTo(57,12,60,29,46,43);c.closePath();c.fill();
    c.strokeStyle='#2b8fc1';c.lineWidth=2;c.beginPath();c.moveTo(39,39);c.quadraticCurveTo(34,25,41,13);c.moveTo(46,39);c.quadraticCurveTo(52,25,44,13);c.stroke();
    c.fillStyle='#edcf4b';c.fillRect(37,20,4,3);c.fillRect(46,20,4,3);c.fillStyle=ink;c.fillRect(39,20,1,3);c.fillRect(48,20,1,3);
    c.fillStyle='#f4eee0';c.fillRect(38,27,12,3);c.fillStyle='#f4773e';c.fillRect(36,31,5,2);c.fillRect(48,31,5,2);
  }else if(rig==='wombat'){
    c.fillStyle='#81705c';c.beginPath();c.ellipse(42,40,20,12,0,0,Math.PI*2);c.fill();
    c.fillStyle='#8c7861';c.beginPath();c.ellipse(57,31,11,10,0,0,Math.PI*2);c.fill();
    c.fillStyle='#927f67';for(const x of [51,62]){c.beginPath();c.arc(x,23,5,0,Math.PI*2);c.fill();c.fillStyle='#524538';c.fillRect(x-1,22,2,2);c.fillStyle='#927f67'}
    c.fillStyle='#a68c71';c.beginPath();c.ellipse(63,34,7,5,0,0,Math.PI*2);c.fill();c.fillStyle='#302624';c.fillRect(65,32,3,3);c.fillRect(55,29,2,2);
    c.strokeStyle='#76644e';c.lineWidth=4;for(const x of [29,37,48,55]){c.beginPath();c.moveTo(x,47);c.lineTo(x,53);c.stroke()}
    c.fillStyle='#745a37';c.fillRect(15,29,8,18);c.strokeStyle='#d1a559';c.lineWidth=1.5;c.strokeRect(15,29,8,18);c.fillStyle='#ffc958';c.fillRect(17,32,4,10);c.fillStyle='#fff0b4';c.fillRect(17,33,2,6);
  }else if(rig==='jaguar'){
    c.fillStyle='#c79a4b';c.beginPath();c.ellipse(42,40,20,12,0,0,Math.PI*2);c.fill();
    c.strokeStyle='#b2833e';c.lineWidth=4;c.beginPath();c.moveTo(28,43);c.lineTo(26,53);c.moveTo(38,45);c.lineTo(38,53);c.moveTo(50,45);c.lineTo(51,53);c.moveTo(58,42);c.lineTo(61,52);c.stroke();
    c.fillStyle='#cf9e4e';c.beginPath();c.ellipse(57,29,13,10,0,0,Math.PI*2);c.fill();
    c.fillStyle='#c39549';for(const x of [49,64]){c.beginPath();c.moveTo(x-5,24);c.lineTo(x-4,12);c.lineTo(x+2,21);c.fill()}
    c.fillStyle='#f1e3c4';c.beginPath();c.moveTo(62,30);c.lineTo(74,34);c.lineTo(63,38);c.closePath();c.fill();c.fillStyle=ink;c.fillRect(71,33,3,2);c.fillRect(60,27,2,2);
    c.fillStyle='#3c2b20';for(const [x,y] of [[34,35],[39,40],[47,34],[51,43],[58,39],[43,30],[31,42],[54,30]]){c.beginPath();c.arc(x,y,1.5,0,Math.PI*2);c.fill()}
    c.fillStyle='#234985';c.fillRect(34,37,11,9);c.fillStyle='#fff';c.fillRect(38,37,2,9);c.fillRect(34,40,11,2);c.fillStyle='#d84949';c.fillRect(39,37,1,9);c.fillRect(34,41,11,1);
  }else if(rig==='orangutan-zebra'){
    c.fillStyle='#bd7141';c.beginPath();c.ellipse(41,39,17,11,0,0,Math.PI*2);c.fill();
    c.fillStyle='#c7804b';c.beginPath();c.ellipse(56,27,11,10,0,0,Math.PI*2);c.fill();
    c.fillStyle='#33271f';c.beginPath();c.ellipse(62,29,5,5,0,0,Math.PI*2);c.fill();c.fillStyle='#f1d6b0';c.fillRect(60,27,2,2);c.fillRect(64,28,2,2);
    c.strokeStyle=cream;c.lineWidth=2;for(let i=0;i<6;i++){const x=29+i*5;c.beginPath();c.moveTo(x,31+(i%2)*3);c.lineTo(x-4,47);c.stroke()}
    c.strokeStyle='#bd7141';c.lineWidth=6;c.beginPath();c.moveTo(35,37);c.lineTo(22,45);c.lineTo(18,58);c.moveTo(48,38);c.lineTo(62,45);c.lineTo(69,57);c.stroke();
    c.fillStyle='#bd7141';for(const [x,y] of [[18,58],[69,57]]){c.beginPath();c.arc(x,y,4,0,Math.PI*2);c.fill()}
    c.strokeStyle=cream;c.lineWidth=1.5;c.beginPath();c.moveTo(16,60);c.lineTo(19,63);c.moveTo(68,60);c.lineTo(71,63);c.stroke();
    c.fillStyle=team.colors[1];c.fillRect(32,37,16,7);
  }
  c.restore();
}
function drawCaptainCard(team,card){const portrait=card.querySelector('canvas'),c=portrait.getContext('2d'),p=team.roster[0],rig=p.rig;c.clearRect(0,0,84,64);if(p.id==='e-indigo'&&eIndigoPortrait.complete&&eIndigoPortrait.naturalWidth){c.imageSmoothingEnabled=false;c.fillStyle=team.colors[2];c.fillRect(0,0,84,64);const portraitHeight=57,portraitWidth=portraitHeight*eIndigoPortrait.naturalWidth/eIndigoPortrait.naturalHeight;c.drawImage(eIndigoPortrait,0,0,eIndigoPortrait.naturalWidth,eIndigoPortrait.naturalHeight,10+(64-portraitWidth)/2,0,portraitWidth,portraitHeight);c.fillStyle=team.colors[0];c.fillRect(0,57,84,7);c.strokeStyle=team.colors[1];c.lineWidth=2;c.strokeRect(1,1,82,62);portrait.dataset.artSource='canon-reviewed-generated-portrait';card.querySelector('b').textContent=p.name;card.querySelector('i').textContent=team.name;return}if(captainAtlas.complete&&captainAtlas.naturalWidth){const index=teams.indexOf(team),cellWidth=captainAtlas.naturalWidth/7,cellHeight=captainAtlas.naturalHeight/5;c.imageSmoothingEnabled=false;c.fillStyle=team.colors[2];c.fillRect(0,0,84,64);c.drawImage(captainAtlas,index%7*cellWidth,Math.floor(index/7)*cellHeight,cellWidth,cellHeight,10,0,64,64);c.fillStyle=team.colors[0];c.fillRect(0,57,84,7);c.strokeStyle=team.colors[1];c.lineWidth=2;c.strokeRect(1,1,82,62);portrait.dataset.artSource='generated-atlas';card.querySelector('b').textContent=p.name;card.querySelector('i').textContent=team.name;return}portrait.dataset.artSource='procedural-fallback';c.fillStyle=team.colors[2];c.fillRect(0,0,84,64);c.fillStyle=team.colors[0];c.fillRect(0,43,84,21);c.fillStyle=team.colors[1];c.fillRect(3,3,78,3);if(['quadruped-fox','dragon','cobra','wombat','jaguar','orangutan-zebra'].includes(rig)){drawCreatureCaptainCard(team,c,p,rig);card.querySelector('b').textContent=p.name;card.querySelector('i').textContent=team.name;return}c.fillStyle='#171321';c.beginPath();c.ellipse(42,34,14,18,0,0,Math.PI*2);c.fill();if(rig==='dragon'||rig==='winged-humanoid'){c.fillStyle=team.colors[0];c.beginPath();c.moveTo(28,25);c.lineTo(11,8);c.lineTo(16,32);c.lineTo(30,37);c.fill();c.beginPath();c.moveTo(56,25);c.lineTo(73,8);c.lineTo(68,32);c.lineTo(54,37);c.fill()}if(['quadruped-fox','jaguar','wombat','orangutan-zebra'].includes(rig)){c.fillStyle=rig==='quadruped-fox'?'#c35a2c':rig==='wombat'?'#93806a':rig==='jaguar'?'#c99b4d':'#bd7141';c.beginPath();c.ellipse(42,30,14,12,0,0,Math.PI*2);c.fill();for(const side of [-1,1]){c.beginPath();c.moveTo(42+side*7,24);c.lineTo(42+side*12,11);c.lineTo(42+side*2,18);c.fill()}if(rig==='orangutan-zebra'){c.strokeStyle='#f5ebd8';c.lineWidth=2;for(let i=-2;i<=2;i++){c.beginPath();c.moveTo(34+i*4,23);c.lineTo(31+i*4,37);c.stroke()}}if(rig==='jaguar'){c.fillStyle='#35251e';for(let i=0;i<7;i++){c.beginPath();c.arc(33+(i*11)%19,26+(i*7)%15,1.2,0,Math.PI*2);c.fill()}}}else if(rig==='cobra'){c.fillStyle='#15529a';c.beginPath();c.moveTo(30,37);c.quadraticCurveTo(18,15,42,9);c.quadraticCurveTo(66,15,54,37);c.closePath();c.fill();c.fillStyle='#f5d449';c.fillRect(36,25,3,2);c.fillRect(46,25,3,2)}else{c.fillStyle=p.features.includes('green-haired')?'#59a950':p.features.includes('copper hair')?'#b75f44':p.features.includes('ginger')?'#d36739':p.features.includes('red hair')?'#ca3c45':p.features.includes('silver-white')?'#dde2df':'#342834';c.beginPath();c.ellipse(42,20,14,8,0,0,Math.PI*2);c.fill();c.fillStyle=rig==='orc'?'#62a553':rig==='cosmic-humanoid'?'#448ec1':'#d4aa8d';c.beginPath();c.ellipse(42,30,11,13,0,0,Math.PI*2);c.fill();if(rig==='blank-screen-android'){c.fillStyle='#050508';c.fillRect(34,23,16,15);c.fillStyle='#f0deb8';c.fillRect(32,20,20,2);c.fillStyle='#302a2c';c.fillRect(35,14,14,6)}else{c.fillStyle='#191523';c.fillRect(37,29,2,1);c.fillRect(46,29,2,1);if(p.features.includes('glasses')){c.strokeStyle='#56a6db';c.lineWidth=1;c.strokeRect(34,26,8,6);c.strokeRect(43,26,8,6);c.beginPath();c.moveTo(42,28);c.lineTo(43,28);c.stroke()}if(p.features.includes('twin ponytails')){c.fillStyle='#10111a';c.fillRect(25,17,7,22);c.fillRect(52,17,7,22)}}}c.fillStyle=team.colors[0];c.beginPath();c.moveTo(24,62);c.lineTo(29,43);c.lineTo(55,43);c.lineTo(60,62);c.fill();c.fillStyle=team.colors[1];c.fillRect(28,49,28,3);card.querySelector('b').textContent=p.name;card.querySelector('i').textContent=team.name;}
function drawPortraitSignature(team,card){
  const p=team.roster[0],rig=p.rig,f=p.features,c=card.querySelector('canvas').getContext('2d');
  if(['quadruped-fox','dragon','cobra','wombat','jaguar','orangutan-zebra'].includes(rig))return;
  c.save();
  if(f.includes('driftwood crest')){c.strokeStyle='#765638';c.lineWidth=2;c.lineCap='round';c.beginPath();c.moveTo(32,23);c.quadraticCurveTo(21,17,20,14);c.quadraticCurveTo(18,12,15,13);c.moveTo(52,23);c.quadraticCurveTo(63,17,64,14);c.quadraticCurveTo(66,12,69,13);c.stroke();c.fillStyle='#f2b8c9';for(const [x,y] of [[19,14],[65,14],[23,17],[61,17]]){c.beginPath();c.arc(x,y,1.5,0,Math.PI*2);c.fill()}}
  if(f.includes('tall ornate purple witch hat')){c.fillStyle='#542c91';c.beginPath();c.moveTo(29,17);c.lineTo(36,3);c.lineTo(48,2);c.lineTo(55,17);c.closePath();c.fill();c.fillStyle='#d4c4e8';c.fillRect(27,16,31,3);c.fillRect(34,8,2,2);c.fillRect(46,5,2,2)}
  if(rig==='horned-giant'||rig==='horned-human'||f.includes('curved horns')){c.fillStyle='#1e1b20';c.beginPath();c.moveTo(34,19);c.quadraticCurveTo(22,17,23,7);c.quadraticCurveTo(30,14,38,16);c.moveTo(49,19);c.quadraticCurveTo(61,17,60,7);c.quadraticCurveTo(53,14,45,16);c.fill()}
  if(rig==='elf'||f.includes('pointed ears')){c.fillStyle='#d6aa8e';c.beginPath();c.moveTo(31,25);c.lineTo(23,21);c.lineTo(30,29);c.moveTo(53,25);c.lineTo(61,21);c.lineTo(54,29);c.fill()}
  if(f.includes('small blue antlers')){c.strokeStyle='#8ccfe0';c.lineWidth=2;c.beginPath();c.moveTo(37,14);c.lineTo(35,8);c.lineTo(31,5);c.moveTo(35,8);c.lineTo(39,5);c.moveTo(47,14);c.lineTo(49,8);c.lineTo(53,5);c.moveTo(49,8);c.lineTo(45,5);c.stroke()}
  if(f.includes('feline ears')||f.includes('wolf-eared hood')){const color=f.includes('wolf-eared hood')?'#167445':'#d6aa8e';c.fillStyle=color;c.beginPath();c.moveTo(32,21);c.lineTo(27,8);c.lineTo(39,18);c.moveTo(46,18);c.lineTo(58,8);c.lineTo(53,22);c.fill()}
  if(f.includes('beard')||f.includes('dark beard')){c.fillStyle=f.includes('gray-streaked')?'#6f6968':f.includes('dark beard')?'#251f22':'#51443f';c.beginPath();c.moveTo(34,32);c.lineTo(51,32);c.lineTo(48,39);c.lineTo(42,43);c.lineTo(36,39);c.closePath();c.fill();c.fillStyle='#e2e1d9';c.fillRect(37,36,2,1);c.fillRect(45,39,2,1)}
  if(f.includes('mustache')){c.strokeStyle='#45342f';c.lineWidth=2;c.beginPath();c.moveTo(38,32);c.quadraticCurveTo(41,34,43,32);c.quadraticCurveTo(46,34,49,32);c.stroke()}
  if(f.includes('glasses')){const color=f.includes('red round')?'#cf3948':f.includes('purple wire')?'#9b73c7':f.includes('bright-blue')?'#318fea':'#4b9ee0';c.strokeStyle=color;c.lineWidth=1.5;if(f.includes('round')){c.beginPath();c.arc(37,28,4,0,Math.PI*2);c.arc(47,28,4,0,Math.PI*2);c.stroke()}else{c.strokeRect(32,24,9,7);c.strokeRect(43,24,9,7);c.beginPath();c.moveTo(41,27);c.lineTo(43,27);c.stroke()}}
  if(f.includes('crimson flowers')){c.fillStyle='#be3947';for(const [x,y] of [[52,15],[57,17],[48,18]]){c.beginPath();c.arc(x,y,2,0,Math.PI*2);c.fill()}c.fillStyle='#547b4b';c.fillRect(54,12,1,5)}
  if(f.includes('fish hairpin')){c.fillStyle='#54d8ee';c.beginPath();c.ellipse(51,18,4,2,0,0,Math.PI*2);c.fill();c.beginPath();c.moveTo(54,18);c.lineTo(58,15);c.lineTo(58,21);c.fill()}
  if(f.includes('vivid blue hair')){c.fillStyle='#367fe2';c.beginPath();c.ellipse(42,18,15,8,0,Math.PI,Math.PI*2);c.fill();c.fillRect(28,17,4,8)}
  if(f.includes('teal hair')){c.fillStyle='#39c4b0';c.beginPath();c.ellipse(42,18,15,8,0,Math.PI,Math.PI*2);c.fill();c.fillRect(28,17,4,9)}
  if(f.includes('black-white hair')){c.fillStyle='#16151b';c.fillRect(28,13,14,7);c.fillStyle='#f1eee7';c.fillRect(42,13,14,7)}
  if(f.includes('silver-white hair')){c.fillStyle='#e0e3e6';c.beginPath();c.ellipse(42,17,15,8,0,Math.PI,Math.PI*2);c.fill();c.fillRect(28,16,4,8)}
  if(f.includes('blonde hair')){c.fillStyle='#d7c26d';c.beginPath();c.ellipse(42,18,15,8,0,Math.PI,Math.PI*2);c.fill()}
  if(f.includes('masked metal deity')){c.fillStyle='#b6b9b8';c.beginPath();c.moveTo(34,25);c.lineTo(50,25);c.lineTo(48,33);c.lineTo(42,36);c.lineTo(36,33);c.closePath();c.fill();c.fillStyle='#f7a94f';c.fillRect(37,28,3,2);c.fillRect(45,28,3,2);c.strokeStyle='#e5ba56';c.lineWidth=1;c.beginPath();c.moveTo(35,25);c.lineTo(33,21);c.moveTo(49,25);c.lineTo(51,21);c.stroke()}
  if(f.includes('mismatched sclera')){c.fillStyle='#10101a';c.fillRect(36,27,4,2);c.fillStyle='#fff';c.fillRect(45,27,4,2);c.fillStyle='#44dfeb';c.fillRect(38,27,1,2);c.fillRect(46,27,1,2)}
  if(f.includes('tilted face ring')){c.strokeStyle='#19171c';c.lineWidth=2;c.beginPath();c.ellipse(43,34,14,5,-.45,0,Math.PI*2);c.stroke()}
  if(f.includes('broad Cheshire grin')){c.fillStyle='#fff3d3';c.beginPath();c.ellipse(42,34,9,4,0,0,Math.PI*2);c.fill();c.fillStyle='#d84e64';c.fillRect(35,34,14,2);c.strokeStyle='#29202b';c.lineWidth=.7;c.beginPath();c.moveTo(36,34);c.lineTo(48,34);c.moveTo(39,32);c.lineTo(39,37);c.moveTo(43,32);c.lineTo(43,37);c.moveTo(47,33);c.lineTo(47,36);c.stroke()}
  if(f.includes('gold fracture lines')){c.strokeStyle='#e3bf57';c.lineWidth=1;c.beginPath();c.moveTo(37,23);c.lineTo(40,27);c.lineTo(38,31);c.lineTo(42,34);c.moveTo(47,22);c.lineTo(45,27);c.lineTo(49,30);c.stroke()}
  if(f.includes('fleur detail')){c.fillStyle='#ddd4e6';c.font='bold 8px serif';c.fillText('⚜',54,19)}
  if(f.includes('golden heart')){c.fillStyle='#ffd45a';c.font='bold 10px serif';c.fillText('♥',40,57)}
  if(f.includes('cyan-magenta cheek nodes')){c.fillStyle='#24dff2';c.fillRect(31,30,2,2);c.fillStyle='#e348d5';c.fillRect(51,30,2,2);c.strokeStyle='#161622';c.lineWidth=2;c.beginPath();c.arc(42,19,17,Math.PI,0);c.stroke();c.fillStyle='#35d7f1';c.fillRect(25,17,4,8);c.fillStyle='#e348d5';c.fillRect(55,17,4,8)}
  if(f.includes('signature guitar')){c.strokeStyle='#ead69c';c.lineWidth=2;c.beginPath();c.moveTo(58,39);c.lineTo(67,20);c.stroke();c.fillStyle='#ce7b35';c.beginPath();c.arc(57,41,4,0,Math.PI*2);c.fill();c.beginPath();c.arc(61,38,3,0,Math.PI*2);c.fill();c.fillStyle='#f3dfa2';c.fillRect(64,17,7,3)}
  if(f.includes('facial rune')){c.fillStyle='#e6c65b';c.fillRect(34,30,2,3);c.fillRect(49,28,2,3);c.fillRect(40,34,3,1)}
  c.restore();
}
function drawTeamCrest(team,canvas){const c=canvas.getContext('2d'),index=teams.indexOf(team);c.clearRect(0,0,32,32);if(teamCrestAtlas.complete&&teamCrestAtlas.naturalWidth){let col,row;if(index<7){col=index;row=0}else if(index<15){col=index-7;row=1}else if(index<23){col=index-15;row=2}else if(index<31){col=index-23;row=3}else{col=index-31;row=4}const cellWidth=teamCrestAtlas.naturalWidth/8,cellHeight=teamCrestAtlas.naturalHeight/5;c.imageSmoothingEnabled=false;c.drawImage(teamCrestAtlas,col*cellWidth,row*cellHeight,cellWidth,cellHeight,0,0,32,32);canvas.dataset.artSource='generated-atlas';return}c.fillStyle=team.colors[2];c.fillRect(1,1,30,30);c.strokeStyle=team.colors[1];c.lineWidth=2;c.strokeRect(1,1,30,30);c.fillStyle=team.colors[1];c.font='bold 18px monospace';c.textAlign='center';c.fillText(team.mascot[0],16,23);c.textAlign='left';canvas.dataset.artSource='procedural-fallback'}
function updateTeamCards(){const home=teamById(homeSelect.value),away=teamById(awaySelect.value);drawCaptainCard(home,$('choose-home'));drawPortraitSignature(home,$('choose-home'));drawCaptainCard(away,$('choose-away'));drawPortraitSignature(away,$('choose-away'));}
  for(const t of teams){const button=document.createElement('button');button.type='button';button.className='team-choice';button.dataset.teamId=t.id;const portrait=document.createElement('canvas');portrait.width=84;portrait.height=64;portrait.className='captain-portrait';const crest=document.createElement('canvas');crest.width=32;crest.height=32;crest.className='team-crest';const art=document.createElement('span');art.className='team-choice-art';art.append(portrait,crest);const name=document.createElement('b'),franchise=document.createElement('i'),roster=document.createElement('small');roster.className='roster-summary';roster.textContent=t.roster.map((athlete,index)=>`${index===0?'CAP':'P'+index} #${athlete.number} ${athlete.name} · ${athlete.ovr}`).join('\n');button.title=t.roster.map(athlete=>`#${athlete.number} ${athlete.name} · OVR ${athlete.ovr} · ${Object.entries(athlete.stats).map(([rating,value])=>`${rating==='three'?'3PT':rating.toUpperCase()} ${value}`).join(' / ')}`).join('\n');button.append(art,name,franchise,roster);drawCaptainCard(t,button);drawPortraitSignature(t,button);drawTeamCrest(t,crest);button.addEventListener('click',()=>{const select=pickingSide==='home'?homeSelect:awaySelect;select.value=t.id;syncLineup(select,pickingSide==='home'?homeLineup:awayLineup);save();updateTeamCards();teamDialog.close();});teamGrid.append(button)}
function redrawTeamCrests(){for(const team of teams){const card=teamGrid.querySelector(`[data-team-id=\"${team.id}\"]`);drawTeamCrest(team,card.querySelector('.team-crest'))}}
teamCrestAtlas.addEventListener('load',redrawTeamCrests);if(teamCrestAtlas.complete&&teamCrestAtlas.naturalWidth)redrawTeamCrests();
for(const [side,button] of [['home',$('choose-home')],['away',$('choose-away')]])button.addEventListener('click',()=>{pickingSide=side;teamDialogTitle.textContent=`CHOOSE ${side.toUpperCase()} FRANCHISE`;teamDialog.showModal()});
const saved=loadPreferences(safeStore,teams,createSeason,seasonLength,validTournament);
let gamepadButtons=normalizeGamepadButtons(saved.gamepadButtons);
saved.season=typeof saved.season==='object'&&saved.season?saved.season:createSeason(homeSelect.value||teams[0].id);
function refreshTeamRecords(){for(const t of teams){const button=teamGrid.querySelector(`[data-team-id="${t.id}"]`),record=saved.leagueRecords[t.id];if(button){button.querySelector('i').textContent=`${t.name} · ${record.wins}-${record.losses}`;button.querySelector('i').title=`${record.wins} wins, ${record.losses} losses`;}}}
homeSelect.value=teams.some(t=>t.id===saved.home)?saved.home:teams[0].id;awaySelect.value=teams.some(t=>t.id===saved.away)?saved.away:teams[26].id;
syncLineup(homeSelect,homeLineup,saved.homePartnerId);syncLineup(awaySelect,awayLineup,saved.awayPartnerId);
updateTeamCards();
refreshTeamRecords();
function redrawCaptainAtlasCards(){for(const team of teams){const card=teamGrid.querySelector(`[data-team-id="${team.id}"]`);drawCaptainCard(team,card);drawPortraitSignature(team,card)}updateTeamCards();refreshTeamRecords();}
captainAtlas.addEventListener('load',redrawCaptainAtlasCards);eIndigoPortrait.addEventListener('load',redrawCaptainAtlasCards);if(captainAtlas.complete&&captainAtlas.naturalWidth)redrawCaptainAtlasCards();
musicVolume=saved.musicVolume;effectsVolume=saved.effectsVolume;screenShake=saved.screenShake!==false;reducedFlash=Boolean(saved.reducedFlash);audioCaptions=saved.audioCaptions!==false;teamMarkers=Boolean(saved.teamMarkers);textSize=Math.max(90,Math.min(120,Number(saved.textSize)||100));cameraZoom=Math.max(85,Math.min(120,Number(saved.cameraZoom)||100));touchMode=saved.touchMode==='joystick'?'joystick':'buttons';document.documentElement.style.setProperty('--ui-zoom',String(textSize/100));$('music-volume').value=Math.round(musicVolume*100);$('music-volume-value').textContent=`${Math.round(musicVolume*100)}%`;$('effects-volume').value=Math.round(effectsVolume*100);$('effects-volume-value').textContent=`${Math.round(effectsVolume*100)}%`;$('screen-shake').checked=screenShake;$('reduced-flash').checked=reducedFlash;$('audio-captions').checked=audioCaptions;$('team-markers').checked=teamMarkers;$('text-size').value=textSize;$('text-size-value').textContent=`${textSize}%`;$('camera-zoom').value=cameraZoom;$('camera-zoom-value').textContent=`${cameraZoom}%`;$('touch-mode').value=touchMode;document.querySelector('.touch-controls').dataset.moveMode=touchMode;
 $('difficulty').value=saved.difficulty||'Pro'; $('quarter').value=String(saved.quarter||180);$('two-players').checked=Boolean(saved.twoPlayers);$('same-team').checked=Boolean(saved.sameTeam);$('same-team').disabled=!$('two-players').checked;
function save(){safeStore.set(preferenceStorageKey,{schemaVersion:5,home:homeSelect.value,away:awaySelect.value,homePartnerId:homeLineup.value,awayPartnerId:awayLineup.value,musicVolume,effectsVolume,screenShake,reducedFlash,audioCaptions,teamMarkers,textSize,cameraZoom,touchMode,controls:keysByPlayer,gamepadButtons,season:saved.season,tournament:saved.tournament,leagueRecords:saved.leagueRecords,careerRecords:saved.careerRecords,difficulty:$('difficulty').value,quarter:Number($('quarter').value),twoPlayers:$('two-players').checked,sameTeam:$('same-team').checked});}
const gamepadBindings=$('gamepad-bindings'),gamepadActionLabels={shoot:'SHOOT / BLOCK',pass:'PASS / STEAL',turbo:'TURBO',pause:'PAUSE / START'};
for(const [action,label] of Object.entries(gamepadActionLabels)){
 const field=document.createElement('label');field.className='gamepad-option';field.textContent=label;
 const select=document.createElement('select');select.id=`gamepad-${action}`;select.setAttribute('aria-label',`${label} gamepad button`);
 gamepadButtonLabels.forEach((buttonLabel,index)=>{const option=document.createElement('option');option.value=String(index);option.textContent=`${index} · ${buttonLabel}`;select.append(option)});
 select.value=String(gamepadButtons[action]);select.addEventListener('change',()=>{gamepadButtons=normalizeGamepadButtons({...gamepadButtons,[action]:Number(select.value)});save()});field.append(select);gamepadBindings.append(field);
}
function refreshGamepadBindings(){for(const [action] of Object.entries(gamepadActionLabels))$(`gamepad-${action}`).value=String(gamepadButtons[action]);}
$('reset-gamepad-bindings').addEventListener('click',()=>{gamepadButtons=normalizeGamepadButtons(null);refreshGamepadBindings();save()});
function ensureAudio(){audio??=new AudioContext();if(audio.state==='suspended'&&!ui.audioPaused)audio.resume().catch(()=>{});return audio}
function tone(freq=440,duration=.08,type='square',gain=.07){try{const ac=ensureAudio(),osc=ac.createOscillator(),amp=ac.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,ac.currentTime);osc.frequency.exponentialRampToValueAtTime(Math.max(50,freq*.66),ac.currentTime+duration);amp.gain.setValueAtTime(Math.max(.001,gain*effectsVolume),ac.currentTime);amp.gain.exponentialRampToValueAtTime(.001,ac.currentTime+duration);osc.connect(amp);amp.connect(ac.destination);osc.start();osc.stop(ac.currentTime+duration)}catch{}}
function musicVoice(freq,time,duration,type,gain){const osc=audio.createOscillator(),amp=audio.createGain();osc.type=type;osc.frequency.setValueAtTime(freq,time);if(type==='sine')osc.frequency.exponentialRampToValueAtTime(42,time+duration);amp.gain.setValueAtTime(Math.max(.0001,gain*musicVolume),time);amp.gain.exponentialRampToValueAtTime(.0001,time+duration);osc.connect(amp);amp.connect(audio.destination);osc.start(time);osc.stop(time+duration)}
function scheduleArcadeMusic(){if(!audio||audio.state!=='running')return;const horizon=audio.currentTime+.16,stepSeconds=60/112/4;while(ui.musicNext<horizon){const note=musicStep(ui.musicStep++%16),at=ui.musicNext;musicVoice(note.bassHz,at,.13,'triangle',.055);if(note.leadHz)musicVoice(note.leadHz,at,.105,'square',.026);if(note.kick)musicVoice(112,at,.16,'sine',.12);if(note.snare)musicVoice(186,at,.095,'square',.055);ui.musicNext+=stepSeconds}}
function startArcadeMusic(){try{ensureAudio();if(ui.musicTimer)return;ui.musicStep=0;ui.musicNext=audio.currentTime+.04;scheduleArcadeMusic();ui.musicTimer=setInterval(scheduleArcadeMusic,25)}catch{}}
function stopArcadeMusic(){if(ui.musicTimer){clearInterval(ui.musicTimer);ui.musicTimer=null}}
function pauseArcadeAudio(paused){if(!audio)return;if(paused&&!ui.audioPaused){ui.audioPaused=true;audio.suspend().catch(()=>{})}else if(!paused&&ui.audioPaused){ui.audioPaused=false;audio.resume().catch(()=>{})}}
function beginMatch(options={}){if(homeSelect.value===awaySelect.value){eventText('Choose two different franchises for this matchup.');awaySelect.focus();return;}save();practice=Boolean(options.practice);campaign=Boolean(options.campaign);tournamentMode=Boolean(options.tournament);const home=teamById(homeSelect.value),away=teamById(awaySelect.value);match=createMatch({quarterSeconds:Number($('quarter').value),seed:Date.now()&0xffffffff,home,away,homePartnerId:homeLineup.value,awayPartnerId:awayLineup.value,difficulty:$('difficulty').value});match.teamNames=[home.name,away.name];loadProductionSprites([...home.roster,...away.roster]);match.practice=practice;if(practice)match.clock=9999;keyboardPlayers=[match.players[0].id];if($('two-players').checked)keyboardPlayers.push(match.players[$('same-team').checked?1:2].id);controlled=[...keyboardPlayers];ui.gamepadIds=new Map();ui.gpPending=new Map();ui.gamepadOnly=false;mode='game';screenStart.classList.add('hidden');screenGame.classList.remove('hidden');document.querySelector('.touch-controls').classList.toggle('practice-mode',practice);$('game').focus();refreshControlHints();if(practice)$('game-controls-hint').textContent+=' · R RESET BALL';last=0;accumulator=0;cancelAnimationFrame(raf);raf=requestAnimationFrame(frame);startArcadeMusic();tone(620,.13,'square',.1);}
$('play').addEventListener('click',()=>beginMatch());$('practice').addEventListener('click',()=>beginMatch({practice:true}));
$('settings').addEventListener('click',()=>$('settings-dialog').showModal());$('campaign').addEventListener('click',()=>showCampaign());
$('reset-progress').addEventListener('click',()=>{if(!window.confirm('Reset the saved season, cup bracket, team standings, and player career records on this device? Settings and controls will stay saved.'))return;saved.season=createSeason(homeSelect.value);saved.tournament=null;saved.leagueRecords=createLeagueTable(teams);saved.careerRecords=createCareerRecords(teams);refreshTeamRecords();save();eventText('Saved records reset.');});
$('standings').addEventListener('click',()=>{const list=$('standings-list');list.replaceChildren();rankLeague(saved.leagueRecords,teams).forEach((row,index)=>{const item=document.createElement('li'),diff=row.pointDifferential>0?`+${row.pointDifferential}`:String(row.pointDifferential);item.textContent=`${String(index+1).padStart(2,'0')}  ${row.teamName}  ${row.wins}-${row.losses}  PF ${row.pointsFor}  PA ${row.pointsAgainst}  ${diff}`;list.append(item)});$('standings-dialog').showModal()});
$('careers').addEventListener('click',()=>{const list=$('career-list');list.replaceChildren();const leaders=rankCareerLeaders(saved.careerRecords,teams);if(!leaders.length){const empty=document.createElement('li');empty.className='career-empty';empty.textContent='No completed games yet. Play a full game to start the records.';list.append(empty)}else leaders.forEach((row,index)=>{const item=document.createElement('li');item.className='career-leader';const heading=document.createElement('div');heading.className='career-heading';const rank=document.createElement('span');rank.className='career-rank';rank.textContent=String(index+1).padStart(2,'0');const name=document.createElement('strong');name.className='career-name';name.textContent=row.name;const team=document.createElement('span');team.className='career-team';team.textContent=row.team;heading.append(rank,name,team);const stats=document.createElement('div');stats.className='career-stats';[['PTS',row.points],['DUNK',row.dunks],['AST',row.assists],['REB',row.rebounds],['GP',row.games]].forEach(([label,value])=>{const stat=document.createElement('span');stat.className='career-stat';const amount=document.createElement('b');amount.textContent=String(value);const caption=document.createElement('small');caption.textContent=label;stat.append(amount,caption);stats.append(stat)});item.append(heading,stats);list.append(item)});$('career-dialog').showModal()});
function returnToTeamSelect(){cancelAnimationFrame(raf);stopArcadeMusic();mode='menu';screenGame.classList.add('hidden');screenStart.classList.remove('hidden');save();}
function closeQuitPrompt(){const dialog=$('quit-dialog');if(dialog.open)dialog.close();if(match){match.pause=false;pauseArcadeAudio(false);$('game').focus();}}
$('back-menu').addEventListener('click',()=>{if(match&&match.phase!=='final'){$('quit-dialog').showModal();match.pause=true;pauseArcadeAudio(true);return;}returnToTeamSelect();});
$('cancel-quit').addEventListener('click',closeQuitPrompt);$('confirm-quit').addEventListener('click',()=>{closeQuitPrompt();returnToTeamSelect();});$('quit-dialog').addEventListener('cancel',e=>{e.preventDefault();closeQuitPrompt()});
 $('music-volume').addEventListener('input',e=>{$('music-volume-value').textContent=`${e.target.value}%`;musicVolume=e.target.value/100;save()});$('effects-volume').addEventListener('input',e=>{$('effects-volume-value').textContent=`${e.target.value}%`;effectsVolume=e.target.value/100;save()});$('screen-shake').addEventListener('change',e=>{screenShake=e.target.checked;save()});$('reduced-flash').addEventListener('change',e=>{reducedFlash=e.target.checked;save()});$('audio-captions').addEventListener('change',e=>{audioCaptions=e.target.checked;if(!audioCaptions)eventText('');save()});$('team-markers').addEventListener('change',e=>{teamMarkers=e.target.checked;save()});$('text-size').addEventListener('input',e=>{textSize=Number(e.target.value);$('text-size-value').textContent=`${textSize}%`;document.documentElement.style.setProperty('--ui-zoom',String(textSize/100));save()});$('camera-zoom').addEventListener('input',e=>{cameraZoom=Number(e.target.value);$('camera-zoom-value').textContent=`${cameraZoom}%`;save()});$('touch-mode').addEventListener('change',e=>{touchMode=e.target.value;document.querySelector('.touch-controls').dataset.moveMode=touchMode;save()});$('settings-dialog').querySelector('form').addEventListener('submit',save);
homeSelect.addEventListener('change',()=>{syncLineup(homeSelect,homeLineup);updateTeamCards();save()});awaySelect.addEventListener('change',()=>{syncLineup(awaySelect,awayLineup);updateTeamCards();save()});homeLineup.addEventListener('change',save);awayLineup.addEventListener('change',save);$('quarter').addEventListener('change',save);$('two-players').addEventListener('change',()=>{$('same-team').disabled=!$('two-players').checked;if(!$('two-players').checked)$('same-team').checked=false;save()});$('same-team').addEventListener('change',save);
function showCampaign(){
  if(!saved.season||saved.season.teamId!==homeSelect.value)saved.season=createSeason(homeSelect.value);
  const ladder=$('ladder'),season=saved.season;ladder.replaceChildren();
  for(let i=0;i<seasonLength;i++){
    const opponent=teams.filter(t=>t.id!==season.teamId)[(i*7)%34];
    const li=document.createElement('li');li.textContent=`${i<season.round?(i<season.wins?'✓ ':'✕ '):i===season.round?'▶ ':'◆ '}${opponent.name}`;ladder.append(li);
  }
  const next=seasonOpponent(season,teams);
  $('campaign-play').textContent=season.complete?'START NEW RUN':`PLAY ${next?.name??'NEXT GAME'}`;
  $('campaign-dialog').showModal();
}
$('campaign-play').addEventListener('click',()=>{
  if(!saved.season||saved.season.teamId!==homeSelect.value||saved.season.complete)saved.season=createSeason(homeSelect.value);
  const opponent=seasonOpponent(saved.season,teams);
  if(!opponent){saved.season=createSeason(homeSelect.value);return showCampaign();}
  awaySelect.value=opponent.id;syncLineup(awaySelect,awayLineup);save();$('campaign-dialog').close();beginMatch({campaign:true});
});
function showTournament(){
  const dialog=$('tournament-dialog');
  if(!saved.tournament||saved.tournament.teamId!==homeSelect.value)saved.tournament=createTournament(homeSelect.value,teams,(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
  const cup=saved.tournament,list=$('cup-bracket');list.replaceChildren();
  for(let round=0;round<3;round++){
    const status=round<cup.round?(cup.results[round]==='win'?'✓ WIN':'✕ OUT'):round===cup.round&&!cup.complete?'▶ NEXT':'◆';
    const item=document.createElement('li');item.textContent=`${status} · ${['QUARTERFINAL','SEMIFINAL','CHAMPIONSHIP'][round]} · ${teamById(cup.opponents[round]).name}`;list.append(item);
  }
  if(cup.champion){const item=document.createElement('li');item.textContent='★ JAMVERSE ’96 CUP CHAMPIONS ★';list.append(item)}
  else if(cup.complete){const item=document.createElement('li');item.textContent='ELIMINATED · START A NEW BRACKET TO TRY AGAIN';list.append(item)}
  $('cup-play').textContent=cup.complete?'START NEW CUP':`PLAY ${['QUARTERFINAL','SEMIFINAL','CHAMPIONSHIP'][cup.round]}`;
  save();dialog.showModal();
}
$('tournament').addEventListener('click',showTournament);
$('cup-play').addEventListener('click',event=>{
  event.preventDefault();
  if(!saved.tournament||saved.tournament.teamId!==homeSelect.value||saved.tournament.complete)saved.tournament=createTournament(homeSelect.value,teams,(Date.now()^Math.floor(Math.random()*0xffffffff))>>>0);
  const opponent=teams.find(team=>team.id===saved.tournament.opponents[saved.tournament.round]);
  if(!opponent){saved.tournament=null;return showTournament()}
  awaySelect.value=opponent.id;syncLineup(awaySelect,awayLineup);save();$('tournament-dialog').close();beginMatch({tournament:true});
});
const keyDefaults=[{up:'w',down:'s',left:'a',right:'d',shoot:'j',pass:'k',turbo:'l'},{up:'arrowup',down:'arrowdown',left:'arrowleft',right:'arrowright',shoot:'1',pass:'2',turbo:'3'}],keyActions=[['up','Move up'],['down','Move down'],['left','Move left'],['right','Move right'],['shoot','Shoot / block'],['pass','Pass / steal'],['turbo','Turbo']];
const savedControls=Array.isArray(saved.controls)?saved.controls:[],savedKeys=savedControls.flatMap(m=>keyActions.map(([action])=>m?.[action])),validSavedControls=savedControls.length===2&&savedControls.every(m=>keyActions.every(([action])=>typeof m?.[action]==='string'&&m[action].length>0))&&new Set(savedKeys).size===14;
let keysByPlayer=validSavedControls?savedControls.map(m=>({...m})):keyDefaults.map(m=>({...m}));const keys=new Set(),pressed=new Set();let bindingCapture=null;
function keyLabel(key){return key===' '?'SPACE':key.startsWith('arrow')?key.slice(5).toUpperCase():key.toUpperCase()}
function refreshControlHints(){const make=(node,parts)=>{node.replaceChildren();for(const part of parts){if(Array.isArray(part)){const k=document.createElement('kbd');k.textContent=part.join(' ');node.append(k)}else node.append(document.createTextNode(part))}};const m=keysByPlayer[0],move=[m.up,m.left,m.down,m.right].map(keyLabel).join(' ');make($('controls-hint'),[[move],' move ',[keyLabel(m.shoot)],' shoot/block · hold/release to charge ',[keyLabel(m.pass)],' pass/steal ',[keyLabel(m.turbo)],' turbo ',[`${keyLabel(m.turbo)}+${keyLabel(m.pass)}`],' check / alley-oop ',['ENTER'],' pause']);$('game-controls-hint').textContent=`${move} MOVE · HOLD ${keyLabel(m.shoot)} / RELEASE TO CHARGE · ${keyLabel(m.pass)} PASS/STEAL · ${keyLabel(m.turbo)} TURBO · ${keyLabel(m.turbo)}+${keyLabel(m.pass)} CHECK / OOP · ENTER PAUSE`;}
const bindingGrid=$('key-bindings');function refreshBindingButtons(){for(const button of bindingGrid.querySelectorAll('button')){const m=keysByPlayer[Number(button.dataset.player)];button.textContent=`P${Number(button.dataset.player)+1} · ${button.dataset.label}  [${keyLabel(m[button.dataset.action])}]`}}
for(let player=0;player<2;player++)for(const [action,label] of keyActions){const button=document.createElement('button');button.type='button';button.dataset.player=String(player);button.dataset.action=action;button.dataset.label=label;button.addEventListener('click',()=>{bindingCapture={player,action,button};button.textContent=`P${player+1} · ${label}  [PRESS A KEY]`;eventText(`Rebinding P${player+1} ${label}. Press an unused key, or Escape to cancel.`)});bindingGrid.append(button)}
refreshBindingButtons();refreshControlHints();
$('settings-dialog').addEventListener('close',()=>{if(!bindingCapture)return;bindingCapture=null;refreshBindingButtons();eventText('Keyboard rebinding cancelled.');});
window.addEventListener('keydown',e=>{if(e.key==='F3'){e.preventDefault();setDebugEnabled(diagnostics,!diagnostics.enabled);canvas.dataset.debugMode=String(diagnostics.enabled);}});
window.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(bindingCapture){e.preventDefault();if(k==='escape'){bindingCapture=null;refreshBindingButtons();eventText('Keyboard rebinding cancelled.');return;}const conflict=keysByPlayer.some((m,player)=>keyActions.some(([action])=>m[action]===k&&!(player===bindingCapture.player&&action===bindingCapture.action)));if(conflict||k==='enter'){eventText(conflict?'That key is already assigned. Choose another key.':'Enter keeps its pause role. Choose another key.');return;}keysByPlayer[bindingCapture.player][bindingCapture.action]=k;bindingCapture=null;save();refreshBindingButtons();refreshControlHints();eventText('Keyboard binding saved.');return;}if(['arrowup','arrowdown','arrowleft','arrowright',' '].includes(k))e.preventDefault();if(!keys.has(k))pressed.add(k);keys.add(k);if(mode==='game'&&practice&&k==='r')resetPracticeBall(match,controlled[0]||match.players[0].id);if(mode==='game'&&match?.phase==='break'&&(k==='p'||k==='o'))substitutePlayer(match,k==='p'?0:1);if((k==='enter'||k==='escape')&&mode==='game'&&match&&!['final'].includes(match.phase)){match.pause=!match.pause;if(match.pause)eventText('PAUSED — ENTER TO RESUME');}});
window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));window.addEventListener('blur',()=>{keys.clear();pressed.clear();if(mode==='game'&&match&&match.phase!=='final')match.pause=true;});
for(const button of document.querySelectorAll('[data-touch]')){let heldKey=null;const release=()=>{if(heldKey){keys.delete(heldKey);heldKey=null;}button.classList.remove('is-held')};button.addEventListener('pointerdown',e=>{if(mode!=='game')return;e.preventDefault();const action=button.dataset.touch;if(action==='reset'){if(practice)resetPracticeBall(match,controlled[0]||match.players[0].id);return;}heldKey=keysByPlayer[0][action];if(!keys.has(heldKey))pressed.add(heldKey);keys.add(heldKey);button.classList.add('is-held');button.setPointerCapture(e.pointerId)});button.addEventListener('pointerup',release);button.addEventListener('pointercancel',release);button.addEventListener('lostpointercapture',release);}
const stick=document.querySelector('.touch-stick'),stickKnob=stick.querySelector('span');let stickPointer=null,stickKeys=new Set();function updateStick(e){const rect=stick.getBoundingClientRect(),dx=e.clientX-(rect.left+rect.width/2),dy=e.clientY-(rect.top+rect.height/2),radius=rect.width*.34,length=Math.hypot(dx,dy),ratio=Math.min(1,length/radius),nx=length?dx/length*ratio:0,ny=length?dy/length*ratio:0;stickKnob.style.transform=`translate(${nx*radius}px,${ny*radius}px)`;const active=new Set();if(ratio>.2){if(ny<-.35)active.add('up');if(ny>.35)active.add('down');if(nx<-.35)active.add('left');if(nx>.35)active.add('right')}for(const action of stickKeys)if(!active.has(action)){const key=keysByPlayer[0][action];if(!Object.values(keysByPlayer[0]).includes(key)||!stickKeys.has(action))keys.delete(key)}for(const action of active)if(!stickKeys.has(action)){const key=keysByPlayer[0][action];if(!keys.has(key))pressed.add(key);keys.add(key)}stickKeys=active;}function releaseStick(){for(const action of stickKeys)keys.delete(keysByPlayer[0][action]);stickKeys.clear();stickPointer=null;stickKnob.style.transform='translate(0,0)'}stick.addEventListener('pointerdown',e=>{if(mode!=='game'||touchMode!=='joystick')return;e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);updateStick(e)});stick.addEventListener('pointermove',e=>{if(e.pointerId===stickPointer)updateStick(e)});stick.addEventListener('pointerup',releaseStick);stick.addEventListener('pointercancel',releaseStick);stick.addEventListener('lostpointercapture',releaseStick);
document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='game'&&match&&match.phase!=='final'){match.pause=true;pauseArcadeAudio(true)}});
function inputs(){const result=[],pads=navigator.getGamepads?Array.from(navigator.getGamepads()??[]):[],connectedPads=pads.filter(gp=>gp&&gp.connected!==false),gamepadOnly=connectedPads.length>=match.players.length;if(gamepadOnly!==Boolean(ui.gamepadOnly)){ui.gamepadIds=new Map();ui.gpPending=new Map();for(const gp of pads)if(gp)ui[`gp${gp.index}`]=null;controlled=gamepadOnly?[]:[...keyboardPlayers];ui.gamepadOnly=gamepadOnly;}if(!gamepadOnly)for(let i=0;i<keyboardPlayers.length;i++){const id=keyboardPlayers[i],keymap=keysByPlayer[i],x=(keys.has(keymap.right)?1:0)-(keys.has(keymap.left)?1:0),y=(keys.has(keymap.down)?1:0)-(keys.has(keymap.up)?1:0);if(!controlled.includes(id))controlled.push(id);result.push(createInput(id,{x,y,turbo:keys.has(keymap.turbo),shootHeld:keys.has(keymap.shoot),shootPressed:pressed.has(keymap.shoot),passPressed:pressed.has(keymap.pass),stealPressed:keys.has(keymap.pass),shovePressed:keys.has(keymap.turbo)&&pressed.has(keymap.pass),blockPressed:pressed.has(keymap.shoot)}));}
  if(navigator.getGamepads){ui.gamepadIds??=new Map();ui.gpPending??=new Map();const connected=new Set(connectedPads.map(gp=>gp.index));for(const [index,id] of ui.gamepadIds)if(!connected.has(index)){ui.gamepadIds.delete(index);ui[`gp${index}`]=null;ui.gpPending.delete(id);controlled=controlled.filter(playerId=>playerId!==id);}for(const gp of pads){if(!gp||gp.connected===false)continue;let id=ui.gamepadIds.get(gp.index);if(!id){const taken=new Set(controlled);const next=match.players.find(p=>!taken.has(p.id));if(next){id=next.id;ui.gamepadIds.set(gp.index,id);controlled.push(id)}}if(!id)continue;const old=ui[`gp${gp.index}`]||{},pending=ui.gpPending.get(id)??{shoot:false,pass:false,pause:false},actions=readGamepadActions(gp,gamepadButtons),movement=readGamepadMovement(gp),{shoot,pass,turbo,pause:start}=actions;if(shoot&&!old.shoot)pending.shoot=true;if(pass&&!old.pass)pending.pass=true;if(start&&!old.start)pending.pause=true;ui.gpPending.set(id,pending);const frame=createInput(id,{x:movement.x,y:movement.y,turbo,shootHeld:shoot,shootPressed:pending.shoot,passPressed:pending.pass,stealPressed:pending.pass,shovePressed:turbo&&pending.pass,pausePressed:pending.pause,blockPressed:pending.shoot});ui[`gp${gp.index}`]={shoot,pass,start};result.push(frame)}}
  ui.lastInputFrames=result;return result;}
function consumeInputEdges(frames){pressed.clear();for(const input of frames){const pending=ui.gpPending?.get(input.playerId);if(pending){pending.shoot=false;pending.pass=false;pending.pause=false;}}}
function eventText(text){$('live-region').textContent=text}
function frame(now){
  recordDebugFrame(diagnostics,now);
  if(ui.shakeFrames>0)ui.shakeFrames--;
  if(mode!=='game')return;
  pauseArcadeAudio(match.pause);
  if(!last)last=now;
  const dt=Math.min(.1,(now-last)/1000);last=now;
  if(match.pause){const pausedFrames=inputs();if(pausedFrames.some(input=>input.pausePressed))match.pause=false;consumeInputEdges(pausedFrames);}
  else{
    accumulator+=dt;const tick=1/60;const frames=inputs(),heldFrames=frames.map(input=>({...input,shootPressed:false,passPressed:false,stealPressed:false,shovePressed:false,blockPressed:false,pausePressed:false}));let firstTick=true;
    if(match.phase==='break'){const substituted=new Set();for(const input of frames){if(!input.passPressed)continue;const athlete=match.players.find(p=>p.id===input.playerId);if(athlete&&!substituted.has(athlete.team)){substitutePlayer(match,athlete.team);substituted.add(athlete.team);}}}
    while(accumulator>=tick&&!match.pause){const tickStart=diagnostics.enabled?performance.now():0;stepMatch(match,firstTick?frames:heldFrames);if(diagnostics.enabled)recordDebugTick(diagnostics,performance.now()-tickStart);if(firstTick)consumeInputEdges(frames);firstTick=false;accumulator-=tick;if(match.phase==='final')break;}
    if(match.phase==='final'&&!match.recordsRecorded){if(!practice){saved.leagueRecords=recordLeagueResult(saved.leagueRecords,homeSelect.value,awaySelect.value,match.score);saved.careerRecords=recordCareerMatch(saved.careerRecords,match);refreshTeamRecords();}if(campaign){saved.season=recordSeasonResult(saved.season,match.winner===0);match.campaignResult=match.winner===0?'WIN — ADVANCED':'LOSS — RUN ENDED';}if(tournamentMode){saved.tournament=recordTournamentResult(saved.tournament,match.winner===0);match.tournamentResult=saved.tournament.champion?'CUP CHAMPIONS!':match.winner===0?`ADVANCED TO ROUND ${saved.tournament.round+1}`:'ELIMINATED FROM THE JAM CUP';}match.recordsRecorded=true;save();}
    playGameCue();
  }
  render(dt);raf=requestAnimationFrame(frame);
}
function playGameCue(){const e=match.events.at(-1);if(!e||e===ui.lastSfxEvent)return;ui.lastSfxEvent=e;if(audioCaptions)eventText(e.text);const message=e.text.toLowerCase();if(screenShake&&!reducedFlash&&(message.includes('scores')||message.includes('jam!')))ui.shakeFrames=5;if(message.includes('scores')){tone(740,.18,'square',.12);setTimeout(()=>tone(988,.2,'triangle',.1),90)}else if(message.includes('jam!')){tone(190,.25,'sawtooth',.12);setTimeout(()=>tone(660,.22,'square',.1),100)}else if(message.includes('fire'))tone(990,.28,'triangle',.1);else if(message.includes('pass')||message.includes('catches'))tone(430,.07,'square',.05);else if(message.includes('pokes')||message.includes('rebound'))tone(210,.09,'triangle',.05);}
const palette=t=>t.colors;
function hexRgb(c){return [parseInt(c.slice(1,3),16),parseInt(c.slice(3,5),16),parseInt(c.slice(5,7),16)]}
function rgbHex(c){return '#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('')}
function drawDiagnostics(){const lines=debugLines(diagnostics,match);canvas.dataset.debugLines=lines.join(' | ');if(!lines.length)return;ctx.save();ctx.fillStyle='rgba(8, 6, 20, .9)';ctx.fillRect(7,104,226,48);ctx.fillStyle='#9ef4ec';ctx.font='8px monospace';ctx.textBaseline='top';for(let i=0;i<lines.length;i++)ctx.fillText(lines[i],12,108+i*10,216);ctx.restore();}
function stageCameraBall(ball){
  const owner=match?.players.find(p=>p.id===(ball.ownerId??ball.aerialTargetId));
  const direction=Math.sign(owner?.facing||ball.vx||(ball.x<100?-1:1));
  const distance=direction>0?200-ball.x:ball.x;
  const approach=Math.max(0,Math.min(1,(70-distance)/70));
  return {...ball,x:ball.x-direction*30*approach};
}
function render(deltaSeconds=1/60){const w=480,h=360;ctx.clearRect(0,0,w,h);if(!match){drawArena();drawCourt();drawDiagnostics();return}const cameraBall=stagePreview?stageCameraBall(match.ball):match.ball;camX=updateCameraX(camX,cameraBall,deltaSeconds,cameraZoom);ctx.save();if(ui.shakeFrames>0&&screenShake&&!reducedFlash){ctx.translate(Math.sin(Date.now()/13)*ui.shakeFrames*.48,Math.cos(Date.now()/17)*ui.shakeFrames*.3)}drawArena();drawCourt();const entities=match.players.map(p=>({type:'player',p,sort:p.y+p.z*-.05}));entities.push({type:'ball',sort:ballDrawDepth(match.ball,match.players)});if(stagePreview)for(const end of courtMarkings(court).ends)entities.push({type:'hoop',end,sort:end.hoop[1]});entities.sort((a,b)=>a.sort-b.sort);for(const e of entities){if(e.type==='player')drawAthlete(e.p);else if(e.type==='hoop')drawStageHoop(e.end);else drawBall(match.ball)}ctx.restore();drawHUD();if(match.phase==='break')drawOverlay(`${match.period===3?'HALFTIME':'QUARTER BREAK'}`,`${match.teamNames[0]}  ${match.score[0]}  —  ${match.score[1]}`,'P/O SUB  ·  PASS ON GAMEPAD');if(match.phase==='overtime'&&match.periodBreak>0)drawOverlay('OVERTIME','NEXT PERIOD','SAME TEAMS. BIGGER MOMENT.');if(match.pause)drawOverlay('PAUSED','GAME FROZEN','ENTER TO RESUME');if(match.phase==='final')drawFinal();drawDiagnostics();}
function project(x,y,z=0){if(stagePreview)return projectJamStagePoint({x,y,z,cameraX:camX,zoom:cameraZoom});const zoom=cameraZoom/100,scale=2.2*zoom,px=240+(x-camX)*scale,py=345-(100-y)*scale-z*7*zoom;return [px,py]}
function drawArena(){
  const g=ctx.createLinearGradient(0,0,0,190);g.addColorStop(0,'#050a25');g.addColorStop(.48,'#111342');g.addColorStop(1,'#25144a');ctx.fillStyle=g;ctx.fillRect(0,0,480,190);
  const roof=ctx.createLinearGradient(0,12,0,38);roof.addColorStop(0,'#090f35');roof.addColorStop(.5,'#173174');roof.addColorStop(1,'#101334');ctx.fillStyle=roof;ctx.fillRect(0,12,480,25);
  for(let light=0;light<9;light++){const lx=18+light*56;ctx.fillStyle='#7bdfff';ctx.shadowColor='#268bff';ctx.shadowBlur=9;ctx.fillRect(lx,17,9,3);ctx.shadowBlur=0;ctx.fillStyle='#f5f0c9';ctx.fillRect(lx+3,19,3,1)}
  const skins=['#e6b88f','#b5795d','#845d4e','#d6a071','#edcfa9','#8b6348'];
  for(let row=0;row<5;row++)for(let col=0;col<54;col++){
    const seed=col*31+row*73,x=col*10+(row%2)*4,y=40+row*21+Math.sin(col*2+row)*2;
    const jacket=`hsl(${(seed*17+250)%360} 78% ${36+(seed*7)%27}%)`,skin=skins[seed%skins.length],head=2+(seed%3===0?1:0),creature=seed%7===0;
    ctx.fillStyle=jacket;ctx.fillRect(x+1,y+4,4,4);ctx.fillRect(x,y+5,1,2);ctx.fillRect(x+5,y+5,1,2);
    ctx.fillStyle=skin;ctx.fillRect(x+2,y+1,head,3);
    ctx.fillStyle=(seed%4===0?'#211c29':seed%4===1?'#d2bd78':seed%4===2?'#45302c':'#789092');ctx.fillRect(x+1,y,4,2);
    if(creature){ctx.fillStyle=jacket;ctx.fillRect(x+1,y-1,1,2);ctx.fillRect(x+4,y-1,1,2)}
    const wave=reducedFlash?0:Math.sin(Date.now()/190+col*.8+row)*1.4;
    ctx.fillStyle=skin;ctx.fillRect(x,y+3+wave,1,2);ctx.fillRect(x+5,y+3-wave,1,2);
    if(!reducedFlash&&((seed%11===0)||Math.sin(Date.now()/260+seed)>.93)){ctx.fillStyle=seed%2?'#76edff':'#ffe77b';ctx.fillRect(x+2,y-2,2,2)}
  }
  for(const [x,label,color] of [[58,'JAM!','#ff446f'],[220,'96','#23f0df'],[382,'HOME','#f8dc58']]){ctx.fillStyle='#080e27';ctx.fillRect(x,136,40,12);ctx.shadowColor=color;ctx.shadowBlur=5;ctx.strokeStyle=color;ctx.lineWidth=1;ctx.strokeRect(x,136,40,12);ctx.shadowBlur=0;ctx.fillStyle=color;ctx.font='bold 7px monospace';ctx.fillText(label,x+4,145)}
  const t=match?teamById(homeSelect.value):teams[0];ctx.fillStyle='#29d9f3';ctx.fillRect(0,118,480,2);ctx.fillStyle='#100f30';ctx.fillRect(0,120,480,5);ctx.fillStyle=t.colors[1];ctx.font='bold 5px monospace';ctx.fillText(`${t.name.toUpperCase()} · ${t.slogan.toUpperCase()} · JAMVERSE '96`,18,124);ctx.fillStyle='#ff3fc3';ctx.fillRect(0,125,480,1)
}
function drawProjectedEllipse(cx,cy,rx,ry,start=0,end=Math.PI*2){
  const steps=Math.max(16,Math.ceil(Math.abs(end-start)*36));ctx.beginPath();
  for(let i=0;i<=steps;i++){const a=start+(end-start)*i/steps,p=project(cx+Math.cos(a)*rx,cy+Math.sin(a)*ry);i?ctx.lineTo(...p):ctx.moveTo(...p)}
  ctx.stroke();
}
function drawCourt(){
  const t=match?teamById(homeSelect.value):teams[0],colors=palette(t),corners=[[0,0],[200,0],[200,100],[0,100]].map(([x,y])=>project(x,y));
  const wood=ctx.createLinearGradient(0,120,0,355);wood.addColorStop(0,'#b96845');wood.addColorStop(.42,'#e1a45a');wood.addColorStop(1,'#a9543d');poly(corners,wood);
  ctx.save();ctx.beginPath();ctx.moveTo(...corners[0]);for(const p of corners.slice(1))ctx.lineTo(...p);ctx.closePath();ctx.clip();
  for(let lane=0;lane<40;lane++){const y=lane*2.5;const a=project(0,y),b=project(200,y),c=project(200,y+2.5),d=project(0,y+2.5);ctx.globalAlpha=lane%2?.075:.035;poly([a,b,c,d],lane%2?'#4e201d':'#fff1c4');ctx.globalAlpha=1;ctx.strokeStyle='#81433042';ctx.lineWidth=.35;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke();}
  for(let i=0;i<76;i++){const x=(i*47+17)%200,y=(i*29+7)%100,a=project(x,y),b=project(Math.min(200,x+7+(i%9)*2),y+(i%2?1:-1));ctx.strokeStyle=i%4?'#fff3c318':'#ffefcf2b';ctx.lineWidth=i%5===0?1:.55;ctx.beginPath();ctx.moveTo(...a);ctx.lineTo(...b);ctx.stroke()}
  ctx.globalAlpha=.13;const logo=project(100,50);ctx.fillStyle=colors[0];ctx.font='bold 37px monospace';ctx.textAlign='center';ctx.fillText(t.mascot.slice(0,1).toUpperCase(),logo[0],logo[1]+12);ctx.globalAlpha=.12;ctx.font='bold 12px monospace';ctx.fillText(t.name.toUpperCase(),logo[0],logo[1]+25);ctx.globalAlpha=1;ctx.textAlign='left';
  const line='#f7e3b7';function worldLine(points,width=1.5,color=line){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();points.forEach(([x,y],i)=>{const p=project(x,y);i?ctx.lineTo(...p):ctx.moveTo(...p)});ctx.stroke()}
  const markings=courtMarkings(court),zoom=cameraZoom/100;
  worldLine([[0,0],[200,0],[200,100],[0,100],[0,0]],2.2,'#ffe5ad');worldLine([[100,0],[100,100]],1.5);ctx.strokeStyle=line;ctx.lineWidth=1.5;if(stagePreview)drawProjectedEllipse(...markings.center.position,markings.center.radiusX,markings.center.radiusY);else{let c=project(...markings.center.position);ctx.beginPath();ctx.ellipse(c[0],c[1],markings.center.radiusX*2.2*zoom,markings.center.radiusY*2.2*zoom,0,0,Math.PI*2);ctx.stroke()}
  for(const end of markings.ends){
    worldLine(end.key,1.7);
    const ft=end.freeThrow;ctx.strokeStyle=line;ctx.lineWidth=1.5;if(stagePreview)drawProjectedEllipse(...ft.center,ft.radiusX,ft.radiusY,ft.start,ft.end);else{const fc=project(...ft.center);ctx.beginPath();ctx.ellipse(fc[0],fc[1],ft.radiusX*2.2*zoom,ft.radiusY*2.2*zoom,0,ft.start,ft.end);ctx.stroke()}
    ctx.save();ctx.setLineDash([3,3]);if(stagePreview)drawProjectedEllipse(...ft.center,ft.radiusX,ft.radiusY,ft.end,ft.start+Math.PI*2);else{const fc=project(...ft.center);ctx.beginPath();ctx.ellipse(fc[0],fc[1],ft.radiusX*2.2*zoom,ft.radiusY*2.2*zoom,0,ft.end,ft.start+Math.PI*2);ctx.stroke()}ctx.restore();
    const arc=end.threePoint;if(stagePreview)drawProjectedEllipse(...arc.center,arc.radiusX,arc.radiusY,arc.start,arc.end);else{const hp=project(...arc.center);ctx.beginPath();ctx.ellipse(hp[0],hp[1],arc.radiusX*2.2*zoom,arc.radiusY*2.2*zoom,0,arc.start,arc.end);ctx.stroke()}for(const segment of arc.corners)worldLine(segment);
    if(!stagePreview){const [rimX,floorY]=project(...end.hoop),rimY=floorY-end.rimHeight*zoom,boardX=project(...end.board)[0];
      ctx.strokeStyle='#243553';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(boardX,floorY+5);ctx.lineTo(boardX,rimY-25);ctx.stroke();
      ctx.fillStyle='#dfe5dc';ctx.fillRect(boardX-3,rimY-25,6,36);ctx.strokeStyle='#84dbe4';ctx.lineWidth=1.4;ctx.strokeRect(boardX-4,rimY-26,8,38);
      ctx.strokeStyle='#fc694e';ctx.lineWidth=2.5;ctx.beginPath();ctx.ellipse(rimX,rimY,7,2.3,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#fff0c8';ctx.lineWidth=.75;ctx.beginPath();for(let n=-2;n<=2;n++){ctx.moveTo(rimX+n*2.5,rimY+2);ctx.lineTo(rimX+n*1.8,rimY+11);if(n<2){ctx.moveTo(rimX+n*2.2,rimY+7);ctx.lineTo(rimX+(n+1)*2.2,rimY+7)}}ctx.stroke();}
  }
  ctx.globalAlpha=.22;ctx.fillStyle='#b9f7ff';for(let i=0;i<9;i++){const x=18+i*52+Math.sin(Date.now()/600+i)*3,y=314+(i%3)*5;ctx.fillRect(x,y,19,1)}ctx.globalAlpha=1;ctx.restore();
  if(!stagePreview){ctx.strokeStyle='#ffdb94';ctx.lineWidth=2;ctx.beginPath();corners.forEach((p,i)=>i?ctx.lineTo(...p):ctx.moveTo(...p));ctx.closePath();ctx.stroke();
    const led=ctx.createLinearGradient(0,347,0,360);led.addColorStop(0,'#09162b');led.addColorStop(.55,'#1c1334');led.addColorStop(1,'#071522');ctx.fillStyle=led;ctx.fillRect(0,347,480,13);for(let i=0;i<12;i++){ctx.fillStyle=['#ffe44c','#ff4dbd','#20e9e0'][i%3];ctx.globalAlpha=.82;ctx.fillRect(5+i*41,350,24,5)}ctx.globalAlpha=1;ctx.fillStyle='#fff1c8';ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.fillText(`${t.city.toUpperCase()} ${t.mascot.toUpperCase()} · HOME FLOOR`,240,359);ctx.textAlign='left'}
}
function circle(x,y,r,c){ctx.fillStyle=c;ctx.beginPath();ctx.arc(x,y,r,0,Math.PI*2);ctx.fill()}
function poly(points,color){ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(...points[0]);for(let i=1;i<points.length;i++)ctx.lineTo(...points[i]);ctx.closePath();ctx.fill()}
function drawStageHoop(end){
  const [worldX,worldY]=end.hoop,[rimX,hoopFloorY]=project(worldX,worldY),side=worldX>100?1:-1;
  const [baseX,baseY]=project(worldX+side*25,96),rimY=hoopFloorY-end.rimHeight*1.18,boardTop=rimY-45,boardX=rimX+side*16;
  ctx.save();ctx.lineCap='square';ctx.lineJoin='round';
  ctx.fillStyle='#182438';poly([[baseX-34,baseY-9],[baseX+34,baseY-9],[baseX+24,baseY+2],[baseX-24,baseY+2]],'#101927');
  ctx.strokeStyle='#1c2637';ctx.lineWidth=23;ctx.beginPath();ctx.moveTo(baseX,baseY-7);ctx.lineTo(boardX,boardTop+36);ctx.stroke();
  ctx.strokeStyle='#59768c';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(baseX-side*3,baseY-12);ctx.lineTo(boardX-side*3,boardTop+37);ctx.stroke();
  ctx.fillStyle='#d7e5e6';ctx.fillRect(boardX-35,boardTop,70,45);ctx.fillStyle='#b7c9cf';ctx.fillRect(boardX-31,boardTop+4,62,37);ctx.strokeStyle='#5c8195';ctx.lineWidth=3;ctx.strokeRect(boardX-35,boardTop,70,45);ctx.strokeStyle='#edf3e9';ctx.lineWidth=2;ctx.strokeRect(boardX-13,boardTop+24,26,17);
  ctx.strokeStyle='#f04a46';ctx.lineWidth=5;ctx.beginPath();ctx.ellipse(rimX,rimY,26,7,0,0,Math.PI*2);ctx.stroke();
  ctx.strokeStyle='#f5ead2';ctx.lineWidth=1.5;ctx.beginPath();for(let i=-4;i<=4;i++){const startX=rimX+i*5;ctx.moveTo(startX,rimY+5);ctx.lineTo(rimX+i*3.4,rimY+38);if(i<4){ctx.moveTo(startX,rimY+8);ctx.lineTo(startX+5,rimY+8)}}ctx.stroke();
  ctx.restore();
}
const SUPPORT_SKIN=['#d7ac8f','#b57f61','#8a604a','#ebc4a1','#6d4c3d','#c58b6b'];
const SUPPORT_HAIR=['#29252c','#45342e','#d36739','#357ace','#aa90d1','#d5bd68','#3a6755','#e1e6df','#b75f44','#25212c'];
function canonicalSkin(player,rig){
  if(rig==='orc')return '#62a553';if(rig==='artisan-deity')return '#7a8d9f';if(rig==='cosmic-humanoid')return '#438ec2';if(rig==='winged-humanoid')return '#4e275c';if(rig==='elf')return '#c9a385';if(rig==='horned-giant')return '#c54e42';
  const f=player.features;if(!player.captain)return SUPPORT_SKIN[player.visualSeed%SUPPORT_SKIN.length];
  if(f.includes('very dark purple skin'))return '#30133e';if(f.includes('azure skin'))return '#93b6c8';if(f.includes('blue-gray skin'))return '#8294a6';if(f.includes('bronzed'))return '#b8754f';if(f.includes('olive-brown'))return '#a77d61';if(f.includes('very pale'))return '#f1e7e0';if(f.includes('pale'))return '#ead9d2';if(f.includes('natural-skinned'))return '#d1a083';return '#d6aa8e';
}
function drawOnCourtSignature(player){
  const f=player.features,rig=player.rig;
  if(f.includes('masked metal deity')){ctx.fillStyle='#aeb2b4';poly([[-5,-21],[6,-21],[6,-14],[1,-11],[-5,-14]],'#aeb2b4');ctx.fillStyle='#ffb34b';ctx.fillRect(-3,-18,2,1);ctx.fillRect(2,-18,2,1);ctx.strokeStyle='#e6b94d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-5,-21);ctx.lineTo(-7,-25);ctx.moveTo(6,-21);ctx.lineTo(8,-25);ctx.stroke()}
  if(rig==='horned-giant'||f.includes('ram horns')){ctx.strokeStyle='#16171c';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(-5,-23);ctx.quadraticCurveTo(-17,-24,-15,-34);ctx.quadraticCurveTo(-8,-29,-2,-27);ctx.moveTo(5,-23);ctx.quadraticCurveTo(17,-24,15,-34);ctx.quadraticCurveTo(8,-29,2,-27);ctx.stroke()}
  if(f.includes('freckles')){ctx.fillStyle='#9b583d';for(const [x,y] of [[-3,-19],[0,-18],[3,-20],[-4,-17],[2,-17]])ctx.fillRect(x,y,1,1)}
  if(f.includes('green eyes')||f.includes('blue-green eyes')||f.includes('hazel-green eyes')){ctx.fillStyle=f.includes('blue-green')?'#4ab5ad':f.includes('hazel-green')?'#9c9a50':'#36a95c';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1)}
  if(f.includes('red eyes')){ctx.fillStyle='#df4b57';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1)}
  if(f.includes('silver eyes')){ctx.fillStyle='#e2e9ee';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1)}
  if(f.includes('teal eyes')){ctx.fillStyle='#43c6ba';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1)}
  if(f.includes('amber eyes')){ctx.fillStyle='#e2a842';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1)}
  if(f.includes('blue eyes')){ctx.fillStyle='#559bd8';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1)}
  if(f.includes('mismatched sclera')){ctx.fillStyle='#080910';ctx.fillRect(-4,-23,4,2);ctx.fillStyle='#fff';ctx.fillRect(2,-23,4,2);ctx.fillStyle='#41deeb';ctx.fillRect(-2,-23,1,2);ctx.fillRect(3,-23,1,2)}
  if(f.includes('mustache')){ctx.strokeStyle='#49352f';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-4,-16);ctx.quadraticCurveTo(-1,-14,0,-16);ctx.quadraticCurveTo(2,-14,5,-16);ctx.stroke()}
  if(f.includes('dark beard')||f.includes('long beard')){poly([[-5,-16],[5,-16],[4,-9],[0,-7],[-4,-10]],f.includes('long beard')?'#e5e5df':'#28242a')}
  if(f.includes('pinned beanie')){ctx.fillStyle='#111318';ctx.fillRect(-7,-29,15,4);ctx.fillRect(-5,-32,11,4);ctx.fillStyle='#bcb9c2';ctx.fillRect(6,-29,2,2)}
  if(f.includes('crimson flowers')){ctx.fillStyle='#c92f44';for(const [x,y] of [[6,-26],[9,-24],[5,-22]]){ctx.beginPath();ctx.arc(x,y,1.5,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#517648';ctx.fillRect(7,-29,1,4)}
  if(f.includes('cyan-magenta cheek nodes')){ctx.fillStyle='#35dcec';ctx.fillRect(-6,-18,2,2);ctx.fillStyle='#e740ce';ctx.fillRect(5,-18,2,2);ctx.strokeStyle='#22202b';ctx.lineWidth=2;ctx.beginPath();ctx.arc(1,-22,9,Math.PI,0);ctx.stroke();ctx.fillStyle='#34d7ee';ctx.fillRect(-11,-23,3,6);ctx.fillStyle='#e640ce';ctx.fillRect(9,-23,3,6)}
  if(f.includes('vivid blue hair')){ctx.fillStyle='#3284e5';ctx.fillRect(-6,-29,13,5);ctx.fillStyle='#41d9ed';ctx.fillRect(7,-28,2,2)}
  if(f.includes('black-white hair')){ctx.fillStyle='#12141a';ctx.fillRect(-7,-29,7,5);ctx.fillStyle='#f0eee7';ctx.fillRect(0,-29,7,5)}
  if(f.includes('facial rune')){ctx.fillStyle='#f1d15b';ctx.fillRect(-5,-17,1,2);ctx.fillRect(4,-20,1,2);ctx.fillRect(-1,-13,2,1)}
  if(f.includes('gold fracture lines')){ctx.strokeStyle='#edca5d';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-4,-19);ctx.lineTo(-2,-17);ctx.lineTo(-3,-14);ctx.moveTo(4,-20);ctx.lineTo(2,-17);ctx.lineTo(5,-14);ctx.stroke()}
  if(f.includes('broad Cheshire grin')){ctx.fillStyle='#fff1d2';ctx.fillRect(-6,-17,12,3);ctx.fillStyle='#bd315a';ctx.fillRect(-6,-16,12,2);ctx.strokeStyle='#37202c';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(-3,-17);ctx.lineTo(-3,-13);ctx.moveTo(0,-17);ctx.lineTo(0,-13);ctx.moveTo(3,-17);ctx.lineTo(3,-13);ctx.stroke()}
  if(f.includes('wide smile')){ctx.fillStyle='#fff1d2';ctx.fillRect(-5,-16,10,2);ctx.fillStyle='#7b3b43';ctx.fillRect(-5,-15,10,2)}
  if(f.includes('tilted face ring')){ctx.strokeStyle='#f1c653';ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(7,-20,2,4,-.45,0,Math.PI*2);ctx.stroke()}
  if(f.includes('headset')){ctx.strokeStyle='#333540';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,-22,8,Math.PI,Math.PI*2);ctx.stroke();ctx.fillStyle='#7c8795';ctx.fillRect(6,-23,2,5);ctx.fillRect(-8,-23,2,5)}
  if(f.includes('gauges')){circle(-8,-18,1.8,'#bda16e');circle(8,-18,1.8,'#bda16e')}
  if(f.includes('photographer')){ctx.fillStyle='#342c30';ctx.fillRect(-12,-8,4,4);ctx.fillStyle='#e3c27c';ctx.fillRect(-11,-7,2,2)}
  if(f.includes('fleur detail')){ctx.fillStyle='#f2d286';for(const [x,y] of [[-8,-25],[-6,-27],[-4,-25],[-6,-23]])circle(x,y,1,'#f2d286')}
  if(f.includes('tattoos')){ctx.strokeStyle='#37202c';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(-8,-5);ctx.lineTo(-7,-1);ctx.lineTo(-9,2);ctx.moveTo(-7,-3);ctx.lineTo(-4,-4);ctx.stroke()}
  if(f.includes('piercings')){ctx.fillStyle='#d9c18b';ctx.fillRect(7,-19,1.5,1.5);ctx.fillRect(-7,-19,1.5,1.5)}
  if(f.includes('circuit texture')){ctx.strokeStyle='#42d8e1';ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(-6,-5);ctx.lineTo(-3,-5);ctx.lineTo(-3,-2);ctx.moveTo(5,-7);ctx.lineTo(2,-7);ctx.lineTo(2,-4);ctx.stroke();circle(-3,-2,1,'#42d8e1');circle(2,-4,1,'#42d8e1')}
  if(f.includes('botanical robes')){ctx.strokeStyle='#8ac27a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(9,2);ctx.quadraticCurveTo(14,-4,11,-7);ctx.moveTo(11,-3);ctx.lineTo(8,-5);ctx.moveTo(12,-5);ctx.lineTo(15,-7);ctx.stroke()}
  if(f.includes('mushroom details')){circle(8,-5,2,'#bd5b48');ctx.fillStyle='#e5d2ad';ctx.fillRect(7,-4,3,3);ctx.fillStyle='#f4e0c4';ctx.fillRect(6,-6,1,1);ctx.fillRect(9,-6,1,1)}
  if(f.includes('nocturnal motifs')){ctx.fillStyle='#d6ceee';ctx.font='5px monospace';ctx.fillText('✦',8,-7);ctx.fillText('☾',-11,-5)}
}
function drawAthlete(p){const [x,y]=project(p.x,p.y,p.z),team=teamById(p.team===0?homeSelect.value:awaySelect.value),colors=team.colors,hex=colors[p.team===0?0:1], player=team.roster.find(a=>a.id===p.id);if(!player)return;const scale=athleteVisualScale(player,cameraZoom)*(stagePreview?JAM_STAGE.rendererSpriteScale*stageDepthScale(p.y):1);const bob=p.anim==='run'?Math.sin((match.quarterSeconds-match.clock)*19+p.x)*2:p.anim==='celebrate'?Math.sin((42-(p.poseFrames||0))*.8)*1.8:Math.sin((match.quarterSeconds-match.clock)*7+p.y)*.8;
  if(drawRosterGameSprite(p,player,x,y,scale,bob))return;
  ctx.fillStyle='#160e1b8a';ctx.beginPath();ctx.ellipse(x,y+7,12*scale,3.4,0,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(Math.round(x),Math.round(y-bob));ctx.scale(p.facing,1);ctx.scale(scale,scale);
  const rig=player.rig,fur=player.visualSeed%2?'#c67d48':'#80715e';
  if(rig==='quadruped-fox'){circle(-4,-5,8,'#b94e28');circle(5,-8,4,'#c95d2d');poly([[-6,-12],[-13,-23],[-2,-16]],'#c54f2a');poly([[4,-13],[5,-25],[11,-16]],'#c54f2a');circle(6,-9,1.2,'#fff1bd');circle(7,-9,0.6,'#15111b');ctx.strokeStyle='#f7e2c7';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-10,-5);ctx.quadraticCurveTo(-21,-14,-18,-24);ctx.stroke();for(let i=-1;i<=1;i++){ctx.strokeStyle='#4c2b24';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-8+i*3,-1);ctx.lineTo(-10+i*3,4);ctx.stroke();}}
  else if(rig==='dragon'){poly([[-18,-10],[-27,-31],[-12,-23],[-4,-14]],'#285278');poly([[3,-13],[17,-32],[22,-10],[10,-7]],'#294e73');for(const side of [-1,1]){ctx.strokeStyle='#8fa4ad';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(side*6,-14);ctx.lineTo(side*22,-25);ctx.moveTo(side*11,-18);ctx.lineTo(side*20,-11);ctx.stroke()}poly([[-8,-7],[-20,-14],[-18,-18],[-5,-12]],'#daa847');circle(-4,-11,8,'#173654');circle(4,-13,5,'#234f72');circle(8,-14,1.4,'#ffd05d');poly([[-4,-7],[4,-7],[7,0],[-6,0]],'#d8ad49');ctx.strokeStyle='#f3db91';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(-2,-6);ctx.lineTo(0,-1);ctx.moveTo(2,-6);ctx.lineTo(4,-1);ctx.stroke();for(let g=0;g<6;g++)circle(-1+g*1.4,-8,.45,'#ffdc72');ctx.fillStyle='#e6bf55';for(const [fx,fy] of [[-5,-16],[0,-18],[4,-18],[0,-9],[5,-10]])circle(fx,fy,.75,'#e6bf55');ctx.strokeStyle='#d7aa4d';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-8,-7);ctx.quadraticCurveTo(-21,4,-28,-1);ctx.stroke();ctx.beginPath();ctx.moveTo(-27,-1);ctx.lineTo(-32,-5);ctx.lineTo(-30,0);ctx.stroke();circle(-28,-1,1.6,'#e3b54d');for(const [lx,ly] of [[-9,-5],[-5,-2],[2,-5],[6,-2]]){ctx.strokeStyle='#254b68';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(lx,ly);ctx.lineTo(lx+1,ly+8);ctx.lineTo(lx+3,ly+9);ctx.stroke();circle(lx+3,ly+9,1.4,'#b99052')}}
  else if(rig==='cobra'){poly([[-14,-8],[-20,-18],[-19,-27],[-13,-33],[-8,-28],[-6,-19],[-3,-11]],'#102d63');poly([[1,-21],[4,-29],[14,-25],[13,-17],[6,-14]],'#1357a0');for(const side of [-1,1]){ctx.strokeStyle='#258dc5';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(side*9,-29);ctx.quadraticCurveTo(side*18,-23,side*12,-16);ctx.stroke()}circle(10,-21,1.7,'#ffd943');circle(10.5,-21,.7,'#10101a');ctx.strokeStyle='#174e91';ctx.lineWidth=5;ctx.beginPath();ctx.moveTo(-7,-6);ctx.bezierCurveTo(-18,1,-13,7,-3,5);ctx.bezierCurveTo(8,3,12,0,5,-4);ctx.stroke();ctx.strokeStyle='#f37938';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(2,-13);ctx.lineTo(7,-15);ctx.lineTo(11,-14);ctx.moveTo(5,-10);ctx.lineTo(9,-11);ctx.stroke();ctx.fillStyle='#a6d6d8';ctx.fillRect(7,-18,5,2);}
  else if(rig==='wombat'){ctx.fillStyle='#74634f';ctx.beginPath();ctx.ellipse(-2,-6,12,8,0,0,Math.PI*2);ctx.fill();circle(3,-16,7,'#82705a');circle(-5,-21,3,'#8f7960');circle(8,-21,3,'#8f7960');circle(-5,-21,1.3,'#4e4035');circle(8,-21,1.3,'#4e4035');circle(1,-16,1,'#24191a');circle(7,-15,1,'#24191a');circle(4,-11,5,'#a58a6b');circle(9,-11,2,'#372620');for(const [lx,ly] of [[-10,-2],[-4,-1],[3,-1],[8,-2]]){ctx.strokeStyle='#74634f';ctx.lineWidth=3.5;ctx.beginPath();ctx.moveTo(lx,-3);ctx.lineTo(lx,ly+5);ctx.stroke();ctx.fillStyle='#40352b';ctx.fillRect(lx-2,ly+4,5,2)}}
  else if(rig==='jaguar'){ctx.strokeStyle='#af7d38';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-7,-6);ctx.lineTo(-10,1);ctx.lineTo(-7,3);ctx.moveTo(5,-6);ctx.lineTo(8,1);ctx.lineTo(11,2);ctx.moveTo(-7,-16);ctx.lineTo(-12,-11);ctx.lineTo(-11,-7);ctx.moveTo(4,-15);ctx.lineTo(12,-10);ctx.lineTo(13,-6);ctx.stroke();circle(-4,-9,10,'#c89744');circle(3,-17,7,'#d1a34c');circle(-2,-15,4,'#e0bf79');poly([[-5,-20],[-11,-29],[-1,-24]],'#bd813d');poly([[4,-21],[11,-29],[10,-19]],'#bd813d');circle(7,-17,1.1,'#1e1716');circle(1,-13,1.1,'#d5ac59');ctx.fillStyle='#3e2921';for(let q=0;q<14;q++){const sx=-10+(q*11)%18,sy=-19+(q*7)%17;circle(sx,sy,1,'#3c2a21')}ctx.fillStyle='#244985';ctx.fillRect(-4,-10,9,7);ctx.fillStyle='#fff';ctx.fillRect(-1,-10,1.4,7);ctx.fillRect(-4,-7,9,1.4);ctx.fillStyle='#d84949';ctx.fillRect(-.5,-10,.6,7);ctx.fillRect(-4,-6.7,9,.6);ctx.fillStyle='#b27c39';ctx.beginPath();ctx.ellipse(8,-12,4,2.5,0,0,Math.PI*2);ctx.fill();circle(11,-13,1,'#30201b');}
  else if(rig==='orangutan-zebra'){ctx.fillStyle='#bd7141';ctx.beginPath();ctx.ellipse(-2,-8,10,8,0,0,Math.PI*2);ctx.fill();circle(4,-18,6,'#b96e3e');circle(4,-18,2,'#2c221e');circle(9,-18,1.3,'#f1d6b0');circle(-1,-19,3,'#d48a4d');ctx.strokeStyle='#eee4cc';ctx.lineWidth=2;for(let q=0;q<6;q++){const sx=-10+q*3.4;ctx.beginPath();ctx.moveTo(sx,-15);ctx.lineTo(sx-2,-3);ctx.stroke()}ctx.fillStyle=hex;ctx.fillRect(-5,-11,9,6);ctx.fillStyle=colors[1];ctx.fillRect(-4,-6,8,2);ctx.fillStyle='#fff0c2';ctx.font='bold 4px monospace';ctx.fillText(String(player.number),-2,-7);const reach=p.anim==='celebrate'?9:p.anim==='dunk'||p.anim==='block'?3:0;ctx.strokeStyle='#b86d3a';ctx.lineWidth=4.4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(-7,-8);ctx.lineTo(-13,-1);ctx.lineTo(-18,7+reach);ctx.moveTo(2,-7);ctx.lineTo(12,-1);ctx.lineTo(19,6+reach);ctx.stroke();for(const [hx,hy] of [[-18,7+reach],[19,6+reach]]){circle(hx,hy,3.2,'#bd7141');for(let f=-1;f<=1;f++){ctx.strokeStyle='#d9995e';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(hx+f*1.7,hy+2);ctx.lineTo(hx+f*2.2,hy+6);ctx.stroke()}}ctx.fillStyle='#eee4cc';for(let q=0;q<4;q++){ctx.beginPath();ctx.moveTo(10+q*2,-16);ctx.lineTo(9+q*2,-9);ctx.lineTo(11+q*2,-10);ctx.fill()}}
  else if(rig==='blank-screen-android'){poly([[-7,-11],[7,-11],[11,4],[3,7],[1,1],[-2,8],[-10,4]],'#292f39');ctx.strokeStyle='#788895';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(-6,-8);ctx.lineTo(-12,-1);ctx.lineTo(-11,4);ctx.moveTo(6,-8);ctx.lineTo(12,-2);ctx.lineTo(11,4);ctx.moveTo(-5,4);ctx.lineTo(-6,11);ctx.lineTo(-9,13);ctx.moveTo(4,4);ctx.lineTo(5,11);ctx.lineTo(8,13);ctx.stroke();ctx.fillStyle='#394755';ctx.fillRect(-7,-23,14,14);ctx.fillStyle='#050509';ctx.fillRect(-5,-21,10,10);ctx.fillStyle='#78694f';ctx.fillRect(-8,-24,16,2);poly([[-5,-24],[-3,-28],[2,-29],[6,-27],[8,-24]],'#3d3737');ctx.fillStyle='#a8b6be';ctx.fillRect(-3,-6,6,1);}
  else { // individuated human, elf, android, horned, winged and cosmic rigs
    const skin=canonicalSkin(player,rig);
    if(['horned-human','horned-giant','winged-humanoid'].includes(rig)){poly([[-6,-18],[-15,-27],[-8,-24]],'#332334');poly([[5,-18],[13,-27],[8,-22]],'#332334')}
    if(rig==='winged-humanoid'){poly([[-7,-14],[-24,-27],[-19,-8],[-7,-7]],'#733e5a');poly([[7,-14],[24,-27],[19,-8],[7,-7]],'#824f60')}
    const cycle=p.anim==='run'?Math.sin((match.quarterSeconds-match.clock)*17+p.x+p.y)*2.5:0;
    ctx.lineCap='round';ctx.strokeStyle=colors[1];ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(-3,4);ctx.lineTo(-3+cycle*.45,10);ctx.moveTo(3,4);ctx.lineTo(3-cycle*.45,10);ctx.stroke();
    ctx.strokeStyle=skin;ctx.lineWidth=2.6;ctx.beginPath();ctx.moveTo(-3+cycle*.45,10);ctx.lineTo(-4+cycle,14);ctx.moveTo(3-cycle*.45,10);ctx.lineTo(4-cycle,14);ctx.stroke();
    ctx.fillStyle='#f0d8b6';ctx.fillRect(-6+cycle,13,5,2);ctx.fillRect(2-cycle,13,5,2);
    ctx.strokeStyle=skin;ctx.lineWidth=3;ctx.beginPath();
    for(const side of [-1,1]){const raised=p.anim==='celebrate'||p.anim==='block'||p.anim==='rebound'||((p.anim==='shoot'||p.anim==='dunk'||p.anim==='charge')&&side===p.facing),extended=(p.anim==='pass'||p.anim==='steal')&&side===p.facing,swing=p.anim==='run'?cycle*side*.45:0;ctx.moveTo(side*7,-6);ctx.lineTo(side*(extended?12:10),-2+swing);ctx.lineTo(side*(raised?11:extended?18:12),raised?-23:extended?-4:3+swing)}ctx.stroke();
    ctx.fillStyle=hex;ctx.fillRect(-8,-8,16,15);ctx.fillStyle=colors[1];ctx.fillRect(-8,-1,16,5);ctx.fillStyle='#f6dc9f';ctx.font='bold 5px monospace';ctx.fillText(String(player.number),-2,-1);
    if(!player.captain){const uniform=player.visualSeed%4;ctx.fillStyle=uniform===0?'#f7e9ce':uniform===1?colors[2]:uniform===2?colors[1]:'#d7c7ad';if(uniform===0||uniform===3){ctx.fillRect(-8,-7,2,12);ctx.fillRect(6,-7,2,12)}else{ctx.fillRect(-1,-8,2,8);ctx.fillRect(-6,4,12,2)}}
    ctx.fillStyle=skin;ctx.fillRect(-3,-17,7,9);circle(1,-22,7,skin);
    if(rig==='elf'){poly([[-5,-22],[-13,-25],[-6,-19]],skin);poly([[6,-22],[13,-26],[7,-18]],skin)}
    const hair=player.captain?(player.features.includes('gray-streaked')?'#77716e':player.features.includes('ginger')?'#d36739':player.features.includes('silver-white')?'#e1e6df':player.features.includes('red hair')?'#ce3a44':player.features.includes('vivid blue')||player.features.includes('blue hair')?'#357ace':player.features.includes('green-haired')?'#59ad54':player.features.includes('lavender')?'#aa90d1':player.features.includes('blonde')?'#d5bd68':player.features.includes('teal hair')?'#3dc3ac':player.features.includes('copper hair')?'#b75f44':player.features.includes('dark-brown')||player.features.includes('dark hair')?'#45342e':'#29252c'):SUPPORT_HAIR[player.visualSeed%SUPPORT_HAIR.length];
    if(player.captain&&player.features.includes('iridescent hair')){const spectrum=ctx.createLinearGradient(-7,-28,7,-28);spectrum.addColorStop(0,'#b24996');spectrum.addColorStop(.48,'#4a85ce');spectrum.addColorStop(1,'#59bd9e');ctx.fillStyle=spectrum}else ctx.fillStyle=hair;
    ctx.fillRect(-6,-29,13,6);if(player.features.includes('twin ponytails')){ctx.fillRect(-10,-22,4,11);ctx.fillRect(7,-22,4,11)}
    if(!player.captain){const style=player.visualSeed%5;if(style===0){ctx.fillRect(-8,-26,3,8);ctx.fillRect(5,-26,3,8)}else if(style===1){ctx.fillRect(-8,-25,4,5);ctx.fillRect(4,-29,5,3)}else if(style===2){ctx.fillStyle=colors[1];ctx.fillRect(-8,-30,16,3);ctx.fillStyle=hair;ctx.fillRect(-8,-27,16,2)}else if(style===3){for(const hx of [-7,-3,1,5])circle(hx,-27,2,hair)}else{ctx.fillRect(-8,-24,3,6);ctx.fillRect(5,-27,3,6)}
      // Seeded court gear gives every non-captain a readable silhouette detail.
      const gear=player.visualSeed%8,gearColor=gear%2?colors[1]:'#f4dfb1';ctx.fillStyle=gearColor;
      if(gear===0||gear===4){ctx.fillRect(-7,-25,14,2);ctx.fillStyle=colors[0];ctx.fillRect(-2,-25,4,2)}
      else if(gear===1||gear===5){ctx.fillRect(-11,-1,4,2);ctx.fillRect(8,-1,4,2);ctx.fillStyle=colors[0];ctx.fillRect(-10,0,2,1)}
      else if(gear===2||gear===6){ctx.fillRect(-5,7,4,3);ctx.strokeStyle=gearColor;ctx.lineWidth=1;ctx.strokeRect(2,6,5,5)}
      else {ctx.fillRect(-7,-4,2,6);ctx.fillRect(5,3,2,3);ctx.fillStyle=colors[0];ctx.fillRect(-7,-2,2,1)}
    }
    ctx.fillStyle=rig==='cosmic-humanoid'?'#42e2f0':'#261e22';ctx.fillRect(-3,-22,2,1);ctx.fillRect(3,-22,2,1);
    if(player.features.includes('glasses')){ctx.strokeStyle=player.features.includes('blue glasses')?'#357bd0':'#d6c0e0';ctx.lineWidth=1;ctx.strokeRect(-5,-24,5,4);ctx.strokeRect(2,-24,5,4);ctx.beginPath();ctx.moveTo(0,-22);ctx.lineTo(2,-22);ctx.stroke()}
    if(player.features.includes('driftwood crest')){ctx.strokeStyle='#735136';ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(-5,-27);ctx.quadraticCurveTo(-13,-30,-14,-27);ctx.moveTo(5,-27);ctx.quadraticCurveTo(13,-30,14,-27);ctx.stroke()}
    if(player.features.includes('golden heart')){ctx.fillStyle='#ffd555';ctx.font='8px serif';ctx.fillText('♥',-3,5)}
    if(player.features.includes('beard'))poly([[-5,-16],[6,-16],[5,-9],[0,-7],[-5,-10]],'#635a51');
    if(player.features.includes('small blue antlers')){ctx.strokeStyle='#a8d9df';ctx.lineWidth=1.5;ctx.beginPath();ctx.moveTo(-3,-27);ctx.lineTo(-5,-34);ctx.lineTo(-8,-37);ctx.moveTo(-5,-34);ctx.lineTo(-1,-36);ctx.moveTo(4,-27);ctx.lineTo(6,-34);ctx.lineTo(10,-37);ctx.moveTo(6,-34);ctx.lineTo(2,-36);ctx.stroke();ctx.strokeStyle='#111019';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(2,-19,6,5,-.5,0,Math.PI*2);ctx.stroke()}
    if(player.features.includes('reflective face mask')){ctx.fillStyle='#a6d6d8';ctx.fillRect(5,-19,5,3);ctx.fillStyle='#ed773f';ctx.fillRect(5,-16,4,1)}
    if(player.features.includes('facial rune')){ctx.fillStyle='#e5c35c';ctx.fillRect(-5,-15,1,2);ctx.fillRect(3,-17,1,2);ctx.fillRect(-3,-12,1,2)}
    if(player.features.includes('feline ears')){ctx.fillStyle='#c91f38';ctx.fillRect(-2,-22,1,1);ctx.fillRect(4,-22,1,1);ctx.fillStyle='#fff4dc';ctx.fillRect(-1,-17,7,2);ctx.fillStyle='#d04abb';ctx.fillRect(-8,-6,2,1)}
    if(player.features.includes('feline ears')){poly([[-5,-25],[-10,-32],[-2,-27]],skin);poly([[4,-26],[10,-32],[9,-24]],skin)}
    if(player.features.includes('wolf-eared hood')){poly([[-5,-27],[-10,-38],[-2,-31]],'#147445');poly([[5,-27],[12,-38],[11,-27]],'#167e4b')}
    if(player.features.includes('tall ornate purple witch hat')){poly([[-8,-28],[8,-28],[3,-53],[-2,-41]],'#4e2b8a');ctx.fillStyle='#d8c9f2';ctx.fillRect(-8,-31,16,2)}
    if(rig==='orc'){ctx.fillStyle=hair;ctx.fillRect(-2,-37,7,8)}
  }
  drawOnCourtSignature(player);
  if(player.features.includes('warm amber lantern')){ctx.strokeStyle='#7a643f';ctx.lineWidth=1;ctx.strokeRect(12,-11,7,11);ctx.fillStyle='#ffca58';ctx.fillRect(14,-9,4,7);ctx.fillStyle='#ffe59d';ctx.globalAlpha=.28;ctx.fillRect(11,-12,9,12);ctx.globalAlpha=1}
  if(player.features.includes('signature guitar')){circle(-12,-9,3,'#d17d3a');circle(-10,-6,3,'#bd6439');ctx.strokeStyle='#e8c47a';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-11,-8);ctx.lineTo(-18,-24);ctx.stroke();ctx.fillStyle='#ead59b';ctx.fillRect(-20,-27,5,4)}
  if(player.features.includes('British flag accents')){ctx.fillStyle='#29477f';ctx.fillRect(-7,-3,6,5);ctx.fillStyle='#fff';ctx.fillRect(-4.5,-3,1.2,5);ctx.fillRect(-7,-1,6,1.2);ctx.fillStyle='#d74549';ctx.fillRect(-4.1,-3,.5,5);ctx.fillRect(-7,-.6,6,.5)}
  if(p.hasBall||match.ball.lastTouch===p.id&&['shot','dunk'].includes(match.ball.mode)){ctx.fillStyle='#f0a646';ctx.beginPath();ctx.arc(11,-10,3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#7b422d';ctx.lineWidth=.7;ctx.beginPath();ctx.arc(11,-10,2.5,-.9,.9);ctx.stroke();}
  ctx.restore();drawAthleteOverlays(p,player,x,y,false);
}
function drawRosterGameSprite(p,player,x,y,scale,bob){
  const sprite=selectProductionSprite(p,productionSpriteAssets)??rosterSpriteInfo(p);if(!sprite)return false;
  const {atlas,sx,sy,sourceWidth,sourceHeight}=sprite,depthScale=stagePreview?1:.9+Math.max(0,Math.min(100,p.y))*.0018,spriteScale=scale*depthScale;
  ctx.fillStyle='#160e1b99';ctx.beginPath();ctx.ellipse(x,y+7*cameraZoom/100,18*spriteScale,4.2*spriteScale,0,0,Math.PI*2);ctx.fill();
  ctx.save();ctx.translate(Math.round(x),Math.round(y-bob));ctx.scale(sprite.flip?-1:1,1);
  const spriteHeight=78*spriteScale,spriteWidth=64*spriteScale*(sourceWidth/sourceHeight/.82);ctx.imageSmoothingEnabled=false;ctx.globalAlpha=p.anim==='knockdown'?.86:1;
  ctx.drawImage(atlas,sx,sy,sourceWidth,sourceHeight,-spriteWidth/2,-spriteHeight+7*cameraZoom/100,spriteWidth,spriteHeight);
  if(p.anim==='run'){ctx.strokeStyle='#c6f4f2a0';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(-spriteWidth*.34,-spriteHeight*.2);ctx.lineTo(-spriteWidth*.45,-spriteHeight*.2);ctx.moveTo(-spriteWidth*.3,-spriteHeight*.36);ctx.lineTo(-spriteWidth*.4,-spriteHeight*.36);ctx.stroke()}
  if(player.number){ctx.font='bold 6px monospace';ctx.textAlign='center';ctx.lineWidth=1.5;ctx.strokeStyle='#172033';ctx.strokeText(String(player.number),0,-spriteHeight*.48);ctx.fillStyle='#fff1aa';ctx.fillText(String(player.number),0,-spriteHeight*.48);ctx.textAlign='left'}
  ctx.restore();drawAthleteOverlays(p,player,x,y,true);return true;
}
function rosterSpriteInfo(player){
  const roster=rosterDirectory.get(player.id);if(!roster)return null;const {teamIndex,rosterIndex,athlete}=roster,captain=athlete.captain,index=captain?teamIndex:teamIndex*2+rosterIndex-1,{action:actionName,runFrame,actionFrame}=legacySpritePose(player),runAtlas=(captain?captainRunCycle:supportingRunCycle)[runFrame],action=actionAtlases[actionName],actionFrames=action&&(captain?action.captain:action.supporting),actionAtlas=actionFrames?.[actionFrame]?.complete&&actionFrames[actionFrame].naturalWidth?actionFrames[actionFrame]:actionFrames?.[0],atlas=runFrame>=0?runAtlas:actionAtlas?.complete&&actionAtlas.naturalWidth?actionAtlas:(captain?captainGameplayAtlas:supportingGameplayAtlas),columns=captain?7:10,rows=captain?5:7;
  if(!atlas.complete||!atlas.naturalWidth)return null;
  const sourceWidth=atlas.naturalWidth/columns,sourceHeight=atlas.naturalHeight/rows,col=index%columns,row=Math.floor(index/columns);
  return {atlas,sx:col*sourceWidth,sy:row*sourceHeight,sourceWidth,sourceHeight,flip:player.facing<0};
}
function rosterPortraitInfo(player){
  const roster=rosterDirectory.get(player.id);if(!roster)return null;const {teamIndex,rosterIndex,athlete}=roster;if(athlete.id==='e-indigo'&&eIndigoPortrait.complete&&eIndigoPortrait.naturalWidth){const sourceHeight=eIndigoPortrait.naturalHeight,sourceWidth=sourceHeight*23/45;return {atlas:eIndigoPortrait,sx:(eIndigoPortrait.naturalWidth-sourceWidth)/2,sy:0,sourceWidth,sourceHeight}}const captain=athlete.captain,atlas=captain?captainAtlas:supportingPortraitAtlas,columns=captain?7:10,rows=captain?5:7,index=captain?teamIndex:teamIndex*2+rosterIndex-1;
  if(!atlas.complete||!atlas.naturalWidth)return null;
  const sourceWidth=atlas.naturalWidth/columns,sourceHeight=atlas.naturalHeight/rows,col=index%columns,row=Math.floor(index/columns);
  return {atlas,sx:col*sourceWidth,sy:row*sourceHeight,sourceWidth,sourceHeight};
}
function drawAthleteOverlays(p,player,x,y,generated=false){
  const bodyHeight=(generated?78*(stagePreview?1:.9+Math.max(0,Math.min(100,p.y))*.0018):34)*athleteVisualScale(player,cameraZoom)*(stagePreview?JAM_STAGE.rendererSpriteScale*stageDepthScale(p.y):1);
  if(controlled.includes(p.id)){ctx.save();ctx.strokeStyle='#f9f3d5';ctx.lineWidth=1.4;ctx.shadowColor='#10efff';ctx.shadowBlur=6;ctx.beginPath();ctx.ellipse(x,y+4,15,4.4,0,0,Math.PI*2);ctx.stroke();ctx.shadowBlur=0;ctx.fillStyle='#081323';ctx.fillRect(x-8,y-bodyHeight-12,16,10);ctx.strokeStyle='#2ff5eb';ctx.strokeRect(x-8.5,y-bodyHeight-12-.5,17,11);ctx.fillStyle='#fff';ctx.font='bold 6px monospace';ctx.textAlign='center';ctx.fillText('P1',x,y-bodyHeight-5);ctx.textAlign='left';ctx.restore()}
  if(teamMarkers){const mx=Math.round(x),my=Math.round(y-bodyHeight);ctx.fillStyle='#0c0a12';ctx.fillRect(mx-8,my-7,16,13);ctx.strokeStyle='#fff5d7';ctx.lineWidth=1;ctx.strokeRect(mx-8.5,my-7.5,17,14);ctx.fillStyle='#fff5d7';if(p.team===0){ctx.beginPath();ctx.moveTo(mx,my-5);ctx.lineTo(mx+4,my-1);ctx.lineTo(mx,my+3);ctx.lineTo(mx-4,my-1);ctx.closePath();ctx.fill()}else{ctx.beginPath();ctx.arc(mx,my-1,3.4,0,Math.PI*2);ctx.fill()}ctx.fillStyle='#fff';ctx.font='bold 5px monospace';ctx.textAlign='center';ctx.fillText(p.team===0?'H':'A',mx,my+5);ctx.textAlign='left'}
  if(p.hasBall&&p.onFire){ctx.fillStyle='#ffdf55';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText('FIRE!',x,y-bodyHeight-9);ctx.textAlign='left'}
  if(Math.abs(x-240)<80&&(p.hasBall||controlled.includes(p.id))){ctx.fillStyle='#f7ebd0';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText(p.name,x,y+18);ctx.textAlign='left'}
}
function drawBall(b){if(b.mode==='dead')return;const [x,groundY]=project(b.x,b.y,0),owner=match.players.find(p=>p.id===(b.mode==='carried'?b.ownerId:b.mode==='pass'?b.aerialTargetId:null)),sizeScale=cameraZoom/100,flightScale=stagePreview?1.18:1,y=groundY-ballHeightPixels(b,owner)*sizeScale*flightScale,sx=x,sy=groundY,r=(stagePreview?JAM_STAGE.ballDiameterPixels/2:5.2)*sizeScale;ctx.fillStyle='#170e18a0';ctx.beginPath();ctx.ellipse(sx,sy+2,stagePreview?11:6,stagePreview?3.6:2,0,0,Math.PI*2);ctx.fill();ctx.save();ctx.shadowColor='#ffe28a';ctx.shadowBlur=stagePreview?11:7;circle(x,y,r,'#f6a33d');ctx.restore();ctx.strokeStyle='#713b25';ctx.lineWidth=stagePreview?1.5:1;ctx.beginPath();ctx.arc(x,y,r*.78,-.8,.8);ctx.moveTo(x-r*.8,y);ctx.quadraticCurveTo(x,y+2,x+r*.8,y);ctx.stroke();}
function drawHudPlayerCard(player,x,teamColors){
  ctx.fillStyle='#111021eF';ctx.fillRect(x,2,62,58);ctx.strokeStyle=teamColors[2];ctx.lineWidth=1.5;ctx.strokeRect(x+.5,2.5,61,57);
  if(player){const athlete=rosterDirectory.get(player.id)?.athlete,sprite=athlete&&(rosterPortraitInfo(athlete)||rosterSpriteInfo(athlete));ctx.save();ctx.beginPath();ctx.rect(x+2,4,23,45);ctx.clip();if(sprite){ctx.imageSmoothingEnabled=false;ctx.drawImage(sprite.atlas,sprite.sx,sprite.sy,sprite.sourceWidth,sprite.sourceHeight,x+2,4,23,45)}ctx.restore();
    ctx.fillStyle='#fff2d4';ctx.font='bold 6px monospace';ctx.textAlign='left';ctx.fillText(player.name.length>7?`${player.name.slice(0,6)}…`:player.name,x+27,14);ctx.fillStyle='#b9c8ee';ctx.font='5px monospace';ctx.fillText(`#${athlete?.number??'--'}`,x+27,23);ctx.fillStyle='#302a3e';ctx.fillRect(x+27,29,30,4);ctx.fillStyle=player.onFire?'#ff663e':'#42d5c4';ctx.fillRect(x+27,29,30*Math.max(0,Math.min(1,player.stamina/100)),4);ctx.fillStyle=player.onFire?'#ffcc55':'#a8b4c8';ctx.font='5px monospace';ctx.fillText(player.onFire?'ON FIRE':'TURBO',x+27,42);if(player.hasBall){ctx.fillStyle='#f4ad46';ctx.fillRect(x+27,49,4,4);ctx.fillStyle='#fff2d4';ctx.fillText('BALL',x+33,53)}
  }
}
function drawHUD(){
  const [homeScore,awayScore]=match.score,home=teamById(homeSelect.value),away=teamById(awaySelect.value),homePlayers=match.players.filter(p=>p.team===0).slice(0,2),awayPlayers=match.players.filter(p=>p.team===1).slice(0,2);
  ctx.fillStyle='#0b0d22f5';ctx.fillRect(0,0,480,63);ctx.fillStyle='#20264a';ctx.fillRect(128,1,224,61);ctx.strokeStyle='#1b89ff';ctx.lineWidth=1.5;ctx.strokeRect(128.5,1.5,223,60);ctx.strokeStyle='#eeb24b';ctx.strokeRect(132,4,88,54);ctx.strokeRect(260,4,88,54);
  drawHudPlayerCard(homePlayers[0],2,home.colors);drawHudPlayerCard(homePlayers[1],65,home.colors);drawHudPlayerCard(awayPlayers[0],353,away.colors);drawHudPlayerCard(awayPlayers[1],416,away.colors);
  ctx.textAlign='center';ctx.fillStyle='#fff0bb';ctx.font='bold 6px monospace';ctx.fillText(home.name.toUpperCase(),176,11);ctx.fillText(away.name.toUpperCase(),304,11);
  ctx.shadowColor='#ff372f';ctx.shadowBlur=4;ctx.fillStyle='#ffd23e';ctx.font='bold 24px monospace';ctx.fillText(String(homeScore).padStart(2,'0'),176,40);ctx.fillText(String(awayScore).padStart(2,'0'),304,40);ctx.shadowBlur=0;
  ctx.fillStyle='#4dd7d1';ctx.font='bold 9px monospace';ctx.fillText(match.phase==='overtime'?`OT${match.period-4}`:`Q${Math.min(match.period,4)}`,240,13);const time=match.clock>=9999?'--:--':`${Math.floor(match.clock/60)}:${String(Math.floor(match.clock%60)).padStart(2,'0')}`;ctx.fillStyle='#fff';ctx.font='bold 12px monospace';ctx.fillText(time,240,33);ctx.fillStyle='#f1bd50';ctx.font='bold 7px monospace';ctx.fillText(`SHOT ${Math.ceil(match.shotClock)}`,240,53);ctx.textAlign='left';
  if(audioCaptions&&match.lastEvent){ctx.fillStyle='#050b20d9';ctx.fillRect(6,65,match.lastEvent.length*4.8+10,14);ctx.fillStyle='#76eeff';ctx.font='bold 8px monospace';ctx.fillText(match.lastEvent.slice(0,70).toUpperCase(),10,75)}
  const p=match.players.find(a=>a.id===controlled[0]);if(p){ctx.fillStyle='#14101d';ctx.fillRect(8,80,88,5);ctx.fillStyle=p.onFire?'#f46931':'#4dd3c5';ctx.fillRect(8,80,p.onFire?88:88*p.stamina/100,5);if(p.charge>0){ctx.fillStyle='#34232a';ctx.fillRect(8,87,88,4);ctx.fillStyle='#ffca57';ctx.fillRect(8,87,88*Math.min(1,p.charge/30),4)}ctx.fillStyle='#fff';ctx.font='6px monospace';ctx.fillText(`${p.name.toUpperCase()} ${p.onFire?'ON FIRE':''}`,8,99)}
}
function drawOverlay(title,subtitle,footer){ctx.fillStyle='#110c19dc';ctx.fillRect(60,112,360,130);ctx.strokeStyle='#e5bd61';ctx.lineWidth=2;ctx.strokeRect(60,112,360,130);ctx.fillStyle='#ffd15e';ctx.textAlign='center';ctx.font='bold 23px monospace';ctx.fillText(title,240,148);ctx.fillStyle='#fff3d2';ctx.font='bold 12px monospace';ctx.fillText(subtitle,240,180);ctx.fillStyle='#9de6db';ctx.font='bold 10px monospace';ctx.fillText(footer,240,216);ctx.textAlign='left'}
function drawFinal(){
  ctx.fillStyle='#140e1eea';ctx.fillRect(48,65,384,230);ctx.strokeStyle='#e5bd61';ctx.lineWidth=2;ctx.strokeRect(48,65,384,230);ctx.textAlign='center';
  ctx.fillStyle='#ffd15e';ctx.font='bold 23px monospace';ctx.fillText('FINAL BUZZER',240,96);ctx.fillStyle='#fff';ctx.font='bold 11px monospace';ctx.fillText(`${match.teamNames[0]}  ${match.score[0]}  —  ${match.score[1]}  ${match.teamNames[1]}`,240,126);ctx.fillStyle='#74e0ca';ctx.font='bold 17px monospace';ctx.fillText(`${match.teamNames[match.winner]} WIN!`,240,156);
  ctx.fillStyle='#b9acbf';ctx.font='bold 7px monospace';ctx.fillText(boxScoreHeader,240,173);ctx.fillStyle='#f5e7c3';ctx.font='7px monospace';
  const box=[...(match.playerBox??[]),...match.players];for(let i=0;i<box.length;i++)ctx.fillText(formatBoxScoreRow(box[i]),240,189+i*11);
  if(match.campaignResult){ctx.fillStyle='#f6c95f';ctx.font='bold 10px monospace';ctx.fillText(`SEASON: ${match.campaignResult}  ${saved.season.wins}/${seasonLength}`,240,249)}if(match.tournamentResult){ctx.fillStyle='#f6c95f';ctx.font='bold 10px monospace';ctx.fillText(`JAM CUP: ${match.tournamentResult}`,240,261)}ctx.fillStyle='#c4b6ca';ctx.font='10px monospace';ctx.fillText('ENTER  ·  REMATCH     ESC  ·  TEAM SELECT',240,273);ctx.textAlign='left';
}

function resize(){if(canvas.width!==480||canvas.height!==360){canvas.width=480;canvas.height=360;ctx.imageSmoothingEnabled=false;}}
window.addEventListener('resize',resize);new ResizeObserver(resize).observe(canvas);resize();
window.addEventListener('keydown',e=>{if(mode==='game'&&match?.phase==='final'){const k=e.key.toLowerCase();if(k==='enter'){beginMatch({practice});}else if(k==='escape')$('back-menu').click();}});
if(validateLeague(teams).errors.length)console.error('League validation failed',validateLeague(teams));
window.jamverse={teams,start:(homeId=teams[0].id,awayId=teams[26].id,quarterSeconds=30,seed=3)=>{homeSelect.value=homeId;awaySelect.value=awayId;syncLineup(homeSelect,homeLineup);syncLineup(awaySelect,awayLineup);beginMatch();match.quarterSeconds=quarterSeconds;match.clock=quarterSeconds;match.seed=seed;match.rng=seed>>>0;},tick:(count=1,frames=[])=>{for(let n=0;n<count&&match?.phase!=='final';n++)stepMatch(match,frames);render();return match;},get state(){return match;},get controlledPlayers(){return [...controlled];},get keyState(){return {keys:[...keys],pressed:[...pressed],binding:Boolean(bindingCapture),map:keysByPlayer[0],inputs:ui.lastInputFrames};},get audioStatus(){return {music:Boolean(ui.musicTimer),state:audio?.state??'unavailable'}},get rosterCheck(){return validateLeague(teams);}};
// Compact, original pixel portrait preview in the title card: highlights the selected canonical captain.
function titlePreview(){const old=$('preview');if(old)return;}
