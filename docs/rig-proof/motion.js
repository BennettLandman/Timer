import * as T from './vendor/three.module.js';
import {createCat} from './cat.js';
import {createFox,foxPose} from './fox.js';
import {catPose} from './rig.js';
const scenes=[];let ready=false,playing=true,timeline=0,speed=1,last=null,frames=[];
function stage(id,span,lookY){
 const canvas=document.getElementById(id),scene=new T.Scene();scene.background=new T.Color('#e7dfcc');const camera=new T.OrthographicCamera(-span,span,span,-span,.1,30);camera.position.set(0,lookY,8);camera.lookAt(0,lookY,0);
 const renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(560,560,false);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
 scene.add(new T.HemisphereLight('#fff4df','#777459',2.6));const light=new T.DirectionalLight('#fff0ce',3);light.position.set(-3,6,6);scene.add(light);const fill=new T.DirectionalLight('#c7d9d4',.8);fill.position.set(4,2,3);scene.add(fill);const entry={scene,camera,renderer,canvas};scenes.push(entry);return entry;
}
try{
 const catStage=stage('cat',1.86,1.5),foxStage=stage('fox',2.2,.95);foxStage.camera.top=1.57;foxStage.camera.bottom=-1.57;foxStage.camera.updateProjectionMatrix();foxStage.renderer.setSize(560,400,false);foxStage.camera.position.set(0,1.6,8);foxStage.camera.lookAt(0,.95,0);
 const cat=await createCat(),fox=await createFox();catStage.scene.add(cat);foxStage.scene.add(fox);fox.rotation.y=-.22;
 const glassTexture=await new T.TextureLoader().loadAsync('../../src/assets/glass.png');glassTexture.colorSpace=T.SRGBColorSpace;
 const circle=new T.Mesh(new T.CircleGeometry(1.68,128),new T.MeshBasicMaterial({map:glassTexture,transparent:true,opacity:.17,depthWrite:false}));circle.position.set(0,1.5,.25);circle.renderOrder=3;catStage.scene.add(circle);
 const rim=new T.Mesh(new T.RingGeometry(1.69,1.73,128),new T.MeshBasicMaterial({color:'#4c6248',side:T.DoubleSide}));rim.position.set(0,1.5,.26);catStage.scene.add(rim);
 const ticks=[];for(let i=0;i<60;i++){const angle=i*Math.PI/30,outer=1.65,inner=i%5===0?1.54:1.59;const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(Math.sin(angle)*inner,1.5+Math.cos(angle)*inner,.27),new T.Vector3(Math.sin(angle)*outer,1.5+Math.cos(angle)*outer,.27)]),new T.LineBasicMaterial({color:'#3c5140',transparent:true}));ticks.push(line);catStage.scene.add(line);}
 const scratches=[];for(let i=0;i<3;i++){const line=new T.Line(new T.BufferGeometry().setFromPoints([new T.Vector3(),new T.Vector3()]),new T.LineBasicMaterial({color:'#646049',transparent:true,opacity:.8}));line.renderOrder=4;catStage.scene.add(line);scratches.push(line);}
 const floor=new T.Mesh(new T.PlaneGeometry(30,10),new T.MeshStandardMaterial({color:'#d9cfb7',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.01;foxStage.scene.add(floor);
 const shadowCanvas=document.createElement('canvas');shadowCanvas.width=shadowCanvas.height=64;const shadowContext=shadowCanvas.getContext('2d'),gradient=shadowContext.createRadialGradient(32,32,2,32,32,31);gradient.addColorStop(0,'rgba(45,40,25,.34)');gradient.addColorStop(1,'rgba(45,40,25,0)');shadowContext.fillStyle=gradient;shadowContext.fillRect(0,0,64,64);const shadowMap=new T.CanvasTexture(shadowCanvas);
 const footShadows=fox.userData.limbs.map(()=>{const mesh=new T.Mesh(new T.PlaneGeometry(.34,.24),new T.MeshBasicMaterial({map:shadowMap,transparent:true,depthWrite:false}));mesh.rotation.x=-Math.PI/2;mesh.position.y=.002;foxStage.scene.add(mesh);return mesh;});
 // Small fox uses the same rendered pose. No second model or WebGL context.
 const small=document.getElementById('fox-small');small.width=300;small.height=200;const smallCtx=small.getContext('2d');
 function draw(){const state=catPose(cat,timeline);foxPose(fox,timeline);fox.updateMatrixWorld(true);fox.userData.limbs.forEach((limb,i)=>{const p=limb.foot.getWorldPosition(new T.Vector3());footShadows[i].position.set(p.x,.002,p.z);footShadows[i].material.opacity=Math.max(.18,1-Math.max(0,p.y-.065)*7);});const a=Math.PI*.2,start=new T.Vector3(Math.sin(a)*1.68,1.5+Math.cos(a)*1.68,.28),end=new T.Vector3(Math.sin(a)*1.51,1.5+Math.cos(a)*1.51,.28);const progress=state.strokeStarted?state.progress:0;
  ticks[6].material.opacity=1-progress;for(let i=0;i<3;i++){const offset=(i-1)*.013,from=start.clone().add(new T.Vector3(Math.cos(a)*offset,-Math.sin(a)*offset,0)),to=from.clone().lerp(end.clone().add(new T.Vector3(Math.cos(a)*offset,-Math.sin(a)*offset,0)),progress);scratches[i].geometry.setFromPoints([from,to]);scratches[i].visible=progress>0;}
  for(const s of scenes)s.renderer.render(s.scene,s.camera);smallCtx.clearRect(0,0,300,200);smallCtx.drawImage(foxStage.canvas,0,0,300,200);
  document.getElementById('phase').textContent=state.phase;document.getElementById('position').textContent=(timeline%6).toFixed(1)+' s';if(document.activeElement!==document.getElementById('seek'))document.getElementById('seek').value=timeline%6;
  window.motion.state=state;
 }
 function setView(value){const quarter=value==='quarter';catStage.camera.position.set(quarter?2.2:0,1.65,8);catStage.camera.lookAt(0,1.5,0);foxStage.camera.position.set(quarter?2.8:0,1.6,8);foxStage.camera.lookAt(0,.95,0);}
 setView('quarter');document.getElementById('view').onchange=e=>{setView(e.target.value);draw();};
 window.motion={ready:true,cat,fox,stages:scenes,draw,seek(t){timeline=t;draw();},pause(){playing=false;document.getElementById('play').textContent='Play';},play(){playing=true;last=null;document.getElementById('play').textContent='Pause';},get time(){return timeline;},get frames(){return frames;}};
 document.getElementById('play').onclick=()=>playing?motion.pause():motion.play();document.getElementById('restart').onclick=()=>{timeline=0;draw();};document.getElementById('speed').onchange=e=>{speed=Number(e.target.value);};document.getElementById('seek').oninput=e=>{motion.pause();timeline=Number(e.target.value);draw();};
 document.addEventListener('visibilitychange',()=>{last=null;});draw();ready=true;
 function frame(now){if(last!==null&&playing&&!document.hidden){const dt=(now-last)/1000;timeline+=dt*speed;frames.push(dt*1000);if(frames.length>240)frames.shift();draw();}last=now;requestAnimationFrame(frame);}requestAnimationFrame(frame);
}catch(error){document.getElementById('error').textContent='The 3D preview could not load: '+error.message;throw error;}
