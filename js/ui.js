// DOM screens + HUD; delegates to Game
const UI={init(){document.addEventListener('click',e=>{const b=e.target.closest('[data-act]');if(!b)return;b.blur();Sfx.play('click');this.act(b.dataset.act)});this.refreshSound()},
show(id){document.getElementById('screens').className='on';document.querySelectorAll('.screen').forEach(s=>s.hidden=s.id!=='s-'+id)},
hide(){document.getElementById('screens').className=''},
refreshSound(){document.getElementById('bSound').textContent='SOUND '+(Store.d.sound?'ON':'OFF')},
hud(){const g=Game,$=i=>document.getElementById(i);$('hLevel').textContent=g.n;$('hTarget').textContent=g.level?g.level.target:0;$('hMoney').textContent=g.earned;$('hTime').textContent=Math.max(0,Math.ceil(g.timeLeft));$('hDyn').textContent=Store.d.up.dynamite;$('progF').style.width=Math.min(100,g.level?g.earned/g.level.target*100:0)+'%';$('hTime').parentNode.className=g.state==='PLAYING'&&g.timeLeft<=10?'warn':''},
act(a){const G=Game;if(a.startsWith('buy:'))return Shop.buy(a.slice(4));
switch(a){case'play':G.startLevel(Store.d.unlocked);break;
case'menuShop':G.fromComplete=false;document.getElementById('bShopDone').textContent='BACK';Shop.open();break;
case'shop':G.fromComplete=true;document.getElementById('bShopDone').textContent='NEXT LEVEL';Shop.open();break;
case'shopdone':G.fromComplete?G.startLevel(G.n+1):this.act('menu');break;
case'how':this.show('how');break;case'menu':G.state='MENU';this.show('menu');break;
case'sound':Store.d.sound=!Store.d.sound;Store.save();this.refreshSound();break;
case'reset':this.show('confirm');break;case'resetYes':Store.reset();this.refreshSound();G.earned=0;this.hud();this.act('menu');break;
case'share':{const t=`I made $${G.earned} on Gold Miner level ${G.n}! Beat me: ${location.href}`;navigator.clipboard&&navigator.clipboard.writeText(t);document.querySelectorAll('[data-act=share]').forEach(b=>b.textContent='COPIED!');break}
case'go':G.go();break;case'dyn':G.dynamite();break;case'pause':G.togglePause();break;
case'next':G.startLevel(G.n+1);break;case'retry':G.startLevel(G.n);break}}};
