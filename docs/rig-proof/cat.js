import * as T from './vendor/three.module.js';
const V=(x,y,z)=>new T.Vector3(x,y,z);
export async function createCat(){
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
 const fur=material('#ffffff',true),cream=material('#f2dfb5'),red=material('#c7321b'),dark=material('#30251b'),pink=material('#b67d60'),nose=material('#9e4934');
 const chest=fur.clone();chest.onBeforeCompile=shader=>{fur.onBeforeCompile(shader);shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',`#include <map_fragment>
 float bib=smoothstep(.38,.80,paintPosition.z)*(1.0-smoothstep(.40,.72,abs(paintPosition.x)));
 float edge=sin(paintPosition.y*80.0+paintPosition.x*30.0)*.06;
 bib=smoothstep(.12,.9,bib+edge);
 diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.89,.75,.50),bib);
 `);};
 const cat=new T.Group();cat.name='Painted tabby';const root=new T.Bone();root.name='pelvis';cat.add(root);const joints={pelvis:root};
 function shape(parent,mat,pos,size,rot=0){const mesh=new T.Mesh(new T.SphereGeometry(1,48,32),mat);mesh.position.set(...pos);mesh.scale.set(...size);mesh.rotation.z=rot;mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;}
 function curve(parent,points,radius,mat){const path=new T.CatmullRomCurve3(points.map(p=>V(...p)));const mesh=new T.Mesh(new T.TubeGeometry(path,48,radius,8,false),mat);parent.add(mesh);mesh.castShadow=true;return mesh;}
 function limb(name,points,radii,mat){
  const path=new T.CatmullRomCurve3(points.map(p=>V(...p))),segments=56,sides=16,frames=path.computeFrenetFrames(segments,false),vertices=[],normals=[],uv=[],indices=[],skinIndices=[],weights=[];
  for(let i=0;i<=segments;i++){const t=i/segments,center=path.getPointAt(t),s=t*(radii.length-1),j=Math.min(radii.length-2,Math.floor(s)),f=s-j,r=radii[j]*(1-f)+radii[j+1]*f;
   for(let k=0;k<=sides;k++){const a=k/sides*Math.PI*2,n=frames.normals[i].clone().multiplyScalar(Math.cos(a)).addScaledVector(frames.binormals[i],Math.sin(a));const p=center.clone().addScaledVector(n,r);vertices.push(p.x,p.y,p.z);normals.push(n.x,n.y,n.z);uv.push(k/sides,t);const b=t*(points.length-1),lo=Math.min(points.length-2,Math.floor(b)),mix=b-lo;skinIndices.push(lo,lo+1,0,0);weights.push(1-mix,mix,0,0);if(i<segments&&k<sides){const n=i*(sides+1)+k;indices.push(n,n+sides+1,n+1,n+1,n+sides+1,n+sides+2);}}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(vertices,3));g.setAttribute('normal',new T.Float32BufferAttribute(normals,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(skinIndices,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));g.setIndex(indices);
  const mesh=new T.SkinnedMesh(g,mat),bones=[];for(let i=0;i<points.length;i++){const bone=new T.Bone();bone.name=name+'-'+i;const position=path.getPointAt(i/(points.length-1));bone.position.copy(i?position.clone().sub(path.getPointAt((i-1)/(points.length-1))):position);if(i)bones[i-1].add(bone);else mesh.add(bone);bones.push(bone);joints[bone.name]=bone;}mesh.bind(new T.Skeleton(bones));mesh.castShadow=mesh.receiveShadow=true;root.add(mesh);return mesh;
 }
 shape(root,chest,[0,1.17,-.04],[.43,.77,.32],-.08);shape(root,chest,[.025,1.75,.0],[.37,.48,.29],-.12);

 limb('hind-left',[[-.26,.92,-.02],[-.32,.55,.02],[-.29,.20,.13],[-.32,.105,.28]],[.23,.20,.115,.095],fur);
 limb('hind-right',[[.25,.92,-.02],[.32,.55,.02],[.28,.17,.14],[.39,.105,.30]],[.22,.18,.105,.09],fur);
 shape(root,cream,[-.32,.12,.31],[.19,.13,.25],.1);shape(root,cream,[.40,.12,.33],[.18,.13,.24],-.1);
 limb('reach',[[.29,1.88,.03],[.51,2.14,.08],[.79,2.53,.14],[.91,2.74,.18]],[.18,.15,.10,.085],fur);
 shape(root,cream,[.93,2.76,.19],[.115,.16,.11],-.4);
 limb('rest',[[-.30,1.85,.04],[-.44,1.48,.11],[-.19,1.47,.27],[.03,1.61,.33]],[.175,.14,.11,.085],fur);shape(root,cream,[.05,1.63,.34],[.14,.11,.115],.5);
 const tailPoints=[[-.24,.87,-.19],[-.64,1.12,-.18],[-.91,1.56,-.16],[-1.05,2.04,-.14],[-.95,2.45,-.08],[-.70,2.62,-.03],[-.46,2.56,.02]];limb('tail',tailPoints,[.16,.15,.14,.13,.12,.115,.04],fur);
 const head=new T.Bone();head.name='head';head.position.set(.08,2.27,.02);head.rotation.set(-.03,-.12,.15);root.add(head);joints.head=head;
 shape(head,fur,[0,.08,0],[.43,.38,.34]);shape(head,fur,[-.24,-.05,.06],[.24,.22,.25]);shape(head,fur,[.24,-.05,.06],[.24,.22,.25]);
 // Rounded triangular ears, with sculpted front/back rather than flat cutouts.
 function ear(x,side){const shape2=new T.Shape();shape2.moveTo(-.15,0);shape2.quadraticCurveTo(-.12,.30,-.08,.41);shape2.quadraticCurveTo(.02,.38,.16,.03);shape2.quadraticCurveTo(.02,-.055,-.15,0);const g=new T.ExtrudeGeometry(shape2,{depth:.07,bevelEnabled:true,bevelSegments:4,steps:1,bevelSize:.045,bevelThickness:.04,curveSegments:24});const mesh=new T.Mesh(g,fur);mesh.position.set(x,.27,-.08);mesh.rotation.z=side*.19;head.add(mesh);shape(head,pink,[x-side*.01,.44,.042],[.082,.17,.025],side*.23);}
 ear(-.29,1);ear(.29,-1);
 shape(head,cream,[0,-.13,.255],[.27,.17,.11]);shape(head,cream,[-.12,-.095,.32],[.145,.105,.075]);shape(head,cream,[.12,-.095,.32],[.145,.105,.075]);shape(head,cream,[0,-.23,.24],[.17,.08,.12]);
 for(const x of [-.19,.19]){
  shape(head,dark,[x,.075,.297],[.122,.068,.040],x>0?.18:-.18);
  shape(head,material('#8d9c4b'),[x,.075,.335],[.098,.046,.026],x>0?.18:-.18);
  shape(head,dark,[x+.008,.077,.36],[.014,.043,.008]);shape(head,material('#fff0cf'),[x-.027,.099,.366],[.012,.012,.005]);
  curve(head,[[x-.12,.15,.30],[x,.18,.325],[x+.12,.15,.29]],.026,fur);
 }
 shape(head,nose,[0,-.095,.433],[.065,.041,.03]);curve(head,[[0,-.12,.439],[0,-.18,.42],[-.06,-.20,.40]],.008,dark);curve(head,[[0,-.18,.42],[.06,-.20,.40]],.008,dark);
 const whisker=new T.MeshStandardMaterial({color:'#e7d4b3',roughness:1});for(const side of [-1,1])for(let i=0;i<3;i++){curve(head,[[side*.16,-.14+i*.023,.411],[side*.36,-.14+(i-1)*.06,.43],[side*(.60-i*.03),-.13+(i-1)*.11,.36]],.0035,whisker);}
 const hat=new T.Group();hat.position.set(.015,.36,-.005);hat.rotation.z=-.20;head.add(hat);shape(hat,red,[0,.025,0],[.43,.16,.33]);shape(hat,red,[-.09,.09,-.02],[.39,.12,.29]);curve(hat,[[0,.18,0],[.02,.24,0],[.065,.26,.005]],.029,red);
 // Distinct toe separations and tiny ivory claw tips at the active hand.
 for(const footX of [-.32,.40])for(const offset of [-.06,.02,.09])curve(root,[[footX+offset,.13,.49],[footX+offset,.08,.50]],.007,dark);
 for(let i=0;i<3;i++)curve(root,[[.91+(i-1)*.052,2.85,.22],[.94+(i-1)*.052,2.92,.24]],.010,cream);
 cat.userData.joints=joints;return cat;
}
