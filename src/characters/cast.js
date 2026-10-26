import * as T from './vendor/three.module.js';
import {paintedMaterials} from './materials.js';
import {smoothSkin} from './smooth-skin.js';
import {foxPose} from './fox.js';
const birds=new Set(['eagle','turkey','raven','penguin','owl']);
const coats={dog:'#b88a54',panda:'#eee1c4',turtle:'#71804a',pig:'#d49b89',bear:'#8a6142',cow:'#e3d2ac',fish:'#c14c2d',eagle:'#694d39',turkey:'#79513a',raven:'#3b4140',rabbit:'#bead94',deer:'#b4814e',horse:'#9b623c',sheep:'#daceb5',goat:'#b7a47d',elephant:'#97958c',giraffe:'#c7a158',zebra:'#e7dac0',lion:'#b99551',penguin:'#343f3e',owl:'#a09272',frog:'#79985b',hedgehog:'#987b56'};
const long=new Set(['horse','deer','giraffe','zebra','goat']);
export function animalAspect(type){return type==='fish'?1.6:birds.has(type)?.85:type==='giraffe'?1.0:type==='turtle'?2.3:type==='frog'?1.6:type==='rabbit'?1.15:1.8;}
export async function createAnimal(type,{source=false}={}){
 const {material}=await paintedMaterials(),base=material(coats[type]),cream=material('#ecddb8'),dark=material('#39372f'),pink=material('#bc8875'),eye=material('#a7a266'),shine=material('#fff3d9');
 const model=new T.Group();model.name=type;const hips=new T.Bone();hips.name='fox-hips';model.add(hips);
 function oval(parent,mat,p,s,fuse=true){const m=new T.Mesh(new T.SphereGeometry(1,24,16),mat);m.position.set(...p);m.scale.set(...s);parent.add(m);if(fuse){m.userData.continuous=true;m.userData.coat=mat===cream?1:mat===dark?2:0;}return m;}
 function line(parent,points,r,mat){const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,8,false),mat);parent.add(m);return m;}
 function cone(parent,p,r,h,mat,rot=0){const m=new T.Mesh(new T.ConeGeometry(r,h,16),mat);m.position.set(...p);m.rotation.z=rot;parent.add(m);return m;}
 const bird=birds.has(type),fish=type==='fish',low=['turtle','frog','hedgehog'].includes(type),legHeight=low?.34:type==='penguin'?.26:type==='owl'?.46:bird?.64:type==='pig'?.58:type==='giraffe'?1.15:.86;
 const bodyY=fish?.43:bird?legHeight+.40:low?.51:legHeight+.17,bodySize=bird?[.46,.60,.34]:fish?[.75,.42,.29]:low?[.66,.32,.39]:type==='bear'||type==='panda'?[.72,.49,.38]:[.77,.35,.31];
 oval(hips,base,[0,bodyY,0],bodySize);
 const neck=new T.Bone();neck.name='fox-neck';neck.position.set(bird?.1:.56,bodyY,0);hips.add(neck);
 const neckLength=type==='giraffe'?1.15:long.has(type)?.40:bird?.48:.16;
 if(!fish)oval(neck,base,[0,neckLength*.45,0],[bird?.25:.22,neckLength*.65+.18,.23]);
 const head=new T.Bone();head.name='fox-head';head.position.set(fish?.12:bird?.13:.17,fish?0:neckLength+.15,0);neck.add(head);
 const round=['panda','bear','pig','lion','owl','frog'].includes(type),hs=type==='elephant'?[.38,.39,.32]:round?[.33,.31,.29]:[.29,.28,.25];
 oval(head,bird&&type==='eagle'?cream:base,[0,0,0],hs);
 if(!bird&&!fish&&type!=='frog')oval(head,type==='panda'||type==='bear'?cream:base,[.20,-.10,.01],[long.has(type)?.31:.22,.15,.21]);
 const tail=new T.Bone();tail.name='fox-tail';tail.position.set(-bodySize[0]*.8,bodyY,0);hips.add(tail);
 if(type==='turtle'){
  oval(hips,material('#52623b'),[-.08,.65,0],[.68,.32,.43],false);
  for(let i=0;i<5;i++)line(hips,[[-.55+i*.24,.77,-.34],[-.55+i*.24,.96,0],[-.55+i*.24,.77,.34]],.012,cream);
 }else if(fish){
  const fin=cone(tail,[-.38,0,0],.36,.55,base,Math.PI/2);fin.scale.z=.25;
  cone(hips,[0,bodyY+.42,0],.20,.35,base,-.25).scale.z=.20;
  for(const z of [-.24,.24]){const f=oval(hips,cream,[-.10,bodyY-.12,z],[.26,.06,.17],false);f.rotation.z=-.35;}
 }else if(!bird&&type!=='frog'){
  if(type==='rabbit')oval(tail,cream,[-.10,.02,0],[.17,.17,.17]);
  else if(type==='pig')line(tail,[[0,0,0],[-.16,.08,0],[-.22,.18,0],[-.12,.22,0],[-.10,.12,0]],.035,base);
  else if(type==='elephant')line(tail,[[0,0,0],[-.17,-.25,0],[-.21,-.50,0]],.025,base);
  else{line(tail,[[0,0,0],[-.25,-.07,0],[-.48,-.30,0]],type==='dog'?.10:.045,base);if(type==='lion')oval(tail,dark,[-.48,-.30,0],[.10,.10,.10],false);}
 }
 // Rounded sculpted ears and muzzles vary with species; eyes share the
 // approved soft gaze and small, warm highlights.
 if(!bird&&!fish&&type!=='frog'&&type!=='turtle')for(const z of [-.20,.20]){
  const earScale=type==='rabbit'?[.105,.43,.075]:type==='elephant'?[.20,.38,.12]:type==='dog'?[.13,.25,.12]:[.14,.16,.10];
  oval(head,type==='panda'?dark:base,[-.12,type==='rabbit'?.43:type==='elephant'?-.02:type==='dog'?-.015:.25,z],earScale,false);
  if(type==='rabbit')oval(head,pink,[-.10,.45,z+.025],[.055,.30,.07],false);
 }
 if(type==='lion'){
  const mane=material('#96713e');oval(head,mane,[-.14,-.03,0],[.25,.43,.38],false);
  for(let i=0;i<9;i++){const a=i*Math.PI*2/9;oval(head,mane,[-.12,.30*Math.cos(a),.28*Math.sin(a)],[.19,.15,.14],false);}
 }
 if(type==='horse'||type==='zebra'){
  line(neck,[[-.19,-.10,0],[-.21,.15,0],[-.17,.43,0]],.09,dark);
  line(tail,[[0,0,0],[-.22,-.22,0],[-.26,-.62,0]],.075,dark);
 }
 if(type==='sheep')for(let i=0;i<18;i++){const a=i*2.399;oval(hips,cream,[Math.cos(a)*.55,bodyY+.15+Math.sin(i*.73)*.21,Math.sin(a)*.28],[.25,.23,.22],false);}
 if(type==='hedgehog')for(let i=0;i<75;i++){const a=i*2.399,x=-.52+(i%11)*.095,z=Math.sin(a)*.30,y=bodyY+.17+Math.sqrt(Math.max(0,1-(z/.36)**2))*.18;cone(hips,[x,y,z],.028,.19,dark,-.25);}
 if(type==='elephant')line(head,[[.28,-.12,0],[.43,-.35,0],[.46,-.67,0],[.61,-.73,0]],.10,base);
 if(type==='pig'){
  oval(head,pink,[.39,-.10,.01],[.10,.14,.19],false);for(const z of [-.075,.075])oval(head,dark,[.475,-.10,z],[.012,.025,.025],false);
 }
 if(['cow','goat','giraffe','deer'].includes(type))for(const z of [-.16,.16]){
  if(type==='deer'){line(head,[[-.13,.22,z],[-.18,.48,z],[-.30,.65,z]],.025,base);line(head,[[-.18,.46,z],[-.04,.60,z]],.022,base);}
  else{cone(head,[-.10,.34,z],.04,type==='goat'?.35:.21,cream,.16);}
 }
 if(bird){
  cone(head,[.32,-.07,.01],type==='eagle'?.11:.085,.28,material('#bf994d'),-Math.PI/2);
  for(const z of [-.31,.31]){const wing=oval(hips,type==='penguin'?dark:base,[-.07,bodyY,z],[.38,.39,.09],false);wing.rotation.z=.17;}
  if(type==='penguin')oval(hips,cream,[.20,bodyY,.10],[.32,.48,.28],false);
  if(type==='owl')for(const z of [-.19,.19])oval(head,cream,[.17,.02,z],[.19,.23,.12],false);
  if(type==='turkey'){
   const fan=new T.Group();fan.position.set(-.36,bodyY+.10,0);hips.add(fan);
   for(let i=0;i<9;i++){const a=-1.1+i*.275,feather=oval(fan,i%2?cream:base,[-.35-Math.cos(a)*.18,.18+Math.sin(a)*.45,Math.cos(a)*.30],[.15,.49,.08],false);feather.rotation.z=-.7-a;}
   oval(head,material('#b54d37'),[.23,-.20,.10],[.06,.16,.06],false);
  }
 }
 const eyeX=fish?.13:.12,eyeY=bird?.07:.075,eyeZ=hs[2]*.94;
 for(const side of [-1,1]){
  if(type==='panda')oval(head,dark,[eyeX,eyeY,side*eyeZ],[.13,.13,.065],false);
  if(type==='frog')oval(head,base,[.10,.23,side*.23],[.15,.17,.14],false);
  const y=type==='frog'?.28:eyeY,z=side*(type==='frog'?.32:eyeZ+.03);
  oval(head,dark,[eyeX,y,z],[.080,.072,.025],false);oval(head,eye,[eyeX+.008,y,z+side*.016],[.060,.053,.015],false);oval(head,dark,[eyeX+.02,y,z+side*.030],[.027,.034,.009],false);oval(head,shine,[eyeX+.005,y+.020,z+side*.04],[.013,.013,.005],false);
  line(head,[[.31,-.13,side*.17],[.23,-.18,side*.21],[.12,-.145,side*.24]],.006,material('#705541'));
 }
 if(!bird&&!fish&&type!=='elephant'&&type!=='pig')oval(head,dark,[long.has(type)?.46:.34,-.07,0],[.06,.045,.09],false);
 const limbs=[];
 if(!fish){for(const [x,z,phase]of bird?[[0,-.17,.5],[0,.17,0]]:[[.49,-.22,.5],[-.49,-.22,.25],[.49,.22,0],[-.49,.22,.75]]){
  const rear=!bird&&x<0,a=legHeight*(rear?.40:.51),b=legHeight*(rear?.40:.51),distal=rear?legHeight*.25:0,upper=new T.Bone();upper.name='fox-upper-'+limbs.length;upper.position.set(x,legHeight,z);hips.add(upper);
  oval(upper,base,[0,-a*.48,0],[bird?.06:type==='elephant'?.14:.10,a*.64,.095]);
  const lower=new T.Bone();lower.name='fox-lower-'+limbs.length;lower.position.y=-a;upper.add(lower);oval(lower,bird?cream:base,[0,-b*.50,0],[bird?.035:.07,b*.67,bird?.04:.065]);
  let hock=null;if(rear){hock=new T.Bone();hock.name='fox-hock-'+limbs.length;hock.position.y=-b;lower.add(hock);oval(hock,base,[0,-distal*.5,0],[.055,distal*.65,.055]);}
  const foot=new T.Bone();foot.name='fox-foot-'+limbs.length;foot.position.y=rear?-distal:-b;(hock||lower).add(foot);oval(foot,long.has(type)?dark:bird?cream:base,[.06,0,0],[bird?.17:.13,.065,.085]);limbs.push({upper,lower,hock,foot,x,z,phase,rear,a,b,distal,stride:.40*Math.min(1,legHeight/.86),baseY:legHeight});
 }}
 // Original, surface-anchored coat patterns retain their form during motion.
 const original=base.onBeforeCompile;base.onBeforeCompile=shader=>{original(shader);const patterns={zebra:'step(.35,sin(paintPosition.x*29.0+paintPosition.y*7.0+sin(paintPosition.z*15.0)))',cow:'smoothstep(.25,.52,sin(paintPosition.x*8.0)*cos(paintPosition.y*7.0+paintPosition.z*9.0))',giraffe:'smoothstep(.3,.5,abs(sin(paintPosition.x*12.0)*sin(paintPosition.y*10.0+paintPosition.z*6.0)))',panda:'max(1.0-smoothstep(.30,.52,paintPosition.y),smoothstep(.33,.48,abs(paintPosition.x))* (1.0-smoothstep(1.15,1.5,paintPosition.y)))'};
  if(patterns[type])shader.fragmentShader=shader.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>\n diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${type==='giraffe'?'.26,.12,.045':'.045,.048,.038'}),(${patterns[type]})*.85);`);
 };
 model.userData={hips,limbs,tail,head,type,span:fish?2.8:bird?1.8:type==='giraffe'?3.4:3.45};
 if(!source)await smoothSkin(model,type,base);
 return model;
}
export function animalPose(model,time){
 const type=model.userData.type;
 if(type==='fish'){
  model.userData.hips.position.y=.07*Math.sin(time*Math.PI*2)**2;model.userData.hips.rotation.z=.06*Math.sin(time*Math.PI*2);model.userData.tail.rotation.y=.23*Math.sin(time*Math.PI*2);model.userData.head.rotation.z=.02*Math.sin(time*Math.PI*2);model.updateMatrixWorld(true);
 }else return foxPose(model,time*(type==='turtle'?.45:type==='rabbit'?1.05:.8));
}
