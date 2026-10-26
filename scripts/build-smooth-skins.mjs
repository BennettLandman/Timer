import * as T from '../src/characters/vendor/three.module.js';
import {readFile,writeFile} from 'node:fs/promises';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
for(const type of (process.argv.slice(2).length?process.argv.slice(2):['cat','fox'])){
 const spec=JSON.parse(await readFile(new URL(`../src/characters/assets/${type}-skin.spec.json`,import.meta.url)));
 const shapes=spec.shapes.map(s=>{
  if(s.kind==='ellipsoid'){
   const rot=new T.Matrix4().makeRotationFromQuaternion(new T.Quaternion(...s.q).invert()).elements,r=s.scale;
   s.distance=(x,y,z)=>{x-=s.p[0];y-=s.p[1];z-=s.p[2];const a=(rot[0]*x+rot[4]*y+rot[8]*z)/r[0],b=(rot[1]*x+rot[5]*y+rot[9]*z)/r[1],c=(rot[2]*x+rot[6]*y+rot[10]*z)/r[2],k0=Math.hypot(a,b,c),k1=Math.hypot(a/r[0],b/r[1],c/r[2]);return k1>1e-10?k0*(k0-1)/k1:-Math.min(...r);};
   s.influence=()=>[[s.bone,1]];
  }else{
   const segments=s.path.slice(1).map((b,i)=>{const a=s.path[i],v=b.map((n,j)=>n-a[j]);return {a,v,l:v.reduce((sum,n)=>sum+n*n,0),i};});
   const radius=t=>{const f=t*(s.radii.length-1),i=Math.min(s.radii.length-2,Math.floor(f));return s.radii[i]+(s.radii[i+1]-s.radii[i])*(f-i);};
   const closest=(x,y,z)=>{let best=Infinity,along=0;for(const seg of segments){const [ax,ay,az]=seg.a,[vx,vy,vz]=seg.v,t=clamp(((x-ax)*vx+(y-ay)*vy+(z-az)*vz)/seg.l),u=(seg.i+t)/segments.length,d=Math.hypot(x-ax-vx*t,y-ay-vy*t,z-az-vz*t)-radius(u);if(d<best){best=d;along=u;}}return [best,along];};
   s.distance=(x,y,z)=>closest(x,y,z)[0];s.influence=(x,y,z)=>{if(s.bones.length===1)return [[s.bones[0],1]];const t=closest(x,y,z)[1];if(type==='cat'&&(spec.bones[s.bones[0]].startsWith('reach-')||spec.bones[s.bones[0]].startsWith('rest-'))){const fore=spec.bones[s.bones[0]].startsWith('reach-')?2:1,blend=(a,b,v)=>{v=clamp((v-a)/(b-a));return v*v*(3-2*v);},elbow=blend(.43,.57,t),wrist=blend(.90,1,t);return [[s.bones[0],1-elbow],[s.bones[fore],elbow*(1-wrist)],[s.bones[3],elbow*wrist]];}const fractions=s.boneFractions||s.bones.map((_,i)=>i/(s.bones.length-1));let i=0;while(i<fractions.length-2&&t>fractions[i+1])i++;const f=clamp((t-fractions[i])/(fractions[i+1]-fractions[i]));return [[s.bones[i],1-f],[s.bones[i+1],f]];};
  }return s;
 });
 const groupOf=name=>{
  if(name==='pelvis'||name==='fox-hips')return 'body';if(name==='head'||name==='fox-neck'||name==='fox-head')return 'head';
  if(name.startsWith('fox-')&&!name.includes('tail'))return 'leg'+name.match(/\d+$/)[0];
  return name.replace(/-\d+$/,'');
 };
 const groups=spec.bones.map(groupOf);
 function jointZone(group,x,y,z){let p,r=.36;
  if(type==='cat'){p=group==='reach'?[.31,1.85,.01]:group==='rest'?[-.31,1.85,.01]:group==='hind-left'?[-.26,.92,-.02]:group==='hind-right'?[.25,.92,-.02]:group==='head'?[.08,2.1,0]:[-.24,.87,-.19];}
  else{if(group.startsWith('leg')){const i=Number(group.slice(3));p=[i===0||i===2?.52:-.52,.86,i<2?-.19:.19];r=.27;}else p=group==='head'?[.62,1.10,0]:[-.62,1.06,0];}
  return Math.hypot(x-p[0],y-p[1],z-p[2])<r;
 }
 const field=(x,y,z)=>{let d=1e6;for(const s of shapes){const e=s.distance(x,y,z),k=.085,h=Math.max(k-Math.abs(d-e),0)/k;d=Math.min(d,e)-h*h*k*.25;}return d;};
 const bounds=spec.shapes.flatMap(s=>s.kind==='ellipsoid'?[s.p.map((v,i)=>v-s.scale[i]-.15),s.p.map((v,i)=>v+s.scale[i]+.15)]:s.path.flatMap(p=>[p.map(v=>v-Math.max(...s.radii)-.15),p.map(v=>v+Math.max(...s.radii)+.15)]));
 const min=type==='cat'?[-1.42,-.12,-.63]:[0,1,2].map(i=>Math.min(...bounds.map(p=>p[i]))),max=type==='cat'?[1.25,3.15,.72]:[0,1,2].map(i=>Math.max(...bounds.map(p=>p[i]))),step=type==='cat'||type==='fox'?.038:.065,nx=Math.ceil((max[0]-min[0])/step)+1,ny=Math.ceil((max[1]-min[1])/step)+1,nz=Math.ceil((max[2]-min[2])/step)+1,N=nx*ny*nz,grid=new Float32Array(N);
 const id=(x,y,z)=>(z*ny+y)*nx+x,xyz=i=>[min[0]+(i%nx)*step,min[1]+(Math.floor(i/nx)%ny)*step,min[2]+Math.floor(i/(nx*ny))*step];
 for(let z=0;z<nz;z++)for(let y=0;y<ny;y++)for(let x=0;x<nx;x++)grid[id(x,y,z)]=field(min[0]+x*step,min[1]+y*step,min[2]+z*step);
 const position=[],normal=[],uv=[],weights=[],skin=[],coat=[],index=[],edges=new Map();
 function vertex(a,b){const key=Math.min(a,b)*N+Math.max(a,b);if(edges.has(key))return edges.get(key);const A=xyz(a),B=xyz(b),t=grid[a]/(grid[a]-grid[b]),p=A.map((v,i)=>v+(B[i]-v)*t),[x,y,z]=p,e=.001;let n=[field(x+e,y,z)-field(x-e,y,z),field(x,y+e,z)-field(x,y-e,z),field(x,y,z+e)-field(x,y,z-e)];const length=Math.hypot(...n);n=n.map(v=>v/length);const ds=shapes.map(s=>s.distance(x,y,z)),low=Math.min(...ds),bones=new Map();let total=0,cream=0,black=0;
  const primary=shapes[ds.indexOf(low)],primaryGroup=groups[primary.bone??primary.bones[0]];shapes.forEach((s,i)=>{const group=groups[s.bone??s.bones[0]],connected=group===primaryGroup||(group==='body'&&jointZone(primaryGroup,x,y,z))||(primaryGroup==='body'&&jointZone(group,x,y,z));const w=connected?Math.exp(-(ds[i]-low)/.055):0;total+=w;if(s.coat===1)cream+=w;if(s.coat===2)black+=w;for(const [b,f]of s.influence(x,y,z))bones.set(b,(bones.get(b)||0)+w*f);});
  const dominant=[...bones.entries()].sort((a,b)=>b[1]-a[1]).slice(0,4),sum=dominant.reduce((s,v)=>s+v[1],0);while(dominant.length<4)dominant.push([0,0]);skin.push(...dominant.map(v=>v[0]));weights.push(...dominant.map(v=>v[1]/sum));const fade=t=>{t=clamp(t);return t*t*(3-2*t);};const bib=type==='cat'?fade((.28-Math.abs(x-.015))/.11)*fade((z-.12)/.13)*fade((y-.48)/.20)*fade((2.03-y)/.18):0;coat.push(Math.max(cream/total,bib),black/total);position.push(...p);normal.push(...n);uv.push(x*.45+.5,y*.45);const result=position.length/3-1;edges.set(key,result);return result;
 }
 function triangle(a,b,c){const A=position.slice(a*3,a*3+3),B=position.slice(b*3,b*3+3),C=position.slice(c*3,c*3+3),ab=B.map((v,i)=>v-A[i]),ac=C.map((v,i)=>v-A[i]),cross=[ab[1]*ac[2]-ab[2]*ac[1],ab[2]*ac[0]-ab[0]*ac[2],ab[0]*ac[1]-ab[1]*ac[0]],dot=cross.reduce((s,v,i)=>s+v*normal[a*3+i],0);if(dot<0)index.push(a,c,b);else index.push(a,b,c);}
 const tets=[[0,5,1,6],[0,1,2,6],[0,2,3,6],[0,3,7,6],[0,7,4,6],[0,4,5,6]];
 for(let z=0;z<nz-1;z++)for(let y=0;y<ny-1;y++)for(let x=0;x<nx-1;x++){
  const cube=[id(x,y,z),id(x+1,y,z),id(x+1,y+1,z),id(x,y+1,z),id(x,y,z+1),id(x+1,y,z+1),id(x+1,y+1,z+1),id(x,y+1,z+1)];if(cube.every(i=>grid[i]>=0)||cube.every(i=>grid[i]<0))continue;
  for(const tet of tets){const inside=tet.map(i=>cube[i]).filter(i=>grid[i]<0),outside=tet.map(i=>cube[i]).filter(i=>grid[i]>=0);if(!inside.length||!outside.length)continue;if(inside.length===1||outside.length===1){const lone=inside.length===1?inside[0]:outside[0],other=inside.length===1?outside:inside;triangle(...other.map(i=>vertex(lone,i)));}else{const a=vertex(inside[0],outside[0]),b=vertex(inside[0],outside[1]),c=vertex(inside[1],outside[0]),d=vertex(inside[1],outside[1]);triangle(a,b,c);triangle(b,d,c);}}
 }
 // Smooth weights on the connected surface, not through nearby body parts.
 // This removes abrupt influence boundaries that stretch single triangles.
 if(type==='cat'){
  const n=position.length/3,B=spec.bones.length,neighbors=Array.from({length:n},()=>new Set());
  for(let i=0;i<index.length;i+=3)for(const [a,b]of [[index[i],index[i+1]],[index[i+1],index[i+2]],[index[i+2],index[i]]]){neighbors[a].add(b);neighbors[b].add(a);}
  let current=new Float32Array(n*B);for(let i=0;i<n;i++)for(let k=0;k<4;k++)current[i*B+skin[i*4+k]]+=weights[i*4+k];
  for(let pass=0;pass<24;pass++){const next=current.slice();for(let i=0;i<n;i++){
   const [x,y,z]=position.slice(i*3,i*3+3);if(y<1.25||y>2.25||Math.abs(x)<.17)continue;
   const list=[...neighbors[i]],count=list.length;for(let b=0;b<B;b++){let sum=0;for(const j of list)sum+=current[j*B+b];next[i*B+b]=.5*current[i*B+b]+.5*sum/count;}
  }current=next;}
  for(let i=0;i<n;i++){const sorted=spec.bones.map((_,b)=>[b,current[i*B+b]]).sort((a,b)=>b[1]-a[1]).slice(0,4),sum=sorted.reduce((s,v)=>s+v[1],0);for(let k=0;k<4;k++){skin[i*4+k]=sorted[k][0];weights[i*4+k]=sorted[k][1]/sum;}}
 }
 const arrays=[new Uint32Array([0x534b494e,1,position.length/3,index.length]),new Float32Array(position),new Float32Array(normal),new Float32Array(uv),new Float32Array(weights),new Float32Array(coat),new Uint16Array(skin),new Uint32Array(index)];const binary=Buffer.concat(arrays.map(a=>Buffer.from(a.buffer)));await writeFile(new URL(`../src/characters/assets/${type}-smooth.skin`,import.meta.url),binary);
 console.log(type,{vertices:position.length/3,triangles:index.length/3,bytes:binary.length});
}
