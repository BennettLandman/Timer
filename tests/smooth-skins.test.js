import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for(const type of ['cat','fox'])test(`${type} body is one closed connected skin with normalized joint weights`,async()=>{
 const file=await readFile(new URL(`../docs/rig-proof/assets/${type}-smooth.skin`,import.meta.url));const buffer=file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength),header=new Uint32Array(buffer,0,4),n=header[2],length=header[3];const weights=new Float32Array(buffer,16+n*8*4,n*4),faces=new Uint32Array(buffer,16+n*14*4+n*8,length),edges=new Map(),parent=Array.from({length:n},(_,i)=>i);const find=i=>{while(i!==parent[i]){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 for(let i=0;i<n;i++){const sum=weights[i*4]+weights[i*4+1]+weights[i*4+2]+weights[i*4+3];assert.ok(Math.abs(sum-1)<1e-6);}
 for(let i=0;i<length;i+=3)for(const [a,b]of [[faces[i],faces[i+1]],[faces[i+1],faces[i+2]],[faces[i+2],faces[i]]]){assert.ok(a<n&&b<n);parent[find(a)]=find(b);const k=Math.min(a,b)*n+Math.max(a,b);edges.set(k,(edges.get(k)||0)+1);}
 assert.equal(new Set(parent.map((_,i)=>find(i))).size,1,'Body and limbs must share one surface');assert.ok([...edges.values()].every(n=>n===2),'Every surface edge must have two adjacent faces, including shoulders and hips');
});
test('cat waist and hips are not pulled by either hand',async()=>{
 const data=await readFile(new URL('../docs/rig-proof/assets/cat-smooth.skin',import.meta.url)),spec=JSON.parse(await readFile(new URL('../docs/rig-proof/assets/cat-skin.spec.json',import.meta.url))),buffer=data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),n=new Uint32Array(buffer,0,4)[2],positions=new Float32Array(buffer,16,n*3),weights=new Float32Array(buffer,16+n*8*4,n*4),bones=new Uint16Array(buffer,16+n*14*4,n*4);let checked=0;
 for(let i=0;i<n;i++)if(Math.abs(positions[i*3])<.52&&positions[i*3+1]>.55&&positions[i*3+1]<1.20){checked++;for(let j=0;j<4;j++)if(/^(reach|rest)-/.test(spec.bones[bones[i*4+j]]))assert.ok(weights[i*4+j]<1e-7,'A nearby resting hand must not deform the waist');}assert.ok(checked>100);
});
test('adjacent cat elbow vertices have gradual joint influence transitions',async()=>{
 const data=await readFile(new URL('../docs/rig-proof/assets/cat-smooth.skin',import.meta.url)),buffer=data.buffer.slice(data.byteOffset,data.byteOffset+data.byteLength),header=new Uint32Array(buffer,0,4),n=header[2],p=new Float32Array(buffer,16,n*3),w=new Float32Array(buffer,16+n*8*4,n*4),skin=new Uint16Array(buffer,16+n*14*4,n*4),faces=new Uint32Array(buffer,16+n*14*4+n*8,header[3]);let checked=0,max=0;
 for(let i=0;i<faces.length;i+=3)for(const [a,b]of [[faces[i],faces[i+1]],[faces[i+1],faces[i+2]],[faces[i+2],faces[i]]]){const x=(p[a*3]+p[b*3])/2,y=(p[a*3+1]+p[b*3+1])/2;if(x<=.5||y<=1.3||y>=1.7)continue;checked++;const difference=new Map();for(let k=0;k<4;k++){difference.set(skin[a*4+k],(difference.get(skin[a*4+k])||0)+w[a*4+k]);difference.set(skin[b*4+k],(difference.get(skin[b*4+k])||0)-w[b*4+k]);}max=Math.max(max,[...difference.values()].reduce((sum,v)=>sum+Math.abs(v),0));}
 assert.ok(checked>100);assert.ok(max<.50,`Abrupt elbow influence boundary: ${max}`);
});
