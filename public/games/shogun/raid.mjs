import {apply,checkThreats,indexOf,key as chessKey,moves,outcome,position,square,wallSquares} from '../mongols-chess/engine.mjs?v=50';
export {square,opposite} from '../mongols-chess/engine.mjs?v=50';
const rules={mobileCastles:true,royalCheck:true,territoryWalls:true,infantryBreach:true,kingBreachesWalls:true,sides:{b:{pawnWalls:false}}};
export const fortifiedPawns=board=>wallSquares(board,rules);
export const checks=state=>checkThreats(state,rules);
export const key=s=>JSON.stringify([chessKey(s),s.alarm,s.ropes,s.directions]);
const dist=(a,b)=>Math.max(Math.abs(a%8-b%8),Math.abs((a>>3)-(b>>3)));
export function start(){
  const s=position({e1:'wk',d1:'wq',a2:'wr',h2:'wr',c1:'wb',g1:'wn',b2:'wp',c2:'wp',d2:'wp',f2:'wp',g2:'wp',
    e8:'bk',c7:'bb',f7:'bb',b5:'br',g6:'br',c4:'bn',d6:'bp',e6:'bp',h6:'bp'},'b');
  return {...s,alarm:false,ropes:[],directions:{},reserves:{},freshPawns:[],castlingRights:0};
}
export function light(s){
  const lit=new Set(Array.from({length:16},(_,i)=>48+i));
  for(const i of fortifiedPawns(s.board)) lit.add(i-8);
  s.board.forEach((p,from)=>{
    if(p!=='wr') return;
    const step=s.directions[from]??-8;
    for(let i=from+step;i>=0&&i<64&&dist(i,i-step)===1;i+=step){
      lit.add(i);
      if(s.board[i]) break;
    }
  });
  return lit;
}
export function samuraiView(s){
  const lit=light(s);
  return {...s,board:s.board.map((p,i)=>p==='bb'&&!s.alarm&&!lit.has(i)?null:p)};
}
export function isAssassination(s,m){
  return !s.alarm&&s.board[m.from]==='bb'&&m.kind!=='hook'&&dist(m.to,s.board.indexOf('wk'))===1;
}
const specialMove=(from,to,kind)=>({from,to,kind,capture:null,captureAt:null});
function advance(s,m){
  const stationary=['hook','aim'].includes(m.kind);
  const next=stationary?apply(s,{kind:'pass'}):apply(s,m);
  let ropes=s.ropes.filter(i=>next.board[i]==='br'&&next.board[i+8]==='wp'&&(stationary||i!==m.from));
  if(m.kind==='hook') ropes=[...ropes,m.from].sort((a,b)=>a-b);
  const directions={...s.directions};
  if(!stationary){
    delete directions[m.to];
    if(s.board[m.from]==='wr') directions[m.to]=directions[m.from]??-8;
    delete directions[m.from];
  }
  if(m.kind==='aim') directions[m.from]=m.to-m.from;
  return {...next,alarm:s.alarm,ropes,directions};
}
export function play(s,m){
  const next=advance(s,m);
  if(isAssassination(s,m)) return {...next,assassinated:true};
  if(!s.alarm){
    const lit=light(next);
    if(next.board.some((p,i)=>p==='bb'&&lit.has(i))||m.capture==='bb'||checks({...next,turn:'w'}).length){
      next.alarm=true;
      next.turn='w';
      next.ep=null;
      for(const i of [indexOf('b1'),indexOf('f1')]) if(!next.board[i]) next.board[i]='wn';
    }
  }
  return next;
}
export function legalMoves(s,from=null){
  const ordinary=moves(s,rules,from).filter(m=>s.alarm||s.board[m.from]!=='wk');
  const extra=[];
  s.board.forEach((p,i)=>{
    if(!p||p[0]!==s.turn||(from!==null&&i!==from)) return;
    if(p==='wr'&&!s.alarm) for(const d of [-8,1,8,-1]){
      const to=i+d;
      if(to>=0&&to<64&&dist(i,to)===1&&d!==(s.directions[i]??-8)) extra.push(specialMove(i,to,'aim'));
    }
    if(p==='br'&&!s.ropes.includes(i)&&fortifiedPawns(s.board).has(i+8)&&i+16<64) extra.push(specialMove(i,i+8,'hook'));
    if(p[0]==='b'&&p!=='bk') for(const crew of s.ropes){
      const to=crew+16;
      if(dist(i,crew)===1&&!s.board[to]) extra.push(specialMove(i,to,'climb'));
    }
  });
  return ordinary.concat(extra.filter(m=>!checks({...advance(s,m),turn:s.turn}).length));
}
export const attempts=(s,i)=>legalMoves(s.turn==='w'?samuraiView(s):s,i);
export function result(s,repetitions=1){
  if(s.assassinated) return {winner:'b',reason:'Assassinated. The bishop reached the sleeping Shogun.'};
  if(!s.board.includes('bb')) return {winner:'w',reason:'Both assassins were captured.'};
  return outcome(s,rules,repetitions,legalMoves(s));
}
const values={q:9,r:5,b:3,n:3,p:1,k:0};
function score(s,side){
  let value=0;
  const king=s.board.indexOf('wk');
  s.board.forEach((p,i)=>{
    if(!p) return;
    const weight=values[p[1]]+(p==='bb'?4:0);
    value+=(p[0]==='b'?1:-1)*weight;
    if(p==='bb') value+=(7-dist(i,king))*.27;
    if(p==='br'&&fortifiedPawns(s.board).has(i+8)) value+=.45;
  });
  value+=s.ropes.length*.8;
  return side==='b'?value:-value;
}
export function choose(state,_flash=[],_seen={},hint=false){
  const side=state.turn,s=side==='w'?samuraiView(state):state;
  const actual=legalMoves(state), options=legalMoves(s);
  const id=m=>[m.from,m.to,m.kind,m.promotion].join('/');
  const allowed=new Map(actual.map(m=>[id(m),m]));
  let best=null,high=-Infinity;
  for(const m of options){
    if(!hint&&!allowed.has(id(m))) continue;
    const n=play(s,m);
    let v=score(n,side);
    if(n.assassinated) v=10000;
    else {
      const replies=legalMoves(n);
      if(!replies.length&&checks(n).length) v=10000;
      else if(replies.length){
        const scores=replies.map(reply=>isAssassination(n,reply)?(side==='b'?10000:-10000):score(play(n,reply),side));
        v=.2*v+.8*(n.turn===side?Math.max(...scores):Math.min(...scores));
      }
    }
    v+=Math.random()*.16;
    if(v>high){best=m;high=v;}
  }
  return best??(hint?options:actual)[0];
}
