import {TerrainGame,computer,files,trees,nameOf} from './rules.mjs';
const el=id=>document.getElementById(id);
const forest=new URLSearchParams(location.search).get('map')==='forest';
const title=forest?'Sherwood Forest Chess':'Drawbridge Chess';
document.title=document.querySelector('h1').textContent=title;
el('intro').textContent=forest?'Four oak groves divide the center. Find a path through the clearings.':'Control the river crossings. Raising or lowering a bridge takes your turn.';
el('rules').textContent=(forest?'The groves on c4, f4, c5 and f5 block movement and attacks. Knights may leap across a grove. Every piece must land in a clearing.':'The river runs between ranks 4 and 5. Stone crossings at a and h are permanent. Either player can operate d or e. A diagonal crossing is open if either file it touches has a crossing. Knights leap freely. Preview a bridge to see squares gaining or losing an attacker from either army, then confirm. A bridge action must leave your king safe.')+' Checkmate wins. Threefold repetition and the fifty-move rule draw.';
const map=forest?'forest':'river';
let game,history,positions,selected,preview,timer,last,legal,over;
const cells=new Map();
function button(label,fn){const b=document.createElement('button');b.textContent=label;b.onclick=fn;return b;}
for(let rank=8;rank;rank--) for(const file of files){
 const s=file+rank,b=button('',()=>click(s));cells.set(s,b);el('board').append(b);
}
function reset(){
 clearTimeout(timer);game=new TerrainGame(map);history=[];positions=[game.key()];selected=null;preview=null;last='';render();
}
function render(){
 legal=game.actions();over=!legal.length||positions.filter(x=>x===game.key()).length>=3||Number(game.fen().split(' ')[4])>=100;
 const check=game.isCheck();
 el('status').textContent=!legal.length?(check?(game.turn()==='w'?'Black':'White')+' wins by checkmate.':'Stalemate.'):over?'Draw.':(game.turn()==='w'?'Your move':'Black to move')+(check?' · Check':'')+(last?' · '+last:'');
 let simulated=null;
 if(preview){simulated=new TerrainGame(...game.snapshot());simulated.bridges^=preview;}
 for(const [s,b] of cells){
  const file=files.indexOf(s[0]),rank=Number(s[1]),p=game.get(s);
  b.replaceChildren();b.className='square'+((file+rank)%2?' dark':'');
  if(!forest&&rank===5){b.classList.add('river');if(file===3||file===4)b.classList.add('drawbridge');if((simulated||game).crossing(file))b.classList.add('crossing');}
  if(forest&&trees.has(s)){b.textContent='🌳';b.classList.add('tree');}
  if(p){const img=document.createElement('img');img.src='../sideways-chess/pieces/'+p.color+p.type.toUpperCase()+'.svg';img.alt='';b.append(img);}
  if(!file||rank===1){const c=document.createElement('small');c.textContent=(!file?rank:'')+(rank===1?s[0]:'');b.append(c);}
  b.setAttribute('aria-label',s+' '+(p?({w:'White',b:'Black'}[p.color]+' '+({k:'king',q:'queen',r:'rook',n:'knight',b:'bishop',p:'pawn'}[p.type])):forest&&trees.has(s)?'grove':'empty'));
  if(s===selected)b.classList.add('selected');
  if(selected&&legal.some(m=>!m.bridge&&nameOf(m.from)===selected&&nameOf(m.to)===s)){b.classList.add('legal');if(p)b.classList.add('capture');}
  if(p?.type==='k'&&p.color===game.turn()&&check)b.classList.add('check');
  if(simulated&&['w','b'].some(c=>game.attackers(s,c).join()!==simulated.attackers(s,c).join()))b.classList.add('changed');
 }
 el('actions').replaceChildren();el('preview').textContent='';
 if(!forest&&!over&&game.turn()==='w'){
  for(const [bit,file] of [[1,'d'],[2,'e']]){
   const label=(game.bridges&bit?'Raise ':'Lower ')+file+' bridge';
   const b=button(label,()=>{selected=null;preview=bit;render();});b.disabled=!legal.some(m=>m.bridge===bit);el('actions').append(b);
  }
  if(preview){el('preview').textContent='Preview · Outlined squares change attackers.';el('actions').append(button('Confirm',()=>play({bridge:preview})),button('Cancel',()=>{preview=null;render();}));}
 }
 el('undo').disabled=!history.length;
}
function play(m){
 history.push({state:game.snapshot(),last});last=m.bridge?((game.bridges&m.bridge?'Raised ':'Lowered ')+(m.bridge===1?'d':'e')+' bridge'):nameOf(m.from)+' → '+nameOf(m.to);
 game.play(m);positions.push(game.key());selected=null;preview=null;render();
 if(!over&&game.turn()==='b')timer=setTimeout(()=>play(computer(game)),80);
}
function click(s){
 if(over||game.turn()!=='w')return;
 preview=null;
 const options=legal.filter(m=>!m.bridge&&nameOf(m.from)===selected&&nameOf(m.to)===s);
 if(options.length>1){const d=el('promotion'),box=d.querySelector('div');box.replaceChildren();for(const m of options)box.append(button(({q:'Queen',n:'Knight',b:'Bishop',r:'Rook'})[m.promotion],()=>{d.close();play(m);}));d.showModal();return;}
 if(options.length){play(options[0]);return;}
 selected=selected!==s&&game.get(s)?.color==='w'?s:null;render();
}
el('undo').onclick=()=>{
 clearTimeout(timer);do{const old=history.pop();game=new TerrainGame(...old.state);last=old.last;positions.pop();}while(history.length&&game.turn()==='b');
 selected=null;preview=null;render();
};
el('restart').onclick=reset;reset();
