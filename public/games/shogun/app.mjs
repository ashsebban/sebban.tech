import {mountMatchActions} from '../chess/match.mjs?v=1';
import {choose,chooseSamurai,fortifiedPawns,inPalace,light,moves,opposite,play,raidLimit,resolveSamurai,result,
  samuraiAttempts,samuraiView,sector,square,start,visibleToSamurai} from './raid.mjs?v=3';

const get = id => document.getElementById(id);
const board = get('board');
const mode = get('mode');
const faction = {b:'Shinobi', w:'Samurai'};
const names = {bk:'Clan leader',bq:'Spymaster',br:'Grappling tower',bb:'Assassin',bn:'Mounted scout',bp:'Scout',
  wk:'Shogun',wq:'Court strategist',wr:'Lantern tower',wb:'Temple adviser',wn:'Patrol',wp:'Foot guard','#':'Wall'};
const verbs = {move:'move',wall:'shift wall',slip:'slip',grapple:'grapple',strike:'strike','en-passant':'capture',probe:'blind strike'};
let state = start();
let history = [];
let selected = null;
let suggestion = null;
let timer;
let handoff = false;
let resigned = null;
const embedded = new URLSearchParams(location.search).get('embedded') === '1';
document.documentElement.classList.toggle('embedded',embedded);
get('standalone').hidden = embedded;
mountMatchActions(document.querySelector('.match-actions'));
const ending = () => resigned ?? result(state);
const viewer = () => mode.value === 'both' ? state.turn : mode.value;
const turnActions = (from=null) => state.turn === 'w' ? samuraiAttempts(state,from) : moves(state,from);
const computerChoice = () => state.turn === 'w' ? chooseSamurai(state) : choose(state);
const humanTurn = () => mode.value === 'both' || mode.value === state.turn;
const orientation = i => mode.value === 'b' ? 63-i : i;

const cells = Array.from({length:64},(_,i) => {
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
  button.addEventListener('click',()=>chooseSquare(orientation(i)));
  board.append(button);
  return {button,image,wall,rank,file};
});

function moveDetails(entry, side) {
  if (!entry) return {text:side === 'b' ? 'Slip an assassin past the courtyard wall and reach the Shogun.' : 'Use lanterns and patrols to catch both assassins.', revealed:[]};
  const {state:before,move} = entry;
  const {from,to,kind,contact} = move;
  const piece = before.board[from];
  const target = before.board[to];
  if (kind === 'pass') return {text:faction[before.turn]+' passed.', revealed:[]};
  if (kind === 'blocked') return {text:side === 'w' ? 'Movement blocked. A Shinobi was spotted on '+square(contact)+'.' : 'The Samurai ran into a Shinobi.',revealed:[from,contact]};
  if (kind === 'miss') return {text:'A blind strike found nothing.',revealed:[from,to]};
  if (side === 'w' && before.turn === 'b') {
    const seenFrom = visibleToSamurai(before).has(from);
    const seenTo = visibleToSamurai(state).has(to);
    if (seenTo) return {text:names[piece]+' spotted on '+square(to)+'.',revealed:seenFrom ? [from,to] : [to]};
    if (target?.[0] === 'w' || kind === 'en-passant') {
      const capturedAt = kind === 'en-passant' ? to-8 : to;
      return {text:names[before.board[capturedAt] ?? 'wp']+' was captured in the dark.',revealed:[capturedAt]};
    }
    if (state.noise) {
      return {text:'Footsteps in the '+state.noise+' courtyard.',revealed:seenFrom ? [from] : [],heard:state.noise};
    }
    return {text:'The Shinobi moved in the shadows.',revealed:seenFrom ? [from] : []};
  }
  if (target || kind === 'en-passant') {
    const captured = target ?? (before.turn === 'b' ? 'wp' : 'bp');
    return {text:names[piece]+' captured '+names[captured]+' on '+square(to)+'.',revealed:[from,to]};
  }
  return {text:names[piece]+' moved to '+square(to)+'.',revealed:[from,to]};
}

