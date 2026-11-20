import { apply, castles, chooseMove, defaultRules, indexOf, initial, isWall, key, moves, outcome, passMove, position, square } from './engine.mjs?v=15';

const find = selector => document.querySelector(selector);
const board = find('#board');
const choiceDialog = find('#move-choice');
const status = find('#status');
const lastMove = find('#last-move');
const undo = find('#undo');
const gameEnd = find('#game-end');
const playAgain = find('#play-again');
const rulesDialog = find('#rules');
const white = find('#white-castles');
const black = find('#black-castles');
const cells = [];
const names = { p:'pawn',n:'horse archer',b:'bishop',q:'queen',k:'king',r:'castle' };
const color = { w:'White',b:'Black' };
const cancelShot = find('#cancel-shot');

let state;
let history;
let seen;
let legal;
let result;
let selected;
let worker=null;
let epoch=0;
let practicing=false;
let pending=null;

function coordinate(cell,text,type) {
  const label=document.createElement('span');
  label.className='coord '+type;
  label.textContent=text;
  label.setAttribute('aria-hidden','true');
  cell.append(label);
}
for(let i=0;i<64;i++) {
  const cell=document.createElement('button');
  const image=document.createElement('img');
  cell.type='button';
  cell.dataset.square=String(i);
  cell.tabIndex=square(i)==='e2'?0:-1;
  image.alt='';
  image.className='piece';
  image.draggable=false;
  cell.append(image);
  const name=square(i);
  if(i%8===0) coordinate(cell,name[1],'rank');
  if(i>=56) coordinate(cell,name[0],'file');
  cells.push({cell,image,base:'square'+((i%8+Math.floor(i/8))%2?' dark':'')});
  board.append(cell);
}

function description(move,before) {
  const who=color[before.turn];
  if(move.kind==='pass') return who+' had no move and passed.';
  const actor=names[before.board[move.from][1]];
  if(move.kind==='spawn') return who+' castle returned the '+names[move.spawn]+' on '+square(move.to)+'.';
  if(move.kind==='shot') return who+' '+actor+' shot the '+names[move.capture[1]]+' on '+square(move.to)+'.';
  if(move.kind==='jumpShot') {
    const landing=move.landingCapture ? 'captured the '+names[move.landingCapture[1]]+' on ' : 'jumped to ';
    return who+' shot the '+names[move.capture[1]]+' on '+square(move.captureAt)+' and '+landing+square(move.to)+'.';
  }
  if(move.kind==='rally') {
    const ally=names[before.board[move.to][1]];
    return who+' king swapped with the '+ally+' on '+square(move.to)+(move.promotion?' and the pawn promoted.':'.');
  }
  const target=move.capture?' captured the '+names[move.capture[1]]+' on ':' moved to ';
  return who+' '+actor+target+square(move.to)+(move.promotion?' and promoted to a queen.':'.');
}

