import { VariantChess, squareName } from './rules.mjs?v=8';

const material = { p: 100, n: 320, b: 335, r: 500, q: 930, k: 0 };
const mate = 100000;

function evaluate(game) {
  let score = 0;
  for (let row = 0; row < 8; row++) {
    for (let file = 0; file < 8; file++) {
      const piece = game._board[row * 16 + file];
      if (!piece) continue;
      const center = 7 - Math.abs(3.5 - file) - Math.abs(3.5 - row);
      const progress = piece.color === 'w' ? 6 - row : row - 1;
      const activity = piece.type === 'p' ? progress * 7 + center * 2
        : piece.type === 'k' ? -center * 4 : center * 6;
      const value = material[piece.type] + activity + (game.canSidestep(piece.type) ? 22 : 0);
      score += piece.color === game.turn() ? value : -value;
    }
  }
  return score;
}

const priority = move =>
  (move.promotion ? material[move.promotion] : 0) +
  (move.captured ? 10 * material[move.captured] - material[move.piece] : 0);
const ordered = moves => moves.sort((a, b) => priority(b) - priority(a));
const budgetExhausted = Symbol('budget exhausted');

export const difficulties = Object.freeze({
  easy: { depth: 1, timeMs: 140 },
  standard: { depth: 3, timeMs: 450 },
  strong: { depth: 5, timeMs: 1300 },
});

export function chooseMove(variant, fen, difficulty = 'standard', timeLimit = Infinity) {
  const { depth: maxDepth, timeMs } = difficulties[difficulty] ?? difficulties.standard;
  const game = new VariantChess(variant, fen);
  const moves = ordered(game._moves());
  if (!moves.length) return null;
  const deadline = performance.now() + Math.min(timeMs, timeLimit);
  let nodes = 0;
  let best = moves[0];

  function search(depth, alpha, beta, ply) {
    if ((++nodes & 63) === 0 && performance.now() > deadline) throw budgetExhausted;
    const legal = game._moves();
    if (!legal.length) return game.inCheck() ? -mate + ply : 0;
    if (game.isDrawByFiftyMoves() || game.isInsufficientMaterial()) return 0;
    if (depth === 0) return evaluate(game);
    for (const move of ordered(legal)) {
      game._makeMove(move);
      let value;
      try { value = -search(depth - 1, -beta, -alpha, ply + 1); }
      finally { game._undoMove(); }
      if (value >= beta) return value;
      alpha = Math.max(alpha, value);
    }
    return alpha;
  }

  for (let depth = 1; depth <= maxDepth; depth++) {
    let next = best;
    let alpha = -Infinity;
    try {
      const candidates = [best, ...moves.filter(move => move !== best)];
      for (const move of candidates) {
        game._makeMove(move);
        let value;
        try { value = -search(depth - 1, -Infinity, -alpha, 1); }
        finally { game._undoMove(); }
        if (value > alpha) {
          alpha = value;
          next = move;
        }
      }
      best = next;
    } catch (error) {
      if (error !== budgetExhausted) throw error;
      break;
    }
  }

  return { from: squareName(best.from), to: squareName(best.to), promotion: best.promotion };
}
