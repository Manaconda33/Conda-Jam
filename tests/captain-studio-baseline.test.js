import test from 'node:test';
import assert from 'node:assert/strict';
import { compareAudits, normalizeAudit } from '../tools/captain-studio/compare-audits.mjs';
const old={generatedAt:'first',errors:[{code:'missing-clip',athlete:'a',clip:'idle',direction:'left'},{code:'prompt-not-verbatim',athlete:'b'}],missingClipCount:1,targetShortfalls:[]};
test('inherited audit findings remain visible while exact gaps may be resolved',()=>{
 const current={...old,generatedAt:'second',errors:[old.errors[1]],missingClipCount:0};
 const result=compareAudits(old,current);
 assert.equal(result.ok,true);assert.equal(result.baselineFindings.length,2);assert.equal(result.currentFindings.length,1);assert.equal(result.resolved.length,1);
});
test('new detail, duplicated error, shortfall, and increased directional gaps fail closed',()=>{
 for(const current of [{...old,missingClipCount:2,errors:[...old.errors,{...old.errors[0],direction:'right'}]},{...old,errors:[...old.errors,old.errors[1]]},{...old,missingClipCount:2,errors:[...old.errors,{code:'missing-clip',athlete:'c',clip:'idle',direction:'right'}]},{...old,targetShortfalls:[{athlete:'a',clip:'idle',direction:'left',target:5,minimum:3,actual:4}]}]) assert.equal(compareAudits(old,current).ok,false);
 assert.throws(()=>compareAudits(old,{errors:[]}));
});
test('normalized audit is stable across run clocks without losing findings',()=>{
 assert.deepEqual(normalizeAudit(old),normalizeAudit({...old,generatedAt:'other'}));
 assert.deepEqual(normalizeAudit(old).errors,old.errors);
 assert.equal(Object.hasOwn(normalizeAudit(old),'generatedAt'),false);
});
test('audit finding and result enumeration does not change normalized bytes',()=>{
 const a={...old,results:[{athlete:'z'},{athlete:'a'}]};
 const b={...a,errors:[...a.errors].reverse(),results:[...a.results].reverse()};
 assert.deepEqual(normalizeAudit(a),normalizeAudit(b));
});

import { readFileSync } from 'node:fs';
function readPinnedAudit(){
 const record=JSON.parse(readFileSync(new URL('./fixtures/captain-studio/baselines/kraken-reference.json',import.meta.url)));
 if(record.format!=='captain-studio-audit-findings-v1')return record;
 const {format,players,clips,classifications,donors,lineages,missing,prompts,...audit}=record;
 const direction=value=>value===0?'left':value===1?'right':null;
 audit.errors=[
  ...missing.map(([athlete,clip,facing,classification])=>({code:'missing-clip',athlete:players[athlete],clip:clips[clip],direction:direction(facing),classification:classifications[classification]})),
  ...prompts.map(([athlete,clip,facing,classification,donor,lineage])=>({
   code:'prompt-not-verbatim',athlete:players[athlete],clip:clips[clip],direction:direction(facing),
   ...(donor>=0?{donor:donors[donor]}:{}),...(lineage>=0?{lineage:lineages[lineage]}:{}),
   classification:classifications[classification],
  })),
 ];
 return audit;
}
test('combined candidate strict audit baseline accepts its 706 gaps and forty inherited prompts',()=>{
 const audit=readPinnedAudit();
 assert.equal(audit.missingClipCount,706);assert.equal(audit.errors.length,746);
 assert.equal(audit.errors.filter(error=>error.code==='prompt-not-verbatim').length,40);
 assert.equal(compareAudits(audit,audit).ok,true);
});
test('exact shortfall detail changes fail even when counts stay equal',()=>{
 const baseline={...old,targetShortfalls:[{athlete:'a',clip:'idle',direction:'left',target:5,minimum:3,actual:4}]};
 const current={...baseline,targetShortfalls:[{athlete:'a',clip:'idle',direction:'left',target:5,minimum:3,actual:3}]};
 assert.equal(compareAudits(baseline,current).ok,false);
 assert.deepEqual(normalizeAudit(baseline).targetShortfalls,baseline.targetShortfalls);
});
test('malformed shortfalls and inconsistent missing counts fail closed',()=>{
 for(const change of [{targetShortfalls:0},{targetShortfalls:[null]},{targetShortfalls:['bad']},{missingClipCount:0},{missingClipCount:2}]) assert.throws(()=>compareAudits(old,{...old,...change}));
});
test('shortfall normalization is ordered and exact duplicates are new findings',()=>{
 const first={athlete:'a',clip:'idle',direction:'right',minimum:3,target:5,actual:4};
 const second={...first,athlete:'b'};
 const a={...old,targetShortfalls:[first,second]},b={...a,targetShortfalls:[second,first]};
 assert.deepEqual(normalizeAudit(a),normalizeAudit(b));
 assert.equal(compareAudits(a,b).ok,true);
 assert.equal(compareAudits(a,{...a,targetShortfalls:[first,second,first]}).ok,false);
});
test('missing directional findings require actual athlete clip and facing',()=>{
 for(const error of [{code:'missing-clip'},{code:'missing-clip',athlete:'a',clip:'idle',direction:'up'}]) {
  const audit={...old,errors:[error]};assert.throws(()=>compareAudits(audit,audit));
 }
});
