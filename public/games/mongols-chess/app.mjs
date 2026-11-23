import { apply, castles, checkThreats, khanEscapeThreats, chooseMove, defaultRules, emptyShotSquares, hasBow, indexOf, initial, isWall, khanPowers, key, moves, outcome, passMove, position, square } from './engine.mjs?v=41';

import { lessons as siegeLessons } from './lessons.mjs?v=34';

if (new URLSearchParams(location.search).get('embedded')==='1') document.documentElement.classList.add('embedded');

const medieval=document.documentElement.dataset.variant==='medieval';
const rules=medieval
  ? {...defaultRules,horseArchery:false,straightBishopShots:false,superKhan:false,kingBreachesWalls:true,bishopWallMount:true}
  : defaultRules;
const lessons=medieval ? JSON.parse(JSON.stringify(siegeLessons).replaceAll('Khan','king')) : siegeLessons;
if(medieval) {
  lessons[0].description='Advance infantry, shoot a longbow from cover, and capture with a knight.';
  lessons[0].steps[2]={pieces:{a1:'wk',h8:'bk',g5:'wn',e4:'bn'},from:'g5',to:'e4',kind:'move',prompt:'Jump from g5 to e4 to capture the black knight.'};
  lessons[0].success='You advanced infantry, fired from cover, and made a knight capture.';
  lessons[2]={
    title:'Defend with the king',
    description:'Capture an undefended piece to escape check.',
    steps:[
      {pieces:{e1:'wk',e2:'br',a8:'bk'},from:'e1',to:'e2',kind:'move',
        prompt:'The castle on e2 gives check. Move your king one square to e2 to capture it.'},
    ],
    success:'Your king captured the undefended castle and escaped check.',
  };
}
const find = selector => document.querySelector(selector);
const board = find('#board');
const styleButtons=document.querySelectorAll('.piece-style button[data-piece-style]');
const styleKey=medieval?'kings-castles.piece-style':'mongols-chess.piece-style';
let classicPieces=false;
if(styleButtons.length) {
  try { classicPieces=localStorage.getItem(styleKey)==='classic'; } catch {}
  for(const button of styleButtons) {
    button.addEventListener('click',()=>{
      classicPieces=button.dataset.pieceStyle==='classic';
      try { localStorage.setItem(styleKey,button.dataset.pieceStyle); } catch {}
      draw();
    });
  }
}
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
const names = { p:'pawn',n:medieval?'knight':'horse archer',b:'bishop',q:'queen',k:medieval?'king':'Khan',r:'castle' };
const miniature = medieval ? {k:'king',q:'queen',r:'castle',n:'knight',b:'captain',p:'infantry'} : { k:'khan', q:'khatun', r:'gate', n:'horse', b:'captain', p:'infantry' };
const color = { w:'White',b:'Black' };
const cancelShot = find('#cancel-shot');
const khanBadges = (rules.superKhan ? ['w','b'] : []).map(side=>{
  const group=document.createElement('span');
  group.className='khan-badges';
  group.setAttribute('aria-hidden','true');
  const badges=[
    ['queen','Q','Queen slides'],
    ['knight','N','Knight jumps and shoot-and-jump'],
    ['bishop','B','Wall shots'],
  ].map(([power,type,label])=>{
    const image=document.createElement('img');
    image.className='khan-badge khan-badge-'+power;
    image.src='./pieces/'+side+type+'.svg';
    image.alt='';
    image.draggable=false;
    group.append(image);
    return {power,label,image};
  });
  return {side,group,badges};
});

let state;
let history;
let seen;
let legal;
let reinforcementCastles;
let result;
let selected;
let worker=null;
let epoch=0;
let practiceHint='';
let pending=null;
let lesson=null;
let explanation='';
let reviewMate=false;
const learnDialog=find('#learn');
const checkInfo=find('#check-info');
const checkLines=document.createElementNS('http://www.w3.org/2000/svg','svg');
checkLines.setAttribute('class','check-lines');
checkLines.setAttribute('viewBox','0 0 8 8');
checkLines.setAttribute('aria-hidden','true');
board.append(checkLines);

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
  const aim=document.createElement('span');
  aim.className='aim-marker';
  aim.setAttribute('aria-hidden','true');
  aim.hidden=true;
  const bow=document.createElement('span');
  bow.className='bow-badge';
  bow.textContent='🏹';
  bow.setAttribute('aria-hidden','true');
  bow.hidden=true;
  cell.append(image,aim,bow);
  const name=square(i);
  if(i%8===0) coordinate(cell,name[1],'rank');
  if(i>=56) coordinate(cell,name[0],'file');
  cells.push({cell,image,aim,bow,base:'square'+((i%8+Math.floor(i/8))%2?' dark':'')});
  board.append(cell);
}

