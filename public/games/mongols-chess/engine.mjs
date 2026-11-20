const files = 'abcdefgh';
const orthogonal = [[1,0],[-1,0],[0,1],[0,-1]];
const diagonal = [[1,1],[1,-1],[-1,1],[-1,-1]];
const compass = [...orthogonal,...diagonal];
const knight = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const castleSquares = { w: [56,63], b: [0,7] };
const value = { p:100, b:335, n:450, k:380, q:900, r:1500 };
export const profiles = {
  cornerCastles: { jumpShot:true },
  cornerRally: { jumpShot:true, rally:true, allAllies:true },
  cornerRaid: { jumpShot:true, shootFirst:true, rally:true, allAllies:true },
  skirmish: { min:2, max:2, rally:true },
  longbow: { min:2, max:3, rally:true },
  guard: { min:2, max:2, rally:false, guard:true },
  escort: { min:2, max:3, rally:true, escort:true },
  bishopWard: { min:2, max:2, rally:true, escort:true, bishopWard:true },
};
export const defaultRules = {
  ...profiles.cornerRaid,
  captureOnLanding: true,
};
export const passMove = Object.freeze({from:-1,to:-1,kind:'pass',capture:null});
export const opposite = side => side === 'w' ? 'b' : 'w';
export const square = index => files[index % 8] + (8 - Math.floor(index / 8));
export const indexOf = name => (8 - Number(name[1])) * 8 + files.indexOf(name[0]);
const valid = (x,y) => x >= 0 && x < 8 && y >= 0 && y < 8;
const get = (x,y) => y * 8 + x;
const startingPawnBit = (index, side) => {
  const start = side==='w' ? 48 : 8;
  return index>=start && index<start+8 ? 1 << (index-start+(side==='w'?8:0)) : 0;
};
const startingPawns = board => board.reduce((mask,piece,index) =>
  piece?.[1]==='p' ? mask | startingPawnBit(index,piece[0]) : mask, 0);

export function position(placements, turn = 'w', ep = null, quiet = 0) {
  const board = Array(64).fill(null);
  for (const [name,piece] of Object.entries(placements)) board[indexOf(name)] = piece;
  return { board, turn, ep, quiet, pawnStarts:startingPawns(board) };
}

export function initial() {
  const back = [...'rnbqkbnr'];
  return {
    board: [
      ...back.map(type=>'b'+type), ...Array(8).fill('bp'), ...Array(32).fill(null),
      ...Array(8).fill('wp'), ...back.map(type=>'w'+type),
    ],
    turn:'w', ep:null, quiet:0, pawnStarts:0xffff,
  };
}

export function key(state) {
  return state.turn + ' ' + state.ep + ' ' + (state.pawnStarts ?? startingPawns(state.board)) + ' ' + state.board.map(piece=>piece ?? '--').join('');
}

function guarded(board, target, defender) {
  const x = target % 8, y = Math.floor(target / 8);
  return compass.some(([dx,dy]) => valid(x+dx,y+dy) && board[get(x+dx,y+dy)] === defender+'k');
}

export function bishopGuardsCastle(board, target) {
  const castle = board[target];
  if (castle?.[1] !== 'r') return false;
  const x = target % 8, y = Math.floor(target / 8);
  return diagonal.some(([dx,dy]) =>
    valid(x+dx,y+dy) && board[get(x+dx,y+dy)] === castle[0]+'b');
}

