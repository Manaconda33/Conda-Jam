// Durations use simulation ticks (60 Hz); anchors name the first tick of a frame.
const clip = (count, duration, loop = false, anchors = {}, sequence) => ({ frames: Array.from({length:count},(_,i)=>({duration:Array.isArray(duration)?duration[i]:duration})), loop, anchors, ...(sequence?{sequence}:{}) });
export const dunkVariants = ['power','windmill','reverse','360','tomahawk','double','clutch','scythe'];
export const animationClips = {
  idle:clip(6,8,true,{},[0,1,2,3,4,5,4,3,2,1]),
  'idle-ball':clip(4,8,true), dribble:clip(10,3,true), run:clip(11,2,true), 'dribble-run':clip(11,2,true),
  shoot:clip(10,[3,3,2,2,3,1,2,3,4,4],false,{takeoff:2,release:5,peak:5,finish:9}),
  pass:clip(6,[2,2,1,1,2,3],false,{release:3}), 'pass-overhead':clip(6,[2,3,2,1,2,3],false,{release:3}), 'pass-behind':clip(6,[2,2,3,1,2,3],false,{release:3}),
  receive:clip(4,[2,2,1,3],false,{grab:2}), pickup:clip(5,[2,3,2,1,4],false,{grab:3}),
  layup:clip(8,[2,3,3,2,1,3,4,4],false,{takeoff:1,release:4,peak:4,finish:7}), 'layup-reverse':clip(8,[2,3,2,3,2,1,4,4],false,{takeoff:1,release:5,peak:4,finish:7}),
  block:clip(4,[2,3,3,4],false,{takeoff:1,apex:2,finish:3}), steal:clip(8,[2,2,1,1,2,2,3,3],false,{grab:3}), push:clip(11,[2,2,2,1,1,2,2,3,3,3,3],false,{contact:5}), rebound:clip(5,[2,2,1,2,4],false,{grab:3}), fall:clip(10,[2,2,2,3,3,4,5,6,6,7],false,{finish:9}), celebrate:clip(10,[5,5,6,8,10,10,8,7,6,5],false,{finish:9}),
  ...Object.fromEntries([...dunkVariants.map(v=>`dunk-${v}`),'alley-oop-power','alley-oop-reverse'].map(key=>[key,clip(15,[2,2,3,2,1,2,2,3,2,2,2,3,2,2,3],false,{takeoff:2,grab:5,peak:7,release:10,finish:11,land:14})]))
};
// Heights are hand offsets above the player, in simulation elevation units.
// The bounce anchor identifies the low hand frame where the ball touches court.
for(const [key,heights] of Object.entries({
  'idle-ball':[1.1,1.1,1.1,1.1],
  dribble:[1.2,1.05,.8,.5,.2,0,.25,.6,.95,1.2],
  'dribble-run':[1.2,1.1,.85,.55,.25,0,.25,.55,.85,1.1,1.2]
})){
  animationClips[key].frames.forEach((frame,index)=>{frame.ballHeight=heights[index];});
  if(key!=='idle-ball')animationClips[key].anchors.bounce=5;
}
for(const [key,releaseHeight] of Object.entries({shoot:3,layup:3,'layup-reverse':3,pass:1.6,'pass-overhead':1.6,'pass-behind':1.6})){
  const c=animationClips[key],release=anchorTick(key,'release');let tick=0;
  for(const frame of c.frames){frame.ballHeight=1.1+(releaseHeight-1.1)*Math.min(1,tick/release);tick+=frame.duration;}
}
// Dunk gathers start at the waist and reach overhead by the flight peak.
for(const [key,c] of Object.entries(animationClips)){
  if(!key.startsWith('dunk-')&&!key.startsWith('alley-oop-'))continue;
  const peak=anchorTick(key,'peak');let tick=0;
  for(const frame of c.frames){frame.ballHeight=1.2+1.8*Math.min(1,tick/peak);tick+=frame.duration;}
}
// Estimated white-sleeved hand centers in the actual112x96 power cells.
// At court y50: horizontal pixels scale .804 and world court units scale2.2;
// hand elevation is (70.22-handY*.804)/28. Preserve the spread-arm peak's
// left hand, rather than holding the ball centrally above both raised arms.
const powerHandCenters=[[57,58],[27,55],[77,40],[47,16],[80,16],[59,12],[53,21],[38,14],[23,54],[91,12],[83,34],[39,61],[36,70],[51,73],[40,63]];
animationClips['dunk-power'].frames.forEach((frame,index)=>{
  const [x,y]=powerHandCenters[index];
  frame.ballHeight=(70.22-y*.804)/28;frame.ballForward=(x-56)*.804/2.2;
});
// The windmill arm sweeps behind the torso, below the hip, then up to the rim.
// These offsets follow the authored15-pose sheet rather than an overhead gather.
animationClips['dunk-windmill'].frames.forEach((frame,index)=>{
  frame.ballHeight=[1.2,1.1,1.1,2.1,.8,.5,.9,1.2,2.8,3,3,3,3,3,3][index];
  frame.ballForward=[1.5,-4,-5,-7,-3,4,3,10,1.5,1.5,1.5,1.5,1.5,1.5,1.5][index];
});
// Estimated hand tracks for the reviewed15-pose sheets, in world units.
// Reverse holds behind the head; tomahawk cocks one arm; double pumps high/low/high.
// Native Canvas hand review sets reverse peak2.1 and tomahawk cocked frames1.7.
// These offsets preserve the shared takeoff, release and scoring anchors.
for(const [variant,track] of Object.entries({
  reverse:{
    height:[1.2,.9,2.6,2.5,1.8,2.4,2.5,2.1,2.4,2.6,2.4,1.2,1.1,1.1,1.1],
    forward:[3,3,-2,-4,-2,-8,-2,-1,-3,12,-7,-7,4,4,4]
  },
  tomahawk:{
    height:[1.1,.8,1.1,2.6,1.7,1.7,1.7,1.7,1.7,2.6,1.6,1,1,1,1],
    forward:[3,-6,-8,0,-3,-5,-6,-6,-5,11,8,5,4,4,4]
  },
  double:{
    height:[1.2,1,2.4,2.5,2.6,1.6,.6,.6,1.6,2.6,2.3,1.1,1.1,1.1,1.1],
    forward:[2,-7,8,2,3,4,3,3,4,5,10,7,3,3,3]
  }
}))animationClips[`dunk-${variant}`].frames.forEach((frame,index)=>{
  frame.ballHeight=track.height[index];frame.ballForward=track.forward[index];
});
// Hand centers estimated from the packed, reviewed sheets at court y50.
// Clutch protects the ball at the hip; scythe sweeps diagonally. Aerial
// receivers close both hands at grab before their different finishing paths.
for(const [key,{width,hands}] of Object.entries({
  'dunk-360':{width:96,hands:[[50,57],[25,55],[71,28],[66,10],[47,33],[35,11],[47,10],[58,13],[82,22],[78,10],[62,48],[46,64],[43,70],[50,73],[45,63]]},
  layup:{width:96,hands:[[62,56],[65,15],[44,22],[69,9],[64,16],[59,18],[68,39],[62,58]]},
  'layup-reverse':{width:96,hands:[[64,57],[66,31],[59,18],[55,20],[48,9],[52,20],[66,48],[64,58]]},
  'pass-overhead':{width:112,hands:[[73,43],[61,15],[57,9],[84,26],[86,28],[71,56]]},
  'pass-behind':{width:112,hands:[[47,60],[65,55],[49,45],[18,43],[17,48],[73,56]]},
  'dunk-clutch':{width:96,hands:[[56,57],[27,55],[62,41],[62,43],[58,48],[55,48],[45,60],[45,58],[73,22],[77,9],[64,46],[53,65],[50,71],[48,73],[44,63]]},
  'dunk-scythe':{width:112,hands:[[58,58],[25,55],[77,42],[62,48],[25,14],[75,51],[92,14],[98,13],[95,21],[96,15],[82,60],[44,66],[38,73],[51,73],[42,64]]},
  'alley-oop-power':{width:112,hands:[[82,40],[84,28],[77,10],[70,12],[79,19],[69,24],[56,28],[84,21],[84,22],[88,42],[70,63],[59,66],[44,73],[49,74],[48,65]]},
  'alley-oop-reverse':{width:96,hands:[[73,44],[76,30],[63,10],[76,22],[55,15],[51,20],[42,29],[58,24],[29,40],[73,22],[25,62],[25,70],[55,63],[50,70],[51,65]]}
}))animationClips[key].frames.forEach((frame,index)=>{
  const [x,y]=hands[index];
  frame.ballHeight=(70.22-y*.804)/28;frame.ballForward=(x-width/2)*.804/2.2;
});
// The numeric production targets above remain fixed across the roster.
// Audit minima are the explicit lower bounds in issue 3, not padded frame slots.
for(const [key,minimum] of Object.entries({dribble:8,run:8,'dribble-run':8,shoot:8,push:8,celebrate:8}))animationClips[key].minimumUniqueFrames=minimum;
function sequenceFor(clip) { return clip.sequence ?? clip.frames.map((_,i)=>i); }
export function animationDuration(key) { const c=animationClips[key]; if(!c)throw new RangeError(`Unknown animation: ${key}`);return sequenceFor(c).reduce((n,i)=>n+c.frames[i].duration,0); }
export function anchorTick(key, anchor) { const c=animationClips[key];const frame=c?.anchors[anchor];if(frame===undefined)return null;const sequence=sequenceFor(c);return sequence.slice(0,sequence.indexOf(frame)).reduce((n,i)=>n+c.frames[i].duration,0); }
export function sampleAnimation(key, elapsedTicks=0) { const c=animationClips[key];if(!c)throw new RangeError(`Unknown animation: ${key}`);const duration=animationDuration(key),elapsed=Math.max(0,Number.isFinite(elapsedTicks)?elapsedTicks:0);let tick=c.loop?elapsed%duration:Math.min(elapsed,duration-1);for(const frame of sequenceFor(c)){if(tick<c.frames[frame].duration)return {frame,done:!c.loop&&elapsed>=duration};tick-=c.frames[frame].duration;}return {frame:0,done:false}; }

