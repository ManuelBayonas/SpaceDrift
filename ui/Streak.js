export class Streak {

  constructor() {
    this.reset();
  }

  reset() {
    this.pos = createVector(-50, random(height));
    this.vel = createVector(random(1, 2), random(-0.1, 0.1));
    this.len = random(200, 350);
    this.alpha = random(80, 140);
  }

  update() {
    this.pos.add(this.vel);
    this.alpha -= 0.1;
    if (this.pos.x > width + 60 || this.alpha <= 0) this.reset();
  }

  display() {
    stroke(255, this.alpha);
    line(
      this.pos.x,
      this.pos.y,
      this.pos.x - this.vel.x * this.len,
      this.pos.y - this.vel.y * this.len
    );
  }
}
