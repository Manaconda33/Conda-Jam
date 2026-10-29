import test from 'node:test';
import assert from 'node:assert/strict';
import { compareAudits, normalizeAudit } from '../tools/captain-studio/compare-audits.mjs';
const old={generatedAt:'first',errors:[{code:'missing-clip',athlete:'a',clip:'idle',direction:'left'},{code:'prompt-not-verbatim',athlete:'b'}],missingClipCount:1,targetShortfalls:0};
test('inherited audit findings remain visible while exact gaps may be resolved',()=>{
 const current={...old,generatedAt:'second',errors:[old.errors[1]],missingClipCount:0};
 const result=compareAudits(old,current);
 assert.equal(result.ok,true);assert.equal(result.baselineFindings.length,2);assert.equal(result.currentFindings.length,1);assert.equal(result.resolved.length,1);
});
test('new detail, duplicated error, shortfall, and increased directional gaps fail closed',()=>{
 for(const current of [{...old,errors:[...old.errors,{...old.errors[0],direction:'right'}]},{...old,errors:[...old.errors,old.errors[1]]},{...old,missingClipCount:2},{...old,targetShortfalls:1}]) assert.equal(compareAudits(old,current).ok,false);
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
