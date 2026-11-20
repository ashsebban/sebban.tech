import {
  W, H, LAYERS, LAYER_H, PLAYER_X, WALL_WIDTH,
  WALL_SPEED_BASE, WALL_SPEED_GROWTH,
  COUNTDOWN_FRAMES, INTRO_STORAGE_KEY,
  PLAYER_MODE,
} from './config.js';
import { Player }      from './player.js';
import { WallManager } from './obstacles.js';
import { EffectSystem } from './effects.js';

export class Game {
  constructor(p) {
    this.p = p;
    this.player  = new Player(p);
    this.walls   = new WallManager(p);
    this.effects = new EffectSystem(p);

    this.highScore = 0;
    try {
      const savedBest = Number(localStorage.getItem('shape-runner-best-v1'));
      if (Number.isSafeInteger(savedBest) && savedBest > 0) this.highScore = savedBest;
    } catch {
      // The game still works when browser storage is unavailable.
    }
    this.score = 0;
    this.goalTarget = 20;
    this.scrollSpeed = WALL_SPEED_BASE;

    this.gameOver = false;
    this.paused = false;
    this.introOpen = true;
    this.showGrid = true;
    this.countdownFrames = COUNTDOWN_FRAMES;
    this.failDelayFrames = 0;

    this.uiButtons = {};
    this._usingDomKeyEvents = false;
    this._canvas = null;
  }

  setup() {
    const p = this.p;
    p.pixelDensity(Math.min(p.pixelDensity(), 2));
    this._canvas = p.createCanvas(W, H);
    this._canvas.parent('playfield');
    const canvas = this._canvas.elt;
    canvas.tabIndex = 0;
    canvas.setAttribute('aria-label', 'Shape Runner. Use Space to switch shapes and the arrow keys to move.');
    let gesture = null;
    canvas.addEventListener('pointerdown', (event) => {
      if (event.button !== 0 || gesture) return;
      canvas.focus({ preventScroll: true });
      if (this.introOpen) return;
      if (this.paused || this.gameOver) {
        const bounds = canvas.getBoundingClientRect();
        this.handleMousePressed(
          (event.clientX - bounds.left) * W / bounds.width,
          (event.clientY - bounds.top) * H / bounds.height,
        );
        return;
      }
      if (!this._canMove()) return;
      gesture = { id: event.pointerId, x: event.clientX, y: event.clientY, mode: this.player.mode };
      canvas.setPointerCapture(event.pointerId);
    });
    canvas.addEventListener('pointerup', (event) => {
      if (gesture?.id !== event.pointerId) return;
      const { x, y, mode } = gesture;
      gesture = null;
      if (!this._canMove() || mode !== this.player.mode) return;
      const dx = event.clientX - x;
      const dy = event.clientY - y;
      if (mode === PLAYER_MODE.CIRCLE) {
        if (Math.hypot(dx, dy) < 20) this.player.applyUpInput();
      } else if (Math.abs(dy) >= 24 && Math.abs(dy) > Math.abs(dx)) {
        if (dy < 0) this.player.applyUpInput();
        else this.player.applyDownInput();
      }
    });
    const cancelGesture = (event) => {
      if (gesture?.id === event.pointerId) gesture = null;
    };
    canvas.addEventListener('pointercancel', cancelGesture);
    canvas.addEventListener('lostpointercapture', cancelGesture);

    this.switchButton = document.getElementById('switch-shape');
    this.pauseButton = document.getElementById('pause-run');
    this.gestureHint = document.getElementById('gesture-hint');
    this.switchButton.addEventListener('click', () => {
      if (this._canMove()) this._cycleMode();
    });
    this.pauseButton.addEventListener('click', () => {
      this.paused = !this.paused;
    });

    this.guide = document.getElementById('guide');
    this.skipGuide = document.getElementById('skip-guide');
    const startButton = document.getElementById('guide-start');
    try {
      this.introOpen = localStorage.getItem(INTRO_STORAGE_KEY) !== '1';
    } catch {
      // Show the guide when browser storage is unavailable.
    }
    this.guide.hidden = !this.introOpen;
    canvas.tabIndex = this.introOpen ? -1 : 0;
    startButton.addEventListener('click', () => this._start());
    startButton.disabled = false;
    if (!this.introOpen) canvas.focus({ preventScroll: true });
    p.textFont('monospace');

    if (!this._usingDomKeyEvents) {
      window.addEventListener('keydown', (e) => {
        if ((e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) &&
            (e.key === ' ' || e.key === 'Enter')) return;
        const handled = this._handleKeyInput(e.key, e.keyCode || e.which);
        if (handled) e.preventDefault();
      }, { passive: false });
      this._usingDomKeyEvents = true;
    }

    this._reset();
  }

