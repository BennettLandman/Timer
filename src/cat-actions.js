import {drawAnimation,spritePlacement,frameIndex} from './paint.js';
const clamp=v=>Math.max(0,Math.min(1,v));
export function scratchTiming(remaining,initial){
 const elapsed=Math.max(0,Math.min(Math.min(60,initial),Math.min(60,initial)-remaining));
 const completed=Math.floor(elapsed+1e-7),fraction=elapsed-completed;
 const last=completed>=Math.ceil(Math.min(60,initial))-1,finish=last?1:.55;
 const frame=last&&fraction>=.34?Math.min(13,Math.floor(8+(fraction-.34)/.66*5)):frameIndex(fraction);
 return {completed,index:Math.min(59,completed),fraction,progress:clamp((fraction-.34)/(finish-.34)),contact:fraction>=.34&&fraction<=finish,frame};
}
const pawKeys=[[0,.90,.26],[5,.95,.04],[7,.91,.18],[9,.86,.32],[11,.80,.42],[13,.75,.47],[16,.79,.42],[20,.90,.20],[23,.92,.20]];
const tailKeys=[[0,.28,.35],[3,.45,.10],[5,.65,.06],[7,.73,.17],[10,.88,.21],[12,.78,.22],[15,.62,.28],[18,.40,.36],[23,.28,.35]];
function anchor(keys,frame){for(let i=1;i<keys.length;i++){if(frame<=keys[i][0]){const a=keys[i-1],b=keys[i],t=(frame-a[0])/(b[0]-a[0]);return {u:a[1]+(b[1]-a[1])*t,v:a[2]+(b[2]-a[2])*t};}}return {u:keys.at(-1)[1],v:keys.at(-1)[2]};}
export function scratchPlacement(index,r){
 const width=r*.78,floor=r*.78+Math.sin(index*.71)*r*.10;
 // A supported upright stance; only small sidesteps occur between strokes.
 const x=-r*.20+Math.sin(index*.43)*r*.25+index/59*r*.10;
 const p=spritePlacement('cat-scratch',x,floor,width);return {...p,x,floor,width};
}
function point(p,key,frame=0){return {x:p.left+key.u*p.m.cw*p.scale,y:p.top+(key.v*p.m.ch+p.m.frames[frame].shiftY)*p.scale};}
export function scratchPath(index,r){const p=scratchPlacement(index,r);return {start:point(p,anchor(pawKeys,9),9),end:point(p,anchor(pawKeys,12),12)};}
export function drawClawAction(c,remaining,initial,r,{reduced=false}={}){
 const state=scratchTiming(remaining,initial);let x=scratchPlacement(state.index,r).x,floor=scratchPlacement(state.index,r).floor;
 // The cat shifts its weight only after retracting the claw, not during contact.
 if(state.fraction>.78){const next=scratchPlacement(Math.min(59,state.index+1),r),t=clamp((state.fraction-.78)/.22);x+=(next.x-x)*t;floor+=(next.floor-floor)*t;}
 const width=r*.78;
 const drawn=drawAnimation(c,'cat-scratch',x,floor,width,reduced?0:(state.frame+.01)/24,{loop:true});
 const paw=drawn?point(drawn,anchor(pawKeys,reduced?0:state.frame),reduced?0:state.frame):null;
 return {...state,paw,last:scratchPath(state.index,r).end};
}
export function drawPainterAction(c,target,r,age,{erase=false,reduced=false}={}){
 const name=erase?'cat-scratch':'cat-paint',progress=reduced?0:erase?age/.8:Math.max(0,age-1.55)/.8;
 const frame=frameIndex(progress,{loop:true}),key=anchor(erase?pawKeys:tailKeys,frame),width=r*.82;
 const base=spritePlacement(name,0,0,width);if(!base)return;
 const x=target.x-(key.u*base.m.cw-base.m.cw/2)*base.scale;
 const y=target.y+(base.m.bottom-key.v*base.m.ch-base.m.frames[frame].shiftY)*base.scale;
 // Preserve every painted pixel and every bone length; the whole pose changes.
 drawAnimation(c,name,x,y,width,progress,{loop:true});
}
