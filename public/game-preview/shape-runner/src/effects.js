import { PLAYER_X, modeColor } from './config.js';

export class EffectSystem {
  constructor(p) {
    this.p = p;
    this.camera = { shake: 0, zoom: 0, nearMissCooldown: 0 };
    this.failFx   = { active: false, t: 0, duration: 14, x: 0, y: 0, color: [255, 255, 255], particles: [] };
    this.switchFx = { active: false, t: 0, duration: 16, color: [255, 255, 255], particles: [] };
    this.goalFlash = 0;
    this.scorePop = 0;
    this.scorePopText = '';
    this.muted = false;
    this._audioCtx = null;
  }

  reset(playerMode) {
    this.camera = { shake: 0, zoom: 0, nearMissCooldown: 0 };
    this.failFx   = { active: false, t: 0, duration: 14, x: 0, y: 0, color: [255, 255, 255], particles: [] };
    this.switchFx = { active: false, t: 0, duration: 16, color: modeColor(playerMode), particles: [] };
    this.goalFlash = 0;
    this.scorePop = 0;
    this.scorePopText = '';
  }

  update() {
    const c = this.camera;
    c.shake *= 0.86;
    c.zoom  *= 0.84;
    c.nearMissCooldown = Math.max(0, c.nearMissCooldown - 1);
    this.goalFlash = Math.max(0, this.goalFlash - 1);
    this.scorePop  = Math.max(0, this.scorePop  - 1);
  }

  getCameraTransform() {
    const amp = this.camera.shake;
    const p = this.p;
    return {
      x:     amp > 0.05 ? p.random(-amp, amp) : 0,
      y:     amp > 0.05 ? p.random(-amp, amp) : 0,
      scale: 1 + this.camera.zoom,
    };
  }

  triggerNearMiss() {
    this.camera.shake = Math.max(this.camera.shake, 1.2);
    this.camera.zoom  = Math.max(this.camera.zoom, 0.004);
    this.camera.nearMissCooldown = 8;
  }

  triggerFail() {
    this.camera.shake = 4;
    this.camera.zoom  = 0.018;
    this.playCue('fail');
  }

  startFailFx(playerY, playerMode) {
    const p = this.p;
    const c = modeColor(playerMode);
    this.failFx = { active: true, t: 0, duration: 16, x: PLAYER_X, y: playerY, color: c, particles: [] };
    for (let i = 0; i < 22; i++) {
      const a = p.random(p.TWO_PI);
      const speed = p.random(1.8, 4.6);
      this.failFx.particles.push({
        x: PLAYER_X, y: playerY,
        vx: p.cos(a) * speed,
        vy: p.sin(a) * speed - p.random(0.3, 1.4),
        r: p.random(2.2, 5.4),
      });
    }
    this.triggerFail();
  }

  startSwitchFx(playerX, playerY, playerMode) {
    const p = this.p;
    const c = modeColor(playerMode);
    this.switchFx = { active: true, t: 0, duration: 16, color: c, particles: [] };
    for (let i = 0; i < 14; i++) {
      const a = p.random(p.TWO_PI);
      const sp = p.random(1.2, 2.9);
      this.switchFx.particles.push({
        x: playerX, y: playerY,
        vx: p.cos(a) * sp, vy: p.sin(a) * sp,
        r: p.random(2.2, 4.4),
      });
    }
  }

  scorePopEvent(text) {
    this.scorePop = 30;
    this.scorePopText = text;
  }

  goalFlashEvent() {
    this.goalFlash = 40;
  }

  drawSwitchFx() {
    const fx = this.switchFx;
    if (!fx.active) return;
    const p = this.p;
    const progress = fx.t / fx.duration;
    const inv = 1 - progress;
    const ringR = 14 + progress * 34;

    p.noFill();
    p.strokeWeight(2);
    p.stroke(fx.color[0], fx.color[1], fx.color[2], 190 * inv);
    p.ellipse(PLAYER_X, PLAYER_X, ringR * 2, ringR * 2); // note: uses PLAYER_X as center x/y approx
    // Use actual player pos via particles
    p.noStroke();
    for (const pt of fx.particles) {
      pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.96; pt.vy *= 0.96;
      p.fill(fx.color[0], fx.color[1], fx.color[2], 190 * inv);
      p.circle(pt.x, pt.y, pt.r);
    }
    fx.t++;
    if (fx.t >= fx.duration) { fx.active = false; fx.particles = []; }
  }

  drawSwitchFxAt(px, py) {
    const fx = this.switchFx;
    if (!fx.active) return;
    const p = this.p;
    const progress = fx.t / fx.duration;
    const inv = 1 - progress;
    const ringR = 14 + progress * 34;

    p.noFill();
    p.strokeWeight(2);
    p.stroke(fx.color[0], fx.color[1], fx.color[2], 190 * inv);
    p.ellipse(px, py, ringR * 2, ringR * 2);

    p.noStroke();
    for (const pt of fx.particles) {
      pt.x += pt.vx; pt.y += pt.vy; pt.vx *= 0.96; pt.vy *= 0.96;
      p.fill(fx.color[0], fx.color[1], fx.color[2], 190 * inv);
      p.circle(pt.x, pt.y, pt.r);
    }
    fx.t++;
    if (fx.t >= fx.duration) { fx.active = false; fx.particles = []; }
  }

  drawFailFx() {
    const fx = this.failFx;
    if (!fx.active) return;
    const p = this.p;
    const progress = fx.t / fx.duration;
    const inv = 1 - progress;
    const ring = 8 + progress * 34;

    p.noFill();
    p.strokeWeight(2);
    p.stroke(fx.color[0], fx.color[1], fx.color[2], 180 * inv);
    p.ellipse(fx.x, fx.y, ring, ring);

    p.noStroke();
    for (const pt of fx.particles) {
      pt.x += pt.vx; pt.y += pt.vy;
      pt.vx *= 0.95; pt.vy = pt.vy * 0.95 + 0.04;
      p.fill(fx.color[0], fx.color[1], fx.color[2], 210 * inv);
      p.circle(pt.x, pt.y, pt.r * inv);
    }
    fx.t++;
    if (fx.t >= fx.duration) { fx.active = false; fx.particles = []; }
  }

  playCue(type) {
    if (this.muted) return;
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return;
    if (!this._audioCtx) this._audioCtx = new Ctx();
    if (this._audioCtx.state === 'suspended') this._audioCtx.resume();
    const ctx = this._audioCtx;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    if (type === 'switch')      osc.frequency.setValueAtTime(540, ctx.currentTime);
    else if (type === 'score')  osc.frequency.setValueAtTime(700, ctx.currentTime);
    else                        osc.frequency.setValueAtTime(170, ctx.currentTime);
    const dur = type === 'fail' ? 0.16 : 0.1;
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.05,   ctx.currentTime + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + dur);
  }

  get nearMissCooldown() { return this.camera.nearMissCooldown; }
}
