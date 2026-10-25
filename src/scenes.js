import {drawAnimal,drawFishBowl,palette,themes,prepareCanvas,paper,species} from './art.js';
import {formatTime} from './clock.js';
const TAU=Math.PI*2;
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function stroke(c,pts,color,width=2){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
function text(c,str,x,y,font,color=palette.ink,align='center'){c.font=font;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(str,x,y);}
function fit(c,w,h,baseW=1000,baseH=600){const s=Math.min(w/baseW,h/baseH);c.translate(w/2,h/2);c.scale(s,s);c.translate(-baseW/2,-baseH/2);return s;}
export class Scene {
 constructor(){this.reset();}
 reset(){this.previousDigits=new Map();this.particles=[];this.debris=[];this.nextVisit=45+Math.random()*20;this.visitor=null;this.lastMinute=null;this.minuteChanged=0;this.oldMinute=null;this.completeAt=null;this.lastDisplayed=null;}
 draw(canvas,{remaining=300,initial=300,phase='green',mode='analog',time=0,reduced=false,completed=false,gentle=false,preview=false,paused=false}){
 const {c,w,h}=prepareCanvas(canvas);if(!w||!h)return;const theme=themes[phase];paper(c,w,h);c.save();
 if(preview){fit(c,w,h,600,330);if(mode==='analog'){this.analog(c,{remaining,initial,theme,time,reduced,preview:true,completed:false},300,145,116);drawFishBowl(c,486,288,.48,time);drawAnimal(c,'cat',127,285,.65,time*.2,{still:true});}else{this.digital(c,{remaining,theme,time,reduced,completed:false,preview:true},300,125,.58);drawAnimal(c,'turtle',140,282,.7,time,{push:true});drawAnimal(c,'fish',450,282,.6,time);}}
 else{
 const viewWidth=w<650?(mode==='analog'?560:760):1000;fit(c,w,h,viewWidth,600);c.translate(-(1000-viewWidth)/2,0);if(completed){if(this.completeAt===null)this.completeAt=time;this.ending(c,{time:time-this.completeAt,reduced,gentle,mode,theme});}
 else{this.completeAt=null;if(mode==='analog')this.analog(c,{remaining,initial,theme,time,reduced,preview:false},500,280,225);else this.digital(c,{remaining,theme,time,reduced,completed:false,preview:false},500,265,1.1);}
 if(paused){c.fillStyle=theme.wash+'b0';c.fillRect(0,0,1000,600);text(c,'A little pause.',500,270,'italic 48px Georgia',theme.ink);text(c,formatTime(remaining)+' remaining',500,325,'20px Georgia',theme.ink);}
 }
 c.restore();
 }
 analog(c,o,cx,cy,r){
 const {remaining,initial,theme,time,reduced,preview}=o;const min=Math.ceil(remaining/60);const display=Math.max(1,min);
 if(this.lastMinute!==min){this.oldMinute=this.lastMinute??min;this.lastMinute=min;this.minuteChanged=time;}
 const age=time-this.minuteChanged;const painting=!reduced&&remaining>60&&age<4.2;const repainting=painting&&this.oldMinute!==min;
 // The frosted pane and a frame with a faint hand-painted irregularity.
 c.save();c.translate(cx,cy);c.fillStyle=theme.glass;c.globalAlpha=.55;c.beginPath();c.arc(0,0,r+16,0,TAU);c.fill();c.globalAlpha=1;
 c.strokeStyle=theme.ink+'35';c.lineWidth=1;c.beginPath();c.arc(0,0,r+17,0,TAU);c.stroke();
 // A soft silhouette retreats behind the glass between minute strokes.
 const final=remaining<=60;const step=Math.max(0,Math.min(60,Math.ceil(initial))-Math.ceil(remaining));const finalAngle=-Math.PI/2+Math.max(0,step+(Math.ceil(remaining)-remaining))*TAU/60;
 const minuteAngle=-Math.PI/2+(Math.min(60,display)%60)*TAU/60;
 const targetAngle=final?finalAngle:minuteAngle;
 let targetX=Math.cos(targetAngle)*(r-22),targetY=Math.sin(targetAngle)*(r-22);
 // After the old minute mark is erased, the tail paints the new numeral from top to bottom.
 if(repainting&&age>1.2){const reach=ease((age-1.2)/.5);targetX+=(Math.sin(age*7)*(preview?17:35)-targetX)*reach;targetY+=(-(preview?34:63)+(preview?68:126)*ease((age-1.5)/2)-targetY)*reach;}
 {
  const proximity=reduced?0:final?ease((Math.min(initial,60)-remaining)/1.2):ease(age/.7)*(1-ease((age-3.2)/1));
  c.save();c.filter=`blur(${7-proximity*5.8}px) brightness(0)`;c.globalAlpha=.095+proximity*.125;
  const idleX=reduced?0:Math.sin(time*.06)*(r*.27),idleY=r*.49;
  const close=!reduced&&(painting||final);
  // Cat's body remains behind the pane; its working limb touches the foreground marks.
  const catX=idleX+(targetX*.63-25-idleX)*proximity;const catY=idleY+(targetY*.48+65-idleY)*proximity;
  const idleCycle=time%55;const action=idleCycle>35&&idleCycle<43&&!close&&!reduced?Math.sin((idleCycle-35)/8*Math.PI)**2:0;const behavior=['stretch','nap','pounce'][Math.floor(time/55)%3];
  this.shadow(c,catX,catY,preview?.53:1.0,time*.32,{still:!painting&&!final,direction:1,working:close,pose:{[behavior]:action}});
  if(close){
   const cycle=final?(time%1):age;const contact=final?.8: ease(age/1.2);
   const px=targetX+Math.sin(cycle*5)*5,py=targetY+Math.cos(cycle*5)*5;
   c.beginPath();c.moveTo(catX-24,catY-35);c.bezierCurveTo(catX-110,catY-90,px-35,py+30,px,py);c.strokeStyle=palette.ink;c.lineWidth=preview?6:10;c.lineCap='round';c.globalAlpha*=contact*proximity;c.stroke();
   if(final||age<1.5){c.beginPath();c.moveTo(catX+28,catY-29);c.quadraticCurveTo(px-25,py+45,px,py);c.lineWidth=preview?5:8;c.stroke();}
  }
  c.restore();
 }
 // Fine grain gives the pane depth without obscuring the marks.
 c.save();c.globalAlpha=.04;c.fillStyle=theme.ink;for(let i=0;i<180;i++){const a=i*2.39996,rr=Math.sqrt(i/180)*r;c.fillRect(Math.cos(a)*rr,Math.sin(a)*rr,1,1);}c.restore();
 const count=remaining>3600?60:Math.min(60,display);
 for(let i=0;i<60;i++){
  const a=-Math.PI/2+i*TAU/60;const active=i<count;const major=i%5===0;
  let alpha=active?.85:.13;
  // Last minute mark is visibly erased in the claw's stroke; replacement is painted in.
  if(painting&&i===count)alpha=.13+(.85-.13)*(1-ease(age/1.3));
  c.save();c.globalAlpha=alpha;c.strokeStyle=theme.ink;c.lineWidth=major?3:1.8;c.lineCap='round';c.beginPath();c.moveTo(Math.cos(a)*(r-10),Math.sin(a)*(r-10));c.lineTo(Math.cos(a)*(r-(major?29:21)),Math.sin(a)*(r-(major?29:21)));c.stroke();c.restore();
 }
 for(let i=0;i<12;i++){const a=-Math.PI/2+i*TAU/12;const label=i===0?'60':String(i*5);text(c,label,Math.cos(a)*(r-49),Math.sin(a)*(r-49),`${preview?11:17}px Georgia`,theme.ink+'b8');}
 // Painted minute numeral: erase the old paint, then expose the new paint along the tail stroke.
 const size=preview?68:126;const numeral=String(display);c.save();
 if(repainting&&age<1.7){
  c.save();c.beginPath();c.rect(-r,-size/2,r*2,Math.max(0,size*(1-ease(age/1.6))));c.clip();text(c,String(Math.max(1,this.oldMinute)),0,-5,`${size}px Georgia`,theme.ink);c.restore();
 }else{
  if(repainting&&age<3.9){c.beginPath();c.rect(-r,-size/2,r*2,size*ease((age-1.5)/2));c.clip();}
  text(c,numeral,0,-7,`${size}px Georgia`,theme.ink);
 }
 c.restore();text(c,display===1?'MINUTE LEFT':'MINUTES LEFT',0,preview?42:74,`${preview?7:10}px Arial`,theme.ink+'b0');
 // Exact remaining time is always present while paint changes.
 if(!preview)text(c,formatTime(remaining),0,116,'23px Georgia',theme.ink);
 const scratches=Math.max(0,Math.min(Math.ceil(initial),60)-Math.ceil(remaining));
 for(let i=0;i<scratches;i++){
  const a=-Math.PI/2+i*TAU/60;const rr=r-15;const x=Math.cos(a)*rr,y=Math.sin(a)*rr;
  for(let j=0;j<3;j++){c.save();c.translate(x,y);c.rotate(a);stroke(c,[[5,j*3-3],[-15,j*3-5],[-23,j*3-2]],theme.ink+'85',preview?.65:1);c.restore();}
 }
 c.restore();
 if(!preview){text(c,'THE PAINTER',cx,560,'10px Arial',theme.ink+'90');}
 }
 digital(c,o,cx,cy,scale){
 const {remaining,theme,time,reduced,preview}=o;const str=formatTime(remaining).padStart(5,'0');
 const charW=92,gap=14;let width=0;for(const ch of str)width+=ch===':'?36:charW+gap;width-=gap;
 c.save();c.translate(cx-width*scale/2,cy-90*scale);c.scale(scale,scale);
 let x=0;const active=new Map();
 for(let digit=0;digit<str.length;digit++){
  const ch=str[digit];if(ch===':'){for(const y of [55,122]){c.fillStyle=theme.block;c.beginPath();c.arc(x+12,y,5,0,TAU);c.fill();}x+=36;continue;}
  const on=segments[Number(ch)];
  for(let j=0;j<7;j++){
   const key=`${digit}-${j}`;const p={x:x+segPositions[j][0],y:segPositions[j][1],horizontal:j<3,key};
   this.block(c,p,theme.block,.065,true);
   if(on.includes(j)){
    const prev=this.previousDigits.get(key);let born=prev?.born??time;if(!prev?.active)born=time;
    active.set(key,{...p,active:true,born});
    const t=reduced?1:ease((time-born)/.35);c.save();c.translate(p.x,p.y);c.scale(.72+.28*t,.72+.28*t);c.translate(-p.x,-p.y);this.block(c,p,theme.block,.45+.55*t);c.restore();
   }else active.set(key,{...p,active:false,born:time});
  }
  x+=charW+gap;
 }
 if(!reduced&&!preview)for(const [key,p] of this.previousDigits){if(p.active&&!active.get(key)?.active){const sign=Math.random()-.5;this.particles.push({...p,start:time,vx:sign*110,rot:sign*3,col:theme.block});}}
 this.previousDigits=active;
 if(!preview){
  if(reduced)this.particles=[];
  for(const p of this.particles){const age=time-p.start;c.save();const fall=290*age*age;c.translate(p.x+p.vx*age,p.y+fall);c.rotate(p.rot*age);c.translate(-p.x,-p.y);this.block(c,p,p.col,Math.max(0,1-age*.15));c.restore();if(age>.85){for(let fragment=0;fragment<3;fragment++)this.debris.push({x:Math.max(-65,Math.min(width+65,p.x+p.vx*age+(fragment-1)*14)),y:270+Math.random()*18,a:p.rot+fragment,col:p.col,size:7+Math.random()*6});}}
  this.particles=this.particles.filter(p=>time-p.start<=.85);
  // A bounded pile; seconds can change indefinitely without growing memory or draw cost.
  if(this.debris.length>100)this.debris.splice(0,this.debris.length-100);
  for(const d of this.debris){c.save();c.translate(d.x,d.y);c.rotate(d.a);c.fillStyle=d.col;c.globalAlpha=.65;c.fillRect(-d.size/2,-d.size/2,d.size,d.size*.7);c.restore();}
 }
 c.restore();
 const floor=cy+220*scale;stroke(c,[[cx-width*scale/2-45,floor],[cx+width*scale/2+45,floor]],theme.ink+'20',1);
 if(!preview){
  if(!reduced&&time>=this.nextVisit&&!this.visitor){this.visitor={start:time,type:species[Math.floor(Math.random()*species.length)],direction:Math.random()<.5?1:-1};this.nextVisit=time+50+Math.random()*25;}
  if(this.visitor&&!reduced){const age=time-this.visitor.start;const t=age/12;const d=this.visitor.direction;const px=d===1?-120+t*1240:1120-t*1240;drawAnimal(c,this.visitor.type,px,floor,1.05,time,{push:true,direction:d,still:reduced});
   // Debris rides ahead of the visitor rather than disappearing at the start of a visit.
   const localX=(px-cx)/scale+width/2;
   this.debris=this.debris.filter(p=>{if(d===1&&p.x<localX+55)p.x=localX+55;if(d===-1&&p.x>localX-55)p.x=localX-55;return p.x>-100&&p.x<width+100;});
   if(t>=1)this.visitor=null;
  }
  text(c,'THE BUILDERS',cx,560,'10px Arial',theme.ink+'90');
 }
 }
 shadow(c,x,y,scale,time,options){
  // Composite once before blurring: a true soft silhouette, rather than translucent outlines.
  if(!this.shadowCanvas){this.shadowCanvas=document.createElement('canvas');this.shadowCanvas.width=440;this.shadowCanvas.height=440;}
  const sc=this.shadowCanvas.getContext('2d');sc.setTransform(2,0,0,2,0,0);sc.clearRect(0,0,220,220);drawAnimal(sc,'cat',110,190,1,time,options);
  c.drawImage(this.shadowCanvas,x-110*scale,y-190*scale,220*scale,220*scale);
 }
 block(c,p,color,alpha=1,empty=false){c.save();c.translate(p.x,p.y);c.globalAlpha=alpha;const w=p.horizontal?65:17,h=p.horizontal?17:65;c.beginPath();c.moveTo(4,0);c.lineTo(w-4,0);c.lineTo(w,4);c.lineTo(w,h-4);c.lineTo(w-4,h);c.lineTo(4,h);c.lineTo(0,h-4);c.lineTo(0,4);c.closePath();c.fillStyle=color;c.fill();if(!empty){c.fillStyle='#0002';c.beginPath();c.moveTo(w,4);c.lineTo(w+4,0);c.lineTo(w+4,h-6);c.lineTo(w,h-2);c.fill();c.strokeStyle='#fff5';c.lineWidth=1;c.beginPath();c.moveTo(6,2);c.lineTo(w-5,2);c.stroke();}c.restore();}
 ending(c,{time,reduced,gentle,mode,theme}){
  // An unhurried reveal: the final scratch breaks a ring of stylized glass shards.
  const t=reduced||gentle?1:ease(time/1.7);
  if(mode==='digital'){
   c.save();c.translate(303,190);for(let i=0;i<4;i++)for(let j=0;j<7;j++)this.block(c,{x:i*106+segPositions[j][0],y:segPositions[j][1],horizontal:j<3},theme.ink,.07,true);c.restore();
  }
  if(mode==='analog'&&t<1){
   if(time<.25){c.save();c.globalAlpha=1-time/.25;for(let claw=0;claw<3;claw++)stroke(c,[[496+claw*3,60],[494+claw*3,78],[498+claw*3,85]],theme.ink,1.4);c.restore();}
   for(let i=0;i<18;i++){const a=i*TAU/18;const a2=(i+1)*TAU/18;const rr=i%2?225:190;c.save();c.translate(500+Math.cos(a)*t*170,280+t*t*410);c.rotate((i%2?1:-1)*t*.9);c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);c.lineTo(Math.cos(a2)*225,Math.sin(a2)*225);c.closePath();c.globalAlpha=(1-t)*.8;c.fillStyle=theme.glass;c.fill();c.strokeStyle=theme.ink+'45';c.lineWidth=1;c.stroke();c.restore();}
  }
  c.save();c.globalAlpha=reduced||gentle?1:Math.min(1,time*.9);drawAnimal(c,'cat',475,490,2.15,reduced?0:time*.18,{still:true,guilty:true});drawFishBowl(c,680,500,.65,time);stroke(c,[[290,505],[745,505]],theme.ink+'35',1);c.restore();
  // Clear residual digital pieces on completion.
  this.particles=[];this.debris=[];this.visitor=null;
 }
}
const segPositions=[[13,0],[13,81],[13,162],[0,16],[77,16],[0,97],[77,97]];
const segments=[[0,2,3,4,5,6],[4,6],[0,1,2,4,5],[0,1,2,4,6],[1,3,4,6],[0,1,2,3,6],[0,1,2,3,5,6],[0,4,6],[0,1,2,3,4,5,6],[0,1,2,3,4,6]];