function render() {
  const end = ending();
  const side = viewer();
  const lit = light(state.board);
  const pawnWalls = fortifiedPawns(state.board);
  const view = side === 'w' ? samuraiView(state).board : state.board;
  const available = new Map(selected === null || end || handoff ? [] : turnActions(selected).map(move=>[move.to,move]));
  const last = moveDetails(history.at(-1),side);
  board.hidden = handoff;
  get('handoff').hidden = !handoff;
  get('handoff-title').textContent = 'Pass to the '+faction[state.turn];
  for (const [display,{button,image,wall,rank,file}] of cells.entries()) {
    const i = orientation(display);
    const tile = square(i);
    const piece = handoff ? null : view[i];
    const fortified = piece === 'wp' && pawnWalls.has(i);
    const move = available.get(i);
    const heard = !handoff && i>=32 && i<40 && last.heard === sector(i);
    const capturing = move && (move.kind === 'en-passant' || (piece && move.kind !== 'wall'));
    button.className = ['cell',(i%8+Math.floor(i/8))%2 && 'dark',
      i>=48 && 'castle',i>=56 && 'castle-back',inPalace(i) && 'palace',heard && 'heard',lit.has(i) && 'lit',piece==='wr' && 'lantern',fortified && 'fortified',i===selected && 'selected',
      !handoff && last.revealed.includes(i) && 'recent',piece==='wk' && 'goal',move && 'legal',capturing && 'capture',
      ['slip','grapple'].includes(move?.kind) && 'special',move?.kind==='probe' && 'probe',
      i===suggestion?.to && 'hint-target'].filter(Boolean).join(' ');
    button.setAttribute('aria-pressed',String(i===selected));
    const terrain = lit.has(i) ? 'Lantern light' : (side==='w' ? 'Shadow' : '');
    button.setAttribute('aria-label',[tile,fortified ? 'Fortified foot guard' : piece ? names[piece] : '',terrain,heard && 'Footsteps heard in this sector',move && verbs[move.kind]].filter(Boolean).join(', '));
    wall.hidden = piece !== '#' && !fortified;
    image.hidden = !piece || piece === '#';
    if (image.hidden) image.removeAttribute('src');
    else if (image.getAttribute('src') !== './art/'+piece+'.webp') image.src = './art/'+piece+'.webp';
    rank.textContent = display%8 === 0 ? tile[1] : '';
    file.textContent = display >= 56 ? tile[0] : '';
  }
  get('turn').textContent = end ? faction[end.winner]+' win' : faction[state.turn]+' to move'+(humanTurn() ? '' : ' · Computer');
  get('clock').textContent = raidLimit-state.raids;
  get('last').textContent = end?.message ?? (handoff ? '' : suggestion ? 'Try '+square(suggestion.from)+' to '+square(suggestion.to)+'.' : last.text);
  get('undo').disabled = !history.length && !resigned;
  get('hint').disabled = !!end || !humanTurn() || handoff;
  get('resign').disabled = !!end;
}

function chooseSquare(i) {
  if (ending() || !humanTurn() || handoff) return;
  const move = selected === null ? null : turnActions(selected).find(candidate=>candidate.to===i);
  if (move) {
    commit(move);
    return;
  }
  const piece = state.board[i];
  const friendly = piece && (piece === '#' ? state.turn === 'w' : piece[0] === state.turn);
  selected = friendly && selected !== i ? i : null;
  suggestion = null;
  render();
}

function commit(attempt) {
  const move = state.turn === 'w' ? resolveSamurai(state,attempt) : attempt;
  history.push({state,move});
  state = play(state,move);
  selected = null;
  suggestion = null;
  handoff = mode.value === 'both' && !ending();
  nextTurn();
}

function nextTurn() {
  clearTimeout(timer);
  render();
  if (ending() || handoff) return;
  const forcedPass = turnActions()[0].kind === 'pass';
  if (!humanTurn() || forcedPass) timer = setTimeout(()=>commit(forcedPass ? {kind:'pass'} : computerChoice()),300);
}

function restart() {
  state = start();
  history = [];
  selected = null;
  suggestion = null;
  handoff = false;
  resigned = null;
  nextTurn();
}

get('undo').addEventListener('click',()=>{
  if (resigned) resigned = null;
  else if (history.length) {
    do {
      ({state} = history.pop());
    } while (!humanTurn() && history.length);
  }
  selected = null;
  suggestion = null;
  handoff = mode.value === 'both';
  nextTurn();
});
get('continue').addEventListener('click',()=>{
  handoff = false;
  nextTurn();
});
mode.addEventListener('change',()=>{
  get('options').close();
  restart();
});
get('restart').addEventListener('click',()=>{
  get('options').close();
  restart();
});
get('open-menu').addEventListener('click',()=>get('options').showModal());
get('help').addEventListener('click',()=>{
  get('options').close();
  get('rules').showModal();
});
get('hint').addEventListener('click',()=>{
  const hint = computerChoice();
  if (hint.kind === 'pass') return;
  suggestion = hint;
  selected = hint.from;
  render();
});
get('resign').addEventListener('click',()=>get('resign-dialog').showModal());
get('confirm-resign').addEventListener('click',()=>{
  const side = viewer();
  resigned = {winner:opposite(side),message:faction[side]+' resigned.'};
  handoff = false;
  get('resign-dialog').close();
  nextTurn();
});
restart();
