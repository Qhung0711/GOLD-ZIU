// Web Audio synth sounds (no audio files needed)
const Sfx={ctx:null,
tone(f,d,type='square',vol=.08,slide=0,delay=0){if(!Store.d.sound)return;try{this.ctx=this.ctx||new(window.AudioContext||window.webkitAudioContext)();const c=this.ctx,t=c.currentTime+delay,o=c.createOscillator(),g=c.createGain();o.type=type;o.frequency.setValueAtTime(f,t);if(slide)o.frequency.exponentialRampToValueAtTime(Math.max(30,f+slide),t+d);g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(c.destination);o.start(t);o.stop(t+d)}catch(e){}},
play(n){const T=this.tone.bind(this);switch(n){
case'click':T(600,.06);break;case'shoot':T(300,.15,'sawtooth',.06,400);break;case'catch':T(200,.1);break;
case'gold':T(700,.1);T(1000,.15,'square',.08,0,.08);break;
case'diamond':[900,1200,1500,1900].forEach((f,i)=>T(f,.15,'triangle',.1,0,i*.07));break;
case'dynamite':T(120,.5,'sawtooth',.15,-90);break;
case'win':[523,659,784,1047].forEach((f,i)=>T(f,.2,'square',.08,0,i*.12));break;
case'lose':[400,300,220,150].forEach((f,i)=>T(f,.25,'sawtooth',.08,0,i*.15));break}}};
