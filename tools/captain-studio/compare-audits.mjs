import { createHash } from 'node:crypto';
import { canonicalJson } from './canonical-json.mjs';
const hash = value => createHash('sha256').update(canonicalJson(value)).digest('hex');
const ordered = values => [...values].sort((a,b)=>{const x=canonicalJson(a),y=canonicalJson(b);return x<y?-1:x>y?1:0;});
function validate(audit) {
  if (!audit || !Array.isArray(audit.errors) || !Number.isSafeInteger(audit.missingClipCount) || audit.missingClipCount < 0 || !Array.isArray(audit.targetShortfalls)) throw new TypeError('Malformed strict audit');
  canonicalJson(audit);
  for (const error of audit.errors) if (!error || typeof error !== 'object' || Array.isArray(error) || typeof error.code !== 'string' || !error.code) throw new TypeError('Malformed audit finding');
  for (const error of audit.errors.filter(row=>row.code==='missing-clip')) {
    if (!['athlete','clip'].every(key=>typeof error[key]==='string' && error[key]) || !['left','right'].includes(error.direction)) throw new TypeError('Malformed missing-clip context');
  }
  if (audit.errors.filter(error=>error.code==='missing-clip').length !== audit.missingClipCount) throw new TypeError('Missing count does not match directional findings');
  for (const row of audit.targetShortfalls) {
    if (!row || !['athlete','clip'].every(key=>typeof row[key]==='string' && row[key]) || !['left','right'].includes(row.direction) || !['target','minimum','actual'].every(key=>Number.isSafeInteger(row[key]) && row[key]>=0) || row.minimum>row.target || row.actual>=row.target) throw new TypeError('Malformed target shortfall');
  }
}
export function normalizeAudit(audit) {
  validate(audit);
  const {generatedAt: omitted,...stable} = audit;
  stable.errors=ordered(stable.errors);
  stable.targetShortfalls=ordered(stable.targetShortfalls);
  if (Array.isArray(stable.results)) stable.results=ordered(stable.results);
  return JSON.parse(canonicalJson(stable));
}
function compareFindings(before,after) {
  const baselineFindings=ordered(before).map(detail=>({hash:hash(detail),detail}));
  const currentFindings=ordered(after).map(detail=>({hash:hash(detail),detail}));
  const remaining=[...baselineFindings],added=[];
  for(const finding of currentFindings) {
    const index=remaining.findIndex(old=>old.hash===finding.hash);
    if(index<0) added.push(finding); else remaining.splice(index,1);
  }
  return {baselineFindings,currentFindings,added,resolved:remaining};
}
export function compareAudits(baseline, current) {
  validate(baseline);validate(current);
  const errors=compareFindings(baseline.errors,current.errors);
  const shortfalls=compareFindings(baseline.targetShortfalls,current.targetShortfalls);
  return {ok:errors.added.length===0 && shortfalls.added.length===0 && current.missingClipCount<=baseline.missingClipCount,
    ...errors,shortfalls,
    missingIncrease:Math.max(0,current.missingClipCount-baseline.missingClipCount),
    shortfallIncrease:Math.max(0,current.targetShortfalls.length-baseline.targetShortfalls.length),
    normalizedAuditHash:hash(normalizeAudit(current))};
}