function description(move,before) {
  const who=color[before.turn];
  if(move.kind==='pass') return who+' had no move and passed.';
  const actor=names[before.board[move.from][1]];
  if(move.kind==='castle') return who+' castled '+(move.to>move.from?'kingside.':'queenside.');
  if(move.kind==='spawn') return who+' castle returned the '+names[move.spawn]+' on '+square(move.to)+'.';
  if(move.kind==='shot') return who+' '+actor+' shot the '+names[move.capture[1]]+' on '+square(move.to)+'.';
  if(move.kind==='jumpShot') {
    const landing=move.landingCapture ? 'captured the '+names[move.landingCapture[1]]+' on ' : 'jumped to ';
    return who+' '+actor+' on '+square(move.from)+' shot the '+names[move.capture[1]]+' on '+square(move.captureAt)+' and '+landing+square(move.to)+'.';
  }
  if(move.kind==='rally') {
    const ally=names[before.board[move.to][1]];
    return who+' king swapped with the '+ally+' on '+square(move.to)+(move.promotion?' and the pawn promoted.':'.');
  }
  const target=move.capture?' captured the '+names[move.capture[1]]+' on ':' moved to ';
  return who+' '+actor+target+square(move.to)+(move.promotion?' and promoted to a '+names[move.promotion]+'.':'.');
}

function describeThreat(threat, boardState=state.board) {
  const piece=boardState[threat.from];
  const dx=Math.abs(threat.from%8-threat.to%8);
  const dy=Math.abs(Math.floor(threat.from/8)-Math.floor(threat.to/8));
  const mode=threat.kind==='jumpShot' ? 'shoot-and-jump' : threat.kind==='shot' ? 'arrow shot'
    : dx*dy===2 ? 'knight jump' : piece[1]==='k' && Math.max(dx,dy)>1 ? 'queen slide' : 'direct attack';
  return color[piece[0]]+' '+names[piece[1]]+' on '+square(threat.from)+' · '+mode;
}

function showCheckDetails(threats) {
  const distinct=[...new Map(threats.map(t=>[[t.from,t.to,t.kind].join('/'),t])).values()];
  checkLines.replaceChildren(...distinct.map(threat=>{
    const line=document.createElementNS('http://www.w3.org/2000/svg','line');
    for (const [attribute,value] of Object.entries({x1:threat.from%8+.5,y1:Math.floor(threat.from/8)+.5,
      x2:threat.to%8+.5,y2:Math.floor(threat.to/8)+.5})) line.setAttribute(attribute,value);
    if (threat.kind!=='move' || Math.abs(threat.from%8-threat.to%8)*Math.abs(Math.floor(threat.from/8)-Math.floor(threat.to/8))===2) {
      line.setAttribute('stroke-dasharray','.17 .12');
    }
    return line;
  }));
  const attack=[...new Set(distinct.map(t=>describeThreat(t)))].join(' · ');
  const lines=[attack ? 'Check from '+attack+'.' : '',explanation];
  if(reviewMate) {
    const previous=history.at(-1);
    if(previous) lines.push('Last move: '+previous.text);
    const escapes=[...khanEscapeThreats(state,rules)].map(([to,t])=>{
      return square(to)+' is covered by '+describeThreat(t[0])+'.';
    });
    lines.push(escapes.join(' '),'No legal move removes the check.');
  }
  checkInfo.textContent=lines.filter(Boolean).join(' ');
  checkInfo.hidden=!checkInfo.textContent;
}

function showLesson() {
  find('#lesson').hidden=!lesson;
  if(!lesson) return;
  const {index,step,complete,feedback}=lesson;
  const guide=lessons[index];
  find('#lesson-title').textContent=guide.title;
  find('#lesson-prompt').textContent=complete ? guide.success :
    (feedback || ('Step '+(step+1)+' of '+guide.steps.length+' · '+guide.steps[step].prompt));
}