// Interpolate within each authored frame duration, using the same loop as sampling.
const athleteBallTracks={'sera-bellini':{
  // The reviewed 80x96 sheet places the lead hand ahead of her torso; keep
  // the separate game ball at that hand through her court-level bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moxie-capwell':{
  // Moxie's long, forward-reaching low-run poses use the same court-space
  // hand lane as Sera while retaining their individual purple-kit sprites.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'sol-meridian':{
  // The authored idle and low-run poses extend a lead hand past Sol's torso;
  // keep the separate physics ball at that hand and on the court at contact.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'mist-halo':{
  // Mist's braids trail behind her reach; place the independent ball just
  // ahead of her low dribble hand through both running directions.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'wren-bravado':{
  // His upright receiving hands and low dribble reach both sit ahead of the
  // torso; align the separate physics ball to those authored contact points.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'eden-north':{
  // Eden's tied curls trail behind her lead hand; the ball path follows the
  // receiving stance, low stationary reach and turbo stride through contact.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'raven-lux':{
  // Raven's open lead hand stays ahead of the scarlet/black silhouette;
  // track the separate physics ball through both low dribble cycles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'thorn-sable':{
  // Keep the game ball beyond Thorn's forward hand through his ready stance,
  // stationary dribble and turbo stride, separate from the drawn sprite.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'kai-suncrest':{
  // Kai's upright receiving pose and reaching dribble hand stay ahead of the
  // sea-green/orange sprite while the ball remains a separate game object.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'talia-kestrel':{
  // Keep Talia's separate ball at her forward hand during upright receive,
  // low dribble and turbo stride without baking it into her sprite.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'detective-halftone':{
  // The separate ball stays ahead of Halftone's steel/black forehand through
  // receiving, stationary dribble and the low turbo transition.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'trace-noire':{
  // Trace's long ponytail remains clear of the separately rendered ball at
  // the lead hand and at the court-level dribble bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'jett-byte':{
  // Jett's empty reaching hands leave room for the separate ball at every
  // cyan/magenta stride and during the low court bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cass-pixel':{
  // Keep Cass's independent ball path forward of her long high ponytail and
  // outside her lead hand through ball-ready, dribble and turbo poses.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'riff-voltage':{
  // The separate ball stays beyond Riff's forward hand through his
  // ball-ready stance, low dribble and turbo stride.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'fret-nova':{
  // Fret's high ponytail stays clear of the separately rendered ball at her
  // lead hand and at the court-level dribble bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'thorn-script':{
  // Keep the rendered ball in front of Thorn's tattooed lead hand and preserve
  // the low court bounce during his dribble and running dribble.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'nyx-steel':{
  // Nyx's separate ball stays beyond her right-hand reach and outside her
  // long ponytail silhouette through ball-ready and both dribble clips.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moss-quarry':{
  // Keep the ball ahead of Moss's strong lead hand and visibly low on each
  // stationary and turbo bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'digger-finch':{
  // Keep Digger's long ponytail clear of the separately rendered ball and
  // align its low dribble bounce to her right hand.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'willow-root':{
  // Willow's large high ponytail stays clear of the separately drawn ball;
  // the track follows her right hand through idle-ball and both bounces.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'rowan-bark':{
  // Rowan's separate ball remains ahead of his arm tattoos and reaches court
  // level on both the stationary and turbo dribble cycle.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'auric-scale':{
  // Auric's ball stays in front of the reaching hand, clear of his gold trim.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cinder-royal':{
  // Cinder's long ponytail falls behind; her separate ball follows her hand.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'moth-vale':{
  // Moth's high violet loc ponytail stays clear of the separate game ball;
  // follow her hand through ball-ready, stationary dribble and turbo stride.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'owl-argent':{
  // Owl's separate ball stays in front of his right hand at release and court
  // bounce without overlapping his silver curls or violet uniform.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'sable-regent':{
  // Keep the orange game ball outside Sable's black/crimson silhouette and
  // in front of her reaching hand on ball-ready, dribble and turbo frames.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'marco-vellum':{
  // Marco's low dribble reaches with the lead hand clear of his torso.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'flint-rooker':{
  // Flint's short-haired lead-hand poses need the separate ball ahead of his
  // charcoal/ember-red body through stationary and turbo dribble cycles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'ash-harth':{
  // Keep the ball outside Ash's flowing ponytail/body silhouette at the
  // visible lead hand; dribble timing still reaches the court-plane bounce.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'marin-dusk':{
  // Keep the separate ball at Marin's reaching hand through low dribble poses.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cove-knell':{
  // Cove's lead hand reaches outside the locs and beard through both bounces.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'pixel-o-keeffe':{
  // Keep Pixel's orange game ball at his forward hand between sprite poses.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'fern-tempo':{
  // Fern's high ponytail clears the separate ball at her lead hand in every
  // upright and low dribble pose; the bounce still meets the court plane.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'mira-wavelength':{
  // Keep the game ball in front of Mira's lead hand, clear of her long blue hair.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'azul-voss':{
  // Azul's low stationary and running reaches keep the separate ball forward.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'roxie-coil':{
  // Her forward hand clears the crimson hair and reaches the separate ball.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'vanta-slate':{
  // Vanta's open lead hand stays ahead of his broad shoulders during dribbles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'sylvie-shutter':{
  // Keep the separate ball in Sylvie's forward hand as her long silver curls
  // trail behind her; her low bounce remains clear of the white/navy uniform.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'noelle-pinstripe':{
  // Noelle's lead hand stays outside the violet loc silhouette through both
  // stationary and running dribbles, with the ball landing at court level.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cade-brixton':{
  // Keep the game ball ahead of Cade's lead hand through his purple-kit dribbles.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'fenn-static':{
  // Fenn's locs trail behind her lead hand; keep the ball forward and clear.
  'idle-ball':{height:[1.05,.75,.65,.9],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'ember-rivet':{
  // Keep Ember's ball at the extended hand without burying it in her curls.
  'idle-ball':{height:[1.2,1.5,1.35,1.5],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'bronze-calder':{
  // Bronze's broad stance calls for the same forward hand lane at both speeds.
  'idle-ball':{height:[1.2,1.5,1.35,1.5],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'violet-lorne':{
  // Violet's long ponytail trails behind her chest-level grip; keep the separate ball ahead of both hands.
  'idle-ball':{height:[1.5,1.8,1.65,1.8],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'cassian-quill':{
  // His broader stance uses the same clear forward-hand lane through ball-ready and court bounces.
  'idle-ball':{height:[1.5,1.8,1.65,1.8],forward:[8,9,9,8]},
  dribble:{forward:[6,7,8,9,10,10,9,8,7,6]},
  'dribble-run':{forward:[8,9,10,11,12,12,11,10,9,8,8]}
},'dorian-mycel':{
  // Reach from the visible forward hand on his low stationary and turbo runs.
  'idle-ball':{height:[1.15,1.1,1.15,1.1],forward:[8,9,9,8]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[8,9,10,12,13,13,12,11,9,8]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[12,13,14,15,16,16,15,14,13,12,12]}
},'luca-velori':{
  // Luca's longer stance needs the ball out in front of his beard and torso.
  'idle-ball':{height:[1.15,1.1,1.15,1.1],forward:[9,10,11,10]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[8,9,10,12,13,13,12,11,9,8]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[12,13,14,15,16,16,15,14,13,12,12]}
},paprika:{
  receive:{height:[.35,.5,.5,.35],forward:[12,13,14,12]},
  pickup:{height:[.2,.15,.05,0,.55],forward:[12,13,14,14,7]},
  shoot:{height:[0,0,.48,.69,.69,.99,.96,.3,0,0],forward:[11.4,10.6,10.3,11.4,10.3,10.5,8.8,10.8,11.4,11]},
  pass:{height:[0,.3,.75,.52,.2,.1],forward:[14.8,13.3,14.8,14.8,15.2,14.8]},
  'idle-ball':{height:[.55,.5,.45,.5],forward:[7,7.5,7,6.5]},
  dribble:{height:[.55,.5,.4,.25,.1,0,.1,.25,.4,.55],forward:[7,7.5,8,8.5,9,9,8.5,8,7.5,7]},
  'dribble-run':{height:[.5,.45,.35,.2,.1,0,.1,.2,.35,.45,.5],forward:[7.5,8,8.5,9,9,9,8.5,8,7.5,7,7.5]}
},'6foot10':{
  // His long reach keeps the ball in front of the forward hand without
  // changing the court-level bounce timing shared by the animation clip.
  'idle-ball':{height:[1.25,1.15,1.1,1.2],forward:[12,13,13,12]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[10,11,12,13,13,12,11,10,9,10]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[12,13,14,15,15,14,13,12,11,12,13]}
},avek:{
  // Long armored arms reach forward; the low pose remains aligned with the
  // court bounce, while brighter follow-through frames bring the hand back up.
  shoot:{forward:[4,5,6,7,7,7,8,7,5,4]},
  'idle-ball':{height:[1.2,1.25,1.15,1.1],forward:[13,14,13,12]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[10,11,12,13,14,14,13,12,11,10]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[14,15,16,17,17,16,15,14,13,14,15]}
},jragena:{
  // Her winged silhouette needs the game ball at her visible forward hands,
  // with the low dribble returned to the floor independently of wing height.
  shoot:{height:[1.5,1.6,1.7,1.8,1.8,1.8,1.7,1.5,1.2,1],forward:[4,5,6,7,7,6,6,5,4,3]},
  'idle-ball':{height:[1.1,1.15,1.25,1.2],forward:[7,10,12,11]},
  dribble:{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.1],forward:[8,10,12,14,14,13,12,11,10,9]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[10,12,14,15,16,16,15,14,13,12,11]}
},'dragon-queen':{
  // The dragon's ball is controlled just ahead of her muzzle/forepaw, not at
  // a human hand near the torso. Low dribble frames touch the court plane.
  shoot:{height:[1.35,1.4,1.55,1.7,1.8,1.8,1.75,1.5,1.35,1.3],forward:[15,17,20,22,22,20,19,18,16,15]},
  'idle-ball':{height:[1.35,1.2,1.1,1.3],forward:[23,25,26,24]},
  dribble:{height:[.95,.8,.6,.35,.1,0,.25,.55,.8,.95],forward:[18,20,22,24,25,24,22,20,18,19]},
  'dribble-run':{height:[.9,.75,.5,.25,.1,0,.2,.45,.7,.85,.95],forward:[20,22,24,26,26,24,23,22,20,21,22]}
},dea:{
  // Keep the separate ball on her raised leading hand and clear of her face
  // throughout the human jump-shot release and follow-through.
  shoot:{forward:[5,6,8,10,12,12,11,9,7,6]}
},lula:{
  // Her leading elf hand carries the separate ball through the leafy-kit shot.
  shoot:{forward:[4,5,6,7,7,7,8,7,5,4]}
},suga:{
  // Suga controls the game ball with a forward coil and muzzle; his snake
  // rig has no hands. Keep the bounce on the lower coil frames.
  shoot:{height:[1,1.3,1.7,2.1,2.3,2.4,2.2,1.8,1.3,1],forward:[4,5,6,7,7,5,6,7,6,5]},
  'idle-ball':{height:[.7,.65,.6,.65],forward:[16,17,18,17]},
  dribble:{height:[.7,.6,.45,.3,.15,0,.15,.3,.5,.65],forward:[14,15,16,18,19,20,20,19,17,16]},
  'dribble-run':{height:[.8,.65,.5,.35,.15,0,.2,.4,.55,.7,.8],forward:[18,18,19,20,21,22,22,21,20,19,18]}
},'gb-design':{
  // Keep the ball visibly in front of the jaguar's hands in both directions.
  'idle-ball':{height:[1.1,1.05,1.1,1.05],forward:[9,10,10,9]},
  dribble:{height:[1.2,1.05,.8,.5,.2,0,.25,.6,.95,1.2],forward:[8,9,10,11,12,12,11,10,9,8]},
  'dribble-run':{height:[1.2,1.1,.85,.55,.25,0,.25,.55,.85,1.1,1.2],forward:[9,10,11,12,13,13,12,11,10,9,9]}
},'pack-mama':{
  // Follow her open forward hand in the green hooded kit; the crouched sixth
  // pose is the court contact for both stationary and running dribbles.
  shoot:{forward:[5,6,7,8,10,11,11,10,8,6]},
  'idle-ball':{height:[1.15,1.2,1.1,1.15],forward:[10,11,10,9]},
  dribble:{height:[1.1,.95,.7,.45,.18,0,.2,.5,.85,1.1],forward:[8,9,10,11,12,12,11,10,9,8]},
  'dribble-run':{height:[1.15,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.15],forward:[11,12,13,14,15,15,14,13,12,11,11]}
},quirky:{
  // His unusually long orangutan arms carry the ball farther forward than a
  // human hand. The low crouch still sends it to the court plane on contact.
  shoot:{forward:[5,7,8,10,12,14,13,10,8,6]},
  'idle-ball':{height:[1.2,1.15,1.1,1.2],forward:[11,12,11,10]},
  dribble:{height:[1.2,1,.75,.5,.2,0,.2,.5,.9,1.15],forward:[11,13,14,15,16,16,15,14,13,11]},
  'dribble-run':{height:[1.2,1.05,.8,.55,.25,0,.25,.55,.85,1.05,1.2],forward:[14,15,16,17,18,18,17,16,15,14,14]}
}};
function sampleFrameScalar(key, elapsedTicks, property, fallback,athleteId){
  const c=animationClips[key],duration=animationDuration(key),sequence=sequenceFor(c);
  const track=athleteBallTracks[athleteId]?.[key]?.[property==='ballHeight'?'height':'forward'];
  const elapsed=Math.max(0,Number.isFinite(elapsedTicks)?elapsedTicks:0);
  let tick=c.loop?elapsed%duration:Math.min(elapsed,duration-1);
  for(let index=0;index<sequence.length;index++){
    const frame=c.frames[sequence[index]];
    if(tick<frame.duration){
      const nextIndex=sequence[index+1]??(c.loop?sequence[0]:sequence[index]);
      const value=track?.[sequence[index]]??frame[property]??fallback,next=track?.[nextIndex]??c.frames[nextIndex][property]??value;
      return value+(next-value)*tick/frame.duration;
    }
    tick-=frame.duration;
  }
  return fallback;
}
export function sampleBallHeight(key, elapsedTicks=0,athleteId){return sampleFrameScalar(key,elapsedTicks,'ballHeight',1.1,athleteId);}
export function sampleBallForward(key, elapsedTicks=0,athleteId){return sampleFrameScalar(key,elapsedTicks,'ballForward',1.5,athleteId);}
// Convert the attached hand's rendered height to the free-flight elevation.
// Above the rim, flight is compressed; an attached ball follows the player's
// uncompressed jump. Match both mappings exactly at the release boundary.
export function flightHeightFromHand(handHeight,jumpHeight=0){
  const h=Math.max(0,handHeight),pixels=(h<=3?h*28:84+(h-3)*3)+jumpHeight*7;
  return pixels<=84?pixels/28:3+(pixels-84)/3;
}
