// Original adult cartoon miner girl (glam, non-explicit). Drawn in local units (~100 tall), scaled to fit.
// If assets/miner.png exists it is used instead; otherwise this vector drawing is the fallback.
const Miner={img:null,ok:false,
draw(c,t,state){if(!this.ok)return this.vec(c,t,state);
const bob=state==='CAUGHT'||state==='RETRACTING'?Math.sin(t*25)*2:Math.sin(t*2),h=88,w=this.img.width/this.img.height*h;
c.drawImage(this.img,Hook.OX-55-w/2,82-h+bob,w,h);this.reel(c)},
reel(c){const x=Hook.OX;c.save();c.translate(x,72);c.rotate(Hook.len*.08);c.fillStyle='#555';c.strokeStyle='#222';c.lineWidth=2;c.beginPath();c.arc(0,0,13,0,6.28);c.fill();c.stroke();c.strokeStyle='#999';c.lineWidth=2;for(let i=0;i<4;i++){c.rotate(Math.PI/4);c.beginPath();c.moveTo(-11,0);c.lineTo(11,0);c.stroke()}c.fillStyle='#ffd21a';c.beginPath();c.arc(0,0,4,0,6.28);c.fill();c.restore();
const g=c.createLinearGradient(0,78,0,86);g.addColorStop(0,'#b27a3c');g.addColorStop(1,'#6a4220');c.fillStyle=g;c.strokeStyle='#3a2210';c.fillRect(x-70,78,90,8);c.strokeRect(x-70,78,90,8);c.beginPath();for(let k=-50;k<20;k+=22){c.moveTo(x+k,78);c.lineTo(x+k,86)}c.stroke()},
vec(c,t,state){const reel=state==='CAUGHT'||state==='RETRACTING',b=reel?Math.sin(t*25)*1.5:Math.sin(t*2)*.6,sw=Math.sin(t*3)*1.5,blink=(t%3.5)>3.4;
const skin='#f2b58a',ink='#3a2010',RED='#d93a2b',BLUE='#2b5fc0',E=(x,y,rx,ry,f)=>{c.fillStyle=f;c.beginPath();c.ellipse(x,y,rx,ry,0,0,6.283);c.fill()};
const limb=(x1,y1,x2,y2)=>{c.lineCap='round';c.strokeStyle=ink;c.lineWidth=9;c.beginPath();c.moveTo(x1,y1);c.lineTo(x2,y2);c.stroke();c.strokeStyle=RED;c.lineWidth=7;c.stroke();c.strokeStyle=ink;c.lineWidth=1.4};
c.save();c.translate(Hook.OX-58,78);c.scale(.78,.78);c.lineJoin='round';c.lineWidth=1.4;c.strokeStyle=ink;
E(-9,-4,9,5,'#5a3a1a');c.stroke();E(9,-4,9,5,'#5a3a1a');c.stroke(); // boots
c.fillStyle=BLUE;c.fillRect(-14,-36,28,30);c.strokeRect(-14,-36,28,30);c.beginPath();c.moveTo(0,-26);c.lineTo(0,-6);c.stroke(); // overalls
limb(-12,-60+b,-18,-40);E(-18,-39,4,4,skin);c.stroke(); // back arm
E(0,-50+b,17,20,RED);c.stroke(); // red shirt
c.fillStyle=BLUE;c.fillRect(-10,-52+b,20,18);c.strokeRect(-10,-52+b,20,18);c.beginPath();c.moveTo(-8,-52+b);c.lineTo(-10,-68+b);c.moveTo(8,-52+b);c.lineTo(10,-68+b);c.lineWidth=3;c.stroke();c.lineWidth=1.4; // bib + straps
E(-8,-52+b,2,2,'#ffd21a');E(8,-52+b,2,2,'#ffd21a');
limb(11,-62+b,68,-11-b*2);E(70,-11-b*2,4.5,4.5,skin);c.stroke(); // reeling arm
E(0,-78+b,13,13,skin);c.stroke();E(5,-76+b,4.5,3.8,'#e28a6a');c.stroke(); // head + big nose
c.fillStyle='#f1f1ec';c.beginPath();c.moveTo(-12,-76+b);c.quadraticCurveTo(-14,-62+b,sw*.6,-55+b);c.quadraticCurveTo(14,-62+b,12,-76+b);c.quadraticCurveTo(0,-68+b,-12,-76+b);c.fill();c.stroke(); // white beard
E(-4,-72+b,6,2.8,'#fff');c.stroke();E(5,-72+b,6,2.8,'#fff');c.stroke(); // mustache
if(reel)E(0,-66+b,3,2.5,'#7a2020'); // open mouth while straining
for(const sx of[-5,4]){if(blink){c.beginPath();c.moveTo(sx-2,-80+b);c.lineTo(sx+2,-80+b);c.stroke()}else{E(sx,-80+b,2.6,2.8,'#fff');E(sx+.6,-80+b,1.2,1.4,'#111')}}
c.strokeStyle='#ddd';c.lineWidth=2.5;c.beginPath();c.moveTo(-8,-84+b);c.lineTo(-2,-83+b);c.moveTo(1,-83+b);c.lineTo(8,-84+b);c.stroke();c.strokeStyle=ink;c.lineWidth=1.4; // eyebrows
E(0,-86+b,20,5,'#8a5a2b');c.stroke();c.fillStyle='#8a5a2b';c.beginPath();c.arc(0,-87+b,12,Math.PI,0);c.closePath();c.fill();c.stroke();c.fillStyle='#5a3a1a';c.fillRect(-12,-91+b,24,4); // brown hat
c.restore();this.reel(c)}};
Miner.img=new Image();Miner.img.onload=()=>{Miner.ok=true};Miner.img.src='assets/miner.png';
