export class Ship {

  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector();
    this.acc = createVector();

    this.maxSpeed = 6;
    this.size = 12;
  }

  applyForce(f) {
    this.acc.add(f);
  }

  thrust(dir) {
    dir.normalize().mult(0.03);
    this.acc.add(dir);
  }

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading());
    fill(255);
    noStroke();

    triangle(-10, -8, 10, 0, -10, 8);
    pop();
  }

  outOfBounds(w, h) {
    return this.pos.x < 0 || this.pos.x > w ||
           this.pos.y < 0 || this.pos.y > h;
  }
}
