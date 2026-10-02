// Hook physics: IDLE -> SHOOTING -> (CAUGHT | RETRACTING) -> IDLE
const Hook={swing:1.3,OX:400,OY:78,MINLEN:34,state:'IDLE',angle:0,dir:1,len:34,item:null,speed:0,
reset(){this.state='IDLE';this.angle=0;this.dir=1;this.len=this.MINLEN;this.item=null},
tip(){return{x:this.OX+Math.sin(this.angle)*this.len,y:this.OY+Math.cos(this.angle)*this.len}},
shoot(){if(this.state!=='IDLE')return false;this.state='SHOOTING';Sfx.play('shoot');return true},
pullSpeed(it){const u=Store.d.up;let w=it.weight;if(w>=2)w*=Math.max(.4,1-.15*u.strength);return 420/(.6+.4*w)}, // heavy = slow
blast(){if(this.state!=='CAUGHT'||Store.d.up.dynamite<1)return null;Store.d.up.dynamite--;Store.save();const it=this.item;this.item=null;this.state='RETRACTING';this.speed=700;return it},
update(dt,items,onCollect){const M=1.309; // 75deg
if(this.state==='IDLE'){this.angle+=this.dir*this.swing*dt;if(this.angle>M){this.angle=M;this.dir=-1}if(this.angle<-M){this.angle=-M;this.dir=1}}
else if(this.state==='SHOOTING'){let rem=450*(1+.2*Store.d.up.power)*dt;
while(rem>0&&this.state==='SHOOTING'){const st=Math.min(rem,4);this.len+=st;rem-=st;const t=this.tip();
const hit=items.find(o=>Math.hypot(o.x-t.x,o.y-t.y)<=o.r+6); // circle collision, sub-stepped: no tunnelling
if(hit){this.item=hit;this.state='CAUGHT';this.speed=this.pullSpeed(hit);Sfx.play('catch')}
else if(t.x<0||t.x>800||t.y>600||this.len>760){this.state='RETRACTING';this.speed=450}}}
else{this.len-=this.speed*dt;if(this.item){const t=this.tip();this.item.x=t.x+Math.sin(this.angle)*this.item.r*.5;this.item.y=t.y+Math.cos(this.angle)*this.item.r*.5}
if(this.len<=this.MINLEN){this.len=this.MINLEN;const it=this.item;this.item=null;this.state='IDLE';if(it)onCollect(it)}}},
draw(ctx){const t=this.tip();ctx.save();ctx.lineCap='round';ctx.strokeStyle='#2b1d10';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(this.OX,this.OY);ctx.lineTo(t.x,t.y);ctx.stroke();
ctx.strokeStyle='#c9a86a';ctx.lineWidth=2;ctx.setLineDash([3,3]);ctx.stroke();ctx.setLineDash([]); // twisted rope
ctx.translate(t.x,t.y);ctx.rotate(-this.angle);
for(const s of[-1,1]){ctx.strokeStyle='#3a3f48';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(s*4,-1);ctx.quadraticCurveTo(s*14,4,s*7,15);ctx.stroke();ctx.strokeStyle='#cfd6df';ctx.lineWidth=3;ctx.stroke()} // metal prongs
const g=ctx.createRadialGradient(-2,-2,1,0,0,7);g.addColorStop(0,'#fff');g.addColorStop(1,'#6b7480');ctx.fillStyle=g;ctx.strokeStyle='#2b2f36';ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(0,0,6,0,6.28);ctx.fill();ctx.stroke();ctx.restore()}};
