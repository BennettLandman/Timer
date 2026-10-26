import * as T from './vendor/three.module.js';
import {boredWeight} from '../boredom.js';
// Solve a fixed-length chain in model coordinates. Rendered poses never depend
// on the number of previous screen frames, making pause/scrub/restart exact.
export function solveLimb(mesh,target){
 const rest=mesh.userData.rest,bones=mesh.userData.bones,points=(mesh.userData.hint||rest).map(p=>p.clone()),lengths=rest.slice(1).map((p,i)=>p.distanceTo(rest[i])),base=rest[0],reach=lengths.reduce((a,b)=>a+b,0);
 const goal=target.clone();if(goal.distanceTo(base)>reach-.001)goal.copy(base).add(target.clone().sub(base).setLength(reach-.001));
 for(let iteration=0;iteration<24;iteration++){
  points.at(-1).copy(goal);for(let i=points.length-2;i>=0;i--){const direction=points[i].clone().sub(points[i+1]).setLength(lengths[i]);points[i].copy(points[i+1]).add(direction);}
  points[0].copy(base);for(let i=1;i<points.length;i++){const direction=points[i].clone().sub(points[i-1]).setLength(lengths[i-1]);points[i].copy(points[i-1]).add(direction);}
 }
 let parent=new T.Quaternion();for(let i=0;i<bones.length-1;i++){const q=new T.Quaternion().setFromUnitVectors(rest[i+1].clone().sub(rest[i]).normalize(),points[i+1].clone().sub(points[i]).normalize());bones[i].quaternion.copy(parent.clone().invert().multiply(q));parent=q;}bones.at(-1).quaternion.identity();mesh.updateMatrixWorld(true);
 return points;
}
export const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*t*(t*(t*6-15)+10);};
export const mix=(a,b,t)=>a+(b-a)*t;
// A single elbow, with a stable pole and bounded flexion. Intermediate skin
// controls follow the rigid upper/lower segments; they are not extra joints.
export function twoBone(shoulder,wrist,pole,upper,lower){
 const v=wrist.clone().sub(shoulder),axis=v.clone().normalize();
 const min=Math.sqrt(upper*upper+lower*lower+2*upper*lower*Math.cos(145*Math.PI/180));
 const max=Math.sqrt(upper*upper+lower*lower+2*upper*lower*Math.cos(10*Math.PI/180));
 const d=Math.max(min,Math.min(max,v.length())),target=shoulder.clone().addScaledVector(axis,d);
 const along=(upper*upper-lower*lower+d*d)/(2*d),height=Math.sqrt(Math.max(0,upper*upper-along*along));
 const outward=pole.clone().sub(shoulder);outward.addScaledVector(axis,-outward.dot(axis)).normalize();
 return {elbow:shoulder.clone().addScaledVector(axis,along).addScaledVector(outward,height),wrist:target};
}
function applyArm(mesh,points,handRotation){
 const {rest,bones}=mesh.userData,elbow=bones[0].name.startsWith('reach')?2:1;
 const restNormal=new T.Vector3().crossVectors(rest[elbow].clone().sub(rest[0]),rest[3].clone().sub(rest[elbow])).normalize(),normal=new T.Vector3().crossVectors(points[elbow].clone().sub(points[0]),points[3].clone().sub(points[elbow])).normalize();
 const frame=(axis,n)=>{axis=axis.clone().normalize();const up=n.clone().addScaledVector(axis,-n.dot(axis)).normalize();return new T.Matrix4().makeBasis(axis,up,new T.Vector3().crossVectors(axis,up));};
 let parent=new T.Quaternion();for(let i=0;i<3;i++){
  const bind=frame(rest[i+1].clone().sub(rest[i]),restNormal),posed=frame(points[i+1].clone().sub(points[i]),normal),world=new T.Quaternion().setFromRotationMatrix(posed.multiply(bind.invert()));
  bones[i].quaternion.copy(parent.clone().invert().multiply(world));parent=world;
 }
 bones[3].quaternion.copy(parent.clone().invert().multiply(handRotation));mesh.updateMatrixWorld(true);
}

