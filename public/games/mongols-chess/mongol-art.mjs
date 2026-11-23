// Minimal, chess-first Mongolian vector pieces. No external artwork dependencies.
const stroke='#17191a';
const p=(d,f,extra='')=>'<path d="'+d+'" fill="'+f+'" '+extra+'/>';
const ellipse=(x,y,rx,ry,f)=>'<ellipse cx="'+x+'" cy="'+y+'" rx="'+rx+'" ry="'+ry+'" fill="'+f+'"/>';
function drawing(side,role){
 const w=side==='w',body=w?'#fff0d0':'#30363c',metal=w?'#f2cd88':'#d49b50',wallColor=w?'#e7d1a3':'#55585b',red=w?'#b6412b':'#d15035',gold='#f3bd64';
 const base=p('M18 86 H82 L82 93 Q50 97 18 93 Z',body);
 const plume=p('M50 18 Q58 4 67 14 Q74 23 85 18 Q76 30 60 23 Z',red);
 const helmet=p('M32 38 Q34 24 47 23 L50 12 L53 23 Q66 25 68 38 Z',body)+p('M32 37 H69 L66 43 H35 Z',gold)+plume;
 const head=p('M38 43 H62 V55 Q50 64 38 55 Z',body);
 const trunk=p('M33 54 Q50 62 67 54 L77 85 H23 Z',body)+p('M37 58 L63 80','none','stroke="'+red+'" stroke-width="6"');
 const infantry=trunk+head+helmet+base;
 const barricade=p('M11 51 H20 V42 H30 V51 H40 V42 H50 V51 H60 V42 H70 V51 H80 V42 H89 V85 H11 Z',wallColor)+[29,49,69].map(x=>p('M'+x+' 54 V84','none','stroke="'+stroke+'" stroke-width="1.7"')).join('')+p('M43 56 H57 V85 H43 Z',red)+p('M50 61 L53 68 L60 68 L55 73 L57 79 L50 75 L43 79 L45 73 L40 68 L47 68 Z',gold);
 const infantryWall=trunk+head+helmet+barricade+base;
 const bishopBody=p('M25 56 Q50 44 74 56 L80 85 H20 Z',body)+p('M30 61 L59 81','none','stroke="'+red+'" stroke-width="5"');
 const warrior=bishopBody+head+helmet+p('M27 72 Q45 49 77 45 Q70 62 41 78 Z',metal)+p('M24 78 L36 66','none','stroke="'+stroke+'" stroke-width="4"')+base;
 const archer=bishopBody+head+helmet+p('M76 35 Q96 54 77 79','none','stroke="'+gold+'" stroke-width="4"')+p('M76 35 L77 79','none','stroke="'+stroke+'" stroke-width="2"')+p('M33 65 L83 52','none','stroke="'+metal+'" stroke-width="7"')+p('M40 61 L85 51','none','stroke="'+stroke+'" stroke-width="2"')+p('M83 48 L92 52 L83 57 Z',red)+base;
 const horse=p('M23 86 L23 70 Q17 58 27 45 L37 26 L44 32 L56 27 L68 34 Q83 39 80 49 L69 60 L62 82 L78 86 Z',body)+p('M23 54 Q36 48 52 60','none','stroke="'+red+'" stroke-width="4"')+p('M32 68 Q49 73 62 65','none','stroke="'+gold+'" stroke-width="3"')+ellipse(61,42,2.5,2.5,stroke)+base;
 const castle=p('M20 85 L25 43 H75 L80 85 Z',body)+p('M18 25 H31 V34 H43 V25 H57 V34 H69 V25 H82 V44 H18 Z',wallColor)+p('M42 54 H58 V85 H42 Z',red)+p('M50 60 L53 67 L59 67 L55 73 L57 79 L50 75 L43 79 L45 73 L41 67 L47 67 Z',gold)+base;
 const crown=p('M25 48 L20 27 L34 33 L43 19 L50 30 L57 19 L66 33 L80 27 L75 48 Z',gold)+[20,43,57,80].map((x,i)=>ellipse(x,i===0||i===3?27:19,3,3,red)).join('');
 const queen=p('M23 85 L30 49 Q50 41 70 49 L77 85 Z',body)+crown+p('M29 49 L24 72 L35 72 L42 50 Z',red)+p('M71 49 L76 72 L65 72 L58 50 Z',red)+p('M39 55 H61 V69 Q50 76 39 69 Z',body)+p('M34 77 Q50 90 66 77','none','stroke="'+gold+'" stroke-width="3"')+base;
 const khan=p('M20 85 Q23 61 36 54 H64 Q77 61 80 85 Z',body)+p('M34 54 Q22 43 29 34 Q37 24 50 28 Q63 24 71 34 Q78 43 66 54 Z',wallColor)+p('M34 31 Q36 22 49 21 L51 11 L54 21 Q65 22 66 31 Z',body)+plume+p('M39 53 Q50 66 61 53 Q62 71 50 75 Q38 71 39 53 Z',body)+ellipse(50,76,5,5,gold)+base;
 const shapes={infantry,wall:infantryWall,captain:warrior,crossbow:archer,horse,gate:castle,khatun:queen,khan};
 return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g stroke="'+stroke+'" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round">'+(shapes[role]||infantry)+'</g></svg>';
}
export function mongolPieceUrl(side,role){return 'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(drawing(side,role));}
