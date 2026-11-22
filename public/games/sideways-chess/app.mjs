import { VariantChess, isSidestep, isTandem, tandemPawnDestination, variants } from './rules.mjs?v=8';
import { chooseMove, difficulties } from './opponent.mjs?v=8';
import { initializeOpenings } from './openings.mjs?v=8';
import { initializeTutorials } from './tutorials.mjs?v=8';

const pieces = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const files = 'abcdefgh';
const board = document.querySelector('#board');
const status = document.querySelector('#status');
const activeRule = document.querySelector('#active-rule');
const undo = document.querySelector('#undo');
const moveList = document.querySelector('#moves');
const emptyMoves = document.querySelector('#empty-moves');
const promotion = document.querySelector('#promotion');
const difficulty = document.querySelector('#difficulty');
const specialLabel = document.querySelector('#special-label');
const lastMove = document.querySelector('#last-move');
try {
  const saved = localStorage.getItem('sideways-chess-difficulty');
  if (Object.hasOwn(difficulties, saved)) difficulty.value = saved;
} catch {
  // The control still works in browsing contexts that block storage.
}
const cells = new Map();

const params = new URLSearchParams(window.location.search);
const requestedVariant = params.get('variant');
const embedded = params.get('embedded')==='1';
if (embedded) document.documentElement.classList.add('embedded');
const initialVariant = Object.hasOwn(variants, requestedVariant) ? requestedVariant : 'bn';
let game = new VariantChess(initialVariant);
if (requestedVariant && Object.hasOwn(variants, requestedVariant)) {
  document.title = variants[initialVariant].name;
  document.querySelector('.intro h1').textContent = variants[initialVariant].name;
}

let history = [];
let allMoves = [];
let selection = null;
let promotionTarget = null;
let worker = null;
let epoch = 0;
let thinking = false;

for (let rank = 8; rank >= 1; rank--) {
  for (let index = 0; index < 8; index++) {
    const square = files[index] + rank;
    const cell = document.createElement('button');
    const piece = document.createElement('img');
    piece.className = 'piece';
    piece.alt = '';
    piece.draggable = false;
    piece.hidden = true;
    const baseClass = (rank + index) % 2 ? 'square dark' : 'square';
    cell.type = 'button';
    cell.tabIndex = square === 'e2' ? 0 : -1;
    cell.className = baseClass;
    cell.dataset.square = square;
    piece.setAttribute('aria-hidden', 'true');
    cell.append(piece);
    if (index === 0) addCoordinate(cell, String(rank), 'rank');
    if (rank === 1) addCoordinate(cell, files[index], 'file');
    cells.set(square, { cell, piece, baseClass });
    board.append(cell);
  }
}

function addCoordinate(cell, text, className) {
  const coordinate = document.createElement('span');
  coordinate.className = 'coord ' + className;
  coordinate.textContent = text;
  coordinate.setAttribute('aria-hidden', 'true');
  cell.append(coordinate);
}

function moveMarker(move) {
  return isSidestep(move) ? ' ◇' : isTandem(move) ? ' ⇈' : '';
}

function drawBoard() {
  const targets = new Map();
  for (const move of allMoves) {
    if (move.from === selection) targets.set(move.to, move);
  }
  const last = history.at(-1);
  const inCheck = game.inCheck();
  for (const [square, { cell, piece, baseClass }] of cells) {
    const occupant = game.get(square);
    const target = targets.get(square);
    const side = target && isSidestep(target);
    const tandem = target && isTandem(target);
    const recentPawn = last && isTandem(last) && tandemPawnDestination(last) === square;
    const checkedKing = inCheck && occupant?.type === 'k' && occupant.color === game.turn();
    const name = occupant ? (occupant.color === 'w' ? 'White ' : 'Black ') + pieces[occupant.type] : 'empty';
    const image = occupant ? './pieces/' + occupant.color + occupant.type.toUpperCase() + '.svg' : null;
    if (image && piece.getAttribute('src') !== image) piece.setAttribute('src', image);
    if (!image && !piece.hidden) piece.removeAttribute('src');
    piece.hidden = !image;
    cell.className = [
      baseClass, last && (last.to === square || last.from === square || recentPawn) && 'recent',
      selection === square && 'selected', checkedKing && 'check', target && 'legal',
      target?.captured && 'capture', (side || tandem) && 'side', tandem && 'tandem',
    ].filter(Boolean).join(' ');
    cell.setAttribute('aria-label', square + ', ' + name + (tandem ? ', tandem advance' : side ? ', sidestep' : target ? ', legal move' : ''));
    cell.setAttribute('aria-pressed', String(selection === square));
  }
}

function drawMoves() {
  moveList.replaceChildren();
  for (let index = 0; index < history.length; index += 2) {
    const row = document.createElement('li');
    for (const move of history.slice(index, index + 2)) {
      const value = document.createElement('span');
      value.textContent = move.san + moveMarker(move);
      row.append(value);
    }
    moveList.append(row);
  }
  emptyMoves.hidden = history.length > 0;
  moveList.scrollTop = moveList.scrollHeight;
}

