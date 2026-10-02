// Game state, update(dt), render(), loop
const Game={state:'MENU',n:1,level:null,items:[],earned:0,timeLeft:0,time:0,last:0,shake:0,fromComplete:false,dirt:[],streak:0,reached:false,prevHook:'IDLE',lastSec:0,lines:['Great catch!','Shiny!','Nice one, partner!','Keep digging!','Jackpot!'],clouds:[[100,40,1],[420,25,.7],[650,55,1.2]],
init(){this.cv=document.getElementById('c');this.ctx=this.cv.getContext('2d');Store.load();UI.init();
for(let i=0;i<70;i++)this.dirt.push([Math.random()*800,140+Math.random()*450,2+Math.random()*5,Math.random()<.15]);
const v=this.ctx.createRadialGradient(400,300,250,400,300,520);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.5)');this.vig=v; // vignette, built once
this.buildGround();this.resize();addEventListener('resize',()=>this.resize());
addEventListener('keydown',e=>{if(e.code==='Space'){e.preventDefault();this.go()}else if(e.code==='KeyD')this.dynamite();else if(e.code==='Escape')this.togglePause()});
this.cv.addEventListener('pointerdown',e=>{e.preventDefault();this.go()});
Hook.reset();this.items=Level.generate(1).items;UI.hud();UI.show('menu');
requestAnimationFrame(t=>{this.last=t;this.loop(t)})},
resize(){const app=document.getElementById('app'),h=innerHeight-['hud','prog','bar'].reduce((s,i)=>s+document.getElementById(i).offsetHeight,0);app.style.width=Math.min(innerWidth,h*4/3)+'px'},
startLevel(n){this.n=Math.min(n,LEVELS.length);const g=Level.generate(this.n);this.level=g.level;this.items=g.items;this.earned=0;this.timeLeft=g.level.time;this.streak=0;this.reached=false;this.lastSec=0;Hook.reset();Hook.swing=this.level.swing;FX.list.length=0;this.state='PLAYING';UI.hide();UI.hud();
FX.text(400,300,'LEVEL '+this.n,'#fff',42,2);if(this.level.mover)FX.text(400,345,'Moving treasures!','#ffd21a',22,2)},
go(){if(this.state==='PLAYING')Hook.shoot()},
dynamite(){if(this.state!=='PLAYING')return;const it=Hook.blast();if(!it)return;this.items.splice(this.items.indexOf(it),1);FX.burst(it.x,it.y,40,'#ff8a1f',260,.7);FX.burst(it.x,it.y,20,'#ffe14d',200,.5);Sfx.play('dynamite');this.shake=.3;UI.hud()},
togglePause(){if(this.state==='PLAYING'){this.state='PAUSED';UI.show('pause')}else if(this.state==='PAUSED'){this.state='PLAYING';UI.hide()}},
collect(it){this.items.splice(this.items.indexOf(it),1);let v=it.value;const dia=it.kind==='diamond'||it.kind==='pigd';
if(it.kind!=='rock'&&it.kind!=='pig'){this.streak++;if(this.streak>=2){const b=Math.round(v*.1*Math.min(this.streak-1,5)); // combo bonus for consecutive good catches
v+=b;FX.text(Hook.OX+100,150,'COMBO x'+this.streak+' +$'+b,'#ff6bd6')}}else this.streak=0;
this.earned+=v;Sfx.play(dia?'diamond':'gold');FX.text(Hook.OX,110,'+$'+v);FX.burst(Hook.OX,90,dia?30:14,dia?'#aef':'#ffe14d',180);if(it.weight>=4)this.shake=.2;
if(dia||it.weight>=4||this.streak>=3){FX.text(Hook.OX-55,20,this.lines[Math.random()*this.lines.length|0],'#fff3a0',18,1.8);for(let i=0;i<5;i++)FX.text(Hook.OX-70+Math.random()*40,50-Math.random()*20,'\u2605','#ffd21a',22,1.4)}},
explode(t){const q=[t],gone=new Set(); // TNT barrel: destroys everything within 100px, chains to other barrels
while(q.length){const a=q.pop();if(gone.has(a))continue;gone.add(a);FX.burst(a.x,a.y,35,'#ff8a1f',280,.7);FX.burst(a.x,a.y,18,'#ffe14d',200,.5);
for(const o of this.items)if(!gone.has(o)&&Math.hypot(o.x-a.x,o.y-a.y)<100){if(o.kind==='tnt')q.push(o);else{gone.add(o);FX.burst(o.x,o.y,10,'#999',120,.5)}}}
this.items=this.items.filter(o=>!gone.has(o));this.streak=0;this.shake=.5;Sfx.play('dynamite');FX.text(t.x,t.y-30,'BOOM!','#ff5030',34,1.2)},
end(){const L=this.level;if(this.earned>=L.target){this.state='COMPLETE';Store.d.money+=this.earned;Store.d.unlocked=Math.max(Store.d.unlocked,Math.min(this.n+1,LEVELS.length));
const st=this.earned>=L.target*1.5?3:this.earned>=L.target*1.2?2:1;Store.d.stars[this.n]=Math.max(Store.d.stars[this.n]||0,st);Store.save();FX.confetti();Sfx.play('win');
const last=this.n>=LEVELS.length;document.getElementById('cTitle').textContent=last?'YOU WIN! ALL LEVELS DONE':'LEVEL COMPLETE!';document.getElementById('cStars').textContent='★'.repeat(st)+'☆'.repeat(3-st);document.getElementById('cEarned').textContent=this.earned;document.getElementById('bNext').textContent=last?'REPLAY LEVEL 10':'NEXT LEVEL';UI.show('complete')}
else{this.state='TIMEUP';Sfx.play('lose');document.getElementById('tTarget').textContent=L.target;document.getElementById('tMoney').textContent=this.earned;UI.show('timeup')}
document.querySelectorAll('[data-act=share]').forEach(b=>b.textContent='SHARE SCORE')},
update(dt){if(this.state==='PAUSED')return;this.time+=dt;FX.update(dt);if(this.shake>0)this.shake-=dt;if(this.state!=='PLAYING')return;
this.timeLeft-=dt;for(const it of this.items)if(it.vx&&it!==Hook.item){it.x+=it.vx*dt;if(it.x<it.minX||it.x>it.maxX)it.vx=-it.vx}
Hook.update(dt,this.items,it=>this.collect(it),t=>this.explode(t));
if(Hook.state==='RETRACTING'&&this.prevHook!=='RETRACTING')this.streak=0; // missed -> combo lost
this.prevHook=Hook.state;
if(!this.reached&&this.earned>=this.level.target){this.reached=true;FX.text(400,300,'TARGET REACHED!','#7dff7d');FX.confetti();Sfx.play('win')}
const s=Math.ceil(this.timeLeft);if(s<=10&&s>0&&s!==this.lastSec){this.lastSec=s;Sfx.tone(880,.08)} // last-10s ticking
if(this.timeLeft<=0){this.timeLeft=0;this.end()}UI.hud()},
buildGround(){const o=document.createElement('canvas');o.width=800;o.height=600;const c=o.getContext('2d'),R=Math.random; // static layer drawn once (fast)
let g=c.createLinearGradient(0,110,0,600);g.addColorStop(0,'#b57a3c');g.addColorStop(.5,'#7a4a22');g.addColorStop(1,'#2a160a');c.fillStyle=g;c.fillRect(0,110,800,490);
for(let i=0;i<6;i++){const y0=170+i*80,w=x=>Math.sin(x*.02+i*2)*12;c.fillStyle=i%2?'rgba(0,0,0,.12)':'rgba(255,220,160,.07)';c.beginPath();c.moveTo(0,y0);for(let x=0;x<=800;x+=40)c.lineTo(x,y0+w(x));for(let x=800;x>=0;x-=40)c.lineTo(x,y0+40+w(x));c.closePath();c.fill()} // strata
for(let i=0;i<90;i++){const x=R()*800,y=130+R()*470,r=1.5+R()*4;c.fillStyle='rgba(0,0,0,.2)';c.beginPath();c.ellipse(x,y,r,r*.7,0,0,6.28);c.fill();c.fillStyle='rgba(255,230,180,.25)';c.beginPath();c.arc(x-r*.3,y-r*.3,r*.35,0,6.28);c.fill()} // pebbles
c.strokeStyle='rgba(60,30,10,.6)';c.lineWidth=2;c.lineCap='round';for(let i=0;i<7;i++){let x=R()*800,y=116;c.beginPath();c.moveTo(x,y);for(let k=0;k<5;k++){x+=(R()-.5)*30;y+=14+R()*10;c.lineTo(x,y)}c.stroke()} // roots
for(let i=0;i<4;i++){c.save();c.translate(60+R()*680,250+R()*320);c.rotate(R()*3);c.fillStyle='#e8dcc0';c.fillRect(-10,-2,20,4);for(const s of[-10,10]){c.beginPath();c.arc(s,-2.5,3,0,6.28);c.arc(s,2.5,3,0,6.28);c.fill()}c.restore()} // buried bones
c.fillStyle='#3fae2e';c.fillRect(0,104,800,14);c.fillStyle='#63d94a';c.fillRect(0,104,800,5);for(let x=0;x<800;x+=6){c.beginPath();c.moveTo(x,104);c.lineTo(x+3,96-R()*6);c.lineTo(x+6,104);c.fill()}
c.fillStyle='rgba(0,0,0,.25)';c.fillRect(0,118,800,6);this.ground=o},
bg(c,t){let g=c.createLinearGradient(0,0,0,110);g.addColorStop(0,'#2f8fff');g.addColorStop(1,'#ffd9a0');c.fillStyle=g;c.fillRect(0,0,800,110);
g=c.createRadialGradient(700,50,4,700,50,110);g.addColorStop(0,'rgba(255,245,170,1)');g.addColorStop(.25,'rgba(255,230,140,.6)');g.addColorStop(1,'rgba(255,230,140,0)');c.fillStyle=g;c.fillRect(560,0,240,110);
c.fillStyle='#8a6ab8';c.beginPath();c.moveTo(0,110);for(let x=0;x<=800;x+=80)c.lineTo(x+40,66+((x/80)%2)*20);c.lineTo(800,110);c.fill();
c.fillStyle='#5a3d8a';c.beginPath();c.moveTo(0,110);for(let x=0;x<=800;x+=100)c.lineTo(x+50,80+((x/100)%2)*18);c.lineTo(800,110);c.fill();
c.fillStyle='rgba(255,255,255,.9)';for(const k of this.clouds){const x=((k[0]+t*8*k[2])%960)-80;c.beginPath();c.arc(x,k[1],14*k[2],0,6.28);c.arc(x+16*k[2],k[1]-6,18*k[2],0,6.28);c.arc(x+34*k[2],k[1],13*k[2],0,6.28);c.fill()}
c.drawImage(this.ground,0,0);
for(const d of this.dirt)if(d[3]){const a=.4+.5*Math.sin(t*3+d[0]);c.fillStyle=`hsla(${d[0]%360},90%,75%,${a})`;c.fillRect(d[0]-1,d[1]-4,2,8);c.fillRect(d[0]-4,d[1]-1,8,2)}}, // twinkling buried gems
render(){const c=this.ctx;c.save();if(this.shake>0)c.translate((Math.random()-.5)*10,(Math.random()-.5)*10);
this.bg(c,this.time);Miner.draw(c,this.time,Hook.state);for(const it of this.items)drawItem(c,it,this.time);Hook.draw(c);FX.draw(c);c.restore();
c.fillStyle=this.vig;c.fillRect(0,0,800,600)},
loop(t){const dt=Math.min(.05,(t-this.last)/1000);this.last=t;this.update(dt);this.render();requestAnimationFrame(x=>this.loop(x))}};
