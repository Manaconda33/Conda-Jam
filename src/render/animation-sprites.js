import { animationClips, sampleAnimation } from '../core/animation.js';
import { supportingAnimationLibraries } from '../content/supporting-animation-libraries.js';
import { paletteVariantFor } from './uniform-palette.js';

const clipHeightRatioCache=new WeakMap();

/** Canonical body size, independent of atlas rectangle or camera magnification. */
export function athleteVisualScale(athlete,zoom=100){
  const body=athlete.rig==='quadruped-fox'?.52:athlete.height==='towering'?1.16:athlete.height==='compact'?.88:1;
  return body*zoom/100;
}

/** A held ball stays in front of its carrier, while foreground defenders occlude it. */
export function ballDrawDepth(ball,players){
  const owner=ball.mode==='carried'?players.find(p=>p.id===ball.ownerId):null;
  return owner?owner.y-owner.z*.05+.01:ball.y-.5;
}

/** Select authored pixels using the simulation clock; drawing never advances gameplay. */
export function selectProductionSprite(player, {manifest,images,libraries=supportingAnimationLibraries}) {
  const ownCharacter=manifest?.characters?.[player.id],key=player.animation?.clip;
  const candidate=!player.captain?libraries[player.id]:null;
  const assignment=candidate?.mode==='shared'&&candidate.review==='accepted'?candidate:null;
  const donorCharacter=assignment?.mode==='shared'?manifest?.characters?.[assignment.donorId]:null;
  const donorAvailable=donorCharacter?.directions?.right?.['idle-ball']?.src&&images.has(donorCharacter.directions.right['idle-ball'].src);
  const library=donorAvailable?assignment:null;
  const character=library?.mode==='shared'?donorCharacter:ownCharacter;
  if(!character||!animationClips[key])return null;
  const facing=player.facing<0?'left':'right';
  let clip=character.directions?.[facing]?.[key],flip=false;
  if(!clip&&facing==='left'&&character.mirrorSafe===true&&character.mirrorReview?.status==='reviewed'){
    clip=character.directions?.right?.[key];flip=true;
  }
  if(!clip?.reviewed)return null;
  let atlas=images.get(clip.src);if(!atlas?.complete||!atlas.naturalWidth)return null;
  if(library?.mode==='shared')atlas=paletteVariantFor(atlas,clip.src,library.sourcePalette,player.palette,clip.frames,library.maskProfile,key);
  const sampledFrame=sampleAnimation(key,player.animation.tick).frame;
  const targetFrames=animationClips[key].frames.length;
  const index=clip.frames.length===targetFrames?sampledFrame:Math.round(sampledFrame*(clip.frames.length-1)/Math.max(1,targetFrames-1));
  const frame=clip.frames[index],atlasWidth=atlas.width||atlas.naturalWidth,atlasHeight=atlas.height||atlas.naturalHeight;
  if(!frame||frame.x<0||frame.y<0||frame.w<=0||frame.h<=0||frame.x+frame.w>atlasWidth||frame.y+frame.h>atlasHeight)return null;
  return {atlas,src:clip.src,sx:frame.x,sy:frame.y,sourceWidth:frame.w,sourceHeight:frame.h,flip,clip:key,frame:index,production:true,libraryId:library?.donorId??player.id,classification:library?.mode==='shared'?'derived-palette':'original-authored'};
}

/** Use alpha occupancy across an authored clip to normalize transparent source padding. */
export function productionBaseSilhouetteHeightRatio(player,sprite,assets,fallback=.73){
  if(!sprite?.production||typeof document==='undefined')return fallback;
  const character=assets?.manifest?.characters?.[sprite.libraryId??player.id],key=player.animation?.clip;
  if(!character||!key)return fallback;
  const facing=player.facing<0?'left':'right';
  const mirrored=facing==='left'&&character.mirrorSafe;
  const clip=character.directions?.[facing]?.['idle-ball']??(mirrored?character.directions?.right?.['idle-ball']:null)??character.directions?.[facing]?.[key]??(mirrored?character.directions?.right?.[key]:null);
  if(!clip?.frames?.length)return fallback;
  const cached=clipHeightRatioCache.get(clip);if(cached)return cached;
  const canvas=document.createElement('canvas'),context=canvas.getContext('2d',{willReadFrequently:true});
  if(!context)return fallback;
  const referenceAtlas=assets.images.get(clip.src)??sprite.atlas;
  if(!referenceAtlas?.complete||!referenceAtlas.naturalWidth)return fallback;
  let maxHeight=0,cellHeight=0;
  for(const frame of clip.frames){
    if(!frame.w||!frame.h)continue;
    canvas.width=frame.w;canvas.height=frame.h;cellHeight=Math.max(cellHeight,frame.h);context.clearRect(0,0,frame.w,frame.h);
    context.drawImage(referenceAtlas,frame.x,frame.y,frame.w,frame.h,0,0,frame.w,frame.h);
    const pixels=context.getImageData(0,0,frame.w,frame.h).data;let top=frame.h,bottom=-1;
    for(let y=0;y<frame.h;y++)for(let x=3;x<frame.w*4;x+=4){const i=y*frame.w*4+x;if(pixels[i]>=32){top=Math.min(top,y);bottom=Math.max(bottom,y);break}}
    if(bottom>=top)maxHeight=Math.max(maxHeight,bottom-top+1);
  }
  const ratio=cellHeight?maxHeight/cellHeight:fallback;
  clipHeightRatioCache.set(clip,ratio||fallback);return ratio||fallback;
}

/** Compatibility art remains visibly staged; it never counts toward issue 3 acceptance. */
export function legacySpritePose(player) {
  const key=player.animation?.clip??player.anim??'idle',tick=player.animation?.tick??0;
  const action=key==='dribble-run'?'run':key.startsWith('dunk-')||key.startsWith('alley-oop-')?'dunk':key.startsWith('pass-')?'pass':key.startsWith('layup')||key==='charge'?'shoot':key;
  return {action,runFrame:action==='run'?Math.floor((tick%22)/5.5):-1,actionFrame:Math.floor(tick/4)%2};
}
