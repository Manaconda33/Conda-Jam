import test from 'node:test';
import assert from 'node:assert/strict';
import { issueReviewRequest, verifyReviewApproval, reviewRequestHash } from '../tools/captain-studio/review-requests.mjs';
const args={captainId:'captain-a',artworkDigest:'a'.repeat(64),trackDigest:'b'.repeat(64),scope:'artwork',workerSessionId:'worker-1',reviewerSessionId:'reviewer-2',dispatchId:'dispatch-3'};
const dispatch={id:'dispatch-3',workerSessionId:'worker-1',reviewerSessionId:'reviewer-2',captainId:'captain-a'};
function fixture(){const request=issueReviewRequest(args);return {request,approval:{nonce:request.nonce,captainId:args.captainId,artworkDigest:args.artworkDigest,trackDigest:args.trackDigest,scope:'artwork',reviewerSessionId:args.reviewerSessionId,result:'accepted',evidence:[{path:'reviews/art.md',sha256:'c'.repeat(64)}]},issuedRequests:[request],dispatchRecords:[{...dispatch,requestHash:reviewRequestHash(request)}],usedNonces:[]};}
test('coordinator-issued review binds fixed artwork and independent dispatch',()=>{
 const f=fixture();assert.equal(verifyReviewApproval(f).ok,true);
 assert.notEqual(issueReviewRequest(args).nonce,f.request.nonce);
 assert.throws(()=>issueReviewRequest({...args,reviewerSessionId:args.workerSessionId}));
});
test('spoofed or replayed reviews and changed artwork fail closed',()=>{
 const f=fixture();
 for(const change of [{issuedRequests:[]},{dispatchRecords:[]},{usedNonces:[null]},{usedNonces:[f.request.nonce]},{approval:{...f.approval,artworkDigest:'d'.repeat(64)}},{approval:{...f.approval,reviewerSessionId:'worker-1'}},{approval:{...f.approval,packageId:'e'.repeat(64)}},{approval:{...f.approval,evidence:[]}},{approval:{...f.approval,result:'rejected'}}]) assert.equal(verifyReviewApproval({...f,...change}).ok,false);
 assert.deepEqual(f.usedNonces,[]);
});

test('old dispatch evidence cannot authorize a new request or changed review scope',()=>{
 const old=fixture(), fresh=fixture();
 assert.equal(verifyReviewApproval({...fresh,dispatchRecords:old.dispatchRecords}).ok,false);
 const request={...fresh.request,scope:'track-gameplay'};
 assert.equal(verifyReviewApproval({...fresh,issuedRequests:[request],approval:{...fresh.approval,scope:request.scope}}).ok,false);
});
