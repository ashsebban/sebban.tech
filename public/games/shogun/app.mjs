import {mountMatchActions} from '../chess/match.mjs?v=1';
import {assassinationThreats,attempts,checks,choose,fortifiedPawns,isAssassination,key,legalMoves,light,opposite,play,
  result,reveal,samuraiView,searches,selectSearch,square,start} from './raid.mjs?v=5';

const get = id => document.getElementById(id);
const board = get('board'), mode = get('mode'), searchButton = get('search');
const faction = {b:'Shinobi',w:'Samurai'};
const roles = {k:'King',q:'Queen',r:'Rook',b:'Bishop',n:'Knight',p:'Pawn'};
const label = piece => piece==='bb' ? 'Assassin bishop' : piece==='wk' ? 'Shogun' : roles[piece[1]];
let state = start(), history = [];
let selected = null, suggestion = null, notice = '';
let aiming = false, flash = [], handoff = false, resigned = null, riskyMove = null;
let timer;

const embedded = new URLSearchParams(location.search).get('embedded')==='1';
document.documentElement.classList.toggle('embedded',embedded);
get('standalone').hidden = embedded;
mountMatchActions(document.querySelector('.match-actions'));
const viewer = () => mode.value==='both' ? state.turn : mode.value;
const humanTurn = () => mode.value==='both' || mode.value===state.turn;
const orientation = i => mode.value==='b' ? 63-i : i;
const repetitions = () => {
  const seen = {};
  for (const position of [...history.map(entry=>entry.state),state]) {
    const id = key(position);
    seen[id] = (seen[id] ?? 0) + 1;
  }
  return seen;
};
const ending = () => resigned ?? result(state,repetitions()[key(state)]);

const cells = Array.from({length:64},(_,display)=>{
  const button = document.createElement('button');
  button.type = 'button';
  const image = document.createElement('img');
  image.alt = '';
  image.draggable = false;
  const wall = document.createElement('span');
  wall.className = 'wall';
  wall.setAttribute('aria-hidden','true');
  const rank = document.createElement('span');
  rank.className = 'coord rank';
  const file = document.createElement('span');
  file.className = 'coord file';
  button.append(image,wall,rank,file);
  button.addEventListener('click',()=>chooseSquare(orientation(display)));
  board.append(button);
  return {button,image,wall,rank,file};
});

function moveDetails(side) {
  const entry = history.at(-1);
  if (!entry) {
    return {text:side==='w' ? 'Advance your walls or develop a watchman bishop to light more of the board.' :
      'Land an assassin bishop next to the Shogun to win.', visible:[]};
  }
  const {state:before,move} = entry;
  const {from,to,capture,captureAt,promotion} = move;
  const piece = before.board[from];
  if (side==='w' && before.turn==='b') {
    const seenFrom = light(before).has(from);
    const seenTo = light(state,flash).has(to);
    const visible = [seenFrom && from,seenTo && to].filter(i=>i!==false);
    if (!seenTo) return capture ? {text:label(capture)+' captured on '+square(captureAt ?? to)+'.',visible:[captureAt ?? to]} :
      {text:'The Shinobi moved in the dark.',visible};
    return {text:'Shinobi '+label(promotion ? 'b'+promotion : piece).toLowerCase()+' spotted on '+square(to)+'.',visible};
  }
  const text = move.kind==='castle' ? 'Castled.' : label(piece)+' '+(capture ? 'captured on ' : 'moved to ')+square(to)+
    (promotion ? ' and promoted to '+roles[promotion].toLowerCase() : '')+'.';
  return {text,visible:[from,to]};
}

