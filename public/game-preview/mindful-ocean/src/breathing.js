import { BREATH_PHASES, CONFIG, PHASE } from './config.js';

const totalMs = BREATH_PHASES.length * CONFIG.breathPhaseMs * CONFIG.breathRounds;

export class BreathingEngine {
  constructor() {
    this.reset();
  }

  reset() {
    this.elapsedMs = 0;
  }

  update(dt, onExhale) {
    const previousPhase = Math.floor(this.elapsedMs / CONFIG.breathPhaseMs);
    this.elapsedMs = Math.min(totalMs, this.elapsedMs + dt);
    const currentPhase = Math.floor(this.elapsedMs / CONFIG.breathPhaseMs);
    for (let index = previousPhase + 1; index <= currentPhase; index++) {
      if (BREATH_PHASES[index % BREATH_PHASES.length] === PHASE.EXHALE) onExhale();
    }
    return this.remaining === 0;
  }

  get phase() {
    const index = Math.floor(this.elapsedMs / CONFIG.breathPhaseMs);
    return this.remaining ? BREATH_PHASES[index % BREATH_PHASES.length] : PHASE.HOLD_EMPTY;
  }

  get remaining() {
    return totalMs - this.elapsedMs;
  }

  get phaseRemaining() {
    if (!this.remaining) return 0;
    return CONFIG.breathPhaseMs - (this.elapsedMs % CONFIG.breathPhaseMs);
  }

  get phaseProgress() {
    return 1 - this.phaseRemaining / CONFIG.breathPhaseMs;
  }
}
