import { LOGICAL_W, LOGICAL_H, gameScale, offsetX, offsetY } from "../sketch.js";

export class InputManager {

  constructor() {
    this.dir = createVector(0, 0);
    this.thrusting = false;

    window.addEventListener("keydown", e => this.onKey(e, true));
    window.addEventListener("keyup",   e => this.onKey(e, false));

    window.addEventListener("touchstart", e => this.onTouch(e));
    window.addEventListener("touchmove",  e => this.onTouch(e));
    window.addEventListener("touchend",   () => this.reset());
  }

  onKey(e, down) {
    switch (e.code) {
      case "ArrowUp":    this.dir.y = down ? -1 : 0; break;
      case "ArrowDown":  this.dir.y = down ?  1 : 0; break;
      case "ArrowLeft":  this.dir.x = down ? -1 : 0; break;
      case "ArrowRight": this.dir.x = down ?  1 : 0; break;
    }
    this.thrusting = this.dir.mag() > 0;
  }

  onTouch(e) {
    const t = e.touches[0];
    if (!t) return;

    const x = (t.clientX - offsetX) / gameScale;
    const y = (t.clientY - offsetY) / gameScale;

    this.dir.x = constrain((x - LOGICAL_W / 2) / (LOGICAL_W / 2), -1, 1);
    this.dir.y = constrain((y - LOGICAL_H / 2) / (LOGICAL_H / 2), -1, 1);

    this.thrusting = true;
  }

  reset() {
    this.dir.set(0, 0);
    this.thrusting = false;
  }

  isThrusting() {
    return this.thrusting;
  }

  getDirection() {
    return this.dir.copy();
  }
}