function render() {
  const end = ending();
  const side = viewer();
  const lit = light(state,flash);
  const walls = fortifiedPawns(state.board);
  const checking = checks(state);
  const threats = side==='w' && state.turn==='w' && !end ? assassinationThreats(state) : [];
  const assassins = new Set(threats.map(move=>move.from));
  const danger = new Set(threats.map(move=>move.to));
  const warning = assassins.size ? 'Assassin spotted. Protect the Shogun before the next Shinobi move.' : '';
  const checked = new Set(checking.flatMap(({from,to})=>[from,to]));
  const view = side==='w' ? samuraiView(state,flash).board : state.board;
  const canAct = humanTurn() && !handoff && !end;
  const destinations = !aiming && selected!=null && canAct ? attempts(state,selected,flash) : [];
  const available = new Map(destinations.map(move=>[move.to,move]));
  const aimTargets = canAct && side==='w' && !flash.length ? searches(state,selected) : [];
  const last = moveDetails(side);

  board.hidden = handoff;
  get('handoff').hidden = !handoff;
  get('handoff-title').textContent = 'Pass to the '+faction[state.turn];
  for (const [display,{button,image,wall,rank,file}] of cells.entries()) {
    const i = orientation(display);
    const tile = square(i), piece = handoff ? null : view[i];
    const fortified = piece==='wp' && walls.has(i);
    const move = available.get(i);
    const capture = move && (move.capture || piece?.[0]===opposite(side));
    const target = aiming && aimTargets.includes(i);
    const lethal = move && side==='b' && isAssassination(state,move);
    button.className = ['cell',(i%8+Math.floor(i/8))%2 && 'dark',lit.has(i) && 'lit',flash.includes(i) && 'flash',
      fortified && 'fortified',piece==='wp' && !fortified && 'torch',i===selected && 'selected',checked.has(i) && piece && 'checked',assassins.has(i) && 'assassin-threat',danger.has(i) && 'danger-square',
      !handoff && last.visible.includes(i) && 'recent',piece==='wk' && 'goal',move && 'legal',capture && 'capture',
      move?.probe && 'probe',target && 'search-target',lethal && 'lethal',i===suggestion?.to && 'hint-target'].filter(Boolean).join(' ');
    const action = target ? 'search here' : lethal ? 'assassination' : move?.probe ? 'possible capture' : move ? 'move here' : '';
    button.setAttribute('aria-pressed',String(i===selected));
    button.setAttribute('aria-label',[tile,piece && [faction[piece[0]],fortified ? 'fortified pawn' : label(piece)].join(' '),
      lit.has(i) ? 'lit' : 'dark',checked.has(i) && piece ? 'check' : '',assassins.has(i) ? 'assassin threatening the Shogun' : '',
      danger.has(i) ? 'assassination landing square' : '',action].filter(Boolean).join(', '));
    wall.hidden = !fortified;
    image.hidden = !piece;
    if (image.hidden) image.removeAttribute('src');
    else if (image.getAttribute('src')!=='./art/'+piece+'.webp') image.src = './art/'+piece+'.webp';
    rank.textContent = display%8===0 ? tile[1] : '';
    file.textContent = display>=56 ? tile[0] : '';
  }
  get('turn').textContent = end ? end.winner ? faction[end.winner]+' win' : 'Draw' :
    faction[state.turn]+' to move'+(humanTurn() ? '' : ' · Computer')+(checking.length ? ' · Check' : '');
  get('move-count').textContent = 'Move '+(Math.floor(history.length/2)+1);
  const alert = get('assassin-warning');
  alert.hidden = handoff || !warning;
  alert.textContent = handoff ? '' : warning;
  get('last').textContent = end?.reason ?? (handoff ? '' : notice || last.text);
  searchButton.hidden = side!=='w' || !canAct;
  searchButton.disabled = !aiming && !aimTargets.length;
  searchButton.textContent = aiming ? 'Cancel search' : flash.length ? 'Light used' : 'Search with light';
  get('undo').disabled = !!flash.length || (!history.length && !resigned);
  get('hint').disabled = !canAct;
  get('resign').disabled = !!end;
}

