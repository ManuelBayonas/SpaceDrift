export class HUD {

  display(globalScore, currentScore, corrections) {
    fill(255);
    noStroke();
    textAlign(LEFT, TOP);
    textSize(16);

    text(`Global: ${globalScore}`, 20, 20);
    text(`Current: ${currentScore}`, 20, 42);
    text(`Corrections: ${corrections}`, 20, 64);
  }

  drawStart() {
    textAlign(CENTER, CENTER);
    textSize(48);
    text("SPACE DRIFT", width / 2, height / 3);
    textSize(16);
    text("Tap or press any key to start", width / 2, height / 2);
  }

  drawMessage(msg) {
    textAlign(CENTER, CENTER);
    textSize(24);
    text(msg, width / 2, 30);
  }

  drawPause() {
    fill(0, 160);
    rect(0, 0, width, height);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("PAUSED", width / 2, height / 2);
  }
}
