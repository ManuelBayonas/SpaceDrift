export class Nebula {

  render(pg) {

    pg.loadPixels();

    for (let y = 0; y < pg.height; y++) {
      for (let x = 0; x < pg.width; x++) {
      const n = noise(x * 0.002, y * 0.002);
      const c = color(
        40 + 120 * n,
        30 + 60 * n,
        90 + 140 * n
      );
      pg.set(x, y, c);
    }
}

    pg.updatePixels();
  }
}
