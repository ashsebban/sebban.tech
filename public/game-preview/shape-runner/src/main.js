import { Game } from './game.js';

const sketch = (p) => {
  const game = new Game(p);

  p.setup        = () => game.setup();
  p.draw         = () => game.draw();
};

new p5(sketch);
