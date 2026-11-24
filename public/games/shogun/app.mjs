import {mountMatchActions} from '../chess/match.mjs?v=1';
import {attempts,checks,choose,fortifiedPawns,isAssassination,key,legalMoves,light,opposite,play,result,samuraiView,square,start} from './raid.mjs?v=7';
const get = id => document.getElementById(id);
const board = get('board'), mode = get('mode');
const faction = {b:'Shinobi',w:'Samurai'};
const roles = {k:'King',q:'Queen',r:'Rook',b:'Bishop',n:'Knight',p:'Pawn'};
const label = piece => piece==='bb' ? 'Assassin bishop' : piece==='wk' ? 'Shogun' : roles[piece[1]];
let state = start(), history = [];
let selected = null, suggestion = null, notice = '';
let handoff = false, resigned = null;
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
    return {text:side==='w' ? 'Hold the gates. Only assassin bishops can hide.' : 'Find a gap and land a bishop beside the sleeping Shogun.', visible:[]};
  }
  const {state:before,move} = entry;
  const {from,to,capture,captureAt,promotion} = move;
  const piece = before.board[from];
  if (state.alarm && !before.alarm) return {text:'Alarm! The Shogun wakes. Cavalry answer at open barracks. Samurai to move.',visible:[]};
  if (move.kind==='aim') return {text:'The watchtower turned its lantern.',visible:[from]};
  if (move.kind==='hook') return {text:'Rope attached on '+square(to)+'. Adjacent raiders can climb.',visible:[from,to]};
  if (side==='w' && piece==='bb' && !state.alarm && !state.assassinated) return {text:capture ? label(capture)+' captured on '+square(to)+'.' : 'An assassin moved in the dark.',visible:[]};
  const text = move.kind==='castle' ? 'Castled.' : label(piece)+' '+(capture ? 'captured on ' : 'moved to ')+square(to)+
    (promotion ? ' and promoted to '+roles[promotion].toLowerCase() : '')+'.';
  return {text,visible:[from,to]};
}

function render() {
  const end = ending();
  const side = viewer();
  const lit = light(state);
  const walls = fortifiedPawns(state.board);
  const checking = checks(state);
  const checked = new Set(checking.flatMap(({from,to})=>[from,to]));
  const view = side==='w' ? samuraiView(state).board : state.board;
  const canAct = humanTurn() && !handoff && !end;
  const destinations = selected!=null && canAct ? attempts(state,selected) : [];
  const available = new Map(destinations.map(move=>[move.to,move]));
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

    const lethal = move && side==='b' && isAssassination(state,move);
    button.className = ['cell',(i%8+Math.floor(i/8))%2 && 'dark',i>=48 && 'lit',i<48 && lit.has(i) && 'watched',state.ropes.includes(i) && 'rope',
      fortified && 'fortified',i===selected && 'selected',checked.has(i) && piece && 'checked',
      !handoff && last.visible.includes(i) && 'recent',piece==='wk' && 'goal',move && 'legal',capture && 'capture',
      move?.probe && 'probe',lethal && 'lethal',i===suggestion?.to && 'hint-target'].filter(Boolean).join(' ');
    const action = lethal ? 'assassination' : move?.probe ? 'possible capture' : move ? 'move here' : '';
    button.setAttribute('aria-pressed',String(i===selected));
    button.setAttribute('aria-label',[tile,piece && [faction[piece[0]],fortified ? 'fortified pawn' : label(piece)].join(' '),
      lit.has(i) ? 'lit' : 'dark',checked.has(i) && piece ? 'check' : '',action].filter(Boolean).join(', '));
    wall.hidden = !fortified;
    image.hidden = !piece;
    if (image.hidden) image.removeAttribute('src');
    else if (image.getAttribute('src')!=='./art/'+piece+'.webp') image.src = './art/'+piece+'.webp';
    rank.textContent = display%8===0 ? tile[1] : '';
    file.textContent = display>=56 ? tile[0] : '';
  }
  get('turn').textContent = end ? end.winner ? faction[end.winner]+' win' : 'Draw' :
    faction[state.turn]+' to move'+(humanTurn() ? '' : ' · Computer')+(checking.length ? ' · Check' : '');
  get('move-count').textContent = state.alarm ? 'Alarm raised' : 'Sleeping castle';
  get('assassin-warning').hidden = true;
  get('last').textContent = end?.reason ?? (handoff ? '' : notice || last.text);
  get('undo').disabled = !history.length && !resigned;
  get('hint').disabled = !canAct;
  get('resign').disabled = !!end;
}

function chooseSquare(i) {
  if (ending() || !humanTurn() || handoff) return;
  if (selected!=null && attempts(state,selected).some(move=>move.to===i)) {
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
        button.textContent = roles[move.promotion] ?? ({hook:'Attach rope',aim:'Turn lantern',climb:'Climb rope',move:'Move piece'})[move.kind] ?? 'Move piece';
        button.addEventListener('click',()=>{ promotion.close(); commit(move); });
        return button;
      }));
      promotion.showModal();
    } else commit(choices[0]);
    return;
  }
  selected = i!==selected && state.board[i]?.[0]===state.turn ? i : null;
  suggestion = null;
  notice = selected==null ? '' : ({wr:'Select a destination or an adjacent square to aim the lantern.',br:'Select a destination or the wall directly ahead to attach a rope.'})[state.board[selected]] ?? '';
  render();
}

function clearTurn() {
  selected = null;
  suggestion = null;
  notice = '';
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
    const move = choose(state);
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

get('undo').addEventListener('click',()=>{
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
  const hint = choose(state,[],{},true);
  if (!hint) return;
  selected = hint.from;
  suggestion = hint;
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
