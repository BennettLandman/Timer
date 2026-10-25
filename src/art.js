// Original vector artwork. All animals share one palette, stroke, and anatomy system.
// Continuous joint interpolation supplies a full pose on every display frame (no sprite stepping).
export const palette = { ink: '#293e35', cream: '#f6efd9', red: '#d95e43', blue: '#587f8d', ochre: '#d2a653', sage: '#869875', rose: '#cf9481' };
export const species = ['cat','dog','panda','turtle','pig','bear','cow','fish','eagle','turkey','raven','rabbit','fox','deer','horse','sheep','goat','elephant','giraffe','zebra','lion','penguin','owl','frog','hedgehog'];
const bird = new Set(['eagle','turkey','raven','penguin','owl']);
const colors = {cat:'ochre',dog:'rose',panda:'cream',turtle:'sage',pig:'rose',bear:'ochre',cow:'cream',fish:'red',eagle:'ochre',turkey:'rose',raven:'blue',rabbit:'cream',fox:'red',deer:'ochre',horse:'rose',sheep:'cream',goat:'cream',elephant:'blue',giraffe:'ochre',zebra:'cream',lion:'ochre',penguin:'blue',owl:'ochre',frog:'sage',hedgehog:'rose'};
function path(c, points, fill, stroke = palette.ink, width = 2.4) { c.beginPath(); for (const [op,...a] of points) c[op](...a); if(fill){ c.fillStyle=fill; c.fill(); } if(stroke){c.strokeStyle=stroke;c.lineWidth=width;c.stroke();} }
function ellipse(c,x,y,rx,ry,fill,stroke=palette.ink,w=2.4){c.beginPath();c.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.lineWidth=w;c.strokeStyle=stroke;c.stroke();}}
function line(c,coords,color=palette.ink,width=2.4){path(c,[['moveTo',...coords[0]],...coords.slice(1).map(p=>['lineTo',...p])],null,color,width);}
function poly(c,pts,fill,stroke=palette.ink){path(c,[['moveTo',...pts[0]],...pts.slice(1).map(p=>['lineTo',...p]),['closePath']],fill,stroke);}
function curve(c,from,control,to,color,width){path(c,[['moveTo',...from],['quadraticCurveTo',...control,...to]],null,color,width);}
export function drawAnimal(c,type,x,y,scale=1,time=0,options={}){
 c.save(); c.translate(x,y); c.scale(scale*(options.direction || 1),scale);
 const pose=options.pose||{};c.translate(0,-(pose.pounce||0)*18);c.scale(1+(pose.stretch||0)*.22,1-(pose.stretch||0)*.18-(pose.nap||0)*.38);c.rotate(-(pose.nap||0)*.08);c.lineCap='round';c.lineJoin='round';
 const motion=options.still ? 0 : time*Math.PI*2/0.9; const stride=options.still ? 0 : Math.sin(motion); const lift=options.still ? 0 : Math.cos(motion*2)*1.3;
 c.translate(0,lift); const col=palette[colors[type]] || palette.ochre;
 if(type==='fish'){
   c.rotate(stride*.12);poly(c,[[-27,-35],[-62,-57],[-56,-22]],col);ellipse(c,0,-38,39,22,col);poly(c,[[-2,-59],[14,-76],[22,-55]],col);curve(c,[-4,-32],[8,-50],[14,-28],palette.ink,2);ellipse(c,25,-43,2.4,2.4,palette.ink,null);line(c,[[32,-33],[39,-35]]);line(c,[[-18,-49],[-24,-40],[-18,-29]],palette.cream,2);c.restore();return;
 }
 if(bird.has(type)){
  if(type==='turkey')for(let i=0;i<6;i++){c.save();c.translate(-23,-44);c.rotate(-.7+i*.24);ellipse(c,-20,0,13,38,i%2?palette.ochre:palette.red);c.restore();}
  ellipse(c,0,-40,24,33,col); if(type==='penguin')ellipse(c,5,-34,14,24,palette.cream,null);
  const flap=options.still?0:Math.sin(motion)*9;
  path(c,[['moveTo',-12,-58],['quadraticCurveTo',-49,-40-flap,-22,-15],['quadraticCurveTo',0,-26,-12,-58]],type==='raven'?palette.ink:col);
  ellipse(c,10,-76,type==='owl'?24:17,type==='owl'?22:17,col);
  if(type==='owl'){ellipse(c,1,-78,8,10,palette.cream);ellipse(c,19,-78,8,10,palette.cream);poly(c,[[-10,-91],[-12,-105],[0,-96]],col);poly(c,[[23,-96],[33,-104],[30,-88]],col);}
  if(type==='eagle') {ellipse(c,10,-76,17,16,palette.cream);}
  poly(c,[[22,-77],[38,-71],[23,-65]],palette.ochre);ellipse(c,type==='owl'?1:15,-79,2.5,2.5,palette.ink,null);if(type==='owl')ellipse(c,19,-79,2.5,2.5,palette.ink,null);
  line(c,[[-8,-12],[-11+stride*5,-3],[-2+stride*5,-3]],palette.ink,3);line(c,[[12,-12],[15-stride*5,-2],[25-stride*5,-2]],palette.ink,3);c.restore();return;
 }
 if(type==='frog'){
  ellipse(c,-21,-15,20,14,col);ellipse(c,22,-15,20,14,col);ellipse(c,0,-35,28,29,col);ellipse(c,-15,-61,10,11,col);ellipse(c,15,-61,10,11,col);ellipse(c,-15,-62,3,4,palette.ink,null);ellipse(c,15,-62,3,4,palette.ink,null);curve(c,[-13,-40],[0,-30],[13,-40],palette.ink,2);line(c,[[-15,-34],[-25-stride*4,-5],[-15,-3]],palette.ink,4);line(c,[[15,-34],[25+stride*4,-5],[35,-3]],palette.ink,4);c.restore();return;
 }
 // Tail and far legs precede the body; joint motion is smooth and phase shifted.
 if(!['turtle','hedgehog','elephant'].includes(type)&&!options.working){
  const tailY=type==='cat'?-72:-48;
  path(c,[['moveTo',-29,-43],['bezierCurveTo',-67,-51,-65+stride*4,tailY-20,-48+stride*5,tailY]],null,col,type==='fox'?17:7);
  if(type==='fox')path(c,[['moveTo',-51,-66],['quadraticCurveTo',-57,-72,-48,-78]],null,palette.cream,10);
 }
 for(let i=0;i<4;i++){
  if(options.push&&i===3)continue;
  const base=i<2?-22:24; const wave=options.still?0:Math.sin(motion+(i%2)*Math.PI+(i<2?0:Math.PI))*9;
  const end=base+wave+(options.push?9:0);const top=-27;const length=type==='giraffe'?38:27;
  line(c,[[base+(i%2?5:-4),top],[base+wave*.45,top+length*.6],[end,top+length]],i%2?palette.ink:col,i%2?7:9);
  line(c,[[end-2,top+length],[end+6,top+length]],palette.ink,3);
 }
 if(type==='hedgehog'){
  const pts=[];for(let i=0;i<=20;i++){const a=Math.PI+i*Math.PI/20;const r=i%2?42:35;pts.push([Math.cos(a)*r,Math.sin(a)*r-25]);}poly(c,pts,palette.ochre);
 }
 ellipse(c,0,-37,type==='elephant'?40:35,type==='turtle'?21:25,col);
 if(type==='turtle'){
  ellipse(c,-2,-39,34,25,palette.sage);poly(c,[[-17,-51],[1,-59],[18,-48],[18,-30],[0,-20],[-17,-32]],null);line(c,[[-17,-51],[-29,-58]]);line(c,[[18,-48],[29,-55]]);line(c,[[18,-30],[31,-23]]);
 }
 if(type==='sheep')for(let i=0;i<9;i++){const a=i*Math.PI*2/9;ellipse(c,Math.cos(a)*28,-38+Math.sin(a)*17,13,12,col);}
 if(type==='zebra')for(let i=-2;i<=2;i++){path(c,[['moveTo',i*12-7,-56],['quadraticCurveTo',i*12+10,-37,i*12-3,-18]],null,palette.ink,4);}
 if(type==='cow'||type==='giraffe'){for(const [px,py,rx,ry] of [[-17,-43,9,7],[8,-29,7,9],[21,-47,6,5]])ellipse(c,px,py,rx,ry,type==='cow'?palette.ink:palette.red,null);}
 if(type==='panda'){ellipse(c,-25,-40,10,21,palette.ink,null);ellipse(c,25,-36,10,22,palette.ink,null);}
 const neck=type==='giraffe'?38:type==='horse'?12:0;
 if(neck){path(c,[['moveTo',15,-40],['lineTo',19,-70-neck],['quadraticCurveTo',32,-83-neck,39,-65-neck],['lineTo',33,-35]],col);if(type==='giraffe'){ellipse(c,28,-82,5,6,palette.red,null);ellipse(c,26,-61,4,6,palette.red,null);}}
 const hx=type==='turtle'?40:type==='elephant'?33:29;const hy=-62-neck;
 if(type==='lion'){ellipse(c,hx,hy,28,29,palette.red);}
 if(['cat','fox'].includes(type)){poly(c,[[hx-19,hy-10],[hx-15,hy-36],[hx-1,hy-17]],col);poly(c,[[hx+4,hy-18],[hx+20,hy-31],[hx+20,hy-5]],col);}
 else if(type==='rabbit'){ellipse(c,hx-12,hy-27,7,28,col);c.save();c.translate(hx+8,hy-25);c.rotate(.2+stride*.05);ellipse(c,0,0,7,26,col);c.restore();}
 else if(type==='elephant'){ellipse(c,hx-10,hy+2,24,27,col);}
 else if(type!=='turtle'&&type!=='hedgehog'){
   ellipse(c,hx-13,hy-16,type==='dog'?10:7,type==='dog'?19:8,type==='panda'?palette.ink:col);
   if(type!=='dog')ellipse(c,hx+13,hy-16,7,8,type==='panda'?palette.ink:col);
 }
 ellipse(c,hx,hy,type==='horse'?15:type==='turtle'?14:21,type==='horse'?24:type==='turtle'?12:20,col);
 if(type==='dog')ellipse(c,hx+17,hy+7,14,9,col);
 if(type==='pig'){ellipse(c,hx+12,hy+7,13,9,palette.rose);ellipse(c,hx+9,hy+6,1.8,2.7,palette.ink,null);ellipse(c,hx+17,hy+6,1.8,2.7,palette.ink,null);}
 if(type==='elephant')path(c,[['moveTo',hx+15,hy+3],['bezierCurveTo',hx+35,hy+25,hx+25,hy+48,hx+46,hy+29]],null,col,13);
 if(type==='panda'){ellipse(c,hx-8,hy-1,6,8,palette.ink,null);ellipse(c,hx+11,hy-1,6,8,palette.ink,null);}
 if(['deer','goat','cow','giraffe'].includes(type)){
  line(c,[[hx-9,hy-17],[hx-14,hy-34],[hx-24,hy-40]],palette.ink,3);line(c,[[hx+9,hy-17],[hx+13,hy-35],[hx+21,hy-40]],palette.ink,3);
  if(type==='deer'){line(c,[[hx-15,hy-32],[hx-8,hy-41]]);line(c,[[hx+14,hy-31],[hx+8,hy-42]]);}
  if(type==='goat')poly(c,[[hx-4,hy+15],[hx+2,hy+33],[hx+10,hy+16]],col);
 }
 if(type==='horse'){path(c,[['moveTo',hx-15,hy-20],['quadraticCurveTo',hx-28,hy-8,hx-17,hy+19]],null,palette.ink,7);}
 // Small, calm eyes and confident linework; no oversized cartoon features.
 const eyeY=hy-3;if((pose.nap||0)>.3){line(c,[[hx+5,eyeY],[hx+11,eyeY]],palette.ink,1.8);}else ellipse(c,hx+8,eyeY+(options.guilty?3:0),2.1,2.1,type==='panda'?palette.cream:palette.ink,null);
 if(type==='cat'||type==='lion'||type==='fox'){
  if((pose.nap||0)>.3){line(c,[[hx-10,eyeY],[hx-4,eyeY]],palette.ink,1.8);}else ellipse(c,hx-7,eyeY+(options.guilty?3:0),2.1,2.1,palette.ink,null);if(options.guilty){line(c,[[hx-12,hy-7],[hx-3,hy-4]],palette.ink,1.5);line(c,[[hx+4,hy-4],[hx+13,hy-7]],palette.ink,1.5);}poly(c,[[hx-2,hy+5],[hx+4,hy+5],[hx+1,hy+9]],palette.ink,null);curve(c,[hx-5,hy+12],[hx+1,hy+(options.guilty?9:16)],[hx+7,hy+12],palette.ink,1.5);
  line(c,[[hx-14,hy+6],[hx-29,hy+2]],palette.ink,1.2);line(c,[[hx-14,hy+10],[hx-29,hy+12]],palette.ink,1.2);line(c,[[hx+14,hy+6],[hx+28,hy+2]],palette.ink,1.2);
 }
 if(type==='cat'){
  c.save();c.translate(hx-1,hy-22);c.rotate(options.guilty?-.24:-.1);ellipse(c,0,-5,24,9,palette.red);line(c,[[-20,1],[19,1]],palette.ink,3);line(c,[[3,-13],[6,-18]],palette.ink,3);c.restore();
 }
 if(options.push){line(c,[[19,-33],[45+stride*2,-20],[55,-25]],col,9);line(c,[[48,-25],[57,-25]],palette.ink,3);}
 c.restore();
}
export function drawFishBowl(c,x,y,s=1,time=0){
 c.save();c.translate(x,y);c.scale(s,s);path(c,[['moveTo',-52,-87],['bezierCurveTo',-82,-30,-62,-2,0,0],['bezierCurveTo',62,-2,82,-30,52,-87],['closePath']], '#d8e2d0',palette.ink,2);ellipse(c,0,-87,52,9,null,palette.ink,2);curve(c,[-60,-60],[0,-50],[60,-60],palette.blue,1.5);drawAnimal(c,'fish',Math.sin(time*.4)*9,-1,.62,time*.3,{direction:-1});line(c,[[-16,-8],[-24,-39],[-14,-50]],palette.sage,3);line(c,[[-24,-33],[-39,-40]],palette.sage,3);c.restore();
}
export const themes = {
 green:{wash:'#e0e9d7',glass:'#cdddc3',ink:'#293e35',block:'#35483e',label:'PLENTY OF TIME'},
 yellow:{wash:'#f1e5c7',glass:'#e9d8a7',ink:'#55482f',block:'#a65d29',label:'WRAPPING UP'},
 red:{wash:'#eed4c9',glass:'#e8b8a9',ink:'#643a32',block:'#b64936',label:'FINAL MOMENTS'}
};
export function prepareCanvas(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);}const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,rect.width,rect.height);return {c,w:rect.width,h:rect.height};}
export function paper(c,w,h){c.save();c.globalAlpha=.045;c.fillStyle=palette.ink;for(let i=0;i<420;i++){let x=((i*73.713)%w),y=((i*41.917)%h);c.fillRect(x,y,.8,.8);}c.restore();}