export function moves(state, rules = defaultRules, selected = null) {
  const { board, turn, ep, pawnStarts=startingPawns(board) } = state;
  const enemy = opposite(turn);
  const forward = turn === 'w' ? -1 : 1;
  const found = [];
  const first = selected ?? 0, last = selected ?? 63;
  for (let from = first; from <= last; from++) {
    const piece = board[from];
    if (!piece || piece[0] !== turn || piece[1] === 'r') continue;
    const type = piece[1], x = from%8, y = Math.floor(from/8);
    const add = (tx,ty,kind='move',captureAt=null) => {
      if (!valid(tx,ty)) return false;
      const to = get(tx,ty);
      const target = board[to];
      if (target?.[0] === turn) return false;
      const capture = board[captureAt ?? to];
      found.push({from,to,kind,capture,captureAt,
        promotion:type==='p' && (ty===0 || ty===7)});
      return !target;
    };
    if (type === 'p') {
      const ny = y + forward;
      if (!valid(x,ny)) continue;
      if (!board[get(x,ny)]) {
        add(x,ny);
        if ((pawnStarts & startingPawnBit(from,turn)) && !board[get(x,y+2*forward)]) add(x,y+2*forward);
      }
      for (const dx of [-1,1]) {
        if (!valid(x+dx,ny)) continue;
        const target = get(x+dx,ny);
        if (board[target]?.[0] === enemy) add(x+dx,ny);
        else if (target === ep && !board[target] && board[get(x+dx,y)] === enemy+'p') {
          add(x+dx,ny,'move',get(x+dx,y));
        }
      }
      continue;
    }
    if (type === 'n' && rules.jumpShot) {
      for (const [dx,dy] of knight) {
        const tx=x+dx, ty=y+dy;
        if (!valid(tx,ty)) continue;
        const to=get(tx,ty), landingCapture=board[to];
        if (landingCapture && (!rules.captureOnLanding || landingCapture[0]===turn)) continue;
        add(tx,ty);
        const shotX=rules.shootFirst ? x : tx;
        const shotY=rules.shootFirst ? y : ty;
        for (const [sx,sy] of orthogonal) {
          const ax=shotX+2*sx, ay=shotY+2*sy;
          if (!valid(ax,ay) || board[get(shotX+sx,shotY+sy)]) continue;
          const captureAt=get(ax,ay), capture=board[captureAt];
          if (capture?.[0]===enemy) {
            found.push({from,to,kind:'jumpShot',capture,captureAt,landingCapture,promotion:false});
          }
        }
      }
      continue;
    }
    const steps = type === 'n' ? knight : type === 'b' ? diagonal : compass;
    for (const [dx,dy] of steps) {
      const limit = type === 'b' || type === 'q' ? 7 : 1;
      for (let distance=1; distance<=limit; distance++) {
        if (!add(x+dx*distance,y+dy*distance)) break;
      }
    }
    if (type === 'n') {
      for (const [dx,dy] of orthogonal) {
        for (let distance=1; distance<=rules.max; distance++) {
          const tx=x+dx*distance, ty=y+dy*distance;
          if (!valid(tx,ty)) break;
          const to = get(tx,ty), target = board[to];
          if (!target) continue;
          const protectedCastle = target[1]==='r' && (
            (rules.guard && guarded(board,to,enemy)) ||
            (rules.bishopWard && bishopGuardsCastle(board,to))
          );
          if (distance >= rules.min && target[0]===enemy && !protectedCastle) {
            add(tx,ty,'shot');
          }
          break;
        }
      }
    }
    if (type === 'k' && rules.rally) {
      const directions = rules.escort || rules.allAllies ? compass : [[-1,0],[1,0]];
      for (const [dx,dy] of directions) {
        if (!valid(x+dx,y+dy)) continue;
        const to=get(x+dx,y+dy);
        const ally=board[to];
        if (ally?.[0] !== turn || ally[1] === 'r') continue;
        if (!rules.allAllies && (ally[1] === 'p' ? dy !== 0 : !rules.escort)) continue;
        const promotion=ally[1]==='p' && y===(turn==='w'?0:7);
        found.push({from,to,kind:'rally',capture:null,captureAt:null,promotion});
      }
    }
  }
  return found;
}

export function apply(state, move) {
  if (move.kind==='pass') return {...state,turn:opposite(state.turn),ep:null,quiet:state.quiet+1};
  const board = state.board.slice();
  const piece = board[move.from];
  let pawnStarts=state.pawnStarts ?? startingPawns(board);
  if (piece[1]==='p') pawnStarts &= ~startingPawnBit(move.from,state.turn);
  if (move.capture?.[1]==='p') pawnStarts &= ~startingPawnBit(move.captureAt ?? move.to,opposite(state.turn));
  if (move.landingCapture?.[1]==='p') pawnStarts &= ~startingPawnBit(move.to,opposite(state.turn));
  const pawnRally=move.kind==='rally' && board[move.to][1]==='p';
  if (pawnRally) pawnStarts &= ~startingPawnBit(move.to,state.turn);
  if (move.kind==='shot') {
    board[move.to]=null;
  } else if (move.kind==='rally') {
    board[move.from]=move.promotion ? state.turn+'q' : board[move.to];
    board[move.to]=piece;
  } else {
    board[move.from]=null;
    board[move.to]=move.promotion ? state.turn+'q' : piece;
    if (move.captureAt!==null) board[move.captureAt]=null;
  }
  const pawnMove=piece[1]==='p' && move.kind==='move';
  const ep=pawnMove && Math.abs(move.from-move.to)===16 ? (move.from+move.to)/2 : null;
  return {board,turn:opposite(state.turn),ep,pawnStarts,quiet:move.capture || pawnMove || pawnRally ? 0 : state.quiet+1};
}

