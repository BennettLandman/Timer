import {themes,prepareCanvas,paper,species} from './art.js';
import {formatTime} from './clock.js';
import {boredMoment,boredWeight} from './boredom.js';
import {drawClawAction,drawPainterAction,scratchTiming,scratchPath} from './cat-actions.js';
import {painted,drawPaintedAnimal,drawPaintTexture,paintedAspect,drawAnimation,drawGlassCat,visitorMotionTime} from './paint.js';
import {drawSolid,drawSocket,drawHousing,project,segmentPolygon} from './depth.js';
const TAU=Math.PI*2;
const ease=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
function stroke(c,pts,color,width=2){c.beginPath();c.moveTo(...pts[0]);for(const p of pts.slice(1))c.lineTo(...p);c.strokeStyle=color;c.lineWidth=width;c.lineCap='round';c.stroke();}
function text(c,str,x,y,font,color,align='center'){c.font=font;c.fillStyle=color;c.textAlign=align;c.textBaseline='middle';c.fillText(str,x,y);}
function fit(c,w,h,bw=1000,bh=600){let s=Math.min(w/bw,h/bh);c.translate(w/2,h/2);c.scale(s,s);c.translate(-500,-bh/2);}
function circle(c,x,y,r){c.beginPath();c.arc(x,y,r,0,TAU);}
function paintStroke(c,angle,length,width,color,amount=1){
 if(amount<=0)return;const dx=Math.cos(angle),dy=Math.sin(angle),nx=-dy,ny=dx;
 c.save();c.lineCap='round';
 for(let k=0;k<9;k++){const offset=(k-4)*width/10;const points=[];for(let i=0;i<=28;i++){const l=length*amount*i/28;const jitter=Math.sin(i*2.71+k*1.13)*width*.045;points.push([dx*l+nx*(offset+jitter),dy*l+ny*(offset+jitter)]);}stroke(c,points,color,width/5);}
 c.restore();
}
export class Scene {
 constructor(){this.reset();}
 reset(){this.boredSeed=Math.floor(Math.random()*0x7fffffff);this.minuteSpan=60;this.previousDigits=new Map();this.particles=[];this.debris=[];this.nextVisit=45+Math.random()*20;this.visitor=null;this.lastMinute=null;this.minuteChanged=0;this.oldMinute=null;this.completeAt=null;this.shadowCanvas=null;this.endPanel=null;this.digitalLayout=null;}
 draw(canvas,{remaining=300,initial=300,phase='green',mode='analog',time=0,reduced=false,completed=false,gentle=false,preview=false,paused=false}={}){
  const {c,w,h}=prepareCanvas(canvas);if(!w||!h||!painted.glass)return;const theme=themes[phase];paper(c,w,h);c.save();
  if(preview){c.translate(w/2,h/2);let s=Math.min(w/660,h/340);c.scale(s,s);c.translate(-500,-300);if(mode==='analog'){this.analog(c,{remaining,initial,theme,time,reduced,preview},500,275,135);}else this.digital(c,{remaining,theme,time,reduced,preview},500,255,.72);}
  else{
   fit(c,w,h,w<650?(mode==='analog'?560:760):1000);
   if(completed){if(this.completeAt===null)this.completeAt=time;this.ending(c,{time:time-this.completeAt,reduced,gentle,mode,theme});}
   else{this.completeAt=null;if(mode==='analog')this.analog(c,{remaining,initial,theme,time,reduced,preview},500,270,225);else this.digital(c,{remaining,theme,time,reduced,preview},500,245,1.1);}
   if(paused){c.fillStyle=theme.wash+'dc';c.fillRect(0,0,1000,600);text(c,'A little pause.',500,270,'italic 48px Georgia',theme.ink);text(c,formatTime(remaining)+' remaining',500,325,'24px Georgia',theme.ink);}
  }
  c.restore();
 }
 analog(c,{remaining,initial,theme,time,reduced,preview},cx,cy,r){
  const minute=Math.ceil(remaining/60);
  if(this.lastMinute!==minute){this.oldMinute=this.lastMinute;this.lastMinute=minute;this.minuteChanged=time;this.minuteSpan=remaining%60||60;}
  // Draw the first hand immediately. The setup preview repeats that opening
  // action; running timers subsequently repaint only when the minute changes.
  const opening=preview?time<16.4:this.oldMinute===null;
  const age=preview?time%16.4:time-this.minuteChanged;
  const changing=!reduced&&remaining>60&&(preview||opening||this.oldMinute!==minute)&&age<(opening?4.4:6);
  const angle=(minute%60)/60*TAU-Math.PI/2,oldAngle=((this.oldMinute??minute)%60)/60*TAU-Math.PI/2;
  const hourAngle=(remaining/3600%12)/12*TAU-Math.PI/2;
  const final=remaining<=60;
  const erase=changing&&!opening&&age<1.9;
  const amount=changing?(erase?1-ease((age-.5)/1.35):ease((age-(opening?.6:2.0))/2.4)):1;
  const engagement=changing?ease(age/(opening?.6:.5))*(1-ease((age-(opening?3.2:4.6))/1.2)):0;
  const workAngle=erase?oldAngle:angle,workLength=r*.78*amount;
  const target={x:Math.cos(workAngle)*workLength,y:Math.sin(workAngle)*workLength};
  const moment=!preview&&!reduced&&!final&&!changing?boredMoment({seed:this.boredSeed,minute,age,span:this.minuteSpan}):null;
  const curiosity=boredWeight(moment);
  this.analogAction={opening,changing,erase,amount,engagement,age,moment};
  c.save();c.translate(cx,cy);
  // Physical rim, subtle cast shadow, and a static raster glass surface (no boiling noise).
  c.shadowColor='#1b332b20';c.shadowBlur=16;c.shadowOffsetY=8;circle(c,0,0,r+11);c.fillStyle='#4a5b3b';c.fill();c.shadowColor='transparent';
  circle(c,0,0,r+5);c.fillStyle='#e3d5ac';c.fill();circle(c,0,0,r);c.fillStyle=theme.glass;c.fill();
  c.save();circle(c,0,0,r);c.clip();c.globalAlpha=.86;c.drawImage(painted.glass,-r,-r,r*2,r*2);c.globalAlpha=.36;c.globalCompositeOperation='multiply';c.fillStyle=theme.glass;c.fillRect(-r,-r,r*2,r*2);c.restore();
  if(!this.shadowCanvas){this.shadowCanvas=document.createElement('canvas');this.shadowCanvas.width=900;this.shadowCanvas.height=900;}
  const sc=this.shadowCanvas.getContext('2d');sc.setTransform(1,0,0,1,0,0);sc.clearRect(0,0,900,900);sc.translate(450,450);
  let claw=null;
  if(final){claw=drawClawAction(sc,remaining,initial,r,{reduced});this.lastClaw=claw.last;this.lastContact=claw;}
  else if(changing)this.lastPainter=drawPainterAction(sc,target,r,age,{erase,reduced,engagement});
  else drawGlassCat(sc,{x:0,y:0},r,reduced?0:Math.max(0,Math.min(48,age-(opening?4.4:6))),{rest:true,moment});
  c.save();circle(c,0,0,r-1);c.clip();c.globalAlpha=final?.54:changing?.38+engagement*.20:.38+curiosity*.07;c.filter=`blur(${final?1.2:changing?3.0-engagement*1.7:3.0-curiosity*.6}px) saturate(.48)`;c.drawImage(this.shadowCanvas,-450,-450);c.restore();
  // A glazing pass sits in front of the animal, so the painted cat is behind a real surface.
  c.save();circle(c,0,0,r);c.clip();c.globalAlpha=.14;c.globalCompositeOperation='screen';c.drawImage(painted.glass,-r,-r,r*2,r*2);c.restore();
  for(let i=0;i<60;i++){const a=i/60*TAU-Math.PI/2;const major=i%5===0;const jitter=Math.sin(i*13.1)*.7;const tick=final?scratchTiming(remaining,initial):null;const removed=tick&&(i<tick.completed?1:i===tick.index?tick.progress:0);c.save();c.globalAlpha=1-(removed||0);stroke(c,[[Math.cos(a)*(r-9),Math.sin(a)*(r-9)],[Math.cos(a)*(r-(major?28:17))+jitter,Math.sin(a)*(r-(major?28:17))]],theme.ink,major?3.8:1.7);c.restore();}
  for(let i=1;i<=12;i++){const a=i/12*TAU-Math.PI/2;text(c,String(i===12?60:i*5),Math.cos(a)*(r-44),Math.sin(a)*(r-44),`${preview?9:14}px Georgia`,theme.ink+'a8');}
  // The brush tip and the growing/erasing painted hand share one glass target.
  paintStroke(c,hourAngle,r*.43,preview?5:8,theme.ink,.98);
  if(erase){paintStroke(c,oldAngle,r*.78,preview?6:10,theme.ink,amount);paintStroke(c,angle,r*.78,preview?6:10,theme.ink,.05);}
  else paintStroke(c,angle,r*.78,preview?6:10,theme.ink,amount);
  if(changing){circle(c,target.x,target.y,preview?2:3.5);c.fillStyle=theme.ink;c.fill();}
  circle(c,0,0,preview?5:8);c.fillStyle=theme.ink;c.fill();
  if(final){
   const timing=scratchTiming(remaining,initial);
   for(let i=0;i<Math.min(60,Math.ceil(initial));i++){
    const path=scratchPath(i,r),done=i<timing.completed,progress=done?1:i===timing.index?timing.progress:0;
    if(progress>0)for(let finger=0;finger<3;finger++){
     const dx=-Math.sin(path.angle)*(finger-1)*2.6,dy=Math.cos(path.angle)*(finger-1)*2.6,ex=path.start.x+(path.end.x-path.start.x)*progress,ey=path.start.y+(path.end.y-path.start.y)*progress;
     stroke(c,[[path.start.x+dx,path.start.y+dy],[ex+dx,ey+dy]],theme.ink+'86',1.05);
     stroke(c,[[path.start.x+dx+.9,path.start.y+dy],[ex+dx+.9,ey+dy]],'#fff9ea95',.55);
    }
   }
   if(claw?.contact&&!reduced&&claw.paw){for(let finger=0;finger<3;finger++){const dx=(finger-1)*2.5;stroke(c,[[claw.paw.x+dx,claw.paw.y-4],[claw.paw.x+dx-2,claw.paw.y+3]],'#fff8e6',1.3);}}
  }

  c.restore();
  text(c,formatTime(remaining),cx,cy+r+(preview?28:47),`${preview?19:38}px Georgia`,theme.ink);
  if(!preview)text(c,'THE PAINTER · MINUTES : SECONDS',cx,568,'9px Arial',theme.ink+'a0');
 }
 digital(c,{remaining,theme,time,reduced,preview},cx,cy,scale){
  const str=formatTime(remaining).padStart(5,'0');let width=0;for(const ch of str)width+=ch===':'?36:106;width-=14;this.digitalLayout={width,cx,cy,scale,slots:[]};
  c.save();c.translate(cx-width*scale/2,cy-90*scale);c.scale(scale,scale);drawHousing(c,width);
  const active=new Map();let x=0;
  for(let digit=0;digit<str.length;digit++){
   const ch=str[digit];if(ch===':'){for(const y of [55,122]){const pt=project(x+12,y,1,width/2);c.beginPath();c.arc(pt.x,pt.y,5,0,TAU);c.fillStyle=theme.block;c.fill();}x+=36;continue;}
   const on=segments[Number(ch)];
   for(let j=0;j<7;j++){
    const key=`${digit}-${j}`,p={x:x+positions[j][0],y:positions[j][1],horizontal:j<3,key};drawSocket(c,p,width/2,{dark:on.includes(j)});this.digitalLayout.slots.push(p);
    const previous=this.previousDigits.get(key),enabled=on.includes(j);
    const born=enabled&&previous?.active?previous.born:time;
    active.set(key,{...p,active:enabled,born});
    if(enabled){const t=reduced?1:ease((time-born)/.55);drawSolid(c,p,{z:-64*(1-t),depth:58,color:theme.block,center:width/2});}
   }
   x+=106;
  }
  if(!reduced&&!preview)for(const [key,p]of this.previousDigits)if(p.active&&!active.get(key)?.active)this.particles.push({...p,start:time,vx:(Math.random()-.5)*80,rot:(Math.random()-.5)*1.5,col:theme.block});
  this.previousDigits=active;
  if(reduced)this.particles=[];
  if(!preview){
   for(const p of this.particles){
    const age=time-p.start,move=ease(age/.42),z=105*move;let fall=320*Math.max(0,age-.20)**2;
    const bottom=project(p.x+p.vx*age,p.y+fall+(p.horizontal?17:65),z,width/2).y;
    p.landed=bottom>=310||age>1.5;if(bottom>310)fall-=(bottom-310)/1.12;
    drawSolid(c,{...p,x:p.x+p.vx*age,y:p.y+fall},{z,depth:58,color:p.col,center:width/2,rotation:age>.3?p.rot*(age-.3):0});
    if(p.landed)for(let k=0;k<3;k++)this.debris.push({x:Math.max(-40,Math.min(width+40,p.x+p.vx*age+(k-1)*11)),y:304+Math.random()*6,a:p.rot+k,col:p.col,size:8+Math.random()*4});
   }
   this.particles=this.particles.filter(p=>!p.landed);if(this.debris.length>100)this.debris.splice(0,this.debris.length-100);
   for(const d of this.debris){c.save();c.translate(d.x,d.y);c.rotate(d.a);c.fillStyle=d.col;c.fillRect(0,0,d.size,d.size*.65);c.fillStyle='#1f3028';c.beginPath();c.moveTo(d.size,0);c.lineTo(d.size+3,-3);c.lineTo(d.size+3,d.size*.65-3);c.lineTo(d.size,d.size*.65);c.fill();c.fillStyle='#a89b65';c.beginPath();c.moveTo(0,0);c.lineTo(3,-3);c.lineTo(d.size+3,-3);c.lineTo(d.size,0);c.fill();c.restore();}
  }
  c.restore();
  const floor=cy+222*scale;
  stroke(c,[[cx-width*scale/2-50,floor],[cx+width*scale/2+50,floor]],theme.ink+'24',1);
  if(preview){drawPaintedAnimal(c,'cat',cx-width*scale/2-14,floor+2,130,reduced?0:time,{still:reduced});return;}
  if(!reduced&&time>=this.nextVisit&&!this.visitor){this.visitor={start:time,type:species[Math.floor(Math.random()*species.length)],direction:Math.random()<.5?1:-1};this.nextVisit=time+50+Math.random()*25;}
  if(this.visitor&&!reduced){const age=time-this.visitor.start,duration=this.visitor.type==='turtle'?90:this.visitor.type==='fish'?24:40,t=age/duration,d=this.visitor.direction,px=d===1?-170+t*1340:1170-t*1340;
   const aspect=paintedAspect(this.visitor.type),visitorWidth=Math.min(205,112*aspect);
   drawPaintedAnimal(c,this.visitor.type,px,floor+8,visitorWidth,visitorMotionTime(this.visitor.type,age*1340/duration,visitorWidth),{direction:d});
   const local=(px-cx)/scale+width/2;
   this.debris=this.debris.filter(p=>{const scatter=Math.abs(Math.sin(p.a*12.4))*28;if(d===1&&p.x<local+90+scatter)p.x=local+90+scatter;if(d===-1&&p.x>local-90-scatter)p.x=local-90-scatter;return p.x>-110&&p.x<width+110;});if(t>=1)this.visitor=null;
  }
  text(c,'THE BUILDERS',cx,568,'9px Arial',theme.ink+'a0');
 }
 // Retained for focused depth-rendering checks and clock-completion housing.
 block(c,p,color,alpha=1,empty=false){if(empty)drawSocket(c,p,235);else drawSolid(c,p,{color,alpha});}
 ending(c,{time,reduced,gentle,mode,theme}){
  const t=reduced||gentle?1:ease(time/1.7);
  if(mode==='digital'){
   // Reuse the running geometry verbatim, including its colon gap and long-time width.
   const layout=this.digitalLayout||{width:446,cx:500,cy:245,scale:1.1,slots:[0,106,248,354].flatMap(x=>positions.map(([px,y],j)=>({x:x+px,y,horizontal:j<3})))};
   if(!this.endPanel){
    this.endPanel=document.createElement('canvas');this.endPanel.width=1000;this.endPanel.height=600;
    const ec=this.endPanel.getContext('2d');ec.translate(layout.cx-layout.width*layout.scale/2,layout.cy-90*layout.scale);ec.scale(layout.scale,layout.scale);drawHousing(ec,layout.width);
    for(const p of layout.slots)drawSocket(ec,p,layout.width/2,{dark:false});
   }
   const rise=reduced?1:ease((time-.3)/2.6),look=reduced?1:Math.min(1,Math.max(0,(time-1.1)/.8));
   const panelTop=layout.cy-112*layout.scale;
   // The head rises from behind the stationary top edge. Panel occlusion is real,
   // so the beret and ears appear first; the clock is never translated or rescaled.
   drawAnimation(c,'cat-peek',layout.cx+layout.width*layout.scale*.30,panelTop+200-110*rise,150,look,{loop:false});
   c.drawImage(this.endPanel,0,0);
  }else{
   drawAnimation(c,'cat-walk',500,535,250,0,{loop:false});
  }
  if(mode==='analog'&&t<1){if(time<.25){c.save();c.globalAlpha=1-time/.25;for(let claw=0;claw<3;claw++)stroke(c,[[500+(this.lastClaw?.x||0)+claw*2.5,270+(this.lastClaw?.y||0)-5],[499+(this.lastClaw?.x||0)+claw*2.5,270+(this.lastClaw?.y||0)+2]],theme.ink,1.3);c.restore();}for(let i=0;i<24;i++){const a=i*TAU/24,b=(i+1)*TAU/24;c.save();c.translate(500+Math.cos(a)*t*175,270+t*t*430);c.rotate((i%2?1:-1)*t*.8);c.beginPath();c.moveTo(0,0);c.lineTo(Math.cos(a)*225,Math.sin(a)*225);c.lineTo(Math.cos(b)*225,Math.sin(b)*225);c.closePath();c.clip();c.globalAlpha=(1-t)*.88;c.drawImage(painted.glass,-225,-225,450,450);c.globalCompositeOperation='multiply';c.fillStyle=theme.glass;c.fillRect(-225,-225,450,450);c.restore();}}
  this.particles=[];this.debris=[];this.visitor=null;
 }
}
const positions=[[13,0],[13,81],[13,162],[0,16],[77,16],[0,97],[77,97]];
const segments=[[0,2,3,4,5,6],[4,6],[0,1,2,4,5],[0,1,2,4,6],[1,3,4,6],[0,1,2,3,6],[0,1,2,3,5,6],[0,4,6],[0,1,2,3,4,5,6],[0,1,2,3,4,6]];
