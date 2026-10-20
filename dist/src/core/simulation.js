const COURT = { minX: 0, maxX: 200, minY: 0, maxY: 100, hoops: [8, 192], arc: 34 };
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
const hypot = (x, y) => Math.hypot(x, y) || 1;

export function scoreValue(player, team) {
  const hoop = team === 0 ? COURT.hoops[1] : COURT.hoops[0];
  return hypot(player.x - hoop, (player.y ?? 50) - 50) > COURT.arc ? 3 : 2;
}

export function createInput(playerId, values = {}) {
  return { playerId, x: 0, y: 0, turbo: false, shootPressed: false, shootHeld: false, passPressed: false, blockPressed: false, stealPressed: false, pausePressed: false, ...values };
}

export function createMatch({ quarterSeconds = 180, seed = 12345, home = null, away = null, homePartnerId = null, awayPartnerId = null } = {}) {
  const random = seed >>> 0;
  const players = [];
  const teamDefs = [home, away];
  const partnerIds=[homePartnerId,awayPartnerId];
  for (let team = 0; team < 2; team++) {
    const center = team === 0 ? 42 : 158;
    for (let n = 0; n < 2; n++) {
      const athlete = n===0 ? teamDefs[team]?.roster?.[0] ?? null : teamDefs[team]?.roster?.find(p=>p.id===partnerIds[team]) ?? teamDefs[team]?.roster?.[1] ?? null;
      players.push({ id: athlete?.id ?? `p${team}-${n}`, name: athlete?.name ?? (team === 0 ? ['Rookie','Sidekick'][n] : ['CPU Ace','CPU Wing'][n]), team, x: center + n * 5, y: 38 + n * 24, vx: 0, vy: 0, z: 0, vz: 0, speed: .09 + ((athlete?.stats?.speed ?? 78) / 99) * .09, shoot: athlete?.stats?.three ?? 78, dunk: athlete?.stats?.dunk ?? 75, block: athlete?.stats?.block ?? 75, steal: athlete?.stats?.steal ?? 75, hasBall: team === 0 && n === 0, stamina: 100, stun: 0, anim: 'idle', points: 0, fga: 0, fgm: 0, threeAttempts: 0, threeMakes: 0, assists: 0, rebounds: 0, steals: 0, blocks: 0, fires: 0, fireGoals: 0, madeRun: 0, onFire: false, facing: team === 0 ? 1 : -1 });
    }
  }
  const holder = players.find(p => p.hasBall);
  return { seed: random, rng: random, players, ball: { mode: 'carried', ownerId: holder.id, targetId: null, x: holder.x, y: holder.y, z: 1, vx: 0, vy: 0, vz: 0, lastTouch: holder.id, attemptId: null, value: 2, scored: false, rim: false, backboard: false }, score: [0,0], period: 1, clock: quarterSeconds, shotClock: 24, quarterSeconds, phase: 'playing', pause: false, possession: 0, lastEvent: 'Tip-off!', events: [], nextAttempt: 1, possessionAge: 0, periodBreak: 0, overtimeSeconds: 60, teamNames: [home?.name ?? 'Chicago Condas', away?.name ?? 'Crownfire Sovereigns'], winner: null };
}

