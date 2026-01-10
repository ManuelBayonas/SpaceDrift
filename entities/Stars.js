export class Star {

  constructor() {
    this.x = random(width);
    this.y = random(height);
    this.phase = random(1000);
    this.size = random(1, 2);
  }

  update() {
    this.phase += 0.02;
  }

  display() {
    const b = map(noise(this.phase), 0, 1, 40, 160);
    noStroke();
    fill(255, b);
    ellipse(this.x, this.y, this.size);
  }
}
