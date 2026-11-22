import { chooseMove } from './opponent.mjs?v=10';

self.onmessage = ({ data }) => {
  const { id, variant, fen, difficulty } = data;
  try {
    self.postMessage({ id, move: chooseMove(variant, fen, difficulty) });
  } catch {
    self.postMessage({ id, error: true });
  }
};
