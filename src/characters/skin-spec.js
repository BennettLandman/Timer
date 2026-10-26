import * as T from './vendor/three.module.js';
// Extract the approved forms in their bind pose for offline surface fusion.
export function skinSpec(model,type){
 model.updateMatrixWorld(true);const bones=[];model.traverse(o=>{if(o.isBone)bones.push(o);});const inverse=model.matrixWorld.clone().invert(),shapes=[];
 function owner(o){while(o&&!o.isBone)o=o.parent;return o?bones.indexOf(o):0;}
 model.traverse(o=>{
  if(!o.userData.continuous)return;const matrix=inverse.clone().multiply(o.matrixWorld),color=o.material.color,coat=color.r>.5&&color.g>.5?1:color.r<.12?2:0;
  if(o.geometry.type==='SphereGeometry'){
   const p=new T.Vector3(),q=new T.Quaternion(),scale=new T.Vector3();matrix.decompose(p,q,scale);
   shapes.push({kind:'ellipsoid',p:p.toArray(),q:q.toArray(),scale:scale.toArray(),bone:owner(o.parent),coat:o.userData.coat??(type==='cat'?(o.material.map?0:1):coat)});
  }else if(o.userData.surfacePath){
   const path=o.userData.surfacePath.map(p=>p.clone().applyMatrix4(matrix).toArray());
   shapes.push({kind:'tube',path,boneFractions:o.userData.boneFractions,radii:o.userData.radii,bones:o.isSkinnedMesh?o.skeleton.bones.map(b=>bones.indexOf(b)):[owner(o.parent)],coat:0});
  }
 });return {type,bones:bones.map(b=>b.name),shapes};
}
