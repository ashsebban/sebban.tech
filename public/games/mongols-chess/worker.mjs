import { chooseMove } from './engine.mjs?v=41';
self.onmessage=({data:{token,state,seen,rules}})=>{
  try { self.postMessage({token,move:chooseMove(state,{seen,rules})}); }
  catch { self.postMessage({token,failed:true}); }
};
