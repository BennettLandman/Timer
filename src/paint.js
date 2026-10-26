// One shared transparent WebGL surface renders continuous, painted 3D rigs.
// The timer and all poses use elapsed time, never a sequence of image frames.
import * as T from './characters/vendor/three.module.js';
import {createCat} from './characters/cat.js';
import {createFox,foxPose} from './characters/fox.js';
import {createAnimal,animalPose,animalAspect} from './characters/cast.js';
import {catPose,catWalkPose,catWorkPose,catIdlePose,catBoredPose} from './characters/rig.js';
import {species} from './art.js';
import {addBoredProps,hideBoredProps} from './characters/props.js';
export const painted={};
const models=new Map();let coreLoading,visitorLoading,renderer,stage,camera,current;
const image=async path=>{const img=new Image();img.src=new URL(`assets/${path}`,import.meta.url).href;await img.decode();return img;};
function studio(){
 if(renderer)return;
 renderer=new T.WebGLRenderer({alpha:true,antialias:true,preserveDrawingBuffer:true,powerPreference:'low-power'});
 renderer.setSize(640,640,false);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 stage=new T.Scene();camera=new T.OrthographicCamera(-3,3,4.4,-1.6,.1,30);camera.position.set(0,0,8);camera.lookAt(0,0,0);
 stage.add(new T.HemisphereLight('#fff4df','#777459',2.6));const key=new T.DirectionalLight('#fff0ce',3);key.position.set(-3,6,6);stage.add(key);const fill=new T.DirectionalLight('#c7d9d4',.8);fill.position.set(4,2,3);stage.add(fill);
 renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();painted.contextLost=true;});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{painted.contextLost=false;});
}
function select(model){if(current!==model){if(current)stage.remove(current);current=model;stage.add(model);}}
function render(c,model,x,y,unit,{direction=1,opacity=1,angle=0}={}){
 if(painted.contextLost)return;
 select(model);model.rotation.y=angle;renderer.render(stage,camera);
 c.save();c.globalAlpha*=opacity;c.translate(x,y);c.scale(direction,1);c.drawImage(renderer.domElement,-3*unit,-4.4*unit,6*unit,6*unit);c.restore();
}
export function loadPaintAssets(){return coreLoading ||= (async()=>{
 studio();const [glass,paint,cat,fox]=await Promise.all([image('glass.png'),image('paint.png'),createCat(),createFox()]);
 await addBoredProps(cat);painted.glass=glass;painted.paint=paint;models.set('cat',cat);models.set('fox',fox);painted.cat=true;
 // Compile the primary actor before enabling the timer.
 select(cat);renderer.compile(stage,camera);
})();}
export function loadVisitorAssets(){return visitorLoading ||= loadPaintAssets().then(async()=>{
 for(const type of species){if(!models.has(type))models.set(type,await createAnimal(type));
  select(models.get(type));await renderer.compileAsync(stage,camera);
  await new Promise(resolve=>setTimeout(resolve,0));
 }
});}
export function paintedAspect(type){return type==='cat'?.78:type==='fox'?1.8:animalAspect(type);}
export function visitorMotionTime(type,distance,width){
 const span=type==='cat'?2.35:type==='fox'?3.7:models.get(type)?.userData.span||3.45;
 const factor=type==='cat'?1:type==='fox'?1:type==='turtle'?.45:type==='rabbit'?1.05:.8;
 const speed=type==='cat'?.36/(.66*1.5):(models.get(type)?.userData.limbs?.[0]?.stride??.40)/(.68*1.5);
 return distance/(width/span*speed*factor);
}
export function drawPaintedAnimal(c,type,x,y,width,time=0,{direction=1,still=false,opacity=1}={}){
 const model=models.get(type)||models.get('fox');if(!model)return;
 hideBoredProps(model);model.position.z=0;if(model.userData.brush)model.userData.brush.visible=false;const t=still?0:time;
 if(type==='cat')catWalkPose(model,t);else if(type==='fox')foxPose(model,t);else animalPose(model,t);
 const span=type==='cat'?2.35:type==='fox'?3.7:model.userData.span||3.7;
 render(c,model,x,y,width/span,{direction,opacity,angle:type==='cat'?-.12:-.18});
}
// Compatibility for the fixed completion pose; there are no raster frames.
export function drawAnimation(c,name,x,y,width,progress){
 const cat=models.get('cat');if(!cat)return;
 hideBoredProps(cat);cat.position.z=0;if(cat.userData.brush)cat.userData.brush.visible=false;catPose(cat,0);cat.userData.joints.head.rotation.y=.16*Math.sin(Math.min(1,progress)*Math.PI);
 render(c,cat,x,y,width/2.35);
}
export function drawGlassCat(c,target,r,time,{brush=false,rest=false,engagement=1,moment=null}={}){
 const cat=models.get('cat');if(!cat)return null;
 const unit=r*.66,base=r*.99,home=-r*.1,work=target.x*.48-unit*.31,x=rest?home:home+(work-home)*engagement;
 cat.position.z=-.40;
 const modelTarget=new T.Vector3((target.x-x)/unit,(base-target.y)/unit,.64);
 const idle=rest?(moment?catBoredPose(cat,time,moment):(catIdlePose(cat,time),null)):null;
 const state=rest?null:catWorkPose(cat,modelTarget,time,engagement);
 const props=cat.userData.boredProps;if(props){props.watch.visible=true;props.snack.visible=!!(moment?.type==='snack'&&idle?.weight>.08);}
 let tool=cat.userData.brush;
 if(!tool){
  tool=new T.Group();const handle=new T.Mesh(new T.CylinderGeometry(.015,.015,.34,10),new T.MeshStandardMaterial({color:'#82603c',roughness:1}));handle.position.y=-.14;tool.add(handle);
  const bristles=new T.Mesh(new T.ConeGeometry(.042,.12,12),new T.MeshStandardMaterial({color:'#40392b',roughness:1}));bristles.rotation.z=Math.PI;bristles.position.y=-.36;tool.add(bristles);
  // The brush is held in the same hand as the contact locator. Its tip is
  // exactly at that locator, so paint and bristles cannot drift apart.
  tool.position.y=.42;cat.userData.contact.add(tool);cat.userData.brush=tool;
 }
 tool.visible=brush;
 render(c,cat,x,base,unit);
 if(!state)return null;
 return {x:x+state.tip.x*unit,y:base-state.tip.y*unit,error:state.error*unit,target:{...target},anatomy:state.anatomy};
}
export function drawPaintTexture(c,x,y,w,h,opacity=.25){c.save();c.globalAlpha*=opacity;c.drawImage(painted.paint,1010,12,420,190,x,y,w,h);c.restore();}
export function animationDiagnostics(){return {technique:'continuous 3D skin',models:models.size,contexts:1,renderer:renderer?.info,contextLost:!!painted.contextLost};}
