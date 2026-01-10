export class Target {

  constructor(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
  }

  reached(ship) {
    return p5.Vector.dist(this.pos, ship.pos) < this.r;
  }

  display() {
    noFill();
    stroke(255);
    ellipse(this.pos.x, this.pos.y, this.r * 2);
    ellipse(this.pos.x, this.pos.y, this.r * 1.2);
  }
}