export function actingArm(mesh,tip,pole){
 const {rest}=mesh.userData,S=rest[0],upper=rest[1].distanceTo(rest[0])+rest[2].distanceTo(rest[1]),lower=rest[3].distanceTo(rest[2]),offset=rest[4].clone().sub(rest[3]),palm=offset.length(),bend=8*Math.PI/180;
 // Solve the elbow against the forearm plus a gently flexed palm as one
 // analytic target. This avoids an iterative hand-orientation flip.
 const effective=Math.sqrt(lower*lower+palm*palm+2*lower*palm*Math.cos(bend)),solution=twoBone(S,tip,pole,upper,effective),axis=solution.wrist.clone().sub(solution.elbow).normalize(),normal=new T.Vector3().crossVectors(solution.elbow.clone().sub(S),axis).normalize(),alpha=Math.atan2(palm*Math.sin(bend),lower+palm*Math.cos(bend)),forearm=axis.clone().applyAxisAngle(normal,-alpha),palmDirection=forearm.clone().applyAxisAngle(normal,bend),W=solution.elbow.clone().addScaledVector(forearm,lower);
 const bindAxis=offset.clone().normalize(),bindNormal=new T.Vector3(0,0,1).addScaledVector(bindAxis,-bindAxis.z).normalize(),front=new T.Vector3(0,0,1).addScaledVector(palmDirection,-palmDirection.z).normalize();
 const bindBasis=new T.Matrix4().makeBasis(bindAxis,bindNormal,new T.Vector3().crossVectors(bindAxis,bindNormal)),basis=new T.Matrix4().makeBasis(palmDirection,front,new T.Vector3().crossVectors(palmDirection,front)),rotation=new T.Quaternion().setFromRotationMatrix(basis.multiply(bindBasis.invert()));
 const points=[S,S.clone().lerp(solution.elbow,rest[0].distanceTo(rest[1])/upper),solution.elbow,W];applyArm(mesh,points,rotation);
 return {points,wristBend:bend,elbowFlex:Math.PI-solution.elbow.clone().sub(S).negate().angleTo(forearm)};
}

export function catPose(cat,time){
 for(const eye of cat.userData.eyes||[])eye.mesh.scale.y=eye.height;
 const joints=cat.userData.joints,limbs=cat.userData.limbs,t=((time%6)+6)%6,root=joints.pelvis;
 const prepare=smooth((t-.10)/.50),lift=smooth((t-.55)/.90),scratch=smooth((t-1.75)/.5),release=smooth((t-2.55)/.95),settle=smooth((t-3.50)/1.0),effort=prepare*(1-settle),look=smooth(t/.40)*(1-smooth((t-3.0)/1.2));
 root.position.set(.045*effort,-.012*effort,0);root.rotation.set(0,0,0);
 const rest=new T.Vector3(.55,1.07,.30),touch=new T.Vector3(Math.sin(Math.PI*.2)*1.68,1.5+Math.cos(Math.PI*.2)*1.68,.24),end=new T.Vector3(Math.sin(Math.PI*.2)*1.51,1.5+Math.cos(Math.PI*.2)*1.51,.24);
 let tip=rest.clone().lerp(touch,lift);tip.x+=.15*Math.sin(Math.PI*lift);tip.z+=.18*Math.sin(Math.PI*lift);
 if(t>=1.75)tip.copy(touch).lerp(end,scratch);
 if(t>=2.55){tip.copy(end).lerp(rest,release);tip.x+=.16*Math.sin(Math.PI*release);tip.z+=.24*Math.sin(Math.PI*release);}
 joints.head.rotation.set(-.03-.10*look,.03+.20*look,.04-.19*look);
 const anatomy=actingArm(limbs.reach,tip.clone().sub(root.position),new T.Vector3(1.10,1.25,-.55));
 const free=limbs.rest.userData,elbowLength=free.rest[1].distanceTo(free.rest[0]),foreLength=free.rest[2].distanceTo(free.rest[1])+free.rest[3].distanceTo(free.rest[2]),freeWrist=new T.Vector3(-.55,1.02,.20).sub(root.position),freePose=twoBone(free.rest[0],freeWrist,new T.Vector3(-1.1,1.5,.60),elbowLength,foreLength);
 applyArm(limbs.rest,[free.rest[0],freePose.elbow,freePose.elbow.clone().lerp(freePose.wrist,free.rest[1].distanceTo(free.rest[2])/foreLength),freePose.wrist],new T.Quaternion().setFromUnitVectors(free.rest[3].clone().sub(free.rest[1]).normalize(),freePose.wrist.clone().sub(freePose.elbow).normalize()));
 for(const [name,x,y,z]of [['hind-left',-.32,.105,.28],['hind-right',.39,.105,.30]])solveLimb(limbs[name],new T.Vector3(x,y,z).sub(root.position));
 for(let i=0;i<7;i++)joints['tail-'+i].rotation.set(0,i===0?-.025*effort:0,0);
 cat.updateMatrixWorld(true);const actual=cat.worldToLocal(cat.userData.contact.getWorldPosition(new T.Vector3()));
 return {phase:t<.55?'Look and prepare':t<1.45?'Reach':t<1.75?'Place the claws':t<2.25?'Scratch':t<2.55?'Release':t<3.50?'Lower the hand':t<4.5?'Return to balance':'Rest',contact:t>=1.75&&t<=2.25,strokeStarted:t>=1.75,progress:scratch,tip:actual,target:tip,loop:t,anatomy};
}

