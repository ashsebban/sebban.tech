export const raidLimit = 20;
export const files = 'abcdefgh';
export const square = i => files[i % 8] + (8 - Math.floor(i / 8));
export const index = name => (8 - Number(name[1])) * 8 + files.indexOf(name[0]);
export const opposite = side => side === 'b' ? 'w' : 'b';
const straight = [[1,0],[-1,0],[0,1],[0,-1]];
const diagonal = [[1,1],[-1,1],[1,-1],[-1,-1]];
const adjacent = [...straight,...diagonal];
const jumps = [[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const valid = (x,y) => x >= 0 && x < 8 && y >= 0 && y < 8;

export function start() {
  const back = [...'rnbqkbnr'];
  const board = [...back.map(p=>'b'+p), ...Array(8).fill('bp'), ...Array(32).fill(null),
    ...Array(8).fill('wp'), ...back.map(p=>'w'+p)];
  for (const name of ['d4','e4']) board[index(name)] = '#';
  return {board, turn:'b', raids:0, enPassant:null, contact:null};
}

export function light(board) {
  const squares = new Set();
  board.forEach((piece,i) => {
    if (piece !== 'wr') return;
    for (const [dx,dy] of adjacent) {
      const x = i % 8 + dx, y = Math.floor(i / 8) + dy;
      if (valid(x,y)) squares.add(y*8+x);
    }
  });
  return squares;
}

export function result({board,raids}) {
  if (!board.includes('wk')) return {winner:'b', message:'The Shinobi reached the Shogun.'};
  if (!board.includes('bb')) return {winner:'w', message:'Both assassins were caught.'};
  if (raids >= raidLimit) return {winner:'w', message:'Dawn broke. The Shogun survived.'};
  return null;
}

export function moves(state, selected = null, withPass = true) {
  const {board,turn,enPassant} = state;
  const lit = light(board);
  const legal = [];
  const first = selected ?? 0;
  const last = selected ?? 63;

  for (let from=first; from<=last; from++) {
    const piece = board[from];
    if (!piece || (piece === '#' ? turn !== 'w' : piece[0] !== turn)) continue;
    const role = piece[1], x = from % 8, y = Math.floor(from / 8);
    const add = (tx,ty,kind='move') => {
      if (!valid(tx,ty)) return;
      const to = ty*8+tx, target = board[to];
      if (target === '#' || target?.[0] === turn || (target === 'wk' && piece !== 'bb')) return;
      if ((kind === 'wall' || kind === 'slip' || kind === 'grapple') && target) return;
      if (kind === 'strike' && !target) return;
      legal.push({from,to,kind});
    };

    if (piece === '#') {
      for (const [dx,dy] of straight) {
        if (y+dy === 4 || y+dy === 5) add(x+dx,y+dy,'wall');
      }
    } else if (role === 'p') {
      const step = turn === 'w' ? -1 : 1;
      if (!valid(x,y+step)) continue;
      if (!board[(y+step)*8+x]) {
        add(x,y+step);
        if (y === (turn === 'b' ? 1 : 6) && !board[(y+2*step)*8+x]) add(x,y+2*step);
      }
      for (const dx of [-1,1]) {
        if (!valid(x+dx,y+step)) continue;
        const to = (y+step)*8+x+dx;
        if (board[to]) add(x+dx,y+step);
        else if (enPassant === to) add(x+dx,y+step,'en-passant');
      }
    } else if (role === 'n' || role === 'k') {
      for (const [dx,dy] of role === 'n' ? jumps : adjacent) add(x+dx,y+dy);
      if (piece === 'wn') for (const [dx,dy] of straight) add(x+dx,y+dy,'strike');
    } else {
      const directions = role === 'q' ? adjacent : role === 'b' ? diagonal : straight;
      for (const [dx,dy] of directions) {
        let crossed = false;
        for (let distance=1; distance<8; distance++) {
          const tx = x+dx*distance, ty = y+dy*distance;
          if (!valid(tx,ty)) break;
          const to = ty*8+tx, target = board[to];
          if (crossed) {
            if (target) break;
            if (!lit.has(to)) add(tx,ty,piece === 'bb' ? 'slip' : 'grapple');
            continue;
          }
          add(tx,ty);
          if (!target) continue;
          if (!lit.has(from) && (piece === 'bb' || (piece === 'br' && target === '#'))) crossed = true;
          else break;
        }
      }
    }
  }
  if (!legal.length && selected === null && withPass) legal.push({kind:'pass'});
  return legal;
}

export function visibleToSamurai(state) {
  const lit = light(state.board);
  if (state.contact != null) lit.add(state.contact);
  return lit;
}

export function samuraiView(state) {
  const lit = visibleToSamurai(state);
  const board = state.board.map((piece,i)=>piece?.[0] === 'b' && !lit.has(i) ? null : piece);
  const pawn = state.enPassant == null ? null : state.enPassant+8;
  return {...state,board,enPassant:pawn != null && board[pawn] === 'bp' ? state.enPassant : null};
}

export function samuraiAttempts(state, selected = null) {
  const visible = samuraiView(state);
  const lit = visibleToSamurai(state);
  const actions = moves(visible, selected, false);
  const first = selected ?? 0;
  const last = selected ?? 63;
  for (let from=first; from<=last; from++) {
    const piece = visible.board[from];
    const x = from%8, y = Math.floor(from/8);
    const offsets = piece === 'wp' ? [[-1,-1],[1,-1]] : piece === 'wn' ? straight : [];
    for (const [dx,dy] of offsets) {
      if (!valid(x+dx,y+dy)) continue;
      const to = (y+dy)*8+x+dx;
      if (!visible.board[to] && !lit.has(to) && !actions.some(move=>move.from===from && move.to===to)) {
        actions.push({from,to,kind:'probe'});
      }
    }
  }
  if (!actions.length && selected === null) actions.push({kind:'pass'});
  return actions;
}

export function resolveSamurai(state, attempt) {
  if (attempt.kind === 'pass') return attempt;
  const {from,to} = attempt;
  const actual = moves(state,from).find(move=>move.to===to);
  if (actual) return actual;

  // A sliding move or a pawn advance can run into a hidden piece.
  const piece = state.board[from];
  if (attempt.kind !== 'probe' && ['b','r','q','p'].includes(piece?.[1])) {
    const fx = from%8, fy = Math.floor(from/8);
    const tx = to%8, ty = Math.floor(to/8);
    const dx = Math.sign(tx-fx), dy = Math.sign(ty-fy);
    const distance = Math.max(Math.abs(tx-fx), Math.abs(ty-fy));
    for (let step=1; step<=distance; step++) {
      const contact = (fy+dy*step)*8 + fx+dx*step;
      if (state.board[contact]?.[0] === 'b') return {from,kind:'blocked',contact};
    }
  }
  return {from,to,kind:'miss'};
}

export function play(state, move) {
  const {turn,raids} = state;
  const board = state.board.slice();
  let enPassant = null;
  if (!['pass','miss','blocked'].includes(move.kind)) {
    const {from,to,kind} = move;
    const piece = board[from];
    if (kind === 'en-passant') board[to+(turn === 'w' ? 8 : -8)] = null;
    board[to] = piece;
    board[from] = null;
    if (piece[1] === 'p') {
      if (Math.abs(from-to) === 16) enPassant = (from+to)/2;
      if (to < 8 || to >= 56) board[to] = turn+'q';
    }
  }
  return {board,turn:opposite(turn),raids:raids+(turn === 'b' ? 1 : 0),enPassant,
    contact:turn === 'w' ? move.contact ?? null : state.contact};
}

const value = {bk:210,bq:530,br:390,bb:760,bn:295,bp:84,wk:0,wq:460,wr:365,wb:235,wn:310,wp:77};

function score(state) {
  const ending = result(state);
  if (ending) return ending.winner === 'b' ? 100000-state.raids : -100000+state.raids;
  const target = state.board.indexOf('wk');
  const tx = target%8, ty = Math.floor(target/8);
  let score = -state.raids*9;
  state.board.forEach((piece,i) => {
    if (!Object.hasOwn(value,piece)) return;
    const x = i%8, y = Math.floor(i/8);
    score += (piece[0] === 'b' ? 1 : -1) * value[piece];
    if (piece === 'bb') score += 72 - 11*Math.max(Math.abs(tx-x),Math.abs(ty-y)) - (Math.abs(tx-x) === Math.abs(ty-y) ? -15 : 0);
    if (piece === 'bp') score += y*3;
    if (piece === 'wr' && Math.max(Math.abs(tx-x),Math.abs(ty-y)) <= 2) score -= 14;
  });
  return score;
}

export function choose(state) {
  const maximize = state.turn === 'b';
  const sign = maximize ? 1 : -1;
  const options = moves(state).map(move => {
    const next = play(state,move);
    return {move,next,estimate:score(next)*sign};
  }).sort((a,b)=>b.estimate-a.estimate);
  let best = options[0].move;
  let bestScore = -Infinity;
  for (const {move,next,estimate} of options.slice(0,16)) {
    let worst = estimate;
    if (!result(next)) {
      worst = Infinity;
      for (const response of moves(next)) {
        worst = Math.min(worst,score(play(next,response))*sign);
        if (worst < bestScore) break;
      }
    }
    if (worst > bestScore) {
      bestScore = worst;
      best = move;
    }
  }
  return best;
}

export function chooseSamurai(state) {
  const view = samuraiView(state);
  const oldLight = light(view.board);
  let best = null, bestScore = -Infinity;
  for (const move of samuraiAttempts(state)) {
    const {from,to,kind} = move;
    const target = view.board[to];
    const next = kind === 'probe' ? view : play(view,move);
    const targetKing = next.board.indexOf('wk');
    const kingX = targetKing%8, kingY = Math.floor(targetKing/8);
    const threat = moves({...next,turn:'b'},null,false).some(option=>option.to===targetKing);
    const glow = light(next.board);
    let merit = (value[target] ?? 0) * 2 - (threat ? 5000 : 0);
    if (kind === 'probe') merit -= 24;
    if (kind === 'wall' || kind === 'pass') merit -= 12;
    if (view.board[from] === 'wp') merit += from>=48 && from<56 ? 7 : 1;
    if (view.board[from] === 'wn') merit += Math.max(0,4-Math.abs(to%8-3.5));
    for (const i of glow) {
      const distance = Math.max(Math.abs(i%8-kingX),Math.abs(Math.floor(i/8)-kingY));
      if (distance <= 3) merit += 4-distance;
      if (!oldLight.has(i)) merit += 1.5;
    }
    if (merit > bestScore) {
      best = move;
      bestScore = merit;
    }
  }
  return best;
}
