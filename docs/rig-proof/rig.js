import * as T from './vendor/three.module.js';
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

function actingArm(mesh,tip,pole){
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
