import { chooseMove } from './engine.mjs?v=43';
self.onmessage=({data:{token,state,seen,rules}})=>{
  try { self.postMessage({token,move:chooseMove(state,{seen,rules})}); }
  catch { self.postMessage({token,failed:true}); }
};
