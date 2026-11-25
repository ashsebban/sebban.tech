import {mountMatchActions} from '../chess/match.mjs?v=1';
import {warded,cards,checks,choose,inspect,inspections,key,legalMoves,opposite,play,result,square,start} from './raid.mjs?v=9';
const get = id => document.getElementById(id);
const board = get('board'), mode = get('mode');
const faction = {b:'Shinobi',w:'Samurai'};
const roles = {k:'King',q:'Queen',r:'Rook',b:'Bishop',n:'Knight',p:'Pawn'};
const label = piece => piece==='wk' ? 'Shogun' : roles[piece[1]];
let state = start(), history = [];
let selected = null, suggestion = null, notice = '';
let handoff = false, resigned = null;
let timer, setup=false, inspecting=false, undoFloor=0;
const style=get('piece-style-toggle');
let classic=false;
style.onclick=()=>{ classic=!classic; style.textContent=classic?'Illustrated':'Classic';render(); };

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
  image.alt='';
  image.setAttribute('aria-hidden','true');
  const rank = document.createElement('span');
  rank.className = 'coord rank';
  const file = document.createElement('span');
  file.className = 'coord file';
  button.append(image,rank,file);
  button.addEventListener('click',()=>chooseSquare(orientation(display)));
  board.append(button);
  return {button,image,rank,file};
});

function render() {
  const end=ending(), side=viewer(), blackView=side==='b'&&!handoff;
  const canAct=humanTurn()&&!handoff&&!setup&&!end;
  const checking=checks(state), checked=new Set(checking.flatMap(m=>[m.from,m.to]));
  const choices=canAct&&selected!==null?legalMoves(state,selected):[];
  const available=new Map(choices.map(m=>[m.to,m]));
  const candidates=canAct?inspections(state,selected):[];
  const last=history.at(-1);
  const move=last?.move;
  const sprung=last && last.state.spy!==null && (move.captureAt??move.to)===last.state.spy && last.state.turn==='w'&&move.capture;
  get('inspect').hidden=!candidates.length;
  get('inspect').textContent=inspecting?'Cancel inspection':'Inspect a pawn';
  const mission=get('mission');
  mission.hidden=handoff||(!blackView&&!setup);
  mission.textContent=mission.hidden?'':('Target card · '+cards[state.card]+(setup?' · Select your spy pawn':state.spy!==null?' · Spy on '+square(state.spy):' · Bishops carry the mission'));
  get('move-count').textContent=setup?'Choose your spy':handoff?'':side==='w'?(state.spy===null?'Bishop hunt':state.inspection===null?'Free inspection':'Inspection used'):'Secret mission';
  board.hidden = handoff;
  get('handoff').hidden = !handoff;
  get('handoff-title').textContent = 'Pass to the '+(setup?'Shinobi':faction[state.turn]);
  for (const [display,{button,image,rank,file}] of cells.entries()) {
    const i = orientation(display);
    const tile=square(i), piece=handoff?null:state.board[i];
    const m=available.get(i);
    const marked=!handoff&&!setup&&((blackView&&i===state.spy)||(side==='w'&&state.inspection==='spy'&&state.known===i));
    const target=blackView&&!setup&&i===state.target;
    const inspectable=inspecting&&candidates.includes(i);
    button.className=['cell',i>=48&&'lit',piece==='wr'&&'lantern',piece==='br'&&'grappler',(i%8+(i>>3))%2&&'dark',i===selected&&'selected',checked.has(i)&&'checked',
      !handoff&&move&&[move.from,move.to].includes(i)&&'recent',!inspecting&&m&&'legal',!inspecting&&m?.capture&&'capture',
      ['vault','sidestep','bishopStrike','ambush'].includes(m?.kind)&&'technique',inspectable&&'search-target',marked&&'spy-mark',target&&'mission-target',i===suggestion?.to&&'hint-target'].filter(Boolean).join(' ');
    button.setAttribute('aria-pressed',String(i===selected));
    button.setAttribute('aria-label',[tile,piece&&faction[piece[0]]+' '+label(piece),marked&&'identified spy',target&&'target',inspectable&&'inspect'].filter(Boolean).join(', '));
    image.hidden=!piece;
    image.className='army-piece';
    if(piece){
      const src=classic?'../sideways-chess/pieces/'+piece[0]+piece[1].toUpperCase()+'.svg':'./art/'+piece+'.webp';
      if(image.getAttribute('src')!==src)image.src=src;
    }else image.removeAttribute('src');
    rank.textContent = display%8===0 ? tile[1] : '';
    file.textContent = display>=56 ? tile[0] : '';
  }
  get('turn').textContent = end ? end.winner ? faction[end.winner]+' win' : 'Draw' :
    faction[state.turn]+' to move'+(humanTurn() ? '' : ' · Computer')+(checking.length ? ' · Check' : '');
  if(setup)get('turn').textContent='Shinobi setup';
  get('assassin-warning').hidden = true;
  get('last').textContent=handoff?'':end?.reason??(notice || (setup?'Tap a black pawn to mark it secretly.':sprung?'Spy caught. Both pieces fell. The Shinobi bishops now hunt the target.':move?.kind==='vault'?'Grappling crew vaulted to '+square(move.to)+'.':move?.kind==='sidestep'?'Shinobi knight sidestepped to '+square(move.to)+'.':move?label(last.state.board[move.from])+' to '+square(move.to)+'.':side==='w'?'One pawn is a spy. Select a lamp rook to inspect its file for free.':'Choose a move for Black.'));
  if(!setup&&!handoff&&!end&&side==='w'&&state.known!==null)get('last').textContent+=' Inspected '+square(state.known)+' · '+state.inspection+'.';
  get('undo').disabled = (setup || handoff || history.length<=undoFloor) && !resigned;
  get('hint').disabled = !canAct;
  get('resign').disabled = !!end;
}

