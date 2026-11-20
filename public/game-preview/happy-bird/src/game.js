import { CONFIG } from './config.js';
import { Bird }       from './bird.js';
import { Pipe }       from './pipe.js';
import { Background } from './background.js';
import { Audio }      from './audio.js';
import { Particles }  from './particles.js';
import { addScore, getTopScores } from './leaderboard.js';

const STATE = { READY: 'ready', PLAYING: 'playing', OVER: 'over' };

export class Game {
  constructor(p) {
    this.p = p;
    this.bird       = new Bird(p);
    const firstPipeX = CONFIG.WIDTH + CONFIG.PIPE.WIDTH;
    this.pipes      = [firstPipeX, firstPipeX + CONFIG.PIPE.SPACING].map(x => new Pipe(p, x));
    this.background = null;
    this.audio      = new Audio();
    this.particles  = new Particles(p);

    this.score      = 0;
    this.highscore  = parseInt(localStorage.getItem('happybird_best') || '0');
    this.newBest    = false;
    this.collided   = false;
    this.state      = STATE.READY;

    this._bobT           = 0;
    this._deathTimer     = 0;
    this._shake          = 0;
    this._scorePop       = 0;
    this._levelFlash     = 0;
    this._bestSoundPlayed = false;

    this._leaderboard     = getTopScores();  // personal best runs from localStorage
  }

  setup() {
    const p = this.p;
    p.pixelDensity(Math.min(p.pixelDensity(), 2));
    p.createCanvas(CONFIG.WIDTH, CONFIG.HEIGHT);
    p.rectMode(p.CENTER);
    this.background = new Background(p);
    this.bird.y = CONFIG.HEIGHT / 2;
  }

  draw() {
    const p = this.p;
    p.rectMode(p.CENTER);

    // Screen shake — applied as translate at top of frame (resets each frame)
    if (this._shake > 0) {
      p.translate(
        p.random(-this._shake, this._shake),
        p.random(-this._shake, this._shake)
      );
      this._shake *= 0.78;
      if (this._shake < 0.5) this._shake = 0;
    }

    this.background.update(Math.min(p.deltaTime, 100));
    this.background.draw();
    for (const pipe of this.pipes) pipe.draw();
    this.background.drawGround(); // ground after pipes so they appear planted in it

    if (this.bird.y < CONFIG.HEIGHT + this.bird.h) {
      this.bird.draw();
    }

    this.particles.update();
    this.particles.draw();

    if (this.state === STATE.READY) {
      this._updateReady();
      this._drawReady();
    } else if (this.state === STATE.PLAYING) {
      this._update();
      this._drawScore();
    } else {
      this._deathTimer++;
      this.bird.update(false);
      this._drawScore();
      if (this._deathTimer > 50) {
        this._drawGameOver();
      }
    }

    if (this.state !== STATE.OVER || this._deathTimer <= 50) this._drawClock();
  }

  handleKeyPressed() {
    const p = this.p;
    if (p.keyCode === p.UP_ARROW || p.keyCode === 32) {
      this._handleTap();
      return false;
    }
  }

  handleMousePressed() {
    this._handleTap();
    return false;
  }

  // ─── Private ────────────────────────────────────────────────────────────────

  _handleTap() {
    if (this.state === STATE.READY) {
      this.state = STATE.PLAYING;
    } else if (this.state === STATE.OVER && this._deathTimer > 50) {
      this._reset();
    } else if (this.state === STATE.PLAYING && !this.collided) {
      this.bird.vy = -CONFIG.BIRD.JUMP_FORCE;
    }
  }

  _updateReady() {
    this._bobT += 0.05;
    this.bird.y = CONFIG.HEIGHT / 2 + Math.sin(this._bobT) * 6;
    this.bird.vy = 0;
    this.bird.animate(true);
  }

