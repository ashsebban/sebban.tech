import { CONFIG } from './config.js';

const W = CONFIG.WIDTH;
const H = CONFIG.HEIGHT;
const BG = CONFIG.BACKGROUND;

export class Background {
  constructor(p) {
    this.p = p;
    // Start at ~4am (t ≈ 0.12 — deep night, stars out, just before pre-dawn stirs)
    this.elapsed = 0.12 * BG.CYCLE_DURATION_MS;
    this.t = 0.12;

    this._keyframes = [
      { t: 0.00, zen: p.color(5,   5,  25), hor: p.color( 12,  12,  45) },
      { t: 0.10, zen: p.color(8,   8,  35), hor: p.color( 18,  15,  55) },
      { t: 0.18, zen: p.color(18, 15,  65), hor: p.color( 55,  30,  85) },
      { t: 0.24, zen: p.color(35, 45, 130), hor: p.color(255, 130,  55) },
      { t: 0.30, zen: p.color(80,140, 215), hor: p.color(200, 225, 255) },
      { t: 0.45, zen: p.color(100,175,255), hor: p.color(165, 215, 255) },
      { t: 0.58, zen: p.color(85, 155,235), hor: p.color(185, 225, 255) },
      { t: 0.68, zen: p.color(78, 128,218), hor: p.color(215, 188, 140) }, // late afternoon — still blue, warm horizon
      { t: 0.75, zen: p.color(62,  88,182), hor: p.color(255, 162,  72) }, // golden hour
      { t: 0.80, zen: p.color(40,  28,105), hor: p.color(255,  90,  35) }, // sunset — sun now near horizon
      { t: 0.85, zen: p.color(18,  12, 65), hor: p.color(110,  50,  90) }, // dusk
      { t: 0.90, zen: p.color(8,    8, 40), hor: p.color( 30,  20,  70) }, // blue hour
      { t: 1.00, zen: p.color(5,    5, 25), hor: p.color( 12,  12,  45) },
    ];

    this._stars = Array.from({ length: 53 }, () => ({
      x: p.random(W),
      y: p.random(H * 0.02, H * 0.55),
      r: p.random(0.45, 1.35),
    }));

    this._farPeaks = [
      [0, .72], [.12, .63], [.19, .64], [.31, .53], [.37, .56],
      [.46, .46], [.54, .50], [.60, .59], [.70, .55], [.81, .64], [.90, .61], [1, .69],
    ].map(([x, y]) => [x * W, y * H]);
    this._midPeaks = [
      [0, .70], [.11, .65], [.18, .57], [.26, .61], [.33, .69],
      [.46, .65], [.56, .71], [.68, .67], [.79, .58], [.85, .63], [1, .70],
    ].map(([x, y]) => [x * W, y * H]);

    this._clouds = Array.from({ length: BG.CLOUD_COUNT }, (_, i) => ({
      x:     (i / BG.CLOUD_COUNT) * W + p.random(W * 0.05),
      y:     H * (0.38 + 0.11 * (i + p.random(0.5)) / BG.CLOUD_COUNT),
      size:  p.random(W * 0.08, W * 0.18),
      speed: p.random(0.8, 1.2),
    }));
  }

  // ── Lifecycle ────────────────────────────────────────────────────────────────

  update(dt) {
    this.elapsed = (this.elapsed + dt) % BG.CYCLE_DURATION_MS;
    this.t = this.elapsed / BG.CYCLE_DURATION_MS;
    for (const c of this._clouds) {
      c.x -= BG.CLOUD_SCROLL_SPEED * c.speed * dt;
      if (c.x + c.size * 2 < 0) c.x = W + c.size * 2;
    }
  }

  draw() {
    const { zenith, horizon } = this._getSkyColors();
    const w = this._warmth();
    const d = this._darkness();
    this._drawSkyGradient(zenith, horizon);
    this._drawStars();
    this._drawMoon(d);
    this._drawSun();
    this._drawClouds(w, d);
    const far = this._colFar(w, d);
    const mid = this._colMid(w, d);
    this._drawRidge(this._farPeaks, far);
    this._drawRidge(this._midPeaks, mid);
    this._polygon([[.18 * W, .57 * H], [.26 * W, .61 * H], [.33 * W, .69 * H],
      [.22 * W, .65 * H], [.17 * W, .69 * H]], this.p.lerpColor(mid, far, .28));
    this._polygon([[.79 * W, .58 * H], [.85 * W, .63 * H], [W, .70 * H],
      [.85 * W, .67 * H], [.77 * W, .71 * H]], this.p.lerpColor(mid, far, .26));
    this._drawValley(w, d);
  }

  drawGround() { this._drawGround(); }

  // ── Sky ──────────────────────────────────────────────────────────────────────

  _getSkyColors() {
    const t = this.t;
    const kf = this._keyframes;
    let i = 0;
    while (i < kf.length - 2 && kf[i + 1].t <= t) i++;
    const a = kf[i], b = kf[i + 1];
    const u = (t - a.t) / (b.t - a.t);
    return {
      zenith:  this.p.lerpColor(a.zen, b.zen, u),
      horizon: this.p.lerpColor(a.hor, b.hor, u),
    };
  }

