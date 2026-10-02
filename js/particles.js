// Particles + floating text with a hard cap (no lag)
const FX={list:[],MAX:300,
burst(x,y,n,col,sp=120,life=.6){for(let i=0;i<n&&this.list.length<this.MAX;i++){const a=Math.random()*6.283,s=sp*(.3+Math.random());this.list.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life,max:life,col,size:2+Math.random()*3,g:200})}},
text(x,y,txt,col='#ffe14d',fs=26,life=1.1){this.list.push({x,y,vx:0,vy:-50,life,max:life,txt,col,g:0,fs})},
confetti(){for(let i=0;i<120&&this.list.length<this.MAX;i++)this.list.push({x:Math.random()*800,y:-10,vx:(Math.random()-.5)*80,vy:60+Math.random()*120,life:2.5,max:2.5,col:`hsl(${Math.random()*360},90%,60%)`,size:6,g:0})},
update(dt){for(let i=this.list.length-1;i>=0;i--){const p=this.list[i];p.life-=dt;if(p.life<=0){this.list.splice(i,1);continue}p.vy+=p.g*dt;p.x+=p.vx*dt;p.y+=p.vy*dt}},
draw(ctx){for(const p of this.list){ctx.globalAlpha=Math.max(0,p.life/p.max);ctx.fillStyle=p.col;if(p.txt){ctx.font='bold '+p.fs+'px Arial Black,sans-serif';ctx.textAlign='center';ctx.strokeStyle='#000';ctx.lineWidth=4;ctx.strokeText(p.txt,p.x,p.y);ctx.fillText(p.txt,p.x,p.y)}else ctx.fillRect(p.x,p.y,p.size,p.size)}ctx.globalAlpha=1}};
