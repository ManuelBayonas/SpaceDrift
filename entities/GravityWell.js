export class GravityWell {

  constructor(x, y, mass, radius) {
    this.pos = createVector(x, y);
    this.mass = mass;
    this.radius = radius;
    this.baseColor = color(
      random(160, 220),
      random(160, 220),
      random(160, 220)
    );
    this.sprite = this.generateSprite();
  }

  // --------------------------------------------------
  // FUERZA DE ATRACCIÓN
  // --------------------------------------------------
  attract(ship) {
    const force = p5.Vector.sub(this.pos, ship.pos);
    let d = force.mag();

    // Limitar distancia para evitar fuerzas extremas
    d = constrain(d, 25, 300);

    force.normalize();

    // Constante gravitatoria implícita (ajuste de diseño)
    const strength = this.mass / (d * d);
    force.mult(strength);

    return force;
  }

  // --------------------------------------------------
  // COLISIÓN
  // --------------------------------------------------
  collides(ship) {
    return p5.Vector.dist(this.pos, ship.pos) <
           this.radius + ship.size * 0.4;
  }

  // --------------------------------------------------
  // SPRITE PROCEDURAL
  // --------------------------------------------------
  generateSprite() {
    const d = int(this.radius * 2.4);
    const pg = createGraphics(d, d);

    pg.pixelDensity(1);
    pg.beginDraw();
    pg.noStroke();

    const noiseScale = 0.08;
    const offset = random(1000);

    for (let y = 0; y < d; y++) {
      for (let x = 0; x < d; x++) {

        const dx = x - d / 2;
        const dy = y - d / 2;
        const dist = sqrt(dx * dx + dy * dy);

        if (dist < this.radius) {
          const n = noise(
            x * noiseScale + offset,
            y * noiseScale + offset
          );

          const shade = map(n, 0, 1, 0.8, 1.1);

            pg.fill(
              red(this.baseColor)   * shade,
              green(this.baseColor) * shade,
              blue(this.baseColor)  * shade
            );
          }
      }
    }

    pg.endDraw();
    return pg;
  }

  // --------------------------------------------------
  // DIBUJO
  // --------------------------------------------------
  display(ship) {

    const d = p5.Vector.dist(this.pos, ship.pos);

    const visualRadius = this.radius * 6;
    const fadeStart = visualRadius * 0.8;

    let influence = map(d, fadeStart, this.radius, 0, 1);
    influence = constrain(influence, 0, 1);

    // Campo gravitatorio (solo cuando tiene sentido)
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

    // Planeta (núcleo)
    imageMode(CENTER);
    image(this.sprite, this.pos.x, this.pos.y);
    imageMode(CORNER);
  }
}
