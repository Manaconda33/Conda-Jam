import { spawnSync } from 'node:child_process';
const result=spawnSync('python',['tools/e2e_smoke.py'],{stdio:'inherit'});
process.exitCode=result.status??1;
