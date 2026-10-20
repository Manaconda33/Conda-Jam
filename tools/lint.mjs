import { readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
const walk=async(dir)=>{let files=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())files.push(...await walk(p));else if(p.endsWith('.js'))files.push(p);}return files};
const files=await walk('src');let failed=false;
for(const file of files){const result=spawnSync(process.execPath,['--check',file],{stdio:'inherit'});if(result.status!==0)failed=true}
if(failed)process.exitCode=1;else console.log(`Syntax checked ${files.length} JavaScript modules.`);
