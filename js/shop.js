const SHOP=[
{id:'strength',name:'STRENGTH POTION',price:500,desc:'Pull heavy items faster (-15% weight each)'},
{id:'lucky',name:'LUCKY POTION',price:1000,desc:'+1 Diamond on every level'},
{id:'power',name:'POWER POTION',price:750,desc:'Hook shoots 20% faster'},
{id:'dynamite',name:'DYNAMITE',price:300,desc:'Blast the item you are hauling (D)'},
{id:'rock',name:'ROCK BONUS',price:800,desc:'Rocks worth +50% each'}];
const Shop={open(){this.render();UI.show('shop')},
render(){const d=Store.d;document.getElementById('sWallet').textContent=d.money;
document.getElementById('shopList').innerHTML=SHOP.map(s=>`<div class="row"><div><b>${s.name}</b><br><small>${s.desc}</small></div><div>Owned: ${d.up[s.id]}</div><button data-act="buy:${s.id}" ${d.money<s.price?'disabled':''}>$${s.price}</button></div>`).join('')},
buy(id){const s=SHOP.find(x=>x.id===id),d=Store.d;if(!s||d.money<s.price)return;d.money-=s.price;d.up[id]++;Store.save();this.render();UI.hud()}};
