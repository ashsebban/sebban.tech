const files = 'abcdefgh';
const rookHomes = [0,7,56,63];
const orthogonal = [[1,0],[-1,0],[0,1],[0,-1]];
const diagonal = [[1,1],[1,-1],[-1,1],[-1,-1]];
const compass = [...orthogonal,...diagonal];
const knight = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const value = { p:100, b:335, n:450, k:380, q:900, r:550 };
export const profiles = {
  siege: { jumpShot:true, shootFirst:true, captureOnLanding:true, emptyShotLanding:true,
    castleDefense:true, reinforcements:true, pawnReinforcementsOnly:true, territoryWalls:true },
  cornerCastles: { jumpShot:true },
  cornerRally: { jumpShot:true, rally:true, allAllies:true },
  cornerRaid: { jumpShot:true, shootFirst:true, rally:true, allAllies:true },
  skirmish: { min:2, max:2, rally:true },
  longbow: { min:2, max:3, rally:true },
  guard: { min:2, max:2, rally:false, guard:true },
  escort: { min:2, max:3, rally:true, escort:true },
  bishopWard: { min:2, max:2, rally:true, escort:true, bishopWard:true },
};
export const defaultRules = { ...profiles.siege, jumpShot:true, castleDefense:false, mobileCastles:true, castling:true, bishopWallSidestep:true, royalCheck:true, superKhan:true, pawnCap:8, infantryBreach:true, towerShots:true, min:2, max:2 };
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

export function isWall(piece, index) {
  return piece==='wp' && index>=40 || piece==='bp' && index<24;
}

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
    turn:'w', ep:null, quiet:0, pawnStarts:0xffff, castlingRights:15,
  };
}