function openLesson(index,step=0) {
  const exercise=lessons[index].steps[step];
  const next=position(exercise.pieces);
  if(exercise.reserve) next.reserves={wp:exercise.reserve};
  reset(next,exercise.from,'',{index,step,complete:false,feedback:''});
  if(step===0) find('#lesson-title').scrollIntoView({block:'nearest'});
}

function draw() {
  for(const button of styleButtons) {
    button.setAttribute('aria-pressed',String(button.dataset.pieceStyle===(classicPieces?'classic':'illustrated')));
  }
  board.classList.toggle('classic-pieces',classicPieces);
  const targets=new Map();
  const shots=new Set();
  const range=pending || result || state.turn!=='w' || lesson?.complete
    ? new Set() : emptyShotSquares(state,selected,rules);
  if(pending) {
    for(const jump of pending.jumps) targets.set(jump.to,jump);
  } else {
    for(const move of legal) {
      if(move.from!==selected) continue;
      if(move.kind==='jumpShot') shots.add(move.captureAt);
      else if(move.kind==='shot') shots.add(move.to);
      else targets.set(move.to,move);
    }
  }
  const previous=history.at(-1);
  const threats=checkThreats(state,rules);
  const checks=new Set(threats.map(threat=>threat.to));
  showCheckDetails(threats);
  showLesson();
  for(const {side,group,badges} of khanBadges) {
    const powers=khanPowers(state.board,side);
    for(const {power,image} of badges) image.hidden=!powers[power];
    const cell=classicPieces ? cells[state.board.indexOf(side+'k')]?.cell : null;
    if(!cell) group.remove();
    else if(group.parentElement!==cell) cell.append(group);
    const selector=side==='w' ? '#khan-powers' : '#black-khan-powers';
    find(selector).textContent=badges.filter(({power})=>powers[power]).map(({label})=>label).join(' · ') || 'One-square king moves';
  }
  find('#reserve').textContent=(state.reserves?.wp??0)+' captured pawns';
  const visibleBoard=pending ? state.board.map((piece,i)=>i===pending.target ? null : piece) : state.board;
  for(let i=0;i<64;i++) {
    const {cell,image,aim,bow,base}=cells[i];
    const shootable=shots.has(i);
    aim.hidden=!shootable && !range.has(i);
    aim.classList.toggle('aim-live',shootable);
    const piece=visibleBoard[i];
    const wall=isWall(piece,i);
    const castle=piece?.[1]==='r';
    const ready=castle && !pending && !lesson?.complete && reinforcementCastles.has(i);
    const archer=hasBow(visibleBoard,i,rules);
    bow.hidden=!archer || (!classicPieces && piece?.[1]==='k');
    if(piece) {
      let role=miniature[piece[1]];
      if(wall) role='wall';
      if(piece[1]==='b' && archer) role=medieval?'longbow':'archer';
      image.dataset.role=role;
      const sprite=(!medieval && ready) ? 'gate-lit' : role;
      const spriteVersion=medieval || piece[1]==='b' ? '?v=3' : (role==='wall' || role==='horse') ? '?v=2' : '';
      const path=classicPieces ? './pieces/'+piece[0]+piece[1].toUpperCase()+'.svg'
        : (medieval?'./medieval/':'./figure-set/')+piece[0]+'-'+sprite+'.webp'+spriteVersion;
      if(image.getAttribute('src')!==path) image.setAttribute('src',path);
    }
    image.hidden=!piece;
    image.classList.toggle('reinforcement-ready',ready);
    const move=targets.get(i);
    const mark=move ? (pending ? move.landingCapture : move.capture) ? 'capture' : (pending || move.kind==='castle') ? 'move' : move.kind : '';
    const recent=previous && [previous.move.from,previous.move.to,previous.move.captureAt,previous.move.rookFrom,previous.move.rookTo].includes(i);
    const active=selected;
    cell.className=[base,classicPieces && wall && (piece[0]==='w'?'wall-north':'wall-south'),classicPieces && ready && 'gate-ready',recent&&'last',i===active&&'selected',checks.has(i)&&'in-check',mark].filter(Boolean).join(' ');
    const pieceLabel=piece?color[piece[0]]+' '+(wall?'fortified wall':names[piece[1]]):'empty';
    const action=move?.kind==='castle'?', castle here':mark==='spawn'?', return a piece here':mark==='shot'?', arrow target':mark==='rally'?', Rally swap':mark==='capture'?', legal capture':mark?', legal move':'';
    cell.setAttribute('aria-label',square(i)+', '+pieceLabel+(ready?', reinforcement available':'')+(archer?', bow equipped':'')+(checks.has(i)?', in check':'')+action+(shootable?', legal arrow shot':range.has(i)?', empty square in arrow range':''));
    cell.setAttribute('aria-pressed',String(i===active));
  }
  const count=side=> {
    const remaining=castles(state,side);
    return remaining+' '+(remaining===1?'castle':'castles')+' standing';
  };
  white.textContent=count('w');
  black.textContent=count('b');
  status.textContent=pending ? 'Choose where to jump or capture' : result ? (result.winner ? result.winner==='w' ? 'You won the siege.' : 'Black won the siege.' : 'Draw.')
    : checks.size ? color[state.turn]+' in check · '+[...checks].map(i=>names[state.board[i][1]]+' '+square(i)).join(', ')
    : state.turn==='w' ? 'Your move · White' : 'Black is thinking…';
  lastMove.textContent=result?.reason??previous?.text??practiceHint;
  cancelShot.hidden=!pending;
  undo.disabled=!!lesson || !!pending || !history.length;
}

