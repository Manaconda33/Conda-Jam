import { createHash } from 'node:crypto';
import { canonicalJson } from './canonical-json.mjs';
const hash = value => createHash('sha256').update(canonicalJson(value)).digest('hex');
function validate(audit) {
  if (!audit || !Array.isArray(audit.errors) || !Number.isSafeInteger(audit.missingClipCount) || audit.missingClipCount < 0 || !Number.isSafeInteger(audit.targetShortfalls) || audit.targetShortfalls < 0) throw new TypeError('Malformed strict audit');
  canonicalJson(audit);
}
export function normalizeAudit(audit) {
  validate(audit);
  const {generatedAt: omitted,...stable} = audit;
  const ordered=value=>[...value].sort((a,b)=>{const x=canonicalJson(a),y=canonicalJson(b);return x<y?-1:x>y?1:0;});
  stable.errors=ordered(stable.errors);
  if (Array.isArray(stable.results)) stable.results=ordered(stable.results);
  return JSON.parse(canonicalJson(stable));
}
export function compareAudits(baseline, current) {
  validate(baseline);validate(current);
  const baselineFindings=baseline.errors.map(detail=>({hash:hash(detail),detail}));
  const currentFindings=current.errors.map(detail=>({hash:hash(detail),detail}));
  const remaining=[...baselineFindings];
  const added=[];
  for(const finding of currentFindings) {
    const index=remaining.findIndex(old=>old.hash===finding.hash);
    if(index<0) added.push(finding); else remaining.splice(index,1);
  }
  return {ok:added.length===0 && current.missingClipCount<=baseline.missingClipCount && current.targetShortfalls<=baseline.targetShortfalls,
    baselineFindings,currentFindings,added,resolved:remaining,
    missingIncrease:Math.max(0,current.missingClipCount-baseline.missingClipCount),
    shortfallIncrease:Math.max(0,current.targetShortfalls-baseline.targetShortfalls),
    normalizedAuditHash:hash(normalizeAudit(current))};
}
