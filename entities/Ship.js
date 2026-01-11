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

  display(isThrusting = false) {
  const angle = this.vel.heading();

  push();
  pushStyle();

  translate(this.pos.x, this.pos.y);
  rotate(angle);

  noStroke();
  fill(255);

  // Cuerpo
  triangle(
    -this.size * 0.8, -this.size * 0.8,
     this.size * 0.8,  0,
    -this.size * 0.8,  this.size * 0.8
  );

  // Nariz
  triangle(
    -this.size * 0.2, -this.size * 0.45,
     this.size * 1.1,  0,
    -this.size * 0.2,  this.size * 0.45
  );

  // --------------------
  // ESTELA DE THRUST
  // --------------------
  if (isThrusting) {
    stroke(255, 120);
    strokeWeight(1);
    line(
      -this.size * 0.9, 0,
      -this.size * (1.4 + random(0.3)), 0
    );
  }

  popStyle();
  pop();
}


  outOfBounds(w, h) {
    return this.pos.x < 0 || this.pos.x > w ||
           this.pos.y < 0 || this.pos.y > h;
  }
}
