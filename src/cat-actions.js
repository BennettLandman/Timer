import {drawAnimation,spritePlacement,frameIndex} from './paint.js';
const clamp=v=>Math.max(0,Math.min(1,v));
export function scratchTiming(remaining,initial){
 const elapsed=Math.max(0,Math.min(Math.min(60,initial),Math.min(60,initial)-remaining));
 const completed=Math.floor(elapsed+1e-7),fraction=elapsed-completed;
 const last=completed>=Math.ceil(Math.min(60,initial))-1,finish=last?1:.55;
 const frame=last&&fraction>=.34?Math.min(13,Math.floor(8+(fraction-.34)/.66*5)):frameIndex(fraction);
 return {completed,index:Math.min(59,completed),fraction,progress:clamp((fraction-.34)/(finish-.34)),contact:fraction>=.34&&fraction<=finish,frame};
}
// Measured claw/tail contacts in the original 256px painted cells.
const pawKeys=[[0,225,70],[5,223,14],[7,232,42],[8,234,51],[9,225,72],[10,226,92],[11,222,112],[12,220,132],[13,194,142],[16,215,85],[20,225,40],[23,225,70]];
const tailKeys=[[7,160,36],[8,204,32],[9,246,12],[10,235,13],[11,224,15]];
function anchor(keys,frame){for(let i=1;i<keys.length;i++){if(frame<=keys[i][0]){const a=keys[i-1],b=keys[i],t=clamp((frame-a[0])/(b[0]-a[0]));return {u:(a[1]+(b[1]-a[1])*t)/256,v:(a[2]+(b[2]-a[2])*t)/256};}}return {u:keys.at(-1)[1]/256,v:keys.at(-1)[2]/256};}
function point(p,key,frame=0){const f=Math.floor(frame),t=frame-f,shift=p.m.frames[f].shiftY*(1-t)+p.m.frames[Math.min(23,f+1)].shiftY*t;return {x:p.left+key.u*p.m.cw*p.scale,y:p.top+(key.v*p.m.ch+shift)*p.scale};}
export function scratchPath(index,r){
 const angle=-Math.PI/2+index*Math.PI/30;
 return {angle,start:{x:Math.cos(angle)*(r-9),y:Math.sin(angle)*(r-9)},end:{x:Math.cos(angle)*(r-36),y:Math.sin(angle)*(r-36)}};
}
export function drawClawAction(c,remaining,initial,r,{reduced=false}={}){
 const state=scratchTiming(remaining,initial),path=scratchPath(state.index,r),width=r*.83;
 const frame=reduced?9:state.frame,base=spritePlacement('cat-scratch',0,0,width);if(!base)return state;
 const local=point(base,anchor(pawKeys,frame),frame),home=point(base,anchor(pawKeys,8),8);
 const step=state.fraction>.78?clamp((state.fraction-.78)/.22):0;
 const angle=path.angle+step*Math.PI/30,rotation=angle+Math.PI/2;
 const co=Math.cos(rotation),si=Math.sin(rotation);
 const transform=p=>({x:p.x*co-p.y*si,y:p.x*si+p.y*co});
 const h=transform(home),p=transform(local);
 let x=Math.cos(angle)*(r-9)-h.x,y=Math.sin(angle)*(r-9)-h.y;
 if(state.contact){const target={x:path.start.x+(path.end.x-path.start.x)*state.progress,y:path.start.y+(path.end.y-path.start.y)*state.progress};x=target.x-p.x;y=target.y-p.y;}
 c.save();c.translate(x,y);c.rotate(rotation);drawAnimation(c,'cat-scratch',0,0,width,(frame+.01)/24,{loop:true});c.restore();
 return {...state,paw:{x:x+p.x,y:y+p.y},last:path.end};
}
export function drawPainterAction(c,target,r,age,{erase=false,reduced=false}={}){
 const name=erase?'cat-scratch':'cat-paint';
 // One deliberate stroke per hand change, rather than several frantic tail loops.
 const frame=reduced?9:erase?8+Math.min(4,age/1.55*4):7+Math.min(4,Math.max(0,age-1.55)/2.4*4);
 const f=Math.min(23,frame),key=anchor(erase?pawKeys:tailKeys,f),width=r*.94;
 const base=spritePlacement(name,0,0,width);if(!base)return;
 const tip=point(base,key,f),x=target.x-tip.x,y=target.y-tip.y;
 drawAnimation(c,name,x,y,width,f/24,{loop:false});
 return {x:target.x,y:target.y};
}