  _update() {
    const p = this.p;
    const jumping = !this.collided && p.keyIsPressed &&
                    (p.keyCode === p.UP_ARROW || p.keyCode === 32);
    this.bird.update(jumping);

    if (!this.collided && this.pipes.some(pipe => pipe.collidesWith(this.bird))) {
      this.collided = true;
      this.bird.accelerateFall();
      this._shake = 14;
      this.particles.burst(this.bird.x, this.bird.y);
      this.audio.death();
    } else if (!this.collided) {
      const passed = this.pipes.filter(pipe => pipe.advance());
      for (const pipe of passed) {
        this.score++;
        this._scorePop = 9;
        this.audio.score();

        if (this.score > this.highscore) {
          this.highscore = this.score;
          this.newBest = true;
          localStorage.setItem('happybird_best', String(this.highscore));
        }

        if (this.score % CONFIG.PIPE.SPEED_INTERVAL === 0) {
          for (const obstacle of this.pipes) {
            obstacle.speed = Math.min(obstacle.speed + CONFIG.PIPE.SPEED_INCREMENT, CONFIG.PIPE.SPEED_MAX);
          }
          this._levelFlash = 60;
        }

        pipe.wrap(Math.max(...this.pipes.map(obstacle => obstacle.x)), this.score);
      }
    }

    if (this.bird.isOutOfBounds()) {
      // Ground hit without prior pipe collision — fire effects now
      if (!this.collided) {
        this._shake = 10;
        this.particles.burst(this.bird.x, this.bird.y);
        this.audio.death();
      }
      this.state = STATE.OVER;
    }
  }

  _reset() {
    this.bird.reset();
    this.bird.y = CONFIG.HEIGHT / 2;
    for (const pipe of this.pipes) pipe.reset();
    this.particles.clear();
    this.score    = 0;
    this.newBest  = false;
    this.collided = false;
    this.state    = STATE.READY;
    this._bobT           = 0;
    this._deathTimer     = 0;
    this._shake          = 0;
    this._scorePop       = 0;
    this._levelFlash     = 0;
    this._bestSoundPlayed = false;
    this._leaderboard    = getTopScores();
  }

  // ── Score display ────────────────────────────────────────────────────────────
  _drawScore() {
    const p = this.p;

    if (this._scorePop > 0) this._scorePop--;
    const popScale = 1 + (this._scorePop / 9) * 0.38;

    p.push();
    p.translate(CONFIG.WIDTH / 2, 62);
    p.scale(popScale);
    p.textAlign(p.CENTER);
    p.textStyle(p.BOLD);
    p.noStroke();
    p.textSize(46);
    p.fill(0, 0, 0, 90);
    p.text(this.score, 2, 2);
    p.fill(255);
    p.text(this.score, 0, 0);
    p.pop();
    p.textStyle(p.NORMAL);

    // "FASTER!" flash on difficulty bump
    if (this._levelFlash > 0) {
      this._levelFlash--;
      const a = this._levelFlash > 30
        ? 255
        : p.map(this._levelFlash, 0, 30, 0, 255);
      p.textAlign(p.CENTER);
      p.textStyle(p.BOLD);
      p.textSize(14);
      p.noStroke();
      p.fill(255, 230, 50, a);
      p.text('FASTER!', CONFIG.WIDTH / 2, 88);
      p.textStyle(p.NORMAL);
    }
  }

  // ── Ready / title screen ─────────────────────────────────────────────────────
  _drawReady() {
    const p = this.p;
    const W = CONFIG.WIDTH;
    const H = CONFIG.HEIGHT;
    p.push();
    p.textAlign(p.CENTER, p.CENTER);
    p.noStroke();
    p.textFont('Georgia');
    p.textStyle(p.BOLD);
    p.textSize(44);
    p.fill('#fbecd3');
    p.text('Sleepy Bird', W / 2, H * .24);
    p.textFont('system-ui');
    p.textStyle(p.NORMAL);
    p.textSize(14);
    p.fill('#dae6ef');
    p.text('Fly through the gaps', W / 2, H * .30);
    this._drawAction(W / 2, H * .77, 'Tap to start');
    p.textSize(12);
    p.fill('#d5e0e9');
    p.text('Tap to flap  ·  Space on keyboard', W / 2, H * .845);
    if (this.highscore > 0) p.text('Personal best  ' + this.highscore, W / 2, H * .885);
    p.pop();
  }

  _drawAction(x, y, label) {
    const p = this.p;
    p.noStroke();
    p.fill('#f5cc87');
    p.rect(x, y, 204, 46, 14);
    p.fill('#202738');
    p.textAlign(p.CENTER, p.CENTER);
    p.textStyle(p.BOLD);
    p.textSize(16);
    p.text(label, x, y);
  }