// The production glass actor shares the reviewed single-elbow solver. Targets
// are expressed on the glass plane; the pelvis lowers for low marks while
// the feet remain on their support plane.
export function catWorkPose(cat, target, time=0, engagement=1){
 catPose(cat,0);
 const {joints,limbs}=cat.userData;
 joints.pelvis.position.y=(.10*smooth((target.y-2.5)/.5)-.80*smooth((1.5-target.y)/1.1))*engagement;
 const root=joints.pelvis.position;
 joints.head.rotation.set(-.03+Math.max(-.20,Math.min(.20,(2.25-target.y)*.10))*engagement,mix(.03,Math.max(-.22,Math.min(.22,(target.x-.3)*.12)),engagement),mix(.04,Math.max(-.16,Math.min(.16,(target.x-.3)*-.08)),engagement));
 const goal=new T.Vector3(.55,1.07,.30).lerp(target,engagement);
 const anatomy=actingArm(limbs.reach,goal.clone().sub(root),new T.Vector3(1.1,1.25,-.55));
 for(const [name,x,y,z]of [['hind-left',-.32,.105,.28],['hind-right',.39,.105,.30]])solveLimb(limbs[name],new T.Vector3(x,y,z).sub(root));
 cat.updateMatrixWorld(true);
 const actual=cat.worldToLocal(cat.userData.contact.getWorldPosition(new T.Vector3()));
 return {tip:actual,target:goal,anatomy,error:actual.distanceTo(goal)};
}
export function catWalkPose(cat,time){
 catPose(cat,0);const root=cat.userData.joints.pelvis,phase=time/1.5;
 root.position.y=.008*Math.cos(phase*Math.PI*4);
 for(const [name,x,offset]of [['hind-left',-.32,0],['hind-right',.39,.5]]){
  const p=((phase+offset)%1+1)%1, lift=p>.66?.085*Math.sin(Math.PI*(p-.66)/.34)**2:0;
  solveLimb(cat.userData.limbs[name],new T.Vector3(x+(p<.66?.18-.36*p/.66:-.18+.36*smooth((p-.66)/.34)),.105+lift-root.position.y,.28));
 }
 cat.userData.joints.head.rotation.z=.035;cat.updateMatrixWorld(true);
}

export function catIdlePose(cat,time){
 catPose(cat,0);
 const beat=((time%12)+12)%12,look=smooth((beat-1)/1.5)*(1-smooth((beat-7)/2));
 cat.userData.joints.head.rotation.y+=.20*look;
 cat.userData.joints.head.rotation.z+=.08*look;
 // Inspect the painting hand, then lower it. A deliberate shoulder/elbow
 // gesture remains visible through the frosted panel between minute changes.
 const lift=smooth((beat-2)/1.5)*(1-smooth((beat-6)/2));
 const hand=new T.Vector3(.55+.08*lift,1.07+.63*lift,.30+.18*lift);
 actingArm(cat.userData.limbs.reach,hand,new T.Vector3(1.1,1.25,-.55));
 const blink=((time%7.3)+7.3)%7.3,closed=blink>6.9?Math.sin((blink-6.9)/.4*Math.PI)**2:0;
 for(const eye of cat.userData.eyes||[])eye.mesh.scale.y=eye.height*(1-.96*closed);
 cat.userData.joints['tail-0'].rotation.y=.04*Math.sin(time*.45);
 cat.updateMatrixWorld(true);return {hand,head:cat.userData.joints.head.rotation.clone()};
}

