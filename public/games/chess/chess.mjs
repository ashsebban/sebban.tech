const games = {
  mongols: { url:'../mongols-chess/index.html', description:'Lead horse archers and checkmate the Khan.' },
  cathedral: { url:'../sideways-chess/index.html?variant=b', description:'Bishops can move one square sideways.' },
  lancer: { url:'../sideways-chess/index.html?variant=n', description:'Knights can move one square sideways.' },
  concord: { url:'../sideways-chess/index.html?variant=bn', description:'Bishops and knights can move one square sideways.' },
  squires: { url:'../sideways-chess/index.html?variant=s', description:'Knights can advance alongside friendly pawns.' },
};

const picker=document.querySelector('#variant');
const description=document.querySelector('#mode-description');
const game=document.querySelector('#game');
const frames=new Map();

function openMode(id) {
  picker.value=id;
  description.textContent=games[id].description;
  for (const [mode,frame] of frames) {
    frame.hidden=mode!==id;
    if(frame.hidden && frame.contentDocument) {
      for(const dialog of frame.contentDocument.querySelectorAll('dialog[open]')) dialog.close();
    }
  }
  if (frames.has(id)) return;
  const url=new URL(games[id].url,location.href);
  url.searchParams.set('embedded','1');
  const frame=document.createElement('iframe');
  frame.title=picker.selectedOptions[0].textContent;
  frame.addEventListener('load',()=>{
    const content=frame.contentDocument.querySelector('main');
    if(!content) return;
    const fit=()=>{
      if(!frame.hidden) frame.style.height=Math.ceil(content.getBoundingClientRect().height)+2+'px';
    };
    new ResizeObserver(fit).observe(content);
    fit();
  });
  frame.src=url.href;
  frames.set(id,frame);
  game.append(frame);
}

function readMode() {
  const requested=new URLSearchParams(location.search).get('mode');
  openMode(Object.hasOwn(games,requested) ? requested : 'mongols');
}

picker.addEventListener('change',()=>{
  const url=new URL(location.href);
  url.searchParams.set('mode',picker.value);
  history.replaceState(null,'',url);
  openMode(picker.value);
});
readMode();
