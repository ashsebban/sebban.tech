import {apply,checkThreats,chooseMove,initial,key,moves,outcome,wallSquares} from '../mongols-chess/engine.mjs?v=50';
export {indexOf as index,key,opposite,square} from '../mongols-chess/engine.mjs?v=50';

const rules = {
  mobileCastles:true, castling:true, royalCheck:true, territoryWalls:true,
  infantryBreach:true, kingBreachesWalls:true, sides:{b:{pawnWalls:false}},
};
const previewRules = {...rules,royalCheck:false};
const diagonal = [[1,1],[1,-1],[-1,1],[-1,-1]];
const knight = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const valid = (x,y) => x>=0 && x<8 && y>=0 && y<8;
const distance = (a,b) => Math.max(Math.abs(a%8-b%8), Math.abs(Math.floor(a/8)-Math.floor(b/8)));

export const start = () => initial(rules);
export const fortifiedPawns = board => wallSquares(board,rules);
export const legalMoves = (state,from=null) => moves(state,rules,from);
export const checks = state => checkThreats(state,rules);

const watchRange = 3;
const searchRange = 6;

function beam(board,from,dx,dy,range) {
  const squares = [];
  for (let step=1; step<=range; step++) {
    const x=from%8+dx*step, y=Math.floor(from/8)+dy*step;
    if (!valid(x,y)) break;
    const to=y*8+x;
    squares.push(to);
    if (board[to]) break;
  }
  return squares;
}

export function assassinationThreats(state) {
  const attacker = {...state,turn:'b',ep:null};
  const king = state.board.indexOf('wk');
  if (king<0) return [];
  return state.board.flatMap((piece,from)=>piece==='bb' ?
    legalMoves(attacker,from).filter(move=>distance(move.to,king)===1) : []);
}

export function light(state,flash=[]) {
  const {board} = state;
  const lit = new Set(flash);
  const fortified = fortifiedPawns(board);
  for (const i of fortified) {
    for (let inside=Math.max(i%8,i-16); inside<64; inside+=8) lit.add(inside);
  }
  board.forEach((piece,i)=>{
    if (piece==='wp' && !fortified.has(i) && i>=8) lit.add(i-8);
    if (piece==='wb') {
      for (const [dx,dy] of diagonal) {
        for (const tile of beam(board,i,dx,dy,watchRange)) lit.add(tile);
      }
    }
  });
  for (const {from,to} of checks({...state,turn:'w'})) {
    lit.add(from);
    lit.add(to);
  }
  if (state.turn==='w') {
    for (const {from} of assassinationThreats(state)) lit.add(from);
  }
  return lit;
}

export function samuraiView(state,flash=[]) {
  const lit = light(state,flash);
  const board = state.board.map((piece,i)=>piece?.[0]==='b' && !lit.has(i) ? null : piece);
  return {...state,board,ep:state.ep!=null && board[state.ep+8]==='bp' ? state.ep : null};
}

export function searches(state,from,flash=[]) {
  const {board} = state;
  if (state.turn!=='w' || from==null) return [];
  const x = from%8, y = Math.floor(from/8);
  const lit = light(state,flash);
  const targets = [];
  const add = (dx,dy)=>{
    if (!valid(x+dx,y+dy)) return;
    const to = (y+dy)*8+x+dx;
    if (!lit.has(to)) targets.push(to);
  };
  if (board[from]==='wn') {
    for (const [dx,dy] of knight) add(dx,dy);
  } else if (board[from]==='wb') {
    for (const [dx,dy] of diagonal) {
      // Select the end of the beam. Known blockers limit the choice.
      for (let step=1; step<=searchRange; step++) {
        if (!valid(x+dx*step,y+dy*step)) break;
        const to = (y+dy*step)*8+x+dx*step;
        add(dx*step,dy*step);
        if (board[to]?.[0]==='w' || (lit.has(to) && board[to])) break;
      }
    }
  } else if (board[from]==='wp' && !fortifiedPawns(board).has(from)) {
    for (let dx=-2; dx<=2; dx++) {
      for (let dy=-2; dy<=2; dy++) {
        if (dx || dy) add(dx,dy);
      }
    }
  }
  return targets;
}