export function key(state) {
  return state.turn + ' ' + (state.castlingRights ?? 0) + ' ' + state.ep + ' ' + (state.pawnStarts ?? startingPawns(state.board)) + ' ' + JSON.stringify(Object.entries(state.reserves ?? {}).sort()) + ' ' + (state.freshPawns ?? []).join(',') + ' ' + state.board.map(piece=>piece ?? '--').join('');
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

const isRoyal = (piece, rules) => piece?.[1]==='k' || (rules.royalCastles && piece?.[1]==='r');

export function checkThreats(state, rules = defaultRules) {
  const threats = candidateMoves({...state,turn:opposite(state.turn),ep:null},rules);
  const checks = [];
  for (const move of threats) {
    if (isRoyal(move.capture,rules)) checks.push({from:move.from,to:move.captureAt ?? move.to,kind:move.kind});
    if (isRoyal(move.landingCapture,rules)) checks.push({from:move.from,to:move.to,kind:'move'});
  }
  return checks;
}

export function checkedPieces(state, rules = defaultRules) {
  return new Set(checkThreats(state,rules).map(threat=>threat.to));
}

export function khanEscapeThreats(state, rules = defaultRules) {
  const from=state.board.indexOf(state.turn+'k');
  if (from<0) return new Map();
  const blocked=new Map();
  for (const move of candidateMoves(state,rules,from)) {
    if (move.kind!=='move' || isRoyal(move.capture,rules)) continue;
    const after={...apply(state,move),turn:state.turn};
    const threats=checkThreats(after,rules);
    if (threats.length) blocked.set(move.to,threats);
  }
  return blocked;
}

export function inCheck(state, rules = defaultRules) {
  return checkedPieces(state,rules).size>0;
}

function castleMoves(state, rules, selected) {
  const {board,turn,castlingRights=0}=state;
  const home=turn==='w' ? 56 : 0;
  const from=home+4;
  const rights=castlingRights & (turn==='w' ? 12 : 3);
  if (!rights || (selected!==null && selected!==from) || board[from]!==turn+'k') return [];
  const options=[];
  for (const direction of [-1,1]) {
    const rookFrom=home+(direction===1 ? 7 : 0);
    const right=1 << rookHomes.indexOf(rookFrom);
    if (!(rights & right) || board[rookFrom]!==turn+'r') continue;
    const between=board.slice(Math.min(rookFrom,from)+1,Math.max(rookFrom,from));
    if (between.some(Boolean)) continue;
    const rookTo=from+direction;
    const crossing=board.slice();
    crossing[from]=null;
    crossing[rookTo]=turn+'k';
    if (inCheck({...state,board:crossing},rules)) continue;
    options.push({from,to:from+2*direction,kind:'castle',rookFrom,rookTo,capture:null,captureAt:null,promotion:false});
  }
  return options.length && !inCheck(state,rules) ? options : [];
}

export function moves(state, rules = defaultRules, selected = null) {
  const candidates=candidateMoves(state,rules,selected);
  if (rules.castling) candidates.push(...castleMoves(state,rules,selected));
  if (!rules.royalCheck) return candidates;
  const canSpawn = !rules.emergencyPawns || (candidates.some(move=>move.kind==='spawn') &&
    [...checkedPieces(state,rules)].some(square=>state.board[square]?.[1]==='r'));
  return candidates.filter(move => {
    if (move.kind==='spawn' && !canSpawn) return false;
    if (isRoyal(move.capture,rules) || isRoyal(move.landingCapture,rules)) return false;
    return !inCheck({...apply(state,move),turn:state.turn},rules);
  });
}

export function khanPowers(board, side) {
  return { queen:board.includes(side+'q'), knight:board.includes(side+'n'), bishop:board.includes(side+'b') };
}

export function emptyShotSquares(state, selected, rules = defaultRules) {
  const squares = new Set();
  if (selected!=null) candidateMoves(state,rules,selected,squares);
  return squares;
}

function candidateMoves(state, rules, selected = null, emptyShots = null) {
  const { board, turn, ep, pawnStarts=startingPawns(board) } = state;
  const enemy = opposite(turn);
  const forward = turn === 'w' ? -1 : 1;
  const promotionRank = turn === 'w' ? 0 : 7;
  const found = [];
  const first = selected ?? 0, last = selected ?? 63;
  for (let from = first; from <= last; from++) {
    const piece = board[from];
    if (!piece || piece[0] !== turn) continue;
    const type = piece[1], x = from%8, y = Math.floor(from/8);
    const powers = type==='k' && rules.superKhan ? khanPowers(board,turn) : null;
    const canBreakWall = (kind) => (kind==='move' && ((rules.superKhan && type==='k') || (rules.mobileCastles && type==='r'))) ||
      (rules.infantryBreach ? type==='p' : isWall(piece,from));
    const add = (tx,ty,kind='move',captureAt=null) => {
      if (!valid(tx,ty)) return false;
      const to = get(tx,ty);
      const target = board[to];
      if (target?.[0] === turn) return false;
      const capture = board[captureAt ?? to];
      if (rules.castlesRequireOccupation && kind==='shot' && capture?.[1]==='r') return false;
      if (rules.territoryWalls && isWall(capture,captureAt ?? to) && !canBreakWall(kind)) return false;
      const promotions=type==='p' && ty===promotionRank ? ['q','r','b','n'] : [false];
      for (const promotion of promotions) found.push({from,to,kind,capture,captureAt,promotion});
      return !target;
    };
    if (type === 'r') {
      if (rules.reinforcements) {
        for (const type of rules.pawnReinforcementsOnly ? ['p'] : ['p','n','b']) {
          if (!(state.reserves?.[turn+type]>0)) continue;
          if (type==='p' && rules.pawnCap && board.filter(piece=>piece===turn+'p').length>=rules.pawnCap) continue;
          for (const [dx,dy] of compass) {
            if (!valid(x+dx,y+dy)) continue;
            if (type==='p' && y+dy===promotionRank) continue;
            const to=get(x+dx,y+dy);
            if (!board[to]) found.push({from,to,kind:'spawn',spawn:type,capture:null,captureAt:null,promotion:false});
          }
        }
      }
      if (rules.castleDefense) {
        for (const [dx,dy] of orthogonal) {
          for (let distance=1; distance<=2; distance++) {
            const tx=x+dx*distance, ty=y+dy*distance;
            if (!valid(tx,ty)) break;
            const target=board[get(tx,ty)];
            if (!target) continue;
            if (target[0]===enemy) add(tx,ty,'shot');
            break;
          }
        }
      }
      if (rules.mobileCastles) {
        for (const [dx,dy] of orthogonal) {
          for (let distance=1; distance<8; distance++) {
            if (!add(x+dx*distance,y+dy*distance)) break;
          }
        }
      }
      continue;
    }
    if (type === 'p') {
      if (rules.flexiblePawns) {
        for (const [dx,dy] of [[-1,0],[1,0],[0,-forward]]) {
          const tx=x+dx, ty=y+dy;
          if (valid(tx,ty) && !board[get(tx,ty)]) add(tx,ty);
        }
      }
      const ny = y + forward;
      if (!valid(x,ny)) continue;
      if (!board[get(x,ny)]) {
        add(x,ny);
        if (valid(x,y+2*forward) && ((pawnStarts & startingPawnBit(from,turn)) || (state.freshPawns?.includes(from) && (!rules.pawnReinforcementsOnly || startingPawnBit(from,turn)))) && !board[get(x,y+2*forward)]) add(x,y+2*forward);
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
    if ((type === 'n' && rules.jumpShot) || powers?.knight) {
      for (const [dx,dy] of knight) {
        const tx=x+dx, ty=y+dy;
        if (!valid(tx,ty)) continue;
        const to=get(tx,ty), landingCapture=board[to];
        if (landingCapture && (!rules.captureOnLanding || landingCapture[0]===turn || (rules.territoryWalls && isWall(landingCapture,to) && !canBreakWall('move')))) continue;
        add(tx,ty);
        if (landingCapture && rules.emptyShotLanding) continue;
        const shotX=rules.shootFirst ? x : tx;
        const shotY=rules.shootFirst ? y : ty;
        for (const [sx,sy] of orthogonal) {
          const ax=shotX+2*sx, ay=shotY+2*sy;
          if (!valid(ax,ay) || board[get(shotX+sx,shotY+sy)]) continue;
          const captureAt=get(ax,ay), capture=board[captureAt];
          if (!capture) emptyShots?.add(captureAt);
          if (capture?.[0]===enemy && !(rules.castlesRequireOccupation && capture[1]==='r') && !(rules.territoryWalls && isWall(capture,captureAt))) {
            found.push({from,to,kind:'jumpShot',capture,captureAt,landingCapture,promotion:false});
          }
        }
      }
      if (type==='n') continue;
    }
    if (rules.towerShots && (type==='b' || powers?.bishop)) {
      for (const [dx,dy] of orthogonal) {
        if (!valid(x+2*dx,y+2*dy)) continue;
        const tower=get(x+dx,y+dy);
        const cover=board[tower];
        if (cover!==turn+'p' && cover!==turn+'r') continue;
        const offsets=isWall(cover,tower) ? [-1,0,1] : [0];
        for (const offset of offsets) {
          const tx=x+2*dx+offset*dy, ty=y+2*dy+offset*dx;
          if (!valid(tx,ty)) continue;
          const targetSquare=get(tx,ty);
          const target=board[targetSquare];
          if (!target) emptyShots?.add(targetSquare);
          if (target?.[0]===enemy && !isRoyal(target,rules)) add(tx,ty,'shot');
        }
      }
    }
    if (type==='b' && (rules.bishopWalls || rules.bishopWallSidestep)) {
      const firingTargets=new Set();
      let canSidestep=false;
      for (const [dx,dy] of [[-1,0],[1,0],[-1,forward],[0,forward],[1,forward]]) {
        if (!valid(x+dx,y+dy) || board[get(x+dx,y+dy)]!==turn+'p') continue;
        if (rules.bishopWalls) canSidestep=true;
        if (!dy || !rules.bishopWalls) continue;
        for (const offset of [-1,0,1]) {
          const tx=x+dx+offset, ty=y+2*forward;
          if (valid(tx,ty) && board[get(tx,ty)]?.[0]===enemy) firingTargets.add(get(tx,ty));
        }
      }
      for (const to of firingTargets) add(to%8,Math.floor(to/8),'shot');
      const front=y+forward;
      const behindLine=rules.bishopWallSidestep && valid(x,front) && board[get(x,front)]===turn+'p';
      for (const direction of [-1,1]) {
        if (behindLine) {
          for (let tx=x+direction; valid(tx,front) && board[get(tx,front)]===turn+'p'; tx+=direction) {
            if (!add(tx,y)) break;
          }
        } else if (canSidestep && valid(x+direction,y) && !board[get(x+direction,y)]) {
          add(x+direction,y);
        }
      }
    }
    const steps = type === 'n' ? knight : type === 'b' ? diagonal : compass;
    for (const [dx,dy] of steps) {
      const limit = type === 'b' || type === 'q' || powers?.queen ? 7 : 1;
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
  let castlingRights=state.castlingRights ?? 0;
  if (move.kind!=='shot' && move.kind!=='spawn') {
    if (piece[1]==='k') castlingRights &= state.turn==='w' ? 3 : 12;
    const homeIndex=rookHomes.indexOf(move.from);
    if (piece[1]==='r' && homeIndex>=0) castlingRights &= ~(1 << homeIndex);
  }
  if (move.capture?.[1]==='r') {
    const homeIndex=rookHomes.indexOf(move.captureAt ?? move.to);
    if (homeIndex>=0) castlingRights &= ~(1 << homeIndex);
  }
  if (move.landingCapture?.[1]==='r') {
    const homeIndex=rookHomes.indexOf(move.to);
    if (homeIndex>=0) castlingRights &= ~(1 << homeIndex);
  }
  let pawnStarts=state.pawnStarts ?? startingPawns(board);
  if (piece[1]==='p') pawnStarts &= ~startingPawnBit(move.from,state.turn);
  if (move.capture?.[1]==='p') pawnStarts &= ~startingPawnBit(move.captureAt ?? move.to,opposite(state.turn));
  if (move.landingCapture?.[1]==='p') pawnStarts &= ~startingPawnBit(move.to,opposite(state.turn));
  const pawnRally=move.kind==='rally' && board[move.to][1]==='p';
  if (pawnRally) pawnStarts &= ~startingPawnBit(move.to,state.turn);
  const reserves={...state.reserves};
  for (const captured of [move.capture,move.landingCapture]) {
    if (captured && 'pnb'.includes(captured[1])) reserves[captured]=(reserves[captured]??0)+1;
  }
  let freshPawns=(state.freshPawns??[]).filter(index =>
    index!==move.to && index!==move.captureAt && index!==move.from);
  if (move.kind==='shot') {
    board[move.to]=null;
  } else if (move.kind==='spawn') {
    const piece=state.turn+move.spawn;
    if (--reserves[piece]===0) delete reserves[piece];
    board[move.to]=piece;
    if (move.spawn==='p') freshPawns=[...freshPawns,move.to].sort((a,b)=>a-b);
  } else if (move.kind==='rally') {
    board[move.from]=move.promotion ? state.turn+'q' : board[move.to];
    board[move.to]=piece;
  } else {
    board[move.from]=null;
    board[move.to]=move.promotion ? state.turn+(move.promotion===true?'q':move.promotion) : piece;
    if (move.captureAt!==null) board[move.captureAt]=null;
  }
  if (move.kind==='castle') {
    board[move.rookTo]=board[move.rookFrom];
    board[move.rookFrom]=null;
  }
  const pawnMove=piece[1]==='p' && move.kind==='move';
  const ep=pawnMove && Math.abs(move.from-move.to)===16 ? (move.from+move.to)/2 : null;
  return {board,turn:opposite(state.turn),ep,pawnStarts,castlingRights,reserves,freshPawns,quiet:move.capture || pawnMove || pawnRally || move.kind==='spawn' ? 0 : state.quiet+1};
}

export function castles(state,side) {
  return state.board.filter(piece=>piece===side+'r').length;
}

export function outcome(state,rules=defaultRules,repetitions=0,legal=null) {
  if (rules.firstCastleWins) {
    if (castles(state,'w')<2) return {winner:'b',reason:'Black took a White castle.'};
    if (castles(state,'b')<2) return {winner:'w',reason:'White took a Black castle.'};
  }
  if (!rules.mobileCastles && !castles(state,'w')) return {winner:'b',reason:'Both White castles fell.'};
  if (!rules.mobileCastles && !castles(state,'b')) return {winner:'w',reason:'Both Black castles fell.'};
  if (rules.royalCheck && !(legal ?? moves(state,rules)).length) {
    return inCheck(state,rules)
      ? {winner:opposite(state.turn),reason:'Checkmate.'}
      : {winner:null,reason:'Stalemate.'};
  }
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
      for(const [home, ally] of board.entries()) if(ally===side+'r') {
        nearest=Math.min(nearest,Math.max(Math.abs(x-home%8),Math.abs(y-Math.floor(home/8))));
      }
      bonus+=(8-nearest)*4;
    }
    if(type==='k' && rules.superKhan) {
      const powers=khanPowers(board,side);
      bonus+=(powers.queen ? 520 : 0)+(powers.knight ? 270 : 0)+(powers.bishop ? 80 : 0);
    }
    score+=(value[type]+bonus)*(side===turn ? 1 : -1);
  }
  return score;
}
const priority=move=>2*((move.capture ? value[move.capture[1]] : 0)
  +(move.landingCapture ? value[move.landingCapture[1]] : 0))+(move.promotion ? (value[move.promotion] ?? value.q)-value.p : 0);
const sorted=actions=>actions.sort((a,b)=>priority(b)-priority(a));
const exhausted=Symbol('search exhausted');

export function chooseMove(state,{rules=defaultRules,depth=3,budget=6500,seen={},salt=0}={}) {
  const actions=sorted(moves(state,rules));
  if(!actions.length || outcome(state,rules,seen[key(state)],actions)) return null;
  let nodes=0, best=actions[0];
  function search(current,left,alpha,beta,ply) {
    if(++nodes>budget) throw exhausted;
    if(!rules.mobileCastles && castles(current,current.turn)<(rules.firstCastleWins?2:1)) return -100000+ply;
    if(current.quiet>=60 || seen[key(current)]>=2) return 0;
    if(!left) {
      if(rules.royalCheck && inCheck(current,rules) && !moves(current,rules).length) return -100000+ply;
      return evaluate(current,rules);
    }
    const replies=sorted(moves(current,rules));
    if(!replies.length) {
      if(rules.royalCheck) return inCheck(current,rules) ? -100000+ply : 0;
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
