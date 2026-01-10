export class GravityWell {

  constructor(x, y, mass, radius) {
    this.pos = createVector(x, y);
    this.mass = mass;
    this.radius = radius;
    this.G = 1;
  }

  attract(ship) {
    const force = p5.Vector.sub(this.pos, ship.pos);
    let d = constrain(force.mag(), 25, 300);
    force.normalize();
    force.mult((this.G * this.mass) / (d * d));
    return force;
  }

  display(ship) {
    const d = p5.Vector.dist(this.pos, ship.pos);
    const alpha = map(d, 300, this.radius, 0, 120, true);

    noFill();
    stroke(200, alpha);
    ellipse(this.pos.x, this.pos.y, this.radius * 8);
    fill(180);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
