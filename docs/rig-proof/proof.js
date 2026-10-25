import * as T from './vendor/three.module.js';
import {createCat} from './cat.js';
const scene=new T.Scene();scene.background=new T.Color('#e7dfcc');
const camera=new T.OrthographicCamera(-1.85,1.85,1.85,-1.85,.1,30);camera.position.set(.4,1.7,9);camera.lookAt(0,1.50,0);
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1200,1200);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
scene.add(new T.HemisphereLight('#fff4df','#777459',2.6));const key=new T.DirectionalLight('#fff0ce',3.0);key.position.set(-3,6,6);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=key.shadow.camera.bottom=-4;key.shadow.camera.right=key.shadow.camera.top=4;key.shadow.normalBias=.03;key.shadow.radius=5;scene.add(key);const fill=new T.DirectionalLight('#c7d9d4',.8);fill.position.set(4,2,3);scene.add(fill);
const cat=await createCat();scene.add(cat);
const floor=new T.Mesh(new T.PlaneGeometry(200,200),new T.MeshStandardMaterial({color:'#ded3ba',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.015;floor.receiveShadow=true;scene.add(floor);
const visible=document.getElementById('portrait');visible.width=visible.height=1200;const p=visible.getContext('2d');
renderer.render(scene,camera);p.drawImage(renderer.domElement,0,0);const vignette=p.createRadialGradient(600,500,250,600,600,850);vignette.addColorStop(0,'#493d2100');vignette.addColorStop(1,'#493d212d');p.fillStyle=vignette;p.fillRect(0,0,1200,1200);
const glass=document.getElementById('glass');glass.width=glass.height=1200;const c=glass.getContext('2d');c.fillStyle='#e7dfcc';c.fillRect(0,0,1200,1200);
const r=540,cx=600,cy=600;c.shadowBlur=28;c.shadowOffsetY=18;c.shadowColor='#20382c38';c.beginPath();c.arc(cx,cy,r+15,0,Math.PI*2);c.fillStyle='#3a4c3d';c.fill();c.shadowColor='transparent';c.beginPath();c.arc(cx,cy,r+7,0,Math.PI*2);c.fillStyle='#cdbb91';c.fill();c.save();c.beginPath();c.arc(cx,cy,r,0,Math.PI*2);c.clip();c.fillStyle='#e6ddc8';c.fillRect(0,0,1200,1200);
// Same actual 3D model and still; diffuse it through the existing granular glass.
floor.visible=false;scene.background=new T.Color('#e6ddc8');cat.scale.setScalar(.85);cat.position.set(-.12,.25,0);renderer.render(scene,camera);
c.filter='blur(3px) saturate(.70)';c.globalAlpha=.82;c.drawImage(renderer.domElement,0,0);c.filter='none';c.globalAlpha=1;
const texture=new Image();texture.src='../../src/assets/glass.png';await texture.decode();c.globalAlpha=.20;c.globalCompositeOperation='multiply';c.drawImage(texture,60,60,1080,1080);c.globalCompositeOperation='source-over';c.globalAlpha=1;
// The claw contact in this proof is an appearance study; stroke-driven clock marks follow approval.
for(let i=0;i<60;i++){const a=i*Math.PI/30-Math.PI/2,major=i%5===0;c.strokeStyle='#3f5141';c.lineWidth=major?6:2.5;c.beginPath();c.moveTo(cx+Math.cos(a)*(r-17),cy+Math.sin(a)*(r-17));c.lineTo(cx+Math.cos(a)*(r-(major?57:33)),cy+Math.sin(a)*(r-(major?57:33)));c.stroke();}
c.font='25px Georgia';c.textAlign='center';c.textBaseline='middle';c.fillStyle='#405142b0';for(let i=1;i<=12;i++){const a=i*Math.PI/6-Math.PI/2;c.fillText(String(i*5),cx+Math.cos(a)*(r-90),cy+Math.sin(a)*(r-90));}
c.restore();
window.proof={ready:true,model:cat,renderer,jointNames:Object.keys(cat.userData.joints),triangles:renderer.info.render.triangles};document.getElementById('status').textContent='Still 01 · Painted 3D geometry · Awaiting appearance approval';
