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
export function catPose(cat,time){
 const joints=cat.userData.joints,limbs=cat.userData.limbs,t=((time%6)+6)%6,root=joints.pelvis;
 // Reach, contact, claw stroke, retract, shift weight, settle.
 const lift=smooth(t/.95),scratch=smooth((t-1.45)/.65),release=smooth((t-2.35)/.85),shift=Math.sin(Math.PI*smooth((t-3.2)/2.0));
 root.position.set(.04*shift,.025*shift,0);root.rotation.set(0,0,0);
 const rest=new T.Vector3(.56,1.67,.25),touch=new T.Vector3(Math.sin(Math.PI*.2)*1.68,1.5+Math.cos(Math.PI*.2)*1.68,.24),end=new T.Vector3(Math.sin(Math.PI*.2)*1.51,1.5+Math.cos(Math.PI*.2)*1.51,.24);
 let tip=rest.clone().lerp(touch,lift);if(t>=1.45)tip.copy(touch).lerp(end,scratch);if(t>=2.35)tip.lerp(rest,release);
 const contact=t>=1.45&&t<=2.1;
 joints.head.rotation.set(-.03,-.12,.07+.13*lift*(1-release));
 const targetLocal=tip.clone().sub(root.position),amount=lift*(1-release);const hint=[new T.Vector3(.29,1.88,.03),new T.Vector3(.62,1.72,.08),new T.Vector3(.77,1.53,.13),new T.Vector3(.55,1.50,.18),rest.clone()];limbs.reach.userData.hint=hint.map((p,i)=>p.lerp(limbs.reach.userData.rest[i],amount));solveLimb(limbs.reach,targetLocal);
 for(const [name,x,y,z]of [['hind-left',-.32,.105,.28],['hind-right',.39,.105,.30]])solveLimb(limbs[name],new T.Vector3(x,y,z).sub(root.position));
 for(let i=0;i<7;i++)joints['tail-'+i].rotation.z=.025*Math.sin(t*Math.PI/3+i*.55)*Math.sin(Math.PI*t/6);
 cat.updateMatrixWorld(true);const actual=cat.worldToLocal(cat.userData.contact.getWorldPosition(new T.Vector3()));
 return {phase:t<.95?'Reach':t<1.45?'Touch the glass':t<2.1?'Scratch':t<2.35?'Lift the claws':t<3.2?'Retract':t<5.2?'Shift weight':'Settle',contact,progress:scratch,tip:actual,target:tip,loop:t};
}
