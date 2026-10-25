from PIL import Image
import numpy as np,json
p='src/assets/animation/manifest.json'; m=json.load(open(p))
for name in ['fox-walk','turkey-walk']:
 a=m[name];im=Image.open('src/assets/animation/'+name+'.webp').convert('RGBA'); w,h=a['frameWidth'],a['frameHeight']; size=(96,96); fs=[];adjust=[]
 # Register the detailed upper body, excluding moving feet, to frame zero.
 for i in range(24):
  f=im.crop((i%6*w,i//6*h,(i%6+1)*w,(i//6+1)*h)); fs.append(f)
 ref=np.asarray(fs[0].resize(size),dtype=float)/255; mask=ref[:,:,3].copy();mask[64:]=0
 reg=[]
 for f in fs:
  best=None
  for scale in np.arange(.94,1.061,.02):
   fw,fh=round(w*scale),round(h*scale);scaled=f.resize((fw,fh),Image.Resampling.BICUBIC)
   for dx in range(-12,13,3):
    for dy in range(-9,10,3):
     out=Image.new('RGBA',(w,h));out.alpha_composite(scaled,(round(a['anchorX']*(1-scale)+dx),round(a['anchorY']*(1-scale)+dy)))
     ar=np.asarray(out.resize(size),dtype=float)/255
     score=np.mean(((ar[:,:,:3]-ref[:,:,:3])**2).sum(2)*mask)+np.mean((ar[:,:,3]-ref[:,:,3])**2*mask)
     if best is None or score<best[0]:best=(score,dx,dy,float(scale),ar)
  _,dx,dy,scale,ar=best;adjust.append({'x':dx,'y':dy,'scale':round(scale,2)});reg.append(ar)
 # A closed tour through the actual painted leg positions avoids source-sheet jumps.
 features=[]
 for ar in reg:
  rgb=ar[:,:,:3]*ar[:,:,3,None]; features.append(np.concatenate([rgb.ravel()*.3,(ar[58:,:,3]*2).ravel()]))
 features=np.array(features);d=np.mean((features[:,None]-features[None,:])**2,axis=2)
 best=None
 for start in range(24):
  order=[start];left=set(range(24))-{start}
  while left:
   nxt=min(left,key=lambda j:d[order[-1],j]);order.append(nxt);left.remove(nxt)
  changed=True
  while changed:
   changed=False
   for i in range(23):
    for j in range(i+2,24):
     if i==0 and j==23:continue
     if d[order[i],order[i+1]]+d[order[j],order[(j+1)%24]]>d[order[i],order[j]]+d[order[i+1],order[(j+1)%24]]+1e-9:
      order[i+1:j+1]=reversed(order[i+1:j+1]);changed=True
  cost=sum(d[order[i],order[(i+1)%24]] for i in range(24))
  if best is None or cost<best[0]:best=cost,order
 order=best[1];k=order.index(0);order=order[k:]+order[:k];a['playbackOrder']=order;a['registration']=adjust
 print(name,order,'mean discontinuity',float(np.mean([d[i,(i+1)%24] for i in range(24)])),float(best[0]/24))
json.dump(m,open(p,'w'),separators=(',',':'))
