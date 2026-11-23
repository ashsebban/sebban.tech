import { chooseMove } from './engine.mjs?v=35';
self.onmessage=({data:{token,state,seen}})=>{
  try { self.postMessage({token,move:chooseMove(state,{seen})}); }
  catch { self.postMessage({token,failed:true}); }
};
