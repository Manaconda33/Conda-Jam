import test from 'node:test';
import assert from 'node:assert/strict';
import {updateCameraX} from '../src/render/camera-tracking.js';

test('camera holds position while action stays inside its dead zone',()=>{
 assert.equal(updateCameraX(100,{x:106,vx:0},1/60),100);
 assert.equal(updateCameraX(100,{x:100,vx:0},1/60),100);
});

test('camera leads moving ball action and eases toward it without a jump',()=>{
 const next=updateCameraX(50,{x:70,vx:8},1/60);
 assert.ok(next>50);
 assert.ok(next<51,'one rendered frame must not teleport the camera');
 assert.ok(next<70,'camera follows smoothly rather than snapping to the target');
});

test('camera remains bounded to the court and clamps invalid zoom values',()=>{
 assert.equal(updateCameraX(-30,{x:-30,vx:-10},1),0);
 assert.equal(updateCameraX(230,{x:230,vx:10},1),200);
 assert.ok(Number.isFinite(updateCameraX(100,{x:180,vx:4},1/60,NaN)));
});

test('camera follow is time based and turnover targets do not snap across court',()=>{
 const oneFrame=updateCameraX(80,{x:130,vx:0},1/60);
 const twoFrames=updateCameraX(oneFrame,{x:130,vx:0},1/60);
 assert.ok(twoFrames>oneFrame);
 assert.ok(oneFrame<81&&twoFrames<82);
 let sixtyHz=80;
 for(let frame=0;frame<6;frame++)sixtyHz=updateCameraX(sixtyHz,{x:130,vx:0},1/60);
 let thirtyHz=80;
 for(let frame=0;frame<3;frame++)thirtyHz=updateCameraX(thirtyHz,{x:130,vx:0},1/30);
 assert.ok(Math.abs(sixtyHz-thirtyHz)<1e-9,'equal elapsed time should produce equal follow distance');
});
