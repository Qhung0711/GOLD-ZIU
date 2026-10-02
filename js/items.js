// Item definitions (add a new item = add one entry) + canvas drawing
const ITEMS={
GOLD_SMALL:{value:50,weight:1,r:14,kind:'gold'},GOLD_MEDIUM:{value:100,weight:2,r:22,kind:'gold'},GOLD_LARGE:{value:250,weight:4,r:36,kind:'gold'},
DIAMOND:{value:500,weight:.5,r:11,kind:'diamond'},ROCK_SMALL:{value:10,weight:3,r:18,kind:'rock'},ROCK_LARGE:{value:20,weight:6,r:34,kind:'rock'},
MONEY_BAG:{value:0,min:100,max:500,weight:2,r:20,kind:'bag'},
PIG:{value:20,weight:1.5,r:20,kind:'pig'},PIG_DIAMOND:{value:600,weight:.8,r:20,kind:'pigd'},TNT:{value:0,weight:1,r:18,kind:'tnt'}};
function makeItem(type,x,y){const d=ITEMS[type];let v=d.value;
if(d.min)v=Math.round((d.min+Math.random()*(d.max-d.min))/10)*10;
if(d.kind==='rock')v=Math.round(v*(1+.5*Store.d.up.rock)); // Rock Bonus
return{type,kind:d.kind,x,y,r:d.r,weight:d.weight,value:v,rot:Math.random()*6.28,t:Math.random()*6}}
function blob(ctx,x,y,r,rot,n,j){ctx.beginPath();for(let i=0;i<n;i++){const a=rot+i/n*6.283,k=r*(1-j*((i*7)%3)/3);ctx[i?'lineTo':'moveTo'](x+Math.cos(a)*k,y+Math.sin(a)*k)}ctx.closePath()}
function poly(c,p,f,st){c.beginPath();p.forEach((q,i)=>c[i?'lineTo':'moveTo'](q[0],q[1]));c.closePath();if(f){c.fillStyle=f;c.fill()}if(st)c.stroke()}
function star(c,x,y,k,a){c.fillStyle=`rgba(255,255,255,${a})`;c.beginPath();c.moveTo(x,y-k);c.quadraticCurveTo(x,y,x+k,y);c.quadraticCurveTo(x,y,x,y+k);c.quadraticCurveTo(x,y,x-k,y);c.quadraticCurveTo(x,y,x,y-k);c.fill()}
function drawPig(c,it,time,dia){const r=it.r,d=it.vx<0?-1:1,w=Math.sin(time*12+it.t)*2;c.save();c.translate(it.x,it.y);c.scale(d,1);c.lineWidth=1.6;c.strokeStyle='#7a2a40';
const E=(x,y,rx,ry,f)=>{c.fillStyle=f;c.beginPath();c.ellipse(x,y,rx,ry,0,0,6.283);c.fill();c.stroke()};
c.fillStyle='#e0708f';c.fillRect(-r*.5,r*.4,r*.28,r*.55+w);c.fillRect(r*.2,r*.4,r*.28,r*.55-w); // trotting legs
c.beginPath();c.arc(-r*1.05,-r*.1,r*.2,0,Math.PI*1.7);c.stroke(); // curly tail
E(0,0,r,r*.75,'#ffa6c0');E(r*.8,-r*.1,r*.55,r*.5,'#ffa6c0');
c.fillStyle='#ff8fb0';c.beginPath();c.moveTo(r*.6,-r*.5);c.lineTo(r*.5,-r*.95);c.lineTo(r*.9,-r*.55);c.closePath();c.fill();c.stroke(); // ear
E(r*1.3,-r*.05,r*.25,r*.22,'#ff7aa0');c.fillStyle='#7a2a40';c.fillRect(r*1.25,-r*.12,2,3);c.fillRect(r*1.33,-r*.12,2,3);
c.fillStyle='#222';c.beginPath();c.arc(r*.95,-r*.28,2,0,6.28);c.fill();
if(dia){const s=r*.55,y=-r*1.05;c.shadowColor='#5fe6ff';c.shadowBlur=14;poly(c,[[-s,y],[-s*.5,y-s*.6],[s*.5,y-s*.6],[s,y],[0,y+s*.9]],'#8fefff');c.shadowBlur=0;c.strokeStyle='#1f6f8a';poly(c,[[-s,y],[-s*.5,y-s*.6],[s*.5,y-s*.6],[s,y],[0,y+s*.9]],null,true);
const k=(Math.sin(time*6+it.t)+1)/2;star(c,s*.5,y-s*.5,3+k*6,.4+.6*k)} // diamond carried on its back
c.restore()}
function drawTnt(c,it,time){const{x,y,r}=it,w=r*1.5,h=r*1.7;c.lineWidth=2;c.strokeStyle='#3a0d08';
const g=c.createLinearGradient(x-w/2,0,x+w/2,0);g.addColorStop(0,'#e8493a');g.addColorStop(.5,'#ff7a5a');g.addColorStop(1,'#a32a1d');c.fillStyle=g;c.fillRect(x-w/2,y-h/2,w,h);c.strokeRect(x-w/2,y-h/2,w,h);
c.fillStyle='#4a2a1a';c.fillRect(x-w/2,y-h/2+3,w,4);c.fillRect(x-w/2,y+h/2-7,w,4);
c.fillStyle='#fff';c.fillRect(x-w/2+3,y-4,w-6,10);c.fillStyle='#c0392b';c.font='bold 9px Arial Black,Arial';c.textAlign='center';c.textBaseline='middle';c.fillText('TNT',x,y+1);
c.strokeStyle='#d8c090';c.beginPath();c.moveTo(x,y-h/2);c.quadraticCurveTo(x+4,y-h/2-6,x+8,y-h/2-8);c.stroke();star(c,x+8,y-h/2-8,4+Math.abs(Math.sin(time*15))*4,1)} // sparking fuse
function drawItem(c,it,time){const{x,y,r}=it;c.save();c.lineJoin='round';c.lineWidth=2;
if(it.kind==='pig'||it.kind==='pigd')drawPig(c,it,time,it.kind==='pigd');else if(it.kind==='tnt')drawTnt(c,it,time);else if(it.kind==='gold'){blob(c,x,y,r,it.rot,9,.25);const g=c.createRadialGradient(x-r*.35,y-r*.35,1,x,y,r*1.05);g.addColorStop(0,'#fff8b0');g.addColorStop(.45,'#ffd21a');g.addColorStop(1,'#b87800');
c.shadowColor='#ffd21a';c.shadowBlur=12;c.fillStyle=g;c.fill();c.shadowBlur=0;c.strokeStyle='#7a4d00';c.stroke();
c.strokeStyle='rgba(120,70,0,.45)';c.lineWidth=1.3;for(let i=0;i<3;i++){const a=it.rot+i*2.1;c.beginPath();c.moveTo(x,y);c.lineTo(x+Math.cos(a)*r*.8,y+Math.sin(a)*r*.8);c.stroke()} // facet creases
c.fillStyle='rgba(255,255,220,.6)';c.beginPath();c.ellipse(x-r*.35,y-r*.4,r*.25,r*.14,-.7,0,6.28);c.fill();
const s=(Math.sin(time*4+it.t)+1)/2;if(s>.6)star(c,x+r*.4,y-r*.4,r*.45*s,s)}
else if(it.kind==='rock'){blob(c,x,y,r,it.rot,8,.3);const g=c.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,'#c9ced6');g.addColorStop(1,'#565c66');c.fillStyle=g;c.fill();c.strokeStyle='#2d3036';c.stroke();
c.strokeStyle='rgba(30,30,40,.55)';c.lineWidth=1.5;c.beginPath();c.moveTo(x-r*.5,y-r*.2);c.lineTo(x-r*.1,y+r*.05);c.lineTo(x-r*.2,y+r*.4);c.moveTo(x+r*.1,y-r*.5);c.lineTo(x+r*.3,y-r*.1);c.stroke(); // cracks
c.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<6;i++)c.fillRect(x+Math.cos(it.rot*(i+2)*3)*r*.55,y+Math.sin(it.rot*(i+2)*5)*r*.5,2,2);
if(r>30){c.fillStyle='rgba(90,160,60,.6)';for(let i=0;i<4;i++)c.fillRect(x-r*.6+i*5,y+r*.45,4,3)} // moss on big rocks
c.fillStyle='rgba(255,255,255,.35)';c.beginPath();c.ellipse(x-r*.35,y-r*.4,r*.28,r*.14,-.7,0,6.28);c.fill()}
else if(it.kind==='bag'){c.beginPath();c.moveTo(x-r*.35,y-r*.7);c.bezierCurveTo(x-r*1.3,y-r*.1,x-r*1.1,y+r,x,y+r);c.bezierCurveTo(x+r*1.1,y+r,x+r*1.3,y-r*.1,x+r*.35,y-r*.7);c.closePath();
const g=c.createLinearGradient(x-r,y-r,x+r,y+r);g.addColorStop(0,'#d99a55');g.addColorStop(1,'#8a5526');c.fillStyle=g;c.fill();c.strokeStyle='#4a2a10';c.stroke();
poly(c,[[x-r*.35,y-r*.7],[x-r*.6,y-r*1.05],[x-r*.15,y-r*.9],[x,y-r*1.1],[x+r*.15,y-r*.9],[x+r*.6,y-r*1.05],[x+r*.35,y-r*.7]],'#b57a3a',true); // tuft
c.strokeStyle='#f0dca0';c.lineWidth=3;c.beginPath();c.moveTo(x-r*.4,y-r*.62);c.lineTo(x+r*.4,y-r*.62);c.stroke(); // rope tie
c.font='bold '+r*1.1+'px Arial Black,Arial';c.textAlign='center';c.textBaseline='middle';c.lineWidth=3;c.strokeStyle='#5a3300';c.strokeText('$',x,y+r*.3);c.fillStyle='#ffe14d';c.fillText('$',x,y+r*.3);
c.fillStyle='rgba(255,255,255,.2)';c.beginPath();c.ellipse(x-r*.5,y,r*.12,r*.4,.3,0,6.28);c.fill()}
else{const P=[[x-r*.55,y-r*.7],[x+r*.55,y-r*.7],[x+r,y-r*.15],[x,y+r],[x-r,y-r*.15]],a=[x-r*.3,y-r*.15],b=[x+r*.3,y-r*.15],m=[x,y+r];
c.shadowColor='#5fe6ff';c.shadowBlur=22;poly(c,P,'#8fefff');c.shadowBlur=0;
poly(c,[P[0],P[1],b,a],'#e2fcff');poly(c,[P[0],a,P[4]],'#5fd0ea');poly(c,[P[1],P[2],b],'#4fc3e0');poly(c,[P[4],a,m],'#37a9d0');poly(c,[a,b,m],'#7ee6ff');poly(c,[b,P[2],m],'#2f97c0');
c.strokeStyle='#1f6f8a';c.lineWidth=1.5;poly(c,P,null,true);
const s=(Math.sin(time*6+it.t)+1)/2,s2=(Math.sin(time*6+it.t+2)+1)/2;star(c,x+r*.5,y-r*.55,4+s*8,.4+.6*s);star(c,x-r*.5,y-r*.2,3+s2*5,.3+.6*s2)}
c.restore()}