  _drawGameOver() {
    const p = this.p;
    const { WIDTH: W, HEIGHT: H } = CONFIG;
    if (!this._bestSoundPlayed) {
      this._bestSoundPlayed = true;
      if (this.newBest) this.audio.newBest();
      this._leaderboard = addScore(this.score);
    }

    const rows = this._leaderboard;
    const cardW = W - 52;
    const cardH = 205 + rows.length * 24;
    const cx = W / 2;
    const top = (H - cardH) / 2;

    p.push();
    p.noStroke();
    p.fill(7, 13, 29, 175);
    p.rect(cx, H / 2, W, H);
    p.stroke('#51667d');
    p.strokeWeight(1);
    p.fill('#142439');
    p.rect(cx, top + cardH / 2, cardW, cardH, 18);
    p.noStroke();

    p.textAlign(p.CENTER, p.CENTER);
    p.textFont('Georgia');
    p.textSize(this.newBest ? 25 : 31);
    p.textStyle(p.BOLD);
    p.fill('#fbecd3');
    p.text(this.newBest ? 'New personal best' : 'Flight complete', cx, top + 32);

    p.textFont('system-ui');
    const medal = [[50, 'Platinum'], [30, 'Gold'], [15, 'Silver'], [5, 'Bronze']]
      .find(([threshold]) => this.score >= threshold)?.[1];
    const runLabel = medal ? 'This run · ' + medal : 'This run';
    for (const [i, label, score] of [[-1, runLabel, this.score], [1, 'Personal best', this.highscore]]) {
      const x = cx + i * 66;
      p.fill('#20354b');
      p.rect(x, top + 90, 120, 62, 9);
      p.textSize(12);
      p.textStyle(p.NORMAL);
      p.fill('#c8d7e5');
      p.text(label, x, top + 73);
      p.textSize(27);
      p.textStyle(p.BOLD);
      p.fill(i === 1 ? '#f5cc87' : '#fff5e5');
      p.text(score, x, top + 100);
    }

    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(13);
    p.fill('#e2ecf4');
    p.text('Top runs', cx - 124, top + 141);
    rows.forEach((entry, i) => {
      const rowY = top + 163 + i * 24;
      const { score, ts } = entry;
      if (i === 0) {
        p.fill('#263b50');
        p.rect(cx, rowY, 248, 22, 5);
      }
      p.textSize(12);
      p.textStyle(p.NORMAL);
      p.fill(i === 0 ? '#f5cc87' : '#d5e2ee');
      p.textAlign(p.LEFT, p.CENTER);
      p.text(String(i + 1), cx - 115, rowY);
      p.textStyle(p.BOLD);
      p.text(score, cx - 75, rowY);
      p.textStyle(p.NORMAL);
      p.textAlign(p.RIGHT, p.CENTER);
      p.fill('#c2d2df');
      p.text(this._runDate(ts), cx + 115, rowY);
    });
    this._drawAction(cx, top + cardH - 34, 'Play again');
    p.pop();
  }

  _runDate(timestamp) {
    if (!timestamp) return '—';
    const date = new Date(timestamp);
    if (date.toDateString() === new Date().toDateString()) {
      const hours = date.getHours();
      return (hours % 12 || 12) + ':' + String(date.getMinutes()).padStart(2, '0') + (hours < 12 ? 'am' : 'pm');
    }
    return date.toLocaleDateString('en', { month: 'short', day: 'numeric' });
  }

  _drawClock() {
    const p = this.p;
    const t = this.background ? this.background.t : 0;
    const totalMins = Math.floor(t * 24 * 60);
    const h24  = Math.floor(totalMins / 60) % 24;
    const mm   = totalMins % 60;
    const ampm = h24 < 12 ? 'am' : 'pm';
    const h12  = h24 % 12 || 12;
    const label = `${h12}:${String(mm).padStart(2, '0')}${ampm}`;

    // Pill background
    p.noStroke();
    p.fill(0, 0, 0, 55);
    p.rectMode(p.CORNER);
    p.rect(CONFIG.WIDTH - 52, 8, 44, 16, 8);
    p.rectMode(p.CENTER);

    p.textAlign(p.CENTER);
    p.textStyle(p.NORMAL);
    p.textSize(9);
    p.fill(255, 255, 255, 200);
    p.text(label, CONFIG.WIDTH - 30, 19);
  }
}