function rand(match) {
  let x = match.rng || 1; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; match.rng = x >>> 0; return match.rng / 4294967296;
}
function playerById(match, id) { return match.players.find(p => p.id === id); }
function releaseOwner(match) { for (const p of match.players) p.hasBall = false; match.ball.ownerId = null; }
function giveBall(match, player, announce = '', preserveAssist = false) {
  releaseOwner(match); player.hasBall = true; match.ball.mode = 'carried'; match.ball.ownerId = player.id; match.ball.targetId = null; match.ball.attemptId = null; match.ball.scored = false; match.ball.x = player.x; match.ball.y = player.y; match.ball.z = 1; match.ball.vx = match.ball.vy = match.ball.vz = 0;
  if(!preserveAssist)match.assistCandidateId=null;
  match.ball.lastTouch = player.id; match.possession = player.team; match.shotClock = 24; match.possessionAge = 0;
  if (announce) event(match, announce);
}
function event(match, text) { match.lastEvent = text; match.events.push({ tick: Math.round((match.quarterSeconds - match.clock) * 60), text }); if (match.events.length > 60) match.events.shift(); }
export function commitScore(match, attempt) {
  if (!attempt?.id || match.scoredAttempts?.includes(attempt.id) || match.phase === 'final') return false;
  match.scoredAttempts ??= [];
  match.scoredAttempts.push(attempt.id);
  match.score[attempt.team] += attempt.points;
  const scorer = playerById(match, attempt.playerId);
  if (scorer) { scorer.points += attempt.points; scorer.fgm++; if(attempt.points===3)scorer.threeMakes++; scorer.madeRun++; scorer.fireGoals++; }
  const assister=playerById(match,match.assistCandidateId);
  if(assister&&assister.team===attempt.team&&assister.id!==scorer?.id)assister.assists++;
  match.assistCandidateId=null;
  const cooling = match.players.filter(p => p.team !== attempt.team && p.onFire);
  for (const player of cooling) { player.onFire = false; player.fireGoals = 0; player.madeRun = 0; event(match, `${player.name} cools off!`); }
  for (const player of match.players) if (player.id !== scorer?.id) player.madeRun = 0;
  if (scorer?.madeRun >= 3 && !scorer.onFire) { scorer.onFire = true; scorer.fires++; event(match, `${scorer.name} is ON FIRE!`); }
  event(match, `${scorer?.name ?? 'Athlete'} scores ${attempt.points}!`);
  match.ball.mode = 'dead'; match.ball.scored = true; match.ball.ownerId = null;
  for (const p of match.players) p.hasBall = false;
  match.scorePause = 42;
  return true;
}

function makeShot(match, player) {
  const hoop = player.team === 0 ? COURT.hoops[1] : COURT.hoops[0];
  const direction = Math.sign(hoop - player.x) || (player.team === 0 ? 1 : -1);
  const points = scoreValue(player, player.team), distance = Math.abs(hoop - player.x);
  const attempt = { id: `shot-${match.nextAttempt++}`, team: player.team, playerId: player.id, points };
  player.fga++;if(points===3)player.threeAttempts++;
  const open = match.players.filter(p => p.team !== player.team).reduce((best, p) => Math.min(best, hypot(p.x-player.x,p.y-player.y)), 99);
  const quality = clamp((open - 5) / 30, 0, 1);
  const base = player.shoot / 100 * .35 + quality * .32 + (distance < 42 ? .2 : .04) + (player.onFire ? .3 : 0);
  const made = rand(match) < clamp(base, .2, .88);
  match.ball.mode = 'shot'; match.ball.ownerId = null; match.ball.targetId = null; match.ball.lastTouch = player.id; match.ball.attemptId = attempt.id; match.ball.value = points; match.ball.scored = false; match.ball.rim = false; match.ball.backboard=false;
  match.ball.x = player.x + direction * .8; match.ball.y = player.y; match.ball.z = 3; match.ball.vz = made ? 1.05 + Math.min(.3,distance*.002) : .88 + rand(match)*.35;
  const descentFrames=(match.ball.vz+Math.sqrt(match.ball.vz**2+4*.013*(3-2.6)))/.026;
  const releaseDistance=Math.abs(hoop-match.ball.x);
  match.ball.vx = direction * (made ? Math.min(1.25, releaseDistance / descentFrames) : .55 + rand(match) * .3);
  match.ball.vy = made ? (50-player.y)/descentFrames : clamp((50 - player.y) / 75, -.45, .45); match.ball.made = made; match.ball.targetX = hoop; match.ball.targetY = 50; match.ball.targetZ = 2.6;
  releaseOwner(match); player.anim = 'shoot'; player.vz = .32;
  if (player.onFire) player.fireGoals++;
  event(match, `${player.name} launches a ${points}-pointer`);
  match.shotClock = 24;
}