function draw() {
  const targets=new Map();
  if(pending) {
    for(const jump of pending.jumps) targets.set(jump.to,jump);
  } else {
    for(const move of legal) if(move.from===selected) targets.set(move.kind==='jumpShot' ? move.captureAt : move.to,move);
  }
  const previous=history.at(-1);
  find('#reserve').textContent=(state.reserves?.wp??0)+' captured pawns';
  for(let i=0;i<64;i++) {
    const {cell,image,base}=cells[i];
    const piece=pending?.target===i ? null : state.board[i];
    if(piece){
      const path='./pieces/'+piece[0]+piece[1].toUpperCase()+'.svg';
      if(image.getAttribute('src')!==path) image.setAttribute('src',path);
    }
    image.hidden=!piece;
    const castle=piece?.[1]==='r';
    const wall=isWall(piece,i);
    const move=targets.get(i);
    const mark=move ? pending ? (move.landingCapture ? 'capture' : 'move') : (move.kind==='jumpShot' || move.kind==='shot') ? 'shot' : move.capture ? 'capture' : move.kind : '';
    const recent=previous && [previous.move.from,previous.move.to,previous.move.captureAt].includes(i);
    const active=selected;
    cell.className=[base,recent&&'last',i===active&&'selected',castle&&'castle-square',castle&&'castle-'+piece[0],wall&&'wall-square',mark].filter(Boolean).join(' ');
    const pieceLabel=piece?color[piece[0]]+' '+names[piece[1]]:'empty';
    const action=mark==='spawn'?', return a piece here':mark==='shot'?', arrow target':mark==='rally'?', Rally swap':mark==='capture'?', legal capture':mark?', legal move':'';
    cell.setAttribute('aria-label',square(i)+', '+pieceLabel+(castle?', fixed in place':'')+(wall?', protected wall':'')+action);
    cell.setAttribute('aria-pressed',String(i===active));
  }
  const count=side=> {
    const remaining=castles(state,side);
    return remaining+' '+(remaining===1?'castle':'castles')+' standing';
  };
  white.textContent=count('w');
  black.textContent=count('b');
  status.textContent=pending ? 'Choose where the archer jumps' : result ? (result.winner ? result.winner==='w' ? 'You won the siege.' : 'Black won the siege.' : 'Draw.')
    : state.turn==='w' ? 'Your move · White' : 'Black is thinking…';
  lastMove.textContent=result?.reason??previous?.text??(practicing?'Capture the castle on a8 with the horse archer on b6.':'');
  cancelShot.hidden=!pending;
  undo.disabled=!!pending || !history.length;
}

function refresh() {
  legal=moves(state);
  result=outcome(state,defaultRules,seen[key(state)],legal);
  if(result || state.turn==='b') legal=[];
  const justEnded=Boolean(result) && gameEnd.hidden;
  gameEnd.hidden=!result;
  if(result) {
    find('#game-end-title').textContent=result.winner==='w'?'You won':result.winner==='b'?'Computer wins':'Draw';
    find('#game-end-reason').textContent=result.reason;
  }
  draw();
  if(justEnded) playAgain.focus();
}

function abortEngine() {
  epoch++;
  worker?.terminate();
  worker=null;
}
function inspectResponse(token,move) {
  if(token!==epoch || state.turn!=='b' || result) return;
  const available=moves(state);
  const answer=available.find(entry=>entry.kind===move?.kind && entry.from===move.from && entry.to===move.to && entry.captureAt===move.captureAt && entry.spawn===move.spawn);
  if(answer) play(answer);
  else if(available[0]) play(available[0]);
}
function fallback(token) {
  if(token===epoch) inspectResponse(token,chooseMove(state,{seen,budget:1700}));
}
function computer() {
  const token=++epoch;
  try {
    if(!worker) {
      const engine=new Worker(new URL('./worker.mjs?v=15',import.meta.url),{type:'module'});
      worker=engine;
      engine.onmessage=({data})=>{
        if(engine!==worker) return;
        if(data.failed) fallback(data.token);
        else inspectResponse(data.token,data.move);
      };
      engine.onerror=()=>{
        if(engine!==worker) return;
        engine.terminate();
        worker=null;
        fallback(epoch);
      };
    }
    worker.postMessage({token,state,seen});
  } catch { fallback(token); }
}

function advance(move) {
  history.push({before:state,move,text:description(move,state)});
  state=apply(state,move);
  const signature=key(state);
  seen[signature]=(seen[signature]??0)+1;
  selected=null;
  pending=null;
}

function animateArrow(move) {
  const target=move.kind==='jumpShot' ? move.captureAt : move.to;
  const arrow=document.createElement('span');
  arrow.className='flying-arrow';
  arrow.setAttribute('aria-hidden','true');
  arrow.textContent='➝';
  const center=index=>({x:(index%8+.5)*12.5,y:(Math.floor(index/8)+.5)*12.5});
  const from=center(move.from), to=center(target);
  const angle=Math.atan2(to.y-from.y,to.x-from.x);
  const transform='translate(-50%, -50%) rotate('+angle+'rad)';
  const start={left:from.x+'%',top:from.y+'%',transform};
  const end={left:to.x+'%',top:to.y+'%',transform};
  Object.assign(arrow.style,end);
  board.append(arrow);
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const flight=arrow.animate(reduced ? [{opacity:1},{opacity:0}]
    : [start,{...end,offset:.76,opacity:1},{...end,opacity:0}],{duration:reduced?220:460});
  flight.finished.then(()=>arrow.remove(),()=>arrow.remove());
}

