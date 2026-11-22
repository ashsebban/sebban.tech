import { VariantChess, variants } from './rules.mjs?v=10';

const bishop = {
  fen: '7k/8/8/8/3B4/8/8/K7 w - - 0 1',
  from: 'd4', to: 'e4', piece: 'bishop',
  result: 'The bishop changed square color. It now travels diagonally on its new color.',
};
const knight = {
  fen: '7k/8/8/8/3N4/8/8/K7 w - - 0 1',
  from: 'd4', to: 'e4', piece: 'knight',
  result: 'The knight slid one square sideways. Its usual L-shaped leap is still available in a match.',
};

export const tutorials = {
  b: {
    summary: 'Bishops can step sideways',
    rule: 'A bishop can move one square left or right, including to capture. It can also move diagonally as usual.',
    exercises: [bishop],
  },
  n: {
    summary: 'Knights can step sideways',
    rule: 'A knight can move one square left or right, including to capture. It keeps its usual L-shaped leap.',
    exercises: [knight],
  },
  bn: {
    summary: 'Bishops and knights can step sideways',
    rule: 'Both pieces gain the same one-square sideways move, including captures. Regular moves still apply.',
    exercises: [bishop, knight],
  },
  warrior: {
    summary: 'The king borrows its army’s moves',
    rule: 'A queen gives the king long straight and diagonal moves. Rooks give straight slides, bishops give diagonal slides, and knights give L-shaped jumps. The king keeps its one-square move, and all moves must leave it safe. Pawns still move normally.',
    exercises: [{
      fen: '7k/8/8/8/3K4/8/N7/8 w - - 0 1',
      from: 'd4', to: 'f5', piece: 'king',
      result: 'The knight on a2 gives the king its leap. Lose your last knight and the king loses this move.',
    }],
  },
  s: {
    summary: 'A knight and pawn advance together',
    rule: 'When a knight sits directly behind a friendly pawn, select the knight and tap the pawn to move both forward one square. The pawn needs a clear square and must promote on its own move.',
    exercises: [{
      fen: '7k/8/8/8/4P3/4N3/8/K7 w - - 0 1',
      from: 'e3', to: 'e4', piece: 'knight',
      result: 'The pawn advanced to e5 and the knight followed onto e4 in the same turn.',
    }],
  },
};

export function initializeTutorials({ activeVariant, startGame, fixedVariant }) {
  const settings = document.querySelector('#settings');
  const overview = document.querySelector('#settings-overview');
  const options = document.querySelector('#variant-options');
  const tutorial = document.querySelector('#variant-tutorial');
  const name = document.querySelector('#tutorial-name');
  const rule = document.querySelector('#tutorial-rule');
  const board = document.querySelector('#tutorial-board');
  const status = document.querySelector('#tutorial-status');
  const next = document.querySelector('#tutorial-next');
  const start = document.querySelector('#new-game');
  const back = document.querySelector('#tutorial-back');
  const cells = new Map();
  const buttons = new Map();
  const files = 'abcdefgh';
  const pieceNames = { p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king' };
  let mode;
  let exercise;
  let step;
  let position;
  let stage;

  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const square = files[file] + rank;
      const cell = document.createElement('button');
      const image = document.createElement('img');
      image.className = 'piece';
      image.alt = '';
      image.draggable = false;
      cell.type = 'button';
      cell.dataset.tutorialSquare = square;
      cell.append(image);
      const base = 'opening-square tutorial-square' + ((rank + file) % 2 ? ' dark' : '');
      cells.set(square, { cell, image, base });
      board.append(cell);
    }
  }

  function draw() {
    for (const [square, { cell, image, base }] of cells) {
      const occupant = position.get(square);
      if (occupant) image.src = './pieces/' + occupant.color + occupant.type.toUpperCase() + '.svg';
      image.hidden = !occupant;
      const highlighted = stage === 'select' && square === exercise.from;
      const selected = stage === 'move' && square === exercise.from;
      const goal = stage === 'move' && square === exercise.to;
      const finished = stage === 'done' && square === exercise.to;
      cell.className = [base, (highlighted || selected || finished) && 'recent', goal && 'tutorial-target'].filter(Boolean).join(' ');
      cell.tabIndex = highlighted || goal ? 0 : -1;
      cell.setAttribute('aria-label', square + (occupant ? ', ' + pieceNames[occupant.type] : ', empty') + (goal ? ', target' : ''));
    }
    next.hidden = stage !== 'done' || step + 1 >= tutorials[mode].exercises.length;
  }

  function loadExercise() {
    exercise = tutorials[mode].exercises[step];
    position = new VariantChess(mode, exercise.fen);
    stage = 'select';
    const count = tutorials[mode].exercises.length;
    status.textContent = (count > 1 ? 'Exercise ' + (step + 1) + ' of ' + count + '. ' : '') +
      'Tap the ' + exercise.piece + ' on ' + exercise.from + '.';
    draw();
  }

  function showTutorial(id) {
    mode = id;
    step = 0;
    name.textContent = variants[id].name;
    rule.textContent = tutorials[id].rule;
    overview.hidden = true;
    tutorial.hidden = false;
    loadExercise();
    cells.get(exercise.from).cell.focus({ preventScroll: true });
  }

  for (const [id, lesson] of Object.entries(tutorials)) {
    if (fixedVariant && id!==fixedVariant) continue;
    const button = document.createElement('button');
    const title = document.createElement('strong');
    const summary = document.createElement('small');
    button.type = 'button';
    button.className = 'variant-option';
    title.textContent = variants[id].name;
    summary.textContent = lesson.summary;
    button.append(title);
    button.append(summary);
    button.addEventListener('click', () => showTutorial(id));
    options.append(button);
    buttons.set(id, button);
  }

  board.addEventListener('click', event => {
    const square = event.target.closest('button[data-tutorial-square]')?.dataset.tutorialSquare;
    if (stage === 'select' && square === exercise.from) {
      stage = 'move';
      status.textContent = 'Now tap ' + exercise.to + '.';
      draw();
      cells.get(exercise.to).cell.focus({ preventScroll: true });
    } else if (stage === 'move' && square === exercise.to) {
      position.move({ from: exercise.from, to: exercise.to });
      stage = 'done';
      status.textContent = exercise.result;
      draw();
      (next.hidden ? start : next).focus({ preventScroll: true });
    }
  });

  next.addEventListener('click', () => {
    step++;
    loadExercise();
    cells.get(exercise.from).cell.focus({ preventScroll: true });
  });

  back.addEventListener('click', () => {
    tutorial.hidden = true;
    overview.hidden = false;
    buttons.get(mode)?.focus();
  });

  document.querySelector('#show-settings').addEventListener('click', () => {
    tutorial.hidden = true;
    overview.hidden = false;
    for (const [id, button] of buttons) button.classList.toggle('active-variant', id === activeVariant());
    settings.showModal();
  });

  start.addEventListener('click', () => {
    settings.close();
    startGame(mode);
  });
}
