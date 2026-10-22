const COURT_MIN_X = 0;
const COURT_MAX_X = 200;
const CAMERA_DEAD_ZONE = 8;
const LOOK_AHEAD_SECONDS = .2;
const SIMULATION_TICKS_PER_SECOND = 60;
const MAX_LOOK_AHEAD = 12;
const FOLLOW_RATE = 4.4;
const MAX_CAMERA_SPEED = 48;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

/** Ease a court camera toward the predicted ball position without turnover snaps. */
export function updateCameraX(cameraX, ball, deltaSeconds, zoom = 100) {
 const current = clamp(Number.isFinite(cameraX) ? cameraX : 100, COURT_MIN_X, COURT_MAX_X);
 const x = Number.isFinite(ball?.x) ? clamp(ball.x, COURT_MIN_X, COURT_MAX_X) : current;
 const vx = Number.isFinite(ball?.vx) ? ball.vx : 0;
 const lead = clamp(vx * SIMULATION_TICKS_PER_SECOND * LOOK_AHEAD_SECONDS, -MAX_LOOK_AHEAD, MAX_LOOK_AHEAD);
 const predicted = clamp(x + lead, COURT_MIN_X, COURT_MAX_X);
 const offset = predicted - current;
 if (Math.abs(offset) <= CAMERA_DEAD_ZONE) return current;

 const target = predicted - Math.sign(offset) * CAMERA_DEAD_ZONE;
 const elapsed = clamp(Number.isFinite(deltaSeconds) ? deltaSeconds : 0, 0, .1);
 const magnification = clamp(Number.isFinite(zoom) ? zoom / 100 : 1, .5, 2);
 const eased = (target - current) * (1 - Math.exp(-FOLLOW_RATE * elapsed));
 const maxStep = MAX_CAMERA_SPEED * elapsed / magnification;
 return clamp(current + clamp(eased, -maxStep, maxStep), COURT_MIN_X, COURT_MAX_X);
}
