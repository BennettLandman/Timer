import * as T from './vendor/three.module.js';
import {smooth} from './rig.js';
import {paintedMaterials} from './materials.js';
export async function addBoredProps(cat){
 const {material}=await paintedMaterials(),brass=material('#ae925d'),cream=material('#efddb5'),ink=material('#455245'),cracker=material('#c48a46'),edge=material('#a96c34');
 const watch=new T.Group();watch.name='A painter checking the time';
 const band=new T.Mesh(new T.TorusGeometry(.096,.015,8,32),brass);band.rotation.x=Math.PI/2;watch.add(band);
 const bezel=new T.Mesh(new T.CylinderGeometry(.085,.085,.025,32),brass);bezel.rotation.x=Math.PI/2;bezel.position.set(0,0,.104);watch.add(bezel);
 const face=new T.Mesh(new T.CircleGeometry(.071,32),cream);face.position.set(0,0,.119);watch.add(face);
 function hand(points,radius,mat,parent){const mesh=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),8,radius,6,false),mat);parent.add(mesh);}
 hand([[0,-.004,.123],[-.028,.027,.123]],.006,ink,watch);hand([[0,-.004,.123],[.035,.044,.123]],.004,ink,watch);
 cat.userData.joints['rest-3'].add(watch);
 // A tiny fish-shaped biscuit quietly echoes the original cat-and-fish palette.
 const snack=new T.Group();snack.name='A small fish biscuit';
 const body=new T.Mesh(new T.SphereGeometry(1,20,12),cracker);body.scale.set(.115,.060,.028);snack.add(body);
 const tail=new T.Mesh(new T.ConeGeometry(.062,.090,3),edge);tail.rotation.z=-Math.PI/2;tail.position.x=-.135;tail.scale.z=.45;snack.add(tail);
 const eye=new T.Mesh(new T.SphereGeometry(.009,10,8),ink);eye.position.set(.064,.014,.026);snack.add(eye);
 snack.position.set(0,.015,.035);cat.userData.contact.add(snack);
 const baton=new T.Group();hand([[0,.02,0],[.02,.54,0]],.012,cream,baton);cat.userData.contact.add(baton);
 const magnifier=new T.Group();hand([[0,0,0],[0,.17,0]],.018,brass,magnifier);
 const rim=new T.Mesh(new T.RingGeometry(.112,.137,40),brass);rim.position.y=.285;magnifier.add(rim);
 const lens=new T.Mesh(new T.CircleGeometry(.111,40),new T.MeshBasicMaterial({color:'#d4ddba',transparent:true,opacity:.18,depthWrite:false}));lens.position.set(0,.285,.002);magnifier.add(lens);cat.userData.contact.add(magnifier);
 const cup=new T.Group();const bowl=new T.Mesh(new T.CylinderGeometry(.105,.083,.16,24),cream);bowl.position.y=.06;cup.add(bowl);
 const tea=new T.Mesh(new T.CircleGeometry(.088,24),edge);tea.rotation.x=-Math.PI/2;tea.position.y=.142;cup.add(tea);
 const handle=new T.Mesh(new T.TorusGeometry(.060,.014,8,24),cream);handle.position.set(.12,.075,0);cup.add(handle);cat.userData.contact.add(cup);
 const red=material('#b95f42'),paper=material('#ead9b3'),wood=material('#b48343');
 const book=new T.Group();book.position.set(0,1.40,.65);const leaves=[];
 for(const side of [-1,1]){const leaf=new T.Group();leaf.rotation.y=side*.28;const cover=new T.Mesh(new T.BoxGeometry(.25,.30,.025),red);cover.position.x=side*.13;leaf.add(cover);
  const page=new T.Mesh(new T.BoxGeometry(.225,.27,.018),paper);page.position.set(side*.13,0,.020);leaf.add(page);
  for(let i=0;i<5;i++)hand([[side*.035,.09-i*.038,.031],[side*.21,.09-i*.038,.031]],.002,brass,leaf);
  book.add(leaf);leaves.push(leaf);
 }book.userData.page=leaves[1];cat.userData.joints.pelvis.add(book);
 const feather=new T.Group();hand([[0,.01,0],[.015,.43,0]],.007,cream,feather);
 for(let i=0;i<5;i++)for(const side of [-1,1]){const plume=new T.Mesh(new T.SphereGeometry(1,16,10),red);plume.position.set(side*.035,.13+i*.052,0);plume.scale.set(.052,.085,.016);plume.rotation.z=side*.38;feather.add(plume);}cat.userData.contact.add(feather);
 const ukulele=new T.Group();ukulele.position.set(.15,1.25,.63);ukulele.rotation.z=.95;
 for(const [y,xr,yr]of [[-.07,.18,.17],[.14,.145,.145]]){const lobe=new T.Mesh(new T.SphereGeometry(1,24,16),wood);lobe.position.y=y;lobe.scale.set(xr,yr,.065);ukulele.add(lobe);}
 const neck=new T.Mesh(new T.BoxGeometry(.060,.60,.040),edge);neck.position.set(0,.46,0);ukulele.add(neck);
 const hole=new T.Mesh(new T.CircleGeometry(.060,24),ink);hole.position.set(0,.07,.068);ukulele.add(hole);
 for(const x of [-.018,-.006,.006,.018])hand([[x,-.19,.072],[x,.75,.032]],.0025,cream,ukulele);
 for(let i=0;i<6;i++)hand([[-.030,.27+i*.07,.030],[.030,.27+i*.07,.030]],.003,brass,ukulele);
 cat.userData.joints.pelvis.add(ukulele);
 cat.userData.boredProps={watch,snack,baton,magnifier,cup,book,feather,ukulele};hideBoredProps(cat);
}
export function hideBoredProps(cat){if(cat.userData.boredProps)for(const prop of Object.values(cat.userData.boredProps))prop.visible=false;}
export function poseBoredProps(cat,moment,weight=0){
 hideBoredProps(cat);const props=cat.userData.boredProps;if(!props)return;props.watch.visible=true;
 const key={snack:'snack',conductor:'baton',detective:'magnifier',tea:'cup',book:'book',feather:'feather',ukulele:'ukulele'}[moment?.type];
 if(key)props[key].visible=weight>.08;
 const t=moment?.local||0;
 // The fingertips grasp these small objects; keep their handles upright as
 // the arm changes direction, rather than making the cup or lens tumble.
 const upright=cat.userData.contact.getWorldQuaternion(new T.Quaternion()).invert();
 for(const name of ['baton','magnifier','cup','feather'])props[name].quaternion.copy(upright);
 const tilt=-.18*smooth((t-2)/1.1)*(1-smooth((t-5.8)/1));
 props.cup.quaternion.multiply(new T.Quaternion().setFromAxisAngle(new T.Vector3(0,0,1),tilt));
 props.book.userData.page.rotation.y=.28+1.35*smooth((t-4)/.6)*(1-smooth((t-5)/.7));
}
