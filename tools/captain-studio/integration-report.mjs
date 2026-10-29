import { createHash } from 'node:crypto';
import { canonicalJson } from './canonical-json.mjs';

export function canonicalSerialize(value) {
  return Buffer.from(canonicalJson(value).replace(/\r\n?/g, '\n'), 'utf8');
}

const stablePackages = rows => [...(rows ?? [])].map(row => ({
  captainId: row.captainId,
  packageId: row.packageId,
  ...(row.reasonCodes ? { reasonCodes: [...row.reasonCodes].sort() } : {}),
  ...(row.rebaseAndReviewRequired ? { rebaseAndReviewRequired: true } : {}),
})).sort((a, b) => a.captainId.localeCompare(b.captainId) || a.packageId.localeCompare(b.packageId));

export function renderIntegrationReport(record) {
  const stable = {
    version: 1,
    batchId: record.batchId,
    baseCommit: record.baseCommit,
    acceptedPackages: stablePackages(record.acceptedPackages),
    rejectedPackages: stablePackages(record.rejectedPackages),
    ...(record.normalizedAuditHash ? { normalizedAuditHash: record.normalizedAuditHash } : {}),
    ...(record.normalizedAuditReport ? { normalizedAuditReport: record.normalizedAuditReport } : {}),
    ...(record.rejectionCodes ? { rejectionCodes: [...record.rejectionCodes].sort() } : {}),
  };
  return `${canonicalJson(stable)}\n`;
}

export function renderIntegrationLedger(record) {
  const rows = [
    ...stablePackages(record.acceptedPackages).map(row => ({ batchId: record.batchId, baseCommit: record.baseCommit, state: 'integrated', ...row })),
    ...stablePackages(record.rejectedPackages).map(row => ({ batchId: record.batchId, baseCommit: record.baseCommit, state: 'rejected', ...row })),
  ].sort((a, b) => a.captainId.localeCompare(b.captainId) || a.packageId.localeCompare(b.packageId));
  return rows.map(row => canonicalJson(row)).join('\n') + (rows.length ? '\n' : '');
}

export function activityRecordHash(records) {
  return createHash('sha256').update(canonicalSerialize(records)).digest('hex');
}
