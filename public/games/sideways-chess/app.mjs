import { mountMatchActions } from '../chess/match.mjs?v=1';
import { VariantChess, borrowedPiece, isSidestep, isTandem, tandemPawnDestination, variants } from './rules.mjs?v=13';
import { chooseMove, difficulties } from './opponent.mjs?v=11';
import { initializeOpenings } from './openings.mjs?v=11';
import { initializeTutorials } from './tutorials.mjs?v=13';

const borrowing = { q:'queen slide', b:'bishop slide', r:'rook slide', n:'knight jump' };
const pieces = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
const files = 'abcdefgh';
const board = document.querySelector('#board');
const status = document.querySelector('#status');
mountMatchActions(document.querySelector('.match-actions'));
const settings = document.querySelector('#settings');
const applyDifficulty = document.querySelector('#apply-difficulty');
const hintButton = document.querySelector('#hint');
const resignButton = document.querySelector('#resign');
const confirmDialog = document.querySelector('#confirm-match');
const gameEnd = document.querySelector('#game-end');
const playAgain = document.querySelector('#play-again');
const undo = document.querySelector('#undo');
const moveList = document.querySelector('#moves');
const emptyMoves = document.querySelector('#empty-moves');
const promotion = document.querySelector('#promotion');
const difficulty = document.querySelector('#difficulty');
const specialLabel = document.querySelector('#special-label');
const lastMove = document.querySelector('#last-move');
let activeDifficulty = 'standard';
try {
  const saved = localStorage.getItem('sideways-chess-difficulty');
  if (Object.hasOwn(difficulties, saved)) activeDifficulty = saved;
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
function showVariantTitle() {
  document.title = variants[game.variant].name;
  document.querySelector('.intro h1').textContent = variants[game.variant].name;
}
showVariantTitle();

let history = [];
let allMoves = [];
let selection = null;
let promotionTarget = null;
let worker = null;
let epoch = 0;
let thinking = false;
let result = '';
let resigned = false;
let hint = null;
let confirmedAction = null;

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

const borrowTypes=['q','r','b','n'];
const kingBadges=new Map(['w','b'].map(side=>{
  const group=document.createElement('span');
  group.className='king-badges';
  group.setAttribute('aria-hidden','true');
  const badges=new Map(borrowTypes.map(type=>{
    const badge=document.createElement('img');
    badge.className='borrowed-piece borrowed-'+type;
    badge.src='./pieces/'+side+type.toUpperCase()+'.svg';
    badge.alt='';
    badge.hidden=true;
    group.append(badge);
    return [type,badge];
  }));
  return [side,{group,badges}];
}));

function addCoordinate(cell, text, className) {
  const coordinate = document.createElement('span');
  coordinate.className = 'coord ' + className;
  coordinate.textContent = text;
  coordinate.setAttribute('aria-hidden', 'true');
  cell.append(coordinate);
}

function moveMarker(move) {
  const borrowed=game.variant==='warrior' ? borrowedPiece(move) : null;
  if(borrowed) return ' · '+borrowing[borrowed];
  return isSidestep(move) ? ' ◇' : isTandem(move) ? ' ⇈' : '';
}

function drawBoard() {
  const targets = new Map();
  for (const move of allMoves) {
    if (move.from === selection) targets.set(move.to, move);
  }
  const last = history.at(-1);
  const inCheck = game.inCheck();
  const warrior=game.variant==='warrior';
  const surviving={w:new Set(),b:new Set()};
  const lastPower={};
  if(warrior){
    for(const ally of game.board().flat()) if(ally) surviving[ally.color].add(ally.type);
    for(const side of ['w','b']) lastPower[side]=borrowedPiece(history.findLast(move=>move.color===side));
  } else {
    for(const {group} of kingBadges.values()) group.remove();
  }
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
    const showPowers=warrior && occupant?.type==='k';
    const powers=showPowers ? borrowTypes.filter(type=>surviving[occupant.color].has(type)) : [];
    const latest=showPowers ? lastPower[occupant.color] : null;
    if(showPowers){
      const {group,badges}=kingBadges.get(occupant.color);
      for(const [type,badge] of badges){
        badge.hidden=!surviving[occupant.color].has(type);
        badge.classList.toggle('borrowed-recent',type===latest);
      }
      if(group.parentElement!==cell) cell.append(group);
    }
    cell.className = [
      baseClass, last && (last.to === square || last.from === square || recentPawn) && 'recent',
      selection === square && 'selected', hint?.to === square && 'hint-target', checkedKing && 'check', target && 'legal',
      powers.length && 'king-with-badges', target?.captured && 'capture', (side || tandem) && 'side', tandem && 'tandem',
    ].filter(Boolean).join(' ');
    cell.setAttribute('aria-label', square + ', ' + name + (tandem ? ', tandem advance' : side ? ', sidestep' : target ? ', legal move' : '') + (hint?.to === square ? ', suggested target' : '') + (powers.length ? ', borrows from '+powers.map(type=>pieces[type]).join(', ') : '') + (latest ? ', last move used a '+borrowing[latest] : ''));
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
  result = resigned ? 'You resigned. The computer wins.' : getResult();
  if (result) allMoves = [];
  gameEnd.hidden = !result;
  document.querySelector('#game-end-title').textContent = result;
  const warrior=game.variant==='warrior';
  document.querySelector('#special-key').hidden=warrior;
  const powers=document.querySelector('#warrior-powers');
  powers.hidden=!warrior;
  if (warrior) {
    powers.textContent=['w','b'].map(side=>{
      const {straight,diagonal,knight}=game.warriorPowers(side);
      const borrowed=[straight&&'straight slides',diagonal&&'diagonal slides',knight&&'knight jumps'].filter(Boolean);
      return (side==='w'?'White':'Black')+' king · '+(borrowed.join(', ') || 'one-square moves');
    }).join(' | ');
  }
  specialLabel.textContent = game.variant === 's' ? 'Tandem advance' : 'Sidestep';
  status.textContent = result ? 'Match over' : game.turn() === 'b' ? 'Computer thinking…'
    : game.inCheck() ? 'Your king is in check.' : 'Your move';
  const recent = history.at(-1);
  lastMove.hidden = !hint && !recent;
  lastMove.textContent = hint ? 'Hint: '+hint.san+moveMarker(hint)
    : recent ? (recent.color === 'w' ? 'You played ' : 'Computer played ') + recent.san + moveMarker(recent)
    : '';
  undo.disabled = resigned || history.length === 0;
  resignButton.disabled = !!result;
  hintButton.disabled = !!result || game.turn() !== 'w';
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
    finishComputer(id, chooseMove(game.variant, game.fen(), activeDifficulty, 100));
  } catch {
    finishComputer(id, null);
  }
}