function passBall(match, player, turbo) {
  const mates = match.players.filter(p => p.team === player.team && p.id !== player.id);
  const target = mates.sort((a,b) => hypot(a.x-player.x,a.y-player.y)-hypot(b.x-player.x,b.y-player.y))[0];
  if (!target) return;
  const dx = target.x-player.x, dy = target.y-player.y, d = hypot(dx,dy);
  releaseOwner(match); match.assistCandidateId=player.id; match.ball.mode = 'pass'; match.ball.targetId = target.id; match.ball.lastTouch = player.id; match.ball.x = player.x; match.ball.y = player.y; match.ball.z = 1.6; match.ball.vx = dx/d*(turbo?1.7:1.15); match.ball.vy = dy/d*(turbo?1.4:.95); match.ball.vz = .02;
  event(match, `${player.name} ${turbo ? 'fires a laser pass' : 'passes'}`);
}

function actions(match, inputMap) {
  for (const p of match.players) {
    const inp = inputMap.get(p.id) ?? createInput(p.id);
    const offense = p.team === match.possession;
    if (p.hasBall && offense) {
      if (inp.passPressed) { passBall(match,p,inp.turbo); continue; }
      if (inp.shootPressed) {
        const hoop = p.team === 0 ? COURT.hoops[1] : COURT.hoops[0], d = Math.abs(hoop-p.x);
        const close = d < 18, toward = (hoop-p.x)*p.vx > 0.12;
        if (close && toward && p.dunk > 70 && (inp.turbo || p.vx > .1)) { dunk(match,p); continue; }
        makeShot(match,p); continue;
      }
    } else if (!offense && inp.stealPressed) {
      const holder = match.players.find(a=>a.hasBall && a.team !== p.team);
      if (holder && hypot(holder.x-p.x,holder.y-p.y) < 8 && rand(match) < .1 + p.steal/400) { holder.stun=30; p.steals++; match.ball.mode='loose'; releaseOwner(match); match.ball.x=holder.x; match.ball.y=holder.y; match.ball.z=1.3; match.ball.vx=-holder.facing*.42; match.ball.vy=(rand(match)-.5)*.35; match.ball.vz=.12; match.ball.lastTouch=p.id; event(match,`${p.name} pokes it loose!`); }
    }
    if (inp.blockPressed && !offense) { p.vz = Math.max(p.vz,.34); p.anim='block'; }
  }
}
function dunk(match,p) {
  const hoop = p.team === 0 ? COURT.hoops[1] : COURT.hoops[0], dir = Math.sign(hoop-p.x);
  const points=scoreValue(p,p.team), attempt={id:`dunk-${match.nextAttempt++}`,team:p.team,playerId:p.id,points};p.fga++;if(points===3)p.threeAttempts++;
  const flightFrames=Math.max(6,Math.abs(hoop-p.x)/.72);
  const targetZ=2.3;
  p.anim='dunk'; p.vx=dir*.5; p.vz=.5; match.ball.mode='dunk'; match.ball.ownerId=null; match.ball.attemptId=attempt.id; match.ball.value=points; match.ball.x=p.x; match.ball.y=p.y; match.ball.z=3; match.ball.vx=dir*.72; match.ball.vy=0; match.ball.vz=(targetZ-3+.013*flightFrames*flightFrames)/flightFrames; match.ball.made=true; match.ball.targetX=hoop; match.ball.targetY=50; match.ball.targetZ=targetZ; match.ball.scored=false; match.ball.rim=false;match.ball.backboard=false;match.ball.lastTouch=p.id; releaseOwner(match); event(match,`${p.name} elevates for a JAM!`);
}