  draw() {
    const p = this.p;
    p.background(15, 15, 25);
    this.effects.update();

    if (!this.introOpen && !this.gameOver && !this.paused && this.failDelayFrames === 0) {
      if (this.countdownFrames > 0) {
        this.countdownFrames--;
      } else {
        this._updateGame();
      }
    }

    if (this.failDelayFrames > 0) {
      this.failDelayFrames--;
      if (this.failDelayFrames === 0) this.gameOver = true;
    }

    const cam = this.effects.getCameraTransform();
    p.push();
    p.translate(W / 2, H / 2);
    p.scale(cam.scale);
    p.translate(-W / 2 + cam.x, -H / 2 + cam.y);

    if (this.showGrid) {
      p.stroke(255, 255, 255, 18);
      p.strokeWeight(1);
      for (let i = 1; i < LAYERS; i++) p.line(0, i * LAYER_H, W, i * LAYER_H);
    }
    this.walls.draw();
    this.player.draw(this.failDelayFrames === 0);
    this.effects.drawFailFx();
    this.effects.drawSwitchFxAt(this.player.x, this.player.y);
    p.pop();

    this._updateControls();
    this._drawHUD();
    if (this.paused && !this.gameOver && !this.introOpen) this._drawPauseMenu();
    if (this.countdownFrames > 0 && !this.introOpen && !this.gameOver && !this.paused) this._drawCountdown();
    if (this.gameOver)  this._drawGameOver();
  }

  handleMousePressed(mx, my) {
    if (!this.introOpen) {
      if (this.failDelayFrames > 0) return false;
      const btn = this.uiButtons;
      if (this.paused && !this.gameOver) {
        if (this._hit(mx, my, btn.pauseResume))  { this.paused = false; return false; }
        if (this._hit(mx, my, btn.pauseRestart)) { this._reset(); return false; }
        if (this._hit(mx, my, btn.pauseSound))   { this.effects.muted = !this.effects.muted; return false; }
        if (this._hit(mx, my, btn.pauseGrid))    { this.showGrid = !this.showGrid; return false; }
        return false;
      }
      if (this.gameOver && this._hit(mx, my, btn.retry)) { this._reset(); return false; }
      return false;
    }

    return false;
  }

  // ── Private: game logic ───────────────────────────────────────────────────

  _canMove() {
    return !this.introOpen && !this.gameOver && !this.paused &&
      this.countdownFrames === 0 && this.failDelayFrames === 0;
  }

  _updateControls() {
    this.switchButton.disabled = !this._canMove();
    this.pauseButton.disabled = this.introOpen || this.gameOver || this.failDelayFrames > 0;
    const pauseLabel = this.paused ? 'Resume' : 'Pause';
    if (this.pauseButton.textContent !== pauseLabel) this.pauseButton.textContent = pauseLabel;

    const hints = ['Circle · Tap to jump', 'Square · Swipe up or down', 'Triangle · Swipe up or down'];
    const hint = hints[this.player.mode];
    if (this.gestureHint.textContent !== hint) this.gestureHint.textContent = hint;
  }

  _start() {
    this.introOpen = false;
    this.guide.hidden = true;
    this._canvas.elt.tabIndex = 0;
    this._canvas.elt.focus({ preventScroll: true });
    if (this.skipGuide.checked) {
      try { localStorage.setItem(INTRO_STORAGE_KEY, '1'); } catch {
        // The guide can still close for the current run.
      }
    }
  }

