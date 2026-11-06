import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { integrateCaptainBatch } from './captain-studio/integrate-batch.mjs';

export async function runIntegratorConfig(configPath) {
  const config = JSON.parse(await readFile(resolve(configPath), 'utf8'));
  const result = await integrateCaptainBatch(config);
  const summary = {
    ok: result.ok,
    batchId: result.batchId ?? null,
    baseCommit: result.baseCommit,
    treeSha: result.treeSha,
    acceptedPackages: result.acceptedPackages ?? [],
    rejectedPackages: result.rejectedPackages ?? [],
    rejectionCodes: result.rejectionCodes ?? [],
    reportPath: result.batchId ? resolve(config.outputRoot, `${result.batchId}.report.json`) : null,
    ledgerPath: result.batchId ? resolve(config.outputRoot, `${result.batchId}.ledger.jsonl`) : null,
    stagingRoot: result.stagingRoot ?? null,
    refPromoted: false,
  };
  return { result, summary };
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const configPath = process.argv[2];
  if (!configPath) throw new Error('Usage: node tools/integrate-captain-packages.mjs <batch-config.json>');
  const { result, summary } = await runIntegratorConfig(configPath);
  process.stdout.write(`${JSON.stringify(summary)}\n`);
  if (!result.ok) process.exitCode = 1;
}
