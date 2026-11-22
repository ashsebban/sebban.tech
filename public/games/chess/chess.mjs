const games = {
  mongols: { category:'experimental', name:'Mongol’s Chess', art:'mongols', url:'../mongols-chess/index.html', description:'Horse archers, fortifications, and a Khan who borrows powers.' },
  cathedral: { name:'Cathedral Chess', art:'cathedral', url:'../sideways-chess/index.html?variant=b', description:'Bishops can step sideways and switch square colors.' },
  lancer: { name:'Paladin Chess', art:'paladin', url:'../sideways-chess/index.html?variant=n', description:'Knights can step sideways as well as leap.' },
  concord: { name:'Royal Court Chess', art:'royal-court', url:'../sideways-chess/index.html?variant=bn', description:'Both bishops and knights can step sideways.' },
  warrior: { name:'Warrior King Chess', art:'warrior-king', url:'../sideways-chess/index.html?variant=warrior', description:'Your king borrows moves from surviving pieces, including the queen’s long slides.' },
  squires: { name:'Squire’s Chess', art:'squires', url:'../sideways-chess/index.html?variant=s', description:'Knights can advance in tandem with friendly pawns.' },
};

const gallery=document.querySelector('#gallery');
const categories=document.querySelector('#categories');
const categoryBack=document.querySelector('#choose-category');
const matchBack=document.querySelector('#choose-variation');
const prompt=document.querySelector('#gallery-prompt');
const cardByMode=new Map();
const categoryNames={classical:'Classical variations',experimental:'Experimental variations'};
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
  (matchHeading.hidden ? document.querySelector(categories.hidden ? "#gallery a:not([hidden])" : "#categories a") : modeName)?.focus({preventScroll:true});
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
  cardByMode.set(id,card);
  card.addEventListener('click',navigate);
  gallery.append(card);
}

function openMode(id,category) {
  const mode=games[id];
  categories.hidden=!!mode || !!category;
  gallery.hidden=!!mode || !category;
  categoryBack.hidden=!category || !!mode;
  prompt.textContent=category ? categoryNames[category] : 'Choose a category to play.';
  for (const [key,card] of cardByMode) card.hidden=(games[key].category??'classical')!==category;
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
  matchBack.href='?category='+(mode.category??'classical');
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
  const params=new URLSearchParams(location.search);
  const requested=params.get('mode');
  const category=params.get('category');
  openMode(Object.hasOwn(games,requested) ? requested : null,
    Object.hasOwn(categoryNames,category) ? category : null);
}

for (const link of [matchBack,categoryBack,...categories.querySelectorAll('a')]) {
  link.addEventListener('click',navigate);
}
window.addEventListener('popstate',readMode);
readMode();
