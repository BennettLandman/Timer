import {preserveJointVolume} from './skin-deformation.js';
import * as T from './vendor/three.module.js';
export async function smoothSkin(model,type,baseMaterial){
 const [buffer,spec]=await Promise.all([fetch(new URL(`./assets/${type}-smooth.skin`,import.meta.url)).then(r=>{if(!r.ok)throw new Error('Continuous skin unavailable');return r.arrayBuffer();}),fetch(new URL(`./assets/${type}-skin.spec.json`,import.meta.url)).then(r=>r.json())]);
 const header=new Uint32Array(buffer,0,4),count=header[2],indices=header[3];if(header[0]!==0x534b494e||header[1]!==1)throw new Error('Invalid continuous skin');let offset=16;const g=new T.BufferGeometry();
 for(const [name,size]of [['position',3],['normal',3],['uv',2],['skinWeight',4],['coat',2]]){g.setAttribute(name,new T.BufferAttribute(new Float32Array(buffer,offset,count*size),size));offset+=count*size*4;}
 g.setAttribute('skinIndex',new T.BufferAttribute(new Uint16Array(buffer,offset,count*4),4));offset+=count*8;g.setIndex(new T.BufferAttribute(new Uint32Array(buffer,offset,indices),1));g.computeBoundingSphere();
 const bones=spec.bones.map(name=>model.getObjectByName(name));if(bones.some(b=>!b))throw new Error('Continuous skin bone mismatch');
 const material=baseMaterial.clone();material.bumpScale=.022;const cream=new T.Color('#f2dfb5'),black=new T.Color('#302c24');material.onBeforeCompile=shader=>{baseMaterial.onBeforeCompile(shader);preserveJointVolume(shader);shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nattribute vec2 coat; varying vec2 skinCoat;').replace('#include <begin_vertex>','#include <begin_vertex>\nskinCoat=coat;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec2 skinCoat;').replace('#include <map_fragment>',`#include <map_fragment>
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${cream.r},${cream.g},${cream.b}),skinCoat.x);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(${black.r},${black.g},${black.b}),skinCoat.y);
 `);};material.customProgramCacheKey=()=>`continuous-volume-coat-${type}`;
 model.traverse(o=>{if(o.userData.continuous){o.layers.set(31);o.userData.replacedBySkin=true;}});
 const mesh=new T.SkinnedMesh(g,material);mesh.name=type+'-continuous-skin';model.add(mesh);model.updateMatrixWorld(true);mesh.bind(new T.Skeleton(bones));mesh.castShadow=mesh.receiveShadow=true;model.userData.continuousSkin=mesh;return mesh;
}
