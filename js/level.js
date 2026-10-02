// 10 levels. Difficulty ramps via: target up, time down, faster hook swing, more rocks, fewer big golds,
// valuables placed deeper, and (from level 4) moving treasures.
const LEVELS=(()=>{const T=[500,1000,1500,2000,2400,2800,3200,3600,4000,4400],S=[60,60,55,55,50,50,50,45,45,45];
return T.map((t,i)=>({n:i+1,target:t,time:S[i],swing:+(1.2+.09*i).toFixed(2),mover:i>=3?Math.min(.3,.06*(i-2)):0}))})();
const Level={W:800,H:600,TOP:130,OX:400,OY:78,
generate(n){const L=LEVELS[Math.min(n,LEVELS.length)-1],k=n-1,u=Store.d.up,items=[];
const plan=[['GOLD_LARGE',Math.max(1,3-(k>>2))],['DIAMOND',1+u.lucky],['MONEY_BAG',2],['GOLD_MEDIUM',4],['GOLD_SMALL',6-Math.min(k,3)],['ROCK_LARGE',2+(k>>1)],['ROCK_SMALL',3+k]];
const deep={GOLD_LARGE:1,DIAMOND:1,MONEY_BAG:1};
const place=t=>{const r=ITEMS[t].r,y0=this.TOP+40+(deep[t]?k*14:0); // valuables sit deeper as levels rise
for(let a=0;a<80;a++){const x=40+Math.random()*720,y=y0+Math.random()*(this.H-30-y0);
if(Math.abs(x-this.OX)>(y-this.OY)*2.5)continue; // keep inside hook's cone
if(items.some(o=>Math.hypot(o.x-x,o.y-y)<o.r+r+6))continue;items.push(makeItem(t,x,y));return true}return false};
for(const[t,c]of plan)for(let i=0;i<c;i++)place(t);
let sum=items.filter(i=>i.kind!=='rock').reduce((s,i)=>s+i.value,0),g=0; // guarantee the level is winnable
while(sum<L.target*2.2&&g++<40){const b=items.length;place('GOLD_MEDIUM');if(items.length>b)sum+=items[b].value}
let mv=0;for(const it of items)if(L.mover&&mv<2+k&&(it.kind==='gold'&&it.r<30||it.kind==='diamond')&&Math.random()<L.mover){mv++; // moving treasures
it.vx=(Math.random()<.5?-1:1)*(30+k*8);it.minX=Math.max(30,it.x-80);it.maxX=Math.min(770,it.x+80)}
return{level:L,items}}};
