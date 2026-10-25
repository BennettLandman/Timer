// Painted pose sequences, prepared at build time. Runtime playback only chooses
// a complete frame and applies uniform layout scaling: no mesh or limb warping.
import {species} from './art.js';
export const painted={};
const sequences=new Map(),pending=new Map();let coreLoading,visitorLoading,manifestLoading;
const image=async path=>{const img=new Image();img.src=new URL(`assets/${path}`,import.meta.url).href;await img.decode();return img;};
function manifest(){return manifestLoading ||= fetch(new URL('assets/animation/manifest.json',import.meta.url)).then(r=>{if(!r.ok)throw new Error('Animation manifest unavailable');return r.json();});}
export async function sequence(name){
 if(sequences.has(name))return sequences.get(name);
 if(!pending.has(name))pending.set(name,(async()=>{const specs=await manifest();if(!specs[name])throw new Error(`Animation missing: ${name}`);const img=await image(`animation/${name}.webp`);const meta={...specs[name],img};sequences.set(name,meta);return meta;})());
 return pending.get(name);
}
export function loadPaintAssets(){return coreLoading ||= Promise.all([
 image('glass.png').then(v=>painted.glass=v),image('paint.png').then(v=>painted.paint=v),
 ...['cat-walk','cat-scratch','cat-paint','cat-peek'].map(sequence)
 ]).then(()=>{painted.cat=true;});}
export function loadVisitorAssets(){return visitorLoading ||= loadPaintAssets().then(()=>Promise.all(species.filter(s=>s!=='cat').map(s=>sequence(`${s}-walk`))));}
export function animationMeta(name){return sequences.get(name);}
export function frameIndex(progress,{loop=true}={}){return loop?Math.floor(((progress%1+1)%1)*24):Math.min(23,Math.max(0,Math.floor(progress*24)));}
export function spritePlacement(name,x,y,width){const m=sequences.get(name);if(!m)return null;const scale=width/m.inkWidth;return {m,scale,left:x-m.cw*.5*scale,top:y-m.bottom*scale,width:m.cw*scale,height:m.ch*scale};}
export function drawAnimation(c,name,x,y,width,progress,{loop=true,direction=1,opacity=1}={}){
 const p=spritePlacement(name,x,y,width);if(!p)return null;const {m}=p;
 const phase=loop?((progress%1+1)%1)*24:Math.min(23,Math.max(0,progress*24));
 const current=Math.floor(phase),next=loop?(current+1)%24:Math.min(23,current+1);
 const order=m.playbackOrder,frame=order?order[current]:current;
 const mix=phase-current;
 c.save();c.globalAlpha*=opacity;if(direction===-1){c.translate(x*2,0);c.scale(-1,1);}
 if(mix>0||m.registration){
  m.blendCanvas??=document.createElement('canvas');const cv=m.blendCanvas,pad=32;
  if(cv.width!==m.frameWidth+pad*2||cv.height!==m.frameHeight+pad*2){cv.width=m.frameWidth+pad*2;cv.height=m.frameHeight+pad*2;}
  const b=cv.getContext('2d');b.clearRect(0,0,cv.width,cv.height);
  const paint=(f,alpha)=>{const reg=m.registration?.[f]||{x:0,y:0,scale:1};b.globalAlpha=alpha;b.drawImage(m.img,f%6*m.frameWidth,Math.floor(f/6)*m.frameHeight,m.frameWidth,m.frameHeight,pad+m.anchorX*(1-reg.scale)+reg.x,pad+m.anchorY*(1-reg.scale)+reg.y,m.frameWidth*reg.scale,m.frameHeight*reg.scale);};
  b.globalCompositeOperation='source-over';paint(frame,1-mix);
  if(mix>0){b.globalCompositeOperation='lighter';paint(order?order[next]:next,mix);}b.globalAlpha=1;b.globalCompositeOperation='source-over';
  c.drawImage(cv,x-(m.anchorX+pad)*p.scale,y-(m.anchorY+pad)*p.scale,cv.width*p.scale,cv.height*p.scale);
 }else c.drawImage(m.img,(frame%6)*m.frameWidth,Math.floor(frame/6)*m.frameHeight,m.frameWidth,m.frameHeight,x-m.anchorX*p.scale,y-m.anchorY*p.scale,m.frameWidth*p.scale,m.frameHeight*p.scale);
 c.restore();return {...p,frame};
}
export function drawPaintedAnimal(c,type,x,y,width,time=0,{direction=1,still=false,opacity=1}={}){const name=sequences.has(`${type}-walk`)?`${type}-walk`:'cat-walk';return drawAnimation(c,name,x,y,width,still?0:time/.8,{direction,opacity});}
export function paintedAspect(type){const m=sequences.get(`${type}-walk`)||sequences.get('cat-walk');return m.inkWidth/m.inkHeight;}
export function drawPaintTexture(c,x,y,w,h,opacity=.25){c.save();c.globalAlpha*=opacity;c.drawImage(painted.paint,1010,12,420,190,x,y,w,h);c.restore();}