  _reset() {
    const p = this.p;
    this.player.reset();
    this.walls.reset();
    this.effects.reset(PLAYER_MODE.CIRCLE);
    this.score = 0;
    this.goalTarget = 20;
    this.scrollSpeed = WALL_SPEED_BASE;
    this.gameOver = false;
    this.paused = false;
    this.countdownFrames = COUNTDOWN_FRAMES;
    this.failDelayFrames = 0;
  }

  _updateGame() {
    this.scrollSpeed = WALL_SPEED_BASE + this.score * WALL_SPEED_GROWTH;
    this.player.update();

    this.walls.update(this.scrollSpeed, this.player,
      () => this._onScore(),
      () => this._startFail(),
    );

    if (!this.gameOver && !this.failDelayFrames) {
      if (this.walls.checkCollision(this.player)) {
        this._startFail();
      } else if (this.effects.nearMissCooldown <= 0 && this.walls.checkNearMiss(this.player)) {
        this.effects.triggerNearMiss();
      }
    }
  }

  _onScore() {
    this.score++;
    this.effects.playCue('score');
    this.effects.scorePopEvent('+1');
    while (this.score >= this.goalTarget) {
      this.goalTarget += 20;
      this.effects.goalFlashEvent();
    }
    if (this.score > this.highScore) {
      this.highScore = this.score;
      try {
        localStorage.setItem('shape-runner-best-v1', String(this.highScore));
      } catch {
        // Keep the in-session best when browser storage is unavailable.
      }
    }
  }

  _startFail() {
    if (this.gameOver || this.failDelayFrames > 0) return;
    this.failDelayFrames = 18;
    this.effects.startFailFx(this.player.y, this.player.mode);
  }

  _cycleMode() {
    this.player.cycleMode();
    this.effects.playCue('switch');
    this.effects.startSwitchFx(this.player.x, this.player.y, this.player.mode);
  }

  // ── Private: input ────────────────────────────────────────────────────────

  _handleKeyInput(k, code) {
    if (this.introOpen) {
      if (k !== 'Enter') return false;
      this._start();
      return true;
    }
    if (k === 'r' || k === 'R') {
      this._reset();
      return true;
    }
    if (this.gameOver || this.failDelayFrames > 0) return false;

    if (k === 'p' || k === 'P') { this.paused = !this.paused; return true; }
    if (k === 'm' || k === 'M') { this.effects.muted = !this.effects.muted; return true; }
    if (this.paused || this.countdownFrames > 0) return false;

    if (code === 32) { this._cycleMode(); return true; }
    if (code === 38 || k === 'w' || k === 'W') { this.player.applyUpInput();  return true; }
    if (code === 40 || k === 's' || k === 'S') { this.player.applyDownInput(); return true; }
    return false;
  }

  _hit(mx, my, r) {
    if (!r) return false;
    return mx >= r.x && mx <= r.x + r.w && my >= r.y && my <= r.y + r.h;
  }

  // ── Private: drawing ──────────────────────────────────────────────────────

  _drawHUD() {
    const p = this.p;
    p.noStroke();

    p.textAlign(p.CENTER);
    p.textSize(28);
    p.fill(255, 245);
    p.text(this.score, W / 2, 34);

    if (this.effects.scorePop > 0 && this.effects.scorePopText) {
      p.fill(240, 255, 240, p.map(this.effects.scorePop, 0, 30, 0, 255));
      p.textSize(12);
      p.text(this.effects.scorePopText, W / 2 + 28, 18);
    }

    p.textAlign(p.RIGHT);
    p.textSize(10);
    p.fill(170, 170, 170, 215);
    p.text('BEST ' + this.highScore, W - 10, 16);

    const stateText = this.gameOver ? 'GAME OVER' : (this.countdownFrames > 0 ? 'READY' : 'FLOW');
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(10);
    p.fill(185, 185, 185, 210);
    p.text(stateText, W / 2, 52);

    const chipX = W - 86, chipY = 30;
    p.fill(255, 255, 255, 20);
    p.rect(chipX, chipY, 76, 24, 6);
    p.fill(210);
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(9);
    p.text('NEXT', chipX + 6, chipY + 12);
    this.walls.drawObstacleIcon(chipX + 58, chipY + 12, this.walls.nextObstacleType, 11);

    p.fill(this.effects.goalFlash > 0 ? p.color(255, 244, 170) : p.color(180, 180, 180, 230));
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(10);
    p.text(`Goal ${Math.min(this.score, this.goalTarget)}/${this.goalTarget}`, 10, H - 14);

    if (this.highScore > 0) {
      const gx = W - 4, gy0 = 62, gy1 = H - 24;
      p.stroke(255, 255, 255, 28);
      p.line(gx, gy0, gx, gy1);
      const ratio = p.constrain(this.score / this.highScore, 0, 1);
      const gy = p.lerp(gy1, gy0, ratio);
      p.stroke(255, 255, 255, 95);
      p.line(gx - 4, gy, gx + 1, gy);
      p.noStroke();
    }


  }

