import {smoothSkin} from './smooth-skin.js';
import * as T from './vendor/three.module.js';
import {paintedMaterials} from './materials.js';
import {smooth} from './rig.js';
export async function createFox(){
 const {material}=await paintedMaterials(),rust=material('#ba612b'),cream=material('#ecddb8'),black=material('#302c24'),inner=material('#b88765');
 const fox=new T.Group(),hips=new T.Bone();hips.name='fox-hips';fox.add(hips);const limbs=[];
 function oval(parent,mat,p,s){const m=new T.Mesh(new T.SphereGeometry(1,32,24),mat);m.position.set(...p);m.scale.set(...s);m.castShadow=true;parent.add(m);if(parent.name!=='fox-head'||mat===rust||mat===cream)m.userData.continuous=true;return m;}
 function tube(parent,pts,r,mat){const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p))),32,r,10,false),mat);parent.add(m);m.userData.continuous=true;m.userData.surfacePath=pts.map(p=>new T.Vector3(...p));m.userData.radii=[r,r,r,r];return m;}
 oval(hips,rust,[0,1.0,0],[.83,.34,.29]);oval(hips,cream,[.32,.98,.16],[.37,.28,.18]);oval(hips,rust,[-.52,.91,0],[.35,.38,.27]);
 const neck=new T.Bone();neck.name='fox-neck';neck.position.set(.62,1.10,0);hips.add(neck);oval(neck,rust,[.08,.16,0],[.29,.37,.25]);
 const head=new T.Bone();head.name='fox-head';head.position.set(.22,.40,.01);neck.add(head);oval(head,rust,[0,0,0],[.335,.305,.265]);oval(head,cream,[.145,-.105,.02],[.28,.145,.20]);oval(head,rust,[.22,-.03,0],[.225,.14,.16]);oval(head,black,[.42,-.03,0],[.070,.057,.067]);
 const eyeRim=material('#735335'),iris=material('#b89f58'),shine=material('#fff4db'),smile=material('#80543a');
 function detail(points,radius,mat){head.add(new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,radius,8,false),mat));}
 for(const z of [-.16,.16]){
  const shape=new T.Shape();shape.moveTo(-.13,0);shape.quadraticCurveTo(-.14,.20,-.105,.32);shape.quadraticCurveTo(-.08,.385,-.045,.34);shape.quadraticCurveTo(.10,.24,.16,.02);shape.quadraticCurveTo(.02,-.025,-.13,0);const ear=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3}),rust);ear.position.set(-.08,.17,z);head.add(ear);oval(head,inner,[-.12,.32,z+.055],[.06,.11,.012]);
  const side=Math.sign(z);
  oval(head,eyeRim,[.10,.07,side*.263],[.090,.062,.023]);oval(head,iris,[.11,.07,side*.281],[.067,.046,.014]);oval(head,black,[.12,.07,side*.294],[.028,.036,.009]);
  oval(head,shine,[.105,.089,side*.305],[.012,.012,.004]);oval(head,shine,[.135,.056,side*.305],[.005,.005,.004]);
  detail([[.35,-.10,side*.17],[.25,-.17,side*.20],[.12,-.125,side*.23]],.006,smile);

 }
 const tail=new T.Bone();tail.name='fox-tail';tail.position.set(-.62,1.06,0);hips.add(tail);const tailMesh=tube(tail,[[0,0,0],[-.40,-.10,0],[-.78,-.28,.03],[-1.04,-.38,.08]],.19,rust);oval(tail,cream,[-1.03,-.38,.08],[.26,.17,.17]);
 for(const [x,z,phase]of [[.52,-.19,.5],[-.52,-.19,.25],[.52,.19,0],[-.52,.19,.75]]){
  const rear=x<0,upper=new T.Bone();upper.name='fox-upper-'+limbs.length;upper.position.set(x,.86,z);hips.add(upper);oval(upper,rust,[0,-.22,0],[.115,.27,.10]);const lower=new T.Bone();lower.name='fox-lower-'+limbs.length;lower.position.y=rear?-.33:-.44;upper.add(lower);oval(lower,black,[0,-.22,0],[.067,.25,.062]);
  let hock=null;if(rear){hock=new T.Bone();hock.name='fox-hock-'+limbs.length;hock.position.y=-.34;lower.add(hock);oval(hock,black,[0,-.105,0],[.055,.14,.055]);}
  const foot=new T.Bone();foot.name='fox-foot-'+limbs.length;foot.position.y=rear?-.21:-.44;(hock||lower).add(foot);oval(foot,black,[.065,0,0],[.15,.072,.085]);limbs.push({upper,lower,hock,foot,x,z,phase,rear});
 }
 fox.userData={hips,limbs,tail,head};await smoothSkin(fox,'fox',rust);return fox;
}
export const FOX_WALK={period:1.5,stance:.68,stride:.40};
export function foxPose(fox,time){
 const {hips,limbs,tail,head}=fox.userData,phase=time/FOX_WALK.period,footPositions=[];
 hips.position.y=.006*Math.cos(phase*Math.PI*4);
 for(const l of limbs){const p=((phase+l.phase)%1+1)%1,stance=p<FOX_WALK.stance;let x,y;
  if(stance){x=.20-.40*p/FOX_WALK.stance;y=.065;}else{const f=(p-FOX_WALK.stance)/(1-FOX_WALK.stance),m=-FOX_WALK.stride*(1-FOX_WALK.stance)/FOX_WALK.stance;x=-.20*(2*f**3-3*f**2+1)+.20*(-2*f**3+3*f**2)+m*(2*f**3-3*f**2+f);y=.065+.075*Math.sin(Math.PI*f)**2;}
  const a=l.rear?.33:.44,b=l.rear?.34:.44,distal=.21,distalX=.045,distalY=Math.sqrt(distal*distal-distalX*distalX),dx=x-(l.rear?distalX:0),dy=y-(.86+hips.position.y)+(l.rear?distalY:0),d=Math.min(a+b-.002,Math.hypot(dx,dy)),cos=Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))),interior=Math.acos(Math.max(-1,Math.min(1,(a*a+b*b-d*d)/(2*a*b))));
  const upper=Math.atan2(dx,-dy)+(l.rear?1:-1)*Math.acos(cos),knee=(l.rear?-1:1)*(Math.PI-interior),lower=upper+knee;
  l.upper.rotation.z=upper;l.lower.position.y=-a;l.lower.rotation.z=knee;
  const distalAngle=l.rear?Math.atan2(distalX,distalY):lower;if(l.hock)l.hock.rotation.z=distalAngle-lower;l.foot.rotation.z=-distalAngle;
  footPositions.push({stance,p,x:l.x+x,y});
 }
 tail.rotation.y=.012*Math.sin(phase*Math.PI*2);tail.rotation.z=.008*Math.cos(phase*Math.PI*2);head.rotation.z=.006*Math.cos(phase*Math.PI*4);fox.updateMatrixWorld(true);return {feet:footPositions,speed:FOX_WALK.stride/(FOX_WALK.stance*FOX_WALK.period)};
}