function play(move) {
  advance(move);
  const choices=moves(state);
  if(!choices.length && !outcome(state,defaultRules,seen[key(state)],choices)) advance(passMove);
  refresh();
  if(move.kind==='shot' || move.kind==='jumpShot') animateArrow(move);
  if(!result && state.turn==='b') computer();
}

function focusCell(index) {
  for(let i=0;i<64;i++) cells[i].cell.tabIndex=i===index?0:-1;
}
function choose(index) {
  if(result || state.turn!=='w') return;
  if(pending) {
    const jump=pending.jumps.find(option=>option.to===index);
    if(jump) play(jump);
    return;
  }
  const options=legal.filter(entry=>entry.from===selected);
  const jumps=options.filter(entry=>entry.kind==='jumpShot' && entry.captureAt===index);
  if(jumps.length) {
    pending={target:index,jumps};
    draw();
    return;
  }
  const choices=options.filter(entry=>entry.kind!=='jumpShot' && entry.to===index);
  if(choices.length>1) {
    const buttons=choices.map(move=>{
      const button=document.createElement('button');
      button.type='button';
      button.textContent=move.kind==='spawn' ? 'Return '+names[move.spawn]
        : move.kind==='shot' ? 'Shoot and stay' : 'Move and capture';
      button.addEventListener('click',()=>{ choiceDialog.close(); play(move); });
      return button;
    });
    find('#move-options').replaceChildren(...buttons);
    choiceDialog.showModal();
    return;
  }
  if(choices.length===1) { play(choices[0]); return; }
  selected=selected!==index && state.board[index]?.[0]==='w'?index:null;
  draw();
}

board.addEventListener('click',event=>{
  const button=event.target.closest('button[data-square]');
  if(!button) return;
  const index=Number(button.dataset.square);
  focusCell(index);
  choose(index);
});
board.addEventListener('keydown',event=>{
  const index=Number(event.target.dataset.square);
  const directions={ArrowLeft:[-1,0],ArrowRight:[1,0],ArrowUp:[0,-1],ArrowDown:[0,1]};
  if(event.key==='Escape'){ selected=null; pending=null; draw(); return; }
  const step=directions[event.key];
  if(!step || !Number.isInteger(index)) return;
  event.preventDefault();
  const x=index%8+step[0], y=Math.floor(index/8)+step[1];
  if(x<0 || x>=8 || y<0 || y>=8) return;
  const next=y*8+x;
  focusCell(next);
  cells[next].cell.focus();
});

function reset(next,practice=false) {
  abortEngine();
  state=next;
  history=[];
  seen={ [key(state)]:1 };
  practicing=practice;
  pending=null;
  selected=practice?indexOf('b6'):null;
  focusCell(practice?indexOf('b6'):indexOf('e2'));
  refresh();
}
cancelShot.addEventListener('click',()=>{
  if(!pending) return;
  pending=null;
  draw();
  focusCell(selected);
  cells[selected].cell.focus();
});
undo.addEventListener('click',()=>{
  if(!history.length) return;
  abortEngine();
  do {
    const signature=key(state);
    seen[signature]--;
    state=history.pop().before;
  } while(history.length && (state.turn!=='w' || !moves(state).length));
  selected=null;
  refresh();
});
find('#show-rules').addEventListener('click',()=>rulesDialog.showModal());
playAgain.addEventListener('click',()=>{
  reset(initial());
  cells[indexOf('e2')].cell.focus();
});
find('#new-game').addEventListener('click',()=>reset(initial()));
find('#practice').addEventListener('click',()=>{
  rulesDialog.close();
  reset(position({a1:'wr',h1:'wr',a2:'wk',b2:'wp',d4:'wq',b6:'wn',d2:'wb',
    a8:'br',h8:'br',h6:'bk',f7:'bp',g6:'bn',d8:'bq',h7:'bp'}),true);
});
reset(initial());