  _drawPauseMenu() {
    const p = this.p;
    p.fill(0, 0, 0, 165);
    p.rect(0, 0, W, H);

    const panelW = 260, panelH = 272;
    const panelX = (W - panelW) / 2, panelY = (H - panelH) / 2;
    p.fill(18, 22, 34, 240);
    p.rect(panelX, panelY, panelW, panelH, 10);
    p.fill(240);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(24);
    p.text('PAUSED', W / 2, panelY + 34);

    const bw = 212, bh = 42, bx = W / 2 - bw / 2, y1 = panelY + 60, gap = 10;
    const btn = this.uiButtons;
    btn.pauseResume  = { x: bx, y: y1,                    w: bw, h: bh };
    btn.pauseRestart = { x: bx, y: y1 + (bh + gap),       w: bw, h: bh };
    btn.pauseSound   = { x: bx, y: y1 + 2 * (bh + gap),   w: bw, h: bh };
    btn.pauseGrid    = { x: bx, y: y1 + 3 * (bh + gap),   w: bw, h: bh };

    p.fill(255, 255, 255, 24);
    [btn.pauseResume, btn.pauseRestart, btn.pauseSound, btn.pauseGrid].forEach((b) => p.rect(b.x, b.y, bw, bh, 8));

    p.fill(245);
    p.textSize(13);
    p.text('Resume',                    W / 2, btn.pauseResume.y  + bh / 2 + 1);
    p.text('Restart Run',               W / 2, btn.pauseRestart.y + bh / 2 + 1);
    p.text(this.effects.muted ? 'Sound: Off' : 'Sound: On', W / 2, btn.pauseSound.y + bh / 2 + 1);
    p.text(this.showGrid ? 'Grid: On' : 'Grid: Off', W / 2, btn.pauseGrid.y + bh / 2 + 1);
  }

  _drawCountdown() {
    const p = this.p;
    p.fill(0, 0, 0, 95);
    p.rect(0, 0, W, H);
    p.fill(242);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(44);
    p.text(String(Math.max(1, Math.ceil(this.countdownFrames / 60))), W / 2, H / 2);
  }

  _drawGameOver() {
    const p = this.p;
    p.fill(0, 0, 0, 170);
    p.rect(0, 0, W, H);
    p.textAlign(p.CENTER);
    p.textSize(34);
    p.fill(255);
    p.text('GAME OVER', W / 2, H / 2 - 40);
    p.textSize(15);
    p.fill(180);
    p.text('Score: ' + this.score, W / 2, H / 2);
    p.textSize(12);
    p.fill(130);
    p.text('Press R to retry', W / 2, H / 2 + 96);

    const rw = 148, rh = 44;
    this.uiButtons.retry = { x: W / 2 - rw / 2, y: H / 2 + 34, w: rw, h: rh };
    p.fill(245, 245, 245, 36);
    p.rect(this.uiButtons.retry.x, this.uiButtons.retry.y, rw, rh, 8);
    p.fill(246);
    p.textSize(14);
    p.text('Retry', W / 2, this.uiButtons.retry.y + rh / 2 + 1);
  }
}
