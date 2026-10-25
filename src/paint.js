// Painted raster assets approved by the owner. Mesh deformation keeps the same pigment
// and character identity in every pose, without swapping to vector illustrations.
export const castGroups = [
 ['dog','panda','turtle','pig','bear','cow'],
 ['fish','eagle','turkey','raven','rabbit','fox'],
 ['deer','horse','sheep','goat','elephant','giraffe'],
 ['zebra','lion','penguin','owl','frog','hedgehog']
];
export const painted = {};
const image = async path => { const img = new Image(); img.src = new URL(`assets/${path}`, import.meta.url).href; await img.decode(); return img; };
let loading;
export function loadPaintAssets() {
 return loading ||= Promise.all([
  image('cat.png').then(v=>painted.cat=v),
  image('glass.png').then(v=>painted.glass=v),
  image('paint.png').then(v=>painted.paint=v),
  ...castGroups.map((_,i)=>image(`cast-${i+1}.png`).then(v=>painted[`cast${i}`]=v))
 ]).then(()=>{sourceCanvas('cat');castGroups.forEach((_,i)=>decodeAtlas(i));});
}
const clamp = v=>Math.max(0,Math.min(1,v));
const smooth = v=>{v=clamp(v);return v*v*(3-2*v);};
function triangle(c,img,s,d) {
 const [p,q,r]=s,[a,b,e]=d;
 const den=p.x*(q.y-r.y)+q.x*(r.y-p.y)+r.x*(p.y-q.y);
 if(Math.abs(den)<1e-7)return;
 const A=(a.x*(q.y-r.y)+b.x*(r.y-p.y)+e.x*(p.y-q.y))/den;
 const C=(a.x*(r.x-q.x)+b.x*(p.x-r.x)+e.x*(q.x-p.x))/den;
 const E=(a.x*(q.x*r.y-r.x*q.y)+b.x*(r.x*p.y-p.x*r.y)+e.x*(p.x*q.y-q.x*p.y))/den;
 const B=(a.y*(q.y-r.y)+b.y*(r.y-p.y)+e.y*(p.y-q.y))/den;
 const D=(a.y*(r.x-q.x)+b.y*(p.x-r.x)+e.y*(q.x-p.x))/den;
 const F=(a.y*(q.x*r.y-r.x*q.y)+b.y*(r.x*p.y-p.x*r.y)+e.y*(p.x*q.y-q.x*p.y))/den;
 c.save();c.beginPath();
 // Tiny overlap avoids hairline seams between neighboring textured triangles.
 const center={x:(a.x+b.x+e.x)/3,y:(a.y+b.y+e.y)/3};
 for(let i=0;i<3;i++){const v=d[i];const x=center.x+(v.x-center.x)*1.012,y=center.y+(v.y-center.y)*1.012;i?c.lineTo(x,y):c.moveTo(x,y);}c.closePath();c.clip();c.transform(A,B,C,D,E,F);c.drawImage(img,0,0);c.restore();
}
const sourceCache=new Map();
const decodedGroups=new Set();
function normalize(raw){
 const rc=raw.getContext('2d',{willReadFrequently:true});const pixels=rc.getImageData(0,0,raw.width,raw.height).data;let left=raw.width,top=raw.height,right=0,bottom=0;
 for(let y=0;y<raw.height;y++)for(let x=0;x<raw.width;x++)if(pixels[(y*raw.width+x)*4+3]>64){left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);}
 left=Math.max(0,left-3);top=Math.max(0,top-3);right=Math.min(raw.width,right+4);bottom=Math.min(raw.height,bottom+4);
 const cv=document.createElement('canvas');cv.width=480;cv.height=Math.max(1,Math.round((bottom-top)/(right-left)*480));
 cv.getContext('2d').drawImage(raw,left,top,right-left,bottom-top,0,0,cv.width,cv.height);return cv;
}
function decodeAtlas(group){
 if(decodedGroups.has(group))return;
 const image=painted[`cast${group}`],cv=document.createElement('canvas');cv.width=image.width;cv.height=image.height;
 const c=cv.getContext('2d',{willReadFrequently:true});c.drawImage(image,0,0);
 const {data}=c.getImageData(0,0,cv.width,cv.height),w=cv.width,h=cv.height,n=w*h;
 const labels=new Int32Array(n),queue=new Uint32Array(n),components=[];let id=0;
 // Generated atlases preserve order but their painted silhouettes may cross a
 // nominal cell edge. Decode connected alpha silhouettes instead of clipping
 // equal rectangles, which could truncate a face or include a neighbor's fur.
 for(let index=0;index<n;index++){
  if(labels[index]||data[index*4+3]<=24)continue;
  id++;let head=0,tail=1;queue[0]=index;labels[index]=id;
  let left=w,right=0,top=h,bottom=0,sx=0,sy=0;
  while(head<tail){const at=queue[head++],x=at%w,y=Math.floor(at/w);left=Math.min(left,x);right=Math.max(right,x);top=Math.min(top,y);bottom=Math.max(bottom,y);sx+=x;sy+=y;
   for(const next of [x>0?at-1:-1,x<w-1?at+1:-1,y>0?at-w:-1,y<h-1?at+w:-1])if(next>=0&&!labels[next]&&data[next*4+3]>24){labels[next]=id;queue[tail++]=next;}
  }
  components.push({id,area:tail,left,right,top,bottom,cx:sx/tail,cy:sy/tail});
 }
 let main=components.sort((a,b)=>b.area-a.area).slice(0,6).sort((a,b)=>a.cy-b.cy);
 main=[...main.slice(0,3).sort((a,b)=>a.cx-b.cx),...main.slice(3).sort((a,b)=>a.cx-b.cx)];
 if(main.length!==6||main.some(p=>p.area<1000))throw new Error('Painted atlas must contain six separate animals');
 main.forEach((component,cell)=>{
  const left=Math.max(0,component.left-3),top=Math.max(0,component.top-3),right=Math.min(w,component.right+4),bottom=Math.min(h,component.bottom+4);
  const raw=document.createElement('canvas');raw.width=right-left;raw.height=bottom-top;const rc=raw.getContext('2d'),out=rc.createImageData(raw.width,raw.height);
  for(let y=top;y<bottom;y++)for(let x=left;x<right;x++){
   const at=y*w+x,label=labels[at];let keep=label===component.id;
   if(!keep&&data[at*4+3]<=24){for(let dy=-1;dy<=1&&!keep;dy++)for(let dx=-1;dx<=1;dx++){const nx=x+dx,ny=y+dy;if(nx>=0&&nx<w&&ny>=0&&ny<h&&labels[ny*w+nx]===component.id)keep=true;}}
   if(keep){const dest=((y-top)*raw.width+x-left)*4;for(let k=0;k<4;k++)out.data[dest+k]=data[at*4+k];}
  }
  rc.putImageData(out,0,0);sourceCache.set(castGroups[group][cell],normalize(raw));
 });
 decodedGroups.add(group);
}
function sourceCanvas(type){
 if(sourceCache.has(type))return sourceCache.get(type);
 if(type==='cat'){const cv=document.createElement('canvas');cv.width=480;cv.height=320;cv.getContext('2d').drawImage(painted.cat,0,0,480,320);sourceCache.set(type,normalize(cv));}
 else{const group=castGroups.findIndex(names=>names.includes(type));if(group<0)throw new Error(`Unknown painted species: ${type}`);decodeAtlas(group);}
 return sourceCache.get(type);
}
export function drawPaintedAnimal(c,type,x,y,width,time=0,{direction=1,still=false,tailTarget=null,opacity=1,guilty=false}={}){
 if(!painted.cat)return;
 const img=sourceCanvas(type),height=width*img.height/img.width;
 c.save();c.globalAlpha*=opacity;c.translate(x,y);c.scale(direction,1);c.translate(-width/2,-height);
 if(still&&!tailTarget&&!guilty){c.drawImage(img,0,0,width,height);c.restore();return;}
 const cycle=still?0:time*Math.PI*2/.95, gait=still?0:1;
 const flying=['eagle','raven','owl','turkey'].includes(type),fish=type==='fish',frog=type==='frog';
 const cols=12,rows=10,vertices=[];
 for(let row=0;row<=rows;row++)for(let col=0;col<=cols;col++){
  const u=col/cols,v=row/rows;
  const leg=smooth((v-.57)/.37), head=smooth((u-.55)/.3)*(1-smooth((v-.25)/.4));
  const swing=Math.sin(cycle+(u<.46?0:Math.PI)+(u>.68?.45:0));
  let dx=gait*.023*swing*leg,dy=-gait*.018*Math.max(0,Math.cos(cycle+(u<.46?0:Math.PI)))*leg;
  if(guilty){dx-=head*.025*(v-.34);dy+=head*.045;}
  dy+=gait*.005*Math.sin(cycle*2)*(1-leg);dx+=gait*.003*Math.sin(cycle)*head;
  if(flying){const wing=(1-smooth(Math.abs(u-.5)/.5))*(1-smooth((v-.65)/.25));dy+=gait*.047*Math.sin(cycle)*wing;}
  if(fish){dx+=gait*.026*Math.sin(cycle+u*4);dy+=gait*.027*Math.sin(cycle+u*5);}
  if(frog)dy-=gait*.025*Math.max(0,Math.sin(cycle))*(1-leg);
  // The tabby's tail occupies the upper-left of its transparent source image.
  if(type==='cat'){
   const tail=(1-smooth((u-.18)/.17))*(1-smooth((v-.28)/.18));
   dx+=gait*.016*Math.sin(cycle*.5)*tail;
   if(tailTarget){const tx=(tailTarget.x-x)*direction/width+.5,ty=(tailTarget.y-y+height)/height;dx+=(tx-.015)*tail;dy+=(ty-.055)*tail;}
  }
  vertices.push({s:{x:u*img.width,y:v*img.height},d:{x:(u+dx)*width,y:(v+dy)*height}});
 }
 for(let row=0;row<rows;row++)for(let col=0;col<cols;col++){
  const a=vertices[row*(cols+1)+col],b=vertices[row*(cols+1)+col+1],d=vertices[(row+1)*(cols+1)+col],e=vertices[(row+1)*(cols+1)+col+1];
  triangle(c,img,[a.s,b.s,d.s],[a.d,b.d,d.d]);triangle(c,img,[b.s,e.s,d.s],[b.d,e.d,d.d]);
 }
 c.restore();
}
export function drawPaintTexture(c,x,y,w,h,opacity=.25){
 c.save();c.globalAlpha*=opacity;c.drawImage(painted.paint,1010,12,420,190,x,y,w,h);c.restore();
}

export function paintedAspect(type){const img=sourceCanvas(type);return img.width/img.height;}