function chooseSquare(i) {
  if (ending() || !humanTurn() || handoff) return;
  if (aiming) {
    if (!searches(state,selected).includes(i)) return;
    flash = reveal(state,selected,i);
    const found = flash.filter(tile=>state.board[tile]?.[0]==='b');
    notice = found.length ? 'Spotted '+label(state.board[found[0]]).toLowerCase()+' on '+square(found[0])+'. Make your move.' :
      'No Shinobi found. Make your move.';
    aiming = false;
    suggestion = null;
    render();
    return;
  }
  if (selected!=null && attempts(state,selected,flash).some(move=>move.to===i)) {
    const choices = legalMoves(state,selected).filter(move=>move.to===i);
    if (!choices.length) {
      notice = 'That move is blocked or unsafe. Choose another move.';
      render();
    } else if (choices.length>1) {
      const promotion = get('promotion'), actions = get('promotion-actions');
      actions.replaceChildren(...choices.map(move=>{
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'quiet';
        button.textContent = roles[move.promotion];
        button.addEventListener('click',()=>{ promotion.close(); tryMove(move); });
        return button;
      }));
      promotion.showModal();
    } else tryMove(choices[0]);
    return;
  }
  selected = i!==selected && state.board[i]?.[0]===state.turn ? i : null;
  riskyMove = null;
  suggestion = null;
  notice = '';
  render();
}

function tryMove(move) {
  const id = [move.from,move.to,move.promotion].join(':');
  if (state.turn==='w' && riskyMove!==id && assassinationThreats(play(state,move)).length) {
    riskyMove = id;
    notice = 'This move risks an immediate assassination. Tap the same move again to confirm, or choose another.';
    render();
    return;
  }
  commit(move);
}

function clearTurn() {
  selected = null;
  suggestion = null;
  notice = '';
  aiming = false;
  flash = [];
  riskyMove = null;
}

function commit(move) {
  history.push({state,move});
  state = play(state,move);
  clearTurn();
  handoff = mode.value==='both' && !ending();
  nextTurn();
}

function nextTurn() {
  clearTimeout(timer);
  render();
  if (ending() || handoff || humanTurn()) return;
  timer = setTimeout(()=>{
    const search = state.turn==='w' ? selectSearch(state) : null;
    const revealed = search ? reveal(state,search.from,search.to) : [];
    const move = choose(state,revealed,repetitions());
    if (move) commit(move);
  },260);
}

function restart() {
  state = start();
  history = [];
  clearTurn();
  handoff = false;
  resigned = null;
  nextTurn();
}

searchButton.addEventListener('click',()=>{
  riskyMove = null;
  aiming = !aiming;
  suggestion = null;
  notice = aiming ? 'Choose a marked square to shine your light.' : '';
  render();
});
get('undo').addEventListener('click',()=>{
  if (flash.length) return;
  if (aiming) {
    clearTurn();
    render();
    return;
  }
  if (resigned) resigned = null;
  else if (history.length) {
    do { ({state} = history.pop()); } while (!humanTurn() && history.length);
  }
  clearTurn();
  handoff = mode.value==='both';
  nextTurn();
});
get('continue').addEventListener('click',()=>{ handoff=false; nextTurn(); });
mode.addEventListener('change',()=>{ get('options').close(); restart(); });
get('restart').addEventListener('click',()=>{ get('options').close(); restart(); });
get('open-menu').addEventListener('click',()=>get('options').showModal());
get('help').addEventListener('click',()=>{ get('options').close(); get('rules').showModal(); });
get('hint').addEventListener('click',()=>{
  riskyMove = null;
  if (state.turn==='w' && !flash.length && !assassinationThreats(state).length) {
    const search = selectSearch(state);
    if (search) {
      selected = search.from;
      suggestion = search;
      aiming = true;
      notice = 'Try searching '+square(search.to)+' from '+square(search.from)+'.';
      render();
      return;
    }
  }
  const hint = choose(state,flash,repetitions(),true);
  if (!hint) return;
  selected = hint.from;
  suggestion = hint;
  aiming = false;
  notice = 'Try '+square(hint.from)+' to '+square(hint.to)+'.';
  render();
});
get('resign').addEventListener('click',()=>get('resign-dialog').showModal());
get('confirm-resign').addEventListener('click',()=>{
  const side = viewer();
  resigned = {winner:opposite(side),reason:faction[side]+' resigned.'};
  handoff = false;
  get('resign-dialog').close();
  clearTurn();
  nextTurn();
});
restart();
