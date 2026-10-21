import { animationClips, sampleAnimation } from '../core/animation.js';

/** Select authored pixels using the simulation clock; drawing never advances gameplay. */
export function selectProductionSprite(player, {manifest,images}) {
  const character=manifest?.characters?.[player.id],key=player.animation?.clip;
  if(!character||!animationClips[key])return null;
  const facing=player.facing<0?'left':'right';
  let clip=character.directions?.[facing]?.[key],flip=false;
  if(!clip&&facing==='left'&&character.mirrorSafe===true&&character.mirrorReview?.status==='reviewed'){
    clip=character.directions?.right?.[key];flip=true;
  }
  if(!clip?.reviewed)return null;
  const atlas=images.get(clip.src);if(!atlas?.complete||!atlas.naturalWidth)return null;
  const index=sampleAnimation(key,player.animation.tick).frame,frame=clip.frames[index];
  if(!frame||frame.x<0||frame.y<0||frame.w<=0||frame.h<=0||frame.x+frame.w>atlas.naturalWidth||frame.y+frame.h>atlas.naturalHeight)return null;
  return {atlas,sx:frame.x,sy:frame.y,sourceWidth:frame.w,sourceHeight:frame.h,flip,clip:key,frame:index,production:true};
}

/** Compatibility art remains visibly staged; it never counts toward issue 3 acceptance. */
export function legacySpritePose(player) {
  const key=player.animation?.clip??player.anim??'idle',tick=player.animation?.tick??0;
  const action=key==='dribble-run'?'run':key.startsWith('dunk-')||key.startsWith('alley-oop-')?'dunk':key.startsWith('pass-')?'pass':key.startsWith('layup')||key==='charge'?'shoot':key;
  return {action,runFrame:action==='run'?Math.floor((tick%22)/5.5):-1,actionFrame:Math.floor(tick/4)%2};
}
