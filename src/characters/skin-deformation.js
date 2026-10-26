// Rigid joint transforms are blended as dual quaternions to retain volume at
// large bends. A weighted matrix blend would flatten the elbow/shoulder.
export function preserveJointVolume(shader){
 shader.vertexShader=shader.vertexShader.replace('#include <common>',`#include <common>
 vec4 skinMultiply(vec4 a,vec4 b){return vec4(a.w*b.xyz+b.w*a.xyz+cross(a.xyz,b.xyz),a.w*b.w-dot(a.xyz,b.xyz));}
 vec4 skinRotation(mat4 m){
  float tr=m[0][0]+m[1][1]+m[2][2];vec4 q;
  if(tr>0.0){float s=sqrt(tr+1.0)*2.0;q=vec4((m[1][2]-m[2][1])/s,(m[2][0]-m[0][2])/s,(m[0][1]-m[1][0])/s,.25*s);}
  else if(m[0][0]>m[1][1]&&m[0][0]>m[2][2]){float s=sqrt(1.0+m[0][0]-m[1][1]-m[2][2])*2.0;q=vec4(.25*s,(m[1][0]+m[0][1])/s,(m[2][0]+m[0][2])/s,(m[1][2]-m[2][1])/s);}
  else if(m[1][1]>m[2][2]){float s=sqrt(1.0+m[1][1]-m[0][0]-m[2][2])*2.0;q=vec4((m[1][0]+m[0][1])/s,.25*s,(m[2][1]+m[1][2])/s,(m[2][0]-m[0][2])/s);}
  else{float s=sqrt(1.0+m[2][2]-m[0][0]-m[1][1])*2.0;q=vec4((m[2][0]+m[0][2])/s,(m[2][1]+m[1][2])/s,.25*s,(m[0][1]-m[1][0])/s);}return normalize(q);
 }
 vec3 skinRotate(vec4 q,vec3 v){return v+2.0*cross(q.xyz,cross(q.xyz,v)+q.w*v);}
 `).replace('#include <skinbase_vertex>',`#include <skinbase_vertex>
 #ifdef USE_SKINNING
 vec4 skinR=vec4(0.0),skinD=vec4(0.0),skinReference=skinRotation(boneMatX);
 for(int influence=0;influence<4;influence++){
  mat4 m=influence==0?boneMatX:influence==1?boneMatY:influence==2?boneMatZ:boneMatW;
  vec4 q=skinRotation(m);float w=skinWeight[influence]*(dot(q,skinReference)<0.0?-1.0:1.0);
  skinR+=w*q;skinD+=w*.5*skinMultiply(vec4(m[3].xyz,0.0),q);
 }
 float skinLength=length(skinR);skinR/=skinLength;skinD/=skinLength;skinD-=skinR*dot(skinR,skinD);
 #endif
 `).replace('#include <skinning_vertex>',`
 #ifdef USE_SKINNING
 vec3 skinPoint=(bindMatrix*vec4(transformed,1.0)).xyz;
 vec3 skinTranslation=2.0*skinMultiply(skinD,vec4(-skinR.xyz,skinR.w)).xyz;
 transformed=(bindMatrixInverse*vec4(skinRotate(skinR,skinPoint)+skinTranslation,1.0)).xyz;
 #endif
 `).replace('#include <skinnormal_vertex>',`
 #ifdef USE_SKINNING
 objectNormal=mat3(bindMatrixInverse)*skinRotate(skinR,mat3(bindMatrix)*objectNormal);
 #ifdef USE_TANGENT
 objectTangent=mat3(bindMatrixInverse)*skinRotate(skinR,mat3(bindMatrix)*objectTangent);
 #endif
 #endif
 `);
}
