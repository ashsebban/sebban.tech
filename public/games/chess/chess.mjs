const games = {
  mongols: { name:'Mongol’s Chess', art:'mongols', url:'../mongols-chess/index.html', description:'Horse archers, fortifications, and a Khan who borrows powers.' },
  cathedral: { name:'Cathedral Chess', art:'cathedral', url:'../sideways-chess/index.html?variant=b', description:'Bishops can step sideways and switch square colors.' },
  lancer: { name:'Paladin Chess', art:'paladin', url:'../sideways-chess/index.html?variant=n', description:'Knights can step sideways as well as leap.' },
  concord: { name:'Royal Court Chess', art:'royal-court', url:'../sideways-chess/index.html?variant=bn', description:'Both bishops and knights can step sideways.' },
  squires: { name:'Squire’s Chess', art:'squires', url:'../sideways-chess/index.html?variant=s', description:'Knights can advance in tandem with friendly pawns.' },
};

const gallery=document.querySelector('#gallery');
const galleryHeading=document.querySelector('#gallery-heading');
const matchHeading=document.querySelector('#match-heading');
const modeName=document.querySelector('#mode-name');
const game=document.querySelector('#game');
const frames=new Map();

function navigate(event) {
  if (event.button!==0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  history.pushState(null,'',event.currentTarget.href);
  readMode();
  window.scrollTo(0,0);
  (matchHeading.hidden ? gallery.querySelector("a") : modeName)?.focus({preventScroll:true});
}

for (const [id,mode] of Object.entries(games)) {
  const card=document.createElement('a');
  card.className='card';
  card.href='?mode='+id;
  const art=document.createElement('img');
  art.src='./art/'+mode.art+'.webp';
  art.alt='';
  const copy=document.createElement('div');
  copy.className='card-copy';
  const title=document.createElement('strong');
  title.textContent=mode.name;
  const description=document.createElement('span');
  description.textContent=mode.description;
  copy.append(title,description);
  card.append(art,copy);
  card.addEventListener('click',navigate);
  gallery.append(card);
}

function openMode(id) {
  const mode=games[id];
  gallery.hidden=!!mode;
  galleryHeading.hidden=!!mode;
  matchHeading.hidden=!mode;
  game.hidden=!mode;
  for (const [key,frame] of frames) {
    frame.hidden=key!==id;
    if(frame.hidden && frame.contentDocument) {
      for(const dialog of frame.contentDocument.querySelectorAll('dialog[open]')) dialog.close();
    }
  }
  if (!mode) return;
  modeName.textContent=mode.name;
  if (frames.has(id)) return;
  const url=new URL(mode.url,location.href);
  url.searchParams.set('embedded','1');
  const frame=document.createElement('iframe');
  frame.title=mode.name;
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
  openMode(Object.hasOwn(games,requested) ? requested : null);
}

document.querySelector('#choose-variation').addEventListener('click',navigate);
window.addEventListener('popstate',readMode);
readMode();
