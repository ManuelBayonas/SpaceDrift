export class GravityWell {
  constructor(x, y, mass, radius) {
    this.pos = createVector(x, y);
    this.mass = mass;
    this.radius = radius;
    this.sprite = this.generateSprite();
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

  generateSprite() {
  const d = int(this.radius * 2.4);
  const pg = createGraphics(d, d);

  pg.noStroke();
  const noiseScale = 0.08;
  const offset = random(1000);

  for (let y = 0; y < d; y++) {
    for (let x = 0; x < d; x++) {
      const dx = x - d / 2;
      const dy = y - d / 2;
      const dist = sqrt(dx * dx + dy * dy);

      if (dist < this.radius) {
        const n = noise(x * noiseScale + offset,
                        y * noiseScale + offset);
        const shade = map(n, 0, 1, 180, 230);
        pg.fill(shade);
        pg.rect(x, y, 1, 1);
      }
    }
  }

  return pg;
}
  
 display(ship) {

  // Distancia nave ↔ pozo gravitatorio
  const d = p5.Vector.dist(this.pos, ship.pos);

  // Parámetros visuales del campo
  const visualRadius = this.radius * 6;
  const fadeStart = visualRadius * 0.8;

  // Intensidad del campo según distancia
  let influence = map(d, fadeStart, this.radius, 0, 1);
  influence = constrain(influence, 0, 1);

  // --------------------
  // CAMPO GRAVITATORIO
  // --------------------
  if (influence > 0) {
    noFill();
    stroke(200, 120 * influence);
    strokeWeight(1 + 2 * influence);
    ellipse(
      this.pos.x,
      this.pos.y,
      visualRadius * 2,
      visualRadius * 2
    );
  }

  // --------------------
  // PLANETA (núcleo)
  // --------------------
  imageMode(CENTER);
  image(this.sprite, this.pos.x, this.pos.y);
  imageMode(CORNER);
}



}