function aiInputs(match, controlled) {
  const out=[];
  for (const p of match.players) {
    if (controlled.has(p.id)) continue;
    const offense=p.team===match.possession, holder=match.players.find(a=>a.hasBall&&a.team===p.team), ball=match.ball;
    let targetX,targetY;
    if (ball.mode==='loose'||ball.mode==='pass') { targetX=ball.x; targetY=ball.y; }
    else if (offense) {
      const hoop=p.team===0?COURT.hoops[1]:COURT.hoops[0];
      if (holder?.id===p.id) { targetX=hoop-Math.sign(hoop-p.x)*23; targetY=50; }
      else { targetX=(holder?.x ?? p.x)+Math.sign(hoop-(holder?.x??p.x))*12; targetY=p.y<50?38:62; }
    } else {
      const carrier=match.players.find(a=>a.hasBall&&a.team!==p.team); targetX=carrier?.x??ball.x; targetY=carrier?.y??ball.y;
    }
    const dx=targetX-p.x,dy=targetY-p.y,dist=hypot(dx,dy), move=dist>2;
    const hoop=p.team===0?COURT.hoops[1]:COURT.hoops[0], shotDistance=Math.abs(hoop-p.x);
    const nearestDefender=match.players.filter(a=>a.team!==p.team).reduce((n,a)=>Math.min(n,hypot(a.x-p.x,a.y-p.y)),99);
    const shoot=offense&&p.hasBall&&shotDistance<58&&(match.shotClock<9||(nearestDefender>7&&rand(match)<.045));
    const passingLane=match.players.some(a=>a.team===p.team&&a.id!==p.id&&Math.abs(a.x-p.x)<32&&match.players.filter(d=>d.team!==p.team).every(d=>hypot(d.x-a.x,d.y-a.y)>8));
    const pass=offense&&p.hasBall&&nearestDefender<9&&passingLane&&rand(match)<.001;
    out.push(createInput(p.id,{x:move?dx/dist:0,y:move?dy/dist:0,turbo:move,shootPressed:shoot,passPressed:pass,stealPressed:!offense&&dist<7&&rand(match)<.025,blockPressed:!offense&&(ball.mode==='shot'||ball.mode==='dunk')&&dist<10&&ball.z>3&&rand(match)<.08}));
  }
  return out;
}

function integratePlayers(match, inputs) {
  const map=new Map(inputs.map(i=>[i.playerId,i]));
  for (const p of match.players) {
    const inp=map.get(p.id)??createInput(p.id);
    if (p.stun>0) { p.stun--; p.vx*=.86;p.vy*=.86; }
    else {
      const m=hypot(inp.x,inp.y), ix=inp.x/m, iy=inp.y/m, boost=inp.turbo&&p.stamina>0&&!p.onFire?1.55:1;
      const accel=p.speed*boost;
      p.vx+=ix*accel;p.vy+=iy*accel;
      if(inp.turbo&&m>0&&!p.onFire)p.stamina=Math.max(0,p.stamina-.34);else p.stamina=Math.min(100,p.stamina+.18);
    }
    const max=p.speed*(inp.turbo||p.onFire?2.65:1.8), speed=hypot(p.vx,p.vy);
    if(speed>max){p.vx=p.vx/speed*max;p.vy=p.vy/speed*max;}
    p.x=clamp(p.x+p.vx,COURT.minX,COURT.maxX);p.y=clamp(p.y+p.vy,COURT.minY,COURT.maxY);p.vx*=.9;p.vy*=.9;
    if(Math.abs(p.vx)>.015)p.facing=Math.sign(p.vx);
    if(p.z>0||p.vz>0){p.z+=p.vz;p.vz-=.025;if(p.z<=0){p.z=0;p.vz=0;if(p.anim==='shoot'||p.anim==='block'||p.anim==='dunk')p.anim='idle';}}
    else if(p.anim!=='idle'&&p.anim!=='dunk')p.anim='run';
  }
}