export function reveal(state,from,to) {
  if (state.board[from]!=='wb') return [to];
  const dx = Math.sign(to%8-from%8), dy = Math.sign(Math.floor(to/8)-Math.floor(from/8));
  return beam(state.board,from,dx,dy,Math.min(distance(from,to),searchRange));
}

export function attempts(state,from,flash=[]) {
  if (state.turn==='b') return legalMoves(state,from);
  const view = samuraiView(state,flash);
  const options = moves(view,previewRules,from).filter(move=>move.capture!=='bk');
  if (state.board[from]!=='wp') return options;
  const lit = light(state,flash);
  // Pawn diagonals can be aimed at a hidden opponent without revealing occupancy.
  for (const dx of [-1,1]) {
    const to = from-8+dx;
    if (!valid(from%8+dx,Math.floor(from/8)-1) || view.board[to] || lit.has(to)) continue;
    options.push({from,to,probe:true});
  }
  return options;
}

export function isAssassination(state,move) {
  return state.board[move.from]==='bb' && distance(move.to,state.board.indexOf('wk'))===1;
}

export function play(state,move) {
  const next = apply(state,move);
  return isAssassination(state,move) ? {...next,assassinated:true} : next;
}

export function result(state,repetitions=1,legal=null) {
  if (state.assassinated) return {winner:'b',reason:'Assassination. A Shinobi bishop reached the Shogun.'};
  const ending = outcome({...state,quiet:0},rules,repetitions,legal);
  if (ending) return ending;
  if (state.quiet>=100) return {winner:null,reason:'Fifty moves without a capture or pawn move.'};
  if (state.board.filter(Boolean).length===2) return {winner:null,reason:'Only the kings remain.'};
  return null;
}

export function selectSearch(state) {
  let best = null;
  const king = state.board.indexOf('wk');
  const known = samuraiView(state);
  state.board.forEach((piece,from)=>{
    if (piece?.[0]!=='w') return;
    for (const to of searches(state,from)) {
      const score = (piece==='wb' ? distance(from,to) : 1)*2 +
        Math.max(0,5-distance(to,king)) + (known.board[to] ? -5 : 0);
      if (!best || score>best.score) best={from,to,score};
    }
  });
  return best;
}

const values = {p:100,b:340,n:320,r:500,q:900,k:0};
const moveId = move => [move.from,move.to,move.promotion || ''].join(':');

export function choose(state,flash=[],seen={},hint=false) {
  if (state.turn==='b') {
    const legal = legalMoves(state);
    const immediate = legal.find(move=>isAssassination(state,move));
    if (immediate) return immediate;
    const tactical = legal.filter(move=>{
      if (state.board[move.from]!=='bb') return false;
      const after = play(state,move);
      const king = after.board.indexOf('wk');
      if (distance(move.to,king)>3) return false;
      const replies = legalMoves(after);
      return replies.length>0 && replies.every(reply=>{
        const response=play(after,reply);
        return legalMoves(response,move.to).some(candidate=>isAssassination(response,candidate));
      });
    });
    return tactical[0] ?? chooseMove({...state,quiet:0},{rules,depth:3,budget:2200,seen}) ?? legal[0] ?? null;
  }
  const view = samuraiView(state,flash);
  const preferred = chooseMove(view,{rules,depth:2,budget:1300});
  const options = moves(view,rules);
  const ranked = preferred ? [preferred,...options.filter(m=>moveId(m)!==moveId(preferred))] : options;
  const actual = hint ? options : legalMoves(state);
  const byId = new Map(actual.map(move=>[moveId(move),move]));
  let best = null, bestScore = -Infinity;
  for (const [order,move] of ranked.entries()) {
    const resolved = byId.get(moveId(move));
    if (!resolved) continue;
    const next = play(view,move);
    const defense = hint ? next : play(state,resolved);
    const danger = assassinationThreats(defense).length>0;
    const shogun = next.board.indexOf('wk');
    const cover = [...fortifiedPawns(next.board)].filter(i=>distance(i,shogun)===1).length;
    const castle = move.kind==='castle' ? 18 : 0;
    const score = (danger ? -10000 : 0)+(values[move.capture?.[1]] ?? 0)+cover*24+castle-order*2;
    if (score>bestScore) { best=resolved; bestScore=score; }
  }
  return best ?? actual[0] ?? null;
}
