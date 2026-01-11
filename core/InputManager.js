export class InputManager {

  constructor() {
    this.thrusting = false;
    this.dir = createVector(0, 0);

    this.initKeyboard();
    this.initTouch();
  }

  /* -------------------------
     TECLADO
  ------------------------- */
  initKeyboard() {
    window.addEventListener("keydown", e => this.onKey(e, true));
    window.addEventListener("keyup",   e => this.onKey(e, false));
  }

  onKey(e, pressed) {
    switch (e.code) {
      case "ArrowUp":    this.dir.y = pressed ? -1 : 0; break;
      case "ArrowDown":  this.dir.y = pressed ?  1 : 0; break;
      case "ArrowLeft":  this.dir.x = pressed ? -1 : 0; break;
      case "ArrowRight": this.dir.x = pressed ?  1 : 0; break;
    }
    this.thrusting = this.dir.mag() > 0;
  }

  /* -------------------------
     TĆCTIL (mĆ³vil)
  ------------------------- */
  initTouch() {
    window.addEventListener("touchstart", e => this.onTouch(e));
    window.addEventListener("touchmove",  e => this.onTouch(e));
    window.addEventListener("touchend",   () => this.reset());
  }

  onTouch(e) {
    const t = e.touches[0];
    if (!t) return;

    const cx = width / 2;
    const cy = height / 2;

    this.dir.x = constrain((t.clientX - cx) / cx, -1, 1);
    this.dir.y = constrain((t.clientY - cy) / cy, -1, 1);

    this.thrusting = true;
  }

  reset() {
    this.dir.set(0, 0);
    this.thrusting = false;
  }

  /* -------------------------
     API pĆŗblica
  ------------------------- */
  update() {}

  isThrusting() {
    return this.thrusting;
  }

  getDirection() {
    return this.dir.copy();
  }
}
