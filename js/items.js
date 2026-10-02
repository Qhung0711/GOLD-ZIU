// Item definitions (add a new item = add one entry) + canvas drawing
const ITEMS={
GOLD_SMALL:{value:50,weight:1,r:14,kind:'gold'},GOLD_MEDIUM:{value:100,weight:2,r:22,kind:'gold'},GOLD_LARGE:{value:250,weight:4,r:36,kind:'gold'},
DIAMOND:{value:500,weight:.5,r:11,kind:'diamond'},ROCK_SMALL:{value:10,weight:3,r:18,kind:'rock'},ROCK_LARGE:{value:20,weight:6,r:34,kind:'rock'},
MONEY_BAG:{value:0,min:100,max:500,weight:2,r:20,kind:'bag'}};
function makeItem(type,x,y){const d=ITEMS[type];let v=d.value;
if(d.min)v=Math.round((d.min+Math.random()*(d.max-d.min))/10)*10;
if(d.kind==='rock')v=Math.round(v*(1+.5*Store.d.up.rock)); // Rock Bonus
return{type,kind:d.kind,x,y,r:d.r,weight:d.weight,value:v,rot:Math.random()*6.28,t:Math.random()*6}}
function blob(ctx,x,y,r,rot,n,j){ctx.beginPath();for(let i=0;i<n;i++){const a=rot+i/n*6.283,k=r*(1-j*((i*7)%3)/3);ctx[i?'lineTo':'moveTo'](x+Math.cos(a)*k,y+Math.sin(a)*k)}ctx.closePath()}
function drawItem(ctx,it,time){const{x,y,r}=it;ctx.save();ctx.shadowColor=it.kind==='diamond'?'#5fe6ff':it.kind==='gold'?'#ffd21a':'transparent';ctx.shadowBlur=it.kind==='diamond'?20:10;ctx.lineWidth=2;ctx.strokeStyle='#3b2a10';
if(it.kind==='gold'){blob(ctx,x,y,r,it.rot,9,.25);const g=ctx.createRadialGradient(x-r*.3,y-r*.3,1,x,y,r);g.addColorStop(0,'#fff59a');g.addColorStop(1,'#e0a100');ctx.fillStyle=g;ctx.fill();ctx.stroke()}
else if(it.kind==='rock'){blob(ctx,x,y,r,it.rot,8,.3);ctx.fillStyle='#8a8f98';ctx.fill();ctx.stroke();ctx.fillStyle='#b5bac2';ctx.beginPath();ctx.arc(x-r*.3,y-r*.3,r*.25,0,6.28);ctx.fill()}
else if(it.kind==='bag'){ctx.fillStyle='#a5672b';ctx.beginPath();ctx.arc(x,y+3,r,0,6.28);ctx.fill();ctx.stroke();ctx.fillRect(x-6,y-r-2,12,7);ctx.fillStyle='#ffe14d';ctx.font='bold '+r+'px Arial';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText('$',x,y+4)}
else{ctx.beginPath();ctx.moveTo(x,y-r);ctx.lineTo(x+r,y-r*.2);ctx.lineTo(x,y+r);ctx.lineTo(x-r,y-r*.2);ctx.closePath();ctx.fillStyle='#5fe6ff';ctx.fill();ctx.stroke();
const s=(Math.sin(time*6+it.t)+1)/2,k=3+s*6; // sparkle
ctx.fillStyle=`rgba(255,255,255,${.3+.7*s})`;ctx.fillRect(x+r*.5-1,y-r*.6-k,2,2*k);ctx.fillRect(x+r*.5-k,y-r*.6-1,2*k,2)}ctx.restore()}
