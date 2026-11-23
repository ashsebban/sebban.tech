import { chooseMove } from './engine.mjs?v=44';
self.onmessage=({data:{token,state,seen,rules,depth,budget}})=>{
  try { self.postMessage({token,move:chooseMove(state,{seen,rules,depth,budget})}); }
  catch { self.postMessage({token,failed:true}); }
};