function resolveShotBlock(match){
  const b=match.ball;if(b.mode!=='shot'&&b.mode!=='dunk')return;
  const defenders=match.players.filter(p=>p.team!==match.possession&&p.anim==='block'&&p.z>.05);
  for(const p of defenders){
    const reach=p.z+5.2,distance=hypot(p.x-b.x,p.y-b.y);
    if(distance>7||b.z>reach||b.z<1.4)continue;
    const overCylinder=Math.abs(b.x-b.targetX)<5.5&&Math.abs(b.y-b.targetY)<7;
    if(b.mode==='shot'&&b.made&&!b.rim&&!b.backboard&&b.vz<0&&overCylinder&&b.z<=b.targetZ+4&&b.z>b.targetZ){
      const shooter=playerById(match,b.lastTouch);
      if(shooter&&b.attemptId&&commitScore(match,{id:b.attemptId,team:shooter.team,playerId:shooter.id,points:b.value})){
        event(match,`${p.name} goaltends — basket counts!`);
        return;
      }
    }
    const chance=clamp(.42+p.block/210-(b.z/45),.25,.84);
    if(rand(match)>=chance)continue;
    b.mode='loose';b.ownerId=null;b.targetId=null;b.attemptId=null;b.made=false;b.vx=(p.team===0?1:-1)*(.42+rand(match)*.32);b.vy=clamp((b.y-p.y)*.08+(rand(match)-.5)*.25,-.5,.5);b.vz=.28;b.lastTouch=p.id;p.blocks++;p.vz=Math.max(p.vz,.18);event(match,`${p.name} blocks the shot!`);return;
  }
}

function integrateBall(match) {
  const b=match.ball;
  if(b.mode==='carried') { const p=playerById(match,b.ownerId);if(!p){b.mode='loose';b.ownerId=null;return;} b.x=p.x+p.facing*1.5;b.y=p.y;b.z=1.1+Math.abs(Math.sin((match.quarterSeconds-match.clock)*9))*.5;return; }
  if(b.mode==='dead')return;
  const oldZ=b.z; b.x+=b.vx;b.y+=b.vy;b.z+=b.vz;b.vz-=.026;
  if(b.mode==='shot'||b.mode==='dunk'){
    const nearHoop=Math.abs(b.x-b.targetX)<2.5&&Math.abs(b.y-b.targetY)<8;
    const crossedToBasket=(b.vx>0&&b.x>=b.targetX)||(b.vx<0&&b.x<=b.targetX);
    const bankedBackThrough=(b.backboard&&((b.vx>0&&b.x<=b.targetX)||(b.vx<0&&b.x>=b.targetX)));
    const crossed=crossedToBasket||bankedBackThrough;
    const insideOpening=Math.abs(b.y-b.targetY)<4.5;
    if(crossed&&b.made&&!b.scored&&b.z<=b.targetZ&&oldZ>b.targetZ&&nearHoop&&insideOpening){const shotOwner=playerById(match,b.lastTouch);if(shotOwner&&b.attemptId){commitScore(match,{id:b.attemptId,team:shotOwner.team,playerId:shotOwner.id,points:b.value});return;}}
    const rimWindow=Math.abs(b.x-b.targetX)<1.2&&Math.abs(b.y-b.targetY)<7.5&&Math.abs(b.z-b.targetZ)<.35;
    const cleanEntry=b.made&&insideOpening&&b.vz<0;
    if(!b.rim&&rimWindow&&!cleanEntry){b.rim=true;b.vx=-b.vx*.58;b.vy=clamp(b.vy+(b.y-b.targetY)*.06+(rand(match)-.5)*.05,-.5,.5);b.vz=Math.abs(b.vz)*.55+.1;event(match,'The shot rattles off the rim!');}
    const direction=Math.sign(b.vx),boardX=b.targetX+direction*4;
    const backboardWindow=Math.abs(b.x-boardX)<.8&&Math.abs(b.y-b.targetY)<9&&b.z>b.targetZ+.35&&b.z<b.targetZ+3.2;
    if(!b.backboard&&backboardWindow){b.backboard=true;b.vx=-b.vx*.9;b.vz=Math.abs(b.vz)*.45+.02;event(match,'Bank shot off the glass!');}
    if((b.z<=0||Math.abs(b.x-b.targetX)>50)&&b.mode!=='dead'){b.z=Math.max(0,b.z);b.mode='loose';b.vz=Math.abs(b.vz)*.55+.12;b.vx*=.72;b.vy*=.72;event(match,'Rebound!');}
    return;
  }
  if(b.mode==='pass'){
    const target=playerById(match,b.targetId);
    if(target&&hypot(target.x-b.x,target.y-b.y)<6){giveBall(match,target,`${target.name} catches it`,true);return;}
  }
  if(b.z<=0){b.z=0;b.vz=Math.abs(b.vz)*.55;if(Math.abs(b.vz)<.08)b.vz=.14;b.vx*=.82;b.vy*=.82;}
  const candidates=match.players.filter(p=>p.stun===0&&hypot(p.x-b.x,p.y-b.y)<4.5&&b.z<3&&!(b.mode==='pass'&&p.id===b.lastTouch&&hypot(p.x-b.x,p.y-b.y)<5)).sort((a,c)=>hypot(a.x-b.x,a.y-b.y)-hypot(c.x-b.x,c.y-b.y));
  if(candidates.length){const p=candidates[0];p.rebounds++;giveBall(match,p,p.team===match.possession?'Offensive board!':'Defensive rebound!');}
  if(b.x<COURT.minX-5||b.x>COURT.maxX+5||b.y< -5||b.y>105){const lastTouch=playerById(match,b.lastTouch),offense=lastTouch?.team??match.possession;b.x=100;b.y=50;b.z=1;b.vx=0;b.vy=0;b.vz=0;b.mode='dead';match.possession=offense;releaseOwner(match);b.lastTouch=`team-${offense}`;match.scorePause=30;event(match,'Out of bounds — quick opposing inbound');}
}

