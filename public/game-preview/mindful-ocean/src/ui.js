import { MODE, PHASE } from './config.js';

function formatTime(ms) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

export class UI {
  constructor(p) {
    this.p = p;
    this.relaxBtn = null;
    this.declutterBtn = null;
    this.breathingBtn = null;
    this.restartBtn = null;
  }

  _layout() {
    const p = this.p;
    const w = p.width, h = p.height;
    const pad = 12;
    const barW = Math.max(0, w - pad * 2);
    const bh = 44;
    const gap = 8;
    const bw = (barW - gap * 2) / 3;
    const bx = pad;
    const statW = Math.min(260, w - pad * 2);
    const statH = 64;
    const statX = w - statW - pad;
    const statY = h - statH - pad;
    return { pad, bar: { x: bx, y: pad, w: bw, h: bh, gap }, status: { x: statX, y: statY, w: statW, h: statH } };
  }

  _drawButton(btn, label, active) {
    const p = this.p;
    p.noStroke();
    p.fill(active ? p.color(16, 88, 112, 185) : p.color(5, 20, 40, 150));
    p.rect(btn.x, btn.y, btn.w, btn.h, 8);
    p.fill(224, 248, 255, 230);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(Math.max(12, Math.min(14, p.width * 0.014)));
    p.text(label, btn.x + btn.w / 2, btn.y + btn.h / 2 + 0.5);
  }

  draw(mode, fishCount, breathing, wisdom, stillness) {
    const layout = this._layout();
    this._drawModeButtons(layout, mode);
    if (mode !== MODE.CLEARED) this._drawStatusPanel(layout, mode, fishCount, breathing);
    this._drawBreathingGuide(mode, breathing);
    if (mode === MODE.CLEARED) this._drawClearedCard(wisdom, stillness);
  }

  _drawModeButtons(layout, mode) {
    const { x, y, w, h, gap } = layout.bar;
    this.relaxBtn     = { x,               y, w, h };
    this.declutterBtn = { x: x + w + gap,   y, w, h };
    this.breathingBtn = { x: x + (w+gap)*2, y, w, h };
    this.restartBtn   = null;

    this._drawButton(this.relaxBtn,     'Relax Mode',          mode === MODE.RELAX);
    this._drawButton(this.declutterBtn, 'Declutter', mode === MODE.DECLUTTER);
    this._drawButton(this.breathingBtn, 'Breathing', mode === MODE.BREATHING);
  }

  _drawStatusPanel(layout, mode, fishCount, breathing) {
    const p = this.p;
    const { x, y, w, h } = layout.status;
    p.noStroke();
    p.fill(5, 20, 40, 145);
    p.rect(x, y, w, h, 10);
    p.fill(224, 248, 255, 220);
    p.textAlign(p.LEFT, p.TOP);

    if (mode === MODE.DECLUTTER) {
      p.textSize(Math.max(12, Math.min(16, p.width * 0.016)));
      p.text(`Fish: ${fishCount}`, x + 10, y + 10);
      p.textSize(Math.max(11, Math.min(14, p.width * 0.014)));
      p.text('Tap the fish and watch them swim away.', x + 10, y + 34, w - 20);
    } else if (mode === MODE.BREATHING) {
      p.textSize(Math.max(12, Math.min(16, p.width * 0.016)));
      p.text('Box breathing', x + 10, y + 10);
      p.textSize(Math.max(11, Math.min(14, p.width * 0.014)));
      p.text(`Time left ${formatTime(breathing.remaining)}`, x + 10, y + 34);
    } else {
      p.textSize(Math.max(11, Math.min(14, p.width * 0.014)));
      p.text('Relax mode: enjoy the calm fish flow.', x + 10, y + 22, w - 20);
    }
  }

  _drawBreathingGuide(mode, breathing) {
    if (mode !== MODE.BREATHING) return;
    const p = this.p;
    const cx = p.width * 0.5;
    const cy = p.height * 0.56;
    if (!breathing.remaining) return;
    const cues = {
      [PHASE.INHALE]: ['Breathe in', breathing.phaseProgress],
      [PHASE.HOLD_FULL]: ['Hold gently', 1],
      [PHASE.EXHALE]: ['Breathe out', 1 - breathing.phaseProgress],
      [PHASE.HOLD_EMPTY]: ['Pause', 0],
    };
    const [label, ringT] = cues[breathing.phase];
    const r = Math.min(p.width, p.height) * (0.1 + ringT * 0.12);

    p.noFill();
    p.stroke(204, 244, 255, 130);
    p.strokeWeight(2);
    p.circle(cx, cy, r * 2);
    p.stroke(204, 244, 255, 50);
    p.strokeWeight(1);
    p.circle(cx, cy, (r + 16) * 2);

    p.noStroke();
    p.fill(232, 251, 255, 215);
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(Math.max(20, Math.min(32, p.width * 0.04)));
    p.text(label, cx, cy - 8);
    p.textSize(Math.max(12, Math.min(16, p.width * 0.016)));
    p.fill(210, 240, 250, 200);
    p.text(String(Math.ceil(breathing.phaseRemaining / 1000)), cx, cy + 22);
  }

  _drawClearedCard(wisdom, stillness) {
    const p = this.p;
    const cardW = Math.min(360, p.width - 24);
    const cardH = 166;
    const cardX = (p.width - cardW) / 2;
    const cardY = (p.height - cardH) / 2;

    p.push();
    p.noFill();
    const progress = Math.min(1, stillness / 2400);
    const size = Math.min(p.width, p.height);
    p.stroke(164, 227, 245, 100 * (1 - progress));
    p.circle(p.width / 2, p.height / 2, size * (0.2 + 0.75 * progress));
    p.pop();

    p.noStroke();
    p.fill(5, 20, 40, 150);
    p.rect(cardX, cardY, cardW, cardH, 12);

    p.fill(232, 251, 255, 225);
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(Math.max(18, Math.min(28, p.width * 0.03)));
    p.text('Quiet water', cardX + cardW / 2, cardY + 16);

    p.textSize(Math.max(12, Math.min(16, p.width * 0.016)));
    p.fill(210, 240, 250, 190);
    p.text(wisdom, cardX + 12, cardY + 52, cardW - 24, 36);
    p.text('Stay here as long as you like.', cardX + cardW / 2, cardY + 86);

    const rw = 132, rh = 44;
    this.restartBtn = {
      x: cardX + (cardW - rw) / 2,
      y: cardY + cardH - rh - 14,
      w: rw, h: rh
    };
    this._drawButton(this.restartBtn, 'Refill ocean', true);
  }

  hitTest(px, py) {
    const hit = (btn) => !!btn && px >= btn.x && px <= btn.x + btn.w && py >= btn.y && py <= btn.y + btn.h;
    if (hit(this.restartBtn))   return 'restart';
    if (hit(this.declutterBtn)) return 'declutter';
    if (hit(this.breathingBtn)) return 'breathing';
    if (hit(this.relaxBtn))     return 'relax';
    return null;
  }
}
