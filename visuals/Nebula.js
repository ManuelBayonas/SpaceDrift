export class Nebula {

  render(pg) {

    pg.loadPixels();

    for (let y = 0; y < pg.height; y++) {
      for (let x = 0; x < pg.width; x++) {

        const n = noise(x * 0.002, y * 0.002);
        const v = pow(n, 2.2);

        const r = 40  + 160 * v;
        const g = 20  +  60 * v;
        const b = 90  + 140 * v;

        const i = 4 * (y * pg.width + x);
        pg.pixels[i + 0] = r;
        pg.pixels[i + 1] = g;
        pg.pixels[i + 2] = b;
        pg.pixels[i + 3] = 255;
      }
    }

    pg.updatePixels();
  }
}
