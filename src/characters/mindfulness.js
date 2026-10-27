import * as T from './vendor/three.module.js';
import {catIdlePose,actingArm,freeArmPose,prayerArm,solveLimb,mix} from './rig.js';
import {activityWeight,breathCycle,activityDetails} from '../mindfulness.js';
const V=(...p)=>new T.Vector3(...p);
// Pose all four limbs in pelvis coordinates, then move the whole skeleton.
// Reclining actions rotate the skeleton, never the rendered image or its skin.
// The same fixed-length solvers used for glass work preserve limb lengths.
export function catMindfulnessPose(cat,time,moment){
 const idle=catIdlePose(cat,time),{joints,limbs}=cat.userData;
 const {type,local:t}=moment,weight=activityWeight(moment);
 const breath=breathCycle(type,t),b=breath-.5,wave=Math.sin(t*1.25),slow=Math.sin(t*.65);
 let hand=[.55,1.07,.30],free=[-.55,1.02,.20],left=[-.32,.105,.28],right=[.39,.105,.30];
 let root=[0,0,0],angle=0,head=[-.03,.03,.04],closed=.65;
 const seat=()=>{root=[0,-.55,0];left=[-.57,.60,.43];right=[.57,.60,.43];hand=[.50,1.00,.49];free=[-.50,.96,.49];};
 const kneel=()=>{root=[0,-.39,0];left=[-.33,.46,-.18];right=[.36,.46,-.18];hand=[.43,1.05,.44];free=[-.43,1.02,.44];};
 const recline=()=>{root=[1.10,.65,0];angle=Math.PI/2;left=[-.28,.12,.28];right=[.38,.12,.30];hand=[.61,1.05,.43];free=[-.54,1.05,.43];head=[.03,-.03,-.07];};
 if(activityDetails[type]?.group==='breathing'){
  seat();hand=[.27,1.30+.065*breath,.59];free=[-.27,1.26+.065*breath,.57];
  if(type==='equalBreath'){hand=[.57+.08*breath,1.35+.16*breath,.44];free=[-.57-.08*breath,1.30+.16*breath,.44];}
  if(type==='oceanBreath'){hand=[.60+.10*breath,1.12+.35*breath,.50];free=[-.60-.10*breath,1.08+.35*breath,.50];}
 }else switch(type){
 case 'mountain':hand=[.54,1.00,.28];free=[-.53,.98,.28];head=[-.05,0,0];break;
 case 'tree':root=[-.11,-.015,0];right=[.04,.57,.26];hand=[.06,1.49,.64];free=[-.06,1.75,.63];break;
 case 'eagle':root=[0,-.13,0];right=[-.10,.29,.48];left=[-.27,.24,.17];hand=[-.04,1.96,.62];free=[.06,1.78,.57];break;
 case 'warriorOne':root=[0,-.16,0];left=[-.65,.27,.18];right=[.65,.27,.30];hand=[.37,2.86,.31];free=[-.34,2.75,.31];head=[-.12,.12,-.07];closed=.1;break;
 case 'warriorTwo':root=[0,-.16,0];left=[-.68,.27,.19];right=[.69,.27,.29];hand=[1.37,1.87,.28];free=[-1.18,1.81,.25];head=[-.03,.25,-.02];closed=.1;break;
 case 'reverseWarrior':root=[-.04,-.14,0];angle=.15;left=[-.65,.26,.19];right=[.68,.26,.29];hand=[.25,2.84,.34];free=[-.64,1.04,.28];head=[-.14,.15,-.12];break;
 case 'triangle':root=[.12,-.17,0];angle=-.27;left=[-.64,.27,.2];right=[.65,.27,.29];hand=[.58,1.01,.38];free=[-.41,2.72,.36];head=[-.05,-.15,.14];break;
 case 'sideAngle':root=[.14,-.25,0];angle=-.22;left=[-.63,.35,.22];right=[.67,.35,.28];hand=[.81,1.11,.42];free=[-.13,2.73,.38];head=[-.04,-.17,.04];break;
 case 'chair':root=[0,-.29,0];left=[-.32,.40,.40];right=[.38,.40,.42];hand=[.55,2.78,.45];free=[-.49,2.67,.44];break;
 case 'forwardFold':root=[0,.07,0];angle=.18;head=[.37,0,.12];hand=[.31,.85,.64];free=[-.33,.91,.61];root[1]=-.27;break;
 case 'crescent':root=[0,-.16,0];left=[-.55,.25,.14];right=[.68,.29,.31];hand=[.39,2.85,.42];free=[-.31,2.75,.40];angle=-.10;break;
 case 'star':root=[0,-.10,0];left=[-.63,.22,.26];right=[.67,.22,.29];hand=[1.25,2.34,.31];free=[-1.10,2.25,.30];closed=.2;break;
 case 'easySeat':seat();break;
 case 'lotus':seat();left=[.02,.65,.55];right=[-.07,.71,.60];hand=[.55,1.04,.49];free=[-.55,1.00,.49];break;
 case 'butterfly':seat();left=[-.05,.55,.58];right=[.07,.55,.58];hand=[.17,1.03,.66];free=[-.18,1.04,.65];head=[.12,0,0];break;
 case 'seatedTwist':seat();hand=[-.18,1.38,.61];free=[-.66,1.10,.22];head=[0,-.31,.04];angle=.07;break;
 case 'seatedSideReach':seat();hand=[.25,2.83,.44];free=[-.72,1.06,.36];angle=.16;head=[-.08,0,.07];break;
 case 'seatedFold':seat();head=[.31,0,.05];hand=[.35,.98,.64];free=[-.33,.98,.64];left=[-.24,.20,.52];right=[.28,.20,.52];root[1]=-.28;break;
 case 'staff':seat();left=[-.28,.17,.54];right=[.30,.17,.54];root[1]=-.18;hand=[.65,1.01,.38];free=[-.60,1.00,.38];break;
 case 'hero':kneel();break;
 case 'kneelingPrayer':kneel();hand=[.06,1.49,.64];free=[-.06,1.75,.63];head=[.13,0,0];break;
 case 'shoulderRoll':seat();hand=[.65+.10*wave,1.54+.15*Math.cos(t*1.25),.54];free=[-.65-.10*wave,1.50+.15*Math.cos(t*1.25),.54];head=[0,.06*slow,0];break;
 case 'child':recline();root=[1.00,.60,0];angle=1.62;left=[-.37,.64,.28];right=[-.30,.62,.47];hand=[-.28,2.70,.42];free=[-.32,2.60,.38];head=[.23,0,.12];break;
 case 'catCow':recline();angle=Math.PI/2;hand=[-.33,1.98,.50];free=[-.35,1.97,.32];left=[-.35,.25,.30];right=[-.35,.55,.50];head=[.16*slow,.03,.10*slow];root[1]=.65+.045*slow;closed=.2;break;
 case 'downwardDog':recline();angle=1.80;root=[1.1,.90,0];hand=[-.30,2.60,.46];free=[-.32,2.53,.30];left=[-.69,.26,.30];right=[-.65,.39,.48];head=[.20,0,.10];break;
 case 'cobra':recline();angle=1.28;root=[1.02,.65,0];hand=[-.80,1.84,.49];free=[-.77,1.81,.31];left=[-.36,.15,.30];right=[-.33,.15,.47];head=[-.20,0,-.13];break;
 case 'sphinx':recline();angle=1.45;hand=[-.59,2.14,.48];free=[-.59,2.10,.30];left=[-.36,.15,.30];right=[-.33,.15,.47];head=[-.12,0,-.13];break;
 case 'bridge':recline();angle=1.71;root=[1.05,.86,0];left=[.38,.56,.30];right=[.55,.77,.30];hand=[.72,1.35,.39];free=[.30,1.19,.38];head=[0,0,-.12];break;
 case 'happyBaby':recline();angle=1.68;root=[1.05,.70,0];left=[-.68,1.03,.42];right=[.66,1.12,.43];hand=[.72,1.23,.55];free=[-.69,1.28,.53];head=[.03,0,-.10];break;
 case 'rest':recline();hand=[-.35,1.17,.51];free=[-.38,1.16,.29];left=[-.38,.15,.30];right=[-.34,.15,.48];closed=.96;break;
 case 'waxOn':case 'waxOff':{const a=t*1.65*(type==='waxOn'?1:-1);hand=[.67+.34*Math.cos(a),1.82+.34*Math.sin(a),.69];free=[-.53,1.07,.36];head=[.04,.13,.025];closed=.1;break;}
 case 'paintFence':hand=[.57,1.84+.68*Math.sin(t*1.5),.65];free=[-.51,1.12,.39];head=[-.09*Math.sin(t*1.5),.08,0];closed=.1;break;
 case 'sandFloor':root=[0,-.37,0];left=[-.51,.49,.30];right=[.55,.49,.32];hand=[.49+.34*Math.cos(t*1.5),1.02,.55+.17*Math.sin(t*1.5)];free=[-.48-.25*Math.cos(t*1.5),1.03,.55-.17*Math.sin(t*1.5)];head=[.20,0,0];break;
 case 'paintHouse':hand=[.37+.72*Math.sin(t*1.3),2.05,.68];free=[-.48,1.10,.40];head=[0,.14*Math.sin(t*1.3),0];closed=.1;break;
 case 'jacket':{const open=.5+.5*Math.sin(t*1.25);hand=[.10+.97*open,1.72+.20*open,.55];free=[-.10-.88*open,1.66+.20*open,.52];head=[.05,.10*slow,0];closed=.1;break;}
 case 'namaste':seat();hand=[.055,1.50,.65];free=[-.055,1.76,.64];head=[.12,0,0];closed=.85;break;
 default:seat();
 }
 // Subtle breathing is visible in the whole torso and in resting hands.
 const quiet=['breathing','sitting','floor'].includes(activityDetails[type]?.group)||type==='namaste';
 const breathing=quiet?.025*b:.009*b;
 root[1]+=breathing;
 hand[1]+=quiet?.022*b:0;free[1]+=quiet?.022*b:0;
 joints.pelvis.position.set(...root.map(v=>v*weight));joints.pelvis.rotation.z=angle*weight;
 const reach=idle.hand.clone().lerp(V(...hand),weight),other=V(-.55,1.02,.20).lerp(V(...free),weight);
 let anatomy=actingArm(limbs.reach,reach,V(1.1,1.25,-.55));freeArmPose(cat,other);
 if(weight>0&&['namaste','kneelingPrayer','tree'].includes(type)){
  const rightWrist=anatomy.points[3].clone().lerp(V(.115,1.63,.61),weight);
  anatomy=prayerArm(limbs.reach,rightWrist,V(1.1,1.25,-.55),weight);
  prayerArm(limbs.rest,other.clone().lerp(V(-.115,1.63,.61),weight),V(-1.1,1.5,.60),weight);
 }
 solveLimb(limbs['hind-left'],V(-.32,.105,.28).lerp(V(...left),weight));
 solveLimb(limbs['hind-right'],V(.39,.105,.30).lerp(V(...right),weight));
 joints.head.rotation.set(mix(idle.head.x,head[0],weight),mix(idle.head.y,head[1],weight),mix(idle.head.z,head[2],weight));
 for(const eye of cat.userData.eyes||[])eye.mesh.scale.y*=1-closed*weight;
 joints['tail-0'].rotation.y=mix(joints['tail-0'].rotation.y,.025*Math.sin(t*.6),weight);
 cat.updateMatrixWorld(true);return {type,weight,breath,anatomy};
}
