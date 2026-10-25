export const species = ['cat','dog','panda','turtle','pig','bear','cow','fish','eagle','turkey','raven','rabbit','fox','deer','horse','sheep','goat','elephant','giraffe','zebra','lion','penguin','owl','frog','hedgehog'];
export const themes = {
 green:{wash:'#e0e9d7',glass:'#cdddc3',ink:'#293e35',block:'#3e5d48',label:'PLENTY OF TIME'},
 yellow:{wash:'#f1e5c7',glass:'#e9d8a7',ink:'#55482f',block:'#a65d29',label:'WRAPPING UP'},
 red:{wash:'#eed4c9',glass:'#e8b8a9',ink:'#643a32',block:'#b64936',label:'FINAL MOMENTS'}
};
export function prepareCanvas(canvas){const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2);if(canvas.width!==Math.round(rect.width*dpr)||canvas.height!==Math.round(rect.height*dpr)){canvas.width=Math.round(rect.width*dpr);canvas.height=Math.round(rect.height*dpr);}const c=canvas.getContext('2d');c.setTransform(dpr,0,0,dpr,0,0);c.clearRect(0,0,rect.width,rect.height);return {c,w:rect.width,h:rect.height};}
export function paper(c,w,h){c.save();c.globalAlpha=.045;c.fillStyle='#293e35';for(let i=0;i<420;i++){let x=((i*73.713)%w),y=((i*41.917)%h);c.fillRect(x,y,.8,.8);}c.restore();}