function resolvePeriod(match) {
  if(match.periodBreak>0){match.periodBreak--;if(match.periodBreak===0){match.phase=match.period>4?'overtime':'playing';const team=match.period%2===0?1:0;const p=match.players.find(a=>a.team===team);giveBall(match,p,`Quarter ${match.period}: play!`);}return;}
  if(match.clock>0)return;
  if(match.period<4){match.period++;match.clock=match.quarterSeconds;match.shotClock=24;match.phase='break';match.periodBreak=100;match.ball.mode='dead';releaseOwner(match);event(match,match.period===3?'Halftime!':'Quarter break');return;}
  if(match.score[0]===match.score[1]){match.period++;match.clock=match.overtimeSeconds;match.shotClock=24;match.phase='break';match.ball.mode='dead';releaseOwner(match);match.periodBreak=100;event(match,'Overtime!');return;}
  match.phase='final';match.winner=match.score[0]>match.score[1]?0:1;match.ball.mode='dead';releaseOwner(match);event(match,`${match.teamNames[match.winner]} win!`);
}

export function stepMatch(match, inputFrames = []) {
  if(match.phase==='final'||match.pause)return match;
  const frames=inputFrames.map(f=>({...createInput(f.playerId),...f}));
  const pause=frames.find(f=>f.pausePressed);if(pause){match.pause=!match.pause;return match;}
  if(match.phase==='break'){resolvePeriod(match);return match;}
  if(match.scorePause>0){match.scorePause--;if(match.scorePause===0){const team=1-match.players.find(p=>p.id===match.ball.lastTouch)?.team;const inboundTeam=Number.isFinite(team)?team:1-match.possession;const receiver=match.players.find(p=>p.team===inboundTeam);giveBall(match,receiver,'Inbound!');}return match;}
  const inputIds=new Set(frames.map(f=>f.playerId));
  const allInputs=frames.concat(aiInputs(match,inputIds));
  actions(match,new Map(allInputs.map(i=>[i.playerId,i])));
  integratePlayers(match,allInputs);
  resolveShotBlock(match);
  integrateBall(match);
  match.clock=Math.max(0,match.clock-1/60);
  match.shotClock=Math.max(0,match.shotClock-1/60);
  match.possessionAge++;
  if(match.shotClock===0&&match.ball.mode==='carried'){
    const team=match.possession;event(match,'24-second violation');match.shotClock=24;match.ball.mode='dead';releaseOwner(match);match.scorePause=30;match.ball.lastTouch=`team-${team}`;
  }
  for(const p of match.players)if(p.onFire&&p.fireGoals>=7){p.onFire=false;p.fireGoals=0;event(match,`${p.name} cools down`);}
  resolvePeriod(match);
  return match;
}

export const court = COURT;
