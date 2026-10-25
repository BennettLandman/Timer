// Perspective-projected solid segments. z is actual depth: positive points move
// toward the viewer; negative points move through the recessed socket.
import {drawPaintTexture} from './paint.js';
export function project(x,y,z=0,center=235){
 const yaw=-.105,pitch=.12;
 const xx=(x-center)*Math.cos(yaw)+z*Math.sin(yaw);
 const zz=-(x-center)*Math.sin(yaw)+z*Math.cos(yaw);
 const yy=(y-90)*Math.cos(pitch)-zz*Math.sin(pitch);
 const depth=(y-90)*Math.sin(pitch)+zz*Math.cos(pitch);
 const s=1100/(1100-depth);
 return {x:center+xx*s,y:90+yy*s};
}
function shape(c,points,fill,stroke=null){c.beginPath();points.forEach((p,i)=>i?c.lineTo(p.x,p.y):c.moveTo(p.x,p.y));c.closePath();c.fillStyle=fill;c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=.65;c.stroke();}}
export function segmentPolygon(p){const w=p.horizontal?65:17,h=p.horizontal?17:65;return [[4,0],[w-4,0],[w,4],[w,h-4],[w-4,h],[4,h],[0,h-4],[0,4]].map(([x,y])=>[x+p.x,y+p.y]);}
export function drawSolid(c,p,{z=0,depth=53,color='#35483e',alpha=1,center=235,rotation=0}={}){
 c.save();c.globalAlpha*=alpha;let points=segmentPolygon(p);
 if(rotation){const cx=p.x+(p.horizontal?32.5:8.5),cy=p.y+(p.horizontal?8.5:32.5);points=points.map(([x,y])=>[cx+(x-cx)*Math.cos(rotation)-(y-cy)*Math.sin(rotation),cy+(x-cx)*Math.sin(rotation)+(y-cy)*Math.cos(rotation)]);}
 const front=points.map(([x,y])=>project(x,y,z,center)),back=points.map(([x,y])=>project(x,y,z-depth,center));
 shape(c,back,'#1f2c24');
 for(let i=0;i<8;i++){const j=(i+1)%8;shape(c,[back[i],back[j],front[j],front[i]],i<3?'#637257':'#1f3028','#17251f30');}
 shape(c,front,color,'#20342c');
 c.save();c.beginPath();front.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.clip();const xs=front.map(v=>v.x),ys=front.map(v=>v.y),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;drawPaintTexture(c,x,y,w,h,.32);c.globalCompositeOperation='multiply';c.globalAlpha=.7;c.fillStyle=color;c.fillRect(x,y,w,h);c.restore();
 c.strokeStyle='#f7e6b076';c.lineWidth=1.2;c.beginPath();c.moveTo(front[0].x,front[0].y);c.lineTo(front[1].x,front[1].y);c.lineTo(front[2].x,front[2].y);c.stroke();c.restore();
}
export function drawSocket(c,p,center,{dark=false}={}){
 const points=segmentPolygon(p),mouth=points.map(([x,y])=>project(x,y,-1,center)),back=points.map(([x,y])=>project(x,y,-68,center));
 shape(c,mouth,dark?'#192c24':'#a99c76');
 for(let i=0;i<8;i++){let j=(i+1)%8;shape(c,[mouth[i],mouth[j],back[j],back[i]],i<3?(dark?'#17291f':'#887d5e'):(dark?'#69755b':'#e1d6b4'));}
 shape(c,back,dark?'#17291f':'#c8bc96');
 c.strokeStyle='#c0bc9d';c.lineWidth=1.8;c.beginPath();mouth.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.stroke();
}
export function drawHousing(c,width){
 const front=[[ -20,-22],[width+20,-22],[width+20,198],[-20,198]].map(([x,y])=>project(x,y,-3,width/2));
 const back=[[-20,-22],[width+20,-22],[width+20,198],[-20,198]].map(([x,y])=>project(x,y,-80,width/2));
 shape(c,back,'#a69e7c');shape(c,[back[0],back[1],front[1],front[0]],'#ece0ba');shape(c,[front[1],back[1],back[2],front[2]],'#b1a482');shape(c,front,'#e6ddbd','#b2a687');
 c.save();c.beginPath();front.forEach((v,i)=>i?c.lineTo(v.x,v.y):c.moveTo(v.x,v.y));c.closePath();c.clip();drawPaintTexture(c,-45,-50,width+90,270,.7);c.restore();
}