export function castles(state,side) {
  return castleSquares[side].filter(i=>state.board[i]===side+'r').length;
}

export function outcome(state,rules=defaultRules,repetitions=0,legal=null) {
  if (!castles(state,'w')) return {winner:'b',reason:'Both White castles fell.'};
  if (!castles(state,'b')) return {winner:'w',reason:'Both Black castles fell.'};
  if (repetitions>=3) return {winner:null,reason:'The same position repeated three times.'};
  if (state.quiet>=60) return {winner:null,reason:'60 turns passed without a pawn move or capture.'};
  if (!(legal ?? moves(state,rules)).length && !moves(apply(state,passMove),rules).length) {
    return {winner:null,reason:'Neither side can move.'};
  }
  return null;
}

function evaluate(state, rules) {
  const {board,turn}=state;
  let score=0;
  for(let index=0; index<64; index++) {
    const piece=board[index];
    if(!piece) continue;
    const [side,type]=piece;
    const x=index%8, y=Math.floor(index/8);
    const center=7-Math.abs(3.5-x)-Math.abs(3.5-y);
    const progress=side==='w' ? 6-y : y-1;
    let bonus=type==='p' ? progress*8+center*2 : type==='r' ? 0 : center*(type==='n'?7:3);
    if(type==='r' && rules.bishopWard && bishopGuardsCastle(board,index)) bonus+=30;
    if(type==='k') {
      let nearest=8;
      for(const home of castleSquares[side]) if(board[home]===side+'r') {
        nearest=Math.min(nearest,Math.max(Math.abs(x-home%8),Math.abs(y-Math.floor(home/8))));
      }
      bonus+=(8-nearest)*4;
    }
    score+=(value[type]+bonus)*(side===turn ? 1 : -1);
  }
  return score;
}
const priority=move=>2*((move.capture ? value[move.capture[1]] : 0)
  +(move.landingCapture ? value[move.landingCapture[1]] : 0))+(move.promotion ? 700 : 0);
const sorted=actions=>actions.sort((a,b)=>priority(b)-priority(a));
const exhausted=Symbol('search exhausted');

export function chooseMove(state,{rules=defaultRules,depth=3,budget=6500,seen={},salt=0}={}) {
  const actions=sorted(moves(state,rules));
  if(!actions.length || outcome(state,rules,seen[key(state)],actions)) return null;
  let nodes=0, best=actions[0];
  function search(current,left,alpha,beta,ply) {
    if(++nodes>budget) throw exhausted;
    if(!castles(current,current.turn)) return -100000+ply;
    if(current.quiet>=60 || seen[key(current)]>=2) return 0;
    if(!left) return evaluate(current,rules);
    const replies=sorted(moves(current,rules));
    if(!replies.length) {
      const passed=apply(current,passMove);
      return moves(passed,rules).length ? -search(passed,left-1,-beta,-alpha,ply+1) : 0;
    }
    for(const move of replies) {
      const score=-search(apply(current,move),left-1,-beta,-alpha,ply+1);
      if(score>=beta) return score;
      alpha=Math.max(alpha,score);
    }
    return alpha;
  }
  for(let horizon=1;horizon<=depth;horizon++) {
    let choice=best, bestScore=-Infinity;
    try {
      const candidates=[best,...actions.filter(move=>move!==best)];
      for(const move of candidates) {
        const bias=salt ? ((move.from*97+move.to*31+salt*41)%7)-3 : 0;
        const score=-search(apply(state,move),horizon-1,-Infinity,bias-bestScore,1)+bias;
        if(score>bestScore) {
          bestScore=score;
          choice=move;
        }
      }
      best=choice;
    } catch(error) {
      if(error!==exhausted) throw error;
      break;
    }
  }
  return best;
}
