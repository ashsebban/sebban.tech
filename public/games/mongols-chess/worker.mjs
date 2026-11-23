import { chooseMove } from './engine.mjs?v=49';
self.onmessage=({data:{token,state,seen,rules,depth,budget}})=>{
  try { self.postMessage({token,move:chooseMove(state,{seen,rules,depth,budget})}); }
  catch { self.postMessage({token,failed:true}); }
};
