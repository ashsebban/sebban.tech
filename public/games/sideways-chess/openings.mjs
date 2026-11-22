import { VariantChess, variants, isSidestep } from './rules.mjs?v=10';

import { openings } from './opening-games.mjs';

export function getOpeningPositions(opening) {
  const game = new VariantChess(opening.variant);
  const positions = [{ board: game.board(), move: null }];
  for (const { code } of opening.record) {
    const move = game.move({
      from: code.slice(0, 2),
      to: code.slice(2, 4),
      ...(code.length > 4 ? { promotion: code[4] } : {}),
    });
    positions.push({ board: game.board(), move });
  }
  return positions;
}

export function initializeOpenings() {
  const explorer = document.querySelector('#opening-explorer');
  const picker = document.querySelector('#opening-line');
  const preview = document.querySelector('#opening-board');
  const previous = document.querySelector('#opening-previous');
  const next = document.querySelector('#opening-next');
  const position = document.querySelector('#opening-position');
  const variant = document.querySelector('#opening-variant');
  const moves = document.querySelector('#opening-moves');
  const idea = document.querySelector('#opening-idea');
  const scrub = document.querySelector('#opening-ply');
  const key = document.querySelector('#opening-key');
  const files = 'abcdefgh';
  const cells = [];
  let positions = [];
  let step = 0;
  let active;

  openings.forEach((opening, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = opening.title;
    picker.append(option);
  });
  picker.value = '0';

  for (let index = 0; index < 64; index++) {
    const square = document.createElement('span');
    const image = document.createElement('img');
    image.className = 'piece';
    image.alt = '';
    image.hidden = true;
    const rank = 8 - Math.floor(index / 8);
    const file = index % 8;
    const dark = (rank + file) % 2 ? ' dark' : '';
    square.append(image);
    preview.append(square);
    cells.push({ square, image, name: files[file] + rank, dark });
  }

  function show() {
    const { board, move } = positions[step];
    board.flat().forEach((piece, index) => {
      const { square, image, name, dark } = cells[index];
      const highlighted = move && (move.from === name || move.to === name);
      square.className = 'opening-square' + dark + (highlighted ? ' recent' : '');
      if (piece) {
        const source = './pieces/' + piece.color + piece.type.toUpperCase() + '.svg';
        if (image.getAttribute('src') !== source) image.setAttribute('src', source);
      }
      image.hidden = !piece;
    });
    position.textContent = move
      ? Math.ceil(step / 2) + (step % 2 ? '. ' : '… ') + move.san + (isSidestep(move) ? ' ◇' : '')
      : 'Starting position';
    scrub.value = step;
    scrub.setAttribute('aria-valuetext', position.textContent);
    const record = active.record[step - 1];
    const origin = record ? record.seeded ? 'Setup move' : 'Bot move' : 'Before first move';
    const end = step === active.record.length ? ' · ' + active.result : '';
    moves.textContent = origin + ' · Half-move ' + step + ' of ' + active.record.length + end;
    preview.setAttribute('aria-label', 'Opening position after ' + position.textContent);
    const focused = document.activeElement;
    previous.disabled = step === 0;
    next.disabled = step === positions.length - 1;
    if (focused === next && next.disabled) previous.focus();
    if (focused === previous && previous.disabled) next.focus();
  }

  function load() {
    active = openings[Number(picker.value)];
    positions = getOpeningPositions(active);
    step = active.keyPly;
    scrub.max = positions.length - 1;
    variant.textContent = (variants[active.variant]?.name ?? 'Standard chess') + ' · ' + active.setup;
    idea.textContent = active.idea;
    show();
  }

  document.querySelector('#show-openings').addEventListener('click', () => {
    load();
    explorer.showModal();
  });
  picker.addEventListener('change', load);
  scrub.addEventListener('input', () => { step = Number(scrub.value); show(); });
  key.addEventListener('click', () => { step = active.keyPly; show(); });
  previous.addEventListener('click', () => { if (step > 0) { step--; show(); } });
  next.addEventListener('click', () => { if (step < positions.length - 1) { step++; show(); } });
}
