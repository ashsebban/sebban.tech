import { Chess, DEFAULT_POSITION, SQUARES } from './vendor/chess.mjs';

export const variants = {
  b: { name: 'Cathedral Chess', pieces: ['b'] },
  n: { name: 'Paladin Chess', pieces: ['n'] },
  bn: { name: 'Royal Court Chess', pieces: ['b', 'n'] },
  s: { name: 'Squire’s Chess', pieces: [] },
  warrior: { name: 'Warrior King Chess', pieces: [] },
};

const squareIndex = Object.fromEntries(SQUARES.map((square, index) =>
  [square, Math.floor(index / 8) * 16 + index % 8]));
export const squareName = index => SQUARES[Math.floor(index / 16) * 8 + index % 16];
const horizontal = [-1, 1];
const diagonal = [-17,-15,15,17];
const straight = [-16,16,-1,1];
const leaps = [-33,-31,-18,-14,14,18,31,33];
const onBoard = index => (index & 0x88) === 0;
const NORMAL = 1;
const CAPTURE = 2;

// chess.js 1.4 uses 0x88 coordinates and numeric move flags. The variant
// adapter extends pseudo-legal moves and attack detection at those hooks.
export class VariantChess extends Chess {
  constructor(variant = 'bn', fen = DEFAULT_POSITION) {
    super(fen);
    this.variant = variant;
  }

  canSidestep(type) {
    return variants[this.variant]?.pieces.includes(type) ?? false;
  }

  warriorPowers(color) {
    const army = new Set(this._board.filter(piece => piece?.color === color).map(piece => piece.type));
    return {
      straight: army.has('q') || army.has('r'),
      diagonal: army.has('q') || army.has('b'),
      knight: army.has('n'),
    };
  }

  *_borrowedDestinations(color, from, powers = this.warriorPowers(color)) {
    if (from < 0 || from == null) return;
    for (const step of [...(powers.straight ? straight : []), ...(powers.diagonal ? diagonal : [])]) {
      for (let to=from+step; onBoard(to); to+=step) {
        if (to !== from+step) yield to;
        if (this._board[to]) break;
      }
    }
    if (powers.knight) {
      for (const step of leaps) if (onBoard(from+step)) yield from+step;
    }
  }

  _attacked(color, square, verbose = false) {
    const normal = super._attacked(color, square, verbose);
    if (!verbose && normal) return true;
    if (this.variant === 'warrior') {
      const king=this._kings[color];
      const attacks=[...this._borrowedDestinations(color,king)].includes(square);
      return verbose ? (attacks ? normal.concat(squareName(king)) : normal) : attacks;
    }
    const adjacent = horizontal.map(step => square + step).filter(index => {
      if (!onBoard(index)) return false;
      const piece = this._board[index];
      return piece?.color === color && this.canSidestep(piece.type);
    });
    return verbose ? normal.concat(adjacent.map(squareName)) : adjacent.length > 0;
  }

  _moves({ legal = true, piece, square } = {}) {
    if (!variants[this.variant]) return super._moves({ legal, piece, square });
    const moves = super._moves({ legal: false, piece, square });
    const fromColor = this.turn();
    const fromSquares = square ? [squareIndex[square.toLowerCase()]] : Object.values(squareIndex);
    for (const from of fromSquares) {
      const source = this._board[from];
      if (source?.color !== fromColor || (piece && source.type !== piece.toLowerCase())) continue;
      if (this.variant === 'warrior' && source.type === 'k') {
        for (const to of this._borrowedDestinations(fromColor,from)) {
          const target=this._board[to];
          if (target?.color === fromColor || target?.type === 'k') continue;
          if (moves.some(move => move.from===from && move.to===to)) continue;
          moves.push({color:fromColor, from, to, piece:'k',
            ...(target ? {captured:target.type} : {}), flags:target ? CAPTURE : NORMAL});
        }
      }
      if (this.variant === 's' && source.type === 'n') {
        this._addTandem(moves, from, fromColor);
      }
      if (!this.canSidestep(source.type)) continue;
      for (const step of horizontal) {
        const to = from + step;
        if (!onBoard(to)) continue;
        const target = this._board[to];
        if (target?.color === fromColor) continue;
        moves.push({
          color: fromColor, from, to, piece: source.type,
          ...(target ? { captured: target.type } : {}),
          flags: target ? CAPTURE : NORMAL,
        });
      }
    }
    if (!legal) return moves;

    const enemy = fromColor === 'w' ? 'b' : 'w';
    return moves.filter(move => {
      // A king cannot capture a piece by first relying on the capture to
      // remove the opposing king's ability to defend that square.
      const defendingPowers = this.variant === 'warrior' && move.piece === 'k' &&
        move.captured && 'qrbn'.includes(move.captured) ? this.warriorPowers(enemy) : null;
      this._makeMove(move);
      const safe = !this._isKingAttacked(fromColor) && (!defendingPowers ||
        ![...this._borrowedDestinations(enemy,this._kings[enemy],defendingPowers)].includes(move.to));
      this._undoMove();
      return safe;
    });
  }

  _addTandem(moves, from, color) {
    const forward = color === 'w' ? -16 : 16;
    const to = from + forward;
    const pawnTo = to + forward;
    if (!onBoard(to) || !onBoard(pawnTo) || pawnTo < 16 || pawnTo >= 112) return;
    const pawn = this._board[to];
    if (pawn?.type === 'p' && pawn.color === color && !this._board[pawnTo]) {
      moves.push({ color, from, to, piece: 'n', flags: NORMAL, pawnTo });
    }
  }

  _makeMove(move) {
    if (move.pawnTo !== undefined) this._movePiece(move.to, move.pawnTo);
    super._makeMove(move);
    if (move.pawnTo !== undefined) this._halfMoves = 0;
  }

  _undoMove() {
    const move = super._undoMove();
    if (move?.pawnTo !== undefined) this._movePiece(move.pawnTo, move.to);
    return move;
  }

  isInsufficientMaterial() {
    if (this.variant === 'warrior' && this._board.some(piece => piece && 'bn'.includes(piece.type))) return false;
    if (this._board.some(piece => piece && this.canSidestep(piece.type))) return false;
    return super.isInsufficientMaterial();
  }
}

export function isSidestep(move) {
  return (move.piece === 'b' || move.piece === 'n') && move.from[1] === move.to[1];
}

export function isTandem(move) {
  return move.piece === 'n' && move.from[0] === move.to[0] &&
    Math.abs(Number(move.from[1]) - Number(move.to[1])) === 1;
}

export function tandemPawnDestination(move) {
  return move.to[0] + (2 * Number(move.to[1]) - Number(move.from[1]));
}


export function borrowedPiece(move) {
  if (move?.piece !== 'k' || move.flags==='k' || move.flags==='q') return null;
  const files = Math.abs(move.from.charCodeAt(0)-move.to.charCodeAt(0));
  const ranks = Math.abs(Number(move.from[1])-Number(move.to[1]));
  if (files*ranks===2) return 'n';
  if (Math.max(files,ranks)<2) return null;
  const queen=move.color==='w' ? 'Q' : 'q';
  if (move.before.split(' ')[0].includes(queen)) return 'q';
  return files===ranks ? 'b' : 'r';
}
