import { chooseMove } from './engine.mjs?v=31';
self.onmessage=({data:{token,state,seen}})=>{
  try { self.postMessage({token,move:chooseMove(state,{seen})}); }
  catch { self.postMessage({token,failed:true}); }
};
