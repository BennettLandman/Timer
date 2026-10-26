import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
for(const type of ['cat','fox'])test(`${type} body is one closed connected skin with normalized joint weights`,async()=>{
 const file=await readFile(new URL(`../docs/rig-proof/assets/${type}-smooth.skin`,import.meta.url));const buffer=file.buffer.slice(file.byteOffset,file.byteOffset+file.byteLength),header=new Uint32Array(buffer,0,4),n=header[2],length=header[3];const weights=new Float32Array(buffer,16+n*8*4,n*4),faces=new Uint32Array(buffer,16+n*14*4+n*8,length),edges=new Map(),parent=Array.from({length:n},(_,i)=>i);const find=i=>{while(i!==parent[i]){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 for(let i=0;i<n;i++){const sum=weights[i*4]+weights[i*4+1]+weights[i*4+2]+weights[i*4+3];assert.ok(Math.abs(sum-1)<1e-6);}
 for(let i=0;i<length;i+=3)for(const [a,b]of [[faces[i],faces[i+1]],[faces[i+1],faces[i+2]],[faces[i+2],faces[i]]]){assert.ok(a<n&&b<n);parent[find(a)]=find(b);const k=Math.min(a,b)*n+Math.max(a,b);edges.set(k,(edges.get(k)||0)+1);}
 assert.equal(new Set(parent.map((_,i)=>find(i))).size,1,'Body and limbs must share one surface');assert.ok([...edges.values()].every(n=>n===2),'Every surface edge must have two adjacent faces, including shoulders and hips');
});
