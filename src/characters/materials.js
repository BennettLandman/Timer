import * as T from './vendor/three.module.js';
let shared;
export function paintedMaterials(){return shared ||= buildMaterials();}
async function buildMaterials(){
 const texture=await new T.TextureLoader().loadAsync(new URL('./assets/tabby-paint.png',import.meta.url).href);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.anisotropy=4;
 const canvas=document.createElement('canvas');canvas.width=canvas.height=256;const ctx=canvas.getContext('2d');ctx.fillStyle='#999';ctx.fillRect(0,0,256,256);let seed=19;const random=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<6000;i++){const x=random()*256,y=random()*256;ctx.strokeStyle=`rgb(${Math.floor(90+random()*100)} ${Math.floor(90+random()*100)} 130)`;ctx.lineWidth=.6+random()*1.2;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+2+random()*4,y-3-random()*5);ctx.stroke();}
 const bump=new T.CanvasTexture(canvas);bump.wrapS=bump.wrapT=T.RepeatWrapping;bump.repeat.set(3,3);
 const material=(color,map=false)=>{
  const mat=new T.MeshStandardMaterial({color,map:map?texture:null,bumpMap:bump,bumpScale:.05,roughness:1,metalness:0});
  // Pigment variation is attached to the surface, not refreshed screen noise.
  mat.onBeforeCompile=shader=>{shader.vertexShader=shader.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 paintPosition;').replace('#include <begin_vertex>','#include <begin_vertex>\npaintPosition=position;');shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 paintPosition;').replace('#include <color_fragment>',`#include <color_fragment>
   vec3 q=paintPosition*180.0;
   float stroke=sin(q.x*.58+q.y*.27+sin(q.z*.3))*sin(q.y*.72-q.z*.21);
   float grain=fract(sin(dot(floor(q*2.0),vec3(12.9898,78.233,39.425)))*43758.5453);
   diffuseColor.rgb*=.91+.12*stroke+.14*grain;
  `);};return mat;
 };
 return {material};
}