function playComputer() {
  const id = ++epoch;
  thinking = true;
  if (!worker) {
    try {
      const engine = new Worker(new URL('./worker.mjs?v=11', import.meta.url), { type: 'module' });
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
  worker.postMessage({ id, fen: game.fen(), variant: game.variant, difficulty: activeDifficulty });
}

function makePlayerMove(move) {
  hint = null;
  history.push(game.move(move));
  selection = null;
  if (!refresh()) playComputer();
}

function chooseSquare(square) {
  if (game.turn() !== 'w' || !allMoves.length || promotion.open) return;
  if (hint) {
    hint = null;
    refresh();
  }
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
    hint = null;
    refresh();
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
  if (undo.disabled) return;
  hint = null;
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

function startMatch(variant = game.variant) {
  cancelComputer();
  game = new VariantChess(variant);
  history = [];
  selection = null;
  promotionTarget = null;
  hint = null;
  resigned = false;
  showVariantTitle();
  refresh();
  const cell = cells.get('e2').cell;
  giveFocus(cell);
  cell.focus();
}

function confirmMatchAction(title, description, label, action) {
  settings.close();
  document.querySelector('#confirm-title').textContent = title;
  document.querySelector('#confirm-copy').textContent = description;
  document.querySelector('#confirm-action').textContent = label;
  confirmedAction = action;
  confirmDialog.returnValue = '';
  confirmDialog.showModal();
}
confirmDialog.addEventListener('close', () => {
  const action = confirmedAction;
  confirmedAction = null;
  if (confirmDialog.returnValue === 'confirm') action?.();
});

function requestRestart(variant = game.variant) {
  if (history.length && !result) {
    confirmMatchAction('Start a new game?', 'Your current position will be lost.', 'Start new game', () => startMatch(variant));
  } else {
    settings.close();
    startMatch(variant);
  }
}
document.querySelector('#restart-game').addEventListener('click', () => requestRestart());
playAgain.addEventListener('click', () => startMatch());
document.querySelector('#open-menu').addEventListener('click', () => {
  difficulty.value = activeDifficulty;
  applyDifficulty.disabled = true;
});
difficulty.addEventListener('change', () => {
  applyDifficulty.disabled = difficulty.value === activeDifficulty;
});
document.querySelector('#difficulty-form').addEventListener('submit', event => {
  event.preventDefault();
  const next = difficulty.value;
  if (!Object.hasOwn(difficulties,next) || next === activeDifficulty) return;
  const start = () => {
    activeDifficulty = next;
    try { localStorage.setItem('sideways-chess-difficulty', next); } catch {}
    startMatch();
  };
  if (history.length && !result) {
    confirmMatchAction('Change difficulty?', 'A new game will replace this position.', 'Start new game', start);
  } else {
    settings.close();
    start();
  }
});
resignButton.addEventListener('click', () => {
  if (result) return;
  confirmMatchAction('Resign this game?', 'The computer will win this match.', 'Resign', () => {
    if (result) return;
    cancelComputer();
    resigned = true;
    selection = null;
    hint = null;
    refresh();
    playAgain.focus();
  });
});
hintButton.addEventListener('click', () => {
  if (hintButton.disabled) return;
  const move = chooseMove(game.variant, game.fen(), 'standard', 120);
  hint = allMoves.find(candidate => candidate.from === move?.from &&
    candidate.to === move?.to && candidate.promotion === move?.promotion);
  if (!hint) return;
  selection = hint.from;
  refresh();
  const cell = cells.get(selection).cell;
  giveFocus(cell);
  cell.focus();
});

initializeTutorials({
  activeVariant: () => game.variant,
  fixedVariant: embedded ? initialVariant : undefined,
  startGame: requestRestart,
});
document.querySelector('#show-openings').addEventListener('click', () => settings.close());

initializeOpenings();
refresh();