function getResult() {
  if (!allMoves.length) {
    if (!game.inCheck()) return 'Draw by stalemate.';
    return game.turn() === 'w' ? 'Checkmate. The computer wins.' : 'Checkmate. You win!';
  }
  if (game.isDrawByFiftyMoves()) return 'Draw by the fifty-move rule.';
  if (game.isThreefoldRepetition()) return 'Draw by threefold repetition.';
  if (game.isInsufficientMaterial()) return 'Draw by insufficient material.';
  return '';
}

function refresh() {
  allMoves = game.moves({ verbose: true });
  const result = getResult();
  if (result) allMoves = [];
  activeRule.textContent = variants[game.variant].name;
  specialLabel.textContent = game.variant === 's' ? 'Tandem advance' : 'Sidestep';
  status.textContent = result || (game.turn() === 'b' ? 'Computer is thinking…'
    : game.inCheck() ? 'Your king is in check.' : 'Your move · White');
  const recent = history.at(-1);
  lastMove.hidden = !recent;
  lastMove.textContent = recent
    ? (recent.color === 'w' ? 'You played ' : 'Computer played ') + recent.san +
      moveMarker(recent)
    : '';
  undo.disabled = history.length === 0;
  drawBoard();
  drawMoves();
  return result;
}

function cancelComputer() {
  epoch++;
  thinking = false;
  worker?.terminate();
  worker = null;
}

function finishComputer(id, move) {
  if (id !== epoch || game.turn() !== 'b' || !thinking) return;
  thinking = false;
  const legal = allMoves.find(candidate => candidate.from === move?.from &&
    candidate.to === move?.to && candidate.promotion === move?.promotion) ?? allMoves[0];
  if (legal) history.push(game.move(legal));
  refresh();
}

function localComputer(id) {
  if (id !== epoch) return;
  try {
    finishComputer(id, chooseMove(game.variant, game.fen(), difficulty.value, 100));
  } catch {
    finishComputer(id, null);
  }
}

function playComputer() {
  const id = ++epoch;
  thinking = true;
  if (!worker) {
    try {
      const engine = new Worker(new URL('./worker.mjs?v=8', import.meta.url), { type: 'module' });
      worker = engine;
      engine.onmessage = ({ data }) => {
        if (engine !== worker) return;
        if (data.error) localComputer(data.id);
        else finishComputer(data.id, data.move);
      };
      engine.onerror = () => {
        if (engine !== worker) return;
        engine.terminate();
        worker = null;
        localComputer(epoch);
      };
    } catch {
      localComputer(id);
      return;
    }
  }
  worker.postMessage({ id, fen: game.fen(), variant: game.variant, difficulty: difficulty.value });
}

function makePlayerMove(move) {
  history.push(game.move(move));
  selection = null;
  if (!refresh()) playComputer();
}

function chooseSquare(square) {
  if (game.turn() !== 'w' || !allMoves.length || promotion.open) return;
  const candidate = allMoves.find(move => move.from === selection && move.to === square);
  if (candidate?.promotion) {
    promotion.returnValue = '';
    promotionTarget = { from: selection, to: square };
    promotion.showModal();
    return;
  }
  if (candidate) {
    makePlayerMove(candidate);
    return;
  }
  selection = selection !== square && game.get(square)?.color === 'w' ? square : null;
  drawBoard();
}

function giveFocus(cell) {
  for (const entry of cells.values()) entry.cell.tabIndex = entry.cell === cell ? 0 : -1;
}

board.addEventListener('click', event => {
  const cell = event.target.closest('button[data-square]');
  if (!cell) return;
  giveFocus(cell);
  chooseSquare(cell.dataset.square);
});

board.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    selection = null;
    drawBoard();
    return;
  }
  const step = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, 1], ArrowDown: [0, -1] }[event.key];
  const square = event.target.dataset.square;
  if (!step || !square) return;
  event.preventDefault();
  const nextFile = files[files.indexOf(square[0]) + step[0]];
  const nextRank = Number(square[1]) + step[1];
  const next = cells.get(nextFile + nextRank)?.cell;
  if (next) {
    giveFocus(next);
    next.focus();
  }
});

promotion.addEventListener('close', () => {
  if (promotionTarget && promotion.returnValue) {
    makePlayerMove({ ...promotionTarget, promotion: promotion.returnValue });
  }
  promotionTarget = null;
});

undo.addEventListener('click', () => {
  cancelComputer();
  game.undo();
  history.pop();
  if (game.turn() === 'b' && history.length) {
    game.undo();
    history.pop();
  }
  selection = null;
  refresh();
});

difficulty.addEventListener('change', () => {
  try {
    localStorage.setItem('sideways-chess-difficulty', difficulty.value);
  } catch {
    // The selected level applies for the current page visit.
  }
  if (thinking) {
    cancelComputer();
    playComputer();
  }
});

initializeTutorials({
  activeVariant: () => game.variant,
  fixedVariant: embedded ? initialVariant : undefined,
  startGame: variant => {
    cancelComputer();
    game = new VariantChess(variant);
    history = [];
    selection = null;
    refresh();
  },
});

initializeOpenings();
refresh();
