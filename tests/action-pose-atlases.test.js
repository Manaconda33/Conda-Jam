import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

const assets=join(import.meta.dirname,'../public/assets');

test('every primary basketball action has two transparent captain and partner keyframes for the complete roster',()=>{
  for(const action of ['pass','receive','push','block','rebound','pickup','celebrate','shoot','dunk']){
    for(const [group,width,height] of [['captains',448,480],['supporting',640,672]])for(const frame of [1,2]){
      const path=join(assets,frame===1?`action-${action}-${group}.webp`:`action-${action}-frame2-${group}.webp`);
      assert.ok(existsSync(path),`missing ${action} ${group} atlas`);
      assert.ok(statSync(path).size>10_000,`${action} ${group} atlas is empty`);
      const data=readFileSync(path);
      assert.equal(data.toString('ascii',0,4),'RIFF');
      assert.equal(data.toString('ascii',8,12),'WEBP');
      const extended=data.indexOf('VP8X');
      assert.notEqual(extended,-1,`${action} ${group} atlas must retain transparent alpha`);
      assert.equal(data.readUIntLE(extended+12,3)+1,width);
      assert.equal(data.readUIntLE(extended+15,3)+1,height);
    }
  }
});
