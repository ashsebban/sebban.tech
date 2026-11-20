import {
  PLAYER_X, PLAYER_SIZE, PLAYER_MODE, MODE_ORDER, LAYER_H, LAYERS,
  H, GRAVITY, JUMP_FORCE, COLORS, modeToObstacleType,
} from './config.js';

export class Player {
  constructor(p) {
    this.p = p;
    this.x = PLAYER_X;
    this.reset();
  }

  reset() {
    this.y = H / 2;
    this.mode = PLAYER_MODE.CIRCLE;
    this.velocityY = 0;
    this.squareLayer = 3;
  }

  update() {
    const p = this.p;
    if (this.mode === PLAYER_MODE.CIRCLE) {
      this.velocityY += GRAVITY;
      this.y += this.velocityY;
      this.y = p.constrain(this.y, PLAYER_SIZE / 2, H - PLAYER_SIZE / 2);
    } else if (this.mode === PLAYER_MODE.SQUARE) {
      const targetY = (this.squareLayer + 0.5) * LAYER_H;
      this.y = p.lerp(this.y, targetY, 0.25);
    }
    // Triangle stays where input puts it
  }

  cycleMode() {
    const p = this.p;
    const idx = MODE_ORDER.indexOf(this.mode);
    this.mode = MODE_ORDER[(idx + 1) % MODE_ORDER.length];
    this.velocityY = 0;
    if (this.mode === PLAYER_MODE.TRIANGLE) this.y = H - PLAYER_SIZE;
    if (this.mode === PLAYER_MODE.SQUARE)   this.squareLayer = p.floor(p.constrain(this.y / LAYER_H, 0, LAYERS - 1));
  }

  applyUpInput() {
    if (this.mode === PLAYER_MODE.CIRCLE)   this.velocityY = JUMP_FORCE;
    if (this.mode === PLAYER_MODE.SQUARE)   this.squareLayer = Math.max(0, this.squareLayer - 1);
    if (this.mode === PLAYER_MODE.TRIANGLE) this.y = PLAYER_SIZE;
  }

  applyDownInput() {
    if (this.mode === PLAYER_MODE.CIRCLE)   this.velocityY = Math.abs(JUMP_FORCE) * 0.65;
    if (this.mode === PLAYER_MODE.SQUARE)   this.squareLayer = Math.min(LAYERS - 1, this.squareLayer + 1);
    if (this.mode === PLAYER_MODE.TRIANGLE) this.y = H - PLAYER_SIZE;
  }

  draw(visible) {
    if (!visible) return;
    const { p, x, y } = this;
    const s = PLAYER_SIZE;
    p.noStroke();

    if (this.mode === PLAYER_MODE.CIRCLE) {
      p.fill(...COLORS.green);
      p.ellipse(x, y, s, s);
    } else if (this.mode === PLAYER_MODE.SQUARE) {
      p.fill(...COLORS.blue);
      p.rectMode(p.CENTER);
      p.rect(x, y, s, s, 4);
      p.rectMode(p.CORNER);
    } else {
      const onRoof = y <= PLAYER_SIZE + 1;
      p.push();
      p.translate(x, y);
      if (onRoof) p.rotate(p.PI);
      p.fill(...COLORS.red);
      p.triangle(-s / 2, s / 2, s / 2, s / 2, 0, -s / 2);
      p.pop();
    }
  }

  get modeKey() {
    if (this.mode === PLAYER_MODE.CIRCLE) return 'circle';
    if (this.mode === PLAYER_MODE.SQUARE) return 'square';
    return 'triangle';
  }

  get obstacleType() { return modeToObstacleType(this.mode); }
  get front() { return this.x + PLAYER_SIZE / 2; }
  get back()  { return this.x - PLAYER_SIZE / 2; }
  get top()   { return this.y - PLAYER_SIZE / 2; }
  get bottom(){ return this.y + PLAYER_SIZE / 2; }
}