function refresh() {
  legal=moves(state,rules);
  result=outcome(state,rules,seen[key(state)],legal);
  reinforcementCastles=new Set(result ? [] : legal.filter(move=>move.kind==='spawn').map(move=>move.from));
  if(result || state.turn==='b') legal=[];
  const justEnded=Boolean(result) && gameEnd.hidden;
  gameEnd.hidden=!result || !!lesson;
  find('#why-mate').hidden=result?.reason!=='Checkmate.';
  if(result) {
    find('#game-end-title').textContent=result.winner==='w'?'You won':result.winner==='b'?'Computer wins':'Draw';
    find('#game-end-reason').textContent=result.reason;
  }
  draw();
  if(justEnded && !lesson) playAgain.focus();
}

function abortEngine() {
  epoch++;
  worker?.terminate();
  worker=null;
}
function inspectResponse(token,move) {
  if(token!==epoch || state.turn!=='b' || result) return;
  const available=moves(state,rules);
  const answer=available.find(entry=>entry.kind===move?.kind && entry.from===move.from && entry.to===move.to && entry.captureAt===move.captureAt && entry.spawn===move.spawn && entry.promotion===move.promotion);
  if(answer) play(answer);
  else if(available[0]) play(available[0]);
}
function fallback(token) {
  if(token===epoch) inspectResponse(token,chooseMove(state,{rules,seen,budget:1700}));
}
function computer() {
  const token=++epoch;
  try {
    if(!worker) {
      const engine=new Worker(new URL('./worker.mjs?v=41',import.meta.url),{type:'module'});
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
    worker.postMessage({token,state,seen,rules});
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
  explanation='';
  if(lesson) {
    const guide=lessons[lesson.index];
    const step=guide.steps[lesson.step];
    if(move.from!==indexOf(step.from) || move.kind!==step.kind ||
      (step.to && move.to!==indexOf(step.to)) || (step.shot && move.captureAt!==indexOf(step.shot))) {
      lesson.feedback='Try the move described above. '+step.prompt;
      pending=null;
      draw();
      return;
    }
    if(lesson.step+1<guide.steps.length) {
      openLesson(lesson.index,lesson.step+1);
      return;
    }
    advance(move);
    lesson.complete=true;
    refresh();
    if(move.kind==='shot' || move.kind==='jumpShot') animateArrow(move);
    return;
  }
  advance(move);
  const choices=moves(state,rules);
  if(!choices.length && !outcome(state,rules,seen[key(state)],choices)) advance(passMove);
  refresh();
  if(move.kind==='shot' || move.kind==='jumpShot') animateArrow(move);
  if(!result && state.turn==='b') computer();
}

function focusCell(index) {
  for(let i=0;i<64;i++) cells[i].cell.tabIndex=i===index?0:-1;
}
function choose(index) {
  if(result || state.turn!=='w' || lesson?.complete) return;
  explanation='';
  if(lesson) lesson.feedback='';
  if(pending) {
    const jump=pending.jumps.find(option=>option.to===index);
    if(jump) play(jump);
    return;
  }
  const options=legal.filter(entry=>entry.from===selected);
  const jumps=options.filter(entry=>entry.kind==='jumpShot' && entry.captureAt===index);
  const choices=options.filter(entry=>entry.kind!=='jumpShot' && entry.to===index);
  const chooseJump=()=>{
    pending={target:index,jumps};
    draw();
  };
  if(jumps.length && !choices.length) { chooseJump(); return; }
  if(choices.length+jumps.length>1) {
    const buttonFor=(label,action)=>{
      const button=document.createElement('button');
      button.type='button';
      button.textContent=label;
      button.addEventListener('click',()=>{ choiceDialog.close(); action(); });
      return button;
    };
    const buttons=choices.map(move=>buttonFor(move.kind==='castle' ? 'Castle '+(move.to>move.from?'kingside':'queenside') : move.promotion ? 'Promote to '+names[move.promotion] : move.kind==='spawn' ? 'Return '+names[move.spawn]
      : move.kind==='shot' ? 'Shoot and stay' : (move.capture ? 'Move and capture' : 'Move here'),()=>play(move)));
    if(jumps.length) buttons.push(buttonFor('Shoot and jump',chooseJump));
    find('#move-options').replaceChildren(...buttons);
    choiceDialog.showModal();
    return;
  }
  if(choices.length===1) { play(choices[0]); return; }
  if(state.board[selected]==='wk' && state.board[index]?.[0]!=='w') {
    const threats=khanEscapeThreats(state,rules).get(index);
    if(threats?.length) {
      explanation=square(index)+' is unsafe: '+describeThreat(threats[0])+' would give check.';
      draw();
      return;
    }
  }
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

function reset(next,practiceSquare=null,hint='',activeLesson=null) {
  lesson=activeLesson;
  explanation='';
  reviewMate=false;
  abortEngine();
  state=next;
  history=[];
  seen={ [key(state)]:1 };
  practiceHint=hint;
  pending=null;
  selected=practiceSquare ? indexOf(practiceSquare) : null;
  focusCell(selected ?? indexOf('e2'));
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
  explanation='';
  reviewMate=false;
  abortEngine();
  do {
    const signature=key(state);
    seen[signature]--;
    state=history.pop().before;
  } while(history.length && (state.turn!=='w' || !moves(state,rules).length));
  selected=null;
  refresh();
});
for(const [index,guide] of lessons.entries()) {
  const button=document.createElement('button');
  button.type='button';
  const title=document.createElement('strong');
  title.textContent=guide.title;
  const description=document.createElement('span');
  description.textContent=guide.description;
  button.append(title,description);
  button.addEventListener('click',()=>{learnDialog.close();openLesson(index);});
  find('#lessons').append(button);
}
find('#show-learn').addEventListener('click',()=>learnDialog.showModal());
find('#lesson-retry').addEventListener('click',()=>openLesson(lesson.index));
find('#lesson-exit').addEventListener('click',()=>reset(initial()));
find('#why-mate').addEventListener('click',()=>{
  reviewMate=!reviewMate;
  draw();
  if(reviewMate) checkInfo.scrollIntoView({block:'nearest'});
});
find('#show-rules').addEventListener('click',()=>rulesDialog.showModal());
playAgain.addEventListener('click',()=>{
  reset(initial());
  cells[indexOf('e2')].cell.focus();
});
find('#new-game').addEventListener('click',()=>reset(initial()));
find('#practice').addEventListener('click',()=>{
  rulesDialog.close();
  if(medieval) {openLesson(0,2); return;}
  reset(position({a1:'wr',h1:'wr',b1:'wn',d1:'wq',d4:'wk',a8:'br',h8:'br',f4:'bn',e3:'bb',g8:'bk'}),'d4','Shoot f4 with the Khan, then jump to c6.');
});
find('#practice-bishop').addEventListener('click',()=>{
  rulesDialog.close();
  reset(position({a1:'wr',h1:'wr',b1:'wk',e3:'wb',e4:'wp',f4:'wp',g4:'wp',d3:'wp',
    a8:'br',h8:'br',f8:'bk',e5:'bp',c3:'bp',c4:'bp'}),'e3',
  medieval ? 'Shoot e5 through e4, angle a shot over d3 to c4, or slide to g3 behind the pawn line.' : 'Shoot forward over e4 to e5, shoot left over d3 to c3, or slide to g3 behind the pawn line.');
});
reset(initial());
