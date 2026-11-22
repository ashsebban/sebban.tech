import { Chess, DEFAULT_POSITION, SQUARES } from './vendor/chess.mjs';

export const variants = {
  b: { name: 'Cathedral Chess', pieces: ['b'] },
  n: { name: 'Paladin Chess', pieces: ['n'] },
  bn: { name: 'Royal Court Chess', pieces: ['b', 'n'] },
  s: { name: 'Squire’s Chess', pieces: [] },
};

const squareIndex = Object.fromEntries(SQUARES.map((square, index) =>
  [square, Math.floor(index / 8) * 16 + index % 8]));
export const squareName = index => SQUARES[Math.floor(index / 16) * 8 + index % 16];
const horizontal = [-1, 1];
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

  _attacked(color, square, verbose = false) {
    const normal = super._attacked(color, square, verbose);
    if (!verbose && normal) return true;
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

    return moves.filter(move => {
      this._makeMove(move);
      const safe = !this._isKingAttacked(fromColor);
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
