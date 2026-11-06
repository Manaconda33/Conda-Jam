import { randomUUID, createHash } from 'node:crypto';
import { canonicalJson } from './canonical-json.mjs';
import { canonicalFileInventory } from './package-hash.mjs';
const sha=value=>typeof value==='string' && /^[a-f0-9]{64}$/.test(value);
const text=value=>typeof value==='string' && value.length>0;
function validateRequest(value) {
  if(!value || !['captainId','workerSessionId','reviewerSessionId','dispatchId','nonce'].every(key=>text(value[key])) || value.workerSessionId===value.reviewerSessionId || !sha(value.artworkDigest) || !sha(value.trackDigest) || !['artwork','track-gameplay','full-set'].includes(value.scope)) throw new TypeError('Stable distinct review session and frozen inputs required');
  canonicalJson(value);
}
export function reviewRequestHash(request) {
  validateRequest(request);
  return createHash('sha256').update(canonicalJson(request)).digest('hex');
}
/** Coordinator only: persist this issued request outside worker-controlled evidence. */
export function issueReviewRequest({captainId,artworkDigest,trackDigest,scope,workerSessionId,reviewerSessionId,dispatchId}) {
  const request={captainId,artworkDigest,trackDigest,scope,workerSessionId,reviewerSessionId,dispatchId,nonce:randomUUID()};
  validateRequest(request);return request;
}
/** Read-only evidence check; trusted issuance/dispatch ledgers MUST be coordinator-owned.
 * This checks auditable session separation, not cryptographic identity. Nonce consumption
 * belongs to the later atomic integrator, not validation. */
export function verifyReviewApproval({approval,issuedRequests,dispatchRecords,usedNonces}) {
  const errors=[];
  try {
    if(!Array.isArray(issuedRequests) || !Array.isArray(dispatchRecords) || !Array.isArray(usedNonces) || !approval || typeof approval!=='object') throw new TypeError('Review ledgers and approval required');
    if(usedNonces.some(value=>!text(value))) throw new TypeError('Malformed replay ledger');
    canonicalJson(approval);
    const allowed=new Set(['nonce','captainId','artworkDigest','trackDigest','scope','reviewerSessionId','result','evidence']);
    if(Object.keys(approval).some(key=>!allowed.has(key))) errors.push('UNEXPECTED_APPROVAL_FIELD');
    const matches=issuedRequests.filter(row=>row.nonce===approval.nonce);
    if(matches.length!==1) return {ok:false,errors:['UNISSUED_OR_AMBIGUOUS_REQUEST']};
    const request=matches[0];validateRequest(request);
    if(usedNonces.includes(request.nonce)) errors.push('REPLAYED_REVIEW_NONCE');
    for(const key of ['nonce','captainId','artworkDigest','trackDigest','scope','reviewerSessionId']) if(approval[key]!==request[key]) errors.push('REVIEW_BINDING_MISMATCH');
    const dispatches=dispatchRecords.filter(row=>row.id===request.dispatchId);
    if(dispatches.length!==1 || dispatches[0].requestHash!==reviewRequestHash(request) || !['captainId','workerSessionId','reviewerSessionId'].every(key=>dispatches[0][key]===request[key])) errors.push('DISPATCH_EVIDENCE_MISMATCH');
    if(approval.result!=='accepted') errors.push('REVIEW_NOT_ACCEPTED');
    if(!Array.isArray(approval.evidence) || approval.evidence.length===0) errors.push('MISSING_REVIEW_EVIDENCE');
    else {
      canonicalFileInventory(approval.evidence);
      if(approval.evidence.some(row=>Object.keys(row).some(key=>!['path','sha256'].includes(key)))) errors.push('UNEXPECTED_EVIDENCE_FIELD');
    }
  } catch {errors.push('MALFORMED_REVIEW');}
  return {ok:errors.length===0,errors:[...new Set(errors)].sort()};
}
