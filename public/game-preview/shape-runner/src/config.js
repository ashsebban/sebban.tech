export const W = 400, H = 600;
export const LAYERS = 8;
export const LAYER_H = H / LAYERS;
export const PLAYER_X = 80;
export const PLAYER_SIZE = 38;
export const WALL_WIDTH = 48;
export const WALL_SPEED_BASE = 2.15;
export const WALL_SPEED_GROWTH = 0.07;
export const RESPAWN_DELAY_FRAMES = 12;
export const GRAVITY = 0.55;
export const JUMP_FORCE = -10;
export const BLACK_CHANCE = 0;
export const INTRO_STORAGE_KEY = 'shape-runner-intro-hidden-v1';
export const COUNTDOWN_FRAMES = 180;

export const PLAYER_MODE = { CIRCLE: 0, SQUARE: 1, TRIANGLE: 2 };
export const OBSTACLE_TYPE = { CIRCLE_BLOCKER: 0, SQUARE_BLOCKER: 1, TRIANGLE_BLOCKER: 2 };
export const MODE_ORDER = [PLAYER_MODE.CIRCLE, PLAYER_MODE.SQUARE, PLAYER_MODE.TRIANGLE];

export const COLORS = {
  green: [30, 180, 60],
  blue:  [50, 80, 220],
  red:   [210, 40, 40],
  black: [0, 0, 0],
};

export const BLOCK_RULES = {
  [OBSTACLE_TYPE.CIRCLE_BLOCKER]:   { circle: true,  square: false, triangle: false },
  [OBSTACLE_TYPE.SQUARE_BLOCKER]:   { circle: false, square: true,  triangle: false },
  [OBSTACLE_TYPE.TRIANGLE_BLOCKER]: { circle: false, square: false, triangle: true  },
};

export function modeColor(mode) {
  if (mode === PLAYER_MODE.CIRCLE)   return COLORS.green;
  if (mode === PLAYER_MODE.SQUARE)   return COLORS.blue;
  return COLORS.red;
}

export function modeToObstacleType(mode) {
  if (mode === PLAYER_MODE.CIRCLE) return OBSTACLE_TYPE.CIRCLE_BLOCKER;
  if (mode === PLAYER_MODE.SQUARE) return OBSTACLE_TYPE.SQUARE_BLOCKER;
  return OBSTACLE_TYPE.TRIANGLE_BLOCKER;
}