function freeArmPose(cat,wrist){
 const mesh=cat.userData.limbs.rest,free=mesh.userData,upper=free.rest[1].distanceTo(free.rest[0]),lower=free.rest[2].distanceTo(free.rest[1])+free.rest[3].distanceTo(free.rest[2]);
 const solution=twoBone(free.rest[0],wrist,new T.Vector3(-1.1,1.5,.60),upper,lower);
 applyArm(mesh,[free.rest[0],solution.elbow,solution.elbow.clone().lerp(solution.wrist,free.rest[1].distanceTo(free.rest[2])/lower),solution.wrist],new T.Quaternion().setFromUnitVectors(free.rest[3].clone().sub(free.rest[1]).normalize(),solution.wrist.clone().sub(solution.elbow).normalize()));
}
export function catBoredPose(cat,time,moment){
 const idle=catIdlePose(cat,time),{joints,limbs}=cat.userData,{local:t,duration,type}=moment;
 const weight=boredWeight(moment),root=joints.pelvis;
 let hand=new T.Vector3(.55,1.07,.30),free=new T.Vector3(-.55,1.02,.20),head=new T.Euler(-.03,.03,.04),lift=0;
 if(type==='watch'){
  // Raise the watch, tap it once, then give the room a mildly dubious look.
  const tap=smooth((t-2.6)/.25)*(1-smooth((t-3.0)/.35)),audience=smooth((t-4.4)/.7)*(1-smooth((t-6.0)/.5));
  free.set(-.10,1.58,.55);hand.set(-.015,1.62,.69-.035*tap);
  head.set(.22*(1-audience),-.16*(1-audience),.11);
 }else if(type==='stretch'){
  hand.set(.62,2.90,.45);free.set(-.52,2.70,.30);head.set(-.14,.03,-.04);
  root.position.y=.015*weight;
 }else if(type==='yoga'){
  lift=smooth((t-1.5)/1.4)*(1-smooth((t-duration+3.1)/1.3));
  root.position.x=(-.12+.012*Math.sin(t*3.1)*lift)*weight;root.position.y=-.035*weight;
  hand.set(.12,1.60,.60);free.set(-.10,1.50,.55);head.set(-.04,.03,-.05);
  for(const eye of cat.userData.eyes||[])eye.mesh.scale.y*=1-.66*weight;
 }else if(type==='snack'){
  hand.set(.25,2.04,.57);head.set(.075+.018*Math.sin(t*7.0),-.08,.05);
 }else if(type==='yawn'){
  hand.set(.18,2.17,.58);head.set(-.09,.03,-.06);root.position.y=.012*weight;
  for(const eye of cat.userData.eyes||[])eye.mesh.scale.y*=1-.8*weight;
 }else if(type==='nap'){
  hand.set(.29,2.20,.59);free.set(-.10,2.12,.55);head.set(.10+.018*Math.sin(t*1.5),-.08,.23);root.position.y=-.035*weight;
  for(const eye of cat.userData.eyes||[])eye.mesh.scale.y*=1-.94*weight;
 }else if(type==='sneeze'){
  const sniff=smooth((t-2.1)/.5)*(1-smooth((t-3.1)/.7)),achoo=smooth((t-4.5)/.18)*(1-smooth((t-4.8)/.8));
  hand.set(.14,2.16,.60);head.set(-.10*sniff+.23*achoo,-.05,.04);root.position.y=-.025*achoo*weight;
 }else if(type==='earScratch'){
  hand.set(.47,2.53+.028*Math.sin(t*7),.48);head.set(.03,-.12,-.12);
 }else if(type==='noseItch'){
  hand.set(.10+.025*Math.sin(t*5),2.20,.59);head.set(.08,.03,.055);
 }else if(type==='beret'){
  hand.set(.43,2.70,.45);free.set(-.33,2.60,.39);head.set(-.04,.03,.055*Math.sin(t*2));
 }else if(type==='whiskers'){
  hand.set(.38+.025*Math.sin(t*3),2.20,.61);free.set(-.28,2.15,.56);head.set(-.025,.10*Math.sin(t*.8),.02);
 }else if(type==='manicure'){
  hand.set(.55,1.95,.63);free.set(-.12,1.50,.55);head.set(.12,.16,.11*Math.sin(t*.8));
 }else if(type==='fingerCount'){
  hand.set(-.08+.055*Math.sin(t*3),1.62,.69);free.set(-.18,1.53,.56);head.set(.19,-.11,.12*Math.sin(t*.7));
 }else if(type==='shrug'){
  hand.set(1.02,1.80,.55);free.set(-.98,1.72,.49);head.set(-.03,-.12,.16);root.position.y=.018*weight;
 }else if(type==='conductor'){
  hand.set(.56+.18*Math.sin(t*2.6),1.90+.16*Math.cos(t*2.6),.62);free.set(-.63,1.32,.40);head.set(.02,.07,.04*Math.sin(t*2.6));
 }else if(type==='mime'){
  hand.set(.61+.05*Math.sin(t),1.96,.64);free.set(-.55,1.78+.06*Math.cos(t),.60);head.set(.04,-.15,.07);root.position.y=-.02*weight;
 }else if(type==='lookout'){
  hand.set(.40,2.49,.59);head.set(-.04,.24*Math.sin(t*.8),-.08);root.position.x=.06*Math.sin(t*.8)*weight;
 }else if(type==='salute'){
  hand.set(.35,2.45,.58);head.set(-.05,.15,.0);
 }else if(type==='detective'){
  hand.set(.32+.035*Math.sin(t*.9),2.15,.64);head.set(.03,.10*Math.sin(t*.9),-.07);
 }else if(type==='tea'){
  const sip=smooth((t-2)/1.1)*(1-smooth((t-5.8)/1));
  hand.set(.25,1.77+.31*sip,.59);free.set(-.20,1.40,.52);head.set(-.08*sip,.04,-.04);
 }else if(type==='book'){
  const turn=smooth((t-4)/.6)*(1-smooth((t-5)/.7));
  hand.set(.30-.22*turn,1.44+.09*turn,.73);free.set(-.34,1.36,.61);head.set(.18,-.10+.08*Math.sin(t*.9),.035);
 }else if(type==='feather'){
  hand.set(.42+.025*Math.sin(t*1.7),1.87,.61);head.set(.06,-.11,.06+.035*Math.sin(t*1.7));
 }else if(type==='bow'){
  hand.set(-.02,1.28,.60);free.set(-.76,1.58,.50);head.set(.32,.03,-.03);root.position.y=-.13*weight;
 }else if(type==='ukulele'){
  hand.set(.20,1.35+.055*Math.sin(t*6),.73);free.set(-.50,1.65,.66);head.set(.08,.04,.06*Math.sin(t*3));
 }

 const reach=idle.hand.clone().lerp(hand,weight).sub(root.position),left=new T.Vector3(-.55,1.02,.20).lerp(free,weight).sub(root.position);
 // Hands arc forward on the way overhead, avoiding an over-folded elbow
 // while the wrists pass shoulder height.
 const arc=.16*Math.sin(Math.PI*weight);if(hand.y>2.35)reach.z+=arc;if(free.y>2.3)left.z+=arc;
 const anatomy=actingArm(limbs.reach,reach,new T.Vector3(1.1,1.25,-.55));freeArmPose(cat,left);
 joints.head.rotation.set(mix(idle.head.x,head.x,weight),mix(idle.head.y,head.y,weight),mix(idle.head.z,head.z,weight));
 for(const [name,x]of [['hind-left',-.32],['hind-right',.39]]){
  const goal=new T.Vector3(x,.105,.28+(x>0?.02:0));
  if(name==='hind-right')goal.lerp(new T.Vector3(.055,.53,.23),lift);
  solveLimb(limbs[name],goal.sub(root.position));
 }
 cat.updateMatrixWorld(true);return {type,weight,lift,anatomy,handTarget:reach.clone().add(root.position),freeTarget:left.clone().add(root.position)};
}
