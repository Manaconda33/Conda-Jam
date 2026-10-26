import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
await rm('dist',{recursive:true,force:true});
await mkdir('dist',{recursive:true});
await cp('index.html','dist/index.html');
await cp('src','dist/src',{recursive:true});
await cp('public','dist/public',{recursive:true});

function rewriteImports(source,file){
  return source.replace(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];\s*$/gm,(_line,names,dependency)=>{
    const resolved='./'+path.posix.normalize(path.posix.join(path.posix.dirname(file),dependency));
    return `const {${names}}=__modules[${JSON.stringify(resolved)}];`;
  });
}
async function wrapModule(file,overrideSource){
  let source=overrideSource??await readFile(path.join('src',file),'utf8');
  const exported=[...source.matchAll(/^export\s+(?:function|const|class)\s+(\w+)/gm)].map(match=>match[1]);
  if(!exported.length)throw new Error(`No named exports found in ${file}`);
  source=source.replace(/^export\s+/gm,'');
  source=rewriteImports(source,file);
  return `(()=>{\n${source}\nreturn {${exported.join(',')}};\n})()`;
}

const productionManifest=JSON.parse(await readFile('public/assets/animation/manifest.json','utf8'));
const embeddedAtlases={};
for(const character of Object.values(productionManifest.characters))for(const direction of Object.values(character.directions??{}))for(const clip of Object.values(direction))if(!embeddedAtlases[clip.src]){
  if(!clip.src.startsWith('./public/assets/animation/')||clip.src.includes('..'))throw new Error('Invalid production animation atlas path');
  const bytes=await readFile(clip.src),mime=clip.src.endsWith('.webp')?'image/webp':'image/png';
  embeddedAtlases[clip.src]=`data:${mime};base64,${bytes.toString('base64')}`;
}
const manifestSource=`const embeddedAtlases=${JSON.stringify(embeddedAtlases)};\nexport const animationAssetManifest=${JSON.stringify(productionManifest)};\nfor(const character of Object.values(animationAssetManifest.characters))for(const direction of Object.values(character.directions??{}))for(const clip of Object.values(direction))clip.src=embeddedAtlases[clip.src];`;
const modules={
  './content/teams.js':await wrapModule('content/teams.js'),
  './core/animation.js':await wrapModule('core/animation.js'),
  './content/animation-assets.js':await wrapModule('content/animation-assets.js',manifestSource),
  './render/animation-sprites.js':await wrapModule('render/animation-sprites.js'),
  './render/jam-stage.js':await wrapModule('render/jam-stage.js'),
  './render/camera-tracking.js':await wrapModule('render/camera-tracking.js'),
  './render/debug-diagnostics.js':await wrapModule('render/debug-diagnostics.js'),
  './render/court-geometry.js':await wrapModule('render/court-geometry.js'),
  './ui/box-score.js':await wrapModule('ui/box-score.js'),
  './core/simulation.js':await wrapModule('core/simulation.js'),
  './core/season.js':await wrapModule('core/season.js'),
  './core/music.js':await wrapModule('core/music.js'),
  './core/league.js':await wrapModule('core/league.js'),
  './core/career.js':await wrapModule('core/career.js'),
  './core/tournament.js':await wrapModule('core/tournament.js'),
  './input/gamepad-controls.js':await wrapModule('input/gamepad-controls.js'),
  './core/preferences.js':await wrapModule('core/preferences.js')
};
let app=await readFile('src/main.js','utf8');
for(const asset of ["captain-gameplay-sprites-lossless.webp", "captain-portrait-atlas-lossless.webp", "captain-run-sprites-2-lossless.webp", "captain-run-sprites-3-lossless.webp", "captain-run-sprites-lossless.webp", "captain-portraits/e-indigo.webp", "supporting-player-gameplay-sprites-lossless.webp", "supporting-player-portrait-atlas-lossless.webp", "supporting-player-run-sprites-2-lossless.webp", "supporting-player-run-sprites-3-lossless.webp", "supporting-player-run-sprites-lossless.webp", "team-crest-atlas-lossless.webp"] ){
  const bytes=await readFile(`public/assets/${asset}`);
  app=app.replace(`'./public/assets/${asset}'`,JSON.stringify(`data:image/webp;base64,${bytes.toString('base64')}`));
}
for(const action of ['pass','receive','push','block','rebound','pickup','celebrate','shoot','dunk'])for(const group of ['captains','supporting'])for(const frame of [1,2]){
  const asset=frame===1?`action-${action}-${group}.webp`:`action-${action}-frame2-${group}.webp`,source=`./public/assets/${asset}`,bytes=await readFile(`public/assets/${asset}`);
  app=app.replace(`'${source}'`,JSON.stringify(`data:image/webp;base64,${bytes.toString('base64')}`));
}
app=app.replace(/^import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"];\s*$/gm,(_line,names,file)=>{
  if(!modules[file])throw new Error(`No standalone module bundle for ${file}`);
  return `const {${names}}=__modules[${JSON.stringify(file)}];`;
});
if(/^import\s/m.test(app))throw new Error('Unsupported import remains in standalone main module');
const bundle=`const __modules={};\n${Object.entries(modules).map(([file,body])=>`__modules[${JSON.stringify(file)}]=${body};`).join('\n')}\n${app}`;
let html=await readFile('index.html','utf8');
const css=await readFile('src/style.css','utf8');
html=html.replace(/\s*<link\s+rel="stylesheet"\s+href="\.\/src\/style\.css"\s*\/>/,'');
html=html.replace('</head>',`<style>\n${css}\n</style>\n</head>`);
html=html.replace(/\s*<script\s+type="module"\s+src="\.\/src\/main\.js"><\/script>/,`\n<script>\n${bundle}\n</script>`);
if(/(?:src|href)=["'](?:\.\.?\/|\/)/i.test(html))throw new Error('External local assets remain in standalone HTML');
await writeFile('dist/JAMVERSE_96.html',html);
console.log('Built static browser bundle and self-contained dist/JAMVERSE_96.html');
