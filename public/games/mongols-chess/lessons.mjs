export const lessons = [
  {
    title:'First turns', description:'Advance a pawn, fire through the phalanx, and try a horse-archer shot.',
    steps:[
      {pieces:{a1:'wk',h8:'bk',e2:'wp'},from:'e2',to:'e4',kind:'move',
        prompt:'Advance your pawn from e2 to e4 to set up a phalanx.'},
      {pieces:{a1:'wk',h8:'bk',e3:'wb',e4:'wp',e5:'bp'},from:'e3',to:'e5',kind:'shot',
        prompt:'Shoot the pawn on e5 through your phalanx on e4.'},
      {pieces:{a1:'wk',h8:'bk',g5:'wn',e5:'bp',e4:'bn'},from:'g5',shot:'e5',to:'e4',kind:'jumpShot',
        prompt:'Shoot the pawn on e5, then jump to e4 to capture the horse archer.'},
    ],
    success:'You advanced infantry, used it for a bishop shot, and captured twice in one turn with a horse archer.',
  },
  {
    title:'Why am I in check?', description:'Read a check and find a safe escape.',
    steps:[
      {pieces:{e1:'wk',e8:'br',a8:'bk',h4:'bb'},from:'e1',kind:'move',
        prompt:'The castle on e8 and bishop on h4 both give check. Try e2 and f2 to see why they’re unsafe, then move the Khan to any safe square.'},
    ],
    success:'Your Khan escaped the check. The castle covers the e-file and the bishop covers f2 from h4.',
  },
  {
    title:'Disarm the Khan', description:'Advanced · take away the power giving check.',
    steps:[
      {pieces:{a8:'wk',e3:'wb',c6:'bk',c1:'bq'},from:'e3',to:'c1',kind:'move',
        prompt:'The black Khan on c6 is checking your Khan on a8. Find the move that takes away his long slide.'},
    ],
    success:'Taking Black’s queen removed the enemy Khan’s long slide. The check is over.',
  },
  {
    title:'Rebuild the line', description:'Return a reserve pawn and use it to support a bishop.',
    steps:[
      {pieces:{a1:'wk',h8:'bk',e3:'wb',f3:'wr',e5:'bp'},reserve:1,from:'f3',to:'e4',kind:'spawn',
        prompt:'Use the castle on f3 to return a pawn to e4.'},
      {pieces:{a1:'wk',h8:'bk',e3:'wb',f3:'wr',e4:'wp',e5:'bp'},from:'e3',to:'e5',kind:'shot',
        prompt:'Use the restored pawn on e4 to shoot the enemy pawn on e5.'},
    ],
    success:'Your castle restored the pawn formation and your bishop used it to capture.',
  },
];
