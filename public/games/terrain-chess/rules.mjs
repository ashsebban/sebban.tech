import {Chess,DEFAULT_POSITION} from '../sideways-chess/vendor/chess.mjs';

export const files='abcdefgh';
export const trees=new Set(['c4','f4','c5','f5']);
export const nameOf=i=>files[i%16]+(8-(i>>4));
const index=s=>files.indexOf(s[0])+16*(8-Number(s[1]));

export class TerrainGame extends Chess {
  constructor(map,fen=DEFAULT_POSITION,bridges=3) {
    super(fen);
    this.map=map;
    this.bridges=bridges;
  }
  crossing(file) {
    return file===0 || file===7 || (file===3 && !!(this.bridges&1)) || (file===4 && !!(this.bridges&2));
  }
  terrainAllows(from,to,piece) {
    if(this.map==='forest' && trees.has(nameOf(to))) return false;
    if(piece==='n' || from===to) return true;
    const step=Math.sign((to>>4)-(from>>4))*16+Math.sign(to%16-from%16);
    for(let i=from;i!==to;) {
      const next=i+step;
      if(this.map==='forest' && trees.has(nameOf(next))) return false;
      if(this.map==='river' && ((i>>4)<4)!==((next>>4)<4) && !this.crossing(i%16) && !this.crossing(next%16)) return false;
      i=next;
    }
    return true;
  }
  _attacked(color,square,verbose) {
    const attackers=super._attacked(color,square,true).filter(s=>this.terrainAllows(index(s),square,this.get(s).type));
    return verbose ? attackers : attackers.length>0;
  }
  _moves(options) {
    return super._moves(options).filter(m=>this.terrainAllows(m.from,m.to,m.piece));
  }
  bridgeActions() {
    if(this.map!=='river') return [];
    return [1,2].filter(bit=>{
      this.bridges^=bit;
      try {return !this.isCheck();} finally {this.bridges^=bit;}
    }).map(bridge=>({bridge}));
  }
  actions() {return [...this._moves(),...this.bridgeActions()];}
  play(action) {
    if(!action.bridge) {this._makeMove(action);return;}
    const fields=this.fen().split(' ');
    fields[1]=this.turn()==='w'?'b':'w';
    fields[3]='-';
    fields[4]=String(Number(fields[4])+1);
    if(this.turn()==='b') fields[5]=String(Number(fields[5])+1);
    this.bridges^=action.bridge;
    this.load(fields.join(' '));
  }
  snapshot(){return [this.map,this.fen(),this.bridges];}
  key(){return this.fen().split(' ').slice(0,4).join(' ')+' '+this.bridges;}
}
const values={p:100,n:310,b:320,r:500,q:900,k:0};
function score(game){
  let total=0;
  for(const row of game.board()) for(const p of row) if(p){
    const advance=p.color==='w'?Number(p.square[1])-2:7-Number(p.square[1]);
    const center=7-Math.abs(files.indexOf(p.square[0])-3.5)-Math.abs(Number(p.square[1])-4.5);
    total+=(p.color==='w'?1:-1)*(values[p.type]+(p.type==='p'?4*advance:0)+(p.type==='k'?0:3*center));
  }
  return total;
}
export function computer(game){
  let best=-Infinity,chosen;
  for(const action of game.actions()){
    const after=new TerrainGame(...game.snapshot());after.play(action);
    const replies=after.actions();
    let worst=replies.length?Infinity:after.isCheck()?100000:0;
    const sign=game.turn()==='w'?1:-1;
    for(const reply of replies){
      const end=new TerrainGame(...after.snapshot());end.play(reply);
      worst=Math.min(worst,sign*score(end));
      if(worst<best-1) break;
    }
    const rating=worst+Math.random()*.5;
    if(rating>best){best=rating;chosen=action;}
  }
  return chosen;
}
