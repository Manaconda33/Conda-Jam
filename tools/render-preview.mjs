// Diagnostic adapter for real game Canvas rendering; does not replace browser E2E.
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {readFileSync} from 'node:fs';
import {createRequire} from 'node:module';
import {pathToFileURL,fileURLToPath} from 'node:url';
import path from 'node:path';
const require=createRequire(import.meta.url);
const {createCanvas,Image}=require(process.env.JAMVERSE_CANVAS_MODULE||'@napi-rs/canvas');
const root=fileURLToPath(new URL('..',import.meta.url));
const images=[];
class BrowserImage extends Image {
 constructor(){super();this.listeners={};images.push(this);this.onload=()=>{for(const f of this.listeners.load??[])f()};}
 set src(value){this.file=value;let data=value.startsWith('data:')?Buffer.from(value.split(',')[1],'base64'):readFileSync(root+'/'+value.replace(/^\.\//,''));if(data.subarray(1,4).toString()==='PNG'){const chunks=[data.subarray(0,8)];for(let offset=8;offset<data.length;){const length=data.readUInt32BE(offset),type=data.toString('ascii',offset+4,offset+8);if(type[0]===type[0].toUpperCase()||type==='tRNS')chunks.push(data.subarray(offset,offset+length+12));offset+=length+12;}data=Buffer.concat(chunks);}super.src=data;}
 get src(){return super.src;}
 addEventListener(type,f){(this.listeners[type]??=[]).push(f)}
 get complete(){return this.width>0&&this.height>0}
 get naturalWidth(){return this.width} get naturalHeight(){return this.height}
}
const matches=(node,s)=>{const tag=s.match(/^[\w-]+/)?.[0],id=s.match(/#([\w-]+)/)?.[1],cls=s.match(/\.([\w-]+)/)?.[1],attr=s.match(/\[([\w-]+)(?:=["']?([^\]"']+)["']?)?\]/);return (!tag||node.tag===tag)&&(!id||node.attrs.id===id)&&(!cls||node.classList.contains(cls))&&(!attr||(attr[1] in node.attrs&&(attr[2]===undefined||node.attrs[attr[1]]===attr[2])))};
class Element{
 constructor(tag='div',attrs={}){this.tag=tag;this.attrs=attrs;this.children=[];this.dataset=new Proxy({},{set:(target,key,value)=>{target[key]=String(value);this.attrs['data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase())]=String(value);return true}});this.listeners={};this.style={setProperty(){}};this.width=Number(attrs.width)||300;this.height=Number(attrs.height)||150;this.checked='checked' in attrs;this._value=attrs.value;this.textContent='';this.classList={contains:x=>(this.attrs.class??'').split(' ').includes(x),add:x=>{this.attrs.class=(this.attrs.class??'')+' '+x},remove:x=>{this.attrs.class=(this.attrs.class??'').split(' ').filter(s=>s!==x).join(' ')},toggle:(x,b)=>{b??=!this.classList.contains(x);b?this.classList.add(x):this.classList.remove(x)}};for(const[k,v]of Object.entries(attrs))if(k.startsWith('data-'))this.dataset[k.slice(5).replace(/-([a-z])/g,(_,a)=>a.toUpperCase())]=v;}
 get className(){return this.attrs.class??''} set className(value){this.attrs.class=value}
 get value(){return this._value??(this.tag==='select'?(this.children.find(x=>'selected'in x.attrs)??this.children[0])?.value??'':this.textContent)} set value(v){this._value=String(v)}
 append(...nodes){this.children.push(...nodes);for(const node of nodes)node.parentElement=this} appendChild(x){this.append(x);return x} replaceChildren(...nodes){this.children=[];this.append(...nodes)}
 querySelectorAll(s){const selectors=s.split(',').map(x=>x.trim());let all=[];for(const c of this.children){if(selectors.some(x=>matches(c,x)))all.push(c);all.push(...c.querySelectorAll(s))}return all}querySelector(s){return this.querySelectorAll(s)[0]??null}
 addEventListener(type,f){(this.listeners[type]??=[]).push(f)} setAttribute(k,v){this.attrs[k]=String(v)}getAttribute(k){return this.attrs[k]??null} removeAttribute(k){delete this.attrs[k]}
 cloneNode(deep){const n=new Element(this.tag,{...this.attrs});n._value=this._value;n.textContent=this.textContent;if(deep)n.append(...this.children.map(x=>x.cloneNode(true)));return n}
 getContext(){this.native??=createCanvas(this.width,this.height);return this.native.getContext('2d')}focus(){}showModal(){}close(){}setPointerCapture(){}
}
const document=new Element('document'),stack=[document];
const html=await readFile(root+'/index.html','utf8');
for(const token of html.matchAll(/<!--[\s\S]*?-->|<![^>]*>|<\/?[^>]+>|[^<]+/g)){const t=token[0];if(t.startsWith('</')){if(stack.length>1)stack.pop()}else if(t.startsWith('<!'))continue;else if(t.startsWith('<')){const tag=t.match(/^<([\w-]+)/)?.[1];if(!tag)continue;const attrs={};for(const m of t.slice(tag.length+1,-1).matchAll(/([\w-]+)(?:="([^"]*)"|='([^']*)'|=([^\s>]+))?/g))attrs[m[1]]=m[2]??m[3]??m[4]??'';const n=new Element(tag,attrs);stack.at(-1).append(n);if(!['meta','link','input','img','br','hr'].includes(tag)&&!t.endsWith('/>'))stack.push(n)}else stack.at(-1).textContent+=t;}
document.createTextNode=text=>{const node=new Element('#text');node.textContent=text;return node};
document.getElementById=id=>document.querySelector('#'+id);document.createElement=tag=>new Element(tag);document.documentElement=document.querySelector('html');document.body=document.querySelector('body');
delete globalThis.navigator;
const window=new Element('window');Object.assign(globalThis,{document,window,location:{search:''},Image:BrowserImage,ResizeObserver:class{observe(){}},requestAnimationFrame:()=>1,cancelAnimationFrame(){},localStorage:{getItem(){return null},setItem(){}},navigator:{getGamepads:()=>[]}});
await import(pathToFileURL(root+'/src/main.js'));
for(const im of images)if(!im.complete)await Promise.race([new Promise((resolve,reject)=>{im.addEventListener('load',resolve);im.onerror=reject}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Image did not load: '+im.file+' '+im.width+'x'+im.height)),5000))]);
const game=window.jamverse;
const previewZoom=Math.max(85,Math.min(120,Number(process.env.JAMVERSE_PREVIEW_ZOOM)||100));
const zoomInput=document.getElementById('camera-zoom');zoomInput.value=previewZoom;
for(const listener of zoomInput.listeners.input??[])listener({target:zoomInput});
const previewAthlete=process.env.JAMVERSE_PREVIEW_ATHLETE??'manaconda';
const home=game.teams.find(t=>t.roster.some(p=>p.id===previewAthlete));
if(!home)throw new Error('Unknown preview athlete: '+previewAthlete);
game.start(home.id,game.teams.find(t=>t.id!==home.id).id,180,3);
if(!game.state.players.some(p=>p.id===previewAthlete)){
 const {substitutePlayer}=await import(pathToFileURL(root+'/src/core/simulation.js'));
 const phase=game.state.phase;game.state.phase='break';
 if(!substitutePlayer(game.state,0))throw new Error('Cannot substitute preview athlete: '+previewAthlete);
 game.state.phase=phase;
}
for(const im of images)if(!im.complete)await Promise.race([new Promise((resolve,reject)=>{im.addEventListener('load',resolve);im.onerror=reject}),new Promise((_,reject)=>setTimeout(()=>reject(new Error('Image did not load: '+im.file+' '+im.width+'x'+im.height)),5000))]);
const {animationClips,anchorTick,sampleBallHeight,sampleBallForward}=await import(pathToFileURL(root+'/src/core/animation.js'));
const {selectProductionSprite}=await import(pathToFileURL(root+'/src/render/animation-sprites.js'));
const out=path.join(root,'artifacts/native-render-preview',previewAthlete+(previewZoom===100?'':`-zoom${previewZoom}`));await mkdir(out,{recursive:true});
game.tick(180);await writeFile(out+'/simulation-180.png',document.getElementById('game').native.toBuffer('image/png'));
const state=game.state;state.lastEvent='';state.pause=false;state.phase='playing';
const p=state.players.find(p=>p.id===previewAthlete);
if(!p)throw new Error('Preview athlete is not in the active lineup: '+previewAthlete);
const {animationAssetManifest}=await import(pathToFileURL(root+'/src/content/animation-assets.js'));
const previewImages=new Map(images.map(image=>[image.file,image]));
const previews=[],previewFrames=[],clips=Object.keys(animationClips);
for(const [position,x]of [['left',30],['mid',100],['right',170]])for(const clip of clips){
 for(const player of state.players){player.x=x+(player.team?40:-40);player.y=65;player.z=0;player.animation={clip:'idle',tick:0};player.hasBall=false;}
 const aerial=clip.startsWith('dunk-')||clip.startsWith('alley-oop-');
 const tick=aerial?anchorTick(clip,'peak'):anchorTick(clip,'release')??anchorTick(clip,'apex')??anchorTick(clip,'grab')??anchorTick(clip,'contact')??anchorTick(clip,'bounce')??anchorTick(clip,'finish')??12;
 p.x=x;p.y=50;p.animation={clip,tick};p.z=aerial?5:clip==='shoot'||clip.startsWith('layup')||clip==='block'||clip==='rebound'?2:0;
 // Release anchors keep the ball visible at the authored hand/muzzle while
 // marking passes and shots as free projectiles without an owner.
 const releasedPass=['pass','pass-overhead','pass-behind'].includes(clip)&&tick>=anchorTick(clip,'release');
 const releasedShot=['shoot','layup','layup-reverse'].includes(clip)&&tick>=anchorTick(clip,'release');
 p.hasBall=(['idle-ball','dribble','dribble-run','shoot','pass','pass-overhead','pass-behind','receive','pickup','steal','layup','layup-reverse'].includes(clip)&&!releasedPass&&!releasedShot)||aerial||(clip==='rebound'&&tick>=anchorTick('rebound','grab'));p.facing=position==='right'?-1:1;
 Object.assign(state.ball,{x:p.x+p.facing*sampleBallForward(clip,p.animation.tick,p.id),y:p.y,z:p.z+((p.hasBall||releasedPass||releasedShot)?sampleBallHeight(clip,p.animation.tick,p.id):0),mode:p.hasBall?'carried':releasedPass?'pass':releasedShot?'shot':'loose',ownerId:p.hasBall?p.id:null});
 for(let i=0;i<(clip==='idle'?90:1);i++)game.tick(0);
 const path=out+'/'+position+'-'+clip+'.png';await writeFile(path,document.getElementById('game').native.toBuffer('image/png'));previews.push(path);const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:previewImages});previewFrames.push({path,athlete:p.id,clip,tick:p.animation.tick,facing:p.facing,production:Boolean(selected),sourceDirection:selected?.atlas?.file?.match(/-(left|right)\.webp$/)?.[1]??null,flipped:selected?.flip??false,hasBall:p.hasBall,ballMode:state.ball.mode,ballOwnerId:state.ball.ownerId});
}
const actionFramePreviews=[];
for(const clip of ['pass-overhead','pass-behind','block','push','rebound','steal','layup','layup-reverse','fall','celebrate'])for(const position of ['left','right'])for(let frame=0,tick=0;frame<animationClips[clip].frames.length;frame++){
 for(const player of state.players){player.x=100+(player.team?42:-42);player.y=65;player.z=0;player.animation={clip:'idle',tick:0};player.hasBall=false;}
 p.x=100;p.y=50;p.z=0;p.facing=position==='right'?-1:1;p.animation={clip,tick};
 if(clip==='dunk-power'){
  const takeoff=anchorTick(clip,'takeoff'),peak=anchorTick(clip,'peak'),finish=anchorTick(clip,'finish');
  p.z=tick<=takeoff?0:tick<=peak?5*Math.sin((tick-takeoff)/(peak-takeoff)*Math.PI/2):5*Math.sin((finish-tick)/(finish-peak)*Math.PI/2);
 }
 const releasedPass=['pass','pass-overhead','pass-behind'].includes(clip)&&tick>=anchorTick(clip,'release');
 const releasedShot=['shoot','layup','layup-reverse'].includes(clip)&&tick>=anchorTick(clip,'release');
 const releasedDunk=clip.startsWith('dunk-')&&tick>=anchorTick(clip,'release');
 p.hasBall=(clip==='rebound'?frame>=3:!['block','push','fall','celebrate'].includes(clip))&&!releasedPass&&!releasedShot&&!releasedDunk;
 Object.assign(state.ball,{x:p.x+p.facing*sampleBallForward(clip,tick,p.id),y:p.y,z:(p.hasBall||releasedPass||releasedShot||releasedDunk)?sampleBallHeight(clip,tick,p.id)+p.z:0,mode:p.hasBall?'carried':releasedPass?'pass':releasedShot?'shot':releasedDunk?'dunk':['block','push','fall','celebrate'].includes(clip)?'dead':'loose',ownerId:p.hasBall?p.id:null});
 game.tick(0);
 const path=out+'/'+position+'-'+clip+'-frame'+frame+'.png';await writeFile(path,document.getElementById('game').native.toBuffer('image/png'));
 const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:previewImages});
 actionFramePreviews.push({path,athlete:p.id,clip,frame,tick,facing:p.facing,production:Boolean(selected),selectedFrame:selected?.frame,source:selected?.atlas?.file??null,flipped:selected?.flip??false,hasBall:p.hasBall,ballMode:state.ball.mode,ballOwnerId:state.ball.ownerId});
 tick+=animationClips[clip].frames[frame].duration;
}
// Capture every Paprika dunk frame with the live renderer in both facings.
// Keep her on the roster that owns her sprite data; change only facing.
// Center the fox so the separate ball and authored jump curve stay visible.
for(const clip of ['dunk-power','dunk-windmill','dunk-reverse','dunk-360','dunk-tomahawk','dunk-double'])for(const position of ['left','right']){
 const facing=position==='right'?1:-1;
 for(let frame=0,tick=0;frame<animationClips[clip].frames.length;frame++){
  for(const player of state.players){player.animation={clip:'idle',tick:0};player.hasBall=false;player.z=0;}
  const takeoff=anchorTick(clip,'takeoff'),peak=anchorTick(clip,'peak'),finish=anchorTick(clip,'finish'),release=anchorTick(clip,'release');
  p.x=100;p.y=50;p.facing=facing;p.animation={clip,tick};
  p.z=tick<=takeoff?0:tick<=peak?5*Math.sin((tick-takeoff)/(peak-takeoff)*Math.PI/2):5*Math.sin((finish-tick)/(finish-peak)*Math.PI/2);
  const released=tick>=release;p.hasBall=!released;
  Object.assign(state.ball,{x:p.x+facing*sampleBallForward(clip,tick,p.id),y:50,z:p.z+sampleBallHeight(clip,tick,p.id),mode:released?'dunk':'carried',ownerId:released?null:p.id});
  game.tick(0);
  const path=out+'/'+position+'-'+clip+'-frame'+frame+'.png';await writeFile(path,document.getElementById('game').native.toBuffer('image/png'));
  const selected=selectProductionSprite(p,{manifest:animationAssetManifest,images:previewImages});
  actionFramePreviews.push({path,athlete:p.id,clip,frame,tick,facing,production:Boolean(selected),selectedFrame:selected?.frame,source:selected?.atlas?.file??null,flipped:selected?.flip??false,hasBall:p.hasBall,ballMode:state.ball.mode,ballOwnerId:state.ball.ownerId});
  tick+=animationClips[clip].frames[frame].duration;
 }
}
await writeFile(out+'/report.json',JSON.stringify({renderer:'actual src/main.js with native Canvas adapter; not browser E2E',cameraZoom:previewZoom,loadedImages:images.length,matchPlayers:state.players.map(p=>p.id),previews,previewFrames,actionFramePreviews},null,2));
console.log(JSON.stringify({loadedImages:images.length,previews:previews.length,actionFramePreviews:actionFramePreviews.length,out}));
