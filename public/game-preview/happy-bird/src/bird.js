import { CONFIG } from './config.js';

export class Bird {
  constructor(p) {
    this.p = p;
    this.x = CONFIG.BIRD.X;
    this.w = CONFIG.BIRD.WIDTH;
    this.h = CONFIG.BIRD.HEIGHT;
    this.reset();
  }

  update(jumping) {
    if (jumping) this.vy = -CONFIG.BIRD.JUMP_FORCE;
    this.vy += CONFIG.BIRD.GRAVITY;
    this.vy = Math.min(this.vy, CONFIG.BIRD.MAX_FALL);
    this.y += this.vy;
    this.animate();
  }

  animate(idle = false) {
    // Keep the surprised face for a beat after the player catches the fall.
    this.alarmFrames = this.vy >= 6 ? 22 : Math.max(0, this.alarmFrames - 1);
    this.calmFrames = this.alarmFrames ? 0 : this.calmFrames + 1;
    this.wingPhase += idle ? .20 : this.p.map(
      this.vy, -CONFIG.BIRD.JUMP_FORCE, CONFIG.BIRD.MAX_FALL, 1.12, .68
    );

    const drowsiness = Math.min(1, Math.max(0, (this.calmFrames - 8) / 45));
    const blink = Math.max(0, 1 - Math.abs(this.calmFrames - 16) / 4,
      .9 - Math.abs(this.calmFrames - 34) / 7);
    const nextEye = this.alarmFrames ? 1.25 : (1 - drowsiness) * (1 - blink * .9);
    this.eyeOpenness += (nextEye - this.eyeOpenness) * (this.alarmFrames ? .48 : .29);
    this.panic += ((this.alarmFrames ? 1 : 0) - this.panic) * .32;
    this.nod = drowsiness * (.10 + .13 * Math.sin(drowsiness * Math.PI * 3));
  }

  draw() {
    const { p, x, y, w } = this;
    const tilt = p.map(this.vy, -CONFIG.BIRD.JUMP_FORCE, CONFIG.BIRD.MAX_FALL, -.30, .40, true);

    p.push();
    p.translate(x, y);
    p.rotate(tilt + this.nod);
    p.scale(w / 44);
    p.stroke('#55363e');
    p.strokeWeight(1.5);
    p.strokeJoin(p.ROUND);

    p.fill('#f29a32');
    p.triangle(-11, 2, -23, -3, -17, 8);
    p.triangle(-11, 5, -22, 10, -10, 10);
    p.stroke('#d16d30');
    p.line(1, 15, 2, 19);
    p.line(2, 19, 6, 19);

    p.stroke('#55363e');
    p.fill('#ffcf4c');
    p.ellipse(0, 0, 37, 36);
    p.noStroke();
    p.fill('#fff0aa');
    p.ellipse(7, 7, 20, 17);

    p.push();
    p.translate(-9, 2);
    p.rotate(Math.sin(this.wingPhase) * (.42 + .22 * this.panic));
    p.fill('#fff5da');
    p.stroke('#c88a46');
    p.strokeWeight(1.1);
    p.ellipse(-3, 1, 19, 13);
    p.pop();

    p.noStroke();
    p.fill('#ef9475');
    p.ellipse(11, 5, 8, 4);

    if (this.eyeOpenness < .11) {
      p.stroke('#55363e');
      p.strokeWeight(1.6);
      p.noFill();
      p.arc(10, -6, 12, 7, 0, Math.PI);
    } else {
      const eye = Math.min(this.eyeOpenness, 1.3);
      p.fill('#fffaf0');
      p.ellipse(10, -7, 15, 16 * eye);
      p.fill('#302338');
      p.ellipse(12.4, -7, 7, 8 * eye);
      p.fill('#fffaf0');
      p.ellipse(14, -9, 2.1, 2.1 * eye);
    }

    p.stroke('#a85835');
    p.strokeWeight(1);
    p.fill('#ffac45');
    p.ellipse(18.5, 3 + this.panic * 2.7, 12, 6 + this.panic * 6.5);
    if (this.panic > .15) {
      p.noStroke();
      p.fill('#652f37');
      p.ellipse(20, 4 + this.panic * 2, 7, this.panic * 6);
    }
    p.stroke('#a85835');
    p.fill('#ffd477');
    p.ellipse(19, 1.5, 12, 5);
    p.pop();
  }

  accelerateFall() { this.vy += 5; }
  isOutOfBounds()  { return this.y + this.h / 2 >= CONFIG.HEIGHT - CONFIG.GROUND_HEIGHT; }
  reset() {
    this.y = 0;
    this.vy = 0;
    this.wingPhase = 0;
    this.calmFrames = 0;
    this.alarmFrames = 0;
    this.eyeOpenness = 1;
    this.panic = 0;
    this.nod = 0;
  }

  get top()    { return this.y - this.h / 2; }
  get bottom() { return this.y + this.h / 2; }
  get front()  { return this.x + this.w / 2; }
  get back()   { return this.x - this.w / 2; }
}
