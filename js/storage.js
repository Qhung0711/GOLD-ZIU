// Save data in localStorage (progress, money, upgrades, sound)
const Store={KEY:'goldminer_save_v1',d:null,
def(){return{unlocked:1,money:0,sound:true,stars:{},up:{strength:0,lucky:0,power:0,dynamite:0,rock:0}}},
load(){this.d=this.def();try{const s=JSON.parse(localStorage.getItem(this.KEY)||'{}');Object.assign(this.d,s);this.d.up=Object.assign(this.def().up,s.up||{})}catch(e){}},
save(){try{localStorage.setItem(this.KEY,JSON.stringify(this.d))}catch(e){}},
reset(){this.d=this.def();this.save()}};
