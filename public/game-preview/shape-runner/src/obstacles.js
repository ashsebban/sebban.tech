import {
  W, H, LAYERS, LAYER_H, WALL_WIDTH, RESPAWN_DELAY_FRAMES,
  OBSTACLE_TYPE, BLOCK_RULES, COLORS, BLACK_CHANCE,
} from './config.js';

export class WallManager {
  constructor(p) {
    this.p = p;
    this.walls = [];
    this.nextObstacleType = 0;
    this.wallTimer = 0;
  }

  reset() {
    this.walls = [];
    this.nextObstacleType = this.p.floor(this.p.random(3));
    this.wallTimer = 0;
  }

  // Move walls and spawn new ones. Returns 'fail' | { scored: true } | null per wall event.
  update(scrollSpeed, player, onScore, onFail) {
    const p = this.p;

    for (const w of this.walls) w.x -= scrollSpeed;
    this.walls = this.walls.filter((w) => w.x + WALL_WIDTH > -10);

    for (const w of this.walls) {
      // Mode/obstacle mismatch check on entry
      if (!w.entered && w.x <= player.front) {
        w.entered = true;
        if (w.type !== player.obstacleType) { onFail(); return; }
      }
      // Score when fully passed
      if (!w.scored && w.x + WALL_WIDTH < player.back) {
        w.scored = true;
        onScore();
      }
    }

    if (this.walls.length === 0) {
      if (this.wallTimer <= 0) {
        this._spawnWall();
        this.wallTimer = RESPAWN_DELAY_FRAMES;
      } else {
        this.wallTimer--;
      }
    }
  }

  // Returns true if player physically overlaps a blocking brick.
  checkCollision(player) {
    const { y, top, bottom, front, back, modeKey } = player;
    const pr = 19; // PLAYER_SIZE / 2

    for (const w of this.walls) {
      if (w.x > front + 5 || w.x + WALL_WIDTH < back - 5) continue;
      for (const b of w.bricks) {
        const bTop = b.layer * LAYER_H;
        const bBot = bTop + LAYER_H;
        if (top >= bBot || bottom <= bTop) continue; // no vertical overlap
        if (b.blocks[modeKey]) return true;
      }
    }
    return false;
  }

  // Returns true if near-miss detected (for camera feedback). Does not trigger fail.
  checkNearMiss(player) {
    const { top, bottom, front, back, modeKey } = player;
    for (const w of this.walls) {
      if (w.x > front + 5 || w.x + WALL_WIDTH < back - 5) continue;
      for (const b of w.bricks) {
        const bTop = b.layer * LAYER_H;
        const bBot = bTop + LAYER_H;
        if (top >= bBot || bottom <= bTop) {
          if (b.blocks[modeKey]) {
            if (Math.abs(top - bBot) <= 4 || Math.abs(bottom - bTop) <= 4) return true;
          }
        }
      }
    }
    return false;
  }

  draw() {
    const p = this.p;
    p.noStroke();
    for (const w of this.walls) {
      for (const b of w.bricks) {
        p.fill(b.color[0], b.color[1], b.color[2]);
        p.rect(w.x, b.layer * LAYER_H + 1, WALL_WIDTH, LAYER_H - 2, 3);
      }
    }
  }

  drawObstacleIcon(cx, cy, type, size = 10) {
    const p = this.p;
    p.noStroke();
    if (type === OBSTACLE_TYPE.CIRCLE_BLOCKER) {
      p.fill(...COLORS.green);
      p.ellipse(cx, cy, size, size);
    } else if (type === OBSTACLE_TYPE.SQUARE_BLOCKER) {
      p.fill(...COLORS.blue);
      p.rectMode(p.CENTER);
      p.rect(cx, cy, size, size, 2);
      p.rectMode(p.CORNER);
    } else {
      p.fill(...COLORS.red);
      p.triangle(cx - size / 2, cy + size / 2, cx + size / 2, cy + size / 2, cx, cy - size / 2);
    }
  }

  // ── Private spawners ───────────────────────────────────────────────────────

  _spawnWall() {
    const p = this.p;
    const obstacleType = this.nextObstacleType;
    this.nextObstacleType = p.floor(p.random(3));

    let bricks;
    if (obstacleType === OBSTACLE_TYPE.CIRCLE_BLOCKER)   bricks = this._spawnCircle();
    else if (obstacleType === OBSTACLE_TYPE.SQUARE_BLOCKER) bricks = this._spawnSquare();
    else bricks = this._spawnTriangle();

    this.walls.push({ x: W + 10, entered: false, scored: false, type: obstacleType, bricks });
  }

  _spawnCircle() {
    const p = this.p;
    const bricks = [];
    const gapStart = p.floor(p.random(0, LAYERS - 3));
    for (let i = 0; i < LAYERS; i++) {
      if (i === gapStart || i === gapStart + 1 || i === gapStart + 2) continue;
      bricks.push(this._makeBrick(i, OBSTACLE_TYPE.CIRCLE_BLOCKER));
    }
    return bricks;
  }

  _spawnSquare() {
    const p = this.p;
    const bricks = [];
    const gapLayer = p.floor(p.random(LAYERS));
    for (let i = 0; i < LAYERS; i++) {
      if (i === gapLayer) continue;
      bricks.push(this._makeBrick(i, OBSTACLE_TYPE.SQUARE_BLOCKER));
    }
    return bricks;
  }

  _spawnTriangle() {
    const p = this.p;
    const bricks = [];
    const openingMode = p.floor(p.random(3));
    const openTop    = openingMode === 0 || openingMode === 2;
    const openBottom = openingMode === 1 || openingMode === 2;
    for (let i = 0; i < LAYERS; i++) {
      if ((i === 0 && openTop) || (i === LAYERS - 1 && openBottom)) continue;
      bricks.push(this._makeBrick(i, OBSTACLE_TYPE.TRIANGLE_BLOCKER));
    }
    return bricks;
  }

  _makeBrick(layer, obstacleType) {
    const isBlack = this.p.random() < BLACK_CHANCE;
    if (isBlack) {
      return { layer, color: COLORS.black, blocks: { circle: true, square: true, triangle: true }, obstacleType };
    }
    const color =
      obstacleType === OBSTACLE_TYPE.CIRCLE_BLOCKER   ? COLORS.green :
      obstacleType === OBSTACLE_TYPE.SQUARE_BLOCKER   ? COLORS.blue : COLORS.red;
    return { layer, color, blocks: { ...BLOCK_RULES[obstacleType] }, obstacleType };
  }
}
