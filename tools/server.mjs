import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
const root=path.resolve(process.argv[2]||'.');
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,'http://localhost');let file=path.resolve(root,'.'+decodeURIComponent(url.pathname));
    if(!file.startsWith(root+path.sep)&&file!==root)throw new Error('bad path');
    if((await stat(file)).isDirectory())file=path.join(file,'index.html');
    const data=await readFile(file);res.writeHead(200,{'content-type':types[path.extname(file)]||'application/octet-stream','cache-control':'no-store'});res.end(data);
  }catch{res.writeHead(404,{'content-type':'text/plain'});res.end('Not found')}
});
const port=Number(process.env.PORT||4173),host=process.env.HOST||'127.0.0.1';server.listen(port,host,()=>console.log(`JAMVERSE serving ${root} at http://localhost:${port}`));
