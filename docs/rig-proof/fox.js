import {smoothSkin} from './smooth-skin.js';
import * as T from './vendor/three.module.js';
import {paintedMaterials} from './materials.js';
import {smooth} from './rig.js';
export async function createFox(){
 const {material}=await paintedMaterials(),rust=material('#ba612b'),cream=material('#ecddb8'),black=material('#302c24'),inner=material('#9c684b');
 const fox=new T.Group(),hips=new T.Bone();hips.name='fox-hips';fox.add(hips);const limbs=[];
 function oval(parent,mat,p,s){const m=new T.Mesh(new T.SphereGeometry(1,32,24),mat);m.position.set(...p);m.scale.set(...s);m.castShadow=true;parent.add(m);if(parent.name!=='fox-head'||mat===rust||mat===cream)m.userData.continuous=true;return m;}
 function tube(parent,pts,r,mat){const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p))),32,r,10,false),mat);parent.add(m);m.userData.continuous=true;m.userData.surfacePath=pts.map(p=>new T.Vector3(...p));m.userData.radii=[r,r,r,r];return m;}
 oval(hips,rust,[0,1.0,0],[.83,.34,.29]);oval(hips,cream,[.32,.98,.16],[.37,.28,.18]);oval(hips,rust,[-.52,.91,0],[.35,.38,.27]);
 const neck=new T.Bone();neck.name='fox-neck';neck.position.set(.62,1.10,0);hips.add(neck);oval(neck,rust,[.08,.16,0],[.29,.37,.25]);
 const head=new T.Bone();head.name='fox-head';head.position.set(.22,.40,.01);neck.add(head);oval(head,rust,[0,0,0],[.30,.28,.24]);oval(head,cream,[.14,-.10,.02],[.29,.125,.18]);oval(head,rust,[.22,-.035,0],[.25,.13,.14]);oval(head,black,[.44,-.035,0],[.067,.052,.065]);
 for(const z of [-.16,.16]){
  const shape=new T.Shape();shape.moveTo(-.13,0);shape.lineTo(-.09,.39);shape.quadraticCurveTo(.05,.35,.16,.02);shape.closePath();const ear=new T.Mesh(new T.ExtrudeGeometry(shape,{depth:.055,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3}),rust);ear.position.set(-.08,.17,z);head.add(ear);oval(head,inner,[-.13,.34,z+.055],[.055,.13,.012]);
  oval(head,black,[.12,.055,z*1.39],[.070,.035,.017]);oval(head,material('#ae9d45'),[.14,.055,z*1.46],[.030,.027,.011]);oval(head,black,[.15,.055,z*1.50],[.010,.024,.006]);
 }
 const tail=new T.Bone();tail.name='fox-tail';tail.position.set(-.62,1.06,0);hips.add(tail);const tailMesh=tube(tail,[[0,0,0],[-.40,-.10,0],[-.78,-.28,.03],[-1.04,-.38,.08]],.19,rust);oval(tail,cream,[-1.03,-.38,.08],[.26,.17,.17]);
 for(const [x,z,phase]of [[.52,-.19,.5],[-.52,-.19,.25],[.52,.19,0],[-.52,.19,.75]]){
  const upper=new T.Bone();upper.name='fox-upper-'+limbs.length;upper.position.set(x,.86,z);hips.add(upper);oval(upper,rust,[0,-.22,0],[.115,.27,.10]);const lower=new T.Bone();lower.name='fox-lower-'+limbs.length;lower.position.y=-.44;upper.add(lower);oval(lower,black,[0,-.22,0],[.067,.25,.062]);const foot=new T.Bone();foot.name='fox-foot-'+limbs.length;foot.position.y=-.44;lower.add(foot);oval(foot,black,[.065,0,0],[.15,.072,.085]);limbs.push({upper,lower,foot,x,z,phase});
 }
 fox.userData={hips,limbs,tail,head};await smoothSkin(fox,'fox',rust);return fox;
}
export function foxPose(fox,time){
 const {hips,limbs,tail,head}=fox.userData,period=1.2,phase=time/period;
 hips.position.y=.012*Math.cos(phase*Math.PI*4);const footPositions=[];
 for(const l of limbs){const p=((phase+l.phase)%1+1)%1,stance=p<.64;let x,y;
  if(stance){x=.24-.48*p/.64;y=.065;}else{const f=(p-.64)/.36;const h00=2*f**3-3*f**2+1,h10=f**3-2*f**2+f,h01=-2*f**3+3*f**2,h11=f**3-f**2;x=-.24*h00+.24*h01-.27*(h10+h11);y=.065+.15*Math.sin(Math.PI*f)**2;}
  // Two fixed-length segments; heel stays level during stance.
  const dx=x,dy=y-(.86+hips.position.y),a=.44,b=.44,d=Math.min(.879,Math.hypot(dx,dy)),bend=Math.acos(Math.max(-1,Math.min(1,(a*a+b*b-d*d)/(2*a*b))));
  const hip=Math.atan2(dx,-dy)-Math.acos(Math.max(-1,Math.min(1,(a*a+d*d-b*b)/(2*a*d))));
  l.upper.rotation.z=hip;l.lower.position.y=-a;l.lower.rotation.z=Math.PI-bend;l.foot.rotation.z=-(l.upper.rotation.z+l.lower.rotation.z);
  footPositions.push({stance,p,x:l.x+x,y});
 }
 tail.rotation.y=.055*Math.sin(phase*Math.PI*2);tail.rotation.z=.025*Math.cos(phase*Math.PI*2);head.rotation.z=.015*Math.cos(phase*Math.PI*4);fox.updateMatrixWorld(true);return {feet:footPositions};
}
