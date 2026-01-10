export class GravityWell {
  constructor(x, y, mass, radius) {
    this.pos = createVector(x, y);
    this.mass = mass;
    this.radius = radius;
  }

  attract(ship) {
    let force = p5.Vector.sub(this.pos, ship.pos);
    let d = constrain(force.mag(), 25, 300);
    force.normalize();
    let strength = this.mass / (d * d);
    force.mult(strength);
    return force;
  }

  collides(ship) {
    return p5.Vector.dist(this.pos, ship.pos) < this.radius + ship.size * 0.4;
  }

  display(ship) {
    noFill();
    stroke(200, 120);
    ellipse(this.pos.x, this.pos.y, this.radius * 6);
    fill(180);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius * 2);
  }
}
