import test from 'node:test';
import assert from 'node:assert/strict';
import { anchorTick, sampleAnimation, sampleBallForward } from '../src/core/animation.js';

test('Reed has an athlete-specific separate shot ball track aligned at the release pose',()=>{
  const releaseTick=anchorTick('shoot','release');
  const pose=sampleAnimation('shoot',releaseTick);
  assert.equal(releaseTick,13);
  assert.equal(pose.frame,5);
  assert.equal(sampleBallForward('shoot',releaseTick,'reed-ashcroft'),11.5);
  for(const facing of [-1,1]){
    const playerX=100;
    const ballX=playerX+facing*sampleBallForward('shoot',releaseTick,'reed-ashcroft');
    assert.equal(Math.abs(ballX-playerX),11.5,'the separate ball stays on Reed’s forward release hand');
  }
});
