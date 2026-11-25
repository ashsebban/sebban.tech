import {initial,moves,apply,chooseMove,checkThreats,key as chessKey,outcome} from '../mongols-chess/engine.mjs?v=50';
export {opposite,square} from '../mongols-chess/engine.mjs?v=50';

const rules={mobileCastles:true,royalCheck:true,castling:true,pawnWalls:false,horseArchery:false,bishopArchery:false};
export const cards={60:'King',59:'Queen',58:'Bishop from c1',61:'Bishop from f1'};
export function start(spy=8+Math.floor(Math.random()*8),card=[60,59,58,61][Math.floor(Math.random()*4)]){
  return {...initial(rules),spy,card,target:card,inspection:null,known:null,ending:null};
}
export const checks=s=>checkThreats(s,rules);
export const key=s=>[chessKey({...s,reserves:{}}),s.spy,s.target,s.inspection].join('|');
function inReach(from,to){
  const dx=Math.abs(from%8-to%8),dy=Math.abs((from>>3)-(to>>3));
  return Math.max(dx,dy)===1 || dx*dy===2;
}
export function legalMoves(s,from=null){
  if(s.ending)return [];
  const options=moves(s,rules,from);
  if(s.turn==='b' && s.spy>=32 && s.target!==null && (from===null||from===s.spy) && inReach(s.spy,s.target)){
    const strike={kind:'ambush',from:s.spy,to:s.target,capture:s.board[s.target],captureAt:null};
    if(!checks({...apply(s,strike),turn:'b'}).length)options.push(strike);
  }
  return options;
}
export function inspections(s,from){
  if(s.turn!=='w'||s.inspection!==null||s.board[from]!=='wb'||s.ending)return [];
  const targets=[];
  for(const [dx,dy] of [[1,1],[1,-1],[-1,1],[-1,-1]]){
    for(let x=from%8+dx,y=(from>>3)+dy;x>=0&&x<8&&y>=0&&y<8;x+=dx,y+=dy){
      const i=y*8+x;
      if(!s.board[i])continue;
      if(s.board[i]==='bp')targets.push(i);
      break;
    }
  }
  return targets;
}
export function inspect(s,from,to){
  if(!inspections(s,from).includes(to))return s;
  return {...s,inspection:to===s.spy?'spy':'ordinary',known:to};
}
export function play(s,m){
  const next={...s,...apply(s,m)};
  const taken=m.captureAt??m.to;
  const trap=s.turn==='w' && s.spy!==null && taken===s.spy && m.capture==='bp';
  if(m.kind==='ambush')next.ending={winner:'b',reason:'Ambush! The spy took the '+cards[s.card]+'.'};
  if(trap){
    next.board[m.to]=null;
    next.spy=null;
    next.known=null;
    if(s.board[m.from]==='wk'||m.from===s.target)next.ending={winner:'b',reason:'The capture trap claimed the '+(s.board[m.from]==='wk'?'King':cards[s.card])+'.'};
  }
  if(s.target===m.from)next.target=m.to;
  if(s.turn==='b'&&m.capture&&taken===s.target){next.target=null;next.spy=null;}
  if(s.spy===m.from)next.spy=m.promotion?null:m.to;
  if(s.known===m.from)next.known=m.promotion?null:m.to;
  if(s.turn==='w'&&m.capture&&taken===s.known)next.known=null;
  return next;
}
export function result(s,reps=1){
  if(s.ending)return s.ending;
  // A legal capture can uncover a line against White when its capturing piece vanishes.
  if(s.turn==='b'&&checks({...s,turn:'w'}).length)return {winner:'b',reason:'The capture trap exposed the Shogun to capture.'};
  if(s.quiet>=100)return {winner:null,reason:'Fifty moves without a capture or pawn move.'};
  const pieces=s.board.filter(Boolean);
  if(pieces.length===2 || (s.spy===null&&pieces.length===3&&pieces.some(p=>'bn'.includes(p[1]))))return {winner:null,reason:'Insufficient material.'};
  return outcome({...s,quiet:0},rules,reps,legalMoves(s));
}
export function choose(s){
  const options=legalMoves(s);
  const strike=options.find(m=>m.kind==='ambush');
  if(strike)return strike;
  const recommended=chooseMove(s,{rules,depth:3,budget:1800});
  const value={k:15,q:9,r:5,b:3,n:3,p:1};
  let best=null,high=-Infinity;
  for(const m of options){
    let score=Math.random()*.35+(m.capture?value[m.capture[1]]:0);
    if(m.from===recommended?.from&&m.to===recommended.to&&m.promotion===recommended.promotion)score+=3;
    if(s.turn==='b'&&m.from===s.spy&&s.target!==null){
      score+=1+(m.to>=32&&inReach(m.to,s.target)?4:0);
    }
    if(s.turn==='w'&&s.inspection==='spy'&&s.known!==null){
      if((m.captureAt??m.to)===s.known)score+=5-2*value[s.board[m.from][1]];
      if(s.known>=32&&inReach(s.known,m.to)&&'kqb'.includes(s.board[m.from][1]))score-=4;
    }
    if(score>high){best=m;high=score;}
  }
  return best;
}
