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
  let basePower = 0.02;
  const speedFactor = map(
    this.vel.mag(),
    0,
    this.maxSpeed,
    1.0,
    0.3
  );
  const finalPower = basePower * constrain(speedFactor, 0.3, 1.0);
  dir = dir.copy().normalize().mult(finalPower);
  this.acc.add(dir);
}

  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    if (!this.isThrusting && this.acc.mag() < 0.001) {
  this.vel.mult(0.995);
}
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
