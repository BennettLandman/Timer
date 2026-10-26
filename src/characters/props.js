import * as T from './vendor/three.module.js';
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
 watch.visible=snack.visible=false;cat.userData.boredProps={watch,snack};
}
export function hideBoredProps(cat){if(cat.userData.boredProps)for(const prop of Object.values(cat.userData.boredProps))prop.visible=false;}