function chooseSquare(i) {
  if(handoff)return;
  if(setup){
    if(i<8||i>15)return;
    state={...state,spy:i};
    setup=false;
    handoff=mode.value==='both';
    nextTurn();return;
  }
  if(ending()||!humanTurn())return;
  if(inspecting){
    if(!inspections(state,selected).includes(i))return;
    state=inspect(state,selected,i);undoFloor=history.length;inspecting=false;
    notice='Inspection complete. Make your move.';render();return;
  }
  if(selected!==null&&legalMoves(state,selected).some(m=>m.to===i)){
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
        button.textContent = roles[move.promotion] ?? ({bishopStrike:'Finish the mission',ambush:'Reveal spy and ambush',move:'Normal capture'})[move.kind] ?? 'Move piece';
        button.addEventListener('click',()=>{ promotion.close(); commit(move); });
        return button;
      }));
      promotion.showModal();
    } else commit(choices[0]);
    return;
  }
  selected = i!==selected && state.board[i]?.[0]===state.turn ? i : null;
  suggestion = null;
  const tips={wr:'Lantern guards adjacent allies from ambush. Inspect one pawn on this file once per game.',wb:'Watchman: inspect a pawn on an open diagonal once per game.',br:'Grapple: vault over one friendly pawn to the empty square beyond.',bn:'Infiltrate: step one square sideways onto an empty square.',bb:state.spy===null?'Hunt: reach White’s half beside the target, then strike on a later turn.':'If the spy falls, your bishops inherit its mission.'};
  notice=selected===null?'':tips[state.board[selected]]??'';
  if(selected!==null&&state.board[selected]?.[0]==='w'&&warded(state,selected))notice+=' Guarded by a lantern.';
  render();
}

function clearTurn() {
  inspecting=false;
  selected = null;
  suggestion = null;
  notice = '';
}

function commit(move) {
  history.push({state,move});
  const before=state;
  state = play(state,move);
  if(before.spy!==null && (state.spy===null || state.ending))undoFloor=history.length;
  clearTurn();
  handoff = mode.value==='both' && !ending();
  nextTurn();
}

function nextTurn() {
  clearTimeout(timer);
  render();
  if (setup || ending() || handoff || humanTurn()) return;
  timer = setTimeout(()=>{
    if(state.turn==='w'&&state.inspection===null){
      const probes=state.board.flatMap((piece,from)=>piece?.[0]==='w'?inspections(state,from).map(to=>({from,to})):[]);
      probes.sort((a,b)=>b.to-a.to);
      if(probes.length&&probes[0].to>=24){state=inspect(state,probes[0].from,probes[0].to);undoFloor=history.length;}
    }
    const move = choose(state);
    if (move) commit(move);
  },260);
}

function restart() {
  state = start();
  setup=mode.value!=='w';undoFloor=0;
  history = [];
  clearTurn();
  handoff=mode.value==='both';
  resigned = null;
  nextTurn();
}

get('undo').addEventListener('click',()=>{
  if (resigned) resigned = null;
  else if (history.length>undoFloor) {
    do { ({state} = history.pop()); } while (!humanTurn() && history.length>undoFloor);
  }
  clearTurn();
  handoff = mode.value==='both';
  nextTurn();
});
get('inspect').onclick=()=>{inspecting=!inspecting;notice=inspecting?'Tap the pawn to inspect.':'';render();};
get('continue').addEventListener('click',()=>{ handoff=false; nextTurn(); });
mode.addEventListener('change',()=>{ get('options').close(); restart(); });
get('restart').addEventListener('click',()=>{ get('options').close(); restart(); });
get('open-menu').addEventListener('click',()=>get('options').showModal());
get('help').addEventListener('click',()=>{ get('options').close(); get('rules').showModal(); });
get('hint').addEventListener('click',()=>{
  const hint = choose(state);
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