  _drawSkyGradient(zenith, horizon) {
    const p = this.p;
    const ctx = p.drawingContext;
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, `rgb(${p.red(zenith)},${p.green(zenith)},${p.blue(zenith)})`);
    grad.addColorStop(1, `rgb(${p.red(horizon)},${p.green(horizon)},${p.blue(horizon)})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  _drawStars() {
    const p = this.p;
    const t = this.t;
    let alpha = 0;
    if (t >= 0.90 || t <= 0.18)      alpha = 255;
    else if (t > 0.82 && t < 0.90)   alpha = p.map(t, 0.82, 0.90, 0, 255);
    else if (t > 0.18 && t < 0.24)   alpha = p.map(t, 0.18, 0.24, 255, 0);
    if (alpha <= 0) return;
    p.noStroke();
    for (const s of this._stars) {
      p.fill(255, 255, 240, alpha * (0.5 + 0.5 * (s.r / 1.8)));
      p.circle(s.x, s.y, s.r * 2);
    }
  }

  _drawMoon(d) {
    if (d < 0.3) return;
    const p = this.p;
    const ctx = p.drawingContext;
    const alpha = p.map(d, 0.3, 1.0, 0, 1);
    const mx = W * 0.80;
    const my = H * 0.14;
    const mr = 11;

    // Soft glow
    const glow = ctx.createRadialGradient(mx, my, mr * 0.5, mx, my, mr * 4);
    glow.addColorStop(0, `rgba(220,230,255,${(alpha * 0.18).toFixed(2)})`);
    glow.addColorStop(1, 'rgba(220,230,255,0)');
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(mx, my, mr * 4, 0, Math.PI * 2);
    ctx.fill();

    // Moon disc
    p.noStroke();
    p.fill(235, 242, 255, alpha * 240);
    p.circle(mx, my, mr * 2);
    // Subtle shadow to give it a crescent feel
    p.fill(18, 16, 45, alpha * 120);
    p.circle(mx + mr * 0.35, my - mr * 0.2, mr * 1.55);
  }

  _drawSun() {
    const p = this.p;
    const ctx = p.drawingContext;
    const t = this.t;
    if (t < 0.22 || t > 0.82) return;

    const u      = (t - 0.22) / 0.60;
    const sinArc = Math.sin(u * Math.PI);
    const sunX   = p.lerp(-20, W + 20, u);
    const sunY   = p.lerp(H * 0.62, H * 0.07, sinArc);
    const sunR   = 8;

    const redCol    = p.color(255,  38,   5);
    const orangeCol = p.color(255, 140,  20);
    const yellowCol = p.color(255, 222,  50);  // warm gold
    const noonCol   = p.color(255, 242, 120);  // bright but still visibly yellow, not white

    let sunCol;
    if (sinArc < 0.10)      sunCol = p.lerpColor(redCol,    orangeCol, sinArc / 0.10);
    else if (sinArc < 0.28) sunCol = p.lerpColor(orangeCol, yellowCol, (sinArc - 0.10) / 0.18);
    else                    sunCol = p.lerpColor(yellowCol,  noonCol,   Math.min(1, (sinArc - 0.28) / 0.40));

    const sr = Math.round(p.red(sunCol));
    const sg = Math.round(p.green(sunCol));
    const sb = Math.round(p.blue(sunCol));

    // Sky glow: warm at horizon, very subtle at midday so it doesn't bleach the sky
    const skyAlpha0 = p.lerp(0.26, 0.07, sinArc);
    const skyGrad   = ctx.createRadialGradient(sunX, sunY, sunR, sunX, sunY, Math.max(W, H) * 1.1);
    skyGrad.addColorStop(0,    `rgba(${sr},${sg},${sb},${skyAlpha0.toFixed(2)})`);
    skyGrad.addColorStop(0.25, `rgba(${sr},${sg},${sb},${(skyAlpha0 * 0.35).toFixed(2)})`);
    skyGrad.addColorStop(1,    `rgba(${sr},${sg},${sb},0)`);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, W, H);

    const corona = ctx.createRadialGradient(sunX, sunY, sunR * 0.5, sunX, sunY, sunR * 5);
    corona.addColorStop(0, `rgba(${sr},${sg},${sb},0.90)`);
    corona.addColorStop(1, `rgba(${sr},${sg},${sb},0)`);
    ctx.fillStyle = corona;
    ctx.beginPath();
    ctx.arc(sunX, sunY, sunR * 5, 0, Math.PI * 2);
    ctx.fill();

    p.noStroke();
    p.fill(sunCol);
    p.circle(sunX, sunY, sunR * 2);
    p.fill(255, 255, 255, 210);
    p.circle(sunX - sunR * 0.18, sunY - sunR * 0.22, sunR * 0.75);
  }

  // ── Mountains ────────────────────────────────────────────────────────────────

  _polygon(points, color) {
    const p = this.p;
    p.noStroke();
    p.fill(color);
    p.beginShape();
    for (const [x, y] of points) p.vertex(x, y);
    p.endShape(p.CLOSE);
  }

  _drawRidge(points, color) {
    this._polygon([...points, [W, H], [0, H]], color);
  }

  _drawValley(warmth, darkness) {
    const p = this.p;
    const meadow = p.lerpColor(
      p.lerpColor(p.color(93, 147, 140), p.color(142, 121, 148), warmth),
      p.color(30, 51, 76), darkness
    );
    const bank = p.lerpColor(
      p.lerpColor(p.color(51, 117, 111), p.color(87, 88, 123), warmth),
      p.color(17, 35, 56), darkness
    );
    const water = p.lerpColor(
      p.lerpColor(p.color(112, 175, 185), p.color(186, 145, 170), warmth),
      p.color(63, 88, 129), darkness
    );

    p.push();
    p.scale(W, H);
    p.noStroke();
    p.fill(meadow);
    p.beginShape();
    p.vertex(0, .747);
    p.bezierVertex(.24, .755, .33, .855, .61, .827);
    p.bezierVertex(.78, .811, .88, .765, 1, .757);
    p.vertex(1, 1);
    p.vertex(0, 1);
    p.endShape(p.CLOSE);

    p.fill(water);
    p.beginShape();
    p.vertex(.58, .829);
    p.bezierVertex(.86, .833, .23, .919, .5, 1);
    p.vertex(.86, 1);
    p.bezierVertex(.35, .925, .98, .844, .58, .829);
    p.endShape(p.CLOSE);

    p.fill(bank);
    p.beginShape();
    p.vertex(0, .873);
    p.bezierVertex(.21, .855, .35, .927, .28, .946);
    p.bezierVertex(.21, .974, .40, .982, .47, 1);
    p.vertex(0, 1);
    p.endShape(p.CLOSE);
    p.pop();
  }

  // ── Time helpers ─────────────────────────────────────────────────────────────

  _warmth() {
    const t = this.t;
    return Math.min(1, Math.max(0, Math.max(
      1 - Math.abs(t - 0.24) / 0.10,  // sunrise
      1 - Math.abs(t - 0.78) / 0.10,  // sunset (shifted to match new keyframe)
    )));
  }

  _darkness() {
    const t = this.t;
    if (t >= 0.90 || t <= 0.10) return 1;
    if (t > 0.82) return this.p.map(t, 0.82, 0.90, 0, 1); // dusk starts later
    if (t < 0.18) return this.p.map(t, 0.10, 0.18, 1, 0);
    return 0;
  }

  // ── Layer colors — distinct at every time of day ──────────────────────────────

  _colFar(w, d) {
    const p = this.p;
    // Day: pale steel-blue haze  Warm: dusty rose  Night: soft indigo (brighter than mid)
    return p.lerpColor(
      p.lerpColor(p.color(123, 163, 177), p.color(181, 132, 144), w),
      p.color(36, 43, 75), d,
    );
  }

  _colMid(w, d) {
    const p = this.p;
    // Day: medium slate-blue  Warm: warm umber  Night: dark navy
    return p.lerpColor(
      p.lerpColor(p.color(63, 113, 128), p.color(109, 75, 99), w),
      p.color(19, 30, 53), d,
    );
  }

  // ── Clouds ────────────────────────────────────────────────────────────────────

  _drawClouds(w, d) {
    const p = this.p;
    const tint = p.lerpColor(
      p.lerpColor(p.color(240, 249, 255, 166), p.color(255, 191, 151, 135), w),
      p.color(110, 130, 172, 65), d,
    );
    for (const c of this._clouds) this._drawCloud(c.x, c.y, c.size, tint);
  }

  _drawCloud(cx, cy, size, col) {
    const p = this.p;
    p.push();
    p.translate(cx, cy);
    p.scale(size);
    p.noStroke();
    p.fill(col);
    p.beginShape();
    p.vertex(-1.13, .1);
    p.bezierVertex(-.86, .06, -.68, -.13, -.45, -.12);
    p.bezierVertex(-.17, -.10, -.10, -.31, .19, -.28);
    p.bezierVertex(.40, -.25, .49, -.08, .69, -.08);
    p.bezierVertex(.89, -.07, .94, .03, 1.18, .11);
    p.bezierVertex(.48, .18, -.46, .17, -1.13, .1);
    p.endShape(p.CLOSE);
    p.pop();
  }

  // ── Ground ────────────────────────────────────────────────────────────────────

  _drawGround() {
    const p = this.p;
    const gh = CONFIG.GROUND_HEIGHT;
    p.noStroke();
    p.rectMode(p.CORNER);
    p.fill(20, 36, 47);
    p.rect(0, H - gh, W, gh);
    p.fill(55, 112, 107);
    p.rect(0, H - gh, W, Math.ceil(gh * 0.38));
    p.rectMode(p.CENTER);
  }
}
